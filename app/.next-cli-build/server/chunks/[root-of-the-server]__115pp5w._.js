module.exports=[951615,(e,t,r)=>{t.exports=e.x("node:buffer",()=>require("node:buffer"))},912714,(e,t,r)=>{t.exports=e.x("node:fs/promises",()=>require("node:fs/promises"))},812057,(e,t,r)=>{t.exports=e.x("node:util",()=>require("node:util"))},857764,(e,t,r)=>{t.exports=e.x("node:url",()=>require("node:url"))},574207,e=>{"use strict";var t=e.i(254799);function r(e=32){return t.default.randomBytes(e).toString("base64url")}function a(e){return t.default.createHash("sha256").update(e).digest("base64url")}function n(){return t.default.randomBytes(32).toString("base64url")}e.s(["generateCodeChallenge",0,a,"generateCodeVerifier",0,r,"generatePKCE",0,function(e=32){let t=r(e),o=a(t);return{codeVerifier:t,codeChallenge:o,state:n()}},"generateState",0,n])},472385,e=>{"use strict";var t=e.i(132636);let r=t.PROVIDERS.xai?.clientId,a="https://auth.x.ai",n="/oauth2/authorize",o="/oauth2/token",s="/.well-known/openid-configuration",i="/callback",c={clientId:r,issuer:a,authEndpointPath:n,tokenEndpointPath:o,discoveryPath:s,authorizeUrl:`${a}${n}`,tokenUrl:`${a}${o}`,discoveryUrl:`${a}${s}`,scope:"openid profile email offline_access grok-cli:access api:access",apiBaseUrl:"https://api.x.ai/v1",redirectUri:`http://127.0.0.1:56121${i}`,loopbackPort:56121,callbackPath:i,pkceVerifierBytes:96,refreshLeadSeconds:300,userAgent:"grok-cli/9router",codeChallengeMethod:"S256"};e.s(["XAI_CONFIG",0,c,"XAI_PKCE_VERIFIER_BYTES",0,96])},874533,(e,t,r)=>{t.exports=e.x("node:child_process",()=>require("node:child_process"))},660526,(e,t,r)=>{t.exports=e.x("node:os",()=>require("node:os"))},792509,(e,t,r)=>{t.exports=e.x("url",()=>require("url"))},921517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},59639,(e,t,r)=>{t.exports=e.x("node:process",()=>require("node:process"))},509656,(e,t,r)=>{t.exports=e.x("node:tty",()=>require("node:tty"))},481474,e=>{"use strict";var t=e.i(921517),r=e.i(792509),a=e.i(385063);let n=null,o=null,s=a.CODEX_CONFIG.fixedPort,i=new Map;function c(e,t){let r=e?"Authentication Successful":"Authentication Failed",a=String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");return`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${r}</title>
<style>body{font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f5f5f5}.c{text-align:center;padding:2rem;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1)}.i{color:${e?"#22c55e":"#ef4444"};font-size:3rem}h1{margin:1rem 0}p{color:#666}</style>
</head><body><div class="c"><div class="i">${e?"&#10003;":"&#10007;"}</div><h1>${r}</h1><p>${a}</p><p>Closing in <span id="cd">3</span>s...</p>
<script>let n=3;const c=document.getElementById("cd");const t=setInterval(()=>{n--;c.textContent=n;if(n<=0){clearInterval(t);window.close();}},1000);</script>
</div></body></html>`}function l(){o&&(clearTimeout(o),o=null),n&&(n.close(),n=null)}let u=null,d=null,h=new Map;function p(){d&&(clearTimeout(d),d=null),u&&(u.close(),u=null)}e.s(["clearCodexSession",0,function(e){i.delete(e)},"clearXaiSession",0,function(e){h.delete(e)},"getCodexSessionStatus",0,function(e){return i.get(e)||null},"getXaiSessionStatus",0,function(e){return h.get(e)||null},"registerCodexSession",0,function({state:e,codeVerifier:t,redirectUri:r}){return!!e&&!!t&&!!r&&(i.set(e,{codeVerifier:t,redirectUri:r,status:"pending",createdAt:Date.now()}),!0)},"registerXaiSession",0,function({state:e,codeVerifier:t,redirectUri:r}){return!!e&&!!t&&!!r&&(h.set(e,{codeVerifier:t,redirectUri:r,status:"pending",createdAt:Date.now()}),!0)},"startCodexProxy",0,function(a){return new Promise(u=>{if(n)return void u({success:!0});let d=t.default.createServer(async(t,n)=>{let o=new r.URL(t.url,"http://localhost");if("/callback"!==o.pathname&&"/auth/callback"!==o.pathname){n.writeHead(404),n.end("Not found");return}let s=o.searchParams.get("code"),u=o.searchParams.get("state"),d=o.searchParams.get("error"),h=u?i.get(u):null;if(h){try{if(d)throw Error(o.searchParams.get("error_description")||d);if(!s)throw Error("No authorization code received");let{exchangeTokens:t}=await e.A(633998),{createProviderConnection:r}=await e.A(52307),a=await t("codex",s,h.redirectUri,h.codeVerifier,u),i=await r({provider:"codex",authType:"oauth",...a,expiresAt:a.expiresIn?new Date(Date.now()+1e3*a.expiresIn).toISOString():null,testStatus:"active"});h.status="done",h.connectionId=i.id,h.email=i.email,n.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),n.end(c(!0,"You can close this window."))}catch(e){h.status="error",h.error=e.message,n.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),n.end(c(!1,e.message))}finally{l()}return}let p=`http://localhost:${a}/callback${o.search}`;n.writeHead(302,{Location:p}),n.end(),l()});d.listen(s,"127.0.0.1",()=>{n=d,o=setTimeout(()=>l(),3e5),u({success:!0})}),d.on("error",e=>{"EADDRINUSE"===e.code?u({success:!1,reason:"port_busy"}):u({success:!1,reason:e.message})})})},"startLocalServer",0,function(e,a=null){return new Promise((n,o)=>{let s=t.default.createServer((t,a)=>{let n=new r.URL(t.url,"http://localhost");if("/callback"===n.pathname||"/auth/callback"===n.pathname){let t=Object.fromEntries(n.searchParams);a.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),a.end(`<!DOCTYPE html>
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
</html>`),e(t)}else a.writeHead(404),a.end("Not found")});s.listen(a||0,"127.0.0.1",()=>{let{port:e}=s.address();n({server:s,port:e,close:()=>s.close()})}),s.on("error",e=>{"EADDRINUSE"===e.code&&a?o(Error(`Port ${a} is already in use. Please close other applications using this port.`)):o(e)})})},"startXaiProxy",0,function(a){return new Promise(n=>{if(u)return void n({success:!0});let o=t.default.createServer(async(t,n)=>{let o=new r.URL(t.url,"http://localhost");if("/callback"!==o.pathname&&"/auth/callback"!==o.pathname){n.writeHead(404),n.end("Not found");return}let s=o.searchParams.get("code"),i=o.searchParams.get("state"),l=o.searchParams.get("error"),u=i?h.get(i):null;if(u){try{if(l)throw Error(o.searchParams.get("error_description")||l);if(!s)throw Error("No authorization code received");let{exchangeTokens:t}=await e.A(633998),{createProviderConnection:r}=await e.A(52307),a=await t("xai",s,u.redirectUri,u.codeVerifier,i),d=await r({provider:"xai",authType:"oauth",...a,expiresAt:a.expiresIn?new Date(Date.now()+1e3*a.expiresIn).toISOString():null,testStatus:"active"});u.status="done",u.connectionId=d.id,u.email=d.email,n.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),n.end(c(!0,"You can close this window."))}catch(e){u.status="error",u.error=e.message,n.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}),n.end(c(!1,e.message))}finally{p()}return}let d=`http://localhost:${a}/callback${o.search}`;n.writeHead(302,{Location:d}),n.end(),p()});o.listen(56121,"127.0.0.1",()=>{u=o,d=setTimeout(()=>p(),3e5),n({success:!0})}),o.on("error",e=>{"EADDRINUSE"===e.code?n({success:!1,reason:"port_busy"}):n({success:!1,reason:e.message})})})},"stopCodexProxy",0,l,"stopXaiProxy",0,p])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__115pp5w._.js.map