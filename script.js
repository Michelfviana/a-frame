const palettes = [
  {
    core: "#2ef2c2",
    emissive: "#0c6b58",
    ringA: "#ffbf47",
    ringB: "#ff4f8b",
    caption: "toque no nucleo",
  },
  {
    core: "#38d5ff",
    emissive: "#0b4c69",
    ringA: "#f8f871",
    ringB: "#ff865c",
    caption: "pulso solar",
  },
  {
    core: "#c79bff",
    emissive: "#4d237d",
    ringA: "#58ff8b",
    ringB: "#ffffff",
    caption: "modo eclipse",
  },
];

const marker = document.querySelector("#hiro-marker");
const markerStatus = document.querySelector("#marker-status");
const evolveButton = document.querySelector("#evolve-button");
const soundToggle = document.querySelector("#sound-toggle");
const core = document.querySelector("#core");
const coreHitArea = document.querySelector("#core-hit-area");
const ringA = document.querySelector("#ring-a");
const ringB = document.querySelector("#ring-b");
const caption = document.querySelector("#caption");
const orbit = document.querySelector("#orbit");
const sparkField = document.querySelector("#spark-field");

let paletteIndex = 0;
let soundEnabled = false;
let markerVisible = false;
let audioContext;
let lastInteraction = 0;

function setMarkerVisible(isVisible) {
  markerVisible = isVisible;
  markerStatus.textContent = isVisible ? "Detectado" : "Buscando Hiro";
  markerStatus.classList.toggle("is-visible", isVisible);
  evolveButton.disabled = !isVisible;
  caption.setAttribute("value", isVisible ? palettes[paletteIndex].caption : "aponte para o Hiro");
}

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playTone() {
  if (!soundEnabled) return;

  ensureAudioContext();

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(220 + paletteIndex * 110, now);
  oscillator.frequency.exponentialRampToValueAtTime(660 + paletteIndex * 90, now + 0.18);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.34);
}

function applyPalette() {
  const palette = palettes[paletteIndex];

  core.setAttribute("material", {
    color: palette.core,
    emissive: palette.emissive,
    emissiveIntensity: 0.36,
    metalness: 0.35,
    roughness: 0.18,
  });
  ringA.setAttribute("color", palette.ringA);
  ringB.setAttribute("color", palette.ringB);
  caption.setAttribute("value", palette.caption);
  orbit.setAttribute("animation", {
    property: "rotation",
    to: `0 ${paletteIndex % 2 === 0 ? -360 : 360} 0`,
    dur: 5600 + paletteIndex * 1200,
    loop: true,
    easing: "linear",
  });
  sparkField.setAttribute("animation__burst", {
    property: "scale",
    from: "0.72 0.72 0.72",
    to: "1.18 1.18 1.18",
    dur: 420,
    dir: "alternate",
    easing: "easeOutQuad",
  });
  core.setAttribute("animation__tap", {
    property: "position",
    from: "0 0.34 0",
    to: "0 0.46 0",
    dur: 240,
    dir: "alternate",
    easing: "easeOutQuad",
  });

  playTone();
}

function cycleGarden() {
  const now = performance.now();
  if (now - lastInteraction < 260) return;

  lastInteraction = now;
  paletteIndex = (paletteIndex + 1) % palettes.length;
  applyPalette();
}

marker.addEventListener("markerFound", () => setMarkerVisible(true));
marker.addEventListener("markerLost", () => setMarkerVisible(false));
core.addEventListener("click", cycleGarden);
coreHitArea.addEventListener("click", cycleGarden);
evolveButton.addEventListener("click", cycleGarden);

document.querySelector("a-scene").addEventListener("touchend", (event) => {
  if (!markerVisible || event.target.closest("button, a")) return;
  cycleGarden();
});

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.classList.toggle("is-on", soundEnabled);
  soundToggle.textContent = soundEnabled ? "Som on" : "Som";
  if (soundEnabled) {
    ensureAudioContext();
    playTone();
  }
});
