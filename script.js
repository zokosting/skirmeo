// --- 1. GLOBAL DATA CONFIGURATION ---
const RAZAS_DISPONIBLES = [
    "Orks", "Eldar", "Imperial Guard", "Chaos Space Marines", 
    "Space Marines", "Tau Empire", "Necrons", "Sisters Of Battle", "Dark Eldar"
];
const RAZA_FIJA = "Space Marines"; 

// Space Marines Chapters
const CHAPTERS_DISPONIBLES = [
    "Ultramarines", 
    "Blood Angels", 
    "Salamanders",
    "Space Wolves", 
    "Dark Angels", 
    "Black Templars", 
    "Imperial Fists", 
    "others (White Scars, Iron Hands, Crimson Fists)"
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

// REFACTORIZACIÓN DE MAPAS: Las variables MAPAS_POR_JUGADOR, MAPAS_DESCRIPCION, y MAPAS_ICONO_NOMBRE se han consolidado aquí.
const MAPAS_CONFIG = {
    "2": [
        { nombre: "Antiga Bay", iconoNombre: "Antiga Bay (2)", descripcion: "Dense forest surrounding a bay with craters." },
        { nombre: "Battle Marshes", descripcion: "Map size: 257 | Strat. points: 8 | Relics: 2 | Slag depos: 0" },
        { nombre: "Blood River", descripcion: "Map size: 257 | Strat. points: 8 | Relics: 2 | Slag depos: 0" },
        { nombre: "Deadman's Crossing", descripcion: "Map size: 257" },
        { nombre: "Dicey Ambush", descripcion: "Wooded valley divided by a river and surrounded by mountains." },
        { nombre: "Ecstasy's Peril", descripcion: "A Chaos war temple in an artic terrain.<br/>Map size: 257" },
        { nombre: "Edemus Gamble", descripcion: "Map size: 257" },
        { nombre: "Faceoff" },
        { nombre: "Fallen City" },
        { nombre: "Galenas Crusade", descripcion: "Arctic terrain, with large snowfields with craters." },
        { nombre: "Hellfire Canyon" },
        { nombre: "Jungle Morning", descripcion: "Grasslands, forest and rocks, large swamp areas.<br/>Map size: 257" },
        { nombre: "Meeting of Minds" },
        { nombre: "Oja", descripcion: "Paths through dense jungle with bridges over rivers." },
        { nombre: "Outer Reaches", descripcion: "Mountainous terrain with paths, shrubs and ruins.<br/>Map size: 257" },
        { nombre: "Railway" },
        { nombre: "Riverbed" },
        { nombre: "Sands of Time", descripcion: "Sand desert with pyramids and a small river.<br/>Map size: 257 | Strat. points: 7 | Relics: 2 | Critical loc.: 3" },
        { nombre: "Short Below Zero", descripcion: "Arctic, islands with snow, broken ice and craters." },
        { nombre: "Tainted Pair" },
        { nombre: "Tainted Soul", descripcion: "Map size: 257" },
        { nombre: "Tash'Var City", descripcion: "A Tau city. You'll get some help here.<br/>Map size: 1025" },
        { nombre: "Valley of Khorne" },
        { nombre: "Velvet Duress", descripcion: "Archipelago of sand and vegetation in an open sea.<br/>Map size: 257" }
    ],
    "3": [
        { nombre: "Coral Reef", descripcion: "Coral reef island with white sand, surrounded by sea.<br/>Map size: 257" },
        { nombre: "Fortress", descripcion: "Urban ruined environment with large craters, debris and streets.<br/>Map size: 257 | Strat. points: 9 | Critical loc.: 3 | Relics: 1" },
        { nombre: "Inquisitors Fortress", descripcion: "Rocky terrain, fortress and military structures in ravines.<br/>Map size: 513<br/>Strat. points: 11 | Critical loc.: 2 | Relics: 2 | Slag depos: 2<br/>You'll get some help here from the Blood Angels." }
    ],
    "4": [
        { nombre: "Antiga Bay", iconoNombre: "Antiga Bay (4)", descripcion: "Swampy bay in a forested area with numerous craters and beaches." },
        { nombre: "Apocalypse Later", descripcion: "Dense wooded area divided by an estuary and a sandy edge.<br/>Map size: 513<br/>Strat. points: 16 | Critical loc.: 1 | Relics: 2 | Slag depos: 2" },
        { nombre: "Biffy's Peril" },
        { nombre: "Cold War", descripcion: "Frozen landscape with bodies of frozen water and military structures." },
        { nombre: "Mountain Trail" },
        { nombre: "Panrea Lowlands", descripcion: "Grasslands with gentle hills and multiple rivers or water channels.<br/>Map size: 257 | Strat. points: 16 | Relics: 2" },
        { nombre: "Quatra" },
        { nombre: "Refinery", descripcion: "Industrial and desert environment structured around a central refinery.<br/>Map size: 257<br/>Strat. points: 12 | Critical loc.: 2 | Relics: 2 | Slag depos: 4" },
        { nombre: "Rockclaw Foothills", descripcion: "Map size: 513" },
        { nombre: "Saint's Square" },
        { nombre: "Tainted Place" },
        { nombre: "Tainted soul" },
        { nombre: "Tartarus Center" },
        { nombre: "The Skerries", descripcion: "Dense string of small islands.<br/>Map size: 257" },
        { nombre: "Volcanic Reaction" }
    ],
    "5": [
        { nombre: "Aceria Forests", descripcion: "Field with forest and a central hill next to a lake.<br/>Map size: 257 | Strat. points: 17" },
        { nombre: "Istvaan V", descripcion: "Desolate landscape of ash, rocks and rugged terrain.<br/>Map size: 1025" },
        { nombre: "Red Jungle", descripcion: "Large island covered by dense forest and paths.<br/>Map size: 513 | Strat. points: 17 | Critical loc.: 6 | Relics: 2" },
        { nombre: "The Eye of Gorgon", descripcion: "Polar snowy terrain with multiple lakes and large bodies of water.<br/>Map size: 513" },
        { nombre: "Vyasastan", descripcion: "Urban environment with destroyed streets and buildings.<br/>Map size: 513" }
    ],
    "6": [
        { nombre: "Bloodshed Alley" },
        { nombre: "Crossroads" },
        { nombre: "Dread Alley", descripcion: "Rife with gangers and muties, every twist and turn in this tovel is dangerous.<br/>Map size: 513" },
        { nombre: "Jungle Walls" },
        { nombre: "Kasyr Lutien" },
        { nombre: "Mortalis" },
        { nombre: "Payne's Retribution", descripcion: "Map size: 513" },
        { nombre: "Pavonis", descripcion: "Map size: 513" },
        { nombre: "Principian Badlands", descripcion: "Map size: 513" },
        { nombre: "Rhean Floodlands", descripcion: "Treacherous, winding paths, sharp ridges, and sudden gullies.<br/>Map size: 513" },
        { nombre: "Shakun Coast", descripcion: "Map size: 513" },
        { nombre: "Streets of Vogen", descripcion: "Map size: 513" },
        { nombre: "Targorum", descripcion: "Map size: 257" },
        { nombre: "Temple of Change", descripcion: "The worst scenario you will face. Some weird temple." },
        { nombre: "Temple of Cyrene", descripcion: "Ruins of a temple-fortification in cratered terrain.<br/>Map size: 513<br/>Strat. points: 29 | Critical loc.: 3 | Relics: 4 | Slag depos: 5" },
        { nombre: "Testing Grounds", descripcion: "Ruins of a temple-fortification in cratered terrain.<br/>Map size: 513" },
        { nombre: "Tristam Plains", descripcion: "Live combat fighting for Space Marines.<br/>Map size: 513" },
        { nombre: "Trivian Groves", descripcion: "Map size: 513" },
        { nombre: "Vandean Coast", descripcion: "Map size: 257" },
        { nombre: "Western Barrens", descripcion: "Arid rocky desert with a central plateau.<br/>Map size: 513" }
    ],
    "8": [
        { nombre: "Burial Grounds" },
        { nombre: "Canyon Break", descripcion: "Deep within the canyons of Rynn's World’s arid plateaus, rivers serve as the only natural supply routes." },
        { nombre: "Castle Ruostestein", descripcion: "Map size: 1025<br/>Strat. points: 40 | Critical loc.: 6 | Relics: 8 | Slag depos: 9<br/>This map is thought for a single player with two AI allies, you will defend a castle against 5 AI attackers. The two sides are connected by a small bridge. And two tunnels that can be used by the player 1 only. Don't let the innocent look of that bridge fool you; most of the fight will take place there. Albeit, if you use the tunnels correctly, you will fight in the enemies bases rather than your own. Orks will get 4 Titan cannons and Astra Militarum will get 2 (A key)." },
        { nombre: "Cerulea", descripcion: "Green and rocky terrain with a large central mountain and flowing rivers.<br/>Map size: 513" },
        { nombre: "Daturias Pits" },
        { nombre: "Doom Chamber" },
        { nombre: "Jalaganda Lowlands", descripcion: "Intricate lattice of canals in this humit industrial wasteland.<br/>Map size: 513" },
        { nombre: "Kierr Harrad", descripcion: "Map size: 512" },
        { nombre: "Lost Hope" },
        { nombre: "Penal Colony" },
        { nombre: "Rhean Jungle", descripcion: "Dense jungle with open dirt paths and hills.<br/>Map size: 513" },
        { nombre: "The Razor Ridge", descripcion: "Rocky highlands with numerous narrow passes and vertical rock formations." },
        { nombre: "Wetlands", descripcion: "The dense growth and treacherous vapors of Strank provides lethal negative-cover zones." }
    ]
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

function generarDesplegablesRazas() {
    const numJugadoresStr = numJugadoresSelect.value; 

    if (numJugadoresStr === "") {
        instruccionRazas.innerHTML = `<p class="mapa-detalle">You are part of T'au ~ Shi'yen.</p>`; 
        contenedorDesplegables.innerHTML = ''; 
        generarSeleccionMapa(); 
        return; 
    }

    const numJugadores = parseInt(numJugadoresStr);
    
    if (isNaN(numJugadores) || numJugadores < 2) {
        contenedorDesplegables.innerHTML = '<p class="alerta">Error reading player count.</p>';
        return; 
    }
    
    const numRazasARotar = numJugadores - 1; 
    
    instruccionRazas.innerHTML = `<p class="mapa-detalle">You were Space Marines Salamandrems. Now you are part of T'au ~ Saul't.</p>`; 
    contenedorDesplegables.innerHTML = ''; 

    for (let i = 1; i <= numRazasARotar; i++) {
        const playerId = i;
        
        const raceWrapper = document.createElement('div');
        raceWrapper.classList.add('race-item-wrapper');
        
        const raceSelectGroup = document.createElement('div');
        raceSelectGroup.classList.add('race-item-select-group');
        
        const raceLabelText = document.createElement('span');
        raceLabelText.innerHTML = `Race ${playerId + 1}: &nbsp;`; 
        
        const select = document.createElement('select');
        select.id = `raza-jugador-${playerId}`;
        select.classList.add('select-raza-rotatoria');
        
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
        
        const chapterContainer = document.createElement('div');
        chapterContainer.id = `chapter-container-${playerId}`;
        chapterContainer.classList.add('chapter-select-container');
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

// ACTUALIZADO: Usa MAPAS_CONFIG
function generarSeleccionMapa() {
    const numJugadores = numJugadoresSelect.value;
    const mapasDisponibles = MAPAS_CONFIG[numJugadores] || []; // Usa la nueva estructura
    
    mapaSelect.innerHTML = '';
    
    const defaultOption = document.createElement('option');
    defaultOption.textContent = "-Select";
    defaultOption.value = "";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    mapaSelect.appendChild(defaultOption);

    if (mapasDisponibles.length === 0) {
        const option = document.createElement('option');
        option.textContent = "No maps available";
        option.value = "";
        mapaSelect.appendChild(option);
    } else {
        mapasDisponibles.forEach(mapaObj => { // Itera sobre objetos
            const option = document.createElement('option');
            option.value = mapaObj.nombre; // El valor es el nombre
            option.textContent = mapaObj.nombre; // El texto es el nombre
            mapaSelect.appendChild(option);
        });
    }
    
    mostrarDescripcionMapa();
}

// ACTUALIZADO: Usa MAPAS_CONFIG y la nueva lógica de iconos
function mostrarDescripcionMapa() {
    const mapaSeleccionado = mapaSelect.value;
    const numJugadores = numJugadoresSelect.value;
    
    // Encontrar el objeto del mapa desde la nueva estructura
    const mapasDisponibles = MAPAS_CONFIG[numJugadores] || [];
    const mapaConfig = mapasDisponibles.find(m => m.nombre === mapaSeleccionado);

    if (mapaConfig) {
        let htmlContent = '';
        
        // Añadir descripción si existe
        if (mapaConfig.descripcion) {
            htmlContent += `<p class="mapa-detalle">${mapaConfig.descripcion}</p>`;
        }
        
        // --- NUEVA LÓGICA DE ICONOS ---
        
        // Lógica de icono: Usa 'iconoNombre' si existe, si no, usa 'nombre'
        const iconName = mapaConfig.iconoNombre || mapaConfig.nombre; 
        
        const imagePath = `https://raw.githubusercontent.com/zokosting/skirmeo/main/map_icons/${iconName}.png`; 
        
        // Añadido onerror para ocultar la imagen si no se encuentra, en lugar de mostrar un placeholder
        htmlContent += `<img src="${imagePath}" alt="Icono del mapa ${mapaConfig.nombre}" class="map-icon-display" onerror="this.onerror=null; this.style.display='none'">`; 

        descripcionMapaDiv.innerHTML = htmlContent;
    } else {
        descripcionMapaDiv.innerHTML = ''; 
    }
}


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


function seleccionarAleatorio(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ACTUALIZADO: Usa MAPAS_CONFIG
function seleccionarMapaAleatorio() {
    const numJugadores = numJugadoresSelect.value;
    const mapasDisponibles = MAPAS_CONFIG[numJugadores] || []; // Usa la nueva estructura
    
    if (mapasDisponibles.length > 0) {
        const mapaObj = seleccionarAleatorio(mapasDisponibles); // Selecciona un objeto
        mapaSelect.value = mapaObj.nombre; // Asigna el nombre
        mostrarDescripcionMapa(); 
    } else {
        descripcionMapaDiv.innerHTML = '<p class="alerta">No maps available for this player count to select randomly.</p>';
        mapaSelect.value = "";
    }
}

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

/** Selects a random race for all non-fixed race dropdowns, and randomizes Chapter if SM is selected. */
function randomizeAllRaces() {
    const raceSelects = document.querySelectorAll('.select-raza-rotatoria');
    raceSelects.forEach(select => {
        const randomRace = seleccionarAleatorio(RAZAS_DISPONIBLES);
        
        select.value = randomRace;
        
        toggleChapterSelect(select);

        if (randomRace === 'Space Marines') {
            const playerId = select.id.split('-').pop();
            const chapterSelect = document.getElementById(`chapter-select-${playerId}`);
            if (chapterSelect) {
                const randomChapter = seleccionarAleatorio(CHAPTERS_DISPONIBLES);
                chapterSelect.value = randomChapter;
            }
        }
    });
}

function updateTeamOptionStyle() {
    const radioButtons = document.querySelectorAll('#team-options-group input[name="team-option"]');
    radioButtons.forEach(radio => {
        const label = radio.nextElementSibling;
        label.style.fontWeight = radio.checked ? 'bold' : '400'; 
    });
}

// --- 3. MATCH GENERATION FUNCTION (Updated result display) ---

function generarPartida() {
    // Validación inicial para -Select
    if (numJugadoresSelect.value === "") {
        resultadoDiv.innerHTML = `<p class="alerta">🚨 **Error:** Max Players selection is required.</p>`;
        return;
    }
    
    const selectElements = document.querySelectorAll('.select-raza-rotatoria');
    const razasSeleccionadas = [];
    const chaptersSeleccionados = {};

    selectElements.forEach(select => {
        const raza = select.value;
        razasSeleccionadas.push(raza);
        
        if (raza === 'Space Marines') {
            const playerId = select.id.split('-').pop();
            const chapterSelect = document.getElementById(`chapter-select-${playerId}`);
            if (chapterSelect) {
                chaptersSeleccionados[`Race ${parseInt(playerId) + 1}`] = chapterSelect.value;
            }
        }
    });
    
    const selectedTeamRadio = document.querySelector('input[name="team-option"]:checked');
    const teamOption = selectedTeamRadio ? selectedTeamRadio.value : 'N/A';
    const teamLabel = selectedTeamRadio ? selectedTeamRadio.nextElementSibling.textContent : 'N/A'; 
    const teamDescription = teamLabel.split(' – ')[1] || 'No team description.';
    
    const dificultadSeleccionada = dificultadSelect.value; 
    const resourceRateSeleccionado = resourceRateSelect.value;
    const numJugadores = parseInt(numJugadoresSelect.value);
    const quickStartActivo = quickStartCheckbox.checked ? "Activated (High Starting Resources)" : "Deactivated (Standard Starting Resources)";

    const checkboxesVictoria = document.querySelectorAll('#condiciones-victoria input[type="checkbox"]');
    const condicionesSeleccionadas = Array.from(checkboxesVictoria)
        .filter(cb => cb.checked)
        .map(cb => {
            const condicionCompleta = CONDICIONES_VICTORIA.find(c => c.startsWith(cb.value));
            return condicionCompleta || cb.value;
        });

    let mapaSeleccionado = mapaSelect.value;
    
    if (mapaSeleccionado === "" || mapaSeleccionado === "No maps available") {
        resultadoDiv.innerHTML = `<p class="alerta">**Error:** Map selection is required.</p>`;
        return;
    }
    
    if (condicionesSeleccionadas.length === 0) {
         resultadoDiv.innerHTML = `<p class="alerta">**Error:** You must select at least one Game Rule.</p>`;
         return;
    }
    
    const partidaGenerada = [RAZA_FIJA, ...razasSeleccionadas]; 

    let resultadoHTML = `
        <h3>Configuration: ${numJugadores} Players | AI Difficulty: **${dificultadSeleccionada}**</h3>
        
        <h4>Map:</h4>
        <p>**${mapaSeleccionado}**</p>

        <h4>Starting Resources:</h4>
        <p>Resource Rate: **${resourceRateSeleccionado}**</p>
        <p>Quick Start: ${quickStartActivo}</p>
        
        <h4>Game Rules:</h4>
        <p>The game is won by meeting **${condicionesSeleccionadas.length}** condition(s):</p>
        <ul>
            ${condicionesSeleccionadas.map(c => {
                const [nombre, descripcion] = c.split(' – ').map(s => s.trim());
                return `<li>**${nombre}** – *${descripcion}*</li>`;
            }).join('')}
        </ul>
        
        <h4>Faction Assignment & Team Setup:</h4>
        <p class="mapa-detalle">**Team Option:** ${teamOption} – *${teamDescription}*</p> 
        <ol>
    `;

    partidaGenerada.forEach((raza, index) => {
        const jugadorNum = index + 1;
        const etiqueta = (index === 0) 
            ? `**Fixed Race (AI)**` 
            : `Rotating Race (Player ${jugadorNum})`;
        
        let chapterInfo = '';
        if (raza === 'Space Marines' && chaptersSeleccionados[`Race ${jugadorNum}`]) {
            chapterInfo = ` (Chapter: ${chaptersSeleccionados[`Race ${jugadorNum}`]})`;
        } else if (index === 0 && raza === RAZA_FIJA) {
             // Logic for Fixed Race Chapter could be added here if needed
        }

        resultadoHTML += `<li>**Race ${jugadorNum}:** ${raza}${chapterInfo} (${etiqueta})</li>`;
    });

    resultadoHTML += '</ol>';
    resultadoDiv.innerHTML = resultadoHTML;
}

// --- 4. APPLICATION STARTUP (Updated) ---

function iniciarAplicacion() {
    generarDesplegablesRazas();
    generarCondicionesVictoria(); 
    
    updateTeamOptionStyle(); 

    resultadoDiv.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', iniciarAplicacion);