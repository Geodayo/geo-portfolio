// Regenerates src/data/assets.json — the intrinsic width/height/aspect ratio
// of every image under public/, keyed by the public URL the app references it
// by ("/images/foo.png"). The skeleton loaders read this to reserve the exact
// box a picture will occupy before it has downloaded, so nothing shifts when
// it lands.
//
// Run it after adding or replacing anything in public/:
//   npm run assets
//
// Dimensions are parsed straight out of the file headers (no dependencies) —
// enough of each container format to find the size field and nothing more.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(scriptDir, "..");
const publicDir = join(projectRoot, "public");
const outFile = join(projectRoot, "src", "data", "assets.json");

// Every video is an embed (YouTube/Vimeo), so there's no file to measure —
// they're all 16:9 and the player fills whatever box we give it.
const VIDEO_DEFAULT = { width: 1920, height: 1080 };

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".jfif",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
]);

/** PNG: IHDR is always the first chunk, width/height are big-endian at 16/20. */
function pngSize(buf) {
  if (buf.length < 24) return null;
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** GIF: logical screen descriptor, little-endian, right after the header. */
function gifSize(buf) {
  if (buf.length < 10) return null;
  if (buf.toString("ascii", 0, 3) !== "GIF") return null;
  return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
}

/**
 * JPEG (including .jfif): walk the marker segments until a start-of-frame
 * (SOFn) turns up — that's the only one carrying the real dimensions.
 */
function jpegSize(buf) {
  if (buf.length < 4 || buf.readUInt16BE(0) !== 0xffd8) return null;

  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) {
      offset += 1; // resync on padding between segments
      continue;
    }
    const marker = buf[offset + 1];
    // Standalone markers: no length field, nothing to skip.
    if (marker === 0xff || (marker >= 0xd0 && marker <= 0xd9)) {
      offset += 2;
      continue;
    }
    const length = buf.readUInt16BE(offset + 2);
    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 && // DHT
      marker !== 0xc8 && // JPG extension
      marker !== 0xcc; // DAC
    if (isStartOfFrame) {
      return {
        height: buf.readUInt16BE(offset + 5),
        width: buf.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  return null;
}

/** WebP: three sub-formats, each storing the size in its own packed layout. */
function webpSize(buf) {
  if (buf.length < 30) return null;
  if (buf.toString("ascii", 0, 4) !== "RIFF") return null;
  if (buf.toString("ascii", 8, 12) !== "WEBP") return null;

  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return {
      width: buf.readUInt16LE(26) & 0x3fff,
      height: buf.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  if (chunk === "VP8X") {
    return {
      width: buf.readUIntLE(24, 3) + 1,
      height: buf.readUIntLE(27, 3) + 1,
    };
  }
  return null;
}

/** SVG: explicit width/height attributes if present, otherwise the viewBox. */
function svgSize(buf) {
  const head = buf.toString("utf8", 0, Math.min(buf.length, 4096));
  const tag = head.match(/<svg[^>]*>/i)?.[0];
  if (!tag) return null;

  const attr = (name) => {
    const value = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"))?.[1];
    const parsed = value ? parseFloat(value) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  };

  const width = attr("width");
  const height = attr("height");
  if (width && height) return { width, height };

  const viewBox = tag.match(/viewBox\s*=\s*["']([^"']+)["']/i)?.[1];
  if (viewBox) {
    const parts = viewBox.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      return { width: parts[2], height: parts[3] };
    }
  }
  return null;
}

function readSize(buf, ext) {
  switch (ext) {
    case ".png":
      return pngSize(buf);
    case ".gif":
      return gifSize(buf);
    case ".jpg":
    case ".jpeg":
    case ".jfif":
      return jpegSize(buf);
    case ".webp":
      return webpSize(buf);
    case ".svg":
      return svgSize(buf);
    default:
      // .avif and friends: no parser here, so they're reported as skipped
      // rather than silently written with bogus numbers.
      return null;
  }
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else if (entry.isFile()) {
      yield path;
    }
  }
}

function toAspectRatio(width, height) {
  return Math.round((width / height) * 10000) / 10000;
}

async function main() {
  const images = {};
  const skipped = [];

  for await (const path of walk(publicDir)) {
    const ext = extname(path).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;

    const url = `/${relative(publicDir, path).split(/[\\/]/).join("/")}`;
    const size = readSize(await readFile(path), ext);

    if (!size || !size.width || !size.height) {
      skipped.push(url);
      continue;
    }

    images[url] = {
      width: size.width,
      height: size.height,
      aspectRatio: toAspectRatio(size.width, size.height),
    };
  }

  const sorted = Object.fromEntries(
    Object.keys(images)
      .sort()
      .map((key) => [key, images[key]])
  );

  const output = {
    defaults: {
      video: {
        ...VIDEO_DEFAULT,
        aspectRatio: toAspectRatio(VIDEO_DEFAULT.width, VIDEO_DEFAULT.height),
      },
    },
    images: sorted,
  };

  await writeFile(outFile, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(
    `Wrote ${Object.keys(sorted).length} entries to ${relative(projectRoot, outFile)}`
  );
  if (skipped.length > 0) {
    console.warn(`Could not read dimensions for:\n  ${skipped.join("\n  ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
