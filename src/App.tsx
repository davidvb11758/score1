import { useEffect, useMemo, useState } from "react";
import { socket } from "./socket";
import type { ScoreboardState, TeamSide } from "./types";
import { DisplayView } from "./components/DisplayView";
import { ControllerView } from "./components/ControllerView";

const initialState: ScoreboardState = {
  homeScore: 0,
  visitorScore: 0,
  homeTeamName: "My team name",
  visitorTeamName: "Other team name",
  maxTimeoutsPerTeam: 2,
  timeoutDurationSeconds: 60,
  maxSetsWon: 2,
  homeTimeoutsTaken: 0,
  visitorTimeoutsTaken: 0,
  homeSetsWon: 0,
  visitorSetsWon: 0,
  clockSecondsRemaining: 180,
  clockRunning: false,
  updatedAt: new Date().toISOString()
};

export function App() {
  const [state, setState] = useState<ScoreboardState>(initialState);
  const [connected, setConnected] = useState(socket.connected);
  const pathname = useMemo(() => window.location.pathname.toLowerCase(), []);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleStateUpdate = (nextState: ScoreboardState) => setState(nextState);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("state:update", handleStateUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("state:update", handleStateUpdate);
    };
  }, []);

  const changeScore = (side: TeamSide, delta: number) => {
    const eventName = side === "home" ? "controller:incrementHome" : "controller:incrementVisitor";
    socket.emit(eventName, delta);
  };

  const startClock = () => socket.emit("controller:startClock");
  const stopClock = () => socket.emit("controller:stopClock");
  const setClock = (seconds: number) => socket.emit("controller:setClock", seconds);
  const setTeamNames = (homeTeamName: string, visitorTeamName: string) => {
    socket.emit("controller:setTeamNames", { homeTeamName, visitorTeamName });
  };
  const setMatchConfiguration = (
    maxTimeoutsPerTeam: number,
    timeoutDurationSeconds: number,
    maxSetsWon: number
  ) => {
    socket.emit("controller:setMatchConfiguration", {
      maxTimeoutsPerTeam,
      timeoutDurationSeconds,
      maxSetsWon
    });
  };
  const takeTimeout = (side: TeamSide) => {
    socket.emit(side === "home" ? "controller:takeHomeTimeout" : "controller:takeVisitorTimeout");
  };
  const awardSet = (side: TeamSide) => {
    socket.emit(side === "home" ? "controller:awardHomeSet" : "controller:awardVisitorSet");
  };

  if (pathname === "/display") {
    return <DisplayView state={state} connected={connected} />;
  }

  if (pathname === "/controller") {
    return (
      <ControllerView
        state={state}
        connected={connected}
        onChangeScore={changeScore}
        onStartClock={startClock}
        onStopClock={stopClock}
        onSetClock={setClock}
        onSetTeamNames={setTeamNames}
        onSetMatchConfiguration={setMatchConfiguration}
        onTakeTimeout={takeTimeout}
        onAwardSet={awardSet}
      />
    );
  }

  return (
    <main className="landing">
      <h1>Scoreboard Controller Prototype</h1>
      <p>
        Open <code>/display</code> on the TV browser and <code>/controller</code> on the tablet.
      </p>
      <ul>
        <li>
          <a href="/display">TV Display</a>
        </li>
        <li>
          <a href="/controller">Tablet Controller</a>
        </li>
      </ul>
      <p className={connected ? "status-ok" : "status-bad"}>
        Socket status: {connected ? "connected" : "disconnected"}
      </p>
    </main>
  );
}
