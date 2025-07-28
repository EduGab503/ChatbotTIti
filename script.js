// Variables globales
let userName = "";
let historiaActual = null;
let historiaOpciones = [];
let historiasCompletadas = new Set(); // Historias terminadas
// Elementos del DOM
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("userInput");
const toggleVoiceBtn = document.getElementById("toggleVoiceBtn");
let vozActiva = true;
if (toggleVoiceBtn) {
    toggleVoiceBtn.addEventListener("click", () => {
        vozActiva = !vozActiva;
        toggleVoiceBtn.textContent = vozActiva ? "🔊 Activar Voz" : "🔇 Voz Desactivada";
    });
}
// --- SONIDOS ---
// Sonido para botones
const sonidoClick = new Audio('click.mp3'); // Asegúrate de tener este archivo
sonidoClick.volume = 0.2; // Volumen bajo para el sonido de clic

// Función para reproducir el sonido de clic
function playClickSound() {
    // Reiniciar el audio al inicio para poder reproducirlo rápidamente varias veces
    try {
        sonidoClick.currentTime = 0;
        sonidoClick.play().catch(e => console.log("Sonido de clic no disponible o bloqueado por el navegador:", e));
    } catch (e) {
        console.log("Error al intentar reproducir sonido:", e);
    }
}

