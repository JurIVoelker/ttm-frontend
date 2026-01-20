type Lineup = {
  id: string;
  fullName: string;
};

type Availability = "AVAILABLE" | "UNAVAILABLE" | "UNKNOWN" | "NOT_RESPONDED";

type MatchAvailabilityVote = {
  playerId: string;
  matchId: string;
  availability: Availability;
};

type MatchType = "CUP" | "REGULAR";

type Location = {
  id: string;
  matchId: string;
  hallName: string;
  streetAddress: string;
  city: string;
};

export type MatchesDTO = {
  location: Location | null;
  lineup: Lineup[];
  matchAvailabilityVotes: MatchAvailabilityVote[];
  teamSlug: string;
  type: MatchType;
  id: string;
  time: Date;
  enemyName: string;
  isHomeGame: boolean;
}[];

export type SingleMatchDTO = {
  location: Location | null;
  teamSlug: string;
  type: MatchType;
  id: string;
  time: Date;
  enemyName: string;
  isHomeGame: boolean;
};

export type MatchDTO = MatchesDTO[number];
