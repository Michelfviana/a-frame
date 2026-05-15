const palettes = [
  {
    name: "Sol",
    mission: "Energia caindo",
    core: "#facc15",
    emissive: "#8a3c00",
    crystal: "#fff7ad",
    ringA: "#ff8a1f",
    ringB: "#facc15",
    ringC: "#ffffff",
    petal: "#ffbf47",
    beam: "#f97316",
    base: "#241106",
    astrophage: "#ff8a1f",
    ship: "#dbeafe",
    frequency: 247,
    caption: "Sol em colapso",
  },
  {
    name: "Astrophage",
    mission: "Enxame detectado",
    core: "#ff4f00",
    emissive: "#7a1900",
    crystal: "#ffd29a",
    ringA: "#ff7a18",
    ringB: "#ffce45",
    ringC: "#ffedd5",
    petal: "#ff8a1f",
    beam: "#ff4f00",
    base: "#210c04",
    astrophage: "#ffcf33",
    ship: "#f8fafc",
    frequency: 330,
    caption: "devorador de estrelas",
  },
  {
    name: "Hail Mary",
    mission: "Nave em curso",
    core: "#60a5fa",
    emissive: "#0d2d63",
    crystal: "#e0f2fe",
    ringA: "#38bdf8",
    ringB: "#dbeafe",
    ringC: "#93c5fd",
    petal: "#60a5fa",
    beam: "#38bdf8",
    base: "#071526",
    astrophage: "#ff8a1f",
    ship: "#ffffff",
    frequency: 392,
    caption: "rumo a Tau Ceti",
  },
  {
    name: "Tau Ceti",
    mission: "Anomalia viva",
    core: "#2ef2c2",
    emissive: "#0c6b58",
    crystal: "#ffffff",
    ringA: "#79ffe1",
    ringB: "#38d5ff",
    ringC: "#a7f3d0",
    petal: "#79ffe1",
    beam: "#38d5ff",
    base: "#08221d",
    astrophage: "#facc15",
    ship: "#dbeafe",
    frequency: 494,
    caption: "sinal alienigena",
  },
  {
    name: "Sonda",
    mission: "Amostra capturada",
    core: "#c084fc",
    emissive: "#4d237d",
    crystal: "#f1e7ff",
    ringA: "#f0abfc",
    ringB: "#ffffff",
    ringC: "#c084fc",
    petal: "#c084fc",
    beam: "#f0abfc",
    base: "#170d25",
    astrophage: "#facc15",
    ship: "#e0f2fe",
    frequency: 587,
    caption: "dados da amostra",
  },
  {
    name: "Cura",
    mission: "Plano de retorno",
    core: "#22c55e",
    emissive: "#0f4d27",
    crystal: "#dcfce7",
    ringA: "#4ade80",
    ringB: "#60a5fa",
    ringC: "#facc15",
    petal: "#22c55e",
    beam: "#ffffff",
    base: "#071f12",
    astrophage: "#facc15",
    ship: "#ffffff",
    frequency: 659,
    caption: "salvar o Sol",
  },
];

const marker = document.querySelector("#hiro-marker");
const markerStatus = document.querySelector("#marker-status");
const modeStatus = document.querySelector("#mode-status");
const missionStatus = document.querySelector("#mission-status");
const evolveButton = document.querySelector("#evolve-button");
const soundToggle = document.querySelector("#sound-toggle");
const core = document.querySelector("#core");
const coreHitArea = document.querySelector("#core-hit-area");
const coreLight = document.querySelector("#core-light");
const innerCrystal = document.querySelector("#inner-crystal");
const ringA = document.querySelector("#ring-a");
const ringB = document.querySelector("#ring-b");
const ringC = document.querySelector("#ring-c");
const caption = document.querySelector("#caption");
const orbit = document.querySelector("#orbit");
const sparkField = document.querySelector("#spark-field");
const base = document.querySelector("#base");
const constellationField = document.querySelector("#constellation-field");
const latticeField = document.querySelector("#lattice-field");
const waveField = document.querySelector("#wave-field");
const astrophageField = document.querySelector("#astrophage-field");
const petals = document.querySelectorAll(".petal");
const beams = document.querySelectorAll(".beam");
const shipBody = document.querySelector("#ship-body");
const shipNose = document.querySelector("#ship-nose");
const shipEngine = document.querySelector("#ship-engine");
const shipPanels = document.querySelectorAll(".ship-panel");
const shipAntenna = document.querySelector(".ship-antenna");

let paletteIndex = 0;
let soundEnabled = false;
let markerVisible = false;
let audioContext;
let lastInteraction = 0;

function createEntity(parent, attributes) {
  const entity = document.createElement("a-entity");

  Object.entries(attributes).forEach(([name, value]) => {
    entity.setAttribute(name, value);
  });

  parent.appendChild(entity);
  return entity;
}

