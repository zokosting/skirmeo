// --- 1. CONFIGURACIÓN DE DATOS GLOBALES ---
const RAZAS_DISPONIBLES = [
    "Orks", "Eldar", "Imperial Guard", "Chaos Space Marines", 
    "Space Marines", "Tau Empire", "Necrons", "Sisters Of Battle", "Dark Eldar"
];
// Define la raza fija y por defecto.
const RAZA_FIJA = "Space Marines"; 

const CONDICIONES_VICTORIA = [
    "Annihilate – Win by destroying all of the enemy’s unit-producing buildings",
    "Game Timer – El juego termina al agotar el tiempo (se puede seleccionar junto a otras condiciones)",
    "Assassinate – Win by killing the enemy commander(s)",
    "Control Area – Win by controlling a majority (e.g., two-thirds) of the map’s strategic points for a set period",
    "Destroy HQ – Win by razing all HQ buildings of the opponent",
    "Economic Victory – Win by amassing a large amount of resources (e.g., requisition & power) and holding them",
    "Take and Hold – Win by maintaining control of more than half of the map’s critical locations for a given time",
    "Sudden Death – Win (or lose) by capturing a strategic point from an enemy; the act triggers victory/defeat instantly"
];

// Elementos del DOM 
const contenedorDesplegables = document.getElementById('contenedor-desplegables-razas');
const instruccionRazas = document.getElementById('instruccion-razas');
const numJugadoresSelect = document.getElementById('num-jugadores');
const dificultadSelect = document.getElementById('ai-difficulty');
const resultadoDiv = document.getElementById('resultado');
const contenedorCondiciones = document.querySelector('.victoria-grid');
const quickStartCheckbox = document.getElementById('quick-start'); // ¡Nuevo!

// --- 2. FUNCIONES DE LÓGICA DE INTERFAZ ---

/**
 * Genera el número correcto de desplegables (<select>) para las razas rotatorias.
 */
function generarDesplegablesRazas() {
    const numJugadores = parseInt(numJugadoresSelect.value);
    
    if (isNaN(numJugadores) || numJugadores < 2) {
        contenedorDesplegables.innerHTML = '<p class="alerta">Error al leer el número de jugadores.</p>';
        return; 
    }
    
    const numRazasARotar = numJugadores - 1; 
    instruccionRazas.innerHTML = `Selecciona la raza para cada uno de los **${numRazasARotar}** jugadores restantes. Por defecto es **${RAZA_FIJA}**:`;
    contenedorDesplegables.innerHTML = ''; 

    for (let i = 1; i <= numRazasARotar; i++) {
        const divGroup = document.createElement('div');
        divGroup.classList.add('control-group');
        
        const label = document.createElement('label');
        label.htmlFor = `raza-jugador-${i}`; 
        label.textContent = `Raza para Jugador ${i + 1}:`;
        
        const select = document.createElement('select');
        select.id = `raza-jugador-${i}`;
        select.classList.add('select-raza-rotatoria');

        RAZAS_DISPONIBLES.forEach(raza => {
            const option = document.createElement('option');
            option.value = raza;
            option.textContent = raza;
            
            if (raza === RAZA_FIJA) {
                option.selected = true; 
            }
            select.appendChild(option);
        });

        divGroup.appendChild(label);
        divGroup.appendChild(select);
        contenedorDesplegables.appendChild(divGroup);
    }
}

/**
 * Genera los checkboxes para las condiciones de victoria y añade el listener.
 */
