import { useEffect, useState } from "react";
import type { ScoreboardState, TeamSide } from "../types";

type ControllerViewProps = {
  state: ScoreboardState;
  connected: boolean;
  onChangeScore: (side: TeamSide, delta: number) => void;
  onStartClock: () => void;
  onStopClock: () => void;
  onSetClock: (seconds: number) => void;
  onSetTimeoutAndStart: (seconds: number) => void;
  onSetTeamNames: (homeTeamName: string, visitorTeamName: string) => void;
};

const CLOCK_MINUTE_CHOICES = [1, 2, 3, 4, 6, 8, 10];
const TIMEOUT_SECONDS = [30, 60, 90];

function formatClock(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function TeamControls(props: {
  title: string;
  accentClassName: string;
  score: number;
  side: TeamSide;
  onChangeScore: (side: TeamSide, delta: number) => void;
  onTimeoutPress: (seconds: number) => void;
}) {
  const { title, accentClassName, score, side, onChangeScore, onTimeoutPress } = props;

  return (
    <article className={`team-panel ${accentClassName}`}>
      <div className="team-panel-top">
        <div className="team-stepper">
          <button className="team-stepper-button" onClick={() => onChangeScore(side, 1)}>
            +1
          </button>
          <button className="team-stepper-button" onClick={() => onChangeScore(side, -1)}>
            -1
          </button>
        </div>

        <div className="team-score-card">
          <h2>{title}</h2>
          <p>{score}</p>
        </div>
      </div>

      <div className="team-timeout-card">
        <h3>Timeout</h3>
        <div className="team-timeout-buttons">
          {TIMEOUT_SECONDS.map((seconds) => (
            <button key={seconds} onClick={() => onTimeoutPress(seconds)}>
              {seconds} sec
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ControllerView({
  state,
  connected,
  onChangeScore,
  onStartClock,
  onStopClock,
  onSetClock,
  onSetTimeoutAndStart,
  onSetTeamNames
}: ControllerViewProps) {
  const selectedMinutes = CLOCK_MINUTE_CHOICES.includes(state.clockSecondsRemaining / 60)
    ? state.clockSecondsRemaining / 60
    : 3;
  const [isConfigureModalOpen, setConfigureModalOpen] = useState(false);
  const [homeTeamNameInput, setHomeTeamNameInput] = useState(state.homeTeamName);
  const [visitorTeamNameInput, setVisitorTeamNameInput] = useState(state.visitorTeamName);

  useEffect(() => {
    if (isConfigureModalOpen) return;
    setHomeTeamNameInput(state.homeTeamName);
    setVisitorTeamNameInput(state.visitorTeamName);
  }, [isConfigureModalOpen, state.homeTeamName, state.visitorTeamName]);

  const openConfigureModal = () => {
    setHomeTeamNameInput(state.homeTeamName);
    setVisitorTeamNameInput(state.visitorTeamName);
    setConfigureModalOpen(true);
  };

  const closeConfigureModal = () => {
    setConfigureModalOpen(false);
  };

  const saveTeamNames = () => {
    onSetTeamNames(homeTeamNameInput.trim(), visitorTeamNameInput.trim());
    setConfigureModalOpen(false);
  };

  return (
    <main className="tablet-controller-page">
      <header className="tablet-top-row">
        <button className="text-link future-link" type="button" disabled>
          {state.homeTeamName}
        </button>
        <button className="text-link future-link" type="button" disabled>
          SWAP
        </button>
        <button className="text-link future-link" type="button" disabled>
          {state.visitorTeamName}
        </button>
        <button className="text-link configure-link" type="button" onClick={openConfigureModal}>
          Configure team names
        </button>
        <h1>Clock</h1>
        <span className={connected ? "status-ok connection-status" : "status-bad connection-status"}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </header>

      <section className="tablet-main-grid">
        <TeamControls
          title={state.homeTeamName}
          accentClassName="my-team-panel"
          score={state.homeScore}
          side="home"
          onChangeScore={onChangeScore}
          onTimeoutPress={onSetTimeoutAndStart}
        />
        <TeamControls
          title={state.visitorTeamName}
          accentClassName="other-team-panel"
          score={state.visitorScore}
          side="visitor"
          onChangeScore={onChangeScore}
          onTimeoutPress={onSetTimeoutAndStart}
        />

        <section className="clock-panel">
          <p className="clock-readout">{formatClock(state.clockSecondsRemaining)}</p>
          <div className="clock-controls-grid">
            <div className="clock-set-column">
              <button className="clock-set-label">Set Clock</button>
              <select
                value={selectedMinutes}
                onChange={(event) => onSetClock(Number(event.target.value) * 60)}
              >
                {CLOCK_MINUTE_CHOICES.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes} min
                  </option>
                ))}
              </select>
            </div>
            <div className="clock-run-column">
              <button onClick={onStartClock}>Start</button>
              <button onClick={onStopClock}>Stop</button>
            </div>
          </div>
        </section>
      </section>

      <section className="future-notes">
        <p>Reset to new game (future feature)</p>
        <p>Swap teams (future feature)</p>
        <p>Sport presets (future feature)</p>
      </section>

      {isConfigureModalOpen ? (
        <section className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Configure team names">
          <div className="modal-card">
            <h2>Configure team names</h2>
            <label className="modal-label">
              Team 1 name
              <input
                value={homeTeamNameInput}
                onChange={(event) => setHomeTeamNameInput(event.target.value.slice(0, 35))}
                maxLength={35}
                placeholder="My team name"
              />
            </label>
            <p className="modal-counter">{homeTeamNameInput.length}/35</p>

            <label className="modal-label">
              Team 2 name
              <input
                value={visitorTeamNameInput}
                onChange={(event) => setVisitorTeamNameInput(event.target.value.slice(0, 35))}
                maxLength={35}
                placeholder="Other team name"
              />
            </label>
            <p className="modal-counter">{visitorTeamNameInput.length}/35</p>

            <div className="modal-actions">
              <button type="button" className="modal-secondary" onClick={closeConfigureModal}>
                Cancel
              </button>
              <button type="button" onClick={saveTeamNames}>
                Save
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
