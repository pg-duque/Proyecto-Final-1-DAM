# Frontend Galería - D&D

Este proyecto es la interfaz de usuario para gestionar y visualizar las clases de personajes. Está desarrollado con tecnologías web estándar (HTML, CSS, JavaScript) y utiliza Bootstrap 5 para el diseño visual.

## Requisitos Previos

Solo necesitas:
* Un navegador web moderno (Chrome, Edge, Firefox, etc.).
* El **Backend (Spring Boot) corriendo en el puerto 8080** para que los datos carguen correctamente.

## Cómo Ejecutar el Proyecto

No requiere ningún proceso de compilación ni instalación de dependencias (`npm`).

### Opción 1: Directo (Doble Clic)
1. Ve a la carpeta raíz del frontend.
2. Haz doble clic sobre el archivo `index.html`. Se abrirá automáticamente en tu navegador.

### Opción 2: Servidor Local (Recomendado)
Para evitar problemas estrictos de rutas con imágenes locales en algunos navegadores, puedes abrirlo con una extensión de servidor local:
1. Abre la carpeta del frontend en **Visual Studio Code**.
2. Instala la extensión **Live Server**.
3. Haz clic derecho en `index.html` y selecciona **Open with Live Server**.

## Estructura de Archivos Básica

* **`index.html`**: Estructura de la página, formulario de gestión y ventana modal de detalles.
* **`scripts.js`**: Lógica de JavaScript encargada de consumir la API local (Fetch) y renderizar las tarjetas.
* **`styles.css`**: Estilos personalizados inspirados en temáticas de fantasía/D&D.
* **`assets/`**: Carpeta contenedora de las imágenes (`img/`) y fuentes (`fonts/`) utilizadas en la interfaz.
