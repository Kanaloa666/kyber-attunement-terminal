// ====== CONFIG ======
const BLACK_RARE_CHANCE = 0.02;
const RARE_GLITCH_CHANCE = 0.00;
const SESSION_PREFIX = "BSP";

// ====== STATE ======
const state = {
  page: 1,
  answers: { q1: null, q2: null, q3: null },
  scores: { Yellow: 0, Blue: 0, Green: 0, Red: 0, Black: 0 },
  result: null
};

const pages = ["p1", "p2", "p3", "p4", "p5", "p6", "p7"];
const $ = (id) => document.getElementById(id);

// ====== AUDIO CONTROL ======
let audioReady = false;

function unlockAudio() {
  if (audioReady) return;
  audioReady = true;

  const startup = $("startup");
  const hum = $("hum");
  const lockin = $("lockin");

  startup.volume = 0.60;
  hum.volume = 0.18;
  lockin.volume = 0.55;

  startup.load();
  hum.load();
  lockin.load();
}

async function startSequence() {
  unlockAudio();

  const startup = $("startup");
  const hum = $("hum");

  try {
    startup.currentTime = 0;
    await startup.play();

    setTimeout(() => {
      hum.currentTime = 0;
      hum.play().catch(() => {});
    }, 150);
  } catch (e) {
    hum.play().catch(() => {});
  }
}

function setHum(level) {
  const hum = $("hum");
  if (!hum) return;
  hum.volume = Math.max(0, Math.min(1, level));
}

function playLockIn() {
  const lockin = $("lockin");
  if (!lockin) return;
  lockin.currentTime = 0;
  lockin.play().catch(() => {});
}

