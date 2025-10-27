// --- 1. GLOBAL DATA CONFIGURATION (Remains the same) ---
const RAZAS_DISPONIBLES = [
    "Orks", "Eldar", "Imperial Guard", "Chaos Space Marines", 
    "Space Marines", "Tau Empire", "Necrons", "Sisters Of Battle", "Dark Eldar"
];
const RAZA_FIJA = "Space Marines"; 

const CONDICIONES_VICTORIA = [
    "Annihilate – Win by destroying all of the enemy’s unit-producing buildings",
    "Game Timer – The game ends when time runs out (can be selected with other conditions)",
    "Assassinate – Win by killing the enemy commander(s)",
    "Control Area – Win by controlling a majority (e.g., two-thirds) of the map’s strategic points for a set period",
    "Destroy HQ – Win by razing all HQ buildings of the opponent",
    "Economic Victory – Win by amassing a large amount of resources (e.g., requisition & power) and holding them",
    "Take and Hold – Win by maintaining control of more than half of the map’s critical locations for a given time",
    "Sudden Death – Win by capturing a strategic point from an enemy; the act triggers victory/defeat instantly"
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

const MAPAS_DESCRIPCION = {
    "Battle Marshes": "Map size: 257 - Strat. points: 8 - Relics: 2 - Slag depos: 0",
    "Blood River": "Map size: 257 - Strat. points: 8 - Relics: 2 - Slag depos: 0",
    "Deadman's Crossing": "Map size: 257",
    "Edemus Gamble": "Map size: 257"
};


// DOM Elements (Remain the same)
const contenedorDesplegables = document.getElementById('contenedor-desplegables-razas');
const instruccionRazas = document.getElementById('instruccion-razas');
const numJugadoresSelect = document.getElementById('num-jugadores');
const dificultadSelect = document.getElementById('ai-difficulty');
const mapaSelect = document.getElementById('mapa-seleccionado');
const descripcionMapaDiv = document.getElementById('descripcion-mapa');
const resourceRateSelect = document.getElementById('resource-rate');
const resultadoDiv = document.getElementById('resultado');
const contenedorCondiciones = document.querySelector('.victoria-grid');
const quickStartCheckbox = document.getElementById('quick-start');

// --- 2. INTERFACE LOGIC FUNCTIONS ---

/** Generates race dropdowns and calls generateMapSelection. (Updated Race Labels) */
function generarDesplegablesRazas() {
    const numJugadores = parseInt(numJugadoresSelect.value);
    
    if (isNaN(numJugadores) || numJugadores < 2) {
        contenedorDesplegables.innerHTML = '<p class="alerta">Error reading player count.</p>';
        return; 
    }
    
    const numRazasARotar = numJugadores - 1; 
    // Simplified instruction text
    instruccionRazas.innerHTML = `You are Space Marines.`; 
    contenedorDesplegables.innerHTML = ''; 

    for (let i = 1; i <= numRazasARotar; i++) {
        const divGroup = document.createElement('div');
        divGroup.classList.add('control-group');
        
        // Creating a simple span for the "Race x" text (no longer a <label>)
        const raceLabelText = document.createElement('span');
        raceLabelText.textContent = `Race ${i + 1}: `;
        
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

        divGroup.appendChild(raceLabelText); 
        divGroup.appendChild(select);
        contenedorDesplegables.appendChild(divGroup);
    }
    
    generarSeleccionMapa();
}

/** Generates victory condition checkboxes. (Remains the same) */
function generarCondicionesVictoria() {
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

/** Fills the map dropdown based on the selected player count and clears description. (Remains the same) */
function generarSeleccionMapa() {
    const numJugadores = numJugadoresSelect.value; 
    const mapasDisponibles = MAPAS_POR_JUGADOR[numJugadores] || []; 
    
    mapaSelect.innerHTML = ''; 
    descripcionMapaDiv.innerHTML = ''; 
    
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "--- Select Map ---"; 
    mapaSelect.appendChild(defaultOption);

    if (mapasDisponibles.length === 0) {
        const noMapOption = document.createElement('option');
        noMapOption.textContent = "No maps listed for this player count.";
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

/** Shows the specific description for a selected map. (Removed Details prefix) */
function mostrarDescripcionMapa() {
    const mapaSeleccionado = mapaSelect.value;
    const descripcion = MAPAS_DESCRIPCION[mapaSeleccionado];
    
    if (descripcion) {
        // Removed the "**Details:**" prefix
        descripcionMapaDiv.innerHTML = `<p class="mapa-detalle">${descripcion}</p>`;
    } else {
        descripcionMapaDiv.innerHTML = ''; 
    }
}

/** Helper function to select a random element from an array. (Remains the same) */
function seleccionarAleatorio(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/** Selects a random map, updates the dropdown, and shows the description. (Remains the same) */
function seleccionarMapaAleatorio() {
    const numJugadores = numJugadoresSelect.value;
    const mapasDisponibles = MAPAS_POR_JUGADOR[numJugadores] || [];
    
    if (mapasDisponibles.length > 0) {
        const mapaElegido = seleccionarAleatorio(mapasDisponibles);
        mapaSelect.value = mapaElegido; 
        mostrarDescripcionMapa(); 
    } else {
        descripcionMapaDiv.innerHTML = '<p class="alerta">No maps available for this player count to select randomly.</p>';
        mapaSelect.value = "";
    }
}


// --- 3. MATCH GENERATION FUNCTION (Updated Error Messages) ---

function generarPartida() {
    const selectElements = document.querySelectorAll('.select-raza-rotatoria');
    const razasSeleccionadas = Array.from(selectElements).map(select => select.value);
    
    // Get parameters
    const dificultadSeleccionada = dificultadSelect.value; 
    const resourceRateSeleccionado = resourceRateSelect.value;
    const numJugadores = parseInt(numJugadoresSelect.value);
    const quickStartActivo = quickStartCheckbox.checked ? "Activated (High Starting Resources)" : "Deactivated (Standard Starting Resources)";

    // Get selected victory conditions
    const checkboxesVictoria = document.querySelectorAll('#condiciones-victoria input[type="checkbox"]');
    const condicionesSeleccionadas = Array.from(checkboxesVictoria)
        .filter(cb => cb.checked)
        .map(cb => {
            const condicionCompleta = CONDICIONES_VICTORIA.find(c => c.startsWith(cb.value));
            return condicionCompleta || cb.value;
        });

    // --- VALIDATION AND FINAL MAP SELECTION ---
    let mapaSeleccionado = mapaSelect.value;
    
    if (mapaSeleccionado === "") {
        // Updated error message to match the simplified flow
        resultadoDiv.innerHTML = `<p class="alerta">🚨 **Error:** Map selection is required.</p>`;
        return;
    }
    
    if (condicionesSeleccionadas.length === 0) {
         resultadoDiv.innerHTML = `<p class="alerta">🚨 **Error:** You must select at least one Game Rule.</p>`;
         return;
    }
    
    const partidaGenerada = [RAZA_FIJA, ...razasSeleccionadas]; 

    // 4. Display Result in HTML 
    let resultadoHTML = `
        <h3>✅ Configuration: ${numJugadores} Players | AI Difficulty: **${dificultadSeleccionada}**</h3>
        
        <h4>🗺️ Map:</h4>
        <p>**${mapaSeleccionado}**</p>

        <h4>💰 Starting Resources:</h4>
        <p>Resource Rate: **${resourceRateSeleccionado}**</p>
        <p>Quick Start: ${quickStartActivo}</p>
        
        <h4>⚙️ Game Rules:</h4>
        <p>The game is won by meeting **${condicionesSeleccionadas.length}** condition(s):</p>
        <ul>
            ${condicionesSeleccionadas.map(c => {
                const [nombre, descripcion] = c.split(' – ').map(s => s.trim());
                return `<li>**${nombre}** – *${descripcion}*</li>`;
            }).join('')}
        </ul>
        
        <h4>👥 Faction Assignment:</h4>
        <ol>
    `;

    partidaGenerada.forEach((raza, index) => {
        const jugadorNum = index + 1;
        const etiqueta = (index === 0) 
            ? `**Fixed Race (AI)**` 
            : `Rotating Race (Player ${jugadorNum})`;
        resultadoHTML += `<li>**Race ${jugadorNum}:** ${raza} (${etiqueta})</li>`;
    });

    resultadoHTML += '</ol>';
    resultadoDiv.innerHTML = resultadoHTML;
}

// --- 4. APPLICATION STARTUP (Remains the same) ---

function iniciarAplicacion() {
    generarDesplegablesRazas();
    generarCondicionesVictoria(); 
}

document.addEventListener('DOMContentLoaded', iniciarAplicacion);