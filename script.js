// --- 1. CONFIGURACIÓN DE DATOS GLOBALES ---
const RAZAS_DISPONIBLES = [
    "Orks", "Eldar", "Imperial Guard", "Chaos Space Marines", 
    "Space Marines", "Tau Empire", "Necrons", "Sisters Of Battle", "Dark Eldar"
];
// Define la raza que siempre estará en la partida.
const RAZA_FIJA = "Imperial Guard"; 

// Elementos del DOM
const contenedorDesplegables = document.getElementById('contenedor-desplegables-razas');
const instruccionRazas = document.getElementById('instruccion-razas');
const numJugadoresSelect = document.getElementById('num-jugadores');
const resultadoDiv = document.getElementById('resultado');

// --- 2. FUNCIONES DE LÓGICA DE INTERFAZ (GENERACIÓN DE DESPLEGABLES) ---

/**
 * Genera el número correcto de desplegables (<select>) basado en la selección de jugadores.
 */
function generarDesplegablesRazas() {
    const numJugadores = parseInt(numJugadoresSelect.value);
    const numRazasARotar = numJugadores - 1; 

    // 1. Actualizar la instrucción para el usuario
    instruccionRazas.innerHTML = `Selecciona la raza para cada uno de los **${numRazasARotar}** jugadores restantes:`;
    
    // 2. Limpiar y generar nuevos desplegables
    contenedorDesplegables.innerHTML = ''; 

    for (let i = 1; i <= numRazasARotar; i++) {
        const divGroup = document.createElement('div');
        divGroup.classList.add('control-group');
        
        const label = document.createElement('label');
        label.htmlFor = `raza-jugador-${i}`;
        label.textContent = `Jugador ${i + 1} (Raza Rotatoria):`;
        
        const select = document.createElement('select');
        select.id = `raza-jugador-${i}`;
        select.classList.add('select-raza-rotatoria');

        // Añadir una opción inicial por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "--- Seleccionar Raza ---";
        select.appendChild(defaultOption);
        
        // Llenar el desplegable con todas las razas disponibles
        RAZAS_DISPONIBLES.forEach(raza => {
            const option = document.createElement('option');
            option.value = raza;
            option.textContent = raza;
            select.appendChild(option);
        });

        divGroup.appendChild(label);
        divGroup.appendChild(select);
        contenedorDesplegables.appendChild(divGroup);
    }
}

// --- 3. FUNCIÓN DE GENERACIÓN DE PARTIDA ---

/**
 * Genera la lista final de la partida a partir de los valores de los desplegables.
 */
function generarPartida() {
    const selectElements = document.querySelectorAll('.select-raza-rotatoria');
    const razasSeleccionadas = Array.from(selectElements).map(select => select.value);

    // --- Validación Crítica ---
    // Verifica que todos los desplegables tengan un valor seleccionado (no la opción por defecto "")
    const razasSinSeleccionar = razasSeleccionadas.filter(raza => raza === "");
    
    if (razasSinSeleccionar.length > 0) {
        resultadoDiv.innerHTML = `<p class="alerta">🚨 **Error:** Por favor, selecciona una raza en todos los desplegables antes de generar la partida.</p>`;
        return;
    }

    const numJugadores = parseInt(numJugadoresSelect.value);
    const partidaGenerada = [];
    
    // 1. Asignar la Raza Fija al Jugador 1
    partidaGenerada.push(RAZA_FIJA); 
    
    // 2. Asignar las razas seleccionadas (que pueden ser repetidas) a los jugadores restantes
    // Opcional: Puedes barajar esta lista si quieres que la asignación sea aleatoria.
    // En este caso, la mantenemos en el orden de los desplegables.
    
    // Asignar las razas seleccionadas
    razasSeleccionadas.forEach(raza => {
        partidaGenerada.push(raza);
    });

    // 3. Mostrar el Resultado en el HTML
    let resultadoHTML = `
        <h3>✅ Configuración: ${numJugadores} Jugadores (Raza Fija + ${selectElements.length} Razas Rotatorias)</h3>
        <h4>Asignación de Facciones:</h4>
        <ol>
    `;

    partidaGenerada.forEach((raza, index) => {
        const jugadorNum = index + 1;
        const etiqueta = (index === 0) ? `**Raza Fija (${RAZA_FIJA})**` : `Raza Seleccionada`;
        resultadoHTML += `<li>**Jugador ${jugadorNum}:** ${raza} (${etiqueta})</li>`;
    });

    resultadoHTML += '</ol>';
    resultadoDiv.innerHTML = resultadoHTML;
}

// --- 4. INICIO DE LA APLICACIÓN ---

// Llama a la función de inicialización cuando el navegador carga el script
// Esto garantiza que los desplegables se creen al inicio (para el valor por defecto de 3 jugadores)
document.addEventListener('DOMContentLoaded', generarDesplegablesRazas);
