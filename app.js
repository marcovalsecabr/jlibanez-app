const CSV_ESTADOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvW6xkyA7SL8Ngdmk9YsqWnlNcOYCQSAwSWnvE4J8YVPlFBOeLYma9ROnwcyfkxA/pub?gid=1324009565&single=true&output=csv";
const CSV_MUNICIPIOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvW6xkyA7SL8Ngdmk9YsqWnlNcOYCQSAwSWnvE4J8YVPlFBOeLYma9ROnwcyfkxA/pub?gid=1864875236&single=true&output=csv";
const CSV_DESARROLLOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvW6xkyA7SL8Ngdmk9YsqWnlNcOYCQSAwSWnvE4J8YVPlFBOeLYma9ROnwcyfkxA/pub?gid=809287502&single=true&output=csv";
const CSV_LISTADO = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvW6xkyA7SL8Ngdmk9YsqWnlNcOYCQSAwSWnvE4J8YVPlFBOeLYma9ROnwcyfkxA/pub?gid=1523106145&single=true&output=csv";

let estados = [], municipios = [], desarrollos = [], listado = [];

function cargarCSV(url, callback) {
  Papa.parse(url, {
    download: true,
    header: true,
    complete: (results) => callback(results.data)
  });
}

function iniciar() {
  cargarCSV(CSV_ESTADOS, data => {
    estados = data;
    llenarEstados();
  });
  cargarCSV(CSV_MUNICIPIOS, data => municipios = data);
  cargarCSV(CSV_DESARROLLOS, data => desarrollos = data);
  cargarCSV(CSV_LISTADO, data => listado = data);
}

function llenarEstados() {
  const select = document.getElementById("estado");
  select.innerHTML = '<option value="">Selecciona Estado</option>';
  estados.forEach(e => {
    select.innerHTML += `<option value="${e.Id_estado}">${e.NomEstado}</option>`;
  });
}

document.addEventListener("change", (e) => {
  if (e.target.id === "estado") {
    const idEstado = e.target.value;
    const filtrados = municipios.filter(m => m.Id_estado === idEstado);
    const select = document.getElementById("municipio");
    select.innerHTML = '<option value="">Selecciona Municipio</option>';
    filtrados.forEach(m => {
      select.innerHTML += `<option value="${m.Id_municipio}">${m.NomMunicipio}</option>`;
    });
  }

  if (e.target.id === "municipio") {
    const idMun = e.target.value;
    const filtrados = desarrollos.filter(d => d.Id_municipio === idMun);
    const select = document.getElementById("desarrollo");
    select.innerHTML = '<option value="">Selecciona Desarrollo</option>';
    filtrados.forEach(d => {
      select.innerHTML += `<option value="${d.Id_desarrollo}">${d.NomDesarrollo}</option>`;
    });
  }

  if (e.target.id === "desarrollo" || e.target.id === "precioMax") {
    mostrarResultados();
  }
});

function mostrarResultados() {
  const idDes = document.getElementById("desarrollo").value;
  const precioMax = document.getElementById("precioMax").value;
  const contenedor = document.getElementById("resultados");

  let filtrados = listado.filter(p => p.Id_desarrollo === idDes);

  if (precioMax) {
    filtrados = filtrados.filter(p => parseFloat(p.P_BANCARIO) <= parseFloat(precioMax));
  }

  contenedor.innerHTML = "";
  filtrados.forEach(p => {
    contenedor.innerHTML += `
      <div class="card">
        <h3>${p.MODELO}</h3>
        <p>Ubicación: ${p.UBICACIÓN}</p>
        <p>Recámaras: ${p.RECAMARAS} | Baños: ${p.BANOS}</p>
        <p>Estacionamientos: ${p.ESTACIONAMIENTOS} | M2 Construccion: ${p.M2_CONSTRUCCION}</p>
        <p>Precio Avaluo: $${p.PRECIO_AVALUO}</p>
        <p>Precio Infonavit: $${p.P_INFONAVIT}</p>
        <p>Precio FOVISSSTE: $${p.P_FOVISSSTE}</p>
        <p>Precio Bancario: $${p.P_BANCARIO}</p>
        <p>Observaciones: ${p.OBSERVACIONES}
        <button class="btn-maps" onclick="abrirMaps(${index})">
          📍 Abrir en Maps
        </button>
        <button class="btn-enviar" onclick="enviarFicha(${index})">
          📲 Enviar INFO al cliente
        </button>
      </div>
    `;
  });
}

function enviarFicha(index) {
  const p = listadoFiltrado[index];

  // Crear link automático de Google Maps con la ubicación
  const ubicacionTexto = p["UBICACIÓN"] || "";
  const linkMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicacionTexto)}`;

  const mensaje =
`🏡 *${p.MODELO || "Propiedad Disponible"}*
_JLIbañez Inmobiliaria_

📍 Ubicación: ${ubicacionTexto}
🗺️ Ver en Maps: ${linkMaps}

🏘️ Desarrollo: ${p.NomDesarrollo || ""}
🛏️ Recámaras: ${p.RECAMARAS || ""}
🛁 Baños: ${p["BAÑOS"] || ""}
🚗 Estacionamientos: ${p.ESTACIONAMIENTOS || ""}

📐 Terreno: ${p.M2_TERRENO || ""} m²
🏗️ Construcción: ${p.M2_CONSTRUCCION || ""} m²

💰 Opciones de precio:
• Infonavit: $${formatoPrecio(p.P_INFONAVIT)}
• Fovissste: $${formatoPrecio(p.P_FOVISSSTE)}
• Bancario: $${formatoPrecio(p.P_BANCARIO)}
• Otros: $${formatoPrecio(p.P_OTROS)}

📊 Disponibilidad: ${p.DISPONIBILIDAD || "Consultar"}

📩 Información enviada por asesor de
*JLIbañez Inmobiliaria*
¿Te gustaría agendar una visita?`;

  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

function formatoPrecio(valor) {
  if (!valor) return "0";
  return Number(valor).toLocaleString("es-MX");
}

function abrirMaps(index) {
  const propiedad = listadoFiltrado[index];

  const ubicacion = propiedad["UBICACIÓN"] || "";

  if (!ubicacion || ubicacion.trim() === "") {
    alert("Esta propiedad no tiene ubicación registrada.");
    return;
  }

  // Genera búsqueda directa en Google Maps
  const urlMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicacion)}`;
  
  window.open(urlMaps, "_blank");
}
iniciar();
