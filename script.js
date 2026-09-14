// --- 1. GLOBAL DATA CONFIGURATION ---
const RAZAS_DISPONIBLES = [
    " ",
    "- Tyranids",
    "Space Marines",
    "Imperial Guard",
    "- Death Korps of Krieg",
    "- Steel Legion",
    "- Praetorian Guard", 
    "- Vostroyan Firstborn", 
    "Sisters Of Battle",
    "- Adeptus Mechanicus Explorators",
    "- Ordo Hereticus (Witch Hunters)",
    "Chaos Space Marines",
    "- Death Guard",
    "- Emperor's Children",
    "- Fallen Angels",
    "- Night Lords",
    "- Thousand Sons",
    "- World Eaters",
    "- Renegade Guard (Tekarn Shogunate)",
    "- Renegade Guard (Vraksian Renegade Militia)",
    "- Daemons", 
    "Eldar",
    "- Harlequins",
    "- Ynnari",
    "Dark Eldar",
    "Necrons",
    "Orks",
    "Tau Empire",
    "- Farsight Enclaves"
];
const RAZA_FIJA = "Space Marines"; 

const CHAPTERS_DISPONIBLES = [
    "Ultramarines", 
    "Blood Angels", 
    "Salamanders",
    "Space Wolves", 
    "Dark Angels", 
    "Black Templars", 
    "Imperial Fists", 
    "others (White Scars, Iron Hands, Crimson Fists)",
    "- Alpha Legion",
    "- Grey Knights - Ordo Malleus (Daemon Hunters)",
    "- Legion of the Damned",
    "- Raven Guard",
    "- Salamandrems",
    "- 13th Company Space Wolves",
    "- Emperor's Children",
    "- Iron Warriors"
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
    const searchContainer = document.getElementById('busqueda-mapa-container');
    if (searchContainer) {
        searchContainer.style.display = 'none';
        document.getElementById('busqueda-mapa-input').value = '';
        document.getElementById('resultados-busqueda-mapa').innerHTML = '';
    }

    const numJugadoresStr = numJugadoresSelect.value; 

    if (numJugadoresStr === "") {
        instruccionRazas.innerHTML = `<p class="mapa-detalle">You are part of Saul'tn T'au Sept.</p>`; 
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
    
    instruccionRazas.innerHTML = `<p class="mapa-detalle">You are part of Saul'tn T'au Sept. You were previously Space Marines Salamandrems.</p>`; 
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

function generarSeleccionMapa() {
    const numJugadores = numJugadoresSelect.value;
    const mapasDisponibles = MAPAS_CONFIG[numJugadores] || []; 
    
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
        mapasDisponibles.forEach(mapaObj => { 
            const option = document.createElement('option');
            option.value = mapaObj.nombre; 
            option.textContent = mapaObj.nombre; 
            mapaSelect.appendChild(option);
        });
    }
    
    mostrarDescripcionMapa();
}

function mostrarDescripcionMapa() {
    const searchContainer = document.getElementById('busqueda-mapa-container');
    if (searchContainer) {
        searchContainer.style.display = 'none';
        document.getElementById('busqueda-mapa-input').value = '';
        document.getElementById('resultados-busqueda-mapa').innerHTML = '';
    }

    const mapaSeleccionado = mapaSelect.value;
    const numJugadores = numJugadoresSelect.value;
    
    const mapasDisponibles = MAPAS_CONFIG[numJugadores] || [];
    const mapaConfig = mapasDisponibles.find(m => m.nombre === mapaSeleccionado);

    if (mapaConfig) {
        let htmlContent = '';
        if (mapaConfig.descripcion) {
            htmlContent += `<p class="mapa-detalle">${mapaConfig.descripcion}</p>`;
        }
        const iconName = mapaConfig.iconoNombre || mapaConfig.nombre; 
        const imagePath = `https://raw.githubusercontent.com/zokosting/skirmeo/main/map_icons/${iconName}.png`; 
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

function seleccionarMapaAleatorio() {
    const numJugadores = numJugadoresSelect.value;
    const mapasDisponibles = MAPAS_CONFIG[numJugadores] || []; 
    
    if (mapasDisponibles.length > 0) {
        const mapaObj = seleccionarAleatorio(mapasDisponibles); 
        mapaSelect.value = mapaObj.nombre; 
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
    const radioButtons = document.querySelectorAll('input[name="team-option"]');
    radioButtons.forEach(radio => {
        const label = radio.nextElementSibling;
        if (label) {
            label.style.fontWeight = radio.checked ? 'bold' : '400'; 
        }
    });
}

// --- 3. BACKGROUND SECTION & REPORT SAVING ---

function generarSeccionBackground() {
    return `
        <h3>Background:</h3>
        <textarea id="background-text" class="report-textarea" placeholder="Escribe aquí tus notas, lore o contexto de la partida..."></textarea>
        <button id="btn-save-report" class="btn-save-report" onclick="guardarReporteTxt()">Save Report (.txt)</button>
    `;
}

function guardarReporteTxt() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const fechaStr = `${year}-${month}-${day}`;

    // Recopilamos el contenido principal del resultado (excluyendo el botón de guardar y el textarea para procesar texto limpio)
    const resultadoContainer = document.getElementById('resultado');
    
    // Obtenemos los elementos de texto clave
    let contenidoTexto = "=== DAWN OF WAR - MATCH REPORT ===\n\n";
    
    // Extraemos texto relevante del contenedor de resultado
    const headers = resultadoContainer.querySelectorAll('h3');
    headers.forEach(h3 => {
        if (h3.textContent.includes('Background:')) {
            contenidoTexto += "\n[Background]\n";
            const textareaVal = document.getElementById('background-text').value;
            contenidoTexto += (textareaVal ? textareaVal : "(Sin notas adicionales)") + "\n\n";
        } else {
            contenidoTexto += `\n[${h3.textContent}] \n`;
            let nextEl = h3.nextElementSibling;
            while (nextEl && nextEl.tagName !== 'H3' && !nextEl.classList.contains('btn-save-report')) {
                contenidoTexto += nextEl.innerText + "\n";
                nextEl = nextEl.nextElementSibling;
            }
        }
    });

    const blob = new Blob([contenidoTexto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report - ${fechaStr}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- 4. MATCH GENERATION FUNCTION ---

function generarPartida() {
    if (numJugadoresSelect.value === "") {
        resultadoDiv.innerHTML = `<p class="alerta"><b>Error:</b> Max Players selection is required.</p>`;
        return;
    }
    
    const selectElements = document.querySelectorAll('.select-raza-rotatoria');
    const razasValidasSeleccionadas = [];
    const chaptersSeleccionados = {};

    selectElements.forEach((select) => {
        const raza = select.value;
        if (raza && raza.trim() !== "") {
            razasValidasSeleccionadas.push(raza);
            
            if (raza === 'Space Marines') {
                const playerId = select.id.split('-').pop();
                const chapterSelect = document.getElementById(`chapter-select-${playerId}`);
                if (chapterSelect) {
                    chaptersSeleccionados[razasValidasSeleccionadas.length] = chapterSelect.value;
                }
            }
        }
    });

    const checkboxesVictoria = document.querySelectorAll('#condiciones-victoria input[type="checkbox"]');
    const condicionesSeleccionadas = Array.from(checkboxesVictoria)
        .filter(cb => cb.checked)
        .map(cb => {
            const condicionCompleta = CONDICIONES_VICTORIA.find(c => c.startsWith(cb.value));
            return condicionCompleta || cb.value;
        });

    let mapaSeleccionado = mapaSelect.value;
    
    if (mapaSeleccionado === "" || mapaSeleccionado === "No maps available") {
        resultadoDiv.innerHTML = `<p class="alerta"><b>Error:</b> Map selection is required.</p>`;
        return;
    }
    
    if (condicionesSeleccionadas.length === 0) {
         resultadoDiv.innerHTML = `<p class="alerta"><b>Error:</b> You must select at least one Game Rule.</p>`;
         return;
    }
    
    const partidaGenerada = ["T'au Empire (Saul'tn Sept)", ...razasValidasSeleccionadas]; 
    const numJugadoresEfectivos = partidaGenerada.length;
    
    const numMaxConfigurado = parseInt(numJugadoresSelect.value);
    const mapasDisponibles = MAPAS_CONFIG[numMaxConfigurado] || [];
    const mapaConfig = mapasDisponibles.find(m => m.nombre === mapaSeleccionado);
    const iconName = mapaConfig ? (mapaConfig.iconoNombre || mapaConfig.nombre) : mapaSeleccionado;
    const imagePath = `https://raw.githubusercontent.com/zokosting/skirmeo/main/map_icons/${iconName}.png`;
    const descripcionMapaTexto = mapaConfig && mapaConfig.descripcion ? mapaConfig.descripcion : '';
    
    const resourceRateValue = resourceRateSelect ? resourceRateSelect.options[resourceRateSelect.selectedIndex].text : "Standard";
    const dificultadValue = dificultadSelect ? dificultadSelect.options[dificultadSelect.selectedIndex].text : "";

    const checkedTeamOption = document.querySelector('input[name="team-option"]:checked');
    const isFreeForAll = checkedTeamOption && (checkedTeamOption.value === "free-for-all" || checkedTeamOption.id.toLowerCase().includes("free") || (checkedTeamOption.nextElementSibling && checkedTeamOption.nextElementSibling.textContent.toLowerCase().includes("free")));

    let resultadoHTML = `
        <h3 style="margin-bottom: 4px;">${numJugadoresEfectivos} Players:</h3>
        <ul style="list-style-type: none; padding-left: 0; margin-top: 0;">
    `;

    partidaGenerada.forEach((raza, index) => {
        const jugadorNum = index + 1;
        let chapterInfo = '';
        if (raza === 'Space Marines' && index > 0) {
            chapterInfo = ` (Chapter: ${chaptersSeleccionados[index] || CHAPTERS_DISPONIBLES[0]})`;
        }
        resultadoHTML += `<li style="margin-bottom: 4px;"><strong>${jugadorNum}.</strong> ${raza}${chapterInfo}</li>`;
    });

    resultadoHTML += `
        </ul>
        ${isFreeForAll ? `<p style="font-style: italic; margin-top: 4px; margin-bottom: 12px;">Free for All – There are no teams, every player will be hostile to all others, and the last one standing wins.</p>` : ''}

        <h3>Map:</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <p style="margin: 0;"><strong>${mapaSeleccionado}</strong></p>
            ${descripcionMapaTexto ? `<p class="mapa-detalle" style="margin: 0 0 4px 0; font-style: italic;">${descripcionMapaTexto}</p>` : ''}
            <img src="${imagePath}" alt="${mapaSeleccionado}" class="map-icon-display" onerror="this.onerror=null; this.style.display='none'">
        </div>

        <h3>Configuration:</h3>
        <ul>
            ${condicionesSeleccionadas.map(c => {
                const [nombre, descripcion] = c.split(' – ').map(s => s.trim());
                return `<li><strong>${nombre}</strong> – <em>${descripcion}</em></li>`;
            }).join('')}
            <li><strong>Resource Rate:</strong> ${resourceRateValue}</li>
            <li><strong>${dificultadValue}</strong></li>
        </ul>
    `;

    resultadoHTML += generarSeccionBackground();

    resultadoDiv.innerHTML = resultadoHTML;
}

// --- 5. SEARCH FUNCTIONS ---

function toggleSearchInput() {
    const container = document.getElementById('busqueda-mapa-container');
    if (container.style.display === 'none') {
        container.style.display = 'block';
        document.getElementById('busqueda-mapa-input').focus();
    } else {
        container.style.display = 'none';
        document.getElementById('busqueda-mapa-input').value = '';
        document.getElementById('resultados-busqueda-mapa').innerHTML = '';
    }
}

function filtrarMapas() {
    const input = document.getElementById('busqueda-mapa-input');
    const term = input.value.trim().toLowerCase();
    const resultadosDiv = document.getElementById('resultados-busqueda-mapa');
    
    if (term === '') {
        resultadosDiv.innerHTML = '';
        return;
    }

    const palabras = term.split(/\s+/).filter(p => p.length > 0);
    const todasLasCategorias = Object.keys(MAPAS_CONFIG);
    const coincidencias = [];

    todasLasCategorias.forEach(numJug => {
        const mapas = MAPAS_CONFIG[numJug] || [];
        mapas.forEach(mapa => {
            if (mapa.descripcion) {
                const descLower = mapa.descripcion.toLowerCase();
                const todasPresentes = palabras.every(palabra => descLower.includes(palabra));
                if (todasPresentes) {
                    coincidencias.push({
                        nombre: mapa.nombre,
                        jugadores: numJug
                    });
                }
            }
        });
    });

    if (coincidencias.length === 0) {
        resultadosDiv.innerHTML = '<div class="sin-resultados">No matches found.</div>';
    } else {
        let html = '';
        coincidencias.forEach(item => {
            html += `<div class="resultado-busqueda-item" data-jugadores="${item.jugadores}" data-nombre="${item.nombre}">${item.nombre} (${item.jugadores} players)</div>`;
        });
        resultadosDiv.innerHTML = html;
    }
}

function seleccionarMapaDesdeBusqueda(nombre, numJugadores) {
    numJugadoresSelect.value = numJugadores;
    generarDesplegablesRazas();
    mapaSelect.value = nombre;
    mostrarDescripcionMapa();
    
    const container = document.getElementById('busqueda-mapa-container');
    container.style.display = 'none';
    document.getElementById('busqueda-mapa-input').value = '';
    document.getElementById('resultados-busqueda-mapa').innerHTML = '';
}

// --- 6. APPLICATION STARTUP & STYLING ---

function aplicarEstiloBotónGenerar() {
    const botones = document.querySelectorAll('button');
    botones.forEach(btn => {
        if (btn.getAttribute('onclick')?.includes('generarPartida') || btn.textContent.toLowerCase().includes('generar')) {
            btn.style.marginTop = '15px';
            btn.style.backgroundColor = '#1b365d';
            btn.style.color = '#ffffff';
            btn.style.border = '1px solid #1b365d';
            btn.style.transition = 'background-color 0.2s ease';

            btn.onmouseover = function() {
                this.style.backgroundColor = '#142847';
            };
            btn.onmouseout = function() {
                this.style.backgroundColor = '#1b365d';
            };
        }
    });
}

function ajustarContenedorResultado() {
    if (resultadoDiv) {
        resultadoDiv.style.padding = '0 15px';
    }
}

function iniciarAplicacion() {
    generarDesplegablesRazas();
    generarCondicionesVictoria();
    updateTeamOptionStyle();
    aplicarEstiloBotónGenerar();
    ajustarContenedorResultado();
    resultadoDiv.innerHTML = '';

    document.getElementById('resultados-busqueda-mapa').addEventListener('click', function(e) {
        const target = e.target.closest('.resultado-busqueda-item');
        if (target) {
            const nombre = target.dataset.nombre;
            const jugadores = target.dataset.jugadores;
            if (nombre && jugadores) {
                seleccionarMapaDesdeBusqueda(nombre, jugadores);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', iniciarAplicacion);