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

    if (!numJugadoresSelect) return;
    const numJugadoresStr = numJugadoresSelect.value; 

    if (numJugadoresStr === "") {
        if (instruccionRazas) instruccionRazas.innerHTML = `<p class="mapa-detalle">You are part of Saul'tn T'au Sept.</p>`; 
        if (contenedorDesplegables) contenedorDesplegables.innerHTML = ''; 
        generarSeleccionMapa(); 
        return; 
    }

    const numJugadores = parseInt(numJugadoresStr);
    
    if (isNaN(numJugadores) || numJugadores < 2) {
        if (contenedorDesplegables) contenedorDesplegables.innerHTML = '<p class="alerta">Error reading player count.</p>';
        return; 
    }
    
    const numRazasARotar = numJugadores - 1; 
    
    if (instruccionRazas) instruccionRazas.innerHTML = `<p class="mapa-detalle">You are now part of Saul'tn T'au Sept. You were previously Space Marines Salamandrems.</p>`; 
    if (contenedorDesplegables) contenedorDesplegables.innerHTML = ''; 

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
        if (contenedorDesplegables) contenedorDesplegables.appendChild(raceWrapper);
    }
    
    generarSeleccionMapa();
}

function generarSeleccionMapa() {
    if (!numJugadoresSelect || !mapaSelect) return;
    const numJugadores = numJugadoresSelect.value;
    const mapasDisponibles = typeof MAPAS_CONFIG !== 'undefined' ? (MAPAS_CONFIG[numJugadores] || []) : []; 
    
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
        const searchInput = document.getElementById('busqueda-mapa-input');
        if (searchInput) searchInput.value = '';
        const searchResults = document.getElementById('resultados-busqueda-mapa');
        if (searchResults) searchResults.innerHTML = '';
    }

    if (!mapaSelect || !numJugadoresSelect || !descripcionMapaDiv) return;

    const mapaSeleccionado = mapaSelect.value;
    const numJugadores = numJugadoresSelect.value;
    
    const mapasDisponibles = typeof MAPAS_CONFIG !== 'undefined' ? (MAPAS_CONFIG[numJugadores] || []) : [];
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
    if (!contenedorCondiciones) return;
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
    if (!numJugadoresSelect || !mapaSelect || !descripcionMapaDiv) return;
    const numJugadores = numJugadoresSelect.value;
    const mapasDisponibles = typeof MAPAS_CONFIG !== 'undefined' ? (MAPAS_CONFIG[numJugadores] || []) : []; 
    
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
        <textarea id="background-text" class="report-textarea" placeholder="Lore background"></textarea>
        <div class="report-buttons-container">
            <button id="btn-save-report" class="btn-save-report" onclick="guardarReporteTxt()">save report</button>
            <button id="btn-upload-report" class="btn-upload-report" onclick="subirReporteGithub()" title="Upload File to GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </button>
            <button id="btn-reports-list" class="btn-reports-list" onclick="window.location.href='reports.html'" title="Reports List">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </button>
        </div>
    `;
}

function obtenerDatosReporte() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const fechaStr = `${year}-${month}-${day}`;

    const mapaSeleccionado = mapaSelect && mapaSelect.value ? mapaSelect.value : "Unknown Map";
    const resultadoContainer = document.getElementById('resultado');
    
    if (!resultadoContainer) return null;

    let contenidoTexto = "# === EVENT REPORT ===\n\n";
    const headers = resultadoContainer.querySelectorAll('h3');
    headers.forEach(h3 => {
        const headerText = h3.textContent.replace(':', '').trim();
        if (h3.textContent.includes('Background:')) {
            contenidoTexto += `\n## Background:\n`;
            const textareaVal = document.getElementById('background-text') ? document.getElementById('background-text').value : "";
            contenidoTexto += (textareaVal ? textareaVal : "(Sin notas adicionales)") + "\n\n";
        } else {
            contenidoTexto += `\n## ${headerText}:\n`;
            let nextEl = h3.nextElementSibling;
            while (nextEl && nextEl.tagName !== 'H3' && !nextEl.classList.contains('report-buttons-container')) {
                let textLine = nextEl.innerText ? nextEl.innerText.trim() : "";
                
                if (nextEl.tagName === 'DIV' && nextEl.id !== 'background-text') {
                    const lineasInternas = nextEl.innerText
                        .split('\n')
                        .map(l => l.trim())
                        .filter(l => l.length > 0);
                    
                    contenidoTexto += lineasInternas.join('\n') + "\n";
                } else if (textLine !== "") {
                    if (nextEl.classList.contains('mapa-detalle')) {
                        textLine = textLine.replace(/\s+/g, ' ').trim();
                    }
                    contenidoTexto += textLine + "\n";
                }
                
                nextEl = nextEl.nextElementSibling;
            }

            // Añadir ## Status: NO tras la sección Configuration:
            if (headerText.toLowerCase().includes('configuration')) {
                contenidoTexto += "## Status: NO\n";
            }
        }
    });

    return {
        filename: `${mapaSeleccionado} - ${fechaStr}.txt`,
        content: contenidoTexto
    };
}

