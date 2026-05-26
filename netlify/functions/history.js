// 歷史紀錄查詢 function

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-access-token',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // 密碼閘
  const accessPassword = process.env.ACCESS_PASSWORD;
  if (accessPassword) {
    const headers = event.headers || {};
    const provided = (headers['x-access-token'] || headers['X-Access-Token'] || '').trim();
    if (provided !== accessPassword) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: '密碼錯誤或未提供' })
      };
    }
  }

  const params = event.queryStringParameters || {};
  const action = params.action || 'list';

  try {
    const { getStore } = require('@netlify/blobs');
    const siteID = process.env.NETLIFY_BLOBS_SITE_ID || process.env.SITE_ID || 'ed9a1854-a201-4db4-a879-0a9ae52e7a6b';
    const token = process.env.NETLIFY_BLOBS_TOKEN;
    const store = (siteID && token)
      ? getStore({ name: 'post-history', siteID, token })
      : getStore('post-history');

    if (action === 'list') {
      const limit = Math.min(parseInt(params.limit) || 50, 200);
      const { blobs } = await store.list();
      const sorted = blobs
        .map(b => b.key)
        .filter(k => /^\d+_/.test(k))
        .sort((a, b) => {
          const ta = parseInt(a.split('_')[0]);
          const tb = parseInt(b.split('_')[0]);
          return tb - ta;
        })
        .slice(0, limit);

      const items = await Promise.all(
        sorted.map(async (key) => {
          try {
            const r = await store.get(key, { type: 'json' });
            if (!r) return null;
            // 只顯示已完成的紀錄,過濾 processing 和 error
            if (r.status && r.status !== 'done') return null;
            return {
              id: r.id,
              ts: r.ts,
              iso: r.iso,
              product_name: r.product_name,
              score: r.score,
              model: r.model,
              cost_twd: r.cost_twd,
              used_search: r.used_search,
              preview: (r.post || '').slice(0, 100)
            };
          } catch {
            return null;
          }
        })
      );

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          total: items.filter(Boolean).length,
          items: items.filter(Boolean)
        })
      };
    }

    if (action === 'get') {
      const id = params.id;
      if (!id) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: '缺少 id 參數' })
        };
      }
      const record = await store.get(id, { type: 'json' });
      if (!record) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: '找不到紀錄' })
        };
      }
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(record)
      };
    }

    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: '未知的 action,請用 list 或 get' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: `執行錯誤: ${err.message}` })
    };
  }
};
