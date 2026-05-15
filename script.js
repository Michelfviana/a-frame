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
const soundToggle = document.querySelector("#sound-toggle");
const core = document.querySelector("#core");
const ringA = document.querySelector("#ring-a");
const ringB = document.querySelector("#ring-b");
const caption = document.querySelector("#caption");
const orbit = document.querySelector("#orbit");

let paletteIndex = 0;
let soundEnabled = false;
let audioContext;

function setMarkerVisible(isVisible) {
  markerStatus.textContent = isVisible ? "Marcador detectado" : "Procurando marcador";
  markerStatus.classList.toggle("is-visible", isVisible);
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

  playTone();
}

function cycleGarden() {
  paletteIndex = (paletteIndex + 1) % palettes.length;
  applyPalette();
}

marker.addEventListener("markerFound", () => setMarkerVisible(true));
marker.addEventListener("markerLost", () => setMarkerVisible(false));
core.addEventListener("click", cycleGarden);

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.classList.toggle("is-on", soundEnabled);
  soundToggle.textContent = soundEnabled ? "Som on" : "Som";
  if (soundEnabled) {
    ensureAudioContext();
    playTone();
  }
});
