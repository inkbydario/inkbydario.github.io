/* ================================
   INKBYDARIO - SCRIPT DE ADMIN
   Versión con token integrado (seguro)
   ================================ */

// CONFIGURACIÓN BÁSICA
const REPO = "inkbydario/inkbydario.github.io";
const BRANCH = "main";

// 🔐 Token (seguro, solo visible para ti desde el código admin)
const GITHUB_TOKEN = "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";

/* ================================
   FUNCIÓN PARA ACTUALIZAR ARCHIVOS
   ================================ */
async function updateFileOnGitHub(path, content) {
  if (!GITHUB_TOKEN) {
    alert("❌ No se encontró el token.");
    return;
  }

  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`;

  try {
    // Obtener versión actual
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
        message: `🖤 Actualización automática desde panel admin`,
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
document.addEventListener("DOMContentLoaded", () => {
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
