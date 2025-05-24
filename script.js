

let promptsData = JSON.parse(localStorage.getItem("promptsData")) || [];


function handleFavoritoClick(event, indexCategoria, indexPrompt, soloFavoritos = false) {
  event.stopPropagation();
  const prompt = promptsData[indexCategoria].prompts[indexPrompt];
  prompt.favorito = !prompt.favorito;
  guardarEnStorage();
  renderPromptsDeCategoria(indexCategoria, { soloFavoritos });
}




function renderCategorias(filtro = "", soloFavoritos = false) {
  const container = document.getElementById("promptLista");
  container.innerHTML = "";

  promptsData.forEach((categoria, index) => {
    const promptsFiltrados = categoria.prompts.filter(p => {
      const coincideFiltro = filtro === "" || p.texto.toLowerCase().includes(filtro.toLowerCase());
      const coincideFavorito = !soloFavoritos || p.favorito;
      return coincideFiltro && coincideFavorito;
    });

    const promptsHTML = promptsFiltrados.map((p, i) => {
      const icono = "star";
      const fill = p.favorito ? 1 : 0;
      const color = p.favorito ? "text-warning" : "text-secondary";

      return `
        <div class="prompt-item prompt-hover py-2 px-3 rounded d-flex justify-content-between align-items-center  text-light">
          <div class="d-flex align-items-center gap-3 w-100">
            <button class="btn btn-sm btn-dark"
              onclick="handleFavoritoClick(event, ${index}, ${i})"
              title="Marcar como favorito">
              <span class="material-symbols-outlined ${color}"
                style="font-variation-settings: 'FILL' ${fill}, 'wght' 700;">
                ${icono}
              </span>
            </button>
            <span class="flex-grow-1 text-break">${p.texto}</span>
          </div>
          <div class="d-flex gap-1 action-buttons">
            <button class="btn btn-sm btn-dark"
              onclick="copiarPrompt(\`${p.texto}\`, \`${categoria.nombre}\`)"
              data-bs-toggle="tooltip" title="Copiar prompt">
              <span class="material-symbols-outlined">content_copy</span>
            </button>
            <button class="btn btn-sm btn-dark"
              onclick="editarPrompt(${index}, ${i})"
              data-bs-toggle="tooltip" title="Editar prompt">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="btn btn-sm btn-dark"
              onclick="eliminarPrompt(${index}, ${i})"
              data-bs-toggle="tooltip" title="Eliminar prompt">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>`;
    }).join("");


  });

  actualizarSelectorCategorias();
  guardarEnStorage();

  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));


  setTimeout(() => {
    const items = document.querySelectorAll("#categoriaLista li");
    if (items.length) {
      items[items.length - 1].classList.add("bg-success", "text-white");
      setTimeout(() => {
        items[items.length - 1].classList.remove("bg-success", "text-white");
      }, 1000);
    }
  }, 100);
  
}


function renderSidebarCategorias() {
  const contenedor = document.getElementById("categoriaLista");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  promptsData.forEach((cat, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-action bg-dark text-light border-secondary";
    li.textContent = cat.nombre;
    li.style.cursor = "pointer";

    li.addEventListener("click", () => {
      renderPromptsDeCategoria(index);
    });

    contenedor.appendChild(li);
  });
}
function renderPromptsDeCategoria(index, opciones = {}) {
  const { soloFavoritos = false } = opciones;
  const categoria = promptsData[index];
  const container = document.getElementById("promptLista");
  container.innerHTML = "";

  const promptsFiltrados = categoria.prompts.filter(p => !soloFavoritos || p.favorito);

  const promptsHTML = promptsFiltrados.map((p, i) => {
    const icono = "star";
    const fill = p.favorito ? 1 : 0;
    const color = p.favorito ? "text-warning" : "text-secondary";

    return `
      <div class="prompt-item prompt-hover py-2 px-3 rounded d-flex justify-content-between align-items-center text-light ">
        <div class="d-flex align-items-center gap-3 w-100">
          <button class="btn btn-sm btn-dark"
            onclick="handleFavoritoClick(event, ${index}, ${i}, ${soloFavoritos})"
            title="Marcar como favorito">
            <span class="material-symbols-outlined ${color}"
              style="font-variation-settings: 'FILL' ${fill}, 'wght' 700;">
              ${icono}
            </span>
          </button>
          <span class="flex-grow-1 text-break">${p.texto}</span>
        </div>
        <div class="d-flex gap-1 action-buttons">
          <button class="btn btn-sm btn-dark"
            onclick="copiarPrompt(\`${p.texto}\`, \`${categoria.nombre}\`)"
            data-bs-toggle="tooltip" title="Copiar prompt">
            <span class="material-symbols-outlined">content_copy</span>
          </button>
          <button class="btn btn-sm btn-dark"
            onclick="editarPrompt(${index}, ${i})"
            data-bs-toggle="tooltip" title="Editar prompt">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="btn btn-sm btn-dark"
            onclick="eliminarPrompt(${index}, ${i})"
            data-bs-toggle="tooltip" title="Eliminar prompt">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>`;
  }).join("");

  container.innerHTML = `
    <div class="mb-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h5 class="mb-0 text-light">${categoria.nombre}</h5>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-light"
            onclick="editarCategoria(${index})"
            data-bs-toggle="tooltip" title="Editar categoría">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="btn btn-sm btn-outline-light"
            onclick="eliminarCategoria(${index})"
            data-bs-toggle="tooltip" title="Eliminar categoría">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
      <div class="d-flex justify-content-end mb-2">
        <button class="btn btn-sm btn-outline-warning"
          onclick="toggleSoloFavoritos(${index})"
          title="Mostrar solo favoritos">
          ⭐ Solo favoritos
        </button>
      </div>
      <div class="d-flex flex-column gap-2">
        ${promptsHTML || '<div class="text-secondary"><em>No hay prompts aún.</em></div>'}
      </div>
    </div>`;
}









