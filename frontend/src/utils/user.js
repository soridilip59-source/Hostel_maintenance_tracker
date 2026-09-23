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
