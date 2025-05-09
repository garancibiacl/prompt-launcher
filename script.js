
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
});


let promptsData = JSON.parse(localStorage.getItem("promptsData")) || [];

function renderCategorias(filtro = "") {
  const container = document.getElementById("accordionCategorias");
  container.classList.add("accordion", "accordion-flush");
  container.innerHTML = "";

  const textoBuscar = filtro.toLowerCase().trim();

  promptsData.forEach((categoria, index) => {
    // Filtra prompts de esta categoría
    const promptsFiltrados = categoria.prompts.filter(p => p.toLowerCase().includes(textoBuscar));
    if (promptsFiltrados.length === 0) return; // si no hay coincidencias, no mostrar categoría

    const id = `categoria-${index}`;
    const promptsHTML = promptsFiltrados.map((p, i) => `
      <div class="prompt-item py-2 d-flex justify-content-between align-items-start">
        <span class="text-break">${p}</span>
        <div class="d-flex gap-1">
          <button class="btn btn-sm btn-outline-secondary" onclick="copiarPrompt(\`${p}\`, \`${categoria.nombre}\`)"><i data-lucide="copy"></i></button>
          <button class="btn  btn-outline-secondary" onclick="editarPrompt(${index}, ${i})"><i data-lucide="pencil"></i></button>
          <button class="btn  btn-outline-secondary rounded-circle" onclick="eliminarPrompt(${index}, ${i})"><i data-lucide="trash"  class="icon-xs"></i></button>
        </div>
      </div>`).join("");

      
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
              title="Editar categoría">
              <i data-lucide="pencil"></i>
            </button>
            
            <!-- Eliminar categoría -->
            <button class="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
              onclick="event.stopPropagation(); eliminarCategoria(${index})"
              title="Eliminar categoría">
              <i data-lucide="trash" class="icon-xs"></i>
            </button>
            
            </div>
          </div>
        </h2>
        <div id="collapse-${id}" class="accordion-collapse collapse" aria-labelledby="heading-${id}" data-bs-parent="#accordionCategorias">
          <div class="accordion-body bg-dark text-white rounded-bottom-3">
            ${promptsHTML || '<em class="text-secondary">No hay prompts aún.</em>'}
          </div>
        </div>
      </div>`;
  });

  actualizarSelectorCategorias();
  guardarEnStorage();
  lucide.createIcons();
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
  document.getElementById("nuevaCategoriaNombre").value = "";
  bootstrap.Modal.getInstance(document.getElementById("nuevaCategoriaModal")).hide();
  renderCategorias();
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
    promptsData[index].prompts.push(prompt);
    document.getElementById("newPrompt").value = "";
    bootstrap.Modal.getInstance(document.getElementById("guardarPromptModal")).hide();
    renderCategorias();
  }
}

function guardarEnStorage() {
  localStorage.setItem("promptsData", JSON.stringify(promptsData));
}

// DOMContentLoaded reemplazado por async wrapper, renderCategorias);


document.getElementById("searchInput")?.addEventListener("input", function () {
  renderCategorias(this.value);
});



function editarPrompt(categoriaIdx, promptIdx) {
  document.getElementById("editarPromptInput").value = promptsData[categoriaIdx].prompts[promptIdx];
  document.getElementById("editarPromptCategoriaIdx").value = categoriaIdx;
  document.getElementById("editarPromptIdx").value = promptIdx;
  new bootstrap.Modal(document.getElementById("editarPromptModal")).show();
}

function guardarEdicionPrompt() {
  const catIdx = document.getElementById("editarPromptCategoriaIdx").value;
  const promptIdx = document.getElementById("editarPromptIdx").value;
  const nuevoTexto = document.getElementById("editarPromptInput").value.trim();
  if (nuevoTexto) {
    promptsData[catIdx].prompts[promptIdx] = nuevoTexto;
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
  }
}

function eliminarCategoria(index) {
  if (confirm("¿Eliminar esta categoría con todos sus prompts?")) {
    promptsData.splice(index, 1);
    guardarEnStorage();
    renderCategorias();
  }
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


