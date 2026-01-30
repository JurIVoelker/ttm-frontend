import { authStore } from "@/store/auth-store";
import { mainStore } from "@/store/main-store";

export const isLeader = () => {
  const jwtDecoded = authStore.getState().jwtDecoded;
  if (!jwtDecoded) return false;
  return jwtDecoded.roles.includes("leader");
};

export const isAdmin = () => {
  const jwtDecoded = authStore.getState().jwtDecoded;
  if (!jwtDecoded) return false;
  return jwtDecoded.roles.includes("admin");
};

export const isLeaderOfTeam = () => {
  const currentSlug = mainStore.getState().teamSlug;
  const jwtDecoded = authStore.getState().jwtDecoded;
  if (!jwtDecoded || !currentSlug) return false;

  return (
    jwtDecoded.roles.includes("leader") &&
    jwtDecoded.leader?.teams.includes(currentSlug)
  );
};

export const isPlayerOfTeam = () => {
  const currentSlug = mainStore.getState().teamSlug;
  const jwtDecoded = authStore.getState().jwtDecoded;
  if (!jwtDecoded || !currentSlug) return false;

  return (
    jwtDecoded.roles.includes("player") &&
    jwtDecoded.player?.teams.includes(currentSlug)
  );
};

export const isPlayer = () => {
  const jwtDecoded = authStore.getState().jwtDecoded;
  if (!jwtDecoded) return false;

  return (
    jwtDecoded.roles.includes("player")
  );
};
