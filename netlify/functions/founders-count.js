exports.handler = async function () {
  const token = (process.env.NETLIFY_TOKEN || process.env.NETLIFY_API_TOKEN);
  const siteId = process.env.SITE_ID || process.env.NETLIFY_SITE_ID;
  if (!token || !siteId) return { statusCode: 503, headers:{"Content-Type":"application/json","Cache-Control":"no-store"}, body: JSON.stringify({ count: 0, configured: false }) };
  try {
    const formsRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, { headers: { Authorization: `Bearer ${token}` } });
    if (!formsRes.ok) throw new Error('forms');
    const forms = await formsRes.json();
    const form = forms.find(f => f.name === 'founders1000');
    if (!form) return { statusCode: 200, headers:{"Content-Type":"application/json","Cache-Control":"no-store"}, body: JSON.stringify({ count: 0 }) };
    const subsRes = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions`, { headers: { Authorization: `Bearer ${token}` } });
    if (!subsRes.ok) throw new Error('subs');
    const subs = await subsRes.json();
    return { statusCode: 200, headers:{"Content-Type":"application/json","Cache-Control":"no-store"}, body: JSON.stringify({ count: subs.length }) };
  } catch (e) { return { statusCode: 500, headers:{"Content-Type":"application/json","Cache-Control":"no-store"}, body: JSON.stringify({ count: 0 }) }; }
};
