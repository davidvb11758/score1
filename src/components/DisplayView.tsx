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
        x: 280,
        y: 50,
        width: 500,
        height: 54,
        fontSize: 72,
        color: "#4e7de5",
        textAlign: "center",
        textDecoration: "",
        fontWeight: 500
      },
      teamTwoName: {
        x: 1130,
        y: 50,
        width: 500,
        height: 54,
        fontSize: 72,
        color: "#f1737c",
        textAlign: "center",
        textDecoration: "",
        fontWeight: 500
      },
      teamOneScore: {
        x: 180,
        y: 150,
        width: 700,
        height: 370,
        fontSize: 400,
        color: "#f8f9fb",
        background: "transparent",
        textAlign: "center",
        fontWeight: 700,
        lineHeight: 1
      },
      teamTwoScore: {
        x: 1100,
        y: 150,
        width: 700,
        height: 370,
        fontSize: 400,
        color: "#f8f9fb",
        background: "transparent",
        textAlign: "center",
        fontWeight: 700,
        lineHeight: 1
      },
      timer: {
        x: 450,
        y: 510,
        width: 1100,
        height: 450,
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
        color: "#4e7de5",
        textDecoration: "underline",
        fontWeight: 500
      },
      teamTwoName: {
        x: 1218,
        y: 28,
        width: 560,
        height: 54,
        fontSize: 52,
        color: "#f1737c",
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
      timer: {
        x: 503,
        y: 483,
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
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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

export function DisplayView({ state, connected }: DisplayViewProps) {
  const query = new URLSearchParams(window.location.search);
  const sport = (query.get("sport") ?? "volleyball").toLowerCase();
  const layout = DISPLAY_LAYOUTS[sport] ?? DISPLAY_LAYOUTS.volleyball;

  return (
    <main className="tv-display-root">
      <div className="tv-stage-shell">
        <section className="tv-stage">
          <img className="tv-background-image" src={layout.backgroundImage} alt="" />
          <section className="tv-overlay-layer">
            <p className="tv-overlay-text" style={toElementStyle(layout.elements.teamOneName)}>
              My team name
            </p>
            <p className="tv-overlay-text" style={toElementStyle(layout.elements.teamTwoName)}>
              Other team name
            </p>
            <p className="tv-overlay-text tv-centered-value" style={toElementStyle(layout.elements.teamOneScore)}>
              {state.homeScore}
            </p>
            <p className="tv-overlay-text tv-centered-value" style={toElementStyle(layout.elements.teamTwoScore)}>
              {state.visitorScore}
            </p>
            <p className="tv-overlay-text tv-centered-value" style={toElementStyle(layout.elements.timer)}>
              {formatClock(state.clockSecondsRemaining)}
            </p>
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