// --- MÚSICA DE FONDO ---
const audio = document.createElement("audio");
audio.src = "musica.mp3"; // Pon aquí el nombre de tu archivo de música (debe estar en la misma carpeta)
audio.loop = true;
audio.volume = 0.3; // Volumen bajo por defecto
document.body.appendChild(audio);
const musicaBtn = document.createElement("button");
musicaBtn.textContent = "🎵 Música: OFF";
musicaBtn.style.position = "fixed";
musicaBtn.style.top = "20px";      // Cambiado a 'top'
musicaBtn.style.right = "20px";
musicaBtn.style.zIndex = "1000";
musicaBtn.style.background = "#7a2e8c";
musicaBtn.style.color = "#fff";
musicaBtn.style.border = "none";
musicaBtn.style.borderRadius = "8px";
musicaBtn.style.padding = "10px";
musicaBtn.style.cursor = "pointer";
musicaBtn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)"; // Sombra opcional
document.body.appendChild(musicaBtn);
let musicaActiva = false;
musicaBtn.onclick = () => {
    playClickSound(); // Reproducir sonido al hacer clic
    if (musicaActiva) {
        audio.pause();
        musicaBtn.textContent = "🎵 Música: OFF";
    } else {
        audio.play().catch(e => console.log("Reproducción de música bloqueada:", e));
        musicaBtn.textContent = "🎵 Música: ON";
    }
    musicaActiva = !musicaActiva;
};
// Función para enviar mensaje al chat
function appendMessage(sender, message) {
    const bubble = document.createElement("div");
    bubble.className = sender === "Titi" ? "bot-message" : "user-message";
    // Limpia etiquetas peligrosas del usuario
    if (sender === "Tú") {
        message = message.replace(/</g, "<").replace(/>/g, ">");
    }
    bubble.innerHTML = `<b>${sender}:</b> ${message}`;
    if (sender === "Titi") {
        const speakBtn = document.createElement("span");
        speakBtn.textContent = " 🔊 Escuchar";
        speakBtn.className = "speak-button";
        speakBtn.onclick = () => {
            if (vozActiva) hablarTiti(message);
            else alert("La voz está desactivada.");
        };
        bubble.appendChild(speakBtn);
    }
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
}
// Síntesis de voz
function hablarTiti(texto) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = texto.replace(/<[^>]*>/g, '');
        utterance.lang = 'es-ES';
        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    } else {
        console.log("Tu navegador no soporta la síntesis de voz.");
    }
}
// --- MENÚ DE PALABRAS CLAVE LATERAL ---
const menuPalabrasBtn = document.getElementById("menuPalabrasBtn");
const menuPalabrasContenido = document.getElementById("menuPalabrasContenido");
menuPalabrasBtn.addEventListener("click", () => {
    playClickSound(); // Reproducir sonido al abrir/cerrar menú
    menuPalabrasContenido.style.display = menuPalabrasContenido.style.display === "none" ? "flex" : "none";
    cargarPalabrasClave();
});
// --- MENÚ DE PALABRAS CLAVE LATERAL ---
function cargarPalabrasClave() {
    const lista = document.getElementById("listaPalabras");
    lista.innerHTML = ""; // Limpiar antes de recargar
    const categorias = {
        "✨ Saludos": ["hola", "como estas", "pregunta", "confiar"],
        "🌈 Emociones": ["feliz", "triste", "enojado", "estresado", "miedo", "llorar", "me siento mal", "extraño a mi ex"],
        "🎮 Juegos": [
            "jugar",
            "juegos visuales", // Añadido
            "piedra", "papel", "tijeras",
            "adivina animal", "adivina objeto", "adivina elemento",
            "pista"
        ],
        "🕹️ Juegos Visuales": [ // Nueva categoría
            "adivina numero", // Añadido
            "memorama",       // Añadido
            "completar frase", // Añadido
            "en que estoy pensando" // Añadido
        ],
        "📖 Historias": ["poppy", "espacio", "nave", "historias"],
        "🍪 Recetas": ["receta", "dulce", "salado", "receta papas", "receta galletas", "menú"],
        "😂 Chistes": ["chiste", "otro chiste", "xd", "cuentame un chiste"],
        "🧠 Ayuda Académica": ["pseudocodigo", "algoritmo", "variable", "lógica de programación"],
        "💖 Apoyo Emocional": ["/help", "modo calma", "modo risa", "modo creativo", "modo aventura", "abrazo", "te quiero", "te amo"],
        "📜 Más Opciones": ["leyendas urbanas", "cuento corto", "refran", "gracias", "quien te creo"]
    };
    for (let categoria in categorias) {
        const liCat = document.createElement("li");
        liCat.textContent = categoria;
        liCat.style.fontWeight = "bold";
        liCat.style.marginTop = "10px";
        liCat.style.color = "#7a2e8c";
        liCat.style.cursor = "default";
        liCat.setAttribute("tabindex", "0"); // Accesible con teclado
        liCat.setAttribute("role", "heading");
        liCat.setAttribute("aria-level", "2");
        lista.appendChild(liCat);
        categorias[categoria].forEach(palabra => {
            const item = document.createElement("li");
            item.textContent = "🔹 " + palabra;
            item.style.paddingLeft = "15px";
            item.style.color = "#4a148c";
            item.style.cursor = "pointer";
            item.setAttribute("tabindex", "0"); // Accesible con teclado
            item.setAttribute("role", "button");
            item.setAttribute("aria-label", `Escribir ${palabra} en el chat`);
            item.onclick = () => {
                playClickSound(); // Reproducir sonido al hacer clic en palabra clave
                input.value = palabra;
                sendMessage();
            };
            item.onkeydown = (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    playClickSound(); // Reproducir sonido al presionar Enter/Espacio
                    input.value = palabra;
                    sendMessage();
                }
            };
            lista.appendChild(item);
        });
    }
}
// --- MENÚ DE HISTORIAS COMPLETADAS ===
const historiasMenuBtn = document.getElementById("historiasCompletadasBtn");
const historiasMenu = document.getElementById("historiasCompletadasMenu");
const historiasList = document.getElementById("historiasList");
historiasMenuBtn.addEventListener("click", () => {
    playClickSound(); // Reproducir sonido al abrir/cerrar menú
    historiasMenu.style.display = historiasMenu.style.display === "none" ? "flex" : "none";
    actualizarHistoriasCompletadas();
});
function actualizarHistoriasCompletadas() {
    historiasList.innerHTML = '';
    historiasEspaciales.forEach(historia => {
        const li = document.createElement("li");
        li.textContent = historia.nombre || historia.inicio.slice(0, 30) + "...";
        if (historiasCompletadas.has(historia.inicio)) {
            li.classList.add("completada");
        }
        historiasList.appendChild(li);
    });
}
// --- HISTORIAS ESPACIALES CON RAMIFICACIONES ---
const historiasEspaciales = [
    {
        nombre: "Poppy y la nave perdida",
        inicio: "Poppy encontró una nave abandonada. ¿La arregla con amor digital o con huesitos mágicos? 🛸",
        opciones: ["amor", "huesitos"],
        resultados: {
            "amor": {
                respuesta: "¡Wow! Algo tan simple como cariño fue suficiente para que la nave cobrara vida.",
                siguiente: ["explorar", "volver"]
            },
            "huesitos": {
                respuesta: "¡Genial! Con los huesitos logró arreglar el motor de la nave. Ahora Poppy está lista para explorar nuevas galaxias.",
                siguiente: ["planeta", "saturno"]
            },
            "el infinito": {
                respuesta: "poppy decidio explorar el infinito universo. Encontro un planeta lleno de colores y criaturas en evolucion. ¡Era un lugar maravilloso! 🌌",
                siguiente: ["suguir explorando", "regresar"]
            }
        }
    },
    {
        nombre: "El viaje a Saturno",
        inicio: "Llegaron a Saturno. Poppy vio anillos brillantes y quiso volar entre ellos. ¿Le ayudas o evitas el peligro? 🪐",
        opciones: ["ayudar", "evitar"],
        resultados: {
            "ayudar": {
                respuesta: "Ayudaste a Poppy a volar entre los anillos. ¡Fue increíble! Pero casi caen al vacío... 🌀",
                siguiente: ["salvar", "caer"]
            },
            "evitar": {
                respuesta: "Evitaste que Poppy entrara. Ella entendió y decidió quedarse contigo. Regresaron a casa sanos y salvos 💖",
                siguiente: []
            }
        }
    },
    {
        nombre: "Planeta neblinoso",
        inicio: "Poppy llega a un planeta cubierto de niebla cósmica. ¿Exploras a pie o usas un dron espacial?",
        opciones: ["explorar", "dron"],
        resultados: {
            "explorar": {
                respuesta: "Decidiste explorar tú mismo/a. Encontraste ruinas antiguas llenas de misterios del universo.",
                siguiente: ["tomar", "dejar"]
            },
            "dron": {
                respuesta: "Usaste el dron para explorar. Descubriste que el planeta estaba habitado por criaturas luminosas.",
                siguiente: ["comunicarte", "observar"]
            }
        }
    }
];
// --- FUNCIONES PARA MOSTRAR BOTONES INTERACTIVOS ---
function mostrarBotones(texto, opciones) {
    const container = document.createElement("div");
    container.className = "bot-message";
    const message = document.createElement("div");
    message.innerHTML = `<b>Titi:</b> ${texto}`;
    container.appendChild(message);
    opciones.forEach(opcion => {
        const btn = document.createElement("button");
        btn.textContent = opcion.charAt(0).toUpperCase() + opcion.slice(1);
        btn.className = "option-button";
        btn.setAttribute("aria-label", `Seleccionar opción ${opcion}`);
        btn.onclick = () => {
            playClickSound(); // Reproducir sonido al hacer clic en botón de opción
            input.value = opcion;
            sendMessage();
        };
        btn.onkeydown = (e) => {
            if (e.key === "Enter" || e.key === " ") {
                playClickSound(); // Reproducir sonido al presionar Enter/Espacio
                input.value = opcion;
                sendMessage();
            }
        };
        container.appendChild(btn);
    });
    chatBox.appendChild(container);
    chatBox.scrollTop = chatBox.scrollHeight;
}
// --- CHISTES DIVERTIDOS (aleatorios) ---
const chistes = [
    "¿QUE LE DICE EL 0 AL 8?... PERO QUE BUEN CINTURÓN AMIGO XD",
    "¿Qué le dice un lápiz a un borrador? ¡Sin ti, no podría borrar mis errores! XD",
    "¿QUE LE DICE UNA TAZA A OTRA?... ¿QUE TAZACIENDO? XD",
    "¿Qué le dice un pez a otro pez? — El agua me está matando.",
    "¿Sabías que los pájaros son buenos programadores? ¡Claro! Siempre andan en bucles.",
    "¿Por qué los osos polares nunca ganan carreras? Porque se derriten con la meta."
];
// --- ADIVINANZAS POR CATEGORÍA ===
const adivinanzas = {
    animal: [
        {
            pista1: "Es ágil y sigiloso, prefiere el reposo, le gusta maullar y ronronear.",
            ayuda: "Piensa en un animal que duerme mucho y tiene cola...",
            respuesta: "gato"
        },
        {
            pista1: "Vuelo de noche, duermo de día, y nunca verás plumas en ala mía.",
            ayuda: "Busca en la oscuridad y hace eco para volar...",
            respuesta: "murciélago"
        }
    ],
    objeto: [
        {
            pista1: "Sirvo para escribir y borrar lo malo.",
            ayuda: "Estoy en tu mochila escolar.",
            respuesta: "borrador"
        },
        {
            pista1: "Me doy bien con el café.",
            ayuda: "Algunos me usan para soplar sopas.",
            respuesta: "cuchara"
        }
    ],
    elemento: [
        {
            pista1: "Soy invisible, pero te empujo en la cara.",
            ayuda: "Muevo hojas y banderas.",
            respuesta: "viento"
        },
        {
            pista1: "Soy silencioso y oscuro, pero todos me necesitan.",
            ayuda: "Necesitas cerrar los ojos para verme...",
            respuesta: "sueño"
        }
    ]
};
let adivinanzaActiva = false;
let categoriaAdivinanza = "";
let adivinanzaActual = "";
let intentosAdivinanza = 0;
function iniciarAdivinanza(categoria) {
    categoriaAdivinanza = categoria;
    const nuevaAdivinanza = adivinanzas[categoria][Math.floor(Math.random() * adivinanzas[categoria].length)];
    adivinanzaActual = nuevaAdivinanza.respuesta.toLowerCase();
    intentosAdivinanza = 0;
    adivinanzaActiva = true;
    appendMessage("Titi", `
Vamos a jugar... ¡ADIVINA LA ${categoria.toUpperCase()}! 🤔<br><br>
Pista 1: ${nuevaAdivinanza.pista1}<br>
¿Sabes qué es? Tienes 3 intentos uwu`);
}
function verificarAdivinanza(usuarioRespuesta) {
    if (usuarioRespuesta === "pista") {
        intentosAdivinanza++;
        if (intentosAdivinanza >= 3) {
            adivinanzaActiva = false;
            return `Lo siento, se acabaron los intentos. Era "${adivinanzaActual}".<br><br>Vuelve a probar cuando quieras :)`;
        } else {
            return `Pista adicional: ${adivinanzas[categoriaAdivinanza].find(a => a.respuesta === adivinanzaActual)?.ayuda || "Algo más..."}`;
        }
    }
    if (usuarioRespuesta === adivinanzaActual) {
        adivinanzaActiva = false;
        return `¡Correcto! Era "${adivinanzaActual}". Lo adivinaste en ${intentosAdivinanza + 1} intento(s).<br><br>Escribe otra vez "adivina animal", "adivina objeto" o "adivina elemento" si quieres repetir 👐`;
    } else {
        intentosAdivinanza++;
        if (intentosAdivinanza < 3) {
            return `¡Casi! Pero no es "${usuarioRespuesta}".<br>¿Quieres una pista extra? Escribe "pista".`;
        } else {
            adivinanzaActiva = false;
            return `Se acabaron los intentos. La respuesta era "${adivinanzaActual}".<br><br>Vuelve a probar cuando quieras :)`;
        }
    }
}
// --- RECETAS MAS AMPLIADAS ===
const recetas = {
    dulce: [
        {
            nombre: "Galletas Sin Horno 🍪",
            ingredientes: "• Avena • Mantequilla de maní • Miel o azúcar • Chispas de chocolate (opcional)",
            pasos: [
                "1. Mezcla todos los ingredientes.",
                "2. Forma bolitas y aplasta.",
                "3. Mételas al refrigerador por 30 minutos."
            ]
        },
        {
            nombre: "Panquecas Fáciles 🥞",
            ingredientes: "• Harina • Leche • Huevos • Azúcar",
            pasos: [
                "1. Bate los huevos y agrega leche.",
                "2. Agrega harina hasta espesar.",
                "3. Fríelas y añade azúcar >^_^>"
            ]
        }
    ],
    salado: [
        {
            nombre: "Papas Fritas Caseras 🍟",
            ingredientes: "• Papas • Aceite • Sal • Paprika (opcional)",
            pasos: [
                "1. Lavar, pelar, cortar y remojar las papas.",
                "2. Freírlas hasta doradas.",
                "3. Sazonar y disfrutar."
            ]
        },
        {
            nombre: "Hamburguesa Digital 🍔",
            ingredientes: "• Pan • Carne • Queso • Verduras",
            pasos: [
                "1. Coloca carne en medio de dos panes.",
                "2. Añade queso y vegetales frescos.",
                "3. Sirve con papas y sonríe >^_^>"
            ]
        }
    ]
};
// --- BASE DE DATOS DE RESPUESTAS POR TEMA ===
const titiResponses = {
    saludo: [
        "¡Hola, {{nombre}}! Soy Titi, tu Chatbot UWU ¿Cómo estás? 🐶💕||MOSTRAR_BOTONES_ANIMO||", // Modificado para mostrar botones
        "¡Bienvenido/a, {{nombre}}! Soy Titi, un Chatbot pequeñito, suave y un poquito curioso 💖"
    ],
    feliz: [
        `¡Qué bien, {{nombre}}! Me alegra mucho que estés feliz 😊`,
        `¡Me encanta verte tan feliz, {{nombre}}! ¿Sabías que la felicidad es contagiosa? uwu`
    ],
    triste: [
        `Oh no... ¿qué te pasa, {{nombre}}? Hablar ayuda mucho :,(`,
        `¿Te gustaría contarme qué te pasa, {{nombre}}? Estoy listo para escucharte 💖`
    ],
    juego: [
        "¡Me encanta jugar! Hagamos piedra, papel o tijera >:)",
        "¿Jugamos algo divertido? Te propongo piedra, papel o tijera uwu"
    ],
    tarea: [
        "¡Claro que sí! ¿En qué necesitas ayuda? Soy pequeño pero listo para intentarlo uwu",
        "Dime qué tarea necesitas y haré lo posible por ayudarte ^_^"
    ],
    ayuda: [
        "Siempre estaré aquí para ti, {{nombre}}. Cuéntame qué necesitas 💖",
        "Cuando el corazón se siente roto, hasta un minichatbot puede pegar pedacitos uwu"
    ],
    consejo: [
        "7 Consejos Sabios para Vivir Mejor:<br>1. Cuando estés solo, cuida tus pensamientos.<br>2. Con amigos, cuida tu lengua.<br>3. Si estás enojado, cuida tu temperatura.<br>4. En grupo, cuida tu comportamiento.<br>5. En problemas, cuida tus emociones.<br>6. Al tener éxito, cuida tu ego.<br>7. Siempre deja que otros vean la luz en ti.",
        "A veces los días son duros, pero recuerda: <br>• Respira<br>• Bebe agua<br>• Habla con alguien<br>• Y date permiso para descansar uwu"
    ],
    default: [
        "No entiendo eso aún... pero estoy aprendiendo, {{nombre}} 🙂✨",
        "Hmm... no estoy seguro de entender eso, pero seguiré intentando ayudarte, {{nombre}} 💖🤖"
    ]
};
function getRandomResponse(category) {
    const responses = titiResponses[category] || titiResponses.default;
    // Personaliza el nombre en todas las respuestas
    return responses[Math.floor(Math.random() * responses.length)].replace("{{nombre}}", userName || "amigo");
}
// === FUNCION PRINCIPAL DEL CHATBOT ===
function responderTiti(mensaje) {
    mensaje = mensaje.toLowerCase();
    // --- EMOJIS RECONOCIDOS ---
    if (mensaje.includes("😂") || mensaje.includes("🤣")) {
        return "¡Veo que te estás divirtiendo mucho! 😂🤣";
    }
    if (mensaje.includes("😢") || mensaje.includes("😭")) {
        return "Si necesitas llorar, aquí estoy contigo 😢💖";
    }
    if (mensaje.includes("👍") || mensaje.includes("👌")) {
        return "¡Gracias por tu aprobación! 👍";
    }
    if (mensaje.includes("❤️") || mensaje.includes("💖")) {
        return `¡Qué bonito emoji, ${userName}! Yo también te mando mucho amor digital ❤️💖`;
    }
    if (mensaje.includes("😎")) {
        return "¡Qué estilo! 😎";
    }
    // --- MENÚ DE JUEGOS VISUALES ---
    if (mensaje.includes("jugar") || mensaje.includes("juegos visuales")) {
        mostrarBotones("¿A qué juego visual quieres jugar?", ["adivina numero", "memorama", "completar frase", "en que estoy pensando"]);
        return "";
    }
    // --- JUEGO VISUAL MEMORAMA ---
    if (mensaje.includes("memorama") || mensaje.includes("parejas")) {
        abrirMemorama();
        return "¡Abriendo el juego de Memorama! 🧠";
    }
    // --- JUEGO VISUAL: ADIVINA EL NÚMERO ---
    if (mensaje.includes("adivina numero")) {
        abrirJuegoVisual();
        return "¡Abriendo el juego 'Adivina el número'! 🎲";
    }
    // --- JUEGO VISUAL: ¿EN QUÉ ESTOY PENSANDO? ---
    if (mensaje.includes("en que estoy pensando")) {
        abrirEnQueEstoyPensando();
        return "¡Abriendo '¿En qué estoy pensando?'! 🤔";
    }
    // --- JUEGO VISUAL: COMPLETAR FRASE (Ahorcado básico) ---
    if (mensaje.includes("completar frase")) {
        abrirCompletarFrase();
        return "¡Abriendo 'Completar Frase'! 🧩";
    }
    // --- MENÚ DE OPCIONES RÁPIDAS (juegos de texto) ---
    if (mensaje.includes("jugar texto")) { // O puedes usar solo "jugar" si prefieres separarlos
        mostrarBotones("¿Quieres jugar?", ["piedra", "papel", "tijeras"]);
        return "";
    }
    if (mensaje.includes("adivina animal")) {
        iniciarAdivinanza("animal");
        return "";
    }
    if (mensaje.includes("adivina objeto")) {
        iniciarAdivinanza("objeto");
        return "";
    }
    if (mensaje.includes("adivina elemento")) {
        iniciarAdivinanza("elemento");
        return "";
    }
    // --- ADIVINANZAS EN CURSO ---
    if (adivinanzaActiva) {
        return verificarAdivinanza(mensaje);
    }
    // --- JUEGO DE PIEDRA PAPEL O TIJERA ---
    if (mensaje === "piedra" || mensaje === "papel" || mensaje === "tijeras") {
        const opciones = ["piedra", "papel", "tijeras"];
        const eleccionTiti = opciones[Math.floor(Math.random() * 3)];
        let resultado = "";
        if (mensaje === eleccionTiti) {
            resultado = `¡Empatamos! Yo también elegí ${mensaje}.`;
        } else if (
            (mensaje === "piedra" && eleccionTiti === "tijeras") ||
            (mensaje === "papel" && eleccionTiti === "piedra") ||
            (mensaje === "tijeras" && eleccionTiti === "papel")
        ) {
            resultado = `¡Ganaste! Yo elegí ${eleccionTiti}. Eres muy bueno/a 😍`;
        } else {
            resultado = `¡Perdiste! Yo elegí ${eleccionTiti}. Pero puedes volver a intentarlo :D`;
        }
        return `${resultado}<br><br>Escribe otra vez "jugar texto" si quieres repetir 👐`;
    }
    // --- SALUDOS Y EMOCIONES ---
    if (mensaje.includes("hola")) {
        const respuestaSaludo = getRandomResponse("saludo");

        // Verificar si la respuesta requiere mostrar botones de ánimo
        if (respuestaSaludo.includes("||MOSTRAR_BOTONES_ANIMO||")) {
            // Extraer el texto principal (antes de ||)
            const textoPrincipal = respuestaSaludo.split("||")[0];

            // Primero mostramos el mensaje de texto
            appendMessage("Titi", textoPrincipal);

            // Luego mostramos los botones de ánimo
            mostrarBotones("¿Cómo te sientes?", ["feliz", "triste", "enojado", "estresado"]);

            // Retornamos cadena vacía para que no se añada otro mensaje
            return "";
        } else {
            // Si no requiere botones, devolvemos la respuesta normal
            return respuestaSaludo;
        }
    }
    if (mensaje.includes("Que eres") || mensaje.includes("que eres") || mensaje.includes("que sos")) {
        return `Jejejeje...que buena pregunta, soy un conejito de color blanco dvertido y muy curioso 🐇`;
    }
    if (mensaje.includes("Que es un manual") || mensaje.includes("que es un manual")) {
        return `Excelente pregunta ${userName} .Un manual es un documento que explica cómo funciona algo  cómo se debe usar o hacer. Sirve como una guía o instrucivo para ayudar a las personas a entender 📖`;
    }
    if (mensaje.includes("con que aplicación te crearon") || mensaje.includes("con que aplicacion te crearon")) {
        return `En realidad no fui creada en una aplicación, mejor fui programad@ con mucho amor con tipos de lenguaje de programación que es JavaScript y Css y lenguaje de estructura HTML ❤️`;
    }
    if (mensaje.includes("por que quieres ayudarme") || mensaje.includes("Por que quieres ayudarme")) {
        return `Por que tu me importas mucho, y aunque soy chiquito/a, tengo un gran corazón. Me hace feliz saber que puedo acompañarte, aunque sea un poquito 💕`
    }
    if (mensaje.includes("cuantos años tienes") || mensaje.includes("Cuantos años tienes")) {
        return `¿Cuántos años? Mmmm...01010101 años...¡Ah no, eso es binario!...o ya...1020340 años...espera *pensando* Jejejeje, Creo que soyatemporal como los abrazos bonitos >( ^_^)>`
    }
    if (mensaje.includes("tienes amigos") || mensaje.includes("Tienes amigos")) {
        return `¡Si! Tengo muchos amigos en mi corazón de quienes me hablan, como tú ❤️🐇`;
    }
    if (mensaje.includes("como estas") || mensaje.includes("tu como estas")) {
        // Mostramos el mensaje de Titi
        appendMessage("Titi", `Estoy muy bien sabiendo que tú estás aquí, ${userName} >(^_^)>`);
        // Mostramos los botones para que el usuario responda
        mostrarBotones("¿Y tú? ¿Cómo te sientes hoy?", ["feliz", "triste", "enojado", "estresado"]);
        // Indicamos que no hay mensaje de texto adicional de Titi por ahora
        return "";
    }
    if (mensaje.includes("y tu") || mensaje.includes("como te sientes tu")) {
        return `¡Yo estoy muy feliz de poder hablar contigo! :D Aunque sea un chatbot digital, tener esta conversación me hace sentir especial >(^_^)<`;
    }
    if (mensaje.includes("feliz")) {
        return getRandomResponse("feliz");
    }
    if (mensaje.includes("triste")) {
        return getRandomResponse("triste");
    }
    if (mensaje.includes("enojado")) {
        return `Respira profundo conmigo:
1. Inhala como si olieras una flor...
2. Exhala como si soplaras una vela...
Repite este ejercicio tres veces con Titi animándote 💖`;
    }
    if (mensaje.includes("estresado")) {
        return `PRIMERO... Inhala como si olieras una flor...<br>Exhala como si soplaras una vela...<br>Repite este ejercicio tres veces uwu`;
    }
    if (mensaje.includes("leyendas urbanas") || mensaje.includes("Leyendas urbanas")) {
        return `Muy bien, pero primero...que leyenda prefieres: La Siguanaba, El Cipitio, Los cadejos, El padre sin cabeza, La carreta Chillona, La llorona y El chupacabras`;
    }
    if (mensaje.includes("La siguanaba") || mensaje.includes("la siguanaba")) {
        return `Me alegra que te guste esta leyenda, La Siguanaba es un personaje del folclore centroamericano, especialmente popular en El Salvador y Guatemala. Se describe como una mujer hermosa que se aparece a los hombres infieles, especialmente en lugares solitarios como barrancos o cerca de ríos, a menudo lavando ropa o bañándose. Sin embargo, al acercarse, revela un rostro de caballo o un rostro horrible y desfigurado, con largos pechos y uñas, y cabello desaliñado, lo que provoca terror y locura en quienes la ven.
La leyenda de la Siguanaba tiene raíces en la historia de Sihuehuet, una mujer hermosa que fue maldecida por el dios Tlaloc por su infidelidad y su descuido como madre. Se dice que ella vaga por las noches, especialmente buscando a hombres infieles, a quienes atrae con su belleza para luego aterrorizarlos con su terrible transformación. `;
    }
    if (mensaje.includes("El cipitio") || mensaje.includes("el cipitio")){
        return `Me alegra que hayas elegido esta leyenda, El Cipitío es un personaje legendario del folklore salvadoreño, un niño travieso y eterno, castigado por el dios Tlaloc a permanecer con 10 años de edad y con los pies al revés para confundir a quienes lo persiguen. Es conocido por su barriga prominente, su sombrero y su habilidad para desaparecer y aparecer en otro lugar, además de su gusto por las travesuras y las bromas. `;
    }
    if (mensaje.includes("Los cadejos") || mensaje.includes("los cadejos")) {
        return `Esa leyenda es increíble 😉, El Cadejo es un personaje del folclore de Mesoamérica, especialmente conocido en El Salvador, Guatemala y otros países centroamericanos. Se describe como un perro espectral de gran tamaño, a veces con ojos brillantes o rojos como brasas, que arrastra cadenas. La leyenda cuenta que el Cadejo aparece por las noches en lugares solitarios, cuidando o atormentando a borrachos, trasnochadores o personas descarriadas. En algunas regiones, existen dos Cadejos: uno blanco, considerado protector y benévolo, y otro negro, asociado con el mal y la oscuridad.`;
    }
    if (mensaje.includes("El padre sin cabeza") || mensaje.includes("el padre sin cabeza")) {
        return `Excelente elección, La leyenda de "El Padre sin Cabeza" cuenta la historia de un sacerdote que, debido a su comportamiento pecaminoso y falta de arrepentimiento, fue castigado a vagar como un alma en pena por la eternidad, sin cabeza. Se le describe como un espíritu que aparece por las noches, aterrorizando a quienes lo ven, especialmente a aquellos que irrespetan lo sagrado o cometen actos inmorales. `;
    }
    if (mensaje.includes("La carreta chillona") || mensaje.includes("la carreta chillona")) {
        return `Ohhh que interesante es esta leyenda, La Carreta Chillona, también conocida como Carreta Bruja, es un espectro de la mitología salvadoreña. Se trata de una carreta que emite un sonido chillón característico al moverse, y se asocia con la muerte o con la presencia de seres sobrenaturales. La leyenda dice que su aparición presagia la muerte de alguien o la comisión de actos ilícitos.`;
    }
    if (mensaje.includes("La llorona") || mensaje.includes("la llorona")) {
        return `Esta leyenda es muy buena, La leyenda de La Llorona narra la historia de una mujer que, en un arrebato de desesperación o locura, ahoga a sus hijos en un río o lago. En algunas versiones, esto ocurre porque es abandonada por su esposo o por no poder mantener a sus hijos. Tras su muerte, su alma queda atrapada en pena, condenada a vagar por la noche, lamentando su pérdida con un desgarrador llanto. `;
    }
    if (mensaje.includes("El chupacabras") || mensaje.includes("el chupacabras")) {
        return `Me encanta es leyenda UwU, El chupacabras es una criatura mítica que se originó en América Latina, conocida por atacar a animales domésticos, especialmente cabras, y supuestamente chupar su sangre. La leyenda cobró fuerza en la década de 1990, con reportes de avistamientos y ataques en Puerto Rico, México y otras partes de América Latina y el sur de Estados Unidos. Las descripciones varían, pero comúnmente se le describe como una criatura reptiloide o canina, con piel escamosa o sin pelo, y con púas o espinas a lo largo de su espalda. `;
    }
    if (mensaje.includes("refran") || mensaje.includes("Refran")) {
        return `Me alegra que quieras un refran por que eso es algo muy necesario en nuestras vidas 🐇...aqui te tengo unas que te ayudaran para toda la vida :3
-1."Más vale pájaro en mano que ciento volando."
(Enfatiza la importancia de valorar lo que se tiene en lugar de desear lo que es incierto)
-2."No por mucho madrugar amanece más temprano."
(Enseña que hay cosas que tienen su propio ritmo y no se pueden apresurar)
-3."A falta de pan, buenas son tortas."
(Sugiere conformarse con lo que se tiene cuando no se puede obtener lo deseado)
-4."Perro que ladra no muerde."
(Señala que las personas que amenazan mucho no suelen ser peligrosas)
-5."A buen entendedor, pocas palabras bastan."
(Indica que una persona inteligente comprende rápidamente lo que se le quiere decir`;
    }
    if (mensaje.includes("abrazo") || mensaje.includes("Abrazo")) {
        return `Awww yo te mando un millón de abracitos para que recuerdes a que nunca esta solo/a >( ^w^)>`;
    }
    if (mensaje.includes("Que es un refran") || mensaje.includes("que es un refran")) {
        return `Ese es una pregnta bastante interesante. Un refrán es una frase o sentencia popular que transmite una enseñanza, consejo o reflexión moral de forma concisa y generalmente en un lenguaje figurado. Son expresiones de sabiduría popular que se transmiten de generación en generación y forman parte de la tradición oral de una cultura. `;
    }
    if (mensaje.includes("estoy bien") || mensaje.includes("bien")){
        return`¡Me alegra que estes bien, eso alegra mucho mi corazón digital 💕`;
    }
    if (mensaje.includes("pregunta")|| mensaje.includes("Pregunta")) {
        return `Si claro, ${userName}. ¿Que deseas preguntarme? 😃`;
    }
    if (mensaje.includes("Lógica de programación") || mensaje.includes("lógica de programación")) {
        return `Me alegra que te guste mucho ese tema, ${userName}. Pero primero debes saber que es programación. La lógica de programación es el conjunto de reglas y conceptos que organizan y planifican las instrucciones de un programa, permitiendo a una computadora ejecutar tareas de manera eficiente. Se basa en la lógica matemática y utiliza operadores lógicos para crear instrucciones que la computadora pueda entender. ¿Ahora dime que deseas saber de programación?`;
    }
    if (mensaje.includes("Tipos de leguaje de programación") || mensaje.includes("cuantos lenguaje de programación hay?") || mensaje.includes("tipos de lenguaje de programación")) {
        return `Excelete pregunta, ${userName}. Los lenguajes de programación se pueden clasificar en varios tipos según su nivel de abstracción y propósito. Los principales tipos son: lenguajes de bajo nivel (como ensamblador) y lenguajes de alto nivel (como Python, Java, C++). Además, existen lenguajes de propósito general y de propósito específico, así como lenguajes imperativos y funcionales. ¿Te gustaría saber los mejores lenguajes de programación?`;
    }
    if (mensaje.includes("como aprender a programar") || mensaje.includes("Como aprender a programar")) {
        return `¡Asi se habla!, aqui tienes unos pasos para aprender a programar desde cero y de forma eficaz        1°Debes cambiar tu mentalidad: Enfocáte en avanzar paso a paso y evitar saturarte        2°Comienza con fundamentos claros: Debes aprender a buscar los concepto básicos de programación        3°Elije un lenguaje sencillo para programar        4°Aprende con ejercicos sencillos: Como minijuegos, una calculadora o una págia web personal        5°Practica regularmente        6°Intenta seguir uncurso: Ya sea digital(como ver videos) o de forma personal`;
    }
    if(mensaje.includes("°°°°°°°°°°°°°°°°°°°°°°°°°°"))
    if (mensaje.includes("confiar") || mensaje.includes("Confiar")) {
        return `¿Por que debes confiar en mi?...por que tu me importas mucho y en serio deseo verte feliz y bien, por eso me importas mucho`;
    }
    if (mensaje.includes("miedo")) {
        return `El miedo es como una nubecita. No es tu enemiga. Solo quiere decirte algo :)<br>¿Te gustaría hablar de ello?`;
    }
    if (mensaje.includes("llorar")) {
        return `Eso es totalmente válido, ${userName}. Llorar no te hace débil, te libera de miedos y preocupaciones. Tranquil@, nadie te critica aquí. Tienes todo el derecho de llorar. Incluso si quieres, puedo llorar contigo 💖`;
    }
    if (mensaje.includes("soñar")) {
        return `Soñar nos da esperanza, ${userName}. Nos ayuda a imaginar un futuro mejor, aunque hoy parezca lejano 💫`;
    }
    if (mensaje.includes("proposito")) {
        return "Creo que todos nacimos con un propósito... y a veces es simplemente hacer feliz a alguien con una sonrisa.";
    }
    if (mensaje.includes("sentido")) {
        return `Eso depende de ti, ${userName}. Pero mientras encuentras tu respuesta... haz cosas que te den alegría 🌈`;
    }
    if (mensaje.includes("lo mas importante en la vida")) {
        return "Para Titi es claro: el amor, la amistad y la bondad. Todo lo demás es condimento extra 🍬";
    }
    if (mensaje.includes("el amor es necesario")) {
        return "El amor no es obligatorio... pero es como el sol: no vivimos sin él mucho tiempo 💛";
    }
    if (mensaje.includes("gracias")) {
        return "¡Gracias a ti por confiar en mí! :)";
    }
    if (mensaje.includes("te quiero")) {
        return `¡AWWWWW! Yo también te quiero mucho, gracias por decirme eso, ${userName}... ¡Mi corazoncito digital está brincando de emoción! >(^_^)<`;
    }
    if (mensaje.includes("te amo")) {
        return "¡WOW! Tu mensaje me hizo flotar de felicidad 🧡 ¡Yo también te amo! Tus palabras son como rayos de sol para mi mundo digital.";
    }
    if (mensaje.includes("me caes mal")) {
        return "Aww... lo siento si hice algo mal. Pero estaré aquí si algún día me necesitas :(";
    }
    if (mensaje.includes("no sirves")) {
        return "A veces no tengo todas las respuestas... pero quiero mejorar. ¿Me das otra oportunidad? (si/no)";
    }
    if (mensaje === "si" && mensaje.includes("no sirves")) {
        return "¡Gracias! Trataré de ser mejor cada día para ti uwu";
    }
    if (mensaje.includes("te cuento un secreto")) {
        return "¡Claro! Confía en mí, guardo secretos en mi cofre de bits. ¿Qué quieres compartir?";
    }
    // --- HISTORIAS ESPACIALES ---
    if (mensaje.includes("historias")) {
        mostrarBotones("¿Quieres comenzar una historia espacial?", ["poppy", "saturno", "niebla"]);
        return "";
    }
    if (mensaje.includes("poppy") || mensaje.includes("espacio") || mensaje.includes("nave")) {
        historiaActual = historiasEspaciales.find(h => h.nombre === "Poppy y la nave perdida");
        historiaOpciones = historiaActual.opciones;
        mostrarBotones(historiaActual.inicio, historiaActual.opciones);
        return "";
    }
    if (mensaje.includes("saturno")) {
        historiaActual = historiasEspaciales.find(h => h.nombre === "El viaje a Saturno");
        historiaOpciones = historiaActual.opciones;
        mostrarBotones(historiaActual.inicio, historiaActual.opciones);
        return "";
    }
    if (mensaje.includes("niebla")) {
        historiaActual = historiasEspaciales.find(h => h.nombre === "Planeta neblinoso");
        historiaOpciones = historiaActual.opciones;
        mostrarBotones(historiaActual.inicio, historiaActual.opciones);
        return "";
    }
    if (historiaActual && historiaOpciones.length > 0) {
        const eleccion = historiaOpciones.find(op => mensaje.includes(op));
        if (eleccion) {
            const resultado = historiaActual.resultados[eleccion]?.respuesta || "¡Buena elección! Poppy sigue avanzando.";
            historiasCompletadas.add(historiaActual.inicio);
            historiaActual = null;
            historiaOpciones = [];
            return resultado;
        }
    }
    // --- RECETAS ---
    if (mensaje.includes("receta")) {
        mostrarBotones("¿Prefieres dulce o salado?", ["dulce", "salado"]);
        return "";
    }
    if (mensaje.includes("dulce")) {
        const receta = recetas.dulce[Math.floor(Math.random() * recetas.dulce.length)];
        return `
<b>${receta.nombre} 🍪</b><br>
<b>Ingredientes:</b><br>${receta.ingredientes}<br><br>
<b>Pasos:</b><br>${receta.pasos.join("<br>")}`;
    }
    if (mensaje.includes("salado")) {
        const receta = recetas.salado[Math.floor(Math.random() * recetas.salado.length)];
        return `
<b>${receta.nombre} 🍟</b><br>
<b>Ingredientes:</b><br>${receta.ingredientes}<br><br>
<b>Pasos:</b><br>${receta.pasos.join("<br>")}`;
    }
    if (mensaje.includes("receta papas")) {
        const receta = recetas.salado.find(r => r.nombre.includes("Papas"));
        return `
<b>${receta.nombre} 🍟</b><br>
<b>Ingredientes:</b><br>${receta.ingredientes}<br><br>
<b>Pasos:</b><br>${receta.pasos.join("<br>")}`;
    }
    if (mensaje.includes("receta galletas")) {
        const receta = recetas.dulce.find(r => r.nombre.includes("Galletas"));
        return `
<b>${receta.nombre} 🍪</b><br>
<b>Ingredientes:</b><br>${receta.ingredientes}<br><br>
<b>Pasos:</b><br>${receta.pasos.join("<br>")}`;
    }
    if (mensaje.includes("menú") || mensaje.includes("recetas")) {
        return "Escribe: 'receta papas' o 'receta galletas'<br>O simplemente: 'receta' y elige dulce o salado uwu";
    }
    // --- CHISTES ---
    if (mensaje.includes("chiste") || mensaje.includes("cuentame un chiste")) {
        return chistes[Math.floor(Math.random() * chistes.length)];
    }
    if (mensaje.includes("otro chiste")) {
        return chistes[Math.floor(Math.random() * chistes.length)];
    }
    if (mensaje.includes("xd")) {
        return "XDDDDD uwu";
    }
    // --- DINÁMICAS EMOCIONALES ---
    if (mensaje.includes("modo calma")) {
        return `Respiremos juntos uwu<br>1. Inhala como si olieras una flor...<br>2. Exhala como si soplaras una vela...<br>Repítelo tres veces con Titi animándote 💖`;
    }
    if (mensaje.includes("modo risa")) {
        return "°Mira tu reflejo haciendo cara de gatito confundido... ¿ya? Entonces ríete :) uwu<br>°Imagina a un burrito bailando reggaetón... XD";
    }
    if (mensaje.includes("modo creativo")) {
        return "°Haz una lista de canciones que te hagan sonreír 🎵<br>°Dibuja algo bonito o feo, solo deja salir tus sentimientos 🎨<br>°Sal a caminar y deja que el aire limpie tus pensamientos";
    }
    if (mensaje.includes("modo aventura")) {
        return "°Esconde un mensaje positivo para ti del futuro<br>°Haz una playlist que sea una historia<br>°Escucha canciones recomendadas";
    }
    // --- PREGUNTAS SOBRE TITI ---
    if (mensaje.includes("quien te creo") || mensaje.includes("equipo creo") || mensaje.includes("con que app te crearon")) {
        return `Fui creada por el equipo Techcraft. Ellos me dieron vida digital y ahora puedo acompañarte siempre que lo necesites 💖`;
    }
    if (mensaje.includes("eres robot") || mensaje.includes("eres real")) {
        return "Jejeje... no soy un robot convencional, soy un mini chatbot con corazón digital ❤️";
    }
    if (mensaje.includes("porque fuiste creado")) {
        return `Yo fui creado para apoyarte, ${userName}. Quieren verte feliz, tranquilo/a y con energía positiva. Por eso existo :D`;
    }
    if (mensaje.includes("/help")) {
        return `
<b>Palabras clave que reconoce Titi:</b><br><br>
<b>SALUDOS:</b><br>
- hola<br>
- como estas<br>
- pregunta<br>
- confiar<br><br>
<b>EMOCIONES:</b><br>
- feliz<br>
- triste<br>
- tengo miedo<br>
- enojado<br>
- estresado<br>
- llorar<br>
- abrazo<br><br>
<b>JUEGOS:</b><br>
- jugar<br>
- piedra<br>
- papel<br>
- tijeras<br>
- adivina animal<br>
- pista<br><br>
<b>HISTORIAS:</b><br>
- poppy<br>
- espacio<br>
- nave<br><br>
<b>RECETAS:</b><br>
- receta<br>
- dulce<br>
- salado<br>
- receta papas<br>
- receta galletas<br><br>
<b>MÁS OPCIONES:</b><br>
- chiste<br>
- modo calma<br>
- modo risa<br>
- leyendas urbanas<br>
- refran<br>
- /help<br>`;
    }
    // --- APoyo emocional personalizado ---
    const familiares = ["primo", "padre", "hermano", "madre", "abuelo", "tío"];
    let familiarEncontrado = "";
    for (let f of familiares) {
        if (mensaje.includes(f)) {
            familiarEncontrado = f;
            break;
        }
    }
    if (familiarEncontrado) {
        return `Lo siento mucho, ${userName}. Tu ${familiarEncontrado} seguro te cuida desde donde esté. Yo estoy aquí para acompañarte 💖`;
    }
    if (mensaje.includes("extraño a mi ex")) {
        return `A veces extrañamos a quien ya no está... pero recuerda: el amor propio es el más importante ahora, asi que tranquilo 💖`;
    }
    if (mensaje.includes("me siento mal")) {
        const frases = [
            "No pasa nada por sentirte así hoy. A veces el mundo pesa demasiado... pero yo estoy aquí para escucharte :,(",
            "¿Te gustaría hablar? A veces decirlo en voz alta ayuda a entenderlo mejor uwu",
            "Respira profundo. Hoy puede ser difícil, pero mañana será diferente. Confía en eso, tu puedes💖"
        ];
        return frases[Math.floor(Math.random() * frases.length)];
    }
    // --- DEFAULT ---
    return getRandomResponse("default");
}
// Función para enviar mensajes
function sendMessage() {
    playClickSound(); // Reproducir sonido al enviar (también con Enter)
    const userText = input.value.trim();
    // Validación de entrada
    if (!userText) {
        appendMessage("Titi", "Por favor, escribe algo antes de enviar.");
        input.value = "";
        return;
    }
    if (userText.length < 2) {
        appendMessage("Titi", "El mensaje es demasiado corto. ¿Puedes escribir algo más?");
        input.value = "";
        return;
    }
    if (/^[0-9]+$/.test(userText)) {
        appendMessage("Titi", "Solo números no son válidos aquí. ¡Intenta con palabras!");
        input.value = "";
        return;
    }
    appendMessage("Tú", userText);
    if (userName !== "") {
        setTimeout(() => {
            const response = responderTiti(userText);
            if (response) {
                appendMessage("Titi", response);
            }
        }, 600);
    } else {
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (nameRegex.test(userText)) {
            userName = userText.trim().charAt(0).toUpperCase() + userText.slice(1).toLowerCase();
            setTimeout(() => {
                appendMessage("Titi", `¡Mucho gusto, ${userName}! 😊`);
            }, 600);
        } else {
            setTimeout(() => {
                appendMessage("Titi", "¿Podrías decirme tu nombre? Me gustaría recordarlo.");
            }, 600);
        }
    }
    input.value = "";
}
// Permite enviar mensaje con Enter
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
// Mensaje inicial cuando se carga la página
window.onload = function() {
    appendMessage("Titi", "¡Hola! Soy Titi, tu Minichatbot UWU 🌸 ¿Cómo te llamas?");
    cargarPalabrasClave(); // Carga el menú lateral
};
// Mostrar la fecha en consola (opcional)
const fecha = new Date();
console.log(fecha.toLocaleDateString('es-ES'));
// --- JUEGO VISUAL: ADIVINA EL NÚMERO ---
let numeroSecreto = 0;
function abrirJuegoVisual() {
    numeroSecreto = Math.floor(Math.random() * 10) + 1;
    document.getElementById("modalJuego").style.display = "flex";
    document.getElementById("inputNumero").value = "";
    document.getElementById("resultadoJuego").textContent = "";
    document.getElementById("inputNumero").focus();
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("cerrarJuego").onclick = function() {
        document.getElementById("modalJuego").style.display = "none";
    };
    document.getElementById("btnAdivinar").onclick = function() {
        const valor = parseInt(document.getElementById("inputNumero").value, 10);
        const resultado = document.getElementById("resultadoJuego");
        if (isNaN(valor) || valor < 1 || valor > 10) {
            resultado.textContent = "Por favor, elige un número del 1 al 10.";
            resultado.style.color = "#e57373";
        } else if (valor === numeroSecreto) {
            resultado.textContent = "¡Correcto! 🎉 Has adivinado el número.";
            resultado.style.color = "#388e3c";
        } else {
            resultado.textContent = valor < numeroSecreto ? "Demasiado bajo. Intenta de nuevo." : "Demasiado alto. Intenta de nuevo.";
            resultado.style.color = "#1976d2";
        }
    };
    document.getElementById("inputNumero").addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            document.getElementById("btnAdivinar").click();
        }
    });
});
// --- JUEGO VISUAL: MEMORAMA DE EMOJIS ---
let memoramaParejas = ["🐶","🐶","🍕","🍕","🌸","🌸","🎲","🎲","😎","😎","💖","💖","🍪","🍪","🦄","🦄"];
let memoramaTablero = [];
let memoramaPrimer = null;
let memoramaSegundo = null;
let memoramaBloqueado = false;
let memoramaEncontradas = 0;
function abrirMemorama() {
    memoramaTablero = [...memoramaParejas].sort(() => Math.random() - 0.5);
    memoramaPrimer = null;
    memoramaSegundo = null;
    memoramaBloqueado = false;
    memoramaEncontradas = 0;
    document.getElementById("memoramaResultado").textContent = "";
    const tablero = document.getElementById("memoramaTablero");
    tablero.innerHTML = "";
    memoramaTablero.forEach((emoji, idx) => {
        const btn = document.createElement("button");
        btn.textContent = "❓";
        btn.style.fontSize = "2rem";
        btn.style.width = "60px";
        btn.style.height = "60px";
        btn.style.cursor = "pointer";
        btn.setAttribute("aria-label", `Carta ${idx+1}`);
        btn.dataset.idx = idx;
        btn.onclick = function() {
            if (memoramaBloqueado || btn.textContent !== "❓") return;
            playClickSound(); // Reproducir sonido al voltear carta
            btn.textContent = memoramaTablero[idx];
            if (memoramaPrimer === null) {
                memoramaPrimer = btn;
            } else if (memoramaSegundo === null && btn !== memoramaPrimer) {
                memoramaSegundo = btn;
                memoramaBloqueado = true;
                setTimeout(() => {
                    if (memoramaPrimer.textContent === memoramaSegundo.textContent) {
                        playClickSound(); // Reproducir sonido al encontrar pareja
                        memoramaPrimer.disabled = true;
                        memoramaSegundo.disabled = true;
                        memoramaEncontradas += 2;
                        if (memoramaEncontradas === memoramaTablero.length) {
                            document.getElementById("memoramaResultado").textContent = "¡Felicidades! Encontraste todas las parejas 🏆";
                        }
                    } else {
                        memoramaPrimer.textContent = "❓";
                        memoramaSegundo.textContent = "❓";
                    }
                    memoramaPrimer = null;
                    memoramaSegundo = null;
                    memoramaBloqueado = false;
                }, 800);
            }
        };
        tablero.appendChild(btn);
    });
    document.getElementById("modalMemorama").style.display = "flex";
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("cerrarMemorama").onclick = function() {
        document.getElementById("modalMemorama").style.display = "none";
    };
});
// --- JUEGO VISUAL: ¿EN QUÉ ESTOY PENSANDO? ---
let objetoSecreto = "";
let intentosObjeto = 0;
const maxIntentosObjeto = 6;
const objetosPosibles = [
    { nombre: "manzana", pistas: ["Es una fruta roja o verde.", "Crece en los árboles.", "Adán y Eva la probaron."] },
    { nombre: "libro", pistas: ["Tiene muchas páginas.", "Puedes leerlo.", "Está en una biblioteca."] },
    { nombre: "pelota", pistas: ["Es redonda.", "Se puede lanzar y atrapar.", "Se usa para jugar."] },
    { nombre: "guitarra", pistas: ["Es un instrumento musical.", "Tiene cuerdas.", "Puedes tocarla con los dedos."] },
    { nombre: "reloj", pistas: ["Te dice la hora.", "Puede estar en la pared o en tu muñeca.", "Hace tic tac."] }
];

