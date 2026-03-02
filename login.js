let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
  { usuario: "admin", password: "JLI2025", rol: "admin" }
];

function login() {
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("password").value;

  const valido = usuarios.find(u => u.usuario === user && u.password === pass);

  if (valido) {
    localStorage.setItem("logueado", "true");
    localStorage.setItem("rol", valido.rol);
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";

    if (valido.rol === "admin") {
      document.getElementById("adminBtn").style.display = "block";
    }
  } else {
    alert("Usuario o contraseña incorrectos");
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
