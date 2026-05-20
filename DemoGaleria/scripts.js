const API_URL = "http://localhost:8080/clases";
const API_FUENTES = "http://localhost:8080/fuentes";

const RUTA_IMAGENES_LOCAL = "assets/img/";
const IMAGENES_DISPONIBLES = [
  "barbaro.webp",
  "bardo.png",
  "brujo.webp",
  "clerigo.webp",
  "druida.png",
  "explorador.png",
  "guerrero..webp",
  "hechicero.png",
  "mago.jpg",
  "paladin.webp",
  "picaro.png",
  "senor.jpg"
]; 

let listaClasesLocales = []; 

async function cargarFuentes() {
  const respuesta = await fetch(API_FUENTES);
  const fuentes = await respuesta.json();
  const select = document.getElementById("fuentePoderId");

  fuentes.forEach(f => {
    const option = document.createElement("option");
    option.value = f.id;
    option.textContent = f.nombre;
    select.appendChild(option);
  });
}

async function datosClases() {
  const respuesta = await fetch(API_URL);
  listaClasesLocales = await respuesta.json(); 
  
  const contenedor = document.getElementById("contenedorTarjetas");
  contenedor.innerHTML = "";

  listaClasesLocales.forEach((clase, index) => {

    const imagenSrc = clase.imagenUrl ? `${RUTA_IMAGENES_LOCAL}${clase.imagenUrl}` : `${RUTA_IMAGENES_LOCAL}default.jpg`;

    contenedor.innerHTML += `
        <div class="col">
            <!-- MODIFICADO: Ahora ejecuta mostrarDetallesByIndex y cargarDatosEnFormulario -->
            <div class="card h-100 card-dnd" style="cursor: pointer;" 
                 data-bs-toggle="modal" 
                 data-bs-target="#modalClase" 
                 onclick="mostrarDetallesByIndex(${index}); cargarDatosEnFormulario(${index})">
                 
                 <img src="${imagenSrc}" class="card-img-top" alt="${clase.nombre}">
                 
                <div class="card-body">
                    <h5 class="card-title text-primary">${clase.nombre}</h5>
                    
                    <span class="badge badge-dnd-${clase.fuentePoder.nombre.toLowerCase()} mb-2 me-2">${clase.fuentePoder.nombre}</span>
                    
                    <p class="card-text text-muted">${clase.descripcion}</p>
                </div>
                <div class="card-footer bg-transparent border-0 pb-3">
                    <!-- MODIFICADO: event.stopPropagation evita que se abra el modal al borrar -->
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); prepararBorrado('${clase.nombre}')">Eliminar</button>
                </div>
            </div>
        </div>
    `;
  });
}

function mostrarDetallesByIndex(index) {
  const clase = listaClasesLocales[index];

  document.getElementById("modalNombre").textContent = clase.nombre;
  document.getElementById("modalFuente").textContent = clase.fuentePoder.nombre;
  document.getElementById("modalDescripcion").textContent = clase.descripcion;
  
  const extendidaContenedor = document.getElementById("modalDescripcionExtendida");
  extendidaContenedor.textContent = clase.descripcionExtendida || "No hay información adicional disponible para esta clase.";
}

async function insertarClase() {
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const descripcionExtendida = document.getElementById("descripcionExtendida").value;
  const imagenUrl = document.getElementById("imagenUrl").value; 
  const fuentePoderId = document.getElementById("fuentePoderId").value;

  if(!fuentePoderId) return alert("Debes seleccionar una fuente de poder");

  const nuevaClase = {
    nombre,
    descripcion,
    descripcionExtendida,
    imagenUrl, 
    fuentePoder: { id: parseInt(fuentePoderId) }
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaClase),
  });

  document.getElementById("nombre").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("descripcionExtendida").value = ""; 
  document.getElementById("imagenUrl").value = "";
  document.getElementById("fuentePoderId").value = "";
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
  const imagenUrl = document.getElementById("imagenUrl").value; // Nombre del nuevo archivo
  const descripcionExtendida = document.getElementById("descripcionExtendida").value; 

  const datosParciales = { nombre, descripcion, descripcionExtendida, imagenUrl };

  await fetch(`${API_URL}/${nombre}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosParciales),
  });
  datosClases();
}

function cargarSelectorImagenes() {
  const selectImagen = document.getElementById("imagenUrl");
  if (!selectImagen) return;

  IMAGENES_DISPONIBLES.forEach(nombreArchivo => {
    const option = document.createElement("option");
    option.value = nombreArchivo;
    option.textContent = nombreArchivo; 
    selectImagen.appendChild(option);
  });
}

function cargarDatosEnFormulario(index) {
  const clase = listaClasesLocales[index];

  document.getElementById("nombre").value = clase.nombre;
  document.getElementById("descripcion").value = clase.descripcion;
  document.getElementById("descripcionExtendida").value = clase.descripcionExtendida || "";
  document.getElementById("imagenUrl").value = clase.imagenUrl || "";

  if (clase.fuentePoder && clase.fuentePoder.id) {
    document.getElementById("fuentePoderId").value = clase.fuentePoder.id;
  }
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("descripcionExtendida").value = "";
  document.getElementById("imagenUrl").value = "";
  document.getElementById("fuentePoderId").value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  datosClases();
  cargarFuentes();
  cargarSelectorImagenes();
});
