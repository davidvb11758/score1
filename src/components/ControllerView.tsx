import { useEffect, useState } from "react";
import type { ScoreboardState, TeamSide } from "../types";

type ControllerViewProps = {
  state: ScoreboardState;
  connected: boolean;
  onChangeScore: (side: TeamSide, delta: number) => void;
  onStartClock: () => void;
  onStopClock: () => void;
  onSetClock: (seconds: number) => void;
  onSetMatchConfiguration: (
    maxTimeoutsPerTeam: number,
    timeoutDurationSeconds: number,
    maxSetsWon: number
  ) => void;
  onTakeTimeout: (side: TeamSide) => void;
  onAwardSet: (side: TeamSide) => void;
  onStartNewSet: () => void;
  onStartNewMatch: () => void;
  onSetCurrentSetValues: (payload: {
    homeTeamName: string;
    visitorTeamName: string;
    setNumber: number;
    homeScore: number;
    visitorScore: number;
    homeTimeoutsTaken: number;
    visitorTimeoutsTaken: number;
    homeSetsWon: number;
    visitorSetsWon: number;
  }) => void;
};

const CLOCK_MINUTE_CHOICES = [0, 1, 2, 3, 4, 6, 8, 10];
const VOLLEYBALL_TIMEOUT_DURATION_CHOICES = [30, 45, 60, 75, 90];
const VOLLEYBALL_MAX_TIMEOUTS_PER_TEAM_CHOICES = [1, 2];
const MAX_SETS_WON_CHOICES = [1, 2, 3, 4, 5];
const MAX_TEAM_NAME_LENGTH = 25;
const MAX_SCORE = 99;

