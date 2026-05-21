export type TeamSide = "home" | "visitor";

export type ScoreboardState = {
  homeScore: number;
  visitorScore: number;
  homeTeamName: string;
  visitorTeamName: string;
  clockSecondsRemaining: number;
  clockRunning: boolean;
  updatedAt: string;
};
