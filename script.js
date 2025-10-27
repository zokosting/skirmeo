// --- 1. GLOBAL DATA CONFIGURATION ---
const RAZAS_DISPONIBLES = [
    "Orks", "Eldar", "Imperial Guard", "Chaos Space Marines", 
    "Space Marines", "Tau Empire", "Necrons", "Sisters Of Battle", "Dark Eldar"
];
const RAZA_FIJA = "Space Marines"; 

// NEW: Space Marines Chapters
const CHAPTERS_DISPONIBLES = [
    "Ultramarines", 
    "Blood Angels", 
    "Salamandras", 
    "Space Wolves", 
    "Dark Angels", 
    "Black Templars", 
    "Imperial Fists", 
    "more (White Scars, Iron Hands, Crimson Fists)"
];

const CONDICIONES_VICTORIA = [
    "Annihilate – Win by destroying all of the enemy’s unit-producing buildings",
    "Game Timer – The game ends when time runs out",
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
        "Tainted soul", "Tartarus Center", "Volcanic Reaction, Rockclaw Foothills"
    ],
    "5": ["Red Jungle"],
    "6": [
        "Bloodshed Alley", "Crossroads", "Dread Alleu", "Jungle Walls", "Kasyr Lutien", 
        "Mortalis", "Streets of Vogen", "Testing Grounds"
    ],
    "8": [
        "Burial Grounds", "Daturias Pits", "Doom Chamber", "Lost Hope", "Penal Colony, Kierr Harrad"
    ]
};

const MAPAS_DESCRIPCION = {
    "Battle Marshes": "Map size: 257 - Strat. points: 8 - Relics: 2 - Slag depos: 0",
    "Blood River": "Map size: 257 - Strat. points: 8 - Relics: 2 - Slag depos: 0",
    "Deadman's Crossing": "Map size: 257",
    "Edemus Gamble": "Map size: 257",
    "Kierr Harrad": "Map size: 512",
    "Rockclaw Foothills": "Map size: 513"
};


// DOM Elements 
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

/** Generates race dropdowns and calls generateMapSelection. (Updated with Chapter logic and styling) */
function generarDesplegablesRazas() {
    const numJugadores = parseInt(numJugadoresSelect.value);
    
    if (isNaN(numJugadores) || numJugadores < 2) {
        contenedorDesplegables.innerHTML = '<p class="alerta">Error reading player count.</p>';
        return; 
    }
    
    const numRazasARotar = numJugadores - 1; 
    
    // Applying the desired format for the instruction text
    instruccionRazas.innerHTML = `<p class="mapa-detalle">You are **Space Marines**.</p>`; 
    contenedorDesplegables.innerHTML = ''; 

    for (let i = 1; i <= numRazasARotar; i++) {
        const playerId = i;
        
        // Wrapper div for race select and chapter select
        const raceWrapper = document.createElement('div');
        raceWrapper.classList.add('race-item-wrapper');
        
        // Group for the select and label
        const raceSelectGroup = document.createElement('div');
        raceSelectGroup.classList.add('race-item-select-group');
        
        const raceLabelText = document.createElement('span');
        raceLabelText.innerHTML = `Race ${playerId + 1}: &nbsp;`; 
        
        const select = document.createElement('select');
        select.id = `raza-jugador-${playerId}`;
        select.classList.add('select-raza-rotatoria');
        
        // NEW: Add onchange listener for Chapter selection
        select.setAttribute('onchange', 'toggleChapterSelect(this)');

        RAZAS_DISPONIBLES.forEach(raza => {
            const option = document.createElement('option');
            option.value = raza;
            option.textContent = raza;
            
            if (raza === RAZA_FIJA) {
                option.selected = true; 
            }
            select.appendChild(option);
        });

        raceSelectGroup.appendChild(raceLabelText); 
        raceSelectGroup.appendChild(select);
        raceWrapper.appendChild(raceSelectGroup);
        
        // NEW: Add Chapter container (hidden by default)
        const chapterContainer = document.createElement('div');
        chapterContainer.id = `chapter-container-${playerId}`;
        chapterContainer.classList.add('chapter-select-container');
        // Check if default is SM to show the chapter dropdown
        chapterContainer.style.display = select.value === 'Space Marines' ? 'flex' : 'none';
        
        let chapterHTML = '<label for="chapter-select">Chapter:</label>';
        chapterHTML += `<select id="chapter-select-${playerId}" class="chapter-select">`;
        CHAPTERS_DISPONIBLES.forEach(chapter => {
             chapterHTML += `<option value="${chapter}">${chapter}</option>`;
        });
        chapterHTML += '</select>';
        chapterContainer.innerHTML = chapterHTML;
        
        raceWrapper.appendChild(chapterContainer);
        contenedorDesplegables.appendChild(raceWrapper);
    }
    
    generarSeleccionMapa();
}

