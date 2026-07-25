import styles from "./users-list.module.scss";

export interface UsersListProps {
  listName?: string;
  users?: {
    thumbnail: string;
    name: string;
    userId?: string;
  }[];
  onProfileClick?: (userId: string, rect: DOMRect) => void;
}

const DEFAULT_MEMBERS = [
  { thumbnail: "/bot-icon.svg", name: "GeoBot", userId: "geobot" },
  { thumbnail: "/anonymous-icon.svg", name: "Anonymous", userId: "anonymous" },
];

export const UsersList = ({ listName, users, onProfileClick }: UsersListProps) => {
  const extraMembers = users?.length ? users : DEFAULT_MEMBERS;
  const totalOnline = 1 + extraMembers.length;

  const handleClick = (userId: string) => (event: React.MouseEvent<HTMLElement>) => {
    onProfileClick?.(userId, event.currentTarget.getBoundingClientRect());
  };

  return (
    <div className={styles.container}>
      <div className={styles.listName}>{listName ?? `Online - ${totalOnline}`}</div>
      <div>
        <ul className={styles.list}>
          <li onClick={handleClick("geo")}>
            <div
              className={styles.thumbnail}
              style={{ backgroundImage: `url(/totoro-profile.jpg)` }}
            ></div>
            <span>{"Geo"}</span>
            <svg
              aria-label="Server Owner"
              className={styles.crown}
              aria-hidden="false"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M5 18a1 1 0 0 0-1 1 3 3 0 0 0 3 3h10a3 3 0 0 0 3-3 1 1 0 0 0-1-1H5ZM3.04 7.76a1 1 0 0 0-1.52 1.15l2.25 6.42a1 1 0 0 0 .94.67h14.55a1 1 0 0 0 .95-.71l1.94-6.45a1 1 0 0 0-1.55-1.1l-4.11 3-3.55-5.33.82-.82a.83.83 0 0 0 0-1.18l-1.17-1.17a.83.83 0 0 0-1.18 0l-1.17 1.17a.83.83 0 0 0 0 1.18l.82.82-3.61 5.42-4.41-3.07Z"
              ></path>
            </svg>
          </li>
          {extraMembers.map((user, index) => {
            return (
              <li
                key={`user-${index}`}
                onClick={user.userId ? handleClick(user.userId) : undefined}
              >
                <div
                  className={styles.thumbnail}
                  style={{ backgroundImage: `url(${user.thumbnail})` }}
                ></div>
                <span>{user.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
