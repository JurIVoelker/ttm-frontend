import { API_URL } from "@/config";
import {
  ADMIN_LEADER_REFRESH_ERROR,
  COULD_NOT_FETCH_PLAYERS_BY_INVITE_TOKEN,
  COULD_NOT_RENEW_JWT,
  JWT_MISSING_ERROR,
  PLAYER_JWT_RENEW_ERROR,
} from "@/constants/error";
import { authStore } from "@/store/auth-store";
import { jwtPayload } from "@/types/auth";
import { decode } from "jsonwebtoken";
import { formatDistanceStrict } from "date-fns";
import { showMessage } from "./message";
import { PlayersOfTeamDTO } from "@/types/player";

interface RequestParams {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  options?: {
    renewJwt?: boolean;
    headers?: Record<string, string>;
    hideMessages?: boolean;
  };
}

export const sendRequest = async ({
  path,
  method,
  body,
  options,
}: RequestParams) => {
  let jwt = authStore.getState().jwt || "";
  const jwtPayload = decode(jwt) as jwtPayload;

  const shouldRenewJwt = options?.renewJwt ?? true;
  const hideMessages = options?.hideMessages ?? false;

  if (!jwtPayload || !jwtPayload?.exp) {
    throw new Error("Invalid JWT token");
  }

  if (shouldRenewJwt && jwtPayload?.exp < Date.now() / 1000 + 5) {
    console.log(
      `JWT expired since ${formatDistanceStrict(new Date(jwtPayload.exp * 1000), new Date())}, renewing...`,
    );
    jwt = await renewJwt();
  }

  if (!jwt) {
    throw new Error(COULD_NOT_RENEW_JWT);
  }

  console.log(`-> [${method}] ${path}`);
  const response = await fetch(API_URL + path, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
      Authorization: jwt ? `Bearer ${jwt}` : "",
      ...options?.headers,
    },
    credentials: "include",
  });

  console.log(`<- [${method}] ${path} - Status ${response.status}`);

  if (hideMessages) return response

  if (response.status === 403) {
    showMessage("Du hast keine Berechtigung, diese Aktion durchzuführen.", {
      variant: "error",
    });
  } else if (response.status === 401) {
    showMessage("Authentifizierung fehlgeschlagen. Bitte versuche es erneut.", {
      variant: "error",
    });
  } else if (!response.ok) {
    showMessage(
      `Ein unbekannter Fehler ist aufgetreten (${response.status}). Bitte versuche es erneut.`,
      { variant: "error" },
    );
  }

  return response;
};

export const renewJwt = async () => {
  const jwt = authStore.getState().jwt;
  const inviteToken = authStore.getState().inviteToken;

  if (!jwt) throw new Error(JWT_MISSING_ERROR);

  const { roles, player } = decode(jwt || "") as jwtPayload;

  if (roles.includes("admin") || roles.includes("leader")) {
    const response = await sendRequest({
      path: "/api/auth/refresh",
      method: "POST",
      options: { renewJwt: false },
    });

    if (!response.ok) throw new Error(ADMIN_LEADER_REFRESH_ERROR);
    const data = await response.json();

    authStore.getState().setJwt(data.jwt);
    return data.jwt as string;
  }

  if (!roles.includes("player") || !inviteToken || !player?.id) {
    throw new Error(PLAYER_JWT_RENEW_ERROR);
  }

  const response = await sendRequest({
    path: "/api/auth/team/join",
    method: "POST",
    body: { inviteToken, playerId: player.id },
    options: { renewJwt: false },
  });

  if (!response.ok) throw new Error(PLAYER_JWT_RENEW_ERROR);

  const data = await response.json();

  authStore.getState().setJwt(data.jwt);

  return data.jwt as string;
};

export const fetchPlayersWithInviteToken = async (
  inviteToken: string,
  teamSlug: string,
) => {
  const response = await fetch(
    API_URL + `/api/auth/inviteToken/players/${teamSlug}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${inviteToken}`,
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    showMessage(
      "Fehler beim Laden der Spieler: Authentifizierung fehlgeschlagen",
      { variant: "error" },
    );
    throw new Error(COULD_NOT_FETCH_PLAYERS_BY_INVITE_TOKEN);
  }

  authStore.getState().setInviteToken(inviteToken);

  const data = (await response.json()) as PlayersOfTeamDTO[];
  return data;
};

export const loginPlayer = async (playerId: string) => {
  const auth = authStore.getState();
  const { inviteToken, jwt } = auth;

  const response = await fetch(
    API_URL + `/api/auth/team/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ inviteToken, playerId }),
      credentials: "include",
    },
  );

  if (!response.ok) {
    showMessage(
      "Fehler beim Einloggen: Authentifizierung fehlgeschlagen. Bitte versuche es erneut.",
      { variant: "error" },
    );
    return;
  }

  const data = await response.json() as { jwt: string };

  auth.setJwt(data.jwt);
  return data.jwt;
};