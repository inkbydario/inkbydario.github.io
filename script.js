// --- CONFIGURACIÓN INICIAL --- //
const CLIENT_ID = "Ov23liHu797WDPs74sex"; 
const CLIENT_SECRET = "e1c395e6780101b22b74279ff7b5df5faa59a090";
const REDIRECT_URI = "https://inkbydario.github.io/admin.html";

// --- FUNCIÓN DE LOGIN --- //
function loginWithGitHub() {
  const authURL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo,user`;
  window.location.href = authURL;
}

// --- DETECTA EL CÓDIGO DEVUELTO POR GITHUB --- //
async function handleGitHubRedirect() {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) return;

  try {
    // En un entorno real esto iría en un backend (por seguridad),
    // pero aquí haremos una llamada proxy temporal de demostración
    const response = await fetch(`https://corsproxy.io/?https://github.com/login/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      })
    });

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem("github_token", data.access_token);
      alert("Inicio de sesión exitoso ✅");
      window.location.href = "index.html"; // Redirige al inicio del panel
    } else {
      alert("⚠️ Error al obtener token. Vuelve a intentar.");
      console.error(data);
    }
  } catch (error) {
    console.error("Error al conectar con GitHub:", error);
    alert("Error de conexión con GitHub ❌");
  }
}

// --- RECONOCER SI EL USUARIO YA ESTÁ LOGUEADO --- //
function checkLogin() {
  const token = localStorage.getItem("github_token");
  if (token) {
    document.body.classList.add("logged-in");
  }
}

// --- EJECUCIÓN AUTOMÁTICA --- //
window.onload = () => {
  if (window.location.pathname.endsWith("admin.html")) {
    handleGitHubRedirect();
    checkLogin();
  }
};

// --- EVENTO DEL BOTÓN --- //
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.addEventListener("click", loginWithGitHub);
});