function copiarPrompt(texto, categoria) {
  navigator.clipboard.writeText(texto).then(() => {
    mostrarToast(`✅ Prompt copiado desde categoría: <strong>${categoria}</strong>`);
  });
}

function mostrarToast(mensaje) {
  const containerId = 'toastContainer';

  if (!document.getElementById(containerId)) {
    const container = document.createElement('div');
    container.id = containerId;
    container.className = 'position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-white bg-success border-0 mb-2 show';
  toastEl.setAttribute('role', 'alert');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${mensaje}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button>
    </div>
  `;
  document.getElementById(containerId).appendChild(toastEl);

  setTimeout(() => {
    toastEl.remove();
  }, 3000);
}
function crearCategoria() {
  const nombre = document.getElementById("nuevaCategoriaNombre").value.trim();
  if (!nombre) return alert("⚠️ Escribe un nombre");

  promptsData.push({ nombre, prompts: [] });
  guardarEnStorage();

  document.getElementById("nuevaCategoriaNombre").value = "";
  bootstrap.Modal.getInstance(document.getElementById("nuevaCategoriaModal")).hide();

  renderCategorias();
  renderSidebarCategorias(); // ✅ nuevo
  mostrarToast(`✅ Categoría <strong>${nombre}</strong> creada exitosamente`);
}



function actualizarSelectorCategorias() {
  const selector = document.getElementById("categoriaSelectPrompt");
  selector.innerHTML = "";
  promptsData.forEach((cat, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = cat.nombre;
    selector.appendChild(opt);
  });
}

function agregarPrompt() {
  const texto = document.getElementById("newPrompt").value.trim();
  if (!texto) return alert("⚠️ Escribe un prompt");
  document.getElementById("newPrompt").dataset.prompt = texto;
  new bootstrap.Modal(document.getElementById("guardarPromptModal")).show();
}

function guardarPromptEnCategoria() {
  const index = document.getElementById("categoriaSelectPrompt").value;
  const prompt = document.getElementById("newPrompt").dataset.prompt;

  if (promptsData[index]) {
    promptsData[index].prompts.push({
      texto: prompt,
      favorito: false
    });

    guardarEnStorage();
    const nombreCategoria = promptsData[index].nombre;

    document.getElementById("newPrompt").value = "";
    bootstrap.Modal.getInstance(document.getElementById("guardarPromptModal")).hide();
    renderCategorias();

    mostrarToast(`✅ Prompt guardado en <strong>${nombreCategoria}</strong>`);
  }
}




function guardarEnStorage() {
  localStorage.setItem("promptsData", JSON.stringify(promptsData));
}

// DOMContentLoaded reemplazado por async wrapper, renderCategorias);


const inputBusqueda = document.getElementById("searchInput");
const listaResultados = document.getElementById("searchResults");

inputBusqueda?.addEventListener("input", () => {
  const query = inputBusqueda.value.toLowerCase().trim();
  listaResultados.innerHTML = "";

  if (!query) {
    listaResultados.style.display = "none";
    return;
  }

  const resultados = [];

  promptsData.forEach((cat) => {
    cat.prompts.forEach((p) => {
      if (p.toLowerCase().includes(query)) {
        resultados.push({ texto: p, categoria: cat.nombre });
      }
    });
  });

  if (resultados.length === 0) {
    listaResultados.innerHTML = `<li class="list-group-item bg-dark text-light">🔍 No se encontraron resultados</li>`;
  } else {
    resultados.forEach(res => {
      const li = document.createElement("li");
      li.className = "list-group-item bg-dark text-light";
      li.innerHTML = `<strong>${res.texto}</strong><br><small class="text-secondary">${res.categoria}</small>`;
      li.addEventListener("click", () => {
        inputBusqueda.value = res.texto;
        listaResultados.style.display = "none";
      });
      listaResultados.appendChild(li);
    });
  }

  listaResultados.style.display = "block";
});




function editarPrompt(categoriaIdx, promptIdx) {
  const prompt = promptsData[categoriaIdx].prompts[promptIdx];

  // 🛠️ CORREGIDO: accede a prompt.texto
  document.getElementById("editarPromptInput").value = prompt.texto;
  document.getElementById("editarPromptCategoriaIdx").value = categoriaIdx;
  document.getElementById("editarPromptIdx").value = promptIdx;

  new bootstrap.Modal(document.getElementById("editarPromptModal")).show();
}

function guardarEdicionPrompt() {
  const catIdx = document.getElementById("editarPromptCategoriaIdx").value;
  const promptIdx = document.getElementById("editarPromptIdx").value;
  const nuevoTexto = document.getElementById("editarPromptInput").value.trim();

  if (nuevoTexto) {
    promptsData[catIdx].prompts[promptIdx].texto = nuevoTexto;
    guardarEnStorage();
    renderCategorias();
    bootstrap.Modal.getInstance(document.getElementById("editarPromptModal")).hide();
  }
}


function eliminarPrompt(categoriaIdx, promptIdx) {
  if (confirm("¿Eliminar este prompt?")) {
    promptsData[categoriaIdx].prompts.splice(promptIdx, 1);
    guardarEnStorage();
    renderCategorias();
  }
}

function editarCategoria(index) {
  document.getElementById("editarCategoriaInput").value = promptsData[index].nombre;
  document.getElementById("editarCategoriaIdx").value = index;
  new bootstrap.Modal(document.getElementById("editarCategoriaModal")).show();

}

function guardarEdicionCategoria() {
  const idx = document.getElementById("editarCategoriaIdx").value;
  const nuevoNombre = document.getElementById("editarCategoriaInput").value.trim();

  if (nuevoNombre) {
    promptsData[idx].nombre = nuevoNombre;
    guardarEnStorage();
    renderCategorias();
    bootstrap.Modal.getInstance(document.getElementById("editarCategoriaModal")).hide();

    // ✅ Mostrar toast
    mostrarToast(`✅ Categoría actualizada a <strong>${nuevoNombre}</strong>`);
  }
}


function eliminarCategoria(index) {
  const nombre = promptsData[index].nombre;

  Swal.fire({
    title: `¿Eliminar "${nombre}"?`,
    text: "Se eliminarán todos los prompts de esta categoría.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    backdrop: true
  }).then((result) => {
    if (result.isConfirmed) {
      promptsData.splice(index, 1);
      guardarEnStorage();
      renderCategorias();

      mostrarToast(`🗑️ Categoría <strong>${nombre}</strong> eliminada exitosamente`);
    }
  });
}



function importarPromptsDesdeArchivo(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function (e) {
    try {
      const contenido = JSON.parse(e.target.result);
      if (Array.isArray(contenido)) {
        localStorage.setItem("promptsData", JSON.stringify(contenido));
        alert("✅ Prompts importados correctamente.");
        location.reload(); // recarga la interfaz
      } else {
        alert("❌ El archivo no tiene el formato esperado.");
      }
    } catch (err) {
      alert("❌ Error al procesar el archivo JSON.");
      console.error(err);
    }
  };
  lector.readAsText(archivo);
}

document.getElementById("importarPrompts")?.addEventListener("change", importarPromptsDesdeArchivo);

function exportarPromptsComoJSON() {
  const data = localStorage.getItem("promptsData");
  if (!data) return alert("⚠️ No hay datos guardados.");

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "prompts_ialbert_exportado.json";
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("exportarPrompts")?.addEventListener("click", exportarPromptsComoJSON);

async function cargarPromptsDefault() {
  if (!localStorage.getItem("promptsData")) {
    try {
      const res = await fetch("data/default_prompts.json");
      const json = await res.json();
      localStorage.setItem("promptsData", JSON.stringify(json));
      console.log("✅ Prompts cargados por defecto desde archivo.");
    } catch (e) {
      console.error("❌ No se pudo cargar el JSON por defecto", e);
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await cargarPromptsDefault();
  renderCategorias();
  renderCategorias();           // <- para mostrar los prompts en main
  renderSidebarCategorias();    // <- ✅ para mostrar las categorías en el sidebar

});

let filtroSoloFavoritos = false;

function toggleSoloFavoritos(index) {
  filtroSoloFavoritos = !filtroSoloFavoritos;
  renderPromptsDeCategoria(index, { soloFavoritos: filtroSoloFavoritos });
}

document.getElementById("toggleFavoritosBtn")?.addEventListener("click", () => {
  soloFavoritosActivo = !soloFavoritosActivo;

  // Actualiza texto del botón
  const btn = document.getElementById("toggleFavoritosBtn");
  btn.textContent = soloFavoritosActivo ? "🔁 Ver todos" : "🔖 Ver solo favoritos";

  // Vuelve a renderizar
  const filtro = document.getElementById("searchInput")?.value || "";
  renderCategorias(filtro, soloFavoritosActivo);
});








