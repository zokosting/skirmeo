// --- 1. CONFIGURACIÓN DE DATOS GLOBALES ---
const RAZAS_DISPONIBLES = [
    "Orks", "Eldar", "Imperial Guard", "Chaos Space Marines", 
    "Space Marines", "Tau Empire", "Necrons", "Sisters Of Battle", "Dark Eldar"
];
// Define la raza fija y por defecto.
const RAZA_FIJA = "Space Marines"; 

const CONDICIONES_VICTORIA = [
    "Annihilate – Win by destroying all of the enemy’s unit-producing buildings",
    "Game Timer",
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
const contenedorCondiciones = document.querySelector('.victoria-grid'); // Nuevo contenedor

// --- 2. FUNCIONES DE INICIALIZACIÓN Y LÓGICA DE INTERFAZ ---

/**
 * Genera el número correcto de desplegables (<select>) basado en la selección de jugadores.
 */
function generarDesplegablesRazas() {
    const numJugadores = parseInt(numJugadoresSelect.value);
    
    if (isNaN(numJugadores) || numJugadores < 2) {
        contenedorDesplegables.innerHTML = '<p class="alerta">Error al leer el número de jugadores.</p>';
        return; 
    }
    
    const numRazasARotar = numJugadores - 1; 

    // 1. Actualizar la instrucción para el usuario
    instruccionRazas.innerHTML = `Selecciona la raza para cada uno de los **${numRazasARotar}** jugadores restantes. Por defecto es **${RAZA_FIJA}**:`;
    
    // 2. Limpiar y generar nuevos desplegables
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

        // Llenar el desplegable con todas las razas disponibles
        RAZAS_DISPONIBLES.forEach(raza => {
            const option = document.createElement('option');
            option.value = raza;
            option.textContent = raza;
            
            // ¡AJUSTE CLAVE! Space Marines es la opción por defecto, pero se puede cambiar.
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
 * Genera los checkboxes para las condiciones de victoria.
 */
function generarCondicionesVictoria() {
    contenedorCondiciones.innerHTML = '';
    CONDICIONES_VICTORIA.forEach((condicion, index) => {
        const divGroup = document.createElement('div');
        divGroup.classList.add('raza-item'); // Reutilizamos la clase para grid styling
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `condicion-${index}`;
        checkbox.name = 'condicion';
        checkbox.value = condicion;
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = condicion.split('–')[0].trim(); // Solo el nombre corto

        divGroup.appendChild(checkbox);
        divGroup.appendChild(label);
        contenedorCondiciones.appendChild(divGroup);
    });
}


// --- 3. FUNCIÓN DE GENERACIÓN DE PARTIDA ---

/**
 * Genera la lista final de la partida.
 */
function generarPartida() {
    const selectElements = document.querySelectorAll('.select-raza-rotatoria');
    const razasSeleccionadas = Array.from(selectElements).map(select => select.value);
    
    // Obtener los valores de los checkboxes de victoria
    const checkboxesVictoria = document.querySelectorAll('#condiciones-victoria input[type="checkbox"]');
    const condicionesSeleccionadas = Array.from(checkboxesVictoria)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // Obtener el valor de dificultad
    const dificultadSeleccionada = dificultadSelect.value; 

    // --- Validación Crítica: No debería haber opciones vacías gracias a la selección por defecto ---
    // Mantenemos la validación solo para estar seguros.
    const razasSinSeleccionar = razasSeleccionadas.filter(raza => raza === "");
    
    if (razasSinSeleccionar.length > 0) {
         resultadoDiv.innerHTML = `<p class="alerta">🚨 **Error:** Por favor, asegúrate de haber seleccionado una raza en todos los ${selectElements.length} desplegables.</p>`;
         return;
    }
    
    if (condicionesSeleccionadas.length === 0) {
         resultadoDiv.innerHTML = `<p class="alerta">🚨 **Error:** Debes seleccionar al menos una Condición de Victoria.</p>`;
         return;
    }

    const numJugadores = parseInt(numJugadoresSelect.value);
    const partidaGenerada = [];
    
    // 1. Asignar la Raza Fija al Jugador 1
    partidaGenerada.push(RAZA_FIJA); 
    
    // 2. Asignar las razas seleccionadas (incluyendo repeticiones)
    razasSeleccionadas.forEach(raza => {
        partidaGenerada.push(raza);
    });

    // 3. Mostrar el Resultado en el HTML
    let resultadoHTML = `
        <h3>✅ Configuración: ${numJugadores} Jugadores | Dificultad: **${dificultadSeleccionada}**</h3>
        <p>El juego se gana al cumplir **${condicionesSeleccionadas.length}** condición(es).</p>
        
        <h4>⚙️ Condiciones de Victoria:</h4>
        <ul>
            ${condicionesSeleccionadas.map(c => `<li>${c}</li>`).join('')}
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
    generarCondicionesVictoria(); // Llamamos a la nueva función de inicialización
}

document.addEventListener('DOMContentLoaded', iniciarAplicacion);