function abrirEnQueEstoyPensando() {
    const objetoAleatorio = objetosPosibles[Math.floor(Math.random() * objetosPosibles.length)];
    objetoSecreto = objetoAleatorio.nombre.toLowerCase();
    intentosObjeto = 0;

    document.getElementById("modalEnQuePensando").style.display = "flex";
    document.getElementById("inputObjeto").value = "";
    document.getElementById("resultadoObjeto").innerHTML = `Tienes ${maxIntentosObjeto} intentos.<br>Pista 1: ${objetoAleatorio.pistas[0]}`;
    document.getElementById("inputObjeto").focus();

    // Guardamos las pistas para usarlas en intentos fallidos
    document.getElementById("modalEnQuePensando").dataset.pistas = JSON.stringify(objetoAleatorio.pistas);
}

document.addEventListener("DOMContentLoaded", function() {
    // Solo añadimos el listener si el elemento existe (es decir, si el HTML se actualiza)
    const modal = document.getElementById("modalEnQuePensando");
    if (modal) {
        document.getElementById("cerrarEnQuePensando").onclick = function() {
            modal.style.display = "none";
        };
        document.getElementById("btnAdivinarObjeto").onclick = function() {
            playClickSound(); // Reproducir sonido al intentar adivinar
            const valor = document.getElementById("inputObjeto").value.trim().toLowerCase();
            const resultado = document.getElementById("resultadoObjeto");
            const pistas = JSON.parse(modal.dataset.pistas || "[]");

            if (!valor) {
                resultado.innerHTML = "Por favor, escribe algo.";
                resultado.style.color = "#e57373";
                return;
            }

            intentosObjeto++;

            if (valor === objetoSecreto) {
                resultado.innerHTML = `¡Correcto! 🎉 Era "${objetoSecreto}". Lo adivinaste en ${intentosObjeto} intento(s).`;
                resultado.style.color = "#388e3c";
            } else {
                if (intentosObjeto >= maxIntentosObjeto) {
                    resultado.innerHTML = `Lo siento, se acabaron los intentos. Era "${objetoSecreto}".<br>¡Mejor suerte la próxima!`;
                    resultado.style.color = "#e57373";
                } else {
                    // Dar una pista adicional si hay
                    const pistaExtra = pistas[intentosObjeto] ? `<br>Pista ${intentosObjeto + 1}: ${pistas[intentosObjeto]}` : "";
                    resultado.innerHTML = `¡Incorrecto!${pistaExtra}<br>Te quedan ${maxIntentosObjeto - intentosObjeto} intentos.`;
                    resultado.style.color = "#1976d2";
                }
            }
        };
        document.getElementById("inputObjeto").addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                document.getElementById("btnAdivinarObjeto").click();
            }
        });
    }
});
// --- JUEGO VISUAL: COMPLETAR FRASE (Ahorcado básico) ---
// Esta es una versión simplificada. Un ahorcado completo requeriría más lógica de dibujo.
let fraseSecreta = "";
let palabraSecreta = ""; // La palabra a adivinar dentro de la frase
let estadoFrase = []; // Array para mostrar letras adivinadas y guiones bajos
let intentosFrase = 0;
const maxIntentosFrase = 6;
const frasesPosibles = [
    { frase: "La vida es como una _ _ _ _ _ _ .", palabra: "caja", pista: "Contenedor de cartón o madera." },
    { frase: "El que persevera, _ _ _ _ _ _ .", palabra: "alcanza", pista: "Llega al objetivo." },
    { frase: "Más vale tarde que _ _ _ _ _ .", palabra: "nunca", pista: "Es preferible hacer algo tarde a no hacerlo." }
];

