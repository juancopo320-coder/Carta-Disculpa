// ================= ELEMENTOS =================
const root = document.documentElement;
const envelopeScreen = document.getElementById('envelope-screen');
const envelopeWrapper = document.getElementById('envelope-wrapper');
const envLeft = document.getElementById('env-left');
const envRight = document.getElementById('env-right');
const waxSeal = document.getElementById('wax-seal');
const dragGuide = document.getElementById('drag-guide');
const letterPaper = document.getElementById('letter-paper');
const letterTeaser = document.getElementById('letter-teaser');
const letterFull = document.getElementById('letter-full');

const stage2 = document.getElementById('stage-2');
const progressFill = document.getElementById('progress-fill');
const percentNumber = document.getElementById('percent-number');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');

const bgMusic = document.getElementById('bg-music');
const btnToggleAudio = document.getElementById('btn-toggle-audio');
const audioIc = document.getElementById('audio-ic');
const discIcon = document.getElementById('disc-icon');
const reactiveBg = document.getElementById('audio-reactive-bg');
const carousel = document.getElementById('hologram-carousel');
const holoStage = document.getElementById('hologram-stage');
const loveBg = document.getElementById('love-bg');
const heartsLayer = document.getElementById('hearts-layer');

const photoModal = document.getElementById('photo-modal');
const flipContainer = document.getElementById('flip-card-container');
const flipCardInner = document.getElementById('flip-card-inner');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const btnFlipToBack = document.getElementById('btn-flip-to-back');
const btnFlipToFront = document.getElementById('btn-flip-to-front');
const btnCloseModal = document.getElementById('btn-close-modal');


// ================= 1. RASGADO DEL SOBRE =================
let arrastrandoSobre = false;
let inicioY = null;
let progresoRasgado = 0;
let sobreCompletado = false;

envelopeScreen.addEventListener('pointerdown', (e) => {
  if (sobreCompletado) return;
  arrastrandoSobre = true;
  inicioY = e.clientY;
});

window.addEventListener('pointermove', (e) => {
  if (!arrastrandoSobre || sobreCompletado || inicioY === null) return;
  const distanciaY = Math.abs(e.clientY - inicioY);
  inicioY = e.clientY;
  progresoRasgado = Math.min(100, progresoRasgado + distanciaY * 0.45);
  actualizarAperturaSobre(progresoRasgado);
  if (progresoRasgado >= 100) completarRasgado();
});

window.addEventListener('pointerup', () => {
  arrastrandoSobre = false;
  if (sobreCompletado) return;
  if (progresoRasgado < 65) {
    progresoRasgado = 0;
    actualizarAperturaSobre(0);
  } else {
    completarRasgado();
  }
});

function actualizarAperturaSobre(p) {
  const ratio = p / 100;
  envRight.style.transform = `translateX(${ratio * 65}px) rotate(${ratio * 16}deg)`;
  envLeft.style.transform = `translateX(${-ratio * 25}px) rotate(${-ratio * 5}deg)`;
  waxSeal.style.transform = `translate(-50%, -50%) scale(${1 - ratio * 0.5})`;
  waxSeal.style.opacity = `${1 - ratio * 0.8}`;
}

function completarRasgado() {
  if (sobreCompletado) return;
  sobreCompletado = true;

  envRight.style.transition = 'transform 0.55s ease, opacity 0.5s ease';
  envLeft.style.transition = 'transform 0.55s ease, opacity 0.5s ease';
  envRight.style.transform = 'translateX(140%) rotate(24deg)';
  envLeft.style.transform = 'translateX(-140%) rotate(-18deg)';
  envRight.style.opacity = '0';
  envLeft.style.opacity = '0';
  waxSeal.style.opacity = '0';
  dragGuide.style.opacity = '0';

  envelopeScreen.classList.add('opened');
  setTimeout(abrirCartaCompleta, 2900);
}

function abrirCartaCompleta() {
  letterTeaser.classList.add('fade-out');

  setTimeout(() => {
    letterTeaser.style.display = 'none';
    envLeft.style.display = 'none';
    envRight.style.display = 'none';
    waxSeal.style.display = 'none';

    letterFull.style.display = 'flex';
    const estilo = getComputedStyle(letterPaper);
    const padV = parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom);
    envelopeWrapper.style.height = `${letterFull.offsetHeight + padV + 24}px`;

    setTimeout(() => {
      letterFull.classList.add('show');
      iniciarMedidor();
    }, 450);

    setTimeout(() => {
      envelopeWrapper.classList.add('settled');
      envelopeWrapper.style.height = '';
    }, 800);
  }, 380);
}


// ================= 2. MEDIDOR DE ARREPENTIMIENTO =================
function iniciarMedidor() {
  let valor = 0;
  const meta = 1000;
  const timer = setInterval(() => {
    valor += 30;
    if (valor >= meta) {
      valor = meta;
      clearInterval(timer);
      percentNumber.innerHTML = '¡Infinito! <svg><use href="#i-inf"/></svg> <span class="inf-emotes">🐵</span>';
    } else {
      percentNumber.textContent = `${valor}%`;
    }
    const pct = Math.min(valor / 10, 100);
    progressFill.style.width = `${pct}%`;
    // El degradé se estira por toda la barra: el comienzo siempre se ve negro y el final rosa
    progressFill.style.backgroundSize = `${pct > 0 ? 10000 / pct : 100}% 100%`;
  }, 30);
}


// ================= 3. BOTÓN "NO" QUE ESCAPA Y CAMBIA DE TAMAÑO =================
const frasesNo = [
  "¿Segura, mi amor?",
  "No seas malita",
  "Elegí el otro botón",
  "Imposible tocarme",
  "Dale, perdonáme",
  "Ni lo intentes"
];
let intentosNo = 0;
let escalaYes = 1;

function escaparNo(e) {
  if (e && e.type === 'touchstart') e.preventDefault();
  intentosNo++;

  if (btnNo.parentElement !== document.body) document.body.appendChild(btnNo);
  btnNo.textContent = frasesNo[intentosNo % frasesNo.length];

  const tam = 0.62 + Math.random() * 0.95;
  btnNo.style.fontSize = `${tam}rem`;
  btnNo.style.padding = `${tam * 0.7}rem ${tam * 1.5}rem`;

  escalaYes = Math.min(1.5, escalaYes + 0.07);
  btnYes.style.transform = `scale(${escalaYes})`;

  const pad = 12;
  const maxX = Math.max(pad, window.innerWidth - btnNo.offsetWidth - pad);
  const maxY = Math.max(pad, window.innerHeight - btnNo.offsetHeight - pad);

  btnNo.style.position = 'fixed';
  btnNo.style.left = `${pad + Math.floor(Math.random() * (maxX - pad))}px`;
  btnNo.style.top = `${pad + Math.floor(Math.random() * (maxY - pad))}px`;
}

btnNo.addEventListener('mouseover', escaparNo);
btnNo.addEventListener('touchstart', escaparNo, { passive: false });
btnNo.addEventListener('click', escaparNo);


// ================= 4. AL TOCAR "¡SÍ, TE PERDONO!" =================
btnYes.addEventListener('click', () => {
  btnNo.classList.add('hidden');
  envelopeScreen.style.opacity = '0';

  setTimeout(() => {
    envelopeScreen.classList.add('hidden');
    stage2.classList.remove('hidden');
    loveBg.classList.remove('hidden');
    crearCorazones();
    iniciarGiroHolograma();
  }, 500);

  bgMusic.play().then(() => {
    // Abierto con doble clic (file://) el navegador no deja "escuchar" la música,
    // así que se usa un latido simulado. Subida a un hosting / servidor local, late con la música real.
    if (location.protocol === 'file:') iniciarPulsoSimulado();
    else iniciarIluminacionConSonido();
  }).catch(() => {
    iniciarPulsoSimulado();
  });
});

btnToggleAudio.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => { });
    audioIc.innerHTML = '<use href="#i-pause"/>';
    discIcon.classList.add('spinning');
  } else {
    bgMusic.pause();
    audioIc.innerHTML = '<use href="#i-play"/>';
    discIcon.classList.remove('spinning');
  }
});


// ================= 5. LUZ QUE BRILLA SEGÚN LA MÚSICA =================
// Todo el brillo (fondo, costados, haz del proyector, lente) depende de la variable --beat (0 a 1)
let beat = 0;
let efectoIniciado = false;

function aplicarBeat(objetivo) {
  // sube rápido, baja suave: se siente como un latido
  beat = objetivo > beat ? objetivo : beat * 0.9;
  root.style.setProperty('--beat', beat.toFixed(3));
  reactiveBg.style.transform = `scale(${1 + beat * 0.25})`;
}

function iniciarIluminacionConSonido() {
  if (efectoIniciado) return;
  efectoIniciado = true;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const src = ctx.createMediaElementSource(bgMusic);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.6;
    src.connect(analyser);
    analyser.connect(ctx.destination);

    const data = new Uint8Array(analyser.frequencyBinCount);
    let pico = 0.2;

    function renderBeat() {
      let objetivo = 0;
      if (!bgMusic.paused) {
        analyser.getByteFrequencyData(data);
        let suma = 0;
        for (let i = 0; i < 8; i++) suma += data[i]; // graves
        const intensidad = suma / (8 * 255);
        pico = Math.max(pico * 0.997, intensidad, 0.15);
        objetivo = Math.pow(Math.min(1, intensidad / pico), 2.2);
      }
      aplicarBeat(objetivo);
      requestAnimationFrame(renderBeat);
    }
    renderBeat();
  } catch (err) {
    efectoIniciado = false;
    iniciarPulsoSimulado();
  }
}

function iniciarPulsoSimulado() {
  if (efectoIniciado) return;
  efectoIniciado = true;
  let t = 0;
  function pulse() {
    t += 0.07;
    const objetivo = bgMusic.paused ? 0 : Math.pow(Math.max(0, Math.sin(t)), 3) * (0.7 + 0.3 * Math.sin(t * 0.37));
    aplicarBeat(objetivo);
    requestAnimationFrame(pulse);
  }
  pulse();
}


