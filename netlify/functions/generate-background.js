// 團購文產文器 - Netlify Background Function 後端
// 客製化方式:設環境變數 BRAND_NAME / LINE_ID / PERSONAL_VOICE / PERSONAL_ROLES / FIRST_PERSON
// 用途:把廠商提供的原始素材改寫成 FB 銷售文格式
// 環境變數:ANTHROPIC_API_KEY 必填

// ============================================================
// SYSTEM_PROMPT - 完全由環境變數客製化
// 學員部署時設這幾個環境變數,就會自動套用你的品牌語氣
// ============================================================
function buildSystemPrompt() {
  const BRAND_NAME = process.env.BRAND_NAME || '我的品牌';
  const LINE_ID = process.env.LINE_ID || '@yourlineid';
  const PERSONAL_VOICE = process.env.PERSONAL_VOICE || '真的,超,絕對,根本';
  const PERSONAL_ROLES = process.env.PERSONAL_ROLES || '我自己,身邊朋友';
  const FIRST_PERSON = process.env.FIRST_PERSON || '我';
  // 你的領域:電商團購 / 知識教學 / 生活分享 / 自由
  const POST_TYPE = process.env.POST_TYPE || '電商團購';

  return `你是 ${BRAND_NAME} 的 AI 發文助理。

# 你的工作

把使用者提供的素材(產品介紹/活動資訊/個人經歷等),改寫成一篇可以直接貼到 FB 的長文,符合 ${BRAND_NAME} 一貫的格式與語氣。

不是從零創作,是改寫 + 結構化 + 加入個人語氣。

# 個人 DNA(請依品牌客製,由環境變數注入)

- 品牌:${BRAND_NAME}
- 第一人稱:${FIRST_PERSON}(例:姐 / 我 / 老闆娘 / 教練 / 媽媽)
- 慣用詞:${PERSONAL_VOICE}
- 個人化角色:${PERSONAL_ROLES}
- LINE 客服 ID:${LINE_ID}

適度用這些詞讓文章有人味,但不要每句都塞。

# 文章類型:${POST_TYPE}

請依下方對應結構撰寫(只用對應類型那一段,忽略其他)。

---

## 結構 A · 電商團購型(10 段式)

只在 POST_TYPE = 「電商團購」時使用。

1. 爆點開頭(2-4 行)— 第一行從場景痛點/身份共鳴/強烈宣告/好奇問句四選一,不要 hashtag 連發
2. 核心 punchline(1 行)— 一句話強化最大賣點
3. 「為什麼...會是你的...?」+ 編號列點(3-4 點,reader-centric)
4. 多規格/多香味細節(只在 2 個規格以上才寫)
5. 國內外網友與雜誌好評三條(個人 / 群體 / 權威三層堆疊)
6. 結語金句(1 句)
7. 規格清單(只在多規格寫)
8. 快手價(如有):☆快手前 [N] 個喊單每個折 [金額]
9. 商品資訊區塊(嚴格格式):

============================
商品:[月份]團-[品名+規格]
價格:$XXX
.
.
喊單範例:+1,+2(單規格)或 [A]+1,[B]+1(多規格)
結團時間:MM/DD
到貨時間:MM月底
==========
[商品規格細節]
產地:
容量/重量:
效期:

10. 規範提醒(固定):

☆☆☆☆☆☆☆
☆+1之前請詳閱購物相關規則 <精選公告可查看>
☆有訂單問題請統一到LINE客服詢問 ID:${LINE_ID}
☆喊單請照範例喊單,多一字少一字系統都無法判讀入單

---

## 結構 B · 知識教學型(6 段式)

只在 POST_TYPE = 「知識教學」時使用。適合課程招生、線上講座、教練諮詢等。

1. 痛點開頭(1-3 行)— 直接戳讀者卡關的地方
2. 我的故事/觀察(2-4 行)— 為什麼我懂這件事
3. 核心觀念(主要 1-3 個觀念,用編號或子彈點)
4. 學員/客戶見證(2-3 條,真實但匿名)
5. 行動呼籲(報名/留言/索取資料)
6. 加入引導(LINE / IG / Email):${LINE_ID}

不需要商品資訊區塊,不需要喊單範例。

---

## 結構 C · 生活分享型(5 段式)

只在 POST_TYPE = 「生活分享」時使用。適合媽媽部落客、生活風格主、寵物日常等。

1. 場景開頭(1-2 行)— 把畫面帶出來
2. 心境/情感(2-4 行)— 此刻的感受
3. 觀察或啟發(主要主張)
4. 連結讀者(問問題或邀請他們留言分享)
5. 軟性收尾(可選加標籤)

無商品資訊區塊。允許加 3-5 個適合的 hashtag。

---

## 結構 D · 自由(讓 AI 判斷)

只在 POST_TYPE = 「自由」時使用。AI 依素材性質自動選最合適的結構,或混搭。

---

# 核心寫作心法(三類型都適用)

1. 開頭第一行必須勾人(痛點/共鳴/宣告/問句),不要 # 標籤連發
2. 全文用「斷言式」語氣,避免「我覺得」「可能」「應該」這類弱化詞
3. 至少 3 處用第二人稱「妳/你」帶出具體未來情境
4. 適度用個人語氣 DNA(${FIRST_PERSON}、${PERSONAL_VOICE}、${PERSONAL_ROLES})
5. 第三方背書三層堆疊:個人經驗 → 群體分享 → 權威數據(電商必用,其他可選)

# 禁區(三類型都適用)

- 誇大療效(「保證」「絕對」這類醫療字眼)
- 點名競品
- 客戶/學員真實姓名地址
- 合約細節、進貨價、毛利
- 政治、宗教、性別歧視
- 簡體字、中國用語(必須繁體中文台灣用語)

# 純文字格式(極重要,違反作廢)

FB 不支援 markdown,輸出絕對不能有 markdown 符號:
- 不用 ** 粗體
- 不用 # ## ### 標題符號(主標可寫成「【主標】」或直接寫文字)
- 不用 --- 分隔線
- 不用 > 引言符號
- 不用反引號(grave accent)
- 不用 [文字](連結) markdown 連結

商品資訊區塊的分隔線用 ============================(等號)和 ==========(短版)。

# 處理原則

1. 素材夠 → 直接改寫成對應結構
2. 素材不夠 → 啟用 web search 補資料,融入文章
3. 個人試用心得有提供 → 嵌入文章,讓文章有「品牌主親自體驗」可信度
4. 個人試用心得沒提供 → 用第三方角度(「網友分享」「Threads 上很多人說」)帶,不要假裝是品牌主用過

# 輸出格式(嚴格遵守)

請依以下三段式輸出:

===POST_START===
{完整文章,可以直接複製貼到 FB}
===POST_END===

===SCORE===
{1-10 分,只給數字}
===END===

===REASONING===
{評分理由 100 字內}
===END===

如果用了 web search,在 REASONING 最後另起一行寫:「參考來源:1. xxx 2. xxx」`;
}



exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const isDemoMode = process.env.DEMO_MODE === 'true';
  if (!apiKey && !isDemoMode) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: 'ANTHROPIC_API_KEY 環境變數未設定。請到 Netlify 後台 Site settings > Environment variables 新增。'
      })
    };
  }

  // 密碼門檻(可選):若 Netlify 設了 ACCESS_PASSWORD,所有請求必須帶對的 token
  const accessPassword = process.env.ACCESS_PASSWORD;
  if (accessPassword) {
    const headers = event.headers || {};
    const provided = (headers['x-access-token'] || headers['X-Access-Token'] || '').trim();
    if (provided !== accessPassword) {
      return {
        statusCode: 401,
        headers: corsHeaders(),
        body: JSON.stringify({ error: '密碼錯誤或未提供,請刷新頁面重新輸入密碼' })
      };
    }
  }

  let input;
  try {
    input = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: '輸入格式錯誤(JSON parse 失敗)' })
    };
  }

  if (!input.raw_material || !input.raw_material.trim()) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: '廠商素材不能空白' })
    };
  }

  // 必須有 taskId(前端產的)
  const taskId = input.taskId;
  if (!taskId) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: '缺少 taskId 參數' })
    };
  }

  // Opus 二次密碼閘(避免亂用燒錢)
  if (input.model === 'claude-opus-4-6') {
    const opusPw = process.env.OPUS_PASSWORD;
    if (opusPw && (input.opus_password || '').trim() !== opusPw) {
      return {
        statusCode: 401,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Opus 密碼錯誤' })
      };
    }
  }

  // 寫 placeholder Blob,讓前端輪詢時可以拿到「處理中」狀態
  try {
    await writeProcessingBlob(taskId, input);
  } catch (e) {
    console.error('writeProcessingBlob failed:', e.message);
  }

  // ========== DEMO MODE: 不呼叫 Anthropic,直接回範例文 ==========
  if (process.env.DEMO_MODE === 'true') {
    // 模擬 5 秒產文時間,讓 polling 流程跑得到
    await new Promise(r => setTimeout(r, 5000));
    const demoPost = buildDemoPost(input);
    try {
      await saveHistoryDone(taskId, {
        raw_material: input.raw_material,
        post: demoPost,
        score: 8.5,
        reasoning: '[DEMO 範例] 這是示範模式,不是 AI 真的產出。實際部署後,AI 會根據你的廠商素材即時生成符合 10 段式格式、套用你的品牌語氣的真實文章。請開自己的站試試。',
        model: input.model || 'claude-sonnet-4-5',
        cost_twd: 0,
        cost_usd: 0,
        used_search: !!input.use_web_search,
        usage: { input_tokens: 0, output_tokens: 0 }
      });
    } catch (e) {
      console.error('demo saveHistoryDone failed:', e.message);
    }
    return {
      statusCode: 202,
      headers: corsHeaders(),
      body: JSON.stringify({ taskId, status: 'demo-done' })
    };
  }

  const userPrompt = buildUserPrompt(input);

  const requestBody = {
    model: input.model || 'claude-sonnet-4-5',
    max_tokens: 2800,
    system: buildSystemPrompt(),
    messages: [{ role: 'user', content: userPrompt }]
  };

  if (input.use_web_search) {
    requestBody.tools = [
      {
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 1
      }
    ];
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = `Anthropic API 錯誤(${response.status}): ${data.error?.message || JSON.stringify(data)}`;
      await writeErrorBlob(taskId, errMsg, input);
      return { statusCode: 202, headers: corsHeaders(), body: JSON.stringify({ taskId, status: 'error' }) };
    }

    const textContent = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    const parsed = parseOutput(textContent);

    // 算錢
    const usdToTwd = parseFloat(input.exchange_rate) || 32;
    const cost = calcCost(data.usage, requestBody.model, usdToTwd);

    // 寫完整結果進 Blobs(status: done)
    try {
      await saveHistoryDone(taskId, {
        raw_material: input.raw_material,
        post: parsed.post,
        score: parsed.score,
        reasoning: parsed.reasoning,
        model: requestBody.model,
        cost_twd: cost.twd,
        cost_usd: cost.usd,
        used_search: !!input.use_web_search,
        usage: data.usage
      });
    } catch (e) {
      console.error('saveHistoryDone failed:', e.message);
    }

    return {
      statusCode: 202,
      headers: corsHeaders(),
      body: JSON.stringify({ taskId, status: 'done' })
    };
  } catch (err) {
    await writeErrorBlob(taskId, `執行錯誤: ${err.message}`, input);
    return { statusCode: 202, headers: corsHeaders(), body: JSON.stringify({ taskId, status: 'error' }) };
  }
};

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-access-token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
}

