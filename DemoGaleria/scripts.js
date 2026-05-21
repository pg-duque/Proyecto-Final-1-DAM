// URL de la API para las clases y las fuentes de poder
const API_URL = "http://localhost:8080/clases";
const API_FUENTES = "http://localhost:8080/fuentes";

// Configuración de las imágenes de los personajes
const RUTA_IMAGENES_LOCAL = "assets/img/";
const IMAGENES_DISPONIBLES = [
  "barbaro.webp",
  "bardo.png",
  "brujo.webp",
  "clerigo.webp",
  "druida.png",
  "explorador.webp",
  "guerrero.webp",
  "hechicero.png",
  "mago.jpg",
  "paladin.webp",
  "picaro.png",
  "senor.jpg"
]; 

// Aquí guardamos las clases que vienen del servidor para no pedirlas a cada rato
let listaClasesLocales = []; 

// Trae las fuentes de poder de la API y las mete en el select del formulario
async function cargarFuentes() {
  const respuesta = await fetch(API_FUENTES);
  const fuentes = await respuesta.json();
  const select = document.getElementById("fuentePoderId");

  // Crea una opción en el menú desplegable por cada fuente
  fuentes.forEach(f => {
    const option = document.createElement("option");
    option.value = f.id;
    option.textContent = f.nombre;
    select.appendChild(option);
  });
}

// Trae las clases de la API y dibuja las tarjetas en la página
async function datosClases() {
  const respuesta = await fetch(API_URL);
  listaClasesLocales = await respuesta.json(); // Guarda los datos en nuestra lista local
  
  const contenedor = document.getElementById("contenedorTarjetas");
  contenedor.innerHTML = ""; // Limpia la pantalla antes de mostrar las tarjetas

  listaClasesLocales.forEach((clase, index) => {

    // Si la clase no tiene imagen, le pone una por defecto
    const imagenSrc = clase.imagenUrl ? `${RUTA_IMAGENES_LOCAL}${clase.imagenUrl}` : `${RUTA_IMAGENES_LOCAL}default.jpg`;

    // Crea el HTML de la tarjeta de Bootstrap
    contenedor.innerHTML += `
        <div class="col">
            <!-- Al hacer clic en la tarjeta se abre el modal y se cargan los datos en el formulario -->
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
                    <!-- event.stopPropagation() evita que se abra el modal cuando solo quieres borrar -->
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); prepararBorrado('${clase.nombre}')">Eliminar</button>
                </div>
            </div>
        </div>
    `;
  });
}

// Muestra la información de la clase seleccionada dentro del modal
function mostrarDetallesByIndex(index) {
  const clase = listaClasesLocales[index];

  document.getElementById("modalNombre").textContent = clase.nombre;
  document.getElementById("modalFuente").textContent = clase.fuentePoder.nombre;
  document.getElementById("modalDescripcion").textContent = clase.descripcion;
  
  // Si no hay descripción larga, pone un texto de aviso
  const extendidaContenedor = document.getElementById("modalDescripcionExtendida");
  extendidaContenedor.textContent = clase.descripcionExtendida || "No hay información adicional disponible para esta clase.";
}

// Guarda una nueva clase en el servidor
async function insertarClase() {
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const descripcionExtendida = document.getElementById("descripcionExtendida").value;
  const imagenUrl = document.getElementById("imagenUrl").value; 
  const fuentePoderId = document.getElementById("fuentePoderId").value;

  // Obliga al usuario a elegir una fuente de poder
  if(!fuentePoderId) return alert("Debes seleccionar una fuente de poder");

  // Agrupa los datos para enviarlos en el formato que pide la API
  const nuevaClase = {
    nombre,
    descripcion,
    descripcionExtendida,
    imagenUrl, 
    fuentePoder: { id: parseInt(fuentePoderId) }
  };

  // Envía los datos al servidor
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaClase),
  });

  // Limpia el formulario y vuelve a cargar las tarjetas para que se vea la nueva
  limpiarFormulario();
  datosClases();
}

// Borra una clase usando su nombre
async function borrarClase() {
  const nombre = document.getElementById("nombre").value;
  await fetch(`${API_URL}/${nombre}`, {
    method: "DELETE",
  });
  datosClases(); // Recarga la lista para quitar la tarjeta borrada
}

// Pone el nombre de la clase en el campo correspondiente y la borra
function prepararBorrado(nombre) {
  document.getElementById("nombre").value = nombre;
  borrarClase();
}

// Modifica los datos de una clase que ya existe
async function actualizarClase() {
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const imagenUrl = document.getElementById("imagenUrl").value; 
  const descripcionExtendida = document.getElementById("descripcionExtendida").value; 

  const datosParciales = { nombre, descripcion, descripcionExtendida, imagenUrl };

  await fetch(`${API_URL}/${nombre}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosParciales),
  });
  datosClases(); // Recarga la lista para ver los cambios
}

// Llena el select de imágenes con el listado de archivos disponibles
function cargarSelectorImagenes() {
  const selectImagen = document.getElementById("imagenUrl");
  if (!selectImagen) return;

  // Hace que la vista previa cambie cada vez que eliges otra imagen
  selectImagen.addEventListener("change", actualizarVistaPrevia);

  IMAGENES_DISPONIBLES.forEach(nombreArchivo => {
    const option = document.createElement("option");
    option.value = nombreArchivo;
    option.textContent = nombreArchivo; 
    selectImagen.appendChild(option);
  });
}

// Pasa los datos de la tarjeta seleccionada a los campos del formulario para poder editarlos
function cargarDatosEnFormulario(index) {
  const clase = listaClasesLocales[index];

  document.getElementById("nombre").value = clase.nombre;
  document.getElementById("descripcion").value = clase.descripcion;
  document.getElementById("descripcionExtendida").value = clase.descripcionExtendida || "";
  document.getElementById("imagenUrl").value = clase.imagenUrl || "";

  if (clase.fuentePoder && clase.fuentePoder.id) {
    document.getElementById("fuentePoderId").value = clase.fuentePoder.id;
  }

  actualizarVistaPrevia(); // Actualiza la miniatura de la imagen cargada
}

// Vacía todos los campos del formulario
function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("descripcionExtendida").value = "";
  document.getElementById("imagenUrl").value = "";
  document.getElementById("fuentePoderId").value = "";

  actualizarVistaPrevia();
}

// Muestra u oculta la miniatura de la imagen según lo que hayas seleccionado
function actualizarVistaPrevia() {
  const selectImagen = document.getElementById("imagenUrl");
  const imgPrevia = document.getElementById("vistaPreviaImg");
  
  if (!selectImagen || !imgPrevia) return;

  const archivoSeleccionado = selectImagen.value;

  if (archivoSeleccionado) {
    imgPrevia.src = `${RUTA_IMAGENES_LOCAL}${archivoSeleccionado}`;
    imgPrevia.style.display = "block"; // Muestra la imagen
  } else {
    imgPrevia.src = "";
    imgPrevia.style.display = "none"; // Oculta la imagen si no hay selección
  }
}

// Arranca las funciones principales automáticamente cuando la página termina de cargar
document.addEventListener("DOMContentLoaded", () => {
  datosClases();
  cargarFuentes();
  cargarSelectorImagenes();
});