function generarCondicionesVictoria() {
    contenedorCondiciones.innerHTML = '';
    CONDICIONES_VICTORIA.forEach((condicion, index) => {
        const [nombreCorto, descripcion] = condicion.split(' – ').map(s => s.trim()); // Separamos nombre y descripción
        
        const divGroup = document.createElement('div');
        divGroup.classList.add('victoria-item'); 
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `condicion-${index}`;
        checkbox.name = 'condicion';
        checkbox.value = nombreCorto; // El valor guardado es el nombre corto

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = nombreCorto;
        
        const descSpan = document.createElement('span'); // ¡Nuevo! Contenedor para la descripción
        descSpan.classList.add('descripcion-victoria');
        descSpan.textContent = ` – ${descripcion}`;
        descSpan.style.display = 'none'; // Oculto por defecto

        // Lógica para mostrar/ocultar la descripción
        checkbox.onchange = function() {
            descSpan.style.display = this.checked ? 'inline' : 'none';
        };

        divGroup.appendChild(checkbox);
        divGroup.appendChild(label);
        divGroup.appendChild(descSpan); // Añadimos el span de la descripción
        contenedorCondiciones.appendChild(divGroup);
    });
}


// --- 3. FUNCIÓN DE GENERACIÓN DE PARTIDA ---

/**
 * Genera la lista final de la partida y recoge todos los parámetros.
 */
function generarPartida() {
    const selectElements = document.querySelectorAll('.select-raza-rotatoria');
    const razasSeleccionadas = Array.from(selectElements).map(select => select.value);
    
    // Obtener las condiciones de victoria seleccionadas
    const checkboxesVictoria = document.querySelectorAll('#condiciones-victoria input[type="checkbox"]');
    const condicionesSeleccionadas = Array.from(checkboxesVictoria)
        .filter(cb => cb.checked)
        .map(cb => {
            // Buscamos la descripción completa en la lista original
            const condicionCompleta = CONDICIONES_VICTORIA.find(c => c.startsWith(cb.value));
            return condicionCompleta || cb.value; // Devolvemos la cadena completa (Nombre – Descripción)
        });

    // Obtener parámetros finales
    const dificultadSeleccionada = dificultadSelect.value; 
    const numJugadores = parseInt(numJugadoresSelect.value);
    const quickStartActivo = quickStartCheckbox.checked ? "Activado (Recursos Elevados)" : "Desactivado (Recursos Estándar)"; // ¡Nuevo!

    // --- Validación ---
    if (condicionesSeleccionadas.length === 0) {
         resultadoDiv.innerHTML = `<p class="alerta">🚨 **Error:** Debes seleccionar al menos una Condición de Victoria.</p>`;
         return;
    }

    const partidaGenerada = [RAZA_FIJA, ...razasSeleccionadas]; // Jugador 1 (Raza Fija) + Razas Rotatorias

    // 4. Mostrar el Resultado en el HTML
    let resultadoHTML = `
        <h3>✅ Configuración: ${numJugadores} Jugadores | Dificultad: **${dificultadSeleccionada}**</h3>
        
        <h4>💰 Starting Resources:</h4>
        <p>${quickStartActivo}</p>
        
        <h4>⚙️ Condiciones de Victoria:</h4>
        <p>El juego se gana al cumplir **${condicionesSeleccionadas.length}** condición(es):</p>
        <ul>
            ${condicionesSeleccionadas.map(c => {
                // Separamos nombre y descripción para mostrar de forma legible
                const [nombre, descripcion] = c.split(' – ').map(s => s.trim());
                return `<li>**${nombre}** – *${descripcion}*</li>`;
            }).join('')}
        </ul>
        
        <h4>👥 Asignación de Facciones:</h4>
        <ol>
    `;

    partidaGenerada.forEach((raza, index) => {
        const jugadorNum = index + 1;
        const etiqueta = (index === 0) 
            ? `**Raza Fija (IA)**` 
            : `Raza Rotatoria (Jugador ${jugadorNum})`;
        resultadoHTML += `<li>**Jugador ${jugadorNum}:** ${raza} (${etiqueta})</li>`;
    });

    resultadoHTML += '</ol>';
    resultadoDiv.innerHTML = resultadoHTML;
}

// --- 4. INICIO DE LA APLICACIÓN ---

function iniciarAplicacion() {
    generarDesplegablesRazas();
    generarCondicionesVictoria(); 
}

document.addEventListener('DOMContentLoaded', iniciarAplicacion);