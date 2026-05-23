export type TeamSide = "home" | "visitor";

export type SetHistoryEntry = {
  setNumber: number;
  homeScore: number;
  visitorScore: number;
};

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
  setHistory: SetHistoryEntry[];
  clockSecondsRemaining: number;
  clockRunning: boolean;
  updatedAt: string;
};
