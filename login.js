let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
  { usuario: "admin", password: "JLI2025", rol: "admin" }
];

function login() {
  const usuarioInput = document.getElementById("usuario").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  if (
    usuarioInput === ADMIN.usuario &&
    passwordInput === ADMIN.password
  ) {
    // Guardar sesión
    localStorage.setItem("usuarioActivo", JSON.stringify(ADMIN));

    // Ocultar login
    document.getElementById("login").style.display = "none";

    // Mostrar app
    document.getElementById("app").style.display = "block";

  } else {
    alert("Usuario o contraseña incorrecto");
  }
}

function logout() {
  localStorage.removeItem("logueado");
  location.reload();
}

window.onload = () => {
  if (localStorage.getItem("logueado") === "true") {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";

    if (localStorage.getItem("rol") === "admin") {
      document.getElementById("adminBtn").style.display = "block";
    }
  }
};
