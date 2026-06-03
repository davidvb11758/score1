import type { CSSProperties } from "react";
import type { ScoreboardState } from "../types";
import volleyballBackground from "../../vbbackground.png";

type DisplayViewProps = {
  state: ScoreboardState;
  connected: boolean;
};

type ElementStyleConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  color: string;
  background?: string;
  textAlign?: CSSProperties["textAlign"];
  fontWeight?: CSSProperties["fontWeight"];
  lineHeight?: number;
  letterSpacing?: number;
  borderRadius?: number;
  paddingX?: number;
  textDecoration?: CSSProperties["textDecoration"];
};

type DisplayLayout = {
  backgroundImage: string;
  elements: Record<
    | "teamOneName"
    | "teamTwoName"
    | "teamOneScore"
    | "teamTwoScore"
    | "teamOneTimeoutLabel"
    | "teamOneTimeoutValue"
    | "teamTwoTimeoutLabel"
    | "teamTwoTimeoutValue"
    | "teamOneSetsWonLabel"
    | "teamOneSetsWonValue"
    | "teamTwoSetsWonLabel"
    | "teamTwoSetsWonValue"
    | "setLabel"
    | "setValue"
    | "timer"
    | "connectionStatus",
    ElementStyleConfig
  >;
};

const DISPLAY_LAYOUTS: Record<string, DisplayLayout> = {
  volleyball: {
    backgroundImage: volleyballBackground,
    elements: {
      teamOneName: {
        x: 10,
        y: 540,
        width: 800,
        height: 54,
        fontSize: 72,
        color: "#ffd700",
        textAlign: "center",
        textDecoration: "",
        fontWeight: 500
      },
      teamTwoName: {
        x: 1200,
        y: 540,
        width: 800,
        height: 54,
        fontSize: 72,
        color: "#ffd700",
        textAlign: "right",
        textDecoration: "",
        fontWeight: 500
      },
      teamOneScore: {
        x:1,
        y: 130,
        width: 590,
        height: 370,
        fontSize: 400,
        color: "#f8f9fb",
        background: "transparent",
        textAlign: "center",
        fontWeight: 700,
        lineHeight: 1
      },
      teamOneTimeoutLabel: {
        x: 52,
        y: 668,
        width: 300,
        height: 50,
        fontSize: 48,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 600
      },
      teamOneTimeoutValue: {
        x: 334,
        y: 668,
        width: 110,
        height: 50,
        fontSize: 48,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 700
      },
      teamOneSetsWonLabel: {
        x: 52,
        y: 738,
        width: 300,
        height: 50,
        fontSize: 48,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 600
      },
      teamOneSetsWonValue: {
        x: 334,
        y: 738,
        width: 110,
        height: 50,
        fontSize: 48,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 700
      },
      teamTwoScore: {
        x: 1340,
        y: 130,
        width: 590,
        height: 370,
        fontSize: 400,
        color: "#f8f9fb",
        background: "transparent",
        textAlign: "center",
        fontWeight: 700,
        lineHeight: 1
      },
      teamTwoTimeoutLabel: {
        x: 1394,
        y: 668,
        width: 300,
        height: 50,
        fontSize: 48,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 600
      },
      teamTwoTimeoutValue: {
        x: 1676,
        y: 668,
        width: 110,
        height: 50,
        fontSize: 48,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 700
      },
      teamTwoSetsWonLabel: {
        x: 1394,
        y: 738,
        width: 300,
        height: 50,
        fontSize: 48,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 600
      },
      teamTwoSetsWonValue: {
        x: 1676,
        y: 738,
        width: 110,
        height: 50,
        fontSize: 48,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 700
      },
      setLabel: {
        x: 905,
        y: 310,
        width: 120,
        height: 54,
        fontSize: 60,
        color: "#f8f9fb",
        textAlign: "center",
        fontWeight: 600
      },
      setValue: {
        x: 1050,
        y: 165,
        width: 120,
        height: 72,
        fontSize: 88,
        color: "#f8f9fb",
        textAlign: "center",
        fontWeight: 700
      },
      timer: {
        x: 410,
        y: 150,
        width: 1100,
        height: 450,
        fontSize: 230,
        color: "#f8f9fb",
        background: "transparent",
        textAlign: "center",
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: 4
      },
      connectionStatus: {
        x: 1770,
        y: 1019,
        width: 140,
        height: 36,
        fontSize: 30,
        color: "#56d364",
        textAlign: "right",
        fontWeight: 700
      }
    }
  },
  // Future option placeholder. Replace background and coordinates for basketball.
  basketball: {
    backgroundImage: volleyballBackground,
    elements: {
      teamOneName: {
        x: 125,
        y: 28,
        width: 420,
        height: 54,
        fontSize: 52,
        color: "#ffd700",
        textDecoration: "underline",
        fontWeight: 500
      },
      teamTwoName: {
        x: 1218,
        y: 28,
        width: 560,
        height: 54,
        fontSize: 52,
        color: "#ffd700",
        textAlign: "right",
        textDecoration: "underline",
        fontWeight: 500
      },
      teamOneScore: {
        x: 40,
        y: 96,
        width: 700,
        height: 370,
        fontSize: 298,
        color: "#f8f9fb",
        background: "transparent",
        textAlign: "center",
        fontWeight: 700,
        lineHeight: 1
      },
      teamOneTimeoutLabel: {
        x: 40,
        y: 476,
        width: 300,
        height: 50,
        fontSize: 42,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 600
      },
      teamOneTimeoutValue: {
        x: 330,
        y: 476,
        width: 110,
        height: 50,
        fontSize: 42,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 700
      },
      teamOneSetsWonLabel: {
        x: 40,
        y: 530,
        width: 300,
        height: 50,
        fontSize: 42,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 600
      },
      teamOneSetsWonValue: {
        x: 330,
        y: 530,
        width: 110,
        height: 50,
        fontSize: 42,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 700
      },
      teamTwoScore: {
        x: 1183,
        y: 96,
        width: 700,
        height: 370,
        fontSize: 298,
        color: "#f8f9fb",
        background: "transparent",
        textAlign: "center",
        fontWeight: 700,
        lineHeight: 1
      },
      teamTwoTimeoutLabel: {
        x: 1183,
        y: 476,
        width: 300,
        height: 50,
        fontSize: 42,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 600
      },
      teamTwoTimeoutValue: {
        x: 1473,
        y: 476,
        width: 110,
        height: 50,
        fontSize: 42,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 700
      },
      teamTwoSetsWonLabel: {
        x: 1183,
        y: 530,
        width: 300,
        height: 50,
        fontSize: 42,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 600
      },
      teamTwoSetsWonValue: {
        x: 1473,
        y: 530,
        width: 110,
        height: 50,
        fontSize: 42,
        color: "#f8f9fb",
        textAlign: "left",
        fontWeight: 700
      },
      setLabel: {
        x: 900,
        y: 250,
        width: 120,
        height: 48,
        fontSize: 44,
        color: "#f8f9fb",
        textAlign: "center",
        fontWeight: 600
      },
      setValue: {
        x: 900,
        y: 306,
        width: 120,
        height: 64,
        fontSize: 70,
        color: "#f8f9fb",
        textAlign: "center",
        fontWeight: 700
      },
      timer: {
        x: 503,
        y: 683,
        width: 916,
        height: 355,
        fontSize: 292,
        color: "#f8f9fb",
        background: "transparent",
        textAlign: "center",
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: 4
      },
      connectionStatus: {
        x: 1770,
        y: 1019,
        width: 140,
        height: 36,
        fontSize: 30,
        color: "#56d364",
        textAlign: "right",
        fontWeight: 700
      }
    }
  }
};

