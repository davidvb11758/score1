import { useEffect, useState } from "react";
import type { ScoreboardState, TeamSide } from "../types";

type ControllerViewProps = {
  state: ScoreboardState;
  connected: boolean;
  onChangeScore: (side: TeamSide, delta: number) => void;
  onStartClock: () => void;
  onStopClock: () => void;
  onSetClock: (seconds: number) => void;
  onSetTeamNames: (homeTeamName: string, visitorTeamName: string) => void;
  onSetMatchConfiguration: (
    maxTimeoutsPerTeam: number,
    timeoutDurationSeconds: number,
    maxSetsWon: number
  ) => void;
  onTakeTimeout: (side: TeamSide) => void;
  onAwardSet: (side: TeamSide) => void;
};

const CLOCK_MINUTE_CHOICES = [1, 2, 3, 4, 6, 8, 10];
const MAX_TEAM_NAME_LENGTH = 25;

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
  setsWon: number;
  timeoutsTaken: number;
  maxTimeoutsPerTeam: number;
  maxSetsWon: number;
  timeoutDurationSeconds: number;
  side: TeamSide;
  onChangeScore: (side: TeamSide, delta: number) => void;
  onTakeTimeout: (side: TeamSide) => void;
  onAwardSet: (side: TeamSide) => void;
}) {
  const {
    title,
    accentClassName,
    score,
    setsWon,
    timeoutsTaken,
    maxTimeoutsPerTeam,
    maxSetsWon,
    timeoutDurationSeconds,
    side,
    onChangeScore,
    onTakeTimeout,
    onAwardSet
  } = props;
  const isTimeoutLimitReached = timeoutsTaken >= maxTimeoutsPerTeam;
  const isSetsWonLimitReached = setsWon >= maxSetsWon;

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

      <div className="team-tracking-card">
        <div className="team-action-row">
          <button className="team-outline-button" disabled={isTimeoutLimitReached} onClick={() => onTakeTimeout(side)}>
            Timeout +1
          </button>
          <span className="team-tracking-value">{timeoutsTaken > 0 ? timeoutsTaken : ""}</span>
        </div>
        <div className="team-action-row">
          <button className="team-outline-button" disabled={isSetsWonLimitReached} onClick={() => onAwardSet(side)}>
            Sets Won+1
          </button>
          <span className="team-tracking-value">{setsWon > 0 ? setsWon : ""}</span>
        </div>
        <p className="team-meta-hint">
          Timeout duration: {timeoutDurationSeconds} sec | Max T/O: {maxTimeoutsPerTeam} | Max sets: {maxSetsWon}
        </p>
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
  onSetTeamNames,
  onSetMatchConfiguration,
  onTakeTimeout,
  onAwardSet
}: ControllerViewProps) {
  const selectedMinutes = CLOCK_MINUTE_CHOICES.includes(state.clockSecondsRemaining / 60)
    ? state.clockSecondsRemaining / 60
    : 3;
  const [isTeamNamesModalOpen, setTeamNamesModalOpen] = useState(false);
  const [isMatchConfigModalOpen, setMatchConfigModalOpen] = useState(false);
  const [homeTeamNameInput, setHomeTeamNameInput] = useState(state.homeTeamName);
  const [visitorTeamNameInput, setVisitorTeamNameInput] = useState(state.visitorTeamName);
  const [maxTimeoutsInput, setMaxTimeoutsInput] = useState(String(state.maxTimeoutsPerTeam));
  const [timeoutDurationInput, setTimeoutDurationInput] = useState(String(state.timeoutDurationSeconds));
  const [maxSetsWonInput, setMaxSetsWonInput] = useState(String(state.maxSetsWon));
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    if (isTeamNamesModalOpen || isMatchConfigModalOpen) return;
    setHomeTeamNameInput(state.homeTeamName);
    setVisitorTeamNameInput(state.visitorTeamName);
    setMaxTimeoutsInput(String(state.maxTimeoutsPerTeam));
    setTimeoutDurationInput(String(state.timeoutDurationSeconds));
    setMaxSetsWonInput(String(state.maxSetsWon));
  }, [
    isTeamNamesModalOpen,
    isMatchConfigModalOpen,
    state.homeTeamName,
    state.visitorTeamName,
    state.maxTimeoutsPerTeam,
    state.timeoutDurationSeconds,
    state.maxSetsWon
  ]);

  const openTeamNamesModal = () => {
    setHomeTeamNameInput(state.homeTeamName);
    setVisitorTeamNameInput(state.visitorTeamName);
    setTeamNamesModalOpen(true);
  };

  const closeTeamNamesModal = () => {
    setTeamNamesModalOpen(false);
  };

  const saveTeamNames = () => {
    onSetTeamNames(homeTeamNameInput.trim(), visitorTeamNameInput.trim());
    setTeamNamesModalOpen(false);
  };

  const openMatchConfigModal = () => {
    setMaxTimeoutsInput(String(state.maxTimeoutsPerTeam));
    setTimeoutDurationInput(String(state.timeoutDurationSeconds));
    setMaxSetsWonInput(String(state.maxSetsWon));
    setMatchConfigModalOpen(true);
  };

  const closeMatchConfigModal = () => {
    setMatchConfigModalOpen(false);
  };

  const saveMatchConfiguration = () => {
    const maxTimeouts = Number.parseInt(maxTimeoutsInput, 10);
    const timeoutDuration = Number.parseInt(timeoutDurationInput, 10);
    const maxSetsWon = Number.parseInt(maxSetsWonInput, 10);
    if (!Number.isInteger(maxTimeouts) || maxTimeouts <= 0) return;
    if (!Number.isInteger(timeoutDuration) || timeoutDuration <= 0) return;
    if (!Number.isInteger(maxSetsWon) || maxSetsWon <= 0) return;

    onSetMatchConfiguration(maxTimeouts, timeoutDuration, maxSetsWon);
    setMatchConfigModalOpen(false);
  };

  const leftSide: TeamSide = isSwapped ? "visitor" : "home";
  const rightSide: TeamSide = isSwapped ? "home" : "visitor";
  const getTeamView = (side: TeamSide) => ({
    side,
    title: side === "home" ? state.homeTeamName : state.visitorTeamName,
    accentClassName: side === "home" ? "my-team-panel" : "other-team-panel",
    score: side === "home" ? state.homeScore : state.visitorScore,
    setsWon: side === "home" ? state.homeSetsWon : state.visitorSetsWon,
    timeoutsTaken: side === "home" ? state.homeTimeoutsTaken : state.visitorTimeoutsTaken
  });
  const leftTeam = getTeamView(leftSide);
  const rightTeam = getTeamView(rightSide);

  return (
    <main className="tablet-controller-page">
      <header className="tablet-top-row">
        <span className={`text-link team-name-link ${leftSide === "home" ? "team-name-home" : "team-name-visitor"}`}>
          {leftTeam.title}
        </span>
        <button className="text-link swap-link" type="button" onClick={() => setIsSwapped((prev) => !prev)}>
          SWAP
        </button>
        <span
          className={`text-link team-name-link ${rightSide === "home" ? "team-name-home" : "team-name-visitor"}`}
        >
          {rightTeam.title}
        </span>
        <button className="text-link configure-link" type="button" onClick={openTeamNamesModal}>
          Configure team names
        </button>
        <button className="text-link configure-link" type="button" onClick={openMatchConfigModal}>
          Match Configuration
        </button>
        <h1>Clock</h1>
        <span className={connected ? "status-ok connection-status" : "status-bad connection-status"}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </header>

      <section className="tablet-main-grid">
        <TeamControls
          title={leftTeam.title}
          accentClassName={leftTeam.accentClassName}
          score={leftTeam.score}
          setsWon={leftTeam.setsWon}
          timeoutsTaken={leftTeam.timeoutsTaken}
          maxTimeoutsPerTeam={state.maxTimeoutsPerTeam}
          maxSetsWon={state.maxSetsWon}
          timeoutDurationSeconds={state.timeoutDurationSeconds}
          side={leftTeam.side}
          onChangeScore={onChangeScore}
          onTakeTimeout={onTakeTimeout}
          onAwardSet={onAwardSet}
        />
        <TeamControls
          title={rightTeam.title}
          accentClassName={rightTeam.accentClassName}
          score={rightTeam.score}
          setsWon={rightTeam.setsWon}
          timeoutsTaken={rightTeam.timeoutsTaken}
          maxTimeoutsPerTeam={state.maxTimeoutsPerTeam}
          maxSetsWon={state.maxSetsWon}
          timeoutDurationSeconds={state.timeoutDurationSeconds}
          side={rightTeam.side}
          onChangeScore={onChangeScore}
          onTakeTimeout={onTakeTimeout}
          onAwardSet={onAwardSet}
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
        <p>Swap teams is now live</p>
        <p>Sport presets (future feature)</p>
      </section>

      {isTeamNamesModalOpen ? (
        <section className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Configure team names">
          <div className="modal-card">
            <h2>Configure team names</h2>
            <label className="modal-label">
              Team 1 name
              <input
                value={homeTeamNameInput}
                onChange={(event) =>
                  setHomeTeamNameInput(event.target.value.slice(0, MAX_TEAM_NAME_LENGTH))
                }
                maxLength={MAX_TEAM_NAME_LENGTH}
                placeholder="My team name"
              />
            </label>
            <p className="modal-counter">
              {homeTeamNameInput.length}/{MAX_TEAM_NAME_LENGTH}
            </p>

            <label className="modal-label">
              Team 2 name
              <input
                value={visitorTeamNameInput}
                onChange={(event) =>
                  setVisitorTeamNameInput(event.target.value.slice(0, MAX_TEAM_NAME_LENGTH))
                }
                maxLength={MAX_TEAM_NAME_LENGTH}
                placeholder="Other team name"
              />
            </label>
            <p className="modal-counter">
              {visitorTeamNameInput.length}/{MAX_TEAM_NAME_LENGTH}
            </p>

            <div className="modal-actions">
              <button type="button" className="modal-secondary" onClick={closeTeamNamesModal}>
                Cancel
              </button>
              <button type="button" onClick={saveTeamNames}>
                Save
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {isMatchConfigModalOpen ? (
        <section className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Match Configuration">
          <div className="modal-card">
            <h2>Match Configuration</h2>
            <label className="modal-label">
              Max number of timeouts per team
              <input
                type="number"
                min={1}
                step={1}
                value={maxTimeoutsInput}
                onChange={(event) => setMaxTimeoutsInput(event.target.value)}
                placeholder="2"
              />
            </label>
            <label className="modal-label">
              Timeout duration (seconds)
              <input
                type="number"
                min={1}
                step={1}
                value={timeoutDurationInput}
                onChange={(event) => setTimeoutDurationInput(event.target.value)}
                placeholder="60"
              />
            </label>
            <label className="modal-label">
              Max sets won
              <input
                type="number"
                min={1}
                step={1}
                value={maxSetsWonInput}
                onChange={(event) => setMaxSetsWonInput(event.target.value)}
                placeholder="2"
              />
            </label>
            <div className="modal-actions">
              <button type="button" className="modal-secondary" onClick={closeMatchConfigModal}>
                Cancel
              </button>
              <button type="button" onClick={saveMatchConfiguration}>
                Save
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
