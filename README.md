This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Media assets

`src/data/assets.json` holds the intrinsic width, height and aspect ratio of
every file under `public/`. The image and video components read it to reserve
the exact box a picture will fill and shimmer a skeleton in it while the file
downloads, so nothing on the page shifts when it arrives.

After adding, replacing or deleting anything in `public/`, regenerate it:

```bash
npm run assets
```

A message's `video` can be either a YouTube/Vimeo URL or a path to a file in
`public/` (`/videos/foo.mp4`). Embeds have no file to measure — they're all
16:9, which lives in the `defaults.video` entry. Self-hosted `.mp4`/`.webm`/
`.mov` files are measured like images and land under `videos`, so they render
in a native `<video>` at their own aspect ratio instead of a letterboxed 16:9.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
