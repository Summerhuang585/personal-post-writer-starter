# 用 Cowork 客製化 + 部署（30 分鐘搞定）

不用會寫程式，用 Claude 桌面 Cowork 模式給 AI 一個 prompt，AI 自動幫你客製化整個工具 + 部署到 Netlify。

---

## 流程概覽

```
1. 下載 GitHub repo 到電腦
   ↓
2. 寫好你的三份個人 DNA 素材(看 DNA萃取範本.md)
   ↓
3. 開 Cowork → 連接資料夾 → 連 Netlify MCP
   ↓
4. 複製下方 Mega Prompt 給 Cowork
   ↓
5. 跟著 Cowork 互動回答問題
   ↓
6. 等 Cowork 自動改 code + 部署 + 設環境變數
   ↓
7. 拿到網址,開始用!
```

---

## Step 1 · 下載這個 repo

到 https://github.com/Summerhuang585/personal-post-writer-starter（之後會更新成 Summer 的 GitHub）

點右上 **`<> Code`** → **Download ZIP** → 解壓縮。

得到 `personal-post-writer-starter-main` 資料夾。

---

## Step 2 · 準備你的三份 DNA 素材

照 [DNA萃取範本.md](DNA萃取範本.md) 寫好三份檔案：

1. `個人說明書.md`
2. `職務說明書.md`
3. `粉專備份.txt`（複製 20-50 篇你寫過最滿意的文章）

**把這三份檔案放進剛剛解壓縮的資料夾**（同層級放就好）。

最後資料夾長這樣：

```
personal-post-writer-starter-main/
├── index.html
├── netlify.toml
├── netlify/...
├── README.md
├── 個人說明書.md       ← 你新加的
├── 職務說明書.md       ← 你新加的
└── 粉專備份.txt        ← 你新加的
```

---

## Step 3 · 開 Cowork

1. 開 Claude 桌面版 → 切到 **Cowork 模式**
2. 點「連接資料夾」→ 選 `personal-post-writer-starter-main`
3. 確認設定 → MCP → **Netlify** 是「已連接」（沒連的話點 Netlify 授權登入）

---

## Step 4 · 複製這段 Mega Prompt 給 Cowork

**整段複製，貼到 Cowork 對話框，按 Enter：**

```
我下載了一個叫「個人 AI 發文器骨架」的工具到資料夾。
我同時放了三份我的個人 DNA 素材在資料夾裡:
  - 個人說明書.md
  - 職務說明書.md
  - 粉專備份.txt

我想做出一個「屬於我自己」的 AI 發文工具,部署到 Netlify(我有 Pro 帳號)。
我完全不會寫程式,請每一步都用最白話的方式跟我互動,做完一步再進下一步。

【第 0 步】預檢(很重要,先跑這個):
  1. 用 Netlify MCP 確認我帳號是 Pro 方案
     - 如果是 Free,停下來告訴我:「你目前是免費版,
       Background Function 跟 Blobs 都用不了。
       請先到 Netlify 升級 Pro($19/月)再回來找我。」
     - 如果是 Pro,跟我說「方案 OK,進下一步」
  2. 確認我資料夾裡有 3 份 DNA 素材:個人說明書.md、職務說明書.md、粉專備份.txt
     - 缺哪個就告訴我先補,別硬跑
  3. 確認 Cowork 連到 Netlify MCP 跟有 Anthropic 客戶端能力
     - 缺哪個指引我裝/連

【第 1 步】讀我那三份 DNA 素材,做以下萃取:
  - 領域分類(電商團購 / 知識教學 / 生活分享 / 自由)
  - 品牌名稱
  - 第一人稱(我/姐/老闆娘/教練/媽媽)
  - 口頭禪 top 15(從粉專備份統計最常出現的詞)
  - 常提到的角色(家人、寵物、朋友等)
  - 開頭典型模式 5 個(從粉專備份找)
  - 寫作公式(若文章有規律,歸納出來;沒規律就跳過)
  - 禁區(從個人說明書 + 觀察粉專得出)
  - LINE 客服 ID

  ⚠️ 重要:如果粉專備份不足 20 篇或語氣不明顯(同樣口頭禪都沒出現 3 次以上),
  請主動跟我說:「粉專備份樣本不夠,請再給我 N 篇更多文章,
  否則我萃取出來的 DNA 不會準。」不要硬猜。

【第 2 步】把萃取結果給我看摘要,讓我確認、補充。
  我說「OK」之後才進下一步,我沒說 OK 不要往下做。

【第 3 步】依我的領域,改寫 netlify/functions/generate-background.js
的 buildSystemPrompt() 函數:
  - 注入我的個人 DNA(第 1 步萃取的所有資料)

  ⚠️ 重要:留下對應領域的「結構模組」(A/B/C/D 其中一個),
  「**從 code 物理刪除**」其他 3 個模組整段,
  不要只是註解掉、也不要保留說「優先用 A」。Code 變短才對。

  - 把禁區改成我的禁區
  - 開頭的「你是 {BRAND_NAME} 的 AI 發文助理」改成
    「你是 我的品牌名 的 AI 發文助理」
  - 範例文字改成符合我領域的範例

改完跟我說「SYSTEM_PROMPT 改好了」,只貼 buildSystemPrompt 函數的部分讓我看,
不用整個檔案。我說「OK」才進下一步。

【第 4 步】改 index.html:
  - 標題從「個人 AI 發文器」改成「我的品牌名 · 發文器」
  - 主要欄位的 placeholder 改成我領域的例子
  - 頁腳改成我的品牌

【第 5 步】問我以下資料(一個一個問,不要一次倒一堆):
  - 你的 Anthropic API key(sk-ant 開頭那串)
  - 你想要的 site 網址名稱(英文小寫,例:cherry-writer)
  - 主密碼(自己想一組)
  - Opus 二次密碼(自己想一組)

【第 6 步】創 Netlify Personal Access Token:
  逐步引導我:
  1. 「請開新分頁到這個網址:https://app.netlify.com/user/applications#personal-access-tokens」
  2. 「點 New access token 按鈕」
  3. 「取個名字,我建議寫 mywriter-blobs,Description 隨便寫」
  4. 「Expiration 選 No expiry」(永不過期)
  5. 「點 Generate 按鈕」
  6. 「複製跳出來的 token(只會顯示這一次),貼回這個對話框給我」

  截圖式說明,不要用「創一把 PAT」這種術語跳過。

【第 7 步】用 Netlify MCP 完成所有事:
  1. 建新 site,name 用我給的英文名
  2. 部署整個資料夾(我那三份 DNA 素材.md 跟 .txt 不用上傳,只傳 code)
  3. 設環境變數:
     - ACCESS_PASSWORD = (我給的主密碼)
     - OPUS_PASSWORD = (我給的 Opus 密碼)
     - ANTHROPIC_API_KEY = (我給的 API key)
     - NETLIFY_BLOBS_TOKEN = (我貼給你的 PAT)
     - POST_TYPE = (我的領域:電商團購 / 知識教學 / 生活分享 / 自由)
     - BRAND_NAME = (從 DNA 萃取的品牌名)
     - LINE_ID = (從 DNA 萃取的 LINE ID)
     - FIRST_PERSON = (從 DNA 萃取)
     - PERSONAL_VOICE = (從 DNA 萃取,逗號分隔)
     - PERSONAL_ROLES = (從 DNA 萃取,逗號分隔)
  4. Clear cache and deploy

【第 8 步】部署完成後,給我:
  - 我的網站網址
  - 我的主密碼
  - 第一篇測試文章建議(從我的領域給 1 個範例素材,讓我貼進去試)

【中斷接續規則】
如果我明天回來說「我們上次做到一半」,請你:
  1. 查資料夾現況:
     - generate-background.js 的 buildSystemPrompt() 改過沒
     - index.html 改過沒
     - .netlify/state.json 在不在(有就代表有 site 連結)
  2. 用 Netlify MCP 查我帳號最近建的 site
  3. 推斷上次跑到哪一步,跟我說「上次做到 Step X,要繼續嗎?」
  4. 我說「繼續」就接著做,不要全部重來

開始吧。
```

