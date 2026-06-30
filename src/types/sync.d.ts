import { MatchDTO } from "./match"

export type SyncDTO = {
  missingMatches: TTApiMatch[],
  unequalHomeGameMatches: TTApiMatch[],
  unequalLocationMatches: TTApiMatch[],
  unequalLocationMatchesBefore: MatchDTO[],
  unequalTimeMatches: TTApiMatch[],
  unequalTimeMatchesBefore: MatchDTO[],
}

export type TTApiMatchesReturnType = {
  matches: {
    isDuplicate?: boolean;
    id: string;
    datetime: string;
    location: {
      id: string;
      name: string;
      address: {
        street: string;
        zip: string;
        city: string;
      };
      link: string;
    };
    league: {
      name: string;
      nickname: string;
      teamType: string;
    };
    teams: {
      home: {
        name: string;
        index: string;
        club: string;
      };
      away: {
        name: string;
        index: string;
        club: string;
      };
    };
    result: {
      homeScore: number;
      awayScore: number;
      winner: "home" | "away" | "draw";
    } | null;
    isHomeGame: boolean;
  }[];
  meta: {
    expiresAt: string;
  };
};

export type TTApiMatch = TTApiMatchesReturnType["matches"][number];

export type Settings = {
  id: string;
  includeRRSync: boolean;
  autoSync: boolean;
}

export type SyncTrigger = "AUTO" | "MANUAL";

export type SyncMatchDetail = {
  id: string;
  home: string;
  away: string;
  datetime: string;
  reason?: string;
};

export type SyncLogDetails = {
  successfulSyncs: SyncMatchDetail[];
  failedSyncs: SyncMatchDetail[];
  updatedMatches: SyncMatchDetail[];
};

export type SyncLogDTO = {
  id: string;
  createdAt: string;
  trigger: SyncTrigger;
  status: "COMPLETED" | "SKIPPED" | "FAILED";
  includeRRSync: boolean;
  autoSync: boolean;
  successfulSyncsCount: number;
  failedSyncsCount: number;
  updatedMatchesCount: number;
  details: SyncLogDetails | null;
  error: string | null;
};

export type SyncPlayersReturnType = {
  teamType: string;
  players: {
    name: string;
    QTTR: number;
    position: number;
    teamIndex: number;
  }[];
}[];