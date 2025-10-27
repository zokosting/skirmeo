// --- 1. CONFIGURACIÓN DE DATOS GLOBALES ---
const RAZAS_DISPONIBLES = [
    "Orks", "Eldar", "Imperial Guard", "Chaos Space Marines", 
    "Space Marines", "Tau Empire", "Necrons", "Sisters Of Battle", "Dark Eldar"
];
// Define la raza que siempre estará en la partida, según tu requisito.
const RAZA_FIJA = "Imperial Guard"; 

// Elementos del DOM
const contenedorRazas = document.getElementById('contenedor-razas');
const instruccionRazas = document.getElementById('instruccion-razas');
const alertaSeleccion = document.getElementById('alerta-seleccion');
const numJugadoresSelect = document.getElementById('num-jugadores');
const resultadoDiv = document.getElementById('resultado');

// Variables de estado
let numRazasARotar = 0; // N - 1

// --- 2. FUNCIONES DE INICIALIZACIÓN Y LÓGICA DE INTERFAZ ---

/**
 * Inserta dinámicamente los checkboxes de las razas en el HTML.
 */
function inicializarRazas() {
    contenedorRazas.innerHTML = '';
    RAZAS_DISPONIBLES.forEach(raza => {
        const item = document.createElement('div');
        item.classList.add('raza-item');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = raza.toLowerCase().replace(/\s/g, '-');
        checkbox.name = 'raza';
        checkbox.value = raza;
        
        // Asignar la función que maneja la selección/deselección y la restricción
        checkbox.onchange = verificarLimite; 

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = raza;

        item.appendChild(checkbox);
        item.appendChild(label);
        contenedorRazas.appendChild(item);
    });
    
    // Llamar a la actualización inicial
    actualizarSeleccionRazas();
}

/**
 * Se activa cuando cambia el número de jugadores. 
 * Calcula el límite de razas y actualiza la UI.
 */
function actualizarSeleccionRazas() {
    const numJugadores = parseInt(numJugadoresSelect.value);
    numRazasARotar = numJugadores - 1; // La lógica N - 1

    // 1. Actualizar la instrucción para el usuario
    instruccionRazas.innerHTML = `Debes seleccionar **${numRazasARotar}** razas distintas de la lista. (Las razas se asignarán a los ${numRazasARotar} jugadores restantes).`;

    // 2. Ejecutar la función para verificar y aplicar restricciones
    verificarLimite();
}

/**
 * Restringe la selección de checkboxes si se alcanza el límite.
 */
function verificarLimite() {
    const checkboxes = document.querySelectorAll('#contenedor-razas input[type="checkbox"]');
    const razasSeleccionadas = Array.from(checkboxes).filter(cb => cb.checked);
    
    // Si se alcanzó el límite, deshabilitar el resto de checkboxes no seleccionados
    if (razasSeleccionadas.length >= numRazasARotar) {
        checkboxes.forEach(cb => {
            if (!cb.checked) {
                cb.disabled = true;
            }
        });
        alertaSeleccion.textContent = `¡Límite alcanzado! Seleccionaste ${numRazasARotar} razas.`;
    } else {
        // Si no se alcanzó el límite, asegurar que todos estén habilitados
        checkboxes.forEach(cb => {
            cb.disabled = false;
        });
        alertaSeleccion.textContent = ''; // Limpiar alerta
    }
}

// --- 3. FUNCIÓN DE GENERACIÓN DE PARTIDA ---

/**
 * Genera la lista final de la partida y la muestra en el HTML.
 */
function generarPartida() {
    const checkboxes = document.querySelectorAll('#contenedor-razas input[type="checkbox"]');
    const razasSeleccionadas = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // --- Validación Crítica ---
    if (razasSeleccionadas.length !== numRazasARotar) {
        resultadoDiv.innerHTML = `<p class="alerta">🚨 **Error:** Por favor, selecciona exactamente **${numRazasARotar}** razas antes de generar la partida.</p>`;
        return;
    }

    const numJugadores = parseInt(numJugadoresSelect.value);
    let razasParaAsignar = [...razasSeleccionadas]; // Copia de las razas seleccionadas
    const partidaGenerada = [];
    
    // Si la cantidad de jugadores restantes es mayor que la cantidad de razas seleccionadas, 
    // replicamos la lista de razas para asegurar que cada jugador tenga una (ej. 5 jugadores, 2 razas seleccionadas: A, B, A, B)
    while (razasParaAsignar.length < numRazasARotar) {
        razasParaAsignar = razasParaAsignar.concat(razasSeleccionadas);
    }
    // Asegurarse de que solo hay N-1 razas, tomando solo las necesarias
    razasParaAsignar = razasParaAsignar.slice(0, numRazasARotar);


    // 1. Asignar la Raza Fija al Jugador 1
    partidaGenerada.push(RAZA_FIJA); 
    
    // 2. Asignar las razas restantes de forma **aleatoria**
    // (Opcional: puedes usar .sort(() => Math.random() - 0.5) para barajar la lista)
    
    // Barajar las razas seleccionadas para una asignación aleatoria
    const razasBarajadas = razasParaAsignar.sort(() => Math.random() - 0.5);

    // Asignar las razas barajadas a los jugadores restantes
    razasBarajadas.forEach(raza => {
        partidaGenerada.push(raza);
    });

    // 3. Mostrar el Resultado en el HTML
    let resultadoHTML = `
        <h3>✅ Configuración: ${numJugadores} Jugadores (${RAZA_FIJA} + ${numRazasARotar} Razas Adicionales)</h3>
        <h4>Asignación de Facciones:</h4>
        <ol>
    `;

    partidaGenerada.forEach((raza, index) => {
        const jugadorNum = index + 1;
        const etiqueta = (index === 0) ? `**Raza Fija**` : `Raza Rotatoria`;
        resultadoHTML += `<li>**Jugador ${jugadorNum}:** ${raza} (${etiqueta})</li>`;
    });

    resultadoHTML += '</ol>';
    resultadoDiv.innerHTML = resultadoHTML;
}

// --- 4. INICIO DE LA APLICACIÓN ---

// Llama a la función de inicialización cuando el navegador carga el script
document.addEventListener('DOMContentLoaded', inicializarRazas);
