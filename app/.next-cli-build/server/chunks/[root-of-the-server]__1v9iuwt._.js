module.exports=[254799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},574207,e=>{"use strict";var t=e.i(254799);function r(e=32){return t.default.randomBytes(e).toString("base64url")}function a(e){return t.default.createHash("sha256").update(e).digest("base64url")}function n(){return t.default.randomBytes(32).toString("base64url")}e.s(["generateCodeChallenge",0,a,"generateCodeVerifier",0,r,"generatePKCE",0,function(e=32){let t=r(e),s=a(t);return{codeVerifier:t,codeChallenge:s,state:n()}},"generateState",0,n])},472385,e=>{"use strict";var t=e.i(132636);let r=t.PROVIDERS.xai?.clientId,a="https://auth.x.ai",n="/oauth2/authorize",s="/oauth2/token",o="/.well-known/openid-configuration",i="/callback",c={clientId:r,issuer:a,authEndpointPath:n,tokenEndpointPath:s,discoveryPath:o,authorizeUrl:`${a}${n}`,tokenUrl:`${a}${s}`,discoveryUrl:`${a}${o}`,scope:"openid profile email offline_access grok-cli:access api:access",apiBaseUrl:"https://api.x.ai/v1",redirectUri:`http://127.0.0.1:56121${i}`,loopbackPort:56121,callbackPath:i,pkceVerifierBytes:96,refreshLeadSeconds:300,userAgent:"grok-cli/9router",codeChallengeMethod:"S256"};e.s(["XAI_CONFIG",0,c,"XAI_PKCE_VERIFIER_BYTES",0,96])},874533,(e,t,r)=>{t.exports=e.x("node:child_process",()=>require("node:child_process"))},660526,(e,t,r)=>{t.exports=e.x("node:os",()=>require("node:os"))},792509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},921517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},59639,(e,t,r)=>{t.exports=e.x("node:process",()=>require("node:process"))},509656,(e,t,r)=>{t.exports=e.x("node:tty",()=>require("node:tty"))},481474,e=>{"use strict";var t=e.i(921517),r=e.i(792509),a=e.i(385063);let n=null,s=null,o=a.CODEX_CONFIG.fixedPort,i=new Map;function c(e,t){let r=e?"Authentication Successful":"Authentication Failed",a=String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${r}</title>
<style>body{font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f5f5f5}.c{text-align:center;padding:2rem;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1)}.i{color:${e?"#22c55e":"#ef4444"};font-size:3rem}h1{margin:1rem 0}p{color:#666}</style>
</head><body><div class="c"><div class="i">${e?"&#10003;":"&#10007;"}</div><h1>${r}</h1><p>${a}</p><p>Closing in <span id="cd">3</span>s...</p>
<script>let n=3;const c=document.getElementById("cd");const t=setInterval(()=>{n--;c.textContent=n;if(n<=0){clearInterval(t);window.close();}},1000);</script>
</div></body></html>`}function l(){s&&(clearTimeout(s),s=null),n&&(n.close(),n=null)}let u=null,d=null,h=new Map;function p(){d&&(clearTimeout(d),d=null),u&&(u.close(),u=null)}e.s(["clearCodexSession",0,function(e){i.delete(e)},"clearXaiSession",0,function(e){h.delete(e)},"getCodexSessionStatus",0,function(e){return i.get(e)||null},"getXaiSessionStatus",0,function(e){return h.get(e)||null},"registerCodexSession",0,function({state:e,codeVerifier:t,redirectUri:r}){return!!e&&!!t&&!!r&&(i.set(e,{codeVerifier:t,redirectUri:r,status:"pending",createdAt:Date.now()}),!0)},"registerXaiSession",0,function({state:e,codeVerifier:t,redirectUri:r}){return!!e&&!!t&&!!r&&(h.set(e,{codeVerifier:t,redirectUri:r,status:"pending",createdAt:Date.now()}),!0)},"startCodexProxy",0,function(a){return new Promise(u=>{if(n)return void u({success:!0});let d=t.default.createServer(async(t,n)=>{let s=new r.URL(t.url,"http://localhost");if("/callback"!==s.pathname&&"/auth/callback"!==s.pathname){n.writeHead(404),n.end("Not found");return}let o=s.searchParams.get("code"),u=s.searchParams.get("state"),d=s.searchParams.get("error"),h=u?i.get(u):null;if(h){try{if(d)throw Error(s.searchParams.get("error_description")||d);if(!o)throw Error("No authorization code received");let{exchangeTokens:t}=await e.A(633998),{createProviderConnection:r}=await e.A(52307),a=await t("codex",o,h.redirectUri,h.codeVerifier,u),i=await r({provider:"codex",authType:"oauth",...a,expiresAt:a.expiresIn?new Date(Date.now()+1e3*a.expiresIn).toISOString():null,testStatus:"active"});h.status="done",h.connectionId=i.id,h.email=i.email,n.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),n.end(c(!0,"You can close this window."))}catch(e){h.status="error",h.error=e.message,n.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),n.end(c(!1,e.message))}finally{l()}return}let p=`http://localhost:${a}/callback${s.search}`;n.writeHead(302,{Location:p}),n.end(),l()});d.listen(o,"127.0.0.1",()=>{n=d,s=setTimeout(()=>l(),3e5),u({success:!0})}),d.on("error",e=>{"EADDRINUSE"===e.code?u({success:!1,reason:"port_busy"}):u({success:!1,reason:e.message})})})},"startLocalServer",0,function(e,a=null){return new Promise((n,s)=>{let o=t.default.createServer((t,a)=>{let n=new r.URL(t.url,"http://localhost");if("/callback"===n.pathname||"/auth/callback"===n.pathname){let t=Object.fromEntries(n.searchParams);a.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),a.end(`<!DOCTYPE html>
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
</html>`),e(t)}else a.writeHead(404),a.end("Not found")});o.listen(a||0,"127.0.0.1",()=>{let{port:e}=o.address();n({server:o,port:e,close:()=>o.close()})}),o.on("error",e=>{"EADDRINUSE"===e.code&&a?s(Error(`Port ${a} is already in use. Please close other applications using this port.`)):s(e)})})},"startXaiProxy",0,function(a){return new Promise(n=>{if(u)return void n({success:!0});let s=t.default.createServer(async(t,n)=>{let s=new r.URL(t.url,"http://localhost");if("/callback"!==s.pathname&&"/auth/callback"!==s.pathname){n.writeHead(404),n.end("Not found");return}let o=s.searchParams.get("code"),i=s.searchParams.get("state"),l=s.searchParams.get("error"),u=i?h.get(i):null;if(u){try{if(l)throw Error(s.searchParams.get("error_description")||l);if(!o)throw Error("No authorization code received");let{exchangeTokens:t}=await e.A(633998),{createProviderConnection:r}=await e.A(52307),a=await t("xai",o,u.redirectUri,u.codeVerifier,i),d=await r({provider:"xai",authType:"oauth",...a,expiresAt:a.expiresIn?new Date(Date.now()+1e3*a.expiresIn).toISOString():null,testStatus:"active"});u.status="done",u.connectionId=d.id,u.email=d.email,n.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),n.end(c(!0,"You can close this window."))}catch(e){u.status="error",u.error=e.message,n.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),n.end(c(!1,e.message))}finally{p()}return}let d=`http://localhost:${a}/callback${s.search}`;n.writeHead(302,{Location:d}),n.end(),p()});s.listen(56121,"127.0.0.1",()=>{u=s,d=setTimeout(()=>p(),3e5),n({success:!0})}),s.on("error",e=>{"EADDRINUSE"===e.code?n({success:!1,reason:"port_busy"}):n({success:!1,reason:e.message})})})},"stopCodexProxy",0,l,"stopXaiProxy",0,p])},52307,e=>{e.v(t=>Promise.all(["server/chunks/src_models_index_1ip7g0d.js"].map(t=>e.l(t))).then(()=>t(756862)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1v9iuwt._.js.map