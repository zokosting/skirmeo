// --- 1. CONFIGURACIÓN DE DATOS GLOBALES ---
const RAZAS_DISPONIBLES = [
    "Orks", "Eldar", "Imperial Guard", "Chaos Space Marines", 
    "Space Marines", "Tau Empire", "Necrons", "Sisters Of Battle", "Dark Eldar"
];
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

const MAPAS_POR_JUGADOR = {
    "2": [
        "Battle Marshes", "Blood River", "Deadman's Crossing", "Edemus Gamble", "Faceoff", 
        "Fallen City", "Hellfire Canyon", "Meeting of Minds", "Outer Reaches", "Railway", 
        "Riverbed", "Tainted Pair", "Valley of Khorne"
    ],
    "3": ["Fortress"],
    "4": [
        "Biffy's Peril", "Mountain Trail", "Quatra", "Saint's Square", "Tainted Place", 
        "Tainted soul", "Tartarus Center", "Volcanic Reaction"
    ],
    "5": ["Red Jungle"],
    "6": [
        "Bloodshed Alley", "Crossroads", "Dread Alleu", "Jungle Walls", "Kasyr Lutien", 
        "Mortalis", "Streets of Vogen", "Testing Grounds"
    ],
    "8": [
        "Burial Grounds", "Daturias Pits", "Doom Chamber", "Lost Hope", "Penal Colony"
    ]
};

// ¡NUEVO OBJETO para las descripciones de los mapas!
const MAPAS_DESCRIPCION = {
    "Battle Marshes": "Map size: 257 - Strat. points: 8 - Relics: 2 - Slag depos: 0",
    "Blood River": "Map size: 257 - Strat. points: 8 - Relics: 2 - Slag depos: 0",
    "Deadman's Crossing": "Map size: 257",
    "Edemus Gamble": "Map size: 257"
    // Los mapas sin descripción aquí no mostrarán nada extra.
};


// Elementos del DOM 
const contenedorDesplegables = document.getElementById('contenedor-desplegables-razas');
const instruccionRazas = document.getElementById('instruccion-razas');
const numJugadoresSelect = document.getElementById('num-jugadores');
const dificultadSelect = document.getElementById('ai-difficulty');
const mapaSelect = document.getElementById('mapa-seleccionado');
const descripcionMapaDiv = document.getElementById('descripcion-mapa'); // ¡Nuevo!
const resourceRateSelect = document.getElementById('resource-rate');
const resultadoDiv = document.getElementById('resultado');
const contenedorCondiciones = document.querySelector('.victoria-grid');
const quickStartCheckbox = document.getElementById('quick-start');

// --- 2. FUNCIONES DE LÓGICA DE INTERFAZ ---

/** Genera los desplegables de raza Y llama a generarSeleccionMapa. (Sin cambios) */
function generarDesplegablesRazas() {
    // [CÓDIGO DE GENERACIÓN DE DESPLEGABLES DE RAZA SIN CAMBIOS]
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
    
    generarSeleccionMapa();
}

/** Genera los checkboxes para las condiciones de victoria. (Sin cambios) */
function generarCondicionesVictoria() {
    // [CÓDIGO DE GENERACIÓN DE CONDICIONES DE VICTORIA SIN CAMBIOS]
    contenedorCondiciones.innerHTML = '';
    CONDICIONES_VICTORIA.forEach((condicion, index) => {
        const [nombreCorto, descripcion] = condicion.split(' – ').map(s => s.trim()); 
        
        const divGroup = document.createElement('div');
        divGroup.classList.add('victoria-item'); 
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `condicion-${index}`;
        checkbox.name = 'condicion';
        checkbox.value = nombreCorto; 

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = nombreCorto;
        
        const descSpan = document.createElement('span'); 
        descSpan.classList.add('descripcion-victoria');
        descSpan.textContent = ` – ${descripcion}`;
        descSpan.style.display = 'none'; 

        checkbox.onchange = function() {
            descSpan.style.display = this.checked ? 'inline' : 'none';
        };

        divGroup.appendChild(checkbox);
        divGroup.appendChild(label);
        divGroup.appendChild(descSpan); 
        contenedorCondiciones.appendChild(divGroup);
    });
}

/** Rellena el desplegable del mapa y limpia la descripción. (Actualizado) */
function generarSeleccionMapa() {
    const numJugadores = numJugadoresSelect.value; 
    const mapasDisponibles = MAPAS_POR_JUGADOR[numJugadores] || []; 
    
    mapaSelect.innerHTML = ''; 
    descripcionMapaDiv.innerHTML = ''; // Limpiar descripción al cambiar de jugador
    
    // Opción por defecto (valor vacío)
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "--- Seleccionar Mapa ---";
    mapaSelect.appendChild(defaultOption);

    if (mapasDisponibles.length === 0) {
        const noMapOption = document.createElement('option');
        noMapOption.textContent = "No hay mapas listados para este número de jugadores.";
        noMapOption.disabled = true;
        mapaSelect.appendChild(noMapOption);
    } else {
        mapasDisponibles.forEach(mapa => {
            const option = document.createElement('option');
            option.value = mapa;
            option.textContent = mapa;
            mapaSelect.appendChild(option);
        });
    }
}

