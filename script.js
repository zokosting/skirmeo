// --- 1. CONFIGURACIÓN DE DATOS GLOBALES ---
const RAZAS_DISPONIBLES = [
    "Orks", "Eldar", "Imperial Guard", "Chaos Space Marines", 
    "Space Marines", "Tau Empire", "Necrons", "Sisters Of Battle", "Dark Eldar"
];
// Define la raza que siempre estará en la partida: Space Marines
const RAZA_FIJA = "Space Marines"; 

// Elementos del DOM 
const contenedorDesplegables = document.getElementById('contenedor-desplegables-razas');
const instruccionRazas = document.getElementById('instruccion-razas');
const numJugadoresSelect = document.getElementById('num-jugadores');
const dificultadSelect = document.getElementById('ai-difficulty'); // ¡Nuevo!
const resultadoDiv = document.getElementById('resultado');

// --- 2. FUNCIONES DE LÓGICA DE INTERFAZ (GENERACIÓN DE DESPLEGABLES) ---

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

        // Añadir una opción inicial vacía, pero no seleccionada por defecto si la fija ya lo está
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "--- Seleccionar Raza ---";
        select.appendChild(defaultOption);
        
        // Llenar el desplegable con todas las razas disponibles
        let isSpaceMarineSelected = false;

        RAZAS_DISPONIBLES.forEach(raza => {
            const option = document.createElement('option');
            option.value = raza;
            option.textContent = raza;
            
            // ¡AJUSTE CLAVE! Si es la raza fija, se selecciona por defecto.
            if (raza === RAZA_FIJA) {
                option.selected = true; 
                isSpaceMarineSelected = true;
            }
            select.appendChild(option);
        });
        
        // Si Space Marines fue seleccionado por defecto, aseguramos que la primera opción vacía no lo esté.
        if (isSpaceMarineSelected) {
            defaultOption.selected = false;
        } else {
            // Si por alguna razón Space Marines no estaba en la lista, la opción vacía se selecciona.
            defaultOption.selected = true; 
        }


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
    
    // Filtramos la opción por defecto ("") para la validación
    const razasSeleccionadas = Array.from(selectElements)
        .map(select => select.value);

    // Obtener el valor de dificultad
    const dificultadSeleccionada = dificultadSelect.value; 

    // Validación Crítica: Revisamos si hay opciones vacías (la opción "--- Seleccionar Raza ---")
    const razasSinSeleccionar = razasSeleccionadas.filter(raza => raza === "");
    
    if (razasSinSeleccionar.length > 0) {
         resultadoDiv.innerHTML = `<p class="alerta">🚨 **Error:** Por favor, asegúrate de haber seleccionado una raza en todos los ${selectElements.length} desplegables.</p>`;
         return;
    }

    const numJugadores = parseInt(numJugadoresSelect.value);
    const partidaGenerada = [];
    
    // 1. Asignar la Raza Fija al Jugador 1
    partidaGenerada.push(RAZA_FIJA); 
    
    // 2. Asignar las razas seleccionadas (que pueden ser repetidas) a los jugadores restantes
    razasSeleccionadas.forEach(raza => {
        partidaGenerada.push(raza);
    });

    // 3. Mostrar el Resultado en el HTML
    let resultadoHTML = `
        <h3>✅ Configuración: ${numJugadores} Jugadores | Dificultad: **${dificultadSeleccionada}**</h3>
        <h4>Asignación de Facciones:</h4>
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
}

document.addEventListener('DOMContentLoaded', iniciarAplicacion);