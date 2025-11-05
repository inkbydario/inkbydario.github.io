// CONFIGURACIÓN BÁSICA
const GITHUB_TOKEN = "f0fccf406e752da59836853efc1fffb8"; // Tu token
const REPO = "inkbydario/inkbydario.github.io"; // Tu repositorio
const BRANCH = "main"; // Rama principal

// Función para actualizar archivos en GitHub
async function updateFileOnGitHub(path, content) {
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`;

  // Primero obtenemos el SHA del archivo actual
  const currentFile = await fetch(apiUrl, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  }).then(res => res.json());

  const sha = currentFile.sha;

  // Codificamos el nuevo contenido en Base64
  const encodedContent = btoa(unescape(encodeURIComponent(content)));

  // Subimos los cambios
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
    alert("✅ Cambios guardados y publicados en tu sitio.");
  } else {
    alert("❌ Error al guardar en GitHub. Revisa tu token o conexión.");
  }
}

// Escucha el botón "Guardar" del panel admin
document.getElementById("saveBtn").addEventListener("click", async () => {
  const updatedHTML = document.documentElement.outerHTML;
  await updateFileOnGitHub("index.html", updatedHTML);
});