function guardarReporteTxt() {
    const report = obtenerDatosReporte();
    if (!report) {
        alert("Error: Primero debes generar un reporte.");
        return;
    }

    const blob = new Blob([report.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = report.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function subirReporteGithub() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';

    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.txt')) {
            alert("Por favor, selecciona un archivo con extensión .txt");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target.result;
            const filename = file.name;

            let token = localStorage.getItem('gh_pat_token');
            if (!token) {
                token = prompt("Para subir directamente a la carpeta 'reports' de GitHub, introduce tu Personal Access Token (PAT):");
                if (!token) return; 
                token = token.trim();
                localStorage.setItem('gh_pat_token', token);
            }

            const repoOwner = "zokosting";
            const repoName = "skirmeo";
            const folderPath = "reports";
            const filePath = `${folderPath}/${filename}`;
            const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

            const btnUpload = document.getElementById('btn-upload-report');
            if (btnUpload) btnUpload.disabled = true;

            try {
                let sha = null;
                const checkRes = await fetch(apiUrl, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (checkRes.ok) {
                    const fileData = await checkRes.json();
                    sha = fileData.sha;
                } else if (checkRes.status === 401 || checkRes.status === 403) {
                    localStorage.removeItem('gh_pat_token');
                    alert("El Token de GitHub no es válido o ha caducado. Se ha eliminado de la memoria local. Por favor, pulsa de nuevo e introduce un token válido.");
                    if (btnUpload) btnUpload.disabled = false;
                    return;
                }

                const base64Content = btoa(unescape(encodeURIComponent(content)));

                const requestBody = {
                    message: `Upload report: ${filename}`,
                    content: base64Content
                };
                if (sha) {
                    requestBody.sha = sha;
                }

                const putRes = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (putRes.ok) {
                    alert(`¡Reporte "${filename}" subido con éxito a la carpeta 'reports' de GitHub!`);
                    if (document.getElementById('reports-ul')) {
                        cargarReportesGitHub();
                    }
                } else {
                    const errData = await putRes.json();
                    alert(`Error al subir a GitHub: ${errData.message || 'Error desconocido'}`);
                }
            } catch (err) {
                console.error(err);
                alert("Ocurrió un error al intentar subir el reporte a GitHub.");
            } finally {
                if (btnUpload) btnUpload.disabled = false;
            }
        };

        reader.readAsText(file, 'UTF-8');
    };

    fileInput.click();
}

// --- 4. MATCH GENERATION FUNCTION ---

function generarPartida() {
    if (!numJugadoresSelect || numJugadoresSelect.value === "") {
        if (resultadoDiv) resultadoDiv.innerHTML = `<p class="alerta"><b>Error:</b> Max Players selection is required.</p>`;
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

    let mapaSeleccionado = mapaSelect ? mapaSelect.value : "";
    
    if (mapaSeleccionado === "" || mapaSeleccionado === "No maps available") {
        if (resultadoDiv) resultadoDiv.innerHTML = `<p class="alerta"><b>Error:</b> Map selection is required.</p>`;
        return;
    }
    
    if (condicionesSeleccionadas.length === 0) {
        if (resultadoDiv) resultadoDiv.innerHTML = `<p class="alerta"><b>Error:</b> You must select at least one Game Rule.</p>`;
        return;
    }
    
    const partidaGenerada = ["T'au Empire (Saul'tn Sept)", ...razasValidasSeleccionadas]; 
    const numJugadoresEfectivos = partidaGenerada.length;
    
    const numMaxConfigurado = parseInt(numJugadoresSelect.value);
    const mapasDisponibles = typeof MAPAS_CONFIG !== 'undefined' ? (MAPAS_CONFIG[numMaxConfigurado] || []) : [];
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
        <div>
            <p style="margin: 0; line-height: 1.2;"><strong>${mapaSeleccionado}</strong></p>${descripcionMapaTexto ? `<p class="mapa-detalle" style="margin: 0; font-style: italic; line-height: 1.2;">${descripcionMapaTexto}</p>` : ''}
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

    if (resultadoDiv) resultadoDiv.innerHTML = resultadoHTML;
}

// --- 5. SEARCH FUNCTIONS ---

function toggleSearchInput() {
    const container = document.getElementById('busqueda-mapa-container');
    if (!container) return;
    if (container.style.display === 'none') {
        container.style.display = 'block';
        const searchInput = document.getElementById('busqueda-mapa-input');
        if (searchInput) searchInput.focus();
    } else {
        container.style.display = 'none';
        const searchInput = document.getElementById('busqueda-mapa-input');
        if (searchInput) searchInput.value = '';
        const searchResults = document.getElementById('resultados-busqueda-mapa');
        if (searchResults) searchResults.innerHTML = '';
    }
}

function filtrarMapas() {
    const input = document.getElementById('busqueda-mapa-input');
    if (!input) return;
    const term = input.value.trim().toLowerCase();
    const resultadosDiv = document.getElementById('resultados-busqueda-mapa');
    if (!resultadosDiv) return;
    
    if (term === '') {
        resultadosDiv.innerHTML = '';
        return;
    }

    if (typeof MAPAS_CONFIG === 'undefined') return;

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
    if (!numJugadoresSelect || !mapaSelect) return;
    numJugadoresSelect.value = numJugadores;
    generarDesplegablesRazas();
    mapaSelect.value = nombre;
    mostrarDescripcionMapa();
    
    const container = document.getElementById('busqueda-mapa-container');
    if (container) container.style.display = 'none';
    const searchInput = document.getElementById('busqueda-mapa-input');
    if (searchInput) searchInput.value = '';
    const searchResults = document.getElementById('resultados-busqueda-mapa');
    if (searchResults) searchResults.innerHTML = '';
}

// --- 6. REPORTS LIST (REPORTS.HTML) ---

async function cargarReportesGitHub() {
    const repoOwner = "zokosting";
    const repoName = "skirmeo";
    const folderPath = "reports";
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`;

    const ulElement = document.getElementById('reports-ul');
    const loadingText = document.getElementById('loading-text');

    if (!ulElement) return;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Could not fetch repository contents.");
        }

        const files = await response.json();
        const txtFiles = files.filter(file => file.type === 'file' && file.name.endsWith('.txt'));

        if (txtFiles.length === 0) {
            if (loadingText) loadingText.textContent = "No text reports found in the 'reports' folder.";
            return;
        }

        function extraerFecha(nombreArchivo) {
            const match = nombreArchivo.match(/(\d{4}-\d{2}-\d{2})/);
            return match ? match[1] : '0000-00-00';
        }

        function extraerNombreMapa(nombreArchivo) {
            return nombreArchivo.replace(/\s*-\s*\d{4}-\d{2}-\d{2}\.txt$/i, '').replace(/\.txt$/i, '').trim();
        }

        txtFiles.sort((a, b) => {
            const fechaA = extraerFecha(a.name);
            const fechaB = extraerFecha(b.name);
            return fechaA.localeCompare(fechaB);
        });

        if (loadingText) loadingText.style.display = 'none';
        ulElement.innerHTML = '';

        for (const file of txtFiles) {
            const li = document.createElement('li');
            li.classList.add('report-item');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';

            let isDefeat = false;
            try {
                const contentRes = await fetch(file.download_url || file.html_url);
                if (contentRes.ok) {
                    const textContent = await contentRes.text();
                    if (textContent.includes('## Status: NO') || textContent.includes('[Status:] NO')) {
                        isDefeat = true;
                    }
                }
            } catch (err) {
                console.error("No se pudo comprobar el estado del reporte", err);
            }

            const leftContainer = document.createElement('div');
            leftContainer.style.display = 'flex';
            leftContainer.style.alignItems = 'center';
            leftContainer.style.gap = '10px';
            leftContainer.style.flex = '1';

            const a = document.createElement('a');
            a.href = file.download_url || file.html_url;
            a.target = "_blank";
            a.classList.add('report-link');
            
            const nombreMapa = extraerNombreMapa(file.name);
            const fechaCreacion = extraerFecha(file.name);

            a.innerHTML = `📄 <strong>${nombreMapa}</strong> (${fechaCreacion})`;
            leftContainer.appendChild(a);

            // Contenedor derecho para la cruz (+) y la imagen del mapa
            const rightContainer = document.createElement('div');
            rightContainer.style.display = 'flex';
            rightContainer.style.alignItems = 'center';
            rightContainer.style.gap = '12px';
            rightContainer.style.marginLeft = 'auto';

            if (isDefeat) {
                const crossIconContainer = document.createElement('span');
                crossIconContainer.title = "Defeated";
                crossIconContainer.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b365d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
                crossIconContainer.style.display = 'inline-flex';
                crossIconContainer.style.alignItems = 'center';
                rightContainer.appendChild(crossIconContainer);
            }

            const img = document.createElement('img');
            img.src = `map_icons/${nombreMapa}.png`;
            img.alt = `Mapa ${nombreMapa}`;
            img.classList.add('report-map-img');
            img.onerror = function() { this.style.display = 'none'; };
            img.onclick = function(e) {
                e.preventDefault();
                const modal = document.getElementById('map-modal');
                const modalImg = document.getElementById('modal-img');
                if (modal && modalImg) {
                    modal.style.display = "block";
                    modalImg.src = this.src;
                }
            };

            rightContainer.appendChild(img);

            li.appendChild(leftContainer);
            li.appendChild(rightContainer);
            ulElement.appendChild(li);
        }

    } catch (error) {
        console.error(error);
        if (loadingText) {
            loadingText.textContent = "Error loading reports. Make sure the 'reports' folder exists in the GitHub repository.";
            loadingText.style.color = '#e74c3c';
        }
    }
}

// --- 7. APPLICATION STARTUP & STYLING ---

function configurarBotonAddMap() {
    const btnAddMap = document.getElementById('btn-add-map');
    if (!btnAddMap) return;

    const tieneRaton = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const anchoEscritorio = window.innerWidth >= 1024;

    if (tieneRaton && anchoEscritorio) {
        btnAddMap.style.display = 'inline-block';
    }
}

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

// --- 8. MAPS FORM ---

function validarFormularioMapa() {
    const titulo      = document.getElementById('campo1-titulo').value.trim();
    const jugadores   = document.getElementById('campo2-jugadores').value;
    const descripcion = document.getElementById('campo3-descripcion').value.trim();
    const tamano      = document.getElementById('campo4-tamano').value.trim();
    const composicion = document.getElementById('campo5-composicion').value.trim();

    if (!titulo) {
        alert("Please enter a Map Title.");
        return null;
    }
    if (!jugadores) {
        alert("Please select the Max Players.");
        return null;
    }

    return { titulo, jugadores, descripcion, tamano, composicion };
}

function construirDescripcionMapa(descripcion, tamano, composicion) {
    const partes = [];
    if (tamano)      partes.push(`Map size: ${tamano}`);
    if (composicion) partes.push(composicion);

    if (descripcion) {
        let result = descripcion;
        if (partes.length > 0) {
            result += '<br/>' + partes.join('<br/>');
        }
        return result;
    }
    return partes.join(' | ');
}

function construirEntradaJS(datos) {
    const descripcionCompleta = construirDescripcionMapa(datos.descripcion, datos.tamano, datos.composicion);
    return `{ nombre: ${JSON.stringify(datos.titulo)}, descripcion: ${JSON.stringify(descripcionCompleta)} }`;
}

function previsualizarMapa() {
    const datos = validarFormularioMapa();
    if (!datos) return;

    const entrada = construirEntradaJS(datos);
    const contenedor = document.getElementById('preview-container');
    const codeEl = document.getElementById('preview-code');

    codeEl.textContent =
        `"${datos.jugadores}": [\n` +
        `    ...existing maps...,\n` +
        `    ${entrada}\n` +
        `]`;
    contenedor.style.display = 'block';
    contenedor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function serializarMapsConfig(config) {
    let output = '// --- MAP DATA CONFIGURATION ---\nconst MAPAS_CONFIG = {\n';
    const keys = Object.keys(config);

    keys.forEach((key, kIdx) => {
        output += `    "${key}": [\n`;
        config[key].forEach((mapa, mIdx) => {
            const parts = [];
            parts.push(`nombre: ${JSON.stringify(mapa.nombre)}`);
            if (mapa.iconoNombre) {
                parts.push(`iconoNombre: ${JSON.stringify(mapa.iconoNombre)}`);
            }
            if (mapa.descripcion) {
                parts.push(`descripcion: ${JSON.stringify(mapa.descripcion)}`);
            }
            const comma = mIdx < config[key].length - 1 ? ',' : '';
            output += `        { ${parts.join(', ')} }${comma}\n`;
        });
        const comma = kIdx < keys.length - 1 ? ',' : '';
        output += `    ]${comma}\n`;
    });

    output += '};\n';
    return output;
}

function encontrarIndiceAlfabetico(array, nombreNuevo) {
    const objetivo = nombreNuevo.toLowerCase();
    for (let i = 0; i < array.length; i++) {
        if (array[i].nombre.toLowerCase() > objetivo) {
            return i;
        }
    }
    return array.length;
}

// ELIMINABLE
function descargarMapsJs() {
    const datos = validarFormularioMapa();
    if (!datos) return;

    if (typeof MAPAS_CONFIG === 'undefined') {
        alert("Error: Could not load the existing maps.js configuration.");
        return;
    }

    const nuevaConfig = JSON.parse(JSON.stringify(MAPAS_CONFIG));

    if (!nuevaConfig[datos.jugadores]) {
        nuevaConfig[datos.jugadores] = [];
    }

    const descripcionCompleta = construirDescripcionMapa(datos.descripcion, datos.tamano, datos.composicion);

    const yaExiste = nuevaConfig[datos.jugadores].some(m => m.nombre === datos.titulo);
    if (yaExiste) {
        if (!confirm(`A map named "${datos.titulo}" already exists for ${datos.jugadores} players. Add anyway?`)) {
            return;
        }
    }

    const nuevoMapa = {
        nombre: datos.titulo,
        descripcion: descripcionCompleta
    };

    const arr = nuevaConfig[datos.jugadores];
    const idx = encontrarIndiceAlfabetico(arr, datos.titulo);
    arr.splice(idx, 0, nuevoMapa);

    const contenido = serializarMapsConfig(nuevaConfig);
    const blob = new Blob([contenido], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maps.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function configurarContadorDescripcionMapa() {
    const textarea = document.getElementById('campo3-descripcion');
    if (!textarea) return;

    const LIMITE = 60;

    function actualizarColor() {
        if (textarea.value.length > LIMITE) {
            textarea.style.color = '#e74c3c';
            textarea.style.borderColor = '#e74c3c';   
        } else {
            textarea.style.color = '';          
        }
    }

    textarea.addEventListener('input', actualizarColor);
    actualizarColor(); 
}

async function actualizarMapsGithub() {
    const datos = validarFormularioMapa();
    if (!datos) return;

    if (typeof MAPAS_CONFIG === 'undefined') {
        alert("Error: Could not load the existing maps.js configuration.");
        return;
    }

    const nuevaConfig = JSON.parse(JSON.stringify(MAPAS_CONFIG));

    if (!nuevaConfig[datos.jugadores]) {
        nuevaConfig[datos.jugadores] = [];
    }

    const descripcionCompleta = construirDescripcionMapa(datos.descripcion, datos.tamano, datos.composicion);

    const yaExiste = nuevaConfig[datos.jugadores].some(m => m.nombre === datos.titulo);
    if (yaExiste) {
        if (!confirm(`A map named "${datos.titulo}" already exists for ${datos.jugadores} players. Add anyway?`)) {
            return;
        }
    }

    const nuevoMapa = {
        nombre: datos.titulo,
        descripcion: descripcionCompleta
    };

    const arr = nuevaConfig[datos.jugadores];
    const idx = encontrarIndiceAlfabetico(arr, datos.titulo);
    arr.splice(idx, 0, nuevoMapa);

    const contenido = serializarMapsConfig(nuevaConfig);

    // --- GitHub upload ---
    let token = localStorage.getItem('gh_pat_token');
    if (!token) {
        token = prompt("Para subir maps.js a GitHub, introduce tu Personal Access Token (PAT):");
        if (!token) return;
        token = token.trim();
        localStorage.setItem('gh_pat_token', token);
    }

    const repoOwner = "zokosting";
    const repoName  = "skirmeo";
    const filePath  = "maps.js";
    const apiUrl    = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    const btnUpdate = document.getElementById('btn-download-maps');
    if (btnUpdate) btnUpdate.disabled = true;

    try {
        let sha = null;
        const checkRes = await fetch(apiUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (checkRes.ok) {
            const fileData = await checkRes.json();
            sha = fileData.sha;
        } else if (checkRes.status === 401 || checkRes.status === 403) {
            localStorage.removeItem('gh_pat_token');
            alert("El Token de GitHub no es válido o ha caducado. Se ha eliminado de la memoria local. Por favor, pulsa de nuevo e introduce un token válido.");
            if (btnUpdate) btnUpdate.disabled = false;
            return;
        }

        const base64Content = btoa(unescape(encodeURIComponent(contenido)));

        const requestBody = {
            message: `Update maps.js: add "${datos.titulo}" (${datos.jugadores} players)`,
            content: base64Content
        };
        if (sha) {
            requestBody.sha = sha;
        }

        const putRes = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (putRes.ok) {
            alert(`¡maps.js actualizado con éxito en GitHub!\nMapa añadido: "${datos.titulo}" (${datos.jugadores} players)`);
        } else {
            const errData = await putRes.json();
            alert(`Error al subir a GitHub: ${errData.message || 'Error desconocido'}`);
        }
    } catch (err) {
        console.error(err);
        alert("Ocurrió un error al intentar subir maps.js a GitHub.");
    } finally {
        if (btnUpdate) btnUpdate.disabled = false;
    }
}


function iniciarAplicacion() {
    // ---- index.html ----
    if (document.getElementById('num-jugadores')) {
        generarDesplegablesRazas();
        configurarBotonAddMap();
        generarCondicionesVictoria();
        updateTeamOptionStyle();
        aplicarEstiloBotónGenerar();
        ajustarContenedorResultado();
        if (resultadoDiv) resultadoDiv.innerHTML = '';

        const resultadosBusqueda = document.getElementById('resultados-busqueda-mapa');
        if (resultadosBusqueda) {
            resultadosBusqueda.addEventListener('click', function(e) {
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
    }

    // ---- reports.html ----
    if (document.getElementById('reports-ul')) {
        cargarReportesGitHub();
    }

    // ---- maps.html ----
    if (document.getElementById('formulario-mapa')) {
        configurarContadorDescripcionMapa();
    }
}

document.addEventListener('DOMContentLoaded', iniciarAplicacion);