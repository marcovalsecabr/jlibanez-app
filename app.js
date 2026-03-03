//const ADMIN = {
 // usuario: "admin",
  //password: "JLI2026",
 // rol: "admin",
 // empresa: "JLIbañez Inmobiliaria"
//};
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

   mostrarResultados();

});

function mostrarResultados() {
  const idDes = document.getElementById("desarrollo").value;
  ///const precioMax = document.getElementById("precioMax").value;
  const contenedor = document.getElementById("resultados");

  let filtrados = listado.filter(p => p.Id_desarrollo === idDes);

 // if (precioMax) {
 //   filtrados = filtrados.filter(p => 
 //     parseFloat(p.P_BANCARIO) <= parseFloat(precioMax)
 //   );
  }

  contenedor.innerHTML = "";

  filtrados.forEach((p, index) => {
    contenedor.innerHTML += `
      <div class="card">

        <h3>${p.MODELO}</h3>

        <p><strong>📍 Ubicación:</strong> ${p.UBICACIÓN}</p>

        <p>
          🛏️ ${p.RECAMARAS} | 
          🛁 ${p.BANOS}
        </p>

        <p>
          🚗 ${p.ESTACIONAMIENTOS} | 
          📐 ${p.M2_CONSTRUCCION} m²
        </p>

        <hr>

        <p><strong>💰 Precio Avalúo:</strong> $${formatoPrecio(p.PRECIO_AVALUO)}</p>
        <p><strong>🏦 Infonavit:</strong> $${formatoPrecio(p.P_INFONAVIT)}</p>
        <p><strong>🏛️ FOVISSSTE:</strong> $${formatoPrecio(p.P_FOVISSSTE)}</p>
        <p><strong>🏦 Bancario:</strong> $${formatoPrecio(p.P_BANCARIO)}</p>

        <p><strong>📝 Observaciones:</strong><br>${p.OBSERVACIONES || "Sin observaciones"}</p>

        <button class="btn-maps" onclick="abrirMaps('${p.UBICACIÓN}')">
          📍 Abrir en Maps
        </button>

      </div>
    `;
  });
}

//function enviarWhatsApp(modelo) {
 // const mensaje = `Hola, quiero información del modelo ${modelo} - JLIbañez Inmobiliaria`;
 // const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
 // window.open(url, "_blank");
//}
function abrirMaps(ubicacion) {
  if (!ubicacion) {
    alert("Ubicación no disponible");
    return;
  }

  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicacion)}`;
  window.open(url, "_blank");
}
function formatoPrecio(valor) {
  if (!valor) return "0";
  return Number(valor).toLocaleString("es-MX");
}
iniciar();
