

let promptsData = JSON.parse(localStorage.getItem("promptsData")) || [];


function handleFavoritoClick(event, catIdx, promptIdx) {
  event.preventDefault();
  event.stopPropagation();
  promptsData[catIdx].prompts[promptIdx].favorito = !promptsData[catIdx].prompts[promptIdx].favorito;
  guardarEnStorage();
  renderCategorias();
}

function renderCategorias(filtro = "", soloFavoritos = false) {

  
  
  const container = document.getElementById("accordionCategorias");
  container.innerHTML = "";




  promptsData.forEach((categoria, index) => {

    
    
    const id = `categoria-${index}`;

    
    const promptsHTML = categoria.prompts.map((p, i) => {
      const icono = "star";
      const fill = p.favorito ? 1 : 0;
      const color = p.favorito ? "text-warning" : "text-secondary";
    
      return `
        <div class="prompt-item prompt-hover py-2 d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-3 w-100">
    
            <!-- ⭐ Botón favorito a la izquierda -->
            <button class="btn btn-sm btn-dark d-flex align-items-center"
            onclick="handleFavoritoClick(event, ${index}, ${i})"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              data-bs-custom-class="tooltip-dark"
              data-bs-title="Destacar prompt">
              <span class="material-symbols-outlined ${color}"
                    style="font-variation-settings: 'FILL' ${fill}, 'wght' 700;">${icono}</span>
            </button>
    
            <!-- Texto del prompt -->
            <span class="flex-grow-1 text-break">${p.texto}</span>
    
            <!-- Botones de acción -->
            <div class="d-flex gap-1 action-buttons">
              <button class="btn btn-sm btn-dark d-flex align-items-center"
                onclick="copiarPrompt(\`${p.texto}\`, \`${categoria.nombre}\`)"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                data-bs-custom-class="tooltip-dark"
                data-bs-title="Copiar prompt">
                <span class="material-symbols-outlined">content_copy</span>
              </button>
              <button class="btn btn-sm btn-dark d-flex align-items-center"
                onclick="editarPrompt(${index}, ${i})"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Editar prompt">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button class="btn btn-sm btn-dark d-flex align-items-center"
                onclick="eliminarPrompt(${index}, ${i})"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Eliminar prompt">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
    
    
    
    
    
  

    container.innerHTML += `
    <div class="accordion-item border border-secondary-subtle rounded-3 overflow-hidden shadow-sm">

    
    <h2 class="accordion-header" id="heading-${id}">
      <div class="d-flex justify-content-between align-items-center bg-primary text-white px-3 py-2 rounded-top-3">
        <button class="accordion-button collapsed bg-transparent border-0 text-white p-0 fw-semibold shadow-none flex-grow-1 text-start"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapse-${id}"
          aria-expanded="false"
          aria-controls="collapse-${id}">
          <span class="d-flex align-items-center gap-2">
            <span>${categoria.nombre}</span>
          </span>
        </button>

        
        <div class="d-flex gap-2 ms-3">
        <!-- Editar categoría -->
        <button class="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
          onclick="event.stopPropagation(); editarCategoria(${index})"
          data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-custom-class="tooltip-dark"
        data-bs-title="Editar Categoria">
          <span class="material-symbols-outlined">
          edit
          </span>           </button>
        
        <!-- Eliminar categoría -->
        <button class="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
          onclick="event.stopPropagation(); eliminarCategoria(${index})"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          data-bs-custom-class="tooltip-dark"
          data-bs-title="Editar Categoria">
          <span class="material-symbols-outlined icon-regular">
          delete
          </span>
        </button>

        
        
        </div>
      </div>
    </h2>
    <div id="collapse-${id}" class="accordion-collapse collapse" aria-labelledby="heading-${id}" data-bs-parent="#accordionCategorias">
    <div class="accordion-body bg-dark text-white rounded-bottom-3 py-3 overflow-auto" style="max-height: 400px;">
        ${promptsHTML || '<em class="text-secondary">No hay prompts aún.</em>'}
      </div>
    </div>
  </div>`;
  });

  actualizarSelectorCategorias();
  guardarEnStorage();

  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));

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
  guardarEnStorage(); // ✅ esto FALTABA

  document.getElementById("nuevaCategoriaNombre").value = "";
  bootstrap.Modal.getInstance(document.getElementById("nuevaCategoriaModal")).hide();
  renderCategorias();
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


});

function toggleFavorito(catIdx, promptIdx) {
  const prompt = promptsData[catIdx].prompts[promptIdx];
  if (typeof prompt === 'string') return; // compatibilidad
  prompt.favorito = !prompt.favorito;
  guardarEnStorage();
  renderCategorias(document.getElementById("searchInput")?.value || "");
}



let soloFavoritosActivo = false;

document.getElementById("toggleFavoritosBtn")?.addEventListener("click", () => {
  soloFavoritosActivo = !soloFavoritosActivo;

  // Actualiza texto del botón
  const btn = document.getElementById("toggleFavoritosBtn");
  btn.textContent = soloFavoritosActivo ? "🔁 Ver todos" : "🔖 Ver solo favoritos";

  // Vuelve a renderizar
  const filtro = document.getElementById("searchInput")?.value || "";
  renderCategorias(filtro, soloFavoritosActivo);
});
