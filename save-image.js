// netlify/functions/save-image.js
const fetch = require('node-fetch');
exports.handler = async function(event){
  try{
    const body = JSON.parse(event.body || '{}');
    const { filename, data, password } = body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = process.env.REPO || 'inkbydario/inkbydario.github.io';
    const BRANCH = process.env.BRANCH || 'main';
    if(!password || password !== ADMIN_PASSWORD) return { statusCode:401, body: JSON.stringify({ error:'password invalid' })};
    if(!GITHUB_TOKEN) return { statusCode:500, body: JSON.stringify({ error:'no token' })};

    const path = `images/uploads/${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g,'')}`;
    const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`;
    const encoded = data; // already base64

    const putRes = await fetch(apiUrl, {
      method:'PUT',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'Content-Type':'application/json', Accept:'application/vnd.github+json' },
      body: JSON.stringify({
        message: `Imagen subida desde admin: ${filename}`,
        content: encoded,
        branch: BRANCH
      })
    });
    const putJson = await putRes.json();
    if(!putRes.ok) return { statusCode:500, body: JSON.stringify({ error: putJson }) };
    // Raw URL pública por GitHub Pages
    const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;
    return { statusCode:200, body: JSON.stringify({ url }) };
  }catch(err){ return { statusCode:500, body: JSON.stringify({ error: err.message }) }; }
};