function buildGeneratedGeometry() {
  const satelliteCount = 18;
  const astrophageCount = 30;

  for (let index = 0; index < satelliteCount; index += 1) {
    const angle = (Math.PI * 2 * index) / satelliteCount;
    const radius = index % 2 === 0 ? 1.03 : 0.84;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 0.08 + (index % 3) * 0.18;

    createEntity(constellationField, {
      class: "satellite",
      geometry: `primitive: ${index % 3 === 0 ? "tetrahedron" : "sphere"}; radius: ${index % 3 === 0 ? 0.045 : 0.032}`,
      material: "color: #ffffff; emissive: #79ffe1; emissiveIntensity: 0.4; metalness: 0.25; roughness: 0.24",
      position: `${x.toFixed(3)} ${y.toFixed(3)} ${z.toFixed(3)}`,
      animation: `property: rotation; to: 360 ${index % 2 === 0 ? 180 : -180} 0; dur: ${2600 + index * 120}; loop: true; easing: linear`,
    });

    createEntity(latticeField, {
      class: "lattice-ray",
      geometry: `primitive: cylinder; radius: 0.004; height: ${radius * 1.55}; segmentsRadial: 6`,
      material: "color: #79ffe1; emissive: #79ffe1; emissiveIntensity: 0.32; transparent: true; opacity: 0.24",
      position: `${(x / 2).toFixed(3)} ${(y / 2).toFixed(3)} ${(z / 2).toFixed(3)}`,
      rotation: `86 ${(-angle * 180) / Math.PI} 0`,
    });
  }

  for (let index = 0; index < 4; index += 1) {
    createEntity(waveField, {
      class: "energy-wave",
      geometry: `primitive: torus; radius: ${0.36 + index * 0.2}; radiusTubular: 0.004; segmentsTubular: 72`,
      material: "color: #79ffe1; emissive: #79ffe1; emissiveIntensity: 0.38; transparent: true; opacity: 0.34",
      rotation: `${90 - index * 12} ${index * 28} ${index * 18}`,
      animation: `property: rotation; to: ${90 - index * 12} ${index % 2 === 0 ? 360 : -360} ${index * 18}; dur: ${7200 + index * 1600}; loop: true; easing: linear`,
    });
  }

  for (let index = 0; index < astrophageCount; index += 1) {
    const angle = (Math.PI * 2 * index) / astrophageCount;
    const radius = 0.42 + (index % 5) * 0.13;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 0.04 + ((index * 7) % 9) * 0.075;

    createEntity(astrophageField, {
      class: "astrophage",
      geometry: `primitive: dodecahedron; radius: ${0.018 + (index % 4) * 0.004}`,
      material: "color: #ff8a1f; emissive: #ff8a1f; emissiveIntensity: 0.72; metalness: 0.12; roughness: 0.18",
      position: `${x.toFixed(3)} ${y.toFixed(3)} ${z.toFixed(3)}`,
      animation: `property: scale; from: 0.65 0.65 0.65; to: 1.35 1.35 1.35; dur: ${900 + index * 38}; dir: alternate; loop: true; easing: easeInOutSine`,
    });
  }

  constellationField.setAttribute(
    "animation",
    "property: rotation; to: 0 360 0; dur: 18200; loop: true; easing: linear",
  );
  latticeField.setAttribute(
    "animation",
    "property: rotation; to: 0 -360 0; dur: 22400; loop: true; easing: linear",
  );
  astrophageField.setAttribute(
    "animation",
    "property: rotation; to: 0 360 0; dur: 11800; loop: true; easing: linear",
  );
}

function restartAnimation(element, name, config) {
  element.removeAttribute(name);
  requestAnimationFrame(() => element.setAttribute(name, config));
}