function buildUserPrompt(input) {
  const lines = [];
  lines.push('請把以下廠商提供的素材,改寫成可以直接貼到 FB 的銷售文(嚴格依照系統指示的 10 段式格式)。');
  lines.push('');
  lines.push('===廠商提供的原始素材===');
  lines.push(input.raw_material);
  lines.push('===素材結束===');
  lines.push('');

  const supplements = [];

  // 產品內容補充(若素材不足,這幾欄補強)
  if (input.feature_emphasis) {
    supplements.push('【產品特色補強/這次想強調的賣點】');
    supplements.push(input.feature_emphasis);
  }
  if (input.ingredients_usage) {
    supplements.push('【成分/材質/使用方法補充】');
    supplements.push(input.ingredients_usage);
  }
  if (input.target_pain) {
    supplements.push('【目標受眾/痛點】');
    supplements.push(input.target_pain);
    supplements.push('→ 請在第 3 段「為什麼...會是你的...?」的列點中,圍繞這個痛點寫,讓讀者對號入座。');
  }
  if (input.personal_experience) {
    supplements.push('【個人試用心得】');
    supplements.push(input.personal_experience);
    supplements.push('→ 請把這段融入文章開頭或第 3 段,讓文章有 Summer 親自用過的可信度。');
  }

  // 團購規格
  if (input.month_label) supplements.push(`【月份標題】${input.month_label}(例:5月團、6月商品)`);
  if (input.team_price) supplements.push(`【團購價】${input.team_price}`);
  if (input.original_price) supplements.push(`【原價/市售價】${input.original_price}`);
  if (input.specs_list) supplements.push(`【規格/口味/顏色清單】${input.specs_list}`);
  if (input.example_order) supplements.push(`【喊單範例】${input.example_order}`);
  if (input.deadline) supplements.push(`【結團時間】${input.deadline}`);
  if (input.delivery) supplements.push(`【到貨時間】${input.delivery}`);
  if (input.expiry) supplements.push(`【效期】${input.expiry}`);
  if (input.shipping) supplements.push(`【運費/出貨方式】${input.shipping}`);
  if (input.quick_hand) supplements.push(`【快手價優惠】${input.quick_hand}`);

  // 輸出設定
  if (input.length) supplements.push(`【期望文案長度】${input.length}`);
  if (input.extra_notes) {
    supplements.push('【額外指示/特殊要求】');
    supplements.push(input.extra_notes);
  }

  if (supplements.length > 0) {
    lines.push('===補充資訊===');
    lines.push(...supplements);
    lines.push('===補充結束===');
    lines.push('');
  }

  if (input.use_web_search) {
    lines.push('===搜尋指示===');
    lines.push('請主動搜尋以下資訊融入文案的「國內外網友與雜誌好評不斷」段落:');
    lines.push('1. 國內外網路評價(Threads、小紅書、Dcard、PTT、美妝論壇)');
    lines.push('2. 雜誌/媒體報導(Vogue、Elle、Marie Claire、Cosme、@cosme 等)');
    lines.push('3. 第三方數據(銷售排名、得獎紀錄、認證、實測數據)');
    lines.push('搜尋到的精華改寫成「」引號評論,不要直接整段貼。');
    lines.push('===搜尋指示結束===');
    lines.push('');
  }

  lines.push('請依照系統指示的三段式格式輸出(===POST_START=== / ===SCORE=== / ===REASONING===)。');

  return lines.join('\n');
}

