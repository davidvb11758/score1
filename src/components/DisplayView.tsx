import type { ScoreboardState } from "../types";

type DisplayViewProps = {
  state: ScoreboardState;
  connected: boolean;
};

function formatClock(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function DisplayView({ state, connected }: DisplayViewProps) {
  return (
    <main className="tv-display-page">
      <section className="tv-score-grid">
        <article className="tv-team-block tv-team-home">
          <h2>My team name</h2>
          <p>{state.homeScore}</p>
        </article>
        <article className="tv-team-block tv-team-other">
          <h2>Other team name</h2>
          <p>{state.visitorScore}</p>
        </article>
      </section>

      <section className="tv-clock-wrap">
        <p>{formatClock(state.clockSecondsRemaining)}</p>
      </section>

      <span className={connected ? "status-ok tv-connection" : "status-bad tv-connection"}>
        {connected ? "Connected" : "Disconnected"}
      </span>
    </main>
  );
}