function setMarkerVisible(isVisible) {
  markerVisible = isVisible;
  markerStatus.textContent = isVisible ? "Detectado" : "Buscando Hiro";
  markerStatus.classList.toggle("is-visible", isVisible);
  evolveButton.disabled = !isVisible;
  modeStatus.textContent = palettes[paletteIndex].name;
  missionStatus.textContent = palettes[paletteIndex].mission;
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
  const palette = palettes[paletteIndex];
  const masterGain = audioContext.createGain();

  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
  masterGain.connect(audioContext.destination);

  [1, 1.5, 2].forEach((ratio, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(palette.frequency * ratio, now + index * 0.03);
    oscillator.frequency.exponentialRampToValueAtTime(palette.frequency * ratio * 1.18, now + 0.28);
    gain.gain.setValueAtTime(index === 0 ? 0.8 : 0.36, now);

    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(now + index * 0.03);
    oscillator.stop(now + 0.62);
  });
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
  ringC.setAttribute("color", palette.ringC);
  base.setAttribute("color", palette.base);
  caption.setAttribute("value", palette.caption);
  modeStatus.textContent = palette.name;
  missionStatus.textContent = palette.mission;
  innerCrystal.setAttribute("material", {
    color: palette.crystal,
    emissive: palette.ringC,
    emissiveIntensity: 0.72,
    metalness: 0.2,
    roughness: 0.12,
  });
  coreLight.setAttribute("light", {
    type: "point",
    intensity: 1.8 + paletteIndex * 0.18,
    distance: 2.6,
    color: palette.ringC,
  });
  petals.forEach((petal, index) => {
    petal.setAttribute("material", {
      color: index % 2 === 0 ? palette.petal : palette.ringA,
      emissive: palette.emissive,
      emissiveIntensity: 0.22,
      metalness: 0.12,
      roughness: 0.3,
      transparent: true,
      opacity: 0.86,
    });
  });
  beams.forEach((beam) => {
    beam.setAttribute("material", {
      color: palette.beam,
      emissive: palette.beam,
      emissiveIntensity: 0.48,
      transparent: true,
      opacity: 0.34,
      roughness: 0.2,
    });
  });
  shipBody.setAttribute("material", {
    color: palette.ship,
    metalness: 0.65,
    roughness: 0.22,
  });
  shipNose.setAttribute("material", {
    color: palette.crystal,
    metalness: 0.5,
    roughness: 0.18,
  });
  shipEngine.setAttribute("material", {
    color: "#101923",
    emissive: palette.astrophage,
    emissiveIntensity: 1.1,
    metalness: 0.4,
    roughness: 0.25,
  });
  shipPanels.forEach((panel, index) => {
    panel.setAttribute("material", {
      color: index % 2 === 0 ? "#1e40af" : "#0f766e",
      emissive: palette.beam,
      emissiveIntensity: 0.3,
      metalness: 0.15,
      roughness: 0.28,
    });
  });
  shipAntenna.setAttribute("material", {
    color: palette.crystal,
    emissive: palette.ringC,
    emissiveIntensity: 0.32,
  });
  document.querySelectorAll(".satellite").forEach((satellite, index) => {
    satellite.setAttribute("material", {
      color: index % 2 === 0 ? palette.crystal : palette.ringA,
      emissive: index % 3 === 0 ? palette.ringC : palette.beam,
      emissiveIntensity: 0.42,
      metalness: 0.25,
      roughness: 0.24,
    });
  });
  document.querySelectorAll(".lattice-ray").forEach((ray, index) => {
    ray.setAttribute("material", {
      color: index % 2 === 0 ? palette.ringC : palette.ringA,
      emissive: palette.ringC,
      emissiveIntensity: 0.34,
      transparent: true,
      opacity: 0.16 + (paletteIndex % 3) * 0.05,
    });
  });
  document.querySelectorAll(".energy-wave").forEach((wave, index) => {
    wave.setAttribute("material", {
      color: index % 2 === 0 ? palette.ringC : palette.ringB,
      emissive: palette.ringC,
      emissiveIntensity: 0.44,
      transparent: true,
      opacity: 0.24 + index * 0.04,
    });
  });
  document.querySelectorAll(".astrophage").forEach((particle, index) => {
    particle.setAttribute("material", {
      color: index % 3 === 0 ? palette.astrophage : palette.ringA,
      emissive: palette.astrophage,
      emissiveIntensity: 0.62 + (index % 4) * 0.08,
      metalness: 0.12,
      roughness: 0.18,
    });
  });
  orbit.setAttribute("animation", {
    property: "rotation",
    to: `0 ${paletteIndex % 2 === 0 ? -360 : 360} 0`,
    dur: 5600 + paletteIndex * 1200,
    loop: true,
    easing: "linear",
  });
  restartAnimation(sparkField, "animation__burst", {
    property: "scale",
    from: "0.72 0.72 0.72",
    to: "1.18 1.18 1.18",
    dur: 420,
    dir: "alternate",
    easing: "easeOutQuad",
  });
  restartAnimation(core, "animation__tap", {
    property: "position",
    from: "0 0.34 0",
    to: "0 0.46 0",
    dur: 240,
    dir: "alternate",
    easing: "easeOutQuad",
  });
  restartAnimation(innerCrystal, "animation__flare", {
    property: "scale",
    from: "0.72 0.72 0.72",
    to: "1.35 1.35 1.35",
    dur: 360,
    dir: "alternate",
    easing: "easeOutQuad",
  });
  restartAnimation(ringC, "animation__flare", {
    property: "scale",
    from: "0.7 0.7 0.7",
    to: "1.18 1.18 1.18",
    dur: 520,
    dir: "alternate",
    easing: "easeOutQuad",
  });
  restartAnimation(constellationField, "animation__bloom", {
    property: "scale",
    from: "0.62 0.62 0.62",
    to: "1.08 1.08 1.08",
    dur: 620,
    dir: "alternate",
    easing: "easeOutQuad",
  });
  restartAnimation(waveField, "animation__shockwave", {
    property: "scale",
    from: "0.54 0.54 0.54",
    to: "1.26 1.26 1.26",
    dur: 720,
    dir: "alternate",
    easing: "easeOutCubic",
  });
  restartAnimation(astrophageField, "animation__swarm", {
    property: "scale",
    from: "1.28 1.28 1.28",
    to: "0.82 0.82 0.82",
    dur: 680,
    dir: "alternate",
    easing: "easeInOutQuad",
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

buildGeneratedGeometry();
applyPalette();