/** Generates victory condition checkboxes. (Modified: Select 'Destroy HQ' by default) */
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
        
        // NEW: Select 'Destroy HQ' by default
        const isDefaultChecked = (nombreCorto === "Destroy HQ");
        if (isDefaultChecked) {
            checkbox.checked = true;
        }

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = nombreCorto;
        
        const descSpan = document.createElement('span'); 
        descSpan.classList.add('descripcion-victoria');
        descSpan.textContent = ` – ${descripcion}`;
        // Show description if checked by default
        descSpan.style.display = isDefaultChecked ? 'inline' : 'none'; 

        checkbox.onchange = function() {
            descSpan.style.display = this.checked ? 'inline' : 'none';
        };

        divGroup.appendChild(checkbox);
        divGroup.appendChild(label);
        divGroup.appendChild(descSpan); 
        contenedorCondiciones.appendChild(divGroup);
    });
}

/** Fills the map dropdown based on the selected player count and clears description. (Unchanged) */
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

/** Shows the specific description for a selected map. (Unchanged) */
function mostrarDescripcionMapa() {
    const mapaSeleccionado = mapaSelect.value;
    const descripcion = MAPAS_DESCRIPCION[mapaSeleccionado];
    
    if (descripcion) {
        descripcionMapaDiv.innerHTML = `<p class="mapa-detalle">${descripcion}</p>`;
    } else {
        descripcionMapaDiv.innerHTML = ''; 
    }
}

/** Helper function to select a random element from an array. (Unchanged) */
function seleccionarAleatorio(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/** Selects a random map, updates the dropdown, and shows the description. (Unchanged) */
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

/** NEW: Toggles the Chapter dropdown when 'Space Marines' is selected. */
function toggleChapterSelect(selectElement) {
    const playerId = selectElement.id.split('-').pop();
    const chapterContainer = document.getElementById(`chapter-container-${playerId}`);
    
    if (chapterContainer) {
        if (selectElement.value === 'Space Marines') {
            chapterContainer.style.display = 'flex';
        } else {
            chapterContainer.style.display = 'none';
        }
    }
}

/** NEW: Selects a random race for all non-fixed race dropdowns. */
function randomizeAllRaces() {
    const raceSelects = document.querySelectorAll('.select-raza-rotatoria');
    raceSelects.forEach(select => {
        const randomIndex = Math.floor(Math.random() * RAZAS_DISPONIBLES.length);
        const randomRace = RAZAS_DISPONIBLES[randomIndex];
        
        select.value = randomRace;
        
        // Trigger the onchange logic
        toggleChapterSelect(select);
    });
}

// --- 3. MATCH GENERATION FUNCTION (Updated to include Chapter and Team options) ---

function generarPartida() {
    const selectElements = document.querySelectorAll('.select-raza-rotatoria');
    const razasSeleccionadas = [];
    const chaptersSeleccionados = {};

    selectElements.forEach(select => {
        const raza = select.value;
        razasSeleccionadas.push(raza);
        
        // Check for Chapter selection if Space Marines is the race
        if (raza === 'Space Marines') {
            const playerId = select.id.split('-').pop();
            const chapterSelect = document.getElementById(`chapter-select-${playerId}`);
            if (chapterSelect) {
                // Store chapter with the player identifier
                chaptersSeleccionados[`Race ${parseInt(playerId) + 1}`] = chapterSelect.value;
            }
        }
    });
    
    // NEW: Get selected Team Option
    const selectedTeamRadio = document.querySelector('input[name="team-option"]:checked');
    const teamOption = selectedTeamRadio ? selectedTeamRadio.value : 'N/A';
    
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
        
        <h4>🤝 Team Configuration: **${teamOption}**</h4>

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
        
        let chapterInfo = '';
        // Only check for chapter info if it's one of the rotating players
        if (index > 0 && raza === 'Space Marines' && chaptersSeleccionados[`Race ${jugadorNum}`]) {
            chapterInfo = ` (Chapter: ${chaptersSeleccionados[`Race ${jugadorNum}`]})`;
        }
        
        resultadoHTML += `<li>**Race ${jugadorNum}:** ${raza}${chapterInfo} (${etiqueta})</li>`;
    });

    resultadoHTML += '</ol>';
    resultadoDiv.innerHTML = resultadoHTML;
}

// --- 4. APPLICATION STARTUP (Unchanged) ---

function iniciarAplicacion() {
    generarDesplegablesRazas();
    generarCondicionesVictoria(); 
}

document.addEventListener('DOMContentLoaded', iniciarAplicacion);