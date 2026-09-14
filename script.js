function generarPartida() {
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
    const numJugadores = parseInt(numJugadoresSelect.value);
    const mapasDisponibles = MAPAS_CONFIG[numJugadores] || [];
    const mapaConfig = mapasDisponibles.find(m => m.nombre === mapaSeleccionado);
    const iconName = mapaConfig ? (mapaConfig.iconoNombre || mapaConfig.nombre) : mapaSeleccionado;
    const imagePath = `https://raw.githubusercontent.com/zokosting/skirmeo/main/map_icons/${iconName}.png`;

    let resultadoHTML = `
        <h3>Selected Races:</h3>
        <ol>
    `;

    partidaGenerada.forEach((raza, index) => {
        const jugadorNum = index + 1;
        let chapterInfo = '';
        if (raza === 'Space Marines' && chaptersSeleccionados[`Race ${jugadorNum}`]) {
            chapterInfo = ` (Chapter: ${chaptersSeleccionados[`Race ${jugadorNum}`]})`;
        }
        resultadoHTML += `<li>**Player ${jugadorNum}:** ${raza}${chapterInfo}</li>`;
    });

    resultadoHTML += `
        </ol>

        <h3>Map:</h3>
        <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
            <p style="margin: 0;">**${mapaSeleccionado}**</p>
            <img src="${imagePath}" alt="${mapaSeleccionado}" style="max-width: 200px; height: auto; border: 1px dashed #ccc; border-radius: 4px;" onerror="this.style.display='none'">
        </div>

        <h3>Game Rules:</h3>
        <ul>
            ${condicionesSeleccionadas.map(c => {
                const [nombre, descripcion] = c.split(' – ').map(s => s.trim());
                return `<li>**${nombre}** – *${descripcion}*</li>`;
            }).join('')}
        </ul>
    `;

    resultadoDiv.innerHTML = resultadoHTML;
}