---

## Step 5 · 跟著 Cowork 互動

Cowork 會一步一步做。每步做完會跟你確認，照實回答即可。

**最重要的兩個確認點**：

### 確認點 1:DNA 摘要
Cowork 萃取完會給你一份摘要，例：

> 我已從你的 DNA 素材萃取出以下資料：
> - 領域：電商團購
> - 品牌：小櫻優選社
> - 第一人稱：姐
> - 口頭禪：真的、超讚、絕對、根本、推爆、值得、神
> - ...
>
> 請確認是否正確？有需要調整的地方嗎？

仔細看一遍。如果有萃取錯（例如把朋友 ID 當成 LINE ID），跟 Cowork 說「請改 LINE ID 為 @xxx」。沒問題就回「OK 進下一步」。

### 確認點 2:SYSTEM_PROMPT 改好版本
Cowork 改完會貼給你看，例：

> SYSTEM_PROMPT 改好了，內容如下：
> ```
> 你是 小櫻優選社 的 AI 發文助理...
> ...
> ```
> 確認 OK 嗎？

仔細看，特別是：
- 第一人稱是不是你想要的（不是姐就改成「我」）
- 口頭禪有沒有怪怪的
- 禁區有沒有漏掉重要的

回「OK」進下一步，或回「請改 XXX」讓 Cowork 修。

---

## Step 6 · 部署完成

Cowork 會給你：

> ✅ 完成！
> 網址：https://cherry-writer.netlify.app
> 主密碼：你剛剛設的那組
>
> 試一篇文章建議：
> 「請貼以下素材到網站試試看：[範例素材]」

打開網址 → 輸密碼 → 貼範例素材 → 按產出 → 看 AI 寫出來的文是不是像你。

---

## 之後想改

直接跟 Cowork 說：

> 我想讓 AI 寫文章時多用「真的有夠」這個口頭禪
>
> 我想把網站密碼從 xxx 改成 yyy
>
> 我發現 AI 寫的「結團時間」格式不對，應該寫成 MM 月 DD 日，幫我改

Cowork 會幫你改 SYSTEM_PROMPT 或環境變數，redeploy 讓變更生效。

---

## 卡住怎麼辦

| 狀況 | 怎麼辦 |
|---|---|
| Cowork 說沒讀到我的 DNA 檔案 | 確認 3 份檔案有在 Cowork 連接的資料夾裡 |
| Cowork 沒裝 Netlify MCP | 設定 → MCP → 連 Netlify → 授權登入 |
| Cowork 卡在某步 | 截圖貼回 Cowork 問「這步怎麼處理」 |
| 完全失敗 | 重新貼 Step 4 那段 prompt 再來一次 |
| 寫出來的文不像我 | 補更多粉專備份,跟 Cowork 說「請重新萃取 DNA」 |

---

## 安全提醒

- Anthropic API key 跟 Netlify PAT 絕對不要傳給別人（等於你的信用卡）
- 部署完的網址不要公開分享（每次有人產文都會花你 API 額度）
- 如果 key 不小心流出去：到對應網站撤銷舊 key，重新產一把
