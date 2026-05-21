export type TeamSide = "home" | "visitor";

export type ScoreboardState = {
  homeScore: number;
  visitorScore: number;
  homeTeamName: string;
  visitorTeamName: string;
  maxTimeoutsPerTeam: number;
  timeoutDurationSeconds: number;
  maxSetsWon: number;
  setNumber: number;
  homeTimeoutsTaken: number;
  visitorTimeoutsTaken: number;
  homeSetsWon: number;
  visitorSetsWon: number;
  clockSecondsRemaining: number;
  clockRunning: boolean;
  updatedAt: string;
};
