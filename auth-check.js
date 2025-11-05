// netlify/functions/auth-check.js
exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const password = body.password || '';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
    if(password && ADMIN_PASSWORD && password === ADMIN_PASSWORD){
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: false }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error: err.message }) };
  }
};