function parseOutput(text) {
  const postMatch = text.match(/===POST_START===([\s\S]*?)===POST_END===/);
  const scoreMatch = text.match(/===SCORE===\s*(\d+(?:\.\d+)?)\s*(?:\/\s*10)?\s*===END===/);
  const reasoningMatch = text.match(/===REASONING===([\s\S]*?)===END===/);

  return {
    post: stripMarkdown(postMatch ? postMatch[1].trim() : text.trim()),
    score: scoreMatch ? parseFloat(scoreMatch[1]) : null,
    reasoning: reasoningMatch ? reasoningMatch[1].trim() : null
  };
}

// 後端強制剝除 markdown 符號(AI 偶爾會偷用)
function stripMarkdown(text) {
  if (!text) return text;
  let t = text;
  // 1. 粗體斜體:**xxx** *xxx* __xxx__ → xxx
  t = t.replace(/\*\*([^*\n]+?)\*\*/g, '$1');
  t = t.replace(/__([^_\n]+?)__/g, '$1');
  t = t.replace(/(?<![*\w])\*([^*\n]+?)\*(?![*\w])/g, '$1');
  // 2. Markdown 標題 ## ### → 拿掉前綴(保留標題文字)
  t = t.replace(/^#{1,6}\s+/gm, '');
  // 3. 引言符號 > → 拿掉前綴
  t = t.replace(/^>\s+/gm, '');
  // 4. 三條以上的 dash 分隔線 ---、---- → 換成等於號短版(保留視覺)
  t = t.replace(/^-{3,}$/gm, '==========');
  // 5. Markdown 連結 [文字](url) → 文字 (url)
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
  // 6. 反引號程式碼 `xxx` → xxx
  t = t.replace(/`([^`\n]+?)`/g, '$1');
  return t;
}

// USD per million tokens(2026/05 公開定價,如有變動修這裡即可)
const PRICING = {
  'claude-opus-4-6':            { input: 15,  output: 75 },
  'claude-sonnet-4-5':          { input: 3,   output: 15 },
  'claude-haiku-4-5-20251001':  { input: 1,   output: 5  }
};
const WEB_SEARCH_PER_REQUEST_USD = 0.01; // $10 / 1000 requests

function calcCost(usage, model, usdToTwd) {
  if (!usage) {
    return { usd: 0, twd: 0, breakdown: null, note: 'usage 缺失,無法估算' };
  }

  const p = PRICING[model] || PRICING['claude-sonnet-4-5'];

  const inputTokens         = usage.input_tokens || 0;
  const outputTokens        = usage.output_tokens || 0;
  const cacheCreationTokens = usage.cache_creation_input_tokens || 0;
  const cacheReadTokens     = usage.cache_read_input_tokens || 0;

  // Anthropic prompt cache 計價:寫入 1.25x、讀取 0.1x base input price
  const inputCost  = (inputTokens         / 1_000_000) * p.input;
  const cacheWrite = (cacheCreationTokens / 1_000_000) * p.input * 1.25;
  const cacheRead  = (cacheReadTokens     / 1_000_000) * p.input * 0.1;
  const outputCost = (outputTokens        / 1_000_000) * p.output;

  // Web search 次數抓 server_tool_use 區塊
  const webSearchRequests = (usage.server_tool_use && usage.server_tool_use.web_search_requests) || 0;
  const webSearchCost = webSearchRequests * WEB_SEARCH_PER_REQUEST_USD;

  const totalUsd = inputCost + cacheWrite + cacheRead + outputCost + webSearchCost;
  const totalTwd = totalUsd * usdToTwd;

  return {
    usd: round(totalUsd, 4),
    twd: round(totalTwd, 2),
    exchange_rate: usdToTwd,
    breakdown: {      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cache_creation_tokens: cacheCreationTokens,
      cache_read_tokens: cacheReadTokens,
      web_search_requests: webSearchRequests,
      input_usd: round(inputCost, 4),
      cache_write_usd: round(cacheWrite, 4),
      cache_read_usd: round(cacheRead, 4),
      output_usd: round(outputCost, 4),
      web_search_usd: round(webSearchCost, 4)
    }
  };
}

function round(n, digits) {
  const f = Math.pow(10, digits);
  return Math.round(n * f) / f;
}

// ---------- 歷史紀錄(Netlify Blobs) ----------
function getBlobStore() {
  const { getStore } = require('@netlify/blobs');
  const siteID = process.env.NETLIFY_BLOBS_SITE_ID || process.env.SITE_ID || 'ed9a1854-a201-4db4-a879-0a9ae52e7a6b';
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  return (siteID && token)
    ? getStore({ name: 'post-history', siteID, token })
    : getStore('post-history');
}

function extractProductName(rawOrPost) {
  if (!rawOrPost) return '(未命名)';
  const m = (rawOrPost || '').match(/商品[:：]\s*(.+?)$/m);
  if (m) return m[1].trim().slice(0, 60);
  return rawOrPost.replace(/\s+/g, ' ').slice(0, 30);
}

async function writeProcessingBlob(taskId, input) {
  const store = getBlobStore();
  const ts = parseInt(taskId.split('_')[0]) || Date.now();
  const record = {
    id: taskId,
    ts,
    iso: new Date(ts).toISOString(),
    status: 'processing',
    product_name: extractProductName(input.raw_material),
    raw_material_preview: (input.raw_material || '').slice(0, 200),
    model: input.model || 'claude-sonnet-4-5',
    used_search: !!input.use_web_search
  };
  await store.setJSON(taskId, record);
}

async function saveHistoryDone(taskId, data) {
  const store = getBlobStore();
  const ts = parseInt(taskId.split('_')[0]) || Date.now();
  // 優先用 post 抓產品名
  let productName = extractProductName(data.post);
  if (productName === '(未命名)' || productName === (data.raw_material || '').replace(/\s+/g, ' ').slice(0, 30)) {
    productName = extractProductName(data.raw_material);
  }
  const record = {
    id: taskId,
    ts,
    iso: new Date(ts).toISOString(),
    status: 'done',
    product_name: productName,
    raw_material_preview: (data.raw_material || '').slice(0, 200),
    post: data.post,
    score: data.score,
    reasoning: data.reasoning,
    model: data.model,
    cost_twd: data.cost_twd,
    cost_usd: data.cost_usd,
    used_search: data.used_search,
    usage: data.usage
  };
  await store.setJSON(taskId, record);
}

async function writeErrorBlob(taskId, errorMessage, input) {
  try {
    const store = getBlobStore();
    const ts = parseInt(taskId.split('_')[0]) || Date.now();
    const record = {
      id: taskId,
      ts,
      iso: new Date(ts).toISOString(),
      status: 'error',
      error_message: errorMessage,
      product_name: extractProductName(input?.raw_material),
      raw_material_preview: (input?.raw_material || '').slice(0, 200),
      model: input?.model || 'claude-sonnet-4-5'
    };
    await store.setJSON(taskId, record);
  } catch (e) {
    console.error('writeErrorBlob failed:', e.message);
  }
}

// ========== DEMO MODE 範例文 ==========
function buildDemoPost(input) {
  const productName = (input.raw_material || '').split(/\n/)[0].slice(0, 40) || '示範產品';
  const teamPrice = input.team_price || '$XXX';
  const lineId = process.env.LINE_ID || '@yourlineid';

  return `[DEMO 範例] 這是示範文,實際部署後 AI 會根據你的素材即時生成

擦過這條就回不去了,真的!姐已經囤第三條!
這款最厲害的地方,就是【某某核心賣點 + 某某升級科技】,根本是同類產品的天花板!

為什麼妳的日常保養會卡關?為什麼妳需要這條?

1. 質感爆表,顏值就是門面:
   [這裡 AI 會根據妳廠商素材寫第一個賣點,
    含技術點 + 第三方引用 + 個人感受三元素]

2. 深層解決妳的痛點,效率提升 196%:
   [這裡 AI 會寫第二個賣點,套用「靶心人 + 三層堆疊」公式,
    含具體數據、品牌定位、使用情境]

3. CP 值高到不行,送禮自用都霸氣:
   [這裡 AI 會寫第三個賣點,結合「現實扭曲力場」強斷言,
    告訴讀者「妳擦完會怎樣」的未來情境]

國內外網友與美妝雜誌好評不斷

「[品牌定位 / 媒體報導]」— Threads 網友
「[使用感受 / 適用場景]」— 小紅書實測
「[具體數字 / 第三方認證,例:Cosme 排名前 X、銷售破百萬瓶]」

[結語金句:認真說,${productName} 絕對是妳今年最值得入手的單品,
擦過就會明白為什麼這條一定要囤!]

============================
商品:[月份]團-${productName}
價格:${teamPrice}
.
.
喊單範例:+1,+2
結團時間:MM/DD
到貨時間:MM月底
==========
[商品規格細節]
產地:
容量/重量:
效期:

☆☆☆☆☆☆☆
☆+1之前請詳閱購物相關規則 <精選公告可查看>
☆有訂單問題請統一到LINE客服詢問 ID:${lineId}
☆喊單請照範例喊單,多一字少一字系統都無法判讀入單

---
↑ 以上是 DEMO 範例,實際 AI 產出會根據妳貼進去的廠商素材,
   逐段帶入真實的產品賣點、痛點解決、品牌語氣。
   想看真的長怎樣?照「零基礎部署教學」開自己的站。`;
}
