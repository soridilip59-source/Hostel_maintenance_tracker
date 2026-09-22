const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const displayName = (user = {}) => {
  if (user?.name) return user.name;
  if (user?.email) return user.email.split("@")[0];
  return "User";
};

export const getAvatarSource = (user = {}) => {
  const source = user?.profileImage || user?.picture || user?.image || "";
  if (!source || typeof source !== "string") return "";
  if (/@gmail\.com|@.*\.com|email/i.test(source)) return "";
  return source;
};

export default function UserAvatar({ user = {}, className = "", size = "md", alt = "User avatar" }) {
  const source = getAvatarSource(user);
  const name = displayName(user);
  const initials = getInitials(name);

  if (source) {
    return (
      <img
        className={`user-avatar user-avatar-image ${className}`.trim()}
        src={source}
        alt={alt || name}
        referrerPolicy="no-referrer"
        loading="lazy"
        style={{ width: size === "lg" ? 52 : size === "sm" ? 32 : 40, height: size === "lg" ? 52 : size === "sm" ? 32 : 40 }}
      />
    );
  }

  return (
    <div
      className={`user-avatar user-avatar-initials ${className}`.trim()}
      aria-label={name}
      title={name}
      style={{ width: size === "lg" ? 52 : size === "sm" ? 32 : 40, height: size === "lg" ? 52 : size === "sm" ? 32 : 40 }}
    >
      {initials}
    </div>
  );
}