// ====== UI HELPERS ======
function randId() {
  const s = Math.random().toString(36).slice(2, 6).toUpperCase();
  const t = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${SESSION_PREFIX}-${s}${t}`;
}

function staticGlitch() {
  const el = $("static");
  el.classList.remove("on");
  void el.offsetWidth;
  el.classList.add("on");
  setTimeout(() => el.classList.remove("on"), 520);
}

function setHeader(title, status) {
  $("panelTitle").textContent = title;
  $("panelStatus").textContent = status;
}

function driftWobble() {
  const el = $("drift");
  if (!el) return;
  const w = 52 + Math.random() * 18;
  el.style.width = `${w.toFixed(0)}%`;
}

function go(n, opts = {}) {
  pages.forEach((pid) => $(pid).classList.add("hidden"));
  $(`p${n}`).classList.remove("hidden");
  state.page = n;

  if (opts.glitch) staticGlitch();

  if (audioReady) {
    if (n === 6) setHum(0.24);
    else if (n === 7) setHum(0.18);
    else setHum(0.18);
  }

  switch (n) {
    case 1:
      setHeader("KYBER ATTUNEMENT PROTOCOL", "STANDBY");
      break;
    case 2:
      setHeader("RESONANCE FIELD MONITOR", "LOCKED");
      driftWobble();
      break;
    case 3:
      setHeader("ATTUNEMENT // PHASE I", "INPUT REQUIRED");
      break;
    case 4:
      setHeader("ATTUNEMENT // PHASE II", "INPUT REQUIRED");
      break;
    case 5:
      setHeader("ATTUNEMENT // PHASE III", "INPUT REQUIRED");
      break;
    case 6:
      setHeader("CALIBRATION // ANALYSIS", "RUNNING");
      runLoadingThenResult();
      break;
    case 7:
      setHeader("RESULT // KYBER RECOMMENDATION", "COMPLETE");
      break;
    default:
      break;
  }
}

function answer(q, v) {
  state.answers[q] = v;
  staticGlitch();

  if (q === "q1") go(4);
  if (q === "q2") go(5);
  if (q === "q3") go(6);
}

// ====== SCORING ======
function score() {
  for (const k of Object.keys(state.scores)) state.scores[k] = 0;

  const { q1, q2, q3 } = state.answers;

  if (q1 === "protect") {
    state.scores.Blue += 3;
    state.scores.Green += 1;
  }
  if (q1 === "observe") {
    state.scores.Green += 3;
    state.scores.Yellow += 1;
  }
  if (q1 === "act") {
    state.scores.Red += 3;
    state.scores.Yellow += 1;
  }

  if (q2 === "responsibility") {
    state.scores.Blue += 3;
    state.scores.Green += 1;
  }
  if (q2 === "tool") {
    state.scores.Yellow += 3;
    state.scores.Green += 1;
  }
  if (q2 === "weapon") {
    state.scores.Red += 3;
    state.scores.Yellow += 1;
  }

  if (q3 === "loyalty") {
    state.scores.Blue += 3;
    state.scores.Green += 1;
  }
  if (q3 === "knowledge") {
    state.scores.Green += 3;
    state.scores.Yellow += 1;
  }
  if (q3 === "freedom") {
    state.scores.Yellow += 3;
    state.scores.Red += 1;
  }

  if (Math.random() < RARE_GLITCH_CHANCE) {
    const keys = ["Yellow", "Blue", "Green", "Red"];
    state.scores[keys[(Math.random() * keys.length) | 0]] += 1;
  }

  if (Math.random() < BLACK_RARE_CHANCE) {
    state.result = "Black";
    return "Black";
  }

  const pref = ["Yellow", "Blue", "Green", "Red"];
  let best = pref[0];
  let bestScore = -Infinity;

  for (const k of pref) {
    const s = state.scores[k];
    if (s > bestScore) {
      bestScore = s;
      best = k;
    }
  }

  state.result = best;
  return best;
}

function loreFor(color) {
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

  return lore[color] || lore.Yellow;
}

function colorToCSS(color) {
  return {
    Yellow: "var(--c-yellow)",
    Blue: "var(--c-blue)",
    Green: "var(--c-green)",
    Red: "var(--c-red)",
    Black: "var(--c-black)"
  }[color] || "var(--accent)";
}

// ====== LOADING + RESULT ======
function runLoadingThenResult() {
  const color = score();

  const bar = $("barFill");
  const loadText = $("loadText");
  const loadLines = $("loadLines");

  let p = 0;
  bar.style.width = "0%";

  const steps = [
    {
      t: "Sampling field harmonics…",
      lines: ["establishing baseline…", "correcting drift…", "isolating signature…"]
    },
    {
      t: "Filtering atmospheric interference…",
      lines: ["shielding coils…", "phase matching…", "rejecting noise…"]
    },
    {
      t: "Aligning kyber lattice…",
      lines: ["harmonics stabilized…", "signal lock acquired…", "final comparison…"]
    },
    {
      t: "Finalizing recommendation…",
      lines: ["mapping signature…", "confirming output…", "transfer ready…"]
    }
  ];

  if (color === "Black") {
    steps[1].t = "WARNING: anomalous silence detected…";
    steps[2].t = "Containment routines failing…";
    steps[3].t = "FORCING RECOMMENDATION…";
    steps[1].lines = ["signal dropped to zero…", "reacquiring…", "do not interrupt…"];
    steps[2].lines = ["lattice pressure rising…", "field destabilizing…", "hold steady…"];
    steps[3].lines = ["no match found…", "accepting void…", "transfer ready…"];
  }

  let stepIdx = 0;

  const timer = setInterval(() => {
    p += 3 + Math.random() * 7;
    if (p > 100) p = 100;
    bar.style.width = `${p.toFixed(0)}%`;

    if (p > 25 && stepIdx === 0) stepIdx = 1;
    if (p > 50 && stepIdx === 1) stepIdx = 2;
    if (p > 75 && stepIdx === 2) stepIdx = 3;

    const s = steps[stepIdx];
    loadText.textContent = s.t;
    loadLines.innerHTML = `&gt; ${s.lines[0]}<br/>&gt; ${s.lines[1]}<br/>&gt; ${s.lines[2]}`;

    if (color === "Black") {
      if (Math.random() < 0.35) staticGlitch();
    } else {
      if (Math.random() < 0.12) staticGlitch();
    }

    if (p >= 100) {
      clearInterval(timer);
      setTimeout(() => renderResult(color), 450);
    }
  }, 140);
}

function renderResult(color) {
  playLockIn();

  const l = loreFor(color);
  $("resultName").textContent = l.title;
  $("resultLore").textContent = l.text;

  const c = colorToCSS(color);
  $("glow").style.background = `radial-gradient(circle at 50% 30%, ${c}, transparent 62%)`;

  if (color === "Black") {
    $("resultSubtitle").textContent = "The terminal did not expect this. Proceed carefully.";
    staticGlitch();
    setTimeout(staticGlitch, 160);
    setTimeout(staticGlitch, 320);
  } else {
    $("resultSubtitle").textContent = "The terminal has a recommendation. The choice is still yours.";
  }

  go(7, { glitch: true });
}

function toggleOverride(on) {
  $("overridePanel").classList.toggle("hidden", !on);
  if (on) staticGlitch();
}

function accept() {
  staticGlitch();
  alert(`Alignment accepted: ${state.result}\n\nPresent the chamber.\nReceive the crystal.`);
}

function manualPick(color) {
  staticGlitch();

  const l = loreFor(color);
  $("resultName").textContent = `${l.title} (Manual Selection)`;
  $("resultLore").textContent = `Chosen by will, not signal.\n${l.text}`;

  const c = colorToCSS(color);
  $("glow").style.background = `radial-gradient(circle at 50% 30%, ${c}, transparent 62%)`;

  $("resultSubtitle").textContent =
    "Override accepted. The Force is vast—and sometimes it whispers differently.";

  toggleOverride(false);
}

function softReset() {
  staticGlitch();
  state.answers = { q1: null, q2: null, q3: null };
  state.result = null;
  toggleOverride(false);
  go(1);
}

// init
$("sessionId").textContent = randId();
go(1);