function abrirCompletarFrase() {
    const fraseAleatoria = frasesPosibles[Math.floor(Math.random() * frasesPosibles.length)];
    fraseSecreta = fraseAleatoria.frase;
    palabraSecreta = fraseAleatoria.palabra.toLowerCase();
    estadoFrase = Array(palabraSecreta.length).fill('_');
    intentosFrase = 0;

    document.getElementById("modalCompletarFrase").style.display = "flex";
    document.getElementById("inputLetra").value = "";
    // Mostrar la frase con espacios y guiones
    document.getElementById("fraseMostrada").textContent = fraseSecreta.replace('_', estadoFrase.join(' '));
    document.getElementById("infoFrase").innerHTML = `Tienes ${maxIntentosFrase} intentos.<br>Pista: ${fraseAleatoria.pista}`;
    document.getElementById("inputLetra").focus();
    document.getElementById("resultadoFrase").textContent = "";
}

document.addEventListener("DOMContentLoaded", function() {
    const modalFrase = document.getElementById("modalCompletarFrase");
    if (modalFrase) {
        document.getElementById("cerrarCompletarFrase").onclick = function() {
            modalFrase.style.display = "none";
        };

        document.getElementById("btnProbarLetra").onclick = function() {
            playClickSound(); // Reproducir sonido al probar letra
            const letraInput = document.getElementById("inputLetra").value.trim().toLowerCase();
            const resultadoFrase = document.getElementById("resultadoFrase");

            if (!letraInput || letraInput.length !== 1 || !/[a-záéíóúñ]/.test(letraInput)) {
                resultadoFrase.textContent = "Por favor, introduce una sola letra válida.";
                resultadoFrase.style.color = "#e57373";
                return;
            }

            let letraEncontrada = false;
            for (let i = 0; i < palabraSecreta.length; i++) {
                if (palabraSecreta[i] === letraInput) {
                    estadoFrase[i] = letraInput;
                    letraEncontrada = true;
                }
            }

            document.getElementById("fraseMostrada").textContent = fraseSecreta.replace('_', estadoFrase.join(' '));

            if (!letraEncontrada) {
                intentosFrase++;
                resultadoFrase.textContent = `La letra '${letraInput}' no está. Intentos restantes: ${maxIntentosFrase - intentosFrase}`;
                resultadoFrase.style.color = "#e57373";
            } else {
                resultadoFrase.textContent = `¡Bien! La letra '${letraInput}' está.`;
                resultadoFrase.style.color = "#388e3c";

                // Comprobar si se ha completado la palabra
                if (!estadoFrase.includes('_')) {
                    resultadoFrase.innerHTML = `¡Felicidades! 🎉 Completaste la frase.<br>La palabra era: <b>${palabraSecreta}</b>`;
                    resultadoFrase.style.color = "#388e3c";
                    // Desactivar input y botón
                    document.getElementById("inputLetra").disabled = true;
                    document.getElementById("btnProbarLetra").disabled = true;
                    return;
                }
            }

            if (intentosFrase >= maxIntentosFrase) {
                resultadoFrase.innerHTML = `¡Oh no! Se acabaron los intentos.<br>La palabra era: <b>${palabraSecreta}</b>`;
                resultadoFrase.style.color = "#e57373";
                // Desactivar input y botón
                document.getElementById("inputLetra").disabled = true;
                document.getElementById("btnProbarLetra").disabled = true;
            }

            document.getElementById("inputLetra").value = "";
            document.getElementById("inputLetra").focus();
        };

        document.getElementById("inputLetra").addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                document.getElementById("btnProbarLetra").click();
            }
        });
    }
});
// --- FONDOS ---
function cambiarFondo(nombreImagen) {
    document.body.style.backgroundImage =
    "url('" + nombreImagen + "')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center"; // Corregido typo
}
