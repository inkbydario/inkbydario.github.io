/* ================================
   INKBYDARIO - SCRIPT DE ADMIN
   Versión segura con token oculto
   ================================ */

// CONFIGURACIÓN BÁSICA
const REPO = "inkbydario/inkbydario.github.io"; // Repositorio GitHub
const BRANCH = "main"; // Rama principal

// Variable para el token (se cargará desde entorno seguro)
let GITHUB_TOKEN = "";

/* ================================
   FUNCIÓN PARA CARGAR EL TOKEN
   ================================ */
async function loadToken() {
  try {
    const response = await fetch("/TOKEN.txt"); // Archivo donde guardas el token
    if (response.ok) {
      const token = await response.text();
      GITHUB_TOKEN = token.trim();
      console.log("🔐 Token cargado correctamente.");
    } else {
      console.warn("⚠️ No se pudo cargar TOKEN.txt.");
    }
  } catch (error) {
    console.error("❌ Error al intentar cargar el token:", error);
  }
}

/* ================================
   FUNCIÓN PARA ACTUALIZAR ARCHIVOS
   ================================ */
async function updateFileOnGitHub(path, content) {
  if (!GITHUB_TOKEN) {
    alert("❌ No se encontró el token. Verifica tu archivo TOKEN.txt o Secret.");
    return;
  }

  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`;

  try {
    // Obtener versión actual del archivo
    const currentFile = await fetch(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    }).then(res => res.json());

    const sha = currentFile.sha;
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    // Subir cambios
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Actualización automática desde panel admin`,
        content: encodedContent,
        sha: sha,
        branch: BRANCH
      })
    });

    if (response.ok) {
      alert("✅ Cambios guardados y publicados correctamente.");
      console.log("✅ Cambios aplicados en GitHub Pages.");
    } else {
      const errorText = await response.text();
      console.error("❌ Error al subir archivo:", errorText);
      alert("❌ Error al guardar en GitHub. Revisa permisos o conexión.");
    }
  } catch (err) {
    console.error("❌ Error general:", err);
    alert("❌ No se pudo conectar con GitHub. Revisa tu token o red.");
  }
}

/* ================================
   BOTÓN DE GUARDADO DESDE ADMIN
   ================================ */
document.addEventListener("DOMContentLoaded", async () => {
  await loadToken();

  const saveButton = document.getElementById("saveBtn");
  if (saveButton) {
    saveButton.addEventListener("click", async () => {
      const updatedHTML = document.documentElement.outerHTML;
      await updateFileOnGitHub("index.html", updatedHTML);
    });
  } else {
    console.warn("⚠️ No se encontró el botón 'saveBtn' en admin.html");
  }
});