function formatClock(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatStatsCount(value: number) {
  return value > 0 ? String(value) : "";
}

function toElementStyle(config: ElementStyleConfig): CSSProperties {
  return {
    left: `${config.x}px`,
    top: `${config.y}px`,
    width: `${config.width}px`,
    height: `${config.height}px`,
    fontSize: `${config.fontSize}px`,
    color: config.color,
    background: config.background ?? "transparent",
    textAlign: config.textAlign ?? "left",
    fontWeight: config.fontWeight ?? 400,
    lineHeight: config.lineHeight ?? 1,
    letterSpacing: config.letterSpacing ? `${config.letterSpacing}px` : undefined,
    borderRadius: config.borderRadius ? `${config.borderRadius}px` : undefined,
    textDecoration: config.textDecoration,
    padding: config.paddingX ? `0 ${config.paddingX}px` : undefined
  };
}

function toTeamStatsBoxStyle(
  teamScore: ElementStyleConfig,
  timeoutLabel: ElementStyleConfig,
  setsWonLabel: ElementStyleConfig,
): CSSProperties {
  const horizontalInset = Math.max(12, Math.round(teamScore.width * 0.03));
  const left = teamScore.x + horizontalInset;
  const top = Math.min(timeoutLabel.y, setsWonLabel.y) - 8;
  const bottom = Math.max(timeoutLabel.y + timeoutLabel.height, setsWonLabel.y + setsWonLabel.height) + 8;
  const width = Math.max(220, teamScore.width - horizontalInset * 2);

  return {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    maxWidth: `${width}px`,
    height: `${bottom - top}px`,
    boxSizing: "border-box"
  };
}

export function DisplayView({ state, connected }: DisplayViewProps) {
  const query = new URLSearchParams(window.location.search);
  const sport = (query.get("sport") ?? "volleyball").toLowerCase();
  const layout = DISPLAY_LAYOUTS[sport] ?? DISPLAY_LAYOUTS.volleyball;
  const historyBySet = new Map(state.setHistory.map((entry) => [entry.setNumber, entry]));
  const homeTeamStatsStyle = toTeamStatsBoxStyle(
    layout.elements.teamOneScore,
    layout.elements.teamOneTimeoutLabel,
    layout.elements.teamOneSetsWonLabel,
  );
  const visitorTeamStatsStyle = toTeamStatsBoxStyle(
    layout.elements.teamTwoScore,
    layout.elements.teamTwoTimeoutLabel,
    layout.elements.teamTwoSetsWonLabel,
  );

  return (
    <main className="tv-display-root">
      <div className="tv-stage-shell">
        <section className="tv-stage">
          <img className="tv-background-image" src={layout.backgroundImage} alt="" />
          <section className="tv-overlay-layer">
            <p className="tv-overlay-text tv-italic-data" style={toElementStyle(layout.elements.teamOneName)}>
              {state.homeTeamName}
            </p>
            <p className="tv-overlay-text tv-italic-data" style={toElementStyle(layout.elements.teamTwoName)}>
              {state.visitorTeamName}
            </p>
            <p className="tv-overlay-text tv-centered-value tv-italic-data" style={toElementStyle(layout.elements.teamOneScore)}>
              {state.homeScore}
            </p>
            <p className="tv-overlay-text tv-centered-value tv-italic-data" style={toElementStyle(layout.elements.teamTwoScore)}>
              {state.visitorScore}
            </p>
            <section className="tv-team-stats-box tv-team-stats-home" style={homeTeamStatsStyle}>
              <p className="tv-team-stats-row">
                <span>T/O taken</span>
                <span className="tv-team-stats-value">{formatStatsCount(state.homeTimeoutsTaken)}</span>
              </p>
              <p className="tv-team-stats-row">
                <span>Sets won</span>
                <span className="tv-team-stats-value">{formatStatsCount(state.homeSetsWon)}</span>
              </p>
            </section>
            <section className="tv-team-stats-box tv-team-stats-visitor" style={visitorTeamStatsStyle}>
              <p className="tv-team-stats-row">
                <span>T/O taken</span>
                <span className="tv-team-stats-value">{formatStatsCount(state.visitorTimeoutsTaken)}</span>
              </p>
              <p className="tv-team-stats-row">
                <span>Sets won</span>
                <span className="tv-team-stats-value">{formatStatsCount(state.visitorSetsWon)}</span>
              </p>
            </section>
            <p className="tv-overlay-text" style={toElementStyle(layout.elements.setLabel)} />
            <p className="tv-overlay-text tv-italic-data" style={toElementStyle(layout.elements.setValue)}>
              {state.setNumber}
            </p>
            <p className="tv-overlay-text tv-centered-value tv-italic-data" style={toElementStyle(layout.elements.timer)}>
              {formatClock(state.clockSecondsRemaining)}
            </p>
            <section className="tv-score-history">
              <div className="tv-score-history-grid">
                {[1, 2, 3, 4, 5].map((setNumber) => {
                  const setScore = historyBySet.get(setNumber);
                  return (
                    <span key={setNumber}>
                      {setScore ? `${setScore.homeScore}-${setScore.visitorScore}` : ""}
                    </span>
                  );
                })}
              </div>
            </section>
            <p
              className={connected ? "tv-overlay-text status-ok" : "tv-overlay-text status-bad"}
              style={toElementStyle(layout.elements.connectionStatus)}
            >
              {connected ? "Connected" : "Disconnected"}
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}
