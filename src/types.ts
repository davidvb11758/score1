export type TeamSide = "home" | "visitor";

export type ScoreboardState = {
  homeScore: number;
  visitorScore: number;
  clockSecondsRemaining: number;
  clockRunning: boolean;
  updatedAt: string;
};
