exports.id=4138,exports.ids=[4138,9718],exports.modules={34334:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{K5:()=>n,S3:()=>l,kO:()=>m});var e=c(76760),f=c.n(e),g=c(73024),h=c.n(g),i=c(49120);let a=null,o=!1;try{a=(await Promise.resolve().then(c.t.bind(c,87550,23))).default,o=!0}catch(a){console.warn("[usageLimiter] better-sqlite3 not available:",a.message),console.warn("[usageLimiter] API key usage limiting will be disabled.")}let p=f().join(i.DATA_DIR,"usage-limits.db");function j(){if(global._usageLimiterStmts&&!global._usageLimiterStmts.insertReset&&(global._usageLimiterStmts=null),global._usageLimiterStmts)return global._usageLimiterStmts;let b=function(){if(global._usageLimiterDb)return global._usageLimiterDb;if(!o)return null;h().existsSync(i.DATA_DIR)||h().mkdirSync(i.DATA_DIR,{recursive:!0});try{let b=new a(p);return b.pragma("journal_mode = WAL"),b.pragma("synchronous = NORMAL"),b.exec(`
      CREATE TABLE IF NOT EXISTS usage_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_key TEXT NOT NULL,
        input_tokens INTEGER NOT NULL DEFAULT 0,
        cost REAL NOT NULL DEFAULT 0,
        ts INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_usage_key_ts ON usage_entries(api_key, ts);

      CREATE TABLE IF NOT EXISTS reset_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_key TEXT NOT NULL,
        window_ms INTEGER,
        window_label TEXT NOT NULL,
        reset_at INTEGER NOT NULL,
        tokens_cleared INTEGER NOT NULL DEFAULT 0,
        cost_cleared REAL NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_reset_history_key ON reset_history(api_key, reset_at);
    `),global._usageLimiterDb=b,b}catch(a){return console.error("[usageLimiter] Failed to open database:",a.message),null}}();if(!b)return null;try{b.exec(`
      CREATE TABLE IF NOT EXISTS reset_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_key TEXT NOT NULL,
        window_ms INTEGER,
        window_label TEXT NOT NULL,
        reset_at INTEGER NOT NULL,
        tokens_cleared INTEGER NOT NULL DEFAULT 0,
        cost_cleared REAL NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_reset_history_key ON reset_history(api_key, reset_at);
    `)}catch{}return global._usageLimiterStmts={insert:b.prepare("INSERT INTO usage_entries (api_key, input_tokens, cost, ts) VALUES (?, ?, ?, ?)"),sumByKey:b.prepare(`
      SELECT
        SUM(CASE WHEN ts >= ? THEN input_tokens ELSE 0 END) AS inputTokens5h,
        SUM(input_tokens) AS inputTokens24h,
        SUM(CASE WHEN ts >= ? THEN cost ELSE 0 END) AS cost5h,
        SUM(cost) AS cost24h
      FROM usage_entries
      WHERE api_key = ? AND ts >= ?
    `),sumAllKeys:b.prepare(`
      SELECT
        api_key,
        SUM(CASE WHEN ts >= ? THEN input_tokens ELSE 0 END) AS inputTokens5h,
        SUM(input_tokens) AS inputTokens24h,
        SUM(CASE WHEN ts >= ? THEN cost ELSE 0 END) AS cost5h,
        SUM(cost) AS cost24h
      FROM usage_entries
      WHERE ts >= ?
      GROUP BY api_key
    `),sumByKeyWindow:b.prepare(`
      SELECT
        SUM(input_tokens) AS inputTokens,
        SUM(cost) AS cost
      FROM usage_entries
      WHERE api_key = ? AND ts >= ?
    `),prune:b.prepare("DELETE FROM usage_entries WHERE ts < ?"),insertReset:b.prepare("INSERT INTO reset_history (api_key, window_ms, window_label, reset_at, tokens_cleared, cost_cleared) VALUES (?, ?, ?, ?, ?, ?)"),getResetHistory:b.prepare("SELECT id, window_ms, window_label, reset_at, tokens_cleared, cost_cleared FROM reset_history WHERE api_key = ? ORDER BY reset_at DESC LIMIT 30"),sumForWindow:b.prepare("SELECT SUM(input_tokens) AS tokens, SUM(cost) AS cost FROM usage_entries WHERE api_key = ? AND ts >= ?"),sumAllForKey:b.prepare("SELECT SUM(input_tokens) AS tokens, SUM(cost) AS cost FROM usage_entries WHERE api_key = ?"),deleteByWindow:b.prepare("DELETE FROM usage_entries WHERE api_key = ? AND ts >= ?"),deleteAllForKey:b.prepare("DELETE FROM usage_entries WHERE api_key = ?")},global._usageLimiterStmts}global._usageLimiterDb||(global._usageLimiterDb=null),global._usageLimiterStmts||(global._usageLimiterStmts=null),global._usageLimiterTotals||(global._usageLimiterTotals={});let q=global._usageLimiterTotals;global._usageLimiterLimits||(global._usageLimiterLimits={data:{},ts:0});let r=global._usageLimiterLimits;async function k(){if(!(Date.now()-r.ts<5e3))try{let{getApiKeys:a}=await Promise.resolve().then(c.bind(c,89718)),b=await a(),d={};for(let a of b)a.limits&&(d[a.key]=a.limits);r.data=d,r.ts=Date.now()}catch(a){console.error("[usageLimiter] Failed to refresh limits cache:",a.message)}}async function l(a){let b=Date.now(),c=b-18e6,d={inputTokens5h:0,inputTokens24h:0,cost5h:0,cost24h:0};try{if(!o)return{usage:d,limits:{},windowUsage:{}};let e=j();if(!e)return{usage:d,limits:{},windowUsage:{}};let f=e.sumByKey.get(c,c,a,b-864e5);d={inputTokens5h:f?.inputTokens5h||0,inputTokens24h:f?.inputTokens24h||0,cost5h:f?.cost5h||0,cost24h:f?.cost24h||0}}catch(a){console.error("[usageLimiter] getUsageSummary failed:",a.message)}await k();let e=r.data[a]||{},f={};if(e.windows&&Array.isArray(e.windows))for(let b of e.windows){if(!b.durationMs)continue;let c=function(a,b){if(!o)return{inputTokens:0,cost:0};let c=Date.now();try{let d=j();if(!d)return{inputTokens:0,cost:0};let e=d.sumByKeyWindow.get(a,c-b);return{inputTokens:e?.inputTokens||0,cost:e?.cost||0}}catch(a){return console.error("[usageLimiter] getWindowUsage failed:",a.message),{inputTokens:0,cost:0}}}(a,b.durationMs);f[`tokens_${b.durationMs}`]=c.inputTokens,f[`cost_${b.durationMs}`]=c.cost}return{usage:d,limits:e,windowUsage:f}}function m(a,b,c){if(!o)return{tokensCleared:0,costCleared:0};let d=j();if(!d)return{tokensCleared:0,costCleared:0};let e=Date.now(),f=0,g=0;try{if(b){let c=e-b,h=d.sumForWindow.get(a,c);f=h?.tokens||0,g=h?.cost||0,d.deleteByWindow.run(a,c)}else{let b=d.sumAllForKey.get(a);f=b?.tokens||0,g=b?.cost||0,d.deleteAllForKey.run(a)}d.insertReset.run(a,b||null,c||"All time",e,Math.round(f),g),delete q[a]}catch(a){console.error("[usageLimiter] resetKeyUsage failed:",a.message)}return{tokensCleared:Math.round(f),costCleared:g}}function n(a){if(!o)return[];let b=j();if(!b)return[];try{return b.getResetHistory.all(a)}catch(a){return console.error("[usageLimiter] getResetHistory failed:",a.message),[]}}global._usageLimiterTimer||(global._usageLimiterTimer=null),d()}catch(a){d(a)}},1)},49120:(a,b,c)=>{"use strict";c.r(b),c.d(b,{DATA_DIR:()=>m,getDataDir:()=>l});var d=c(73024),e=c.n(d),f=c(33873),g=c.n(f),h=c(21820),i=c.n(h);let j="9router";function k(){return"win32"===process.platform?g().join(process.env.APPDATA||g().join(i().homedir(),"AppData","Roaming"),j):g().join(i().homedir(),`.${j}`)}function l(){let a=process.env.DATA_DIR;if(!a)return k();if("win32"===process.platform&&/^\//.test(a))return console.warn(`[DATA_DIR] '${a}' is a Unix path on Windows → fallback to default`),k();try{return e().mkdirSync(a,{recursive:!0}),a}catch(b){if(b?.code==="EACCES"||b?.code==="EPERM")return console.warn(`[DATA_DIR] '${a}' not writable → fallback ~/.${j}`),k();throw b}}let m=l()},78335:()=>{},89718:(a,b,c)=>{"use strict";c.d(b,{CG:()=>d.CG,Dj:()=>d.Dj,Iq:()=>d.Iq,K1:()=>d.K1,KJ:()=>d.KJ,L:()=>d.L,L9:()=>d.L9,Lh:()=>d.Lh,Mc:()=>d.Mc,OM:()=>d.OM,Pc:()=>d.Pc,Q_:()=>d.Q_,Qu:()=>d.Qu,S8:()=>d.S8,Uv:()=>d.Uv,VT:()=>d.VT,XW:()=>d.XW,Xx:()=>d.Xx,Yd:()=>d.Yd,ZO:()=>d.ZO,bI:()=>d.bI,c:()=>d.c,ek:()=>d.ek,fK:()=>d.fK,fv:()=>d.fv,getApiKeys:()=>d.PX,getProviderConnections:()=>d.P,getProviderNodes:()=>d.Fh,ho:()=>d.ho,hr:()=>d.hr,i0:()=>d.i0,iE:()=>d.iE,jd:()=>d.jd,mt:()=>d.mt,o5:()=>d.o5,oG:()=>d.oG,op:()=>d.op,r4:()=>d.r4,sE:()=>e,uL:()=>d.uL,ui:()=>d.ui,updateProviderConnection:()=>d.rj,uv:()=>d.uv,yF:()=>d.yF,yg:()=>d.yg,zP:()=>d.zP});var d=c(9248);async function e(a,b){if(!a||"object"!=typeof a||Array.isArray(a))throw Error("Invalid database payload");if(!b||"object"!=typeof b||Array.isArray(b))throw Error("Invalid import modes");let c={...await (0,d.zP)()};for(let d of["providerConnections","providerNodes"]){let e=b[d]||"skip";if("skip"===e)continue;let f=Array.isArray(a[d])?a[d]:[];if("overwrite"===e&&(c[d]=f),"merge"===e){let a=new Map,b=[];for(let e of Array.isArray(c[d])?c[d]:[])e?.id!=null?a.set(e.id,e):b.push(e);for(let c of f)c?.id!=null?a.set(c.id,c):b.push(c);c[d]=[...a.values(),...b]}}for(let d of["proxyPools","customModels","combos","apiKeys"])"overwrite"===(b[d]||"skip")&&Array.isArray(a[d])&&(c[d]=a[d]);for(let d of["modelAliases","mitmAlias","pricing","settings"])"overwrite"===(b[d]||"skip")&&a[d]&&"object"==typeof a[d]&&!Array.isArray(a[d])&&(c[d]=a[d]);return(0,d.K1)(c)}},96487:()=>{}};