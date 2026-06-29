module.exports=[874533,(e,t,r)=>{t.exports=e.x("node:child_process",()=>require("node:child_process"))},660526,(e,t,r)=>{t.exports=e.x("node:os",()=>require("node:os"))},792509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},921517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},59639,(e,t,r)=>{t.exports=e.x("node:process",()=>require("node:process"))},509656,(e,t,r)=>{t.exports=e.x("node:tty",()=>require("node:tty"))},481474,e=>{"use strict";var t=e.i(921517),r=e.i(792509),n=e.i(385063);let s=null,a=null,o=n.CODEX_CONFIG.fixedPort,i=new Map;function c(e,t){let r=e?"Authentication Successful":"Authentication Failed",n=String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${r}</title>
<style>body{font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f5f5f5}.c{text-align:center;padding:2rem;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1)}.i{color:${e?"#22c55e":"#ef4444"};font-size:3rem}h1{margin:1rem 0}p{color:#666}</style>
</head><body><div class="c"><div class="i">${e?"&#10003;":"&#10007;"}</div><h1>${r}</h1><p>${n}</p><p>Closing in <span id="cd">3</span>s...</p>
<script>let n=3;const c=document.getElementById("cd");const t=setInterval(()=>{n--;c.textContent=n;if(n<=0){clearInterval(t);window.close();}},1000);</script>
</div></body></html>`}function l(){a&&(clearTimeout(a),a=null),s&&(s.close(),s=null)}let u=null,d=null,h=new Map;function p(){d&&(clearTimeout(d),d=null),u&&(u.close(),u=null)}e.s(["clearCodexSession",0,function(e){i.delete(e)},"clearXaiSession",0,function(e){h.delete(e)},"getCodexSessionStatus",0,function(e){return i.get(e)||null},"getXaiSessionStatus",0,function(e){return h.get(e)||null},"registerCodexSession",0,function({state:e,codeVerifier:t,redirectUri:r}){return!!e&&!!t&&!!r&&(i.set(e,{codeVerifier:t,redirectUri:r,status:"pending",createdAt:Date.now()}),!0)},"registerXaiSession",0,function({state:e,codeVerifier:t,redirectUri:r}){return!!e&&!!t&&!!r&&(h.set(e,{codeVerifier:t,redirectUri:r,status:"pending",createdAt:Date.now()}),!0)},"startCodexProxy",0,function(n){return new Promise(u=>{if(s)return void u({success:!0});let d=t.default.createServer(async(t,s)=>{let a=new r.URL(t.url,"http://localhost");if("/callback"!==a.pathname&&"/auth/callback"!==a.pathname){s.writeHead(404),s.end("Not found");return}let o=a.searchParams.get("code"),u=a.searchParams.get("state"),d=a.searchParams.get("error"),h=u?i.get(u):null;if(h){try{if(d)throw Error(a.searchParams.get("error_description")||d);if(!o)throw Error("No authorization code received");let{exchangeTokens:t}=await e.A(633998),{createProviderConnection:r}=await e.A(52307),n=await t("codex",o,h.redirectUri,h.codeVerifier,u),i=await r({provider:"codex",authType:"oauth",...n,expiresAt:n.expiresIn?new Date(Date.now()+1e3*n.expiresIn).toISOString():null,testStatus:"active"});h.status="done",h.connectionId=i.id,h.email=i.email,s.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),s.end(c(!0,"You can close this window."))}catch(e){h.status="error",h.error=e.message,s.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),s.end(c(!1,e.message))}finally{l()}return}let p=`http://localhost:${n}/callback${a.search}`;s.writeHead(302,{Location:p}),s.end(),l()});d.listen(o,"127.0.0.1",()=>{s=d,a=setTimeout(()=>l(),3e5),u({success:!0})}),d.on("error",e=>{"EADDRINUSE"===e.code?u({success:!1,reason:"port_busy"}):u({success:!1,reason:e.message})})})},"startLocalServer",0,function(e,n=null){return new Promise((s,a)=>{let o=t.default.createServer((t,n)=>{let s=new r.URL(t.url,"http://localhost");if("/callback"===s.pathname||"/auth/callback"===s.pathname){let t=Object.fromEntries(s.searchParams);n.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),n.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authentication Successful</title>
  <style>
    body { font-family: system-ui; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
    .container { text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .success { color: #22c55e; font-size: 3rem; }
    h1 { margin: 1rem 0; }
    p { color: #666; }
    #countdown { font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="success">&#10003;</div>
    <h1>Authentication Successful</h1>
    <p id="message">Closing in <span id="countdown">3</span> seconds...</p>
  </div>
  <script>
    let count = 3;
    const countdown = document.getElementById("countdown");
    const message = document.getElementById("message");
    const timer = setInterval(() => {
      count--;
      countdown.textContent = count;
      if (count <= 0) {
        clearInterval(timer);
        window.close();
        setTimeout(() => {
          message.textContent = "Please close this tab manually.";
        }, 500);
      }
    }, 1000);
  </script>
</body>
</html>`),e(t)}else n.writeHead(404),n.end("Not found")});o.listen(n||0,"127.0.0.1",()=>{let{port:e}=o.address();s({server:o,port:e,close:()=>o.close()})}),o.on("error",e=>{"EADDRINUSE"===e.code&&n?a(Error(`Port ${n} is already in use. Please close other applications using this port.`)):a(e)})})},"startXaiProxy",0,function(n){return new Promise(s=>{if(u)return void s({success:!0});let a=t.default.createServer(async(t,s)=>{let a=new r.URL(t.url,"http://localhost");if("/callback"!==a.pathname&&"/auth/callback"!==a.pathname){s.writeHead(404),s.end("Not found");return}let o=a.searchParams.get("code"),i=a.searchParams.get("state"),l=a.searchParams.get("error"),u=i?h.get(i):null;if(u){try{if(l)throw Error(a.searchParams.get("error_description")||l);if(!o)throw Error("No authorization code received");let{exchangeTokens:t}=await e.A(633998),{createProviderConnection:r}=await e.A(52307),n=await t("xai",o,u.redirectUri,u.codeVerifier,i),d=await r({provider:"xai",authType:"oauth",...n,expiresAt:n.expiresIn?new Date(Date.now()+1e3*n.expiresIn).toISOString():null,testStatus:"active"});u.status="done",u.connectionId=d.id,u.email=d.email,s.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),s.end(c(!0,"You can close this window."))}catch(e){u.status="error",u.error=e.message,s.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),s.end(c(!1,e.message))}finally{p()}return}let d=`http://localhost:${n}/callback${a.search}`;s.writeHead(302,{Location:d}),s.end(),p()});a.listen(56121,"127.0.0.1",()=>{u=a,d=setTimeout(()=>p(),3e5),s({success:!0})}),a.on("error",e=>{"EADDRINUSE"===e.code?s({success:!1,reason:"port_busy"}):s({success:!1,reason:e.message})})})},"stopCodexProxy",0,l,"stopXaiProxy",0,p])},52307,e=>{e.v(t=>Promise.all(["server/chunks/src_models_index_1ip7g0d.js"].map(t=>e.l(t))).then(()=>t(756862)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__03zh-n0._.js.map