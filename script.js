// ==========================================
// 1. CONFIGURACIÓN DE DIBUJO
// ==========================================
let icon1 = document.createElement('img');
icon1.src = 'images/windows.png'; 
let icon2 = document.createElement('img');
icon2.src = 'images/mipc.ico';
let paintbrush;
let mouseIsDown = false;

const canvas = document.querySelector('#drawingCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const handleMouseDown = (event) => {
  if (event.target.id !== 'drawingCanvas') return; 
  mouseIsDown = true;
  let randomNumber = Math.random();
  paintbrush = (randomNumber < 0.5) ? icon1 : icon2;
}

const handleMouseUp = () => { mouseIsDown = false; }

const handleMouseMove = (event) => {
  if (!mouseIsDown) return;
  const left = event.clientX;
  const top = event.clientY;
  context.drawImage(paintbrush, left - 16, top - 16, 32, 32);
}

window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
window.addEventListener('mousemove', handleMouseMove);

// ==========================================
// 2. SISTEMA DE VENTANAS (ABRIR, CERRAR, MOVER)
// ==========================================
let zIndexCounter = 10000;

function abrirVentana(id) {
  const ventana = document.getElementById(id);
  if (ventana) {
    zIndexCounter++;
    ventana.style.display = 'block';
    ventana.style.zIndex = zIndexCounter;
    ventana.style.position = 'fixed';
    ventana.style.top = '50%';
    ventana.style.left = '50%';
    ventana.style.transform = 'translate(-50%, -50%)';
    ventana.style.margin = '0';
  }
}

function cerrarVentana(id) {
  const ventana = document.getElementById(id);
  if (ventana) ventana.style.display = 'none';
}

const ventanas = document.querySelectorAll('.win95-window');
ventanas.forEach(ventana => {
    ventana.addEventListener('mousedown', () => {
        zIndexCounter++;
        ventana.style.zIndex = zIndexCounter;
    });

    const titleBar = ventana.querySelector('.title-bar');
    if (titleBar) {
        titleBar.onmousedown = function(e) {
            e.preventDefault();
            const rect = ventana.getBoundingClientRect();
            ventana.style.position = 'fixed';
            ventana.style.left = rect.left + 'px';
            ventana.style.top = rect.top + 'px';
            ventana.style.margin = '0';
            ventana.style.transform = 'none';
            
            let shiftX = e.clientX - rect.left;
            let shiftY = e.clientY - rect.top;

            function moveAt(pageX, pageY) {
                ventana.style.left = (pageX - shiftX) + 'px';
                ventana.style.top = (pageY - shiftY) + 'px';
            }

            function onMouseMove(event) { moveAt(event.clientX, event.clientY); }
            document.addEventListener('mousemove', onMouseMove);

            titleBar.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                titleBar.onmouseup = null;
            };
            
            document.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            };
        };
    }
});

// ==========================================
// 3. MENÚ INICIO Y BARRA
// ==========================================
function toggleInicio() {
  const menu = document.getElementById('start-menu');
  const btn = document.querySelector('.start-btn');
  if (menu.style.display === 'none') {
    menu.style.display = 'flex';
    zIndexCounter++;
    menu.style.zIndex = zIndexCounter + 5000;
    btn.classList.add('pressed');
  } else {
    menu.style.display = 'none';
    btn.classList.remove('pressed');
  }
}

document.addEventListener('click', function(event) {
  const menu = document.getElementById('start-menu');
  const btn = document.querySelector('.start-btn');
  if (menu && menu.style.display !== 'none') {
    if (!menu.contains(event.target) && !btn.contains(event.target)) {
      menu.style.display = 'none';
      btn.classList.remove('pressed');
    }
  }
});

function actualizarReloj() {
    const ahora = new Date();
    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();
    minutos = minutos < 10 ? '0' + minutos : minutos;
    const elementoReloj = document.getElementById('reloj');
    if (elementoReloj) elementoReloj.innerText = horas + ':' + minutos + ' hs';
}
setInterval(actualizarReloj, 1000);
actualizarReloj();

// ==========================================
// 4. FUNCIONALIDAD DEL CALENDARIO
// ==========================================
function toggleCalendario() {
  const calendario = document.getElementById('ventana-calendario');
  if (!calendario) return;

  if (calendario.style.display === 'none' || calendario.style.display === '') {
    calendario.style.display = 'block';
    zIndexCounter++;
    calendario.style.zIndex = zIndexCounter + 6000;
    marcarDiaActual();
  } else {
    calendario.style.display = 'none';
  }
}

function marcarDiaActual() {
  const hoy = new Date();
  const diaActual = hoy.getDate().toString();
  const celdas = document.querySelectorAll('#ventana-calendario td');
  
  celdas.forEach(td => {
    td.classList.remove('today');
    if (td.innerText === diaActual) {
      td.classList.add('today');
    }
  });
}

document.addEventListener('mousedown', function(event) {
  const calendario = document.getElementById('ventana-calendario');
  const zonaReloj = document.querySelector('.notification-area');
  
  if (calendario && calendario.style.display === 'block') {
    if (!calendario.contains(event.target) && !zonaReloj.contains(event.target)) {
      calendario.style.display = 'none';
    }
  }
});

// ==========================================
// 5. CONTROL DE BIENVENIDA (PC vs MOBILE)
// ==========================================
window.addEventListener('load', () => {
    const ventana = document.getElementById('ventana-main');
    if (!ventana) return;

    setTimeout(() => {
        if (window.innerWidth > 600) {
            ventana.style.display = 'block';
            zIndexCounter++;
            ventana.style.zIndex = zIndexCounter;
            ventana.style.position = 'fixed';
            ventana.style.top = '50%';
            ventana.style.left = '50%';
            ventana.style.transform = 'translate(-50%, -50%)';
        } else {
            ventana.style.display = 'none';
        }
    }, 100); 
});

// ==========================================
// 6. PAPELERA
// ==========================================
function abrirPapelera() {
    const audio = document.getElementById('audio-error');
    if (audio) {
        audio.load();
        audio.currentTime = 0;
        let playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("¡TÁN! Sonando...");
            }).catch(error => {
                console.log("El navegador bloqueó el audio.");
            });
        }
    }
    abrirVentana('ventana-construccion');
}

document.addEventListener('click', () => {
    const audio = document.getElementById('audio-error');
    if (audio) {
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(() => {});
    }
}, { once: true });
