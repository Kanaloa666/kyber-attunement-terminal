const $ = (id) => document.getElementById(id);

const state = {
  answers: {
    q1: null,
    q2: null,
    q3: null
  },
  secretUnlocked: false,
  secretDotClicks: 0,
  secretSessionClicks: 0,
  secretRingPress: false,
  result: null
};

function staticGlitch() {
  const el = $("static");
  el.classList.remove("on");
  void el.offsetWidth;
  el.classList.add("on");
  setTimeout(() => el.classList.remove("on"), 500);
}

function go(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.add("hidden"));

  const target = $(pageId);
  if (target) {
    target.classList.remove("hidden");
  }
}

function randId() {
  const a = Math.random().toString(36).slice(2, 6).toUpperCase();
  const b = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BSP-${a}${b}`;
}

function resetState() {
  state.answers = {
    q1: null,
    q2: null,
    q3: null
  };

  state.secretUnlocked = false;
  state.secretDotClicks = 0;
  state.secretSessionClicks = 0;
  state.secretRingPress = false;
  state.result = null;

  $("hiddenPrompt").classList.add("hidden");
}

function setHeader(title, status) {
  $("panelTitle").textContent = title;
  $("panelStatus").textContent = status;
}

function scoreResult() {
  const scores = {
    Yellow: 0,
    Blue: 0,
    Green: 0,
    Red: 0
  };

  const q1 = state.answers.q1;
  const q2 = state.answers.q2;
  const q3 = state.answers.q3;

  if (q1 === "protect") {
    scores.Blue += 3;
    scores.Green += 1;
  }
  if (q1 === "observe") {
    scores.Green += 3;
    scores.Yellow += 1;
  }
  if (q1 === "act") {
    scores.Red += 3;
    scores.Yellow += 1;
  }

  if (q2 === "responsibility") {
    scores.Blue += 3;
    scores.Green += 1;
  }
  if (q2 === "tool") {
    scores.Yellow += 3;
    scores.Green += 1;
  }
  if (q2 === "weapon") {
    scores.Red += 3;
    scores.Yellow += 1;
  }

  if (q3 === "loyalty") {
    scores.Blue += 3;
    scores.Green += 1;
  }
  if (q3 === "knowledge") {
    scores.Green += 3;
    scores.Yellow += 1;
  }
  if (q3 === "freedom") {
    scores.Yellow += 3;
    scores.Red += 1;
  }

  let bestColor = "Yellow";
  let bestScore = -1;

  ["Yellow", "Blue", "Green", "Red"].forEach((color) => {
    if (scores[color] > bestScore) {
      bestScore = scores[color];
      bestColor = color;
    }
  });

  return bestColor;
}

function getLore(color) {
  const lore = {
    Yellow: {
      title: "YELLOW — The Choice of the True",
      text: "Clarity without cruelty. Purpose without noise.\nYou move with intent—and Batuu doesn’t miss it."
    },
    Blue: {
      title: "BLUE — The Oath of the Guardian",
      text: "You stand when others step back.\nThe crystal answers your steadiness, like a beacon through dust storms."
    },
    Green: {
      title: "GREEN — The Quiet Current",
      text: "Patience is not hesitation. Wisdom is not softness.\nYour resonance is steady—like stone warmed by twin suns."
    },
    Red: {
      title: "RED — The Claim of Power",
      text: "The field sharpens around you.\nIt does not ask permission. It waits to see if you will take what you want."
    },
    Black: {
      title: "BLACK — The Void Answered",
      text: "A silence behind the signal.\nSomething ancient stirs in the lattice.\nKeep your grip—Batuu remembers what it feeds."
    }
  };

  return lore[color];
}

function getGlow(color) {
  const map = {
    Yellow: "#ffd24a",
    Blue: "#4aa3ff",
    Green: "#44ff8a",
    Red: "#ff4a4a",
    Black: "#8a8a8a"
  };

  return map[color] || "#4aa3ff";
}

function showResult() {
  const color = state.secretUnlocked ? "Black" : scoreResult();
  state.result = color;

  const lore = getLore(color);

  $("resultName").textContent = lore.title;
  $("resultLore").textContent = lore.text;
  $("glow").style.background = `radial-gradient(circle at 50% 30%, ${getGlow(color)}, transparent 62%)`;

  if (color === "Black") {
    $("resultSubtitle").textContent = "An anomaly answered the call.";
    staticGlitch();
    setTimeout(staticGlitch, 180);
    setTimeout(staticGlitch, 320);
    setHeader("RESULT // ANOMALY DETECTED", "UNSTABLE");
  } else {
    $("resultSubtitle").textContent = "The terminal has identified a likely resonance path.";
    setHeader("RESULT // KYBER RECOMMENDATION", "COMPLETE");
  }

  go("p7");
}

function runLoadingSequence() {
  go("p6");
  setHeader("CALIBRATION // ANALYSIS", "RUNNING");

  const bar = $("barFill");
  const loadText = $("loadText");
  const loadLines = $("loadLines");

  let progress = 0;

  const steps = [
    {
      text: "Sampling field harmonics…",
      lines: ["establishing baseline…", "correcting drift…", "isolating signature…"]
    },
    {
      text: "Filtering atmospheric interference…",
      lines: ["shielding coils…", "phase matching…", "rejecting noise…"]
    },
    {
      text: "Aligning kyber lattice…",
      lines: ["harmonics stabilized…", "signal lock acquired…", "final comparison…"]
    },
    {
      text: "Finalizing recommendation…",
      lines: ["mapping signature…", "confirming output…", "transfer ready…"]
    }
  ];

  if (state.secretUnlocked) {
    steps[1].text = "WARNING: anomalous silence detected…";
    steps[1].lines = ["signal dropped to zero…", "reacquiring…", "do not interrupt…"];

    steps[2].text = "Containment routines failing…";
    steps[2].lines = ["lattice pressure rising…", "field destabilizing…", "hold steady…"];

    steps[3].text = "Forcing recommendation…";
    steps[3].lines = ["no match found…", "accepting void…", "transfer ready…"];
  }

  const timer = setInterval(() => {
    progress += 6;
    if (progress > 100) progress = 100;

    bar.style.width = `${progress}%`;

    let stepIndex = 0;
    if (progress > 25) stepIndex = 1;
    if (progress > 50) stepIndex = 2;
    if (progress > 75) stepIndex = 3;

    const step = steps[stepIndex];
    loadText.textContent = step.text;
    loadLines.innerHTML = `&gt; ${step.lines[0]}<br />&gt; ${step.lines[1]}<br />&gt; ${step.lines[2]}`;

    if (state.secretUnlocked) {
      if (Math.random() < 0.4) staticGlitch();
    } else {
      if (Math.random() < 0.18) staticGlitch();
    }

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(showResult, 500);
    }
  }, 120);
}

function tryUnlockSecret() {
  if (
    state.secretDotClicks >= 3 &&
    state.secretSessionClicks >= 1 &&
    state.secretRingPress === true
  ) {
    $("hiddenPrompt").classList.remove("hidden");
    staticGlitch();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $("sessionId").textContent = randId();

  go("p1");
  setHeader("KYBER ATTUNEMENT PROTOCOL", "STANDBY");

  $("beginBtn").addEventListener("click", () => {
    staticGlitch();
    go("p2");
    setHeader("RESONANCE FIELD MONITOR", "LOCKED");
  });

  $("toQ1Btn").addEventListener("click", () => {
    staticGlitch();
    go("p3");
    setHeader("ATTUNEMENT // PHASE I", "INPUT REQUIRED");
  });

  $("backToStartBtn").addEventListener("click", () => {
    staticGlitch();
    go("p1");
    setHeader("KYBER ATTUNEMENT PROTOCOL", "STANDBY");
  });

  document.querySelectorAll(".choice").forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.q;
      const answer = button.dataset.a;

      state.answers[question] = answer;
      staticGlitch();

      if (question === "q1") {
        go("p4");
        setHeader("ATTUNEMENT // PHASE II", "INPUT REQUIRED");
      } else if (question === "q2") {
        go("p5");
        setHeader("ATTUNEMENT // PHASE III", "INPUT REQUIRED");
      } else if (question === "q3") {
        runLoadingSequence();
      }
    });
  });

  $("restartBtn").addEventListener("click", () => {
    staticGlitch();
    resetState();
    go("p1");
    setHeader("KYBER ATTUNEMENT PROTOCOL", "STANDBY");
  });

  $("statusDot").addEventListener("click", () => {
    state.secretDotClicks += 1;
    staticGlitch();
    tryUnlockSecret();
  });

  $("sessionId").addEventListener("click", () => {
    state.secretSessionClicks += 1;
    staticGlitch();
    tryUnlockSecret();
  });

  $("mainRing").addEventListener("mousedown", () => {
    state.secretRingPress = true;
    tryUnlockSecret();
  });

  $("mainRing").addEventListener("touchstart", () => {
    state.secretRingPress = true;
    tryUnlockSecret();
  });

  $("blackAcceptBtn").addEventListener("click", () => {
    state.secretUnlocked = true;
    $("hiddenPrompt").classList.add("hidden");
    staticGlitch();
    go("p2");
    setHeader("RESONANCE FIELD MONITOR", "ANOMALY LOCKED");
  });

  $("blackDeclineBtn").addEventListener("click", () => {
    $("hiddenPrompt").classList.add("hidden");
    staticGlitch();
  });
});