function formatClock(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatHourMinute(value: Date) {
  return value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatManualClockFromDigits(digits: string) {
  const safeDigits = digits.replace(/\D/g, "");
  if (!safeDigits) return "0:00";
  const secondsText = safeDigits.slice(-2).padStart(2, "0");
  const minutesText = safeDigits.slice(0, -2);
  const minutes = minutesText ? Number.parseInt(minutesText, 10) : 0;
  return `${minutes}:${secondsText}`;
}

function parseManualClockDigitsToSeconds(digits: string) {
  const safeDigits = digits.replace(/\D/g, "");
  if (!safeDigits) return 0;
  const secondsText = safeDigits.slice(-2).padStart(2, "0");
  const minutesText = safeDigits.slice(0, -2);
  const minutes = minutesText ? Number.parseInt(minutesText, 10) : 0;
  const seconds = Math.min(Number.parseInt(secondsText, 10), 59);
  return minutes * 60 + seconds;
}

function TeamControls(props: {
  title: string;
  accentClassName: string;
  score: number;
  setsWon: number;
  timeoutsTaken: number;
  maxTimeoutsPerTeam: number;
  maxSetsWon: number;
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
    side,
    onChangeScore,
    onTakeTimeout,
    onAwardSet
  } = props;
  const isTimeoutLimitReached = timeoutsTaken >= maxTimeoutsPerTeam;
  const isSetsWonLimitReached = setsWon >= maxSetsWon;

  return (
    <article className={`team-panel ${accentClassName}`}>
      <p className="team-name-banner">{title}</p>
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
            Sets Won +1
          </button>
          <span className="team-tracking-value">{setsWon > 0 ? setsWon : ""}</span>
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
  onSetMatchConfiguration,
  onTakeTimeout,
  onAwardSet,
  onStartNewSet,
  onStartNewMatch,
  onSetCurrentSetValues
}: ControllerViewProps) {
  const [isMatchConfigModalOpen, setMatchConfigModalOpen] = useState(false);
  const [isEditValuesModalOpen, setEditValuesModalOpen] = useState(false);
  const [isNewMatchConfirmOpen, setNewMatchConfirmOpen] = useState(false);
  const [maxTimeoutsInput, setMaxTimeoutsInput] = useState(String(state.maxTimeoutsPerTeam));
  const [timeoutDurationInput, setTimeoutDurationInput] = useState(String(state.timeoutDurationSeconds));
  const [maxSetsWonInput, setMaxSetsWonInput] = useState(String(state.maxSetsWon));
  const [editHomeTeamName, setEditHomeTeamName] = useState(state.homeTeamName);
  const [editVisitorTeamName, setEditVisitorTeamName] = useState(state.visitorTeamName);
  const [editSetNumber, setEditSetNumber] = useState(String(state.setNumber));
  const [editHomeScore, setEditHomeScore] = useState(String(state.homeScore));
  const [editVisitorScore, setEditVisitorScore] = useState(String(state.visitorScore));
  const [editHomeTimeoutsTaken, setEditHomeTimeoutsTaken] = useState(String(state.homeTimeoutsTaken));
  const [editVisitorTimeoutsTaken, setEditVisitorTimeoutsTaken] = useState(String(state.visitorTimeoutsTaken));
  const [editHomeSetsWon, setEditHomeSetsWon] = useState(String(state.homeSetsWon));
  const [editVisitorSetsWon, setEditVisitorSetsWon] = useState(String(state.visitorSetsWon));
  const [isSwapped, setIsSwapped] = useState(false);
  const [timeOfDayLabel, setTimeOfDayLabel] = useState(() => formatHourMinute(new Date()));
  const [isManualClockModalOpen, setManualClockModalOpen] = useState(false);
  const [manualClockDigits, setManualClockDigits] = useState("");
  const [quickSetSelection, setQuickSetSelection] = useState("");

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeOfDayLabel(formatHourMinute(new Date()));
    }, 15000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isMatchConfigModalOpen || isEditValuesModalOpen) return;
    setMaxTimeoutsInput(
      VOLLEYBALL_MAX_TIMEOUTS_PER_TEAM_CHOICES.includes(state.maxTimeoutsPerTeam)
        ? String(state.maxTimeoutsPerTeam)
        : String(VOLLEYBALL_MAX_TIMEOUTS_PER_TEAM_CHOICES[0])
    );
    setTimeoutDurationInput(String(state.timeoutDurationSeconds));
    setMaxSetsWonInput(String(state.maxSetsWon));
    setEditHomeTeamName(state.homeTeamName);
    setEditVisitorTeamName(state.visitorTeamName);
    setEditSetNumber(String(state.setNumber));
    setEditHomeScore(String(state.homeScore));
    setEditVisitorScore(String(state.visitorScore));
    setEditHomeTimeoutsTaken(String(state.homeTimeoutsTaken));
    setEditVisitorTimeoutsTaken(String(state.visitorTimeoutsTaken));
    setEditHomeSetsWon(String(state.homeSetsWon));
    setEditVisitorSetsWon(String(state.visitorSetsWon));
  }, [
    isMatchConfigModalOpen,
    isEditValuesModalOpen,
    state.homeTeamName,
    state.visitorTeamName,
    state.setNumber,
    state.homeScore,
    state.visitorScore,
    state.homeTimeoutsTaken,
    state.visitorTimeoutsTaken,
    state.homeSetsWon,
    state.visitorSetsWon,
    state.maxTimeoutsPerTeam,
    state.timeoutDurationSeconds,
    state.maxSetsWon
  ]);

  const openMatchConfigModal = () => {
    setMaxTimeoutsInput(
      VOLLEYBALL_MAX_TIMEOUTS_PER_TEAM_CHOICES.includes(state.maxTimeoutsPerTeam)
        ? String(state.maxTimeoutsPerTeam)
        : String(VOLLEYBALL_MAX_TIMEOUTS_PER_TEAM_CHOICES[0])
    );
    setTimeoutDurationInput(
      VOLLEYBALL_TIMEOUT_DURATION_CHOICES.includes(state.timeoutDurationSeconds)
        ? String(state.timeoutDurationSeconds)
        : String(VOLLEYBALL_TIMEOUT_DURATION_CHOICES[0])
    );
    setMaxSetsWonInput(
      MAX_SETS_WON_CHOICES.includes(state.maxSetsWon)
        ? String(state.maxSetsWon)
        : String(MAX_SETS_WON_CHOICES[0])
    );
    setMatchConfigModalOpen(true);
  };

  const closeMatchConfigModal = () => {
    setMatchConfigModalOpen(false);
  };

  const saveMatchConfiguration = () => {
    const maxTimeouts = Number.parseInt(maxTimeoutsInput, 10);
    const timeoutDuration = Number.parseInt(timeoutDurationInput, 10);
    const maxSetsWon = Number.parseInt(maxSetsWonInput, 10);
    if (!VOLLEYBALL_MAX_TIMEOUTS_PER_TEAM_CHOICES.includes(maxTimeouts)) return;
    if (!Number.isInteger(timeoutDuration) || timeoutDuration <= 0) return;
    if (!MAX_SETS_WON_CHOICES.includes(maxSetsWon)) return;

    onSetMatchConfiguration(maxTimeouts, timeoutDuration, maxSetsWon);
    setMatchConfigModalOpen(false);
  };

  const openEditValuesModal = () => {
    setEditHomeTeamName(state.homeTeamName);
    setEditVisitorTeamName(state.visitorTeamName);
    setEditSetNumber(String(state.setNumber));
    setEditHomeScore(String(state.homeScore));
    setEditVisitorScore(String(state.visitorScore));
    setEditHomeTimeoutsTaken(String(state.homeTimeoutsTaken));
    setEditVisitorTimeoutsTaken(String(state.visitorTimeoutsTaken));
    setEditHomeSetsWon(String(state.homeSetsWon));
    setEditVisitorSetsWon(String(state.visitorSetsWon));
    setEditValuesModalOpen(true);
  };

  const closeEditValuesModal = () => {
    setEditValuesModalOpen(false);
  };

  const openNewMatchConfirm = () => {
    setNewMatchConfirmOpen(true);
  };

  const closeNewMatchConfirm = () => {
    setNewMatchConfirmOpen(false);
  };

  const confirmNewMatch = () => {
    onStartNewMatch();
    setNewMatchConfirmOpen(false);
  };

  const openManualClockModal = () => {
    setManualClockDigits("");
    setManualClockModalOpen(true);
  };

  const closeManualClockModal = () => {
    setManualClockModalOpen(false);
    setManualClockDigits("");
  };

  const appendManualClockDigit = (digit: string) => {
    setManualClockDigits((previous) => (previous.length >= 4 ? previous : `${previous}${digit}`));
  };

  const clearManualClockValue = () => {
    setManualClockDigits("");
  };

  const confirmManualClockValue = () => {
    onSetClock(parseManualClockDigitsToSeconds(manualClockDigits));
    closeManualClockModal();
  };

  const applyQuickSet = (minutes: number) => {
    onSetClock(minutes * 60);
    // Reset to placeholder so re-selecting the same value still applies.
    setQuickSetSelection("");
  };

  const saveEditValues = () => {
    const homeScore = Number.parseInt(editHomeScore, 10);
    const visitorScore = Number.parseInt(editVisitorScore, 10);
    const setNumber = Number.parseInt(editSetNumber, 10);
    const homeTimeoutsTaken = Number.parseInt(editHomeTimeoutsTaken, 10);
    const visitorTimeoutsTaken = Number.parseInt(editVisitorTimeoutsTaken, 10);
    const homeSetsWon = Number.parseInt(editHomeSetsWon, 10);
    const visitorSetsWon = Number.parseInt(editVisitorSetsWon, 10);

    if (!Number.isInteger(setNumber) || setNumber < 1 || setNumber > 5) return;
    if (!Number.isInteger(homeScore) || homeScore < 0 || homeScore > MAX_SCORE) return;
    if (!Number.isInteger(visitorScore) || visitorScore < 0 || visitorScore > MAX_SCORE) return;
    if (!Number.isInteger(homeTimeoutsTaken) || homeTimeoutsTaken < 0 || homeTimeoutsTaken > state.maxTimeoutsPerTeam)
      return;
    if (
      !Number.isInteger(visitorTimeoutsTaken) ||
      visitorTimeoutsTaken < 0 ||
      visitorTimeoutsTaken > state.maxTimeoutsPerTeam
    )
      return;
    if (!Number.isInteger(homeSetsWon) || homeSetsWon < 0 || homeSetsWon > state.maxSetsWon) return;
    if (!Number.isInteger(visitorSetsWon) || visitorSetsWon < 0 || visitorSetsWon > state.maxSetsWon) return;

    onSetCurrentSetValues({
      homeTeamName: editHomeTeamName.trim(),
      visitorTeamName: editVisitorTeamName.trim(),
      setNumber,
      homeScore,
      visitorScore,
      homeTimeoutsTaken,
      visitorTimeoutsTaken,
      homeSetsWon,
      visitorSetsWon
    });
    setEditValuesModalOpen(false);
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
        <p className="set-number-chip">Set #: {state.setNumber}</p>
        <p className="time-of-day-chip">{timeOfDayLabel}</p>
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
          side={rightTeam.side}
          onChangeScore={onChangeScore}
          onTakeTimeout={onTakeTimeout}
          onAwardSet={onAwardSet}
        />

        <section className="clock-panel">
          <p className="clock-title">Timer</p>
          <p className="clock-readout">{formatClock(state.clockSecondsRemaining)}</p>
          <div className="clock-controls-grid">
            <div className="clock-set-column">
              <select
                value={quickSetSelection}
                onChange={(event) => {
                  const selectedMinutes = Number(event.target.value);
                  if (!Number.isFinite(selectedMinutes)) return;
                  applyQuickSet(selectedMinutes);
                }}
              >
                <option value="">Quick Set</option>
                {CLOCK_MINUTE_CHOICES.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes}:00
                  </option>
                ))}
              </select>
              <button className="clock-set-label" type="button" onClick={openManualClockModal}>
                Manual Set
              </button>
            </div>
            <div className="clock-run-column">
              <button
                className={state.clockRunning ? "clock-toggle-button clock-toggle-running" : "clock-toggle-button"}
                onClick={state.clockRunning ? onStopClock : onStartClock}
              >
                {state.clockRunning ? "Stop Timer" : "Start Timer"}
              </button>
            </div>
          </div>
        </section>
        <button className="edit-scoreboard-button" type="button" onClick={openEditValuesModal}>
          Edit scoreboard values
        </button>
        <button className="controller-secondary-button" type="button" onClick={() => setIsSwapped((prev) => !prev)}>
          Swap teams right and left
        </button>
        <button className="controller-secondary-button" type="button" onClick={onStartNewSet}>
          Start a new set
        </button>
        <button className="controller-secondary-button" type="button" onClick={openNewMatchConfirm}>
          Start a new match
        </button>
        <button className="controller-secondary-button" type="button" onClick={openMatchConfigModal}>
          Configure the match
        </button>
      </section>

      <section className="future-notes">
        <p>Reset to new game (future feature)</p>
        <p>Swap teams is now live</p>
        <p>Sport presets (future feature)</p>
      </section>

      {isMatchConfigModalOpen ? (
        <section className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Match Configuration">
          <div className="modal-card">
            <h2>Match Configuration</h2>
            <label className="modal-label">
              Max number of timeouts per team
              <select
                value={maxTimeoutsInput}
                onChange={(event) => setMaxTimeoutsInput(event.target.value)}
              >
                {VOLLEYBALL_MAX_TIMEOUTS_PER_TEAM_CHOICES.map((timeouts) => (
                  <option key={timeouts} value={timeouts}>
                    {timeouts}
                  </option>
                ))}
              </select>
            </label>
            <label className="modal-label">
              Timeout duration (seconds)
              <select
                value={timeoutDurationInput}
                onChange={(event) => setTimeoutDurationInput(event.target.value)}
              >
                {VOLLEYBALL_TIMEOUT_DURATION_CHOICES.map((seconds) => (
                  <option key={seconds} value={seconds}>
                    {seconds}
                  </option>
                ))}
              </select>
            </label>
            <label className="modal-label">
              Maximum number of sets
              <select
                value={maxSetsWonInput}
                onChange={(event) => setMaxSetsWonInput(event.target.value)}
              >
                {MAX_SETS_WON_CHOICES.map((sets) => (
                  <option key={sets} value={sets}>
                    {sets}
                  </option>
                ))}
              </select>
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
      {isManualClockModalOpen ? (
        <section className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Manual clock set">
          <div className="modal-card manual-clock-modal">
            <h2>Manual Set</h2>
            <p className="manual-clock-display">{formatManualClockFromDigits(manualClockDigits)}</p>
            <div className="manual-keypad-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <button key={digit} type="button" onClick={() => appendManualClockDigit(String(digit))}>
                  {digit}
                </button>
              ))}
              <button type="button" onClick={clearManualClockValue}>
                Clear
              </button>
              <button type="button" onClick={() => appendManualClockDigit("0")}>
                0
              </button>
            </div>
            <div className="modal-actions manual-clock-actions">
              <button type="button" className="modal-secondary" onClick={closeManualClockModal}>
                Cancel
              </button>
              <button type="button" onClick={confirmManualClockValue}>
                Okay
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {isEditValuesModalOpen ? (
        <section className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Edit scoreboard values">
          <div className="modal-card modal-card-wide">
            <h2>Edit scoreboard values</h2>
            <section className="team-edit-group match-settings-group">
              <h3>Match settings</h3>
              <label className="modal-label modal-label-inline">
                Set #
                <select value={editSetNumber} onChange={(event) => setEditSetNumber(event.target.value)}>
                  {[1, 2, 3, 4, 5].map((setNumber) => (
                    <option key={setNumber} value={setNumber}>
                      {setNumber}
                    </option>
                  ))}
                </select>
              </label>
            </section>
            <section className="team-edit-group home-edit-group">
              <h3>Home team (blue section)</h3>
              <label className="modal-label modal-label-inline">
                Team name:
                <input
                  value={editHomeTeamName}
                  onChange={(event) => setEditHomeTeamName(event.target.value.slice(0, MAX_TEAM_NAME_LENGTH))}
                  maxLength={MAX_TEAM_NAME_LENGTH}
                />
              </label>
              <label className="modal-label modal-label-inline">
                Score:
                <select value={editHomeScore} onChange={(event) => setEditHomeScore(event.target.value)}>
                  {Array.from({ length: MAX_SCORE + 1 }, (_, score) => (
                    <option key={score} value={score}>
                      {score}
                    </option>
                  ))}
                </select>
              </label>
              <label className="modal-label modal-label-inline">
                Timeouts taken:
                <select
                  value={editHomeTimeoutsTaken}
                  onChange={(event) => setEditHomeTimeoutsTaken(event.target.value)}
                >
                  {Array.from({ length: state.maxTimeoutsPerTeam + 1 }, (_, count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </label>
              <label className="modal-label modal-label-inline">
                Sets won:
                <select value={editHomeSetsWon} onChange={(event) => setEditHomeSetsWon(event.target.value)}>
                  {Array.from({ length: state.maxSetsWon + 1 }, (_, count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </label>
            </section>

            <section className="team-edit-group visitor-edit-group">
              <h3>Visitor team (red section)</h3>
              <label className="modal-label modal-label-inline">
                Team name:
                <input
                  value={editVisitorTeamName}
                  onChange={(event) => setEditVisitorTeamName(event.target.value.slice(0, MAX_TEAM_NAME_LENGTH))}
                  maxLength={MAX_TEAM_NAME_LENGTH}
                />
              </label>
              <label className="modal-label modal-label-inline">
                Score:
                <select value={editVisitorScore} onChange={(event) => setEditVisitorScore(event.target.value)}>
                  {Array.from({ length: MAX_SCORE + 1 }, (_, score) => (
                    <option key={score} value={score}>
                      {score}
                    </option>
                  ))}
                </select>
              </label>
              <label className="modal-label modal-label-inline">
                Timeouts taken:
                <select
                  value={editVisitorTimeoutsTaken}
                  onChange={(event) => setEditVisitorTimeoutsTaken(event.target.value)}
                >
                  {Array.from({ length: state.maxTimeoutsPerTeam + 1 }, (_, count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </label>
              <label className="modal-label modal-label-inline">
                Sets won:
                <select value={editVisitorSetsWon} onChange={(event) => setEditVisitorSetsWon(event.target.value)}>
                  {Array.from({ length: state.maxSetsWon + 1 }, (_, count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </label>
            </section>

            <div className="modal-actions">
              <button type="button" className="modal-secondary" onClick={closeEditValuesModal}>
                Cancel
              </button>
              <button type="button" onClick={saveEditValues}>
                Update
              </button>
            </div>
          </div>
        </section>
      ) : null}
      {isNewMatchConfirmOpen ? (
        <section className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirm new match">
          <div className="modal-card">
            <h2>Confirm new match</h2>
            <p>Are you sure you want to start a new MATCH? Doing so will reset ALL values on the scoreboard.</p>
            <div className="modal-actions">
              <button type="button" className="modal-secondary" onClick={closeNewMatchConfirm}>
                Cancel
              </button>
              <button type="button" onClick={confirmNewMatch}>
                Yes - new match
              </button>
            </div>
          </div>
        </section>
      ) : null}
      <span className={connected ? "status-ok controller-status" : "status-bad controller-status"}>
        {connected ? "Connected" : "Disconnected"}
      </span>
    </main>
  );
}
