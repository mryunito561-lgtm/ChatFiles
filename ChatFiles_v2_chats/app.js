const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const state={chat:"global", logged:false, messages:{global:[]}};
const chatData={
 global:{title:"Chat global",icon:"🌐",status:"Solo usuarios registrados y conectados"},
 friends:{title:"Chat de amigos",icon:"👥",status:"Solo tus amigos aceptados"},
 private:{title:"Chats privados",icon:"🔒",status:"Conversaciones 1 a 1"},
 groups:{title:"Chats de grupo",icon:"👨‍👩‍👧",status:"Conversaciones con varios usuarios"}
};
const toast=$("#toast");
function showToast(t){toast.textContent=t;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200)}
function enterApp(){state.logged=true;$("#auth-screen").classList.add("hidden");$("#app").classList.remove("hidden");renderChatList()}
function renderChatList(){
 const box=$("#chat-items"); box.innerHTML="";
 if(state.chat==="global"){box.innerHTML='<div class="chat-item active"><div class="item-icon">🌐</div><div><strong>Chat global</strong><small>Todos los usuarios conectados</small></div></div>'}
 else if(state.chat==="friends"){box.innerHTML='<div class="empty-list">No hay amigos registrados todavía.</div>'}
 else if(state.chat==="private"){box.innerHTML='<div class="empty-list">No tienes conversaciones privadas todavía.</div>'}
 else {box.innerHTML='<div class="empty-list">Todavía no perteneces a ningún grupo.</div>'}
}
function selectChat(type){
 state.chat=type; $$(".chat-tab").forEach(b=>b.classList.toggle("active",b.dataset.chat===type));
 const d=chatData[type];$("#chat-icon").textContent=d.icon;$("#chat-title").textContent=d.title;$("#chat-status").textContent=d.status;
 renderChatList(); renderMessages();
}
function renderMessages(){
 const box=$("#messages"); box.innerHTML='<div class="system-message">'+(state.chat==="global"?"🌐 Solo usuarios que hayan iniciado sesión pueden participar.":"🔒 Esta conversación solo será visible para los usuarios autorizados.")+'</div>';
 const msgs=state.messages[state.chat]||[];
 if(!msgs.length) box.innerHTML+='<div class="empty-chat">Todavía no hay mensajes. ¡Sé el primero en escribir!</div>';
 msgs.forEach(x=>{const m=document.createElement("div");m.className="message me";m.textContent=x.text;const meta=document.createElement("span");meta.className="meta";meta.textContent="Tú · Ahora";m.appendChild(meta);box.appendChild(m)});
 box.scrollTop=box.scrollHeight;
}
$$(".chat-tab").forEach(b=>b.addEventListener("click",()=>selectChat(b.dataset.chat)));
$$(".nav-btn").forEach(b=>b.addEventListener("click",()=>{
 const v=b.dataset.view; $$(".view").forEach(x=>x.classList.add("hidden"));$("#"+v+"-view").classList.remove("hidden");
 $$(".nav-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");
 const titles={chat:"Chats",friends:"Amigos",files:"Archivos",profile:"Mi perfil",settings:"Ajustes"};
 const subs={chat:"Solo usuarios con sesión iniciada pueden participar.",friends:"Añade y gestiona tus amigos.",files:"Tus archivos y sus permisos.",profile:"Personaliza tu identidad.",settings:"Administra tu cuenta y privacidad."};
 $("#page-title").textContent=titles[v];$("#page-subtitle").textContent=subs[v];$("#top-action").style.display=v==="chat"?"block":"none";
}));
$("#message-form").addEventListener("submit",e=>{e.preventDefault();const input=$("#message-input"),text=input.value.trim();if(!text)return;if(!state.logged){showToast("Debes iniciar sesión");return}state.messages[state.chat]??=[];state.messages[state.chat].push({text});input.value="";renderMessages()});
$("#login-form").addEventListener("submit",e=>{e.preventDefault();const email=$("#login-email").value.trim();if(!email)return;$("#otp-email").textContent=email;$("#otp-modal").classList.remove("hidden")});
$("#verify-btn").onclick=()=>{if($("#otp-code").value==="123456"){ $("#otp-modal").classList.add("hidden");enterApp();showToast("Sesión iniciada correctamente")}else showToast("Código incorrecto. Demo: 123456")};
$("#cancel-otp").onclick=()=>$("#otp-modal").classList.add("hidden");
$("#register-btn").onclick=()=>showToast("El registro real se conectará al backend");
$("#logout").onclick=()=>{state.logged=false;$("#app").classList.add("hidden");$("#auth-screen").classList.remove("hidden");showToast("Sesión cerrada")};
$("#top-action").onclick=()=>showToast("Elige Privado o Grupos para crear una conversación");
$("#add-friend").onclick=()=>showToast("Busca usuarios registrados por @nombre de usuario");
$("#attach-btn").onclick=()=>$("#hidden-file-input").click();
$("#hidden-file-input").onchange=()=>{if($("#hidden-file-input").files[0])showToast("Archivo listo para adjuntar")};
$("#file-input").onchange=e=>[...e.target.files].forEach(addFile);
const dz=$("#dropzone");dz.onclick=()=>$("#file-input").click();dz.ondragover=e=>e.preventDefault();dz.ondrop=e=>{e.preventDefault();[...e.dataTransfer.files].forEach(addFile)};
function addFile(file){const grid=$("#file-grid"),card=document.createElement("article");card.className="file-card";const ext=(file.name.split(".").pop()||"FILE").toUpperCase().slice(0,4);card.innerHTML=`<div class="file-icon">${ext}</div><div class="file-info"><strong>${escapeHtml(file.name)}</strong><small>${(file.size/1024/1024).toFixed(2)} MB · Ahora</small></div><span class="privacy private">🔒 Privado</span><div class="file-actions"><button class="share">Compartir</button><button>⋯</button></div>`;grid.prepend(card);card.querySelector(".share").onclick=async()=>{const url=location.href.split("#")[0]+"?file="+encodeURIComponent(file.name);try{await navigator.clipboard.writeText(url);showToast("Enlace copiado")}catch{showToast(url)}};showToast("Archivo añadido a la demo")}
function escapeHtml(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
$$(".share").forEach(b=>b.onclick=async()=>{const name=b.closest(".file-card").querySelector("strong").textContent;const url=location.href.split("#")[0]+"?file="+encodeURIComponent(name);try{await navigator.clipboard.writeText(url);showToast("Enlace copiado")}catch{showToast(url)}});
$("#edit-profile").onclick=()=>{$("#profile-modal").classList.remove("hidden")};
$("#close-profile").onclick=()=>$("#profile-modal").classList.add("hidden");
$("#save-profile").onclick=()=>{const n=$("#modal-name").value,u=$("#modal-user").value,b=$("#modal-bio").value;$("#profile-name").textContent=n;$("#profile-user").textContent="@"+u;$("#profile-bio").textContent=b;$("#side-name").textContent=n;$("#side-user").textContent="@"+u;$("#profile-modal").classList.add("hidden");showToast("Perfil actualizado")};
$("#save-settings").onclick=()=>{const n=$("#settings-name").value,u=$("#settings-user").value;$("#side-name").textContent=n;$("#side-user").textContent="@"+u;$("#profile-name").textContent=n;$("#profile-user").textContent="@"+u;showToast("Ajustes guardados")};
renderMessages();
