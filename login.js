// ===== URL CSV DE USUARIOS =====
const CSV_USUARIOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRvW6xkyA7SL8Ngdmk9YsqWnlNcOYCQSAwSWnvE4J8YVPlFBOeLYma9ROnwcyfkxA/pub?gid=1573778923&single=true&output=csv";

let usuariosSistema = [];

// ===== CARGAR USUARIOS DESDE CSV =====
async function cargarUsuarios() {
  try {
    const response = await fetch(CSV_USUARIOS);
    const data = await response.text();

    const filas = data.split("\n").slice(1); // quitar encabezado

    usuariosSistema = filas
      .filter(f => f.trim() !== "")
      .map(fila => {
        const columnas = fila.split(",");
        return {
          usuario: columnas[0]?.trim(),
          password: columnas[1]?.trim(),
          rol: columnas[2]?.trim().toLowerCase(),
          nombre: columnas[3]?.trim()
        };
      });

    console.log("Usuarios cargados:", usuariosSistema);
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    alert("Error al cargar usuarios del sistema");
  }
}

// ===== FUNCIÓN LOGIN =====
function login() {
  const usuarioInput = document.getElementById("usuario").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  const user = usuariosSistema.find(
    u =>
      u.usuario === usuarioInput &&
      u.password === passwordInput
  );

  if (!user) {
    alert("Usuario o contraseña incorrecto");
    return;
  }
  

  // Guardar sesión
  localStorage.setItem("usuarioActivo", JSON.stringify(user));

  // Ocultar login
  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";

  // Si es admin (para futuras funciones)
  if (user.rol === "admin") {
    console.log("Acceso ADMIN activado");
  }
}

// ===== CARGAR USUARIOS AL INICIAR =====
window.addEventListener("DOMContentLoaded", cargarUsuarios);