import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";

type ScoreboardState = {
  homeScore: number;
  visitorScore: number;
  homeTeamName: string;
  visitorTeamName: string;
  maxTimeoutsPerTeam: number;
  timeoutDurationSeconds: number;
  maxSetsWon: number;
  homeTimeoutsTaken: number;
  visitorTimeoutsTaken: number;
  homeSetsWon: number;
  visitorSetsWon: number;
  clockSecondsRemaining: number;
  clockRunning: boolean;
  updatedAt: string;
};

const app = express();
const httpServer = createServer(app);
const MAX_TEAM_NAME_LENGTH = 25;
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ["websocket"]
});

const state: ScoreboardState = {
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

let clockInterval: NodeJS.Timeout | null = null;

const emitState = () => {
  state.updatedAt = new Date().toISOString();
  io.emit("state:update", state);
};

const setScore = (team: "home" | "visitor", score: number) => {
  const next = Math.max(0, Math.floor(score));
  if (team === "home") {
    state.homeScore = next;
  } else {
    state.visitorScore = next;
  }
  emitState();
};

const sanitizeTeamName = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim().slice(0, MAX_TEAM_NAME_LENGTH);
  return trimmed.length > 0 ? trimmed : fallback;
};

const setTeamNames = (homeTeamName: unknown, visitorTeamName: unknown) => {
  state.homeTeamName = sanitizeTeamName(homeTeamName, state.homeTeamName);
  state.visitorTeamName = sanitizeTeamName(visitorTeamName, state.visitorTeamName);
  emitState();
};

const sanitizePositiveInteger = (value: unknown, fallback: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  const next = Math.max(1, Math.floor(value));
  return next;
};

const stopClockInterval = () => {
  if (!clockInterval) return;
  clearInterval(clockInterval);
  clockInterval = null;
};

const stopClock = () => {
  state.clockRunning = false;
  stopClockInterval();
  emitState();
};

const setClock = (seconds: number) => {
  state.clockSecondsRemaining = Math.max(0, Math.floor(seconds));
  emitState();
};

const setMatchConfiguration = (
  maxTimeoutsPerTeam: unknown,
  timeoutDurationSeconds: unknown,
  maxSetsWon: unknown
) => {
  state.maxTimeoutsPerTeam = sanitizePositiveInteger(maxTimeoutsPerTeam, state.maxTimeoutsPerTeam);
  state.timeoutDurationSeconds = sanitizePositiveInteger(timeoutDurationSeconds, state.timeoutDurationSeconds);
  state.maxSetsWon = sanitizePositiveInteger(maxSetsWon, state.maxSetsWon);

  state.homeTimeoutsTaken = Math.min(state.homeTimeoutsTaken, state.maxTimeoutsPerTeam);
  state.visitorTimeoutsTaken = Math.min(state.visitorTimeoutsTaken, state.maxTimeoutsPerTeam);
  state.homeSetsWon = Math.min(state.homeSetsWon, state.maxSetsWon);
  state.visitorSetsWon = Math.min(state.visitorSetsWon, state.maxSetsWon);
  emitState();
};

const startClock = () => {
  if (state.clockRunning || state.clockSecondsRemaining <= 0) {
    emitState();
    return;
  }

  state.clockRunning = true;
  emitState();
  clockInterval = setInterval(() => {
    if (!state.clockRunning) {
      stopClockInterval();
      return;
    }

    if (state.clockSecondsRemaining <= 0) {
      stopClock();
      return;
    }

    state.clockSecondsRemaining -= 1;
    if (state.clockSecondsRemaining <= 0) {
      state.clockSecondsRemaining = 0;
      stopClock();
      return;
    }

    emitState();
  }, 1000);
};

const takeTeamTimeout = (team: "home" | "visitor") => {
  const timeoutCountField = team === "home" ? "homeTimeoutsTaken" : "visitorTimeoutsTaken";
  if (state[timeoutCountField] >= state.maxTimeoutsPerTeam) {
    emitState();
    return;
  }

  state[timeoutCountField] += 1;
  stopClockInterval();
  state.clockRunning = false;
  state.clockSecondsRemaining = state.timeoutDurationSeconds;
  emitState();
  startClock();
};

const awardSet = (team: "home" | "visitor") => {
  const setsWonField = team === "home" ? "homeSetsWon" : "visitorSetsWon";
  if (state[setsWonField] >= state.maxSetsWon) {
    emitState();
    return;
  }

  if (team === "home") {
    state.homeSetsWon += 1;
  } else {
    state.visitorSetsWon += 1;
  }

  // Start-of-set baseline: timeout usage is tracked per set.
  state.homeTimeoutsTaken = 0;
  state.visitorTimeoutsTaken = 0;
  emitState();
};

io.on("connection", (socket) => {
  socket.emit("state:update", state);

  socket.on("controller:incrementHome", (delta: number = 1) => {
    setScore("home", state.homeScore + delta);
  });

  socket.on("controller:incrementVisitor", (delta: number = 1) => {
    setScore("visitor", state.visitorScore + delta);
  });

  socket.on("controller:setHomeScore", (nextScore: number) => {
    setScore("home", nextScore);
  });

  socket.on("controller:setVisitorScore", (nextScore: number) => {
    setScore("visitor", nextScore);
  });

  socket.on("controller:resetScores", () => {
    setScore("home", 0);
    setScore("visitor", 0);
  });

  socket.on("controller:setClock", (seconds: number) => {
    setClock(seconds);
  });

  socket.on("controller:startClock", () => {
    startClock();
  });

  socket.on("controller:stopClock", () => {
    stopClock();
  });

  socket.on("controller:setClockAndStart", (seconds: number) => {
    stopClockInterval();
    state.clockRunning = false;
    setClock(seconds);
    startClock();
  });

  socket.on("controller:takeHomeTimeout", () => {
    takeTeamTimeout("home");
  });

  socket.on("controller:takeVisitorTimeout", () => {
    takeTeamTimeout("visitor");
  });

  socket.on("controller:awardHomeSet", () => {
    awardSet("home");
  });

  socket.on("controller:awardVisitorSet", () => {
    awardSet("visitor");
  });

  socket.on(
    "controller:setMatchConfiguration",
    (payload: { maxTimeoutsPerTeam?: number; timeoutDurationSeconds?: number; maxSetsWon?: number } = {}) => {
      setMatchConfiguration(payload.maxTimeoutsPerTeam, payload.timeoutDurationSeconds, payload.maxSetsWon);
    }
  );

  socket.on(
    "controller:setTeamNames",
    (payload: { homeTeamName?: string; visitorTeamName?: string } = {}) => {
      setTeamNames(payload.homeTeamName, payload.visitorTeamName);
    }
  );
});

app.get("/api/state", (_req, res) => {
  res.json(state);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");

app.use(express.static(distDir));

app.use((_req, res) => {
  res.sendFile(path.join(distDir, "index.html"), (err) => {
    if (!err) return;

    res.status(200).send(
      [
        "Scoreboard server is running.",
        "Build the UI first with: npm run build",
        "Then open /display (TV) and /controller (tablet)."
      ].join("\n")
    );
  });
});

const port = Number(process.env.PORT ?? 3000);
httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Scoreboard host listening on http://0.0.0.0:${port}`);
});
