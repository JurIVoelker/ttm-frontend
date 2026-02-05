export type LeaderDTO = {
  team: {
    name: string;
    slug: string;
    groupIndex: number;
    type: $Enums.TeamType;
    inviteToken: string;
  }[];
} & {
  id: string;
  email: string;
  fullName: string;
}