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

// Ajustar tamaño del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// EVENTO: Click para empezar a dibujar
const handleMouseDown = (event) => {
  // CORRECCIÓN: Si el clic NO es en el canvas (es en una ventana o botón), NO dibujamos.
  if (event.target.id !== 'drawingCanvas') {
      return; 
  }
  
  mouseIsDown = true;
  let randomNumber = Math.random();
  paintbrush = (randomNumber < 0.5) ? icon1 : icon2;
}

const handleMouseUp = () => {
  mouseIsDown = false;
}

const handleMouseMove = (event) => {
  if (!mouseIsDown) return;
  
  // Dibujamos
  const left = event.clientX;
  const top = event.clientY;
  context.drawImage(paintbrush, left - 16, top - 16, 32, 32);
}

// Escuchamos los eventos
window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
window.addEventListener('mousemove', handleMouseMove);


// ==========================================
// 2. SISTEMA DE VENTANAS (ABRIR, CERRAR, MOVER)
// ==========================================

let zIndexCounter = 100; // Para controlar quién está al frente
let offsetCounter = 0;   // Para que las ventanas nuevas no tapen a las viejas

// --- FUNCIONES BÁSICAS ---

function abrirVentana(id) {
  const ventana = document.getElementById(id);
  
  if (ventana) {
    if (ventana.style.display === 'none' || ventana.style.display === '') {
        ventana.style.display = 'block';
        
        // Traer al frente
        zIndexCounter++;
        ventana.style.zIndex = zIndexCounter;

        // Si es una ventana emergente (no la principal), aplicar desfase
        if (ventana.id !== 'ventana-main') {
            offsetCounter += 30; 
            if (offsetCounter > 150) offsetCounter = 0;
            
            // Posicionar con estilo absoluto para que sea movible desde el inicio
            ventana.style.position = 'fixed'; // Fixed para que ignore el scroll/flex
            ventana.style.top = (window.innerHeight / 2 - 150 + offsetCounter) + 'px';
            ventana.style.left = (window.innerWidth / 2 - 200 + offsetCounter) + 'px';
            ventana.style.margin = '0';
            ventana.style.transform = 'none';
        } else {
            // Si es la ventana PRINCIPAL, la dejamos centrada al principio
            // Pero le habilitamos posición relativa para que el drag funcione luego
            ventana.style.position = 'relative'; 
            ventana.style.margin = '0 auto';
        }
    } else {
        // Si ya estaba abierta, solo traer al frente
        zIndexCounter++;
        ventana.style.zIndex = zIndexCounter;
    }
  }
}

function cerrarVentana(id) {
  const ventana = document.getElementById(id);
  if (ventana) ventana.style.display = 'none';
}

// --- LÓGICA DE ARRASTRE (DRAG & DROP) SIN SALTOS ---

const ventanas = document.querySelectorAll('.win95-window');

ventanas.forEach(ventana => {
    // Click en cualquier parte de la ventana para traerla al frente
    ventana.addEventListener('mousedown', () => {
        zIndexCounter++;
        ventana.style.zIndex = zIndexCounter;
    });

    const titleBar = ventana.querySelector('.title-bar');
    
    if (titleBar) {
        titleBar.onmousedown = function(e) {
            e.preventDefault(); // Evita seleccionar texto

            // 1. OBTENER POSICIÓN ACTUAL EXACTA
            // Esto evita que la ventana "salte" cuando empezamos a moverla
            const rect = ventana.getBoundingClientRect();
            
            // 2. CONVERTIR A POSICIÓN ABSOLUTA (FIXED)
            // Congelamos la ventana en el lugar exacto donde está ahora (píxel por píxel)
            ventana.style.position = 'fixed';
            ventana.style.left = rect.left + 'px';
            ventana.style.top = rect.top + 'px';
            ventana.style.margin = '0';      // Quitamos márgenes automáticos
            ventana.style.transform = 'none'; // Quitamos transformaciones de centrado
            
            // 3. CALCULAR DÓNDE HICIMOS CLICK DENTRO DE LA VENTANA
            // (ShiftX/Y es la distancia desde la esquina de la ventana hasta el puntero)
            let shiftX = e.clientX - rect.left;
            let shiftY = e.clientY - rect.top;

            // 4. MOVER LA VENTANA
            function moveAt(pageX, pageY) {
                ventana.style.left = (pageX - shiftX) + 'px';
                ventana.style.top = (pageY - shiftY) + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.clientX, event.clientY);
            }

            // Escuchar movimiento en todo el documento
            document.addEventListener('mousemove', onMouseMove);

            // 5. SOLTAR LA VENTANA
            titleBar.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                titleBar.onmouseup = null;
            };
            
            // Seguridad extra por si el mouse sale de la ventana muy rápido
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