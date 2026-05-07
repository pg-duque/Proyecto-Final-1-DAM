const API_URL = "http://localhost:8080/clases";

async function datosClases() {
  const respuesta = await fetch(API_URL);
  const clases = await respuesta.json();

  const contenedor = document.getElementById("contenedorTarjetas");
  contenedor.innerHTML = "";

  clases.forEach((clase) => {

    const imagenUrl = `assets/img/${clase.nombre.toLowerCase()}.png`;

    contenedor.innerHTML += `
        <div class="col">
            <div class="card h-100 card-dnd">
                <!-- 2. La etiqueta img ahora usará tu ruta local -->
                <img src="${imagenUrl}" class="card-img-top bg-light" alt="${clase.nombre}" style="height: 200px; object-fit: contain;">
                <div class="card-body">
                    <h5 class="card-title text-primary">${clase.nombre}</h5>
                    <p class="card-text text-muted">${clase.descripcion}</p>
                </div>
                <div class="card-footer bg-transparent border-0 pb-3">
                    <button class="btn btn-outline-danger btn-sm" onclick="prepararBorrado('${clase.nombre}')">Eliminar</button>
                </div>
            </div>
        </div>
    `;
  });
}

async function insertarClase() {
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;

  const nuevaClase = { nombre, descripcion };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaClase),
  });
  datosClases();
}

async function borrarClase() {
  const nombre = document.getElementById("nombre").value;
  await fetch(`${API_URL}/${nombre}`, {
    method: "DELETE",
  });
  datosClases();
}

function prepararBorrado(nombre) {
  document.getElementById("nombre").value = nombre;
  borrarClase();
}

async function actualizarClase() {
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;

  const datosParciales = { nombre, descripcion };

  await fetch(`${API_URL}/${nombre}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosParciales),
  });
  datosClases();
}

document.addEventListener("DOMContentLoaded", datosClases);
