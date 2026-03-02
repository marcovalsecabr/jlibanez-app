function abrirAdmin() {
  const panel = document.createElement("div");
  panel.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:black;color:#d4af37;padding:20px;z-index:9999;">
      <h2>Panel Admin - JLIbañez</h2>
      <input id="nuevoUsuario" placeholder="Usuario">
      <input id="nuevoPass" placeholder="Contraseña">
      <button onclick="crearUsuario()">Crear Usuario</button>
      <div id="listaUsuarios"></div>
      <button onclick="location.reload()">Cerrar Panel</button>
    </div>
  `;
  document.body.appendChild(panel);
  mostrarUsuarios();
}

function crearUsuario() {
  const user = document.getElementById("nuevoUsuario").value;
  const pass = document.getElementById("nuevoPass").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios.push({ usuario: user, password: pass, rol: "asesor" });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  mostrarUsuarios();
}

function mostrarUsuarios() {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const contenedor = document.getElementById("listaUsuarios");
  contenedor.innerHTML = "";
  usuarios.forEach((u, i) => {
    contenedor.innerHTML += `<p>${u.usuario} <button onclick="eliminarUsuario(${i})">Eliminar</button></p>`;
  });
}

function eliminarUsuario(index) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios.splice(index, 1);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  mostrarUsuarios();
}