// ================= 6. CORAZONES Y BRILLOS EN LOS COSTADOS =================
function crearCorazones() {
  const formas = ['i-heart', 'i-heart', 'i-heart-line', 'i-spark'];
  for (let i = 0; i < 26; i++) {
    const h = document.createElement('span');
    h.className = 'float-heart';
    h.innerHTML = `<svg><use href="#${formas[i % formas.length]}"/></svg>`;
    const lado = Math.random();
    const x = lado < 0.4 ? Math.random() * 22 : lado < 0.8 ? 78 + Math.random() * 22 : 22 + Math.random() * 56;
    const tam = 12 + Math.random() * 24;
    h.style.left = `${x}%`;
    h.style.width = `${tam}px`;
    h.style.height = `${tam}px`;
    h.style.animationDuration = `${9 + Math.random() * 11}s`;
    h.style.animationDelay = `${-Math.random() * 16}s`;
    h.style.setProperty('--sway', `${(Math.random() * 40 - 20).toFixed(0)}px`);
    h.style.setProperty('--op', (0.35 + Math.random() * 0.5).toFixed(2));
    heartsLayer.appendChild(h);
  }
}


// ================= 7. HOLOGRAMA 3D (gira despacio hacia adelante) =================
const VELOCIDAD_GIRO = 9;     // grados por segundo (más bajo = más lento)
let rotY = 0;
let arrastrando = false;
let ultimoX = 0;
let movido = 0;
let pausaPorModal = false;
let ultimoTiempo = null;
let holoActivo = false;

function iniciarGiroHolograma() {
  if (holoActivo) return;
  holoActivo = true;
  function loop(t) {
    if (ultimoTiempo === null) ultimoTiempo = t;
    const dt = Math.min(0.05, (t - ultimoTiempo) / 1000);
    ultimoTiempo = t;
    if (!arrastrando && !pausaPorModal) rotY += VELOCIDAD_GIRO * dt;
    carousel.style.transform = `rotateX(-5deg) rotateY(${rotY}deg)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

holoStage.addEventListener('pointerdown', (e) => {
  arrastrando = true;
  ultimoX = e.clientX;
  movido = 0;
});

window.addEventListener('pointermove', (e) => {
  if (!arrastrando) return;
  const dx = e.clientX - ultimoX;
  ultimoX = e.clientX;
  movido += Math.abs(dx);
  rotY += dx * 0.45;
});

window.addEventListener('pointerup', () => {
  arrastrando = false;
});


// ================= 8. FOTO QUE SE EXPANDE HACIA ADELANTE =================
let itemAbierto = null;

function transformDesde(item) {
  const caja = flipContainer.getBoundingClientRect();
  const r = item.getBoundingClientRect();
  const dx = (r.left + r.width / 2) - (caja.left + caja.width / 2);
  const dy = (r.top + r.height / 2) - (caja.top + caja.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${r.width / caja.width}, ${r.height / caja.height})`;
}

function abrirFoto(item) {
  itemAbierto = item;
  pausaPorModal = true;
  modalImg.src = item.dataset.img;
  modalTitle.textContent = item.dataset.title;
  modalText.textContent = item.dataset.text;
  flipCardInner.classList.remove('flipped');

  photoModal.style.opacity = '0';
  photoModal.classList.remove('hidden');

  // La tarjeta sale desde la posición de la foto y crece hacia vos
  flipContainer.style.transition = 'none';
  flipContainer.style.transform = transformDesde(item);
  flipContainer.style.opacity = '0.3';
  void flipContainer.offsetWidth;

  requestAnimationFrame(() => {
    photoModal.style.opacity = '1';
    flipContainer.style.transition = 'transform 0.7s cubic-bezier(0.2, 0.9, 0.25, 1), opacity 0.45s ease';
    flipContainer.style.transform = 'none';
    flipContainer.style.opacity = '1';
  });
}

function cerrarFoto() {
  flipCardInner.classList.remove('flipped');
  photoModal.style.opacity = '0';
  flipContainer.style.transition = 'transform 0.55s cubic-bezier(0.5, 0, 0.3, 1), opacity 0.45s ease';
  if (itemAbierto) flipContainer.style.transform = transformDesde(itemAbierto);
  flipContainer.style.opacity = '0';
  setTimeout(() => {
    photoModal.classList.add('hidden');
    pausaPorModal = false;
  }, 520);
}

document.querySelectorAll('.holo-item').forEach((item) => {
  item.addEventListener('click', () => {
    if (movido > 8) return; // fue un arrastre, no un toque
    abrirFoto(item);
  });
});

btnFlipToBack.addEventListener('click', () => flipCardInner.classList.add('flipped'));
btnFlipToFront.addEventListener('click', () => flipCardInner.classList.remove('flipped'));
btnCloseModal.addEventListener('click', cerrarFoto);
