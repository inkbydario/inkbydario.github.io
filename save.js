// netlify/functions/save.js
const fetch = require('node-fetch');

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { path, content, password } = body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = process.env.REPO || 'inkbydario/inkbydario.github.io';
    const BRANCH = process.env.BRANCH || 'main';

    if(!password || password !== ADMIN_PASSWORD) return { statusCode:401, body: JSON.stringify({ ok:false, error:'password invalid' }) };
    if(!GITHUB_TOKEN) return { statusCode:500, body: JSON.stringify({ ok:false, error:'no token configured' }) };

    // 1) Get current file to obtain sha
    const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`;
    const getRes = await fetch(apiUrl, { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept:'application/vnd.github+json' }});
    const getJson = await getRes.json();
    const sha = getJson.sha;

    // 2) Put new content (base64)
    const encoded = Buffer.from(content, 'utf8').toString('base64');
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'Content-Type':'application/json', Accept:'application/vnd.github+json' },
      body: JSON.stringify({
        message: `Actualización desde panel admin`,
        content: encoded,
        sha,
        branch: BRANCH
      })
    });
    const putJson = await putRes.json();
    if(putRes.ok) return { statusCode:200, body: JSON.stringify({ ok:true, result: putJson }) };
    return { statusCode:500, body: JSON.stringify({ ok:false, error: putJson }) };
  } catch (err) {
    return { statusCode:500, body: JSON.stringify({ ok:false, error: err.message }) };
  }
};