/** ¡NUEVA FUNCIÓN! Muestra la descripción específica de un mapa. */
function mostrarDescripcionMapa() {
    const mapaSeleccionado = mapaSelect.value;
    const descripcion = MAPAS_DESCRIPCION[mapaSeleccionado];
    
    if (descripcion) {
        descripcionMapaDiv.innerHTML = `<p class="mapa-detalle">**Detalles:** ${descripcion}</p>`;
    } else {
        descripcionMapaDiv.innerHTML = ''; // Limpiar si no hay descripción específica
    }
}

/** Función auxiliar para seleccionar un elemento aleatorio de un array. (Sin cambios) */
function seleccionarAleatorio(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/** ¡NUEVA FUNCIÓN! Selecciona un mapa aleatorio y actualiza el desplegable y la descripción. */
function seleccionarMapaAleatorio() {
    const numJugadores = numJugadoresSelect.value;
    const mapasDisponibles = MAPAS_POR_JUGADOR[numJugadores] || [];
    
    if (mapasDisponibles.length > 0) {
        const mapaElegido = seleccionarAleatorio(mapasDisponibles);
        mapaSelect.value = mapaElegido; // Establece el valor en el desplegable
        mostrarDescripcionMapa(); // Muestra la descripción del mapa elegido
    } else {
        descripcionMapaDiv.innerHTML = '<p class="alerta">No hay mapas disponibles para este número de jugadores para elegir aleatoriamente.</p>';
        mapaSelect.value = "";
    }
}


// --- 3. FUNCIÓN DE GENERACIÓN DE PARTIDA (Lógica de mapa aleatorio eliminada) ---

function generarPartida() {
    const selectElements = document.querySelectorAll('.select-raza-rotatoria');
    const razasSeleccionadas = Array.from(selectElements).map(select => select.value);
    
    // Obtener parámetros
    const dificultadSeleccionada = dificultadSelect.value; 
    const resourceRateSeleccionado = resourceRateSelect.value;
    const numJugadores = parseInt(numJugadoresSelect.value);
    const quickStartActivo = quickStartCheckbox.checked ? "Activado (Recursos Elevados)" : "Desactivado (Recursos Estándar)";

    // Obtener las condiciones de victoria seleccionadas
    const checkboxesVictoria = document.querySelectorAll('#condiciones-victoria input[type="checkbox"]');
    const condicionesSeleccionadas = Array.from(checkboxesVictoria)
        .filter(cb => cb.checked)
        .map(cb => {
            const condicionCompleta = CONDICIONES_VICTORIA.find(c => c.startsWith(cb.value));
            return condicionCompleta || cb.value;
        });

    // --- VALIDACIÓN Y SELECCIÓN FINAL DEL MAPA ---
    let mapaSeleccionado = mapaSelect.value;
    let fuenteMapa = "Seleccionado";
    
    if (mapaSeleccionado === "") {
        resultadoDiv.innerHTML = `<p class="alerta">🚨 **Error:** Debes seleccionar un Mapa de Batalla manualmente o usar el botón "Elegir Mapa Aleatorio".</p>`;
        return;
    }
    
    if (condicionesSeleccionadas.length === 0) {
         resultadoDiv.innerHTML = `<p class="alerta">🚨 **Error:** Debes seleccionar al menos una Condición de Victoria.</p>`;
         return;
    }
    
    const partidaGenerada = [RAZA_FIJA, ...razasSeleccionadas]; 

    // 4. Mostrar el Resultado en el HTML
    let resultadoHTML = `
        <h3>✅ Configuración: ${numJugadores} Jugadores | Dificultad: **${dificultadSeleccionada}**</h3>
        
        <h4>🗺️ Mapa de Batalla:</h4>
        <p>**${mapaSeleccionado}** (${fuenteMapa})</p>

        <h4>💰 Starting Resources:</h4>
        <p>Tasa de Recursos: **${resourceRateSeleccionado}**</p>
        <p>Recursos Iniciales: ${quickStartActivo}</p>
        
        <h4>⚙️ Condiciones de Victoria:</h4>
        <p>El juego se gana al cumplir **${condicionesSeleccionadas.length}** condición(es):</p>
        <ul>
            ${condicionesSeleccionadas.map(c => {
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