window.addEventListener('error',e=>{const t=document.getElementById('toast');if(t){t.textContent='Ошибка: '+(e.message||'—');t.classList.add('show','err');setTimeout(()=>t.classList.remove('show','err'),5000)}console.error(e)});
window.addEventListener('unhandledrejection',e=>{const t=document.getElementById('toast');if(t){t.textContent='Ошибка: '+(e.reason?.message||e.reason||'—');t.classList.add('show','err');setTimeout(()=>t.classList.remove('show','err'),5000)}console.error(e.reason)});

const SB_URL='https://aglyhueqgvteztgrhwcc.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbHlodWVxZ3Z0ZXp0Z3Jod2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NDk0NTIsImV4cCI6MjEwNzEyNTQ1Mn0.suTTSI3CpqhI1YLVGEJ7UTSfah8f9aMcSkO-GOUn8vY';
const sb=window.supabase.createClient(SB_URL,SB_KEY);

const ICE=[
{urls:'stun:stun.l.google.com:19302'},
{urls:'stun:stun1.l.google.com:19302'},
{urls:'turn:openrelay.metered.ca:80',username:'openrelayproject',credential:'openrelayproject'},
{urls:'turn:openrelay.metered.ca:443',username:'openrelayproject',credential:'openrelayproject'}
];
const AUDIO_CONSTRAINTS={audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,sampleRate:48000,channelCount:1}};
const VIDEO_CONSTRAINTS={audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,sampleRate:48000,channelCount:1},video:{width:{ideal:640},height:{ideal:480},facingMode:'user'}};
const EMOJIS=['😀','😎','🐱','🐶','🦊','🐼','🚀','🌟','🎮','🎧','🍕','⚡','🔥','🌈','🐍','🦖','🦄','👾','🤖','👻'];
const SESS='mess_v14_sess';
const BOT='00000000-0000-0000-0000-000000000001';
const DOCS={
privacy:{title:'Конфиденциальность',html:`<p>Дата: 1 января 2026.</p><h3>1. Данные</h3><p>Номер, имя, фамилия, дата рождения, аватар, фото лица. Только для работы сервиса и проверки возраста.</p><h3>2. Использование</h3><p>Номер — для поиска контактов. Имя — для модерации. Другим виден только ник.</p><h3>3. Сообщения</h3><p>Защищены сквозным шифрованием (в разработке).</p><h3>4. Права</h3><p>Удаление аккаунта в любой момент в настройках.</p><h3>5. Возраст</h3><p>Сервис с 13 лет. Для 13–17 действует родительский контроль.</p>`},
terms:{title:'Пользование',html:`<p>Дата: 1 января 2026.</p><h3>1. Правила</h3><p>Используя сервис, вы соглашаетесь с правилами.</p><h3>2. Запрещено</h3><p>— Оскорбления;<br>— Спам;<br>— Запрещённый контент;<br>— Выдача за других;<br>— Травля.</p><h3>3. Модерация</h3><p>Блокируем по жалобам.</p><h3>4. Возраст</h3><p>С 13 лет.</p>`}
};

let me=null,mp=null,allP=[],chats=[],msgs={},stories=[],contacts=[];
let chatId=null,peer=null,tab='chats';
let pAv={type:'emoji',value:'😀'},eAv={type:'emoji',value:'😀'},avT='reg';
let subM=null,subC=null,subI=null,subK=null,subP=null;
let replyTo=null,lastNotifId=null;
let isRec=false,recorder=null,recChunks=[],recStream=null,recCtx=null,recAn=null,recWave=[],recInt=null,recTmr=null,recSec=0,liveWaveInt=null;
let cirRec=null,cirStream=null,cirChunks=[],cirInt=null,cirSec=0;
let pc=null,ls=null,callCh=null,cPeer=null,cTmr=null,cSec=0,isMuted=false,isVid=false,isScr=false,scrStream=null;
let pendOffer=null,pendFrom=null,fakeMode=false;
let avatarImg=null,avOff={x:0,y:0},avScale=1,avDrag=false,avStart={x:0,y:0};
let recognition=null,dictOn=false,bannerUserId=null;
let faceStream=null,facePhoto=null,regData=null;
let parentType=null,currentChatType='regular',pollOptions=[],selectedMembers=[];

const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const avH=a=>{if(!a)return'?';if(typeof a==='string')return a;if(a.type==='image')return`<img src="${a.value}">`;return a.value||'?'};
const fmt=t=>new Date(t).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
const fSec=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
const uuid=()=>crypto.randomUUID?crypto.randomUUID():'u'+Date.now()+Math.random().toString(36).slice(2,10);
const normPh=p=>{let d=String(p||'').replace(/\D/g,'');if(d.length===11&&d[0]==='8')d='7'+d.slice(1);if(d.length===10)d='7'+d;return d};
function toast(t,err){const e=document.getElementById('toast');e.textContent=t;e.classList.add('show');if(err)e.classList.add('err');setTimeout(()=>e.classList.remove('show','err'),2500)}
function showSc(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));const el=document.getElementById(id);if(el)el.classList.add('active')}
function openM(id){document.getElementById(id).classList.add('show')}
function closeM(id){document.getElementById(id).classList.remove('show')}
async function hashPassword(password,salt){const enc=new TextEncoder();const data=enc.encode(password+salt);const hash=await crypto.subtle.digest('SHA-256',data);return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('')}
function genSalt(){return Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b=>b.toString(16).padStart(2,'0')).join('')}
let nickCheckTimer=null;
function checkNickHint(){
clearTimeout(nickCheckTimer);
const nick=document.getElementById('r-nick').value.trim();
const hint=document.getElementById('nick-hint');
if(!nick){hint.textContent='';return}
if(nick.length<3){hint.textContent='Минимум 3 символа';hint.style.color='var(--danger)';return}
if(!/^[a-zA-Z0-9_]+$/.test(nick)){hint.textContent='Только латиница, цифры, _';hint.style.color='var(--danger)';return}
hint.textContent='Проверяем...';hint.style.color='var(--text2)';
nickCheckTimer=setTimeout(async()=>{
try{
const {data}=await sb.from('profiles').select('id').eq('nick',nick).maybeSingle();
if(data){const suggest=nick+'_'+Math.floor(1000+Math.random()*9000);hint.innerHTML=`Ник занят. Свободен: <b onclick="applyNick('${suggest}')" style="cursor:pointer;text-decoration:underline">${suggest}</b>`;hint.style.color='var(--danger)'}
else{hint.textContent='✓ Свободен';hint.style.color='var(--accent)'}
}catch(e){hint.textContent=''}
},400)}
function applyNick(nick){document.getElementById('r-nick').value=nick;checkNickHint()}

async function checkMedia(type){
if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){toast('Не поддерживается',true);return null}
if(location.protocol!=='https:'&&location.hostname!=='localhost'){toast('Нужен HTTPS',true);return null}
try{const c=type==='video'?VIDEO_CONSTRAINTS:AUDIO_CONSTRAINTS;return await navigator.mediaDevices.getUserMedia(c)}
catch(err){
if(err.name==='NotAllowedError')toast('Запрещён доступ. Разрешите в настройках',true);
else if(err.name==='NotFoundError')toast('Микрофон/камера не найдены',true);
else if(err.name==='NotReadableError')toast('Устройство занято',true);
else toast('Ошибка: '+err.message,true);
return null}}

function openEmojiPick(t){avT=t;const cur=t==='reg'?pAv:eAv;document.getElementById('emoji-grid').innerHTML=EMOJIS.map(e=>`<div class="emoji-item ${cur.value===e?'sel':''}" onclick="pickEmoji('${e}')">${e}</div>`).join('');openM('m-emoji')}
function pickEmoji(e){if(avT==='reg'){pAv={type:'emoji',value:e};document.getElementById('r-av').textContent=e}else{eAv={type:'emoji',value:e};document.getElementById('e-av').textContent=e}closeM('m-emoji')}
function triggerAvatar(t){avT=t;const i=document.getElementById('f-avatar');i.value='';i.click()}
document.getElementById('f-avatar').addEventListener('change',e=>{
const f=e.target.files[0];if(!f)return;
if(!f.type.startsWith('image/'))return toast('Не изображение');
if(f.size>5*1024*1024)return toast('Файл > 5 МБ');
const r=new FileReader();
r.onload=ev=>{const img=new Image();img.onload=()=>{avatarImg=img;avScale=1;avOff={x:0,y:0};document.getElementById('avatar-zoom').value=1;drawAv();openM('m-avatar');setupDrag()};img.onerror=()=>toast('Не читается');img.src=ev.target.result};
r.readAsDataURL(f)});
function drawAv(){const c=document.getElementById('avatar-canvas'),ctx=c.getContext('2d');c.width=240;c.height=240;ctx.fillStyle='#000';ctx.fillRect(0,0,240,240);if(!avatarImg)return;const base=Math.max(240/avatarImg.width,240/avatarImg.height);const s=base*avScale;const w=avatarImg.width*s;const h=avatarImg.height*s;ctx.drawImage(avatarImg,(240-w)/2+avOff.x,(240-h)/2+avOff.y,w,h)}
function setupDrag(){
const ed=document.getElementById('avatar-editor');
if(ed.dataset.s)return;ed.dataset.s='1';
const start=e=>{avDrag=true;const p=e.touches?e.touches[0]:e;avStart={x:p.clientX-avOff.x,y:p.clientY-avOff.y}};
const move=e=>{if(!avDrag)return;e.preventDefault();const p=e.touches?e.touches[0]:e;avOff.x=p.clientX-avStart.x;avOff.y=p.clientY-avStart.y;drawAv()};
const end=()=>avDrag=false;
ed.addEventListener('mousedown',start);ed.addEventListener('touchstart',start,{passive:true});
document.addEventListener('mousemove',move);document.addEventListener('touchmove',move,{passive:false});
document.addEventListener('mouseup',end);document.addEventListener('touchend',end);
document.getElementById('avatar-zoom').addEventListener('input',e=>{avScale=parseFloat(e.target.value);drawAv()})}
function applyAvatarCrop(){const c=document.getElementById('avatar-canvas');const out=document.createElement('canvas');out.width=200;out.height=200;out.getContext('2d').drawImage(c,0,0,240,240,0,0,200,200);const d=out.toDataURL('image/jpeg',.85);if(avT==='reg'){pAv={type:'image',value:d};document.getElementById('r-av').innerHTML=`<img src="${d}">`}else{eAv={type:'image',value:d};document.getElementById('e-av').innerHTML=`<img src="${d}">`}closeM('m-avatar');avatarImg=null}
function cancelAvatarEditor(){closeM('m-avatar');avatarImg=null}

function switchAuth(m){
document.getElementById('tab-reg').classList.toggle('active',m==='reg');
document.getElementById('tab-log').classList.toggle('active',m==='log');
document.getElementById('form-reg').style.display=m==='reg'?'block':'none';
document.getElementById('form-log').style.display=m==='log'?'block':'none';
document.getElementById('auth-title').textContent=m==='reg'?'Регистрация':'Вход';
document.getElementById('auth-sub').textContent=m==='reg'?'Заполните данные. После проверки вы получите доступ.':'Введите номер и пароль.'}

async function register(){
const phone=normPh(document.getElementById('r-phone').value);
const first=document.getElementById('r-first').value.trim();
const last=document.getElementById('r-last').value.trim();
const birth=document.getElementById('r-birth').value;
const nick=document.getElementById('r-nick').value.trim();
const pass=document.getElementById('r-pass').value;
const err=document.getElementById('r-err');
const btn=document.getElementById('btn-reg');
err.textContent='';
if(phone.length!==11)return err.textContent='Номер: 11 цифр';
if(!first||!last)return err.textContent='Имя и фамилия';
if(!birth)return err.textContent='Дата рождения';
if(!nick||nick.length<3)return err.textContent='Ник минимум 3 символа';
if(!/^[a-zA-Z0-9_]+$/.test(nick))return err.textContent='Только латиница';
if(pass.length<6)return err.textContent='Пароль минимум 6 символов';
const age=Math.floor((Date.now()-new Date(birth))/(365.25*864e5));
if(age<13)return err.textContent='С 13 лет';
if(age>100)return err.textContent='Проверьте дату рождения';
btn.disabled=true;btn.textContent='Проверяем...';
try{
const {data:ex}=await sb.from('profiles').select('id').eq('phone',phone).maybeSingle();
if(ex)throw new Error('Номер занят');
const {data:nx}=await sb.from('profiles').select('id').eq('nick',nick).maybeSingle();
if(nx)throw new Error('Ник занят');
regData={phone,first,last,birth,nick,pass,age};
btn.disabled=false;btn.textContent='Продолжить →';
await startFaceCapture();
}catch(e){err.textContent=e.message||'Ошибка';btn.disabled=false;btn.textContent='Продолжить →'}}

async function startFaceCapture(){
try{faceStream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:640,facingMode:'user'}});document.getElementById('face-video').srcObject=faceStream;showSc('sc-face')}
catch(e){toast('Нужен доступ к камере',true)}}
function cancelFace(){if(faceStream){faceStream.getTracks().forEach(t=>t.stop());faceStream=null}showSc('sc-auth')}
function captureFace(){
const video=document.getElementById('face-video');
const canvas=document.createElement('canvas');
canvas.width=400;canvas.height=400;
const ctx=canvas.getContext('2d');
const vw=video.videoWidth,vh=video.videoHeight;
const size=Math.min(vw,vh);
const sx=(vw-size)/2,sy=(vh-size)/2;
ctx.drawImage(video,sx,sy,size,size,0,0,400,400);
facePhoto=canvas.toDataURL('image/jpeg',0.7);
if(faceStream){faceStream.getTracks().forEach(t=>t.stop());faceStream=null}
finishRegistration()}

async function finishRegistration(){
const {phone,first,last,birth,nick,pass,age}=regData;
try{
const salt=genSalt();
const hash=await hashPassword(pass,salt);
const trusted=pass.toUpperCase().endsWith('-NT');
const id=uuid();
const {error}=await sb.from('profiles').insert({id,phone,nick,first_name:first,last_name:last,birth_date:birth,avatar:pAv,password_hash:hash,password_salt:salt,verification_photo:facePhoto,status:'pending',is_admin:false,trusted,parent_status:'none'});
if(error)throw error;
localStorage.setItem(SESS,id);
me=id;mp={id,phone,nick,first_name:first,last_name:last,birth_date:birth,avatar:pAv,bio:'',status:'pending',trusted,parent_status:'none'};
showSc('sc-wait');
if(age>=13&&age<18){setTimeout(()=>openM('m-parent'),300)}
}catch(e){toast('Ошибка: '+e.message,true);showSc('sc-auth')}}

function pickParentType(t){parentType=t;
document.getElementById('par-mom').classList.toggle('active',t==='mom');
document.getElementById('par-dad').classList.toggle('active',t==='dad');
document.getElementById('par-mom').style.background=t==='mom'?'var(--accent)':'';
document.getElementById('par-mom').style.color=t==='mom'?'#fff':'';
document.getElementById('par-dad').style.background=t==='dad'?'var(--accent)':'';
document.getElementById('par-dad').style.color=t==='dad'?'#fff':''}

async function saveParent(){
const ph=normPh(document.getElementById('parent-phone').value);
if(ph.length!==11)return toast('Введите номер родителя');
if(!parentType)return toast('Выберите: мама или папа');
await sb.from('profiles').update({parent_phone:ph,parent_type:parentType,parent_status:'waiting'}).eq('id',me);
mp.parent_phone=ph;mp.parent_type=parentType;mp.parent_status='waiting';
closeM('m-parent');toast('Заявка отправлена')}

async function checkStatus(){
const {data}=await sb.from('profiles').select('*').eq('id',me).maybeSingle();
if(!data)return toast('Аккаунт удалён');
if(isBanned(data)){showBannedScreen(data);return}
if(data.status==='approved'){mp=data;await loadAll();subRT();subIn();subParent();showSc('sc-main');switchTab('chats')}
else if(data.status==='rejected'){document.getElementById('wait-icon').textContent='❌';document.getElementById('wait-title').textContent='Заявка отклонена';document.getElementById('wait-status').textContent='❌ Отклонено';document.getElementById('wait-status').className='status rejected'}
else{toast('Ещё на проверке')}}

function isBanned(u){if(!u.banned_until)return false;return new Date(u.banned_until).getTime()>Date.now()}
function showBannedScreen(u){
const until=new Date(u.banned_until);
const isForever=until.getFullYear()>2900;
showSc('sc-wait');
document.getElementById('wait-icon').textContent='🚫';
document.getElementById('wait-title').textContent='Вы забанены';
const text=isForever?'Навсегда. Обратитесь к администратору.':`До ${until.toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'})}`;
document.getElementById('wait-text').textContent=text;
document.getElementById('wait-status').textContent='🚫 '+(u.ban_reason||'Нарушение правил');
document.getElementById('wait-status').className='status banned'}

async function login(){
const phone=normPh(document.getElementById('l-phone').value);
const pass=document.getElementById('l-pass').value;
const err=document.getElementById('l-err');
const btn=document.getElementById('btn-log');
err.textContent='';
if(phone.length!==11)return err.textContent='Номер: 11 цифр';
if(!pass)return err.textContent='Введите пароль';
btn.disabled=true;btn.textContent='Проверяем...';
try{
const {data,error}=await sb.from('profiles').select('*').eq('phone',phone).maybeSingle();
if(error)throw error;
if(!data)throw new Error('Аккаунт не найден');
if(!data.password_hash)throw new Error('У аккаунта нет пароля');
const hash=await hashPassword(pass,data.password_salt||'');
if(hash!==data.password_hash)throw new Error('Неверный пароль');
localStorage.setItem(SESS,data.id);
me=data.id;mp=data;
if(isBanned(data)){showBannedScreen(data);return}
if(data.status==='pending'){showSc('sc-wait');return}
if(data.status==='rejected'){document.getElementById('wait-icon').textContent='❌';document.getElementById('wait-title').textContent='Заявка отклонена';document.getElementById('wait-status').textContent='❌ Отклонено';document.getElementById('wait-status').className='status rejected';showSc('sc-wait');return}
await loadAll();subRT();subIn();subParent();
showSc('sc-main');switchTab('chats');
setTimeout(()=>{if('Notification' in window&&Notification.permission==='default')openM('m-notif')},2000);
}catch(e){err.textContent=e.message||'Ошибка';btn.disabled=false;btn.textContent='Войти'}}

async function loadAll(){
const {data:p}=await sb.from('profiles').select('*');allP=p||[];
const {data:c}=await sb.from('chats').select('*').contains('members',[me]);chats=c||[];
const {data:k}=await sb.from('contacts').select('*').eq('owner_id',me);contacts=k||[];
msgs={};
for(const ch of chats){const {data:m}=await sb.from('messages').select('*').eq('chat_id',ch.id).neq('kind','story').neq('kind','story_video').order('created_at');msgs[ch.id]=m||[]}
const {data:st}=await sb.from('messages').select('*').in('kind',['story','story_video']).gt('created_at',new Date(Date.now()-24*3600*1000).toISOString()).order('created_at',{ascending:false});stories=st||[]}

async function refreshAll(){await loadAll();if(chatId){await loadM(chatId);renderM();renderBanner()}renderMain();toast('Обновлено')}
function getContact(uid){return contacts.find(c=>c.contact_id===uid)}
function isBlocked(uid){const c=getContact(uid);return c&&c.blocked}
function displayName(u){if(!u)return'?';const c=getContact(u.id);if(c&&c.custom_name)return c.custom_name;return '@'+u.nick}

function subRT(){
if(subM)sb.removeChannel(subM);if(subC)sb.removeChannel(subC);if(subK)sb.removeChannel(subK);
subM=sb.channel('m-'+me).on('postgres_changes',{event:'*',schema:'public',table:'messages'},async p=>{
const m=p.new||p.old;
if(p.eventType==='INSERT'){
if(m.kind==='story'||m.kind==='story_video'){await loadAll();if(tab==='chats')renderMain();return}
if(m.sender_id===me)return;
if(isBlocked(m.sender_id))return;
if(!msgs[m.chat_id])msgs[m.chat_id]=[];
if(!msgs[m.chat_id].find(x=>x.id===m.id))msgs[m.chat_id].push(m);
if(chatId===m.chat_id)renderM();else if(tab==='chats')renderMain();
showNotif(m)
}else if(p.eventType==='UPDATE'){
if(msgs[m.chat_id]){const i=msgs[m.chat_id].findIndex(x=>x.id===m.id);if(i>=0)msgs[m.chat_id][i]=m;if(chatId===m.chat_id)renderM()}
}else if(p.eventType==='DELETE'){
for(const cid in msgs)msgs[cid]=msgs[cid].filter(x=>x.id!==m.id);
if(chatId)renderM()}}).subscribe();
subC=sb.channel('c-'+me).on('postgres_changes',{event:'*',schema:'public',table:'chats'},async()=>{const {data}=await sb.from('chats').select('*').contains('members',[me]);chats=data||[];if(tab==='chats')renderMain()}).subscribe();
subK=sb.channel('k-'+me).on('postgres_changes',{event:'*',schema:'public',table:'contacts'},async()=>{const {data}=await sb.from('contacts').select('*').eq('owner_id',me);contacts=data||[];if(chatId)renderBanner();if(tab==='chats'||tab==='contacts')renderMain()}).subscribe()}

function subParent(){
if(subP)sb.removeChannel(subP);
subP=sb.channel('parent-'+me).on('postgres_changes',{event:'UPDATE',schema:'public',table:'profiles',filter:'id=eq.'+me},async p=>{
const u=p.new;
if(u.status!==mp.status||isBanned(u)){
mp=u;
if(isBanned(u)){showBannedScreen(u);return}
if(u.status==='approved'){await loadAll();subRT();subIn();showSc('sc-main');switchTab('chats');toast('✅ Заявка одобрена!')}
else if(u.status==='rejected'){document.getElementById('wait-icon').textContent='❌';document.getElementById('wait-title').textContent='Заявка отклонена';document.getElementById('wait-status').textContent='❌ Отклонено';document.getElementById('wait-status').className='status rejected'}
}}).subscribe()}

function showNotif(m){
if(!('Notification' in window))return;
if(Notification.permission!=='granted')return;
if(document.visibilityState==='visible'&&chatId===m.chat_id)return;
if(lastNotifId===m.id)return;lastNotifId=m.id;
const sender=allP.find(u=>u.id===m.sender_id);
const name=displayName(sender);
let body='Новое сообщение';
if(m.kind==='text')body=m.content?.slice(0,80)||'Текст';
else if(m.kind==='audio')body='🎤 Голосовое';
else if(m.kind==='photo')body='📷 Фото';
else if(m.kind==='circle')body='⭕ Кружок';
try{const n=new Notification('mess-мессенджер · '+name,{body,icon:'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%230d5c3a%22/><text y=%22.9em%22 font-size=%2290%22>🐍</text></svg>',tag:'msg-'+m.chat_id});n.onclick=()=>{window.focus();if(m.chat_id!==chatId)openChat(m.chat_id);n.close()}}catch(e){}}

function allowNotif(){if(!('Notification' in window)){toast('Не поддерживается');closeM('m-notif');return}Notification.requestPermission().then(p=>{if(p==='granted')toast('Уведомления включены');closeM('m-notif')})}

function switchTab(t){tab=t;document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.t===t));const titles={chats:'Чаты',contacts:'Контакты',profile:'Профиль',settings:'Ещё'};document.getElementById('main-title').textContent=titles[t];renderMain()}

function renderMain(){
const c=document.getElementById('main-content');
try{
if(tab==='chats')c.innerHTML=rChats();
else if(tab==='contacts')c.innerHTML=rCont();
else if(tab==='profile')c.innerHTML=rProf();
else if(tab==='settings')c.innerHTML=rSet();
}catch(e){c.innerHTML=`<div class="empty"><div class="ico">⚠️</div>${esc(e.message)}</div>`;console.error(e)}}

function peerOf(ch){return allP.find(u=>u.id===ch.members.find(m=>m!==me))}

function rChats(){
const visible=chats.filter(c=>{const o=peerOf(c);return o&&!isBlocked(o.id)});
if(!visible.length)return`<div class="empty"><div class="ico">💬</div>Нет чатов.<br><span style="font-size:12px">Найди друга в Контактах.</span></div>`;
return[...visible].sort((a,b)=>{const la=(msgs[a.id]||[]).slice(-1)[0];const lb=(msgs[b.id]||[]).slice(-1)[0];return new Date(lb?.created_at||0)-new Date(la?.created_at||0)}).map(c=>{
const o=peerOf(c);const nm=displayName(o);
const av=o?.avatar||{type:'emoji',value:'👥'};
const last=(msgs[c.id]||[]).slice(-1)[0];
const txt=!last?'Нет сообщений':(last.kind==='text'?esc(last.content||'').slice(0,40):last.kind==='photo'?'📷 Фото':last.kind==='audio'?'🎤 Голосовое':last.kind==='circle'?'⭕ Кружок':'—');
const isNew=!getContact(o.id);
return`<div class="chat-item" onclick="openChat('${c.id}')"><div class="avatar">${avH(av)}</div><div class="chat-info"><div class="name">${esc(nm)}${isNew?' <span style="font-size:11px;color:var(--accent)">новый</span>':''}</div><div class="last">${txt}</div></div></div>`}).join('')}

function rCont(){
const myContacts=contacts.filter(c=>!c.blocked);
const o=allP.filter(u=>u.id!==me&&!isBlocked(u.id)&&u.status==='approved');
const added=o.filter(u=>getContact(u.id));
return`<button class="btn" onclick="openM('m-add')">+ Найти по номеру</button>
<div class="section-title">Мои контакты (${myContacts.length})</div>
${added.length?added.map(u=>`<div class="chat-item" onclick="openChatWith('${u.id}')"><div class="avatar">${avH(u.avatar)}</div><div class="chat-info"><div class="name">${esc(displayName(u))}</div><div class="last">@${esc(u.nick)}</div></div></div>`).join(''):'<div class="empty" style="padding:20px;font-size:13px">Пока никого.</div>'}
<div class="section-title">Все пользователи (${o.length})</div>
${o.map(u=>{const isC=getContact(u.id);return`<div class="chat-item" onclick="openChatWith('${u.id}')"><div class="avatar">${avH(u.avatar)}</div><div class="chat-info"><div class="name">${esc(displayName(u))}${u.id===BOT?' 🤖':''}</div><div class="last">${isC?'В контактах':'Не в контактах'}</div></div></div>`}).join('')}`}

function rProf(){
const age=mp.birth_date?Math.floor((Date.now()-new Date(mp.birth_date))/(365.25*864e5)):0;
const isMinor=age>=13&&age<18;
const pStat=mp.parent_status;
return`<div style="display:flex;flex-direction:column;align-items:center;padding:20px 0">
<div class="avatar xl">${avH(mp.avatar)}</div>
<div style="font-size:20px;font-weight:700;margin-top:12px">${esc(mp.first_name||'')} ${esc(mp.last_name||'')}</div>
<div style="font-size:14px;color:var(--text2);margin-top:4px">@${esc(mp.nick)}</div>
<div style="font-size:13px;color:var(--text2);margin-top:8px">${esc(mp.bio||'Нет описания')}</div>
${isMinor&&pStat==='approved'?'<div style="margin-top:12px;padding:6px 14px;background:rgba(66,133,244,.15);color:#4285f4;border-radius:12px;font-size:12px;font-weight:600">👨‍👦 Под родительским контролем</div>':''}
${isMinor&&pStat==='waiting'?'<div style="margin-top:12px;padding:6px 14px;background:rgba(255,149,0,.15);color:#ff9500;border-radius:12px;font-size:12px;font-weight:600">⏳ Ожидание родителя</div>':''}
</div>
<button class="btn" onclick="openEdit()">Редактировать профиль</button>
<div class="card-block" style="margin-top:14px">
<div class="card-row"><span class="label">Телефон</span><span class="value">+${esc(mp.phone)}</span></div>
<div class="card-row"><span class="label">Дата рождения</span><span class="value">${esc(mp.birth_date||'—')}</span></div>
${mp.parent_phone?`<div class="card-row"><span class="label">${mp.parent_type==='mom'?'👩 Мама':'👨 Папа'}</span><span class="value">+${esc(mp.parent_phone)}</span></div>`:''}
</div>`}

function rSet(){
const dk=document.body.classList.contains('dark');
const nperm=('Notification' in window)?Notification.permission:'default';
return`<div class="section-title">Внешний вид</div>
<div class="card-block"><div class="card-row" onclick="toggleDark()"><span class="label">Тёмная тема</span><span class="value">${dk?'Вкл':'Выкл'}</span></div></div>
<div class="section-title">Уведомления</div>
<div class="card-block"><div class="card-row" onclick="allowNotif2()"><span class="label">Разрешение уведомлений</span><span class="value">${nperm==='granted'?'Включено':nperm==='denied'?'Отклонено':'Не запрошено'}</span></div></div>
<div class="section-title">Приложение</div>
<div class="card-block"><div class="card-row" onclick="installPWA()"><span class="label">📱 Установить на телефон</span><span class="chev">›</span></div></div>
<div class="section-title">Документы</div>
<div class="card-block">
<div class="card-row" onclick="openDoc('privacy')"><span class="label">Правила конфиденциальности</span><span class="chev">›</span></div>
<div class="card-row" onclick="openDoc('terms')"><span class="label">Правила пользования</span><span class="chev">›</span></div>
</div>
<div class="section-title">Данные</div>
<div class="card-block"><div class="card-row" onclick="logout()"><span class="label">Выйти</span></div></div>
<div class="section-title">Опасная зона</div>
<div class="card-block"><div class="card-row danger" onclick="openM('m-del')"><span class="label">Удалить аккаунт</span></div></div>
<div style="text-align:center;font-size:11px;color:var(--text2);padding:20px 0">mess-мессенджер🐍 v14</div>`}

function allowNotif2(){if(!('Notification' in window))return toast('Не поддерживается');Notification.requestPermission().then(p=>{if(p==='granted')toast('Включено');else toast('Отклонено');if(tab==='settings')renderMain()})}
function toggleDark(){document.body.classList.toggle('dark');localStorage.setItem('mess_dark',document.body.classList.contains('dark')?'1':'0');if(tab==='settings')renderMain()}
if(localStorage.getItem('mess_dark')==='1')document.body.classList.add('dark');
function logout(){if(!confirm('Выйти?'))return;localStorage.removeItem(SESS);location.reload()}

function openEdit(){
document.getElementById('e-nick').value=mp.nick||'';
document.getElementById('e-bio').value=mp.bio||'';
eAv=mp.avatar?{...mp.avatar}:{type:'emoji',value:'😀'};
const ea=document.getElementById('e-av');
if(eAv.type==='image')ea.innerHTML=`<img src="${eAv.value}">`;else ea.textContent=eAv.value;
openM('m-edit')}
async function saveProfile(){
const n=document.getElementById('e-nick').value.trim();
if(!n)return toast('Ник пустой');
if(!/^[a-zA-Z0-9_]+$/.test(n))return toast('Только латиница');
const {data:ex}=await sb.from('profiles').select('id').eq('nick',n).neq('id',me).maybeSingle();
if(ex)return toast('Ник занят');
const {error}=await sb.from('profiles').update({nick:n,bio:document.getElementById('e-bio').value.trim(),avatar:eAv}).eq('id',me);
if(error)return toast('Ошибка');
mp.nick=n;mp.bio=document.getElementById('e-bio').value.trim();mp.avatar=eAv;
closeM('m-edit');await loadAll();renderMain();toast('Сохранено')}

async function findContact(){
const p=normPh(document.getElementById('find-phone').value);
if(p.length!==11)return toast('Введите 11 цифр');
try{
const {data,error}=await sb.from('profiles').select('*').eq('phone',p).maybeSingle();
if(error)throw error;
if(!data)throw new Error('Не найден');
if(data.id===me)throw new Error('Это ваш номер');
if(isBlocked(data.id))throw new Error('Пользователь заблокирован');
if(data.status!=='approved')throw new Error('Не активен');
closeM('m-add');document.getElementById('find-phone').value='';
toast('Найден: @'+data.nick);
await openChatWith(data.id);
}catch(e){toast(e.message||'Не найден')}}

async function openChatWith(uid){
let ch=chats.find(c=>c.members.includes(uid));
if(!ch){
const id=uuid();const members=[me,uid].sort();
const {data,error}=await sb.from('chats').insert({id,type:'private',chat_type:'regular',members}).select().single();
if(error){toast('Ошибка: '+error.message);return}
ch=data;chats.push(ch);msgs[ch.id]=[]}
await openChat(ch.id)}

async function openChat(id){
chatId=id;replyTo=null;
const c=chats.find(x=>x.id===id);
currentChatType=c.chat_type||c.type||'regular';
if(c.type==='group'||c.type==='channel'){peer=null;document.getElementById('chat-title').textContent=c.name||'Группа'}
else{peer=peerOf(c);document.getElementById('chat-title').textContent=displayName(peer)}
await loadM(id);renderM();renderBanner();showSc('sc-chat')}

async function loadM(id){
const {data}=await sb.from('messages').select('*').eq('chat_id',id).neq('kind','story').neq('kind','story_video').order('created_at');
msgs[id]=data||[]}

function closeChat(){chatId=null;peer=null;document.getElementById('attach-panel').classList.remove('show');document.getElementById('contact-banner').innerHTML='';showSc('sc-main');if(tab==='chats')renderMain()}

function renderBanner(){
const b=document.getElementById('contact-banner');
if(!peer||peer.id===BOT||currentChatType!=='regular'){b.innerHTML='';return}
const c=getContact(peer.id);
if(c&&!c.blocked){b.innerHTML='';return}
if(c&&c.blocked){b.innerHTML='';return}
bannerUserId=peer.id;
b.innerHTML=`<div class="contact-banner"><div class="info">Не в контактах</div><button class="add" onclick="addBannerContact()">✚ Добавить</button><button class="blk" onclick="blockBannerUser()">🚫</button></div>`}

function addBannerContact(){if(!bannerUserId)return;document.getElementById('name-input').value='';openM('m-name')}
async function saveName(){
const nm=document.getElementById('name-input').value.trim();
if(!nm)return toast('Введите имя');
const uid=bannerUserId;if(!uid)return;
const ex=getContact(uid);
if(ex)await sb.from('contacts').update({custom_name:nm,blocked:false}).eq('id',ex.id);
else await sb.from('contacts').insert({owner_id:me,contact_id:uid,custom_name:nm,blocked:false});
closeM('m-name');await loadAll();
if(peer&&peer.id===uid)document.getElementById('chat-title').textContent=nm;
renderBanner();toast('Контакт добавлен')}
async function blockBannerUser(){
const uid=bannerUserId;if(!uid)return;
if(!confirm('Заблокировать?'))return;
const ex=getContact(uid);
if(ex)await sb.from('contacts').update({blocked:true}).eq('id',ex.id);
else await sb.from('contacts').insert({owner_id:me,contact_id:uid,blocked:true});
await loadAll();toast('Заблокирован');closeChat()}

function renderM(){
const list=msgs[chatId]||[];
const c=document.getElementById('chat-msgs');
if(!list.length){c.innerHTML=`<div class="empty"><div class="ico">💬</div>Нет сообщений.</div>`;return}
c.innerHTML=list.map(m=>{
const mine=m.sender_id===me;
let body='';
if(m.kind==='text')body=esc(m.content||'').replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank" style="color:inherit">$1</a>');
else if(m.kind==='photo')body=`<img class="msg-media" src="${m.media}">`;
else if(m.kind==='audio')body=rVoice(m);
else if(m.kind==='circle')body=`<div class="msg-circle"><video autoplay loop muted playsinline src="${m.media}"></video></div>`;
else if(m.kind==='poll')body=rPoll(m);
let rep='';
if(m.reply_to){const o=list.find(x=>x.id===m.reply_to);if(o){const ou=allP.find(u=>u.id===o.sender_id);const pv=o.kind==='text'?esc(o.content||'').slice(0,40):o.kind==='photo'?'📷':o.kind==='audio'?'🎤':'⭕';rep=`<div class="msg-reply"><div class="author">${esc(displayName(ou))}</div><div class="preview">${pv}</div></div>`}}
const rea=m.reactions||{};
const rh=Object.keys(rea).length?`<div class="reactions">${Object.entries(rea).map(([e,us])=>`<span class="reaction ${us.includes(me)?'mine':''}" onclick="event.stopPropagation();tReaction('${m.id}','${e}')">${e} ${us.length>1?us.length:''}</span>`).join('')}</div>`:'';
return`<div class="msg-row ${mine?'me':''}"><div class="msg-bubble" onclick="openMM(event,'${m.id}')">${rep}${body}<div class="msg-time">${fmt(m.created_at)}</div>${rh}</div></div>`}).join('');
list.forEach(m=>{if(m.kind==='audio')attVoice(m)});
setTimeout(()=>{c.scrollTop=c.scrollHeight},30)}

function rVoice(m){
const w=m.wave||Array(40).fill(.3);
const bars=w.map(v=>`<div class="wave-bar" style="height:${Math.max(3,Math.round(v*26))}px"></div>`).join('');
return`<div class="voice-msg" data-v="${m.id}"><div class="voice-play">▶</div><div class="voice-body"><div class="waves">${bars}</div><div class="voice-time">${fSec(m.duration||0)}</div></div></div>`}

function rPoll(m){
let poll={};try{poll=JSON.parse(m.content||'{}')}catch(e){}
const total=Object.values(poll.votes||{}).reduce((s,v)=>s+v.length,0);
return`<div class="poll-card"><div class="poll-q">📊 ${esc(poll.question||'Опрос')}</div>
${(poll.options||[]).map((o,i)=>{const votes=(poll.votes&&poll.votes[i])||[];const pct=total?Math.round(votes.length/total*100):0;const voted=votes.includes(me);
return`<div class="poll-option ${voted?'voted':''}" onclick="event.stopPropagation();votePoll('${m.id}',${i})"><div class="bar" style="width:${pct}%"></div><div class="txt"><span>${esc(o)}</span><span>${pct}%</span></div></div>`}).join('')}
<div style="font-size:11px;color:var(--text2);margin-top:6px;text-align:right">Всего: ${total}</div></div>`}

const vP={};
function attVoice(m){
const wrap=document.querySelector(`[data-v="${m.id}"]`);
if(!wrap||vP[m.id])return;
const a=new Audio(m.media);
const p=wrap.querySelector('.voice-play');
const bars=[...wrap.querySelectorAll('.wave-bar')];
const t=wrap.querySelector('.voice-time');
vP[m.id]={a,bars};
p.onclick=e=>{e.stopPropagation();a.paused?a.play():a.pause()};
a.onplay=()=>p.textContent='⏸';a.onpause=()=>p.textContent='▶';
a.onended=()=>{p.textContent='▶';bars.forEach(b=>b.classList.remove('on'));a.currentTime=0};
a.ontimeupdate=()=>{const pr=a.currentTime/(a.duration||1);const n=Math.floor(pr*bars.length);bars.forEach((b,i)=>b.classList.toggle('on',i<n));t.textContent=fSec(Math.floor(a.currentTime))}}

function openMM(e,id){
e.stopPropagation();
const m=(msgs[chatId]||[]).find(x=>x.id===id);if(!m)return;
if(m.kind==='poll')return;
const mine=m.sender_id===me;
const menu=document.getElementById('msg-menu');
menu.innerHTML=`<div class="rbar">${['❤️','👍','😂','🔥','😮','😢'].map(e=>`<button onclick="tReaction('${id}','${e}');hideMM()">${e}</button>`).join('')}</div>
<div class="sep"></div>
<button onclick="startReply('${id}');hideMM()">↩️ Ответить</button>
<button onclick="copyMsg('${id}');hideMM()">📋 Копировать</button>
${mine?`<button onclick="editMsg('${id}');hideMM()">✏️ Изменить</button>`:''}
${mine?`<button class="danger" onclick="delMsg('${id}');hideMM()">🗑️ Удалить</button>`:`<button class="danger" onclick="toast('Жалоба отправлена');hideMM()">🚨 Жалоба</button>`}`;
const rect=e.target.closest('.msg-bubble').getBoundingClientRect();
const ph=document.getElementById('phone').getBoundingClientRect();
let x=rect.left-ph.left;let y=rect.bottom-ph.top+4;
if(x+180>ph.width)x=ph.width-180-8;if(x<8)x=8;
if(y+330>ph.height)y=rect.top-ph.top-330;
menu.style.left=x+'px';menu.style.top=y+'px';menu.classList.add('show')}
function hideMM(){document.getElementById('msg-menu').classList.remove('show')}
document.addEventListener('click',e=>{if(!e.target.closest('#msg-menu')&&!e.target.closest('.msg-bubble'))hideMM()});

async function tReaction(id,emo){
const m=(msgs[chatId]||[]).find(x=>x.id===id);if(!m)return;
const r={...(m.reactions||{})};
if(!r[emo])r[emo]=[];
const i=r[emo].indexOf(me);
if(i>=0)r[emo].splice(i,1);else r[emo].push(me);
if(!r[emo].length)delete r[emo];
await sb.from('messages').update({reactions:r}).eq('id',id);
m.reactions=r;renderM()}
function startReply(id){replyTo=id;document.getElementById('msg-input').focus();toast('Ответ')}
function copyMsg(id){const m=(msgs[chatId]||[]).find(x=>x.id===id);if(m.kind!=='text')return toast('Только текст');if(navigator.clipboard)navigator.clipboard.writeText(m.content).then(()=>toast('Скопировано')).catch(()=>toast('Ошибка'));else{const ta=document.createElement('textarea');ta.value=m.content;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);toast('Скопировано')}}
async function editMsg(id){const m=(msgs[chatId]||[]).find(x=>x.id===id);if(m.kind!=='text')return toast('Только текст');const nt=prompt('Изменить:',m.content);if(!nt||!nt.trim())return;await sb.from('messages').update({content:nt.trim()}).eq('id',id);m.content=nt.trim();renderM()}
async function delMsg(id){if(!confirm('Удалить?'))return;await sb.from('messages').delete().eq('id',id);msgs[chatId]=msgs[chatId].filter(x=>x.id!==id);renderM()}

async function votePoll(msgId,optIdx){
const m=(msgs[chatId]||[]).find(x=>x.id===msgId);if(!m)return;
let poll={};try{poll=JSON.parse(m.content||'{}')}catch(e){return}
if(!poll.votes)poll.votes={};
Object.keys(poll.votes).forEach(k=>{poll.votes[k]=poll.votes[k].filter(u=>u!==me)});
if(!poll.votes[optIdx])poll.votes[optIdx]=[];
poll.votes[optIdx].push(me);
const newContent=JSON.stringify(poll);
await sb.from('messages').update({content:newContent}).eq('id',msgId);
m.content=newContent;renderM()}

function updComposer(){const h=document.getElementById('msg-input').value.trim().length>0;const b=document.getElementById('composer-btn');if(!isRec)b.textContent=h?'➤':'🎤'}
function composerAction(){if(isRec){stopVoice(true);return}const h=document.getElementById('msg-input').value.trim().length>0;if(h)sendText();else startVoice()}

function toggleDict(){
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!SR)return toast('Не поддерживается',true);
if(dictOn){if(recognition){try{recognition.stop()}catch{}}dictOn=false;document.getElementById('dict-btn').classList.remove('on');return}
recognition=new SR();recognition.lang='ru-RU';recognition.continuous=true;recognition.interimResults=true;
let baseVal=document.getElementById('msg-input').value;
if(baseVal&&!baseVal.endsWith(' '))baseVal+=' ';
recognition.onresult=e=>{let txt='';for(let i=e.resultIndex;i<e.results.length;i++)txt+=e.results[i][0].transcript;document.getElementById('msg-input').value=baseVal+txt;updComposer()};
recognition.onerror=e=>{if(e.error==='not-allowed')toast('Разрешите микрофон',true);dictOn=false;document.getElementById('dict-btn').classList.remove('on')};
recognition.onend=()=>{if(dictOn){try{recognition.start()}catch{}}else document.getElementById('dict-btn').classList.remove('on')};
dictOn=true;document.getElementById('dict-btn').classList.add('on');
try{recognition.start()}catch{}
toast('Говорите — текст появится в поле')}

async function sendText(){
const inp=document.getElementById('msg-input');const t=inp.value.trim();
if(!t||!chatId)return;
inp.value='';updComposer();
const row={chat_id:chatId,sender_id:me,kind:'text',content:t};
if(replyTo){row.reply_to=replyTo;replyTo=null}
const {error}=await sb.from('messages').insert(row);
if(error){toast('Ошибка: '+error.message);return}
await loadM(chatId);renderM()}

function toggleAttach(){document.getElementById('attach-panel').classList.toggle('show')}
function pickPhoto(){
if(confirm('Сделать фото сейчас?\n\nOK — камера\nОтмена — галерея')){
document.getElementById('f-photo-cam').click()
}else{
document.getElementById('f-photo').click()
}}

async function handlePhotoUpload(file){
if(!file.type.startsWith('image/'))return toast('Не фото');
if(file.size>500*1024)return toast('Фото > 500 КБ');
const r=new FileReader();
r.onload=async ev=>{
const {error}=await sb.from('messages').insert({chat_id:chatId,sender_id:me,kind:'photo',media:ev.target.result});
if(error)return toast('Ошибка: '+error.message);
await loadM(chatId);renderM();
document.getElementById('attach-panel').classList.remove('show')};
r.readAsDataURL(file)}

document.getElementById('f-photo').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;handlePhotoUpload(f);e.target.value=''});
document.getElementById('f-photo-cam').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;handlePhotoUpload(f);e.target.value=''});

async function startVoice(){
const stream=await checkMedia('audio');
if(!stream)return;
recStream=stream;
recCtx=new (window.AudioContext||window.webkitAudioContext)();
const src=recCtx.createMediaStreamSource(recStream);
recAn=recCtx.createAnalyser();recAn.fftSize=512;src.connect(recAn);
const arr=new Uint8Array(recAn.frequencyBinCount);
recWave=[];recSec=0;
document.getElementById('msg-input').style.display='none';
document.getElementById('btn-attach').style.display='none';
document.getElementById('dict-btn').style.display='none';
document.getElementById('rec-composer').classList.add('show');
const lw=document.getElementById('live-waves');
lw.innerHTML='';
for(let i=0;i<30;i++){const b=document.createElement('div');b.className='lw';lw.appendChild(b)}
liveWaveInt=setInterval(()=>{
recAn.getByteFrequencyData(arr);
let sum=0;for(let i=0;i<arr.length;i++)sum+=arr[i];
const level=sum/arr.length/255;
recWave.push(level);
const bars=lw.querySelectorAll('.lw');
for(let i=0;i<bars.length-1;i++){bars[i].style.height=bars[i+1].style.height}
bars[bars.length-1].style.height=Math.max(3,Math.round(level*30))+'px';
},60);
recTmr=setInterval(()=>{recSec++;document.getElementById('rec-timer').textContent=fSec(recSec)},1000);
let mime='audio/webm;codecs=opus';
if(!MediaRecorder.isTypeSupported(mime))mime='audio/webm';
recorder=new MediaRecorder(recStream,{mimeType:mime,audioBitsPerSecond:128000});
recChunks=[];
recorder.ondataavailable=e=>{if(e.data.size>0)recChunks.push(e.data)};
recorder.onstop=async()=>{
if(!recChunks.length)return;
const blob=new Blob(recChunks,{type:mime});
const r=new FileReader();
r.onload=async ev=>{
if(ev.target.result.length>500000)return toast('Слишком большое');
const n=normWave(recWave,40);
const {error}=await sb.from('messages').insert({chat_id:chatId,sender_id:me,kind:'audio',media:ev.target.result,wave:n,duration:recSec});
if(error)return toast('Ошибка: '+error.message);
await loadM(chatId);renderM()};
r.readAsDataURL(blob)};
recorder.start();isRec=true;
document.getElementById('composer-btn').textContent='⬛';
document.getElementById('composer-btn').classList.add('rec')}

function stopVoice(send){
if(!isRec)return;isRec=false;
clearInterval(recInt);clearInterval(recTmr);clearInterval(liveWaveInt);
document.getElementById('rec-composer').classList.remove('show');
document.getElementById('msg-input').style.display='';
document.getElementById('btn-attach').style.display='';
document.getElementById('dict-btn').style.display='';
if(send){if(recorder&&recorder.state==='recording')recorder.stop()}
else{if(recorder){recorder.onstop=null;recorder.stop()}recChunks=[]}
if(recStream)recStream.getTracks().forEach(t=>t.stop());
if(recCtx)recCtx.close();
recStream=null;recCtx=null;recorder=null;
const b=document.getElementById('composer-btn');b.textContent='🎤';b.classList.remove('rec');updComposer()}
function cancelVoice(){stopVoice(false)}
function normWave(arr,n){
if(!arr.length)return Array(n).fill(.3);
const max=Math.max(...arr,0.1);const out=[];const st=arr.length/n;
for(let i=0;i<n;i++){let s=0;const a=Math.floor(i*st);const b=Math.floor((i+1)*st);for(let j=a;j<b;j++)s+=arr[j];out.push(Math.min(1,(s/Math.max(1,b-a))/max))}
return out}

async function startCircle(){
const stream=await checkMedia('video');
if(!stream)return;
cirStream=stream;
document.getElementById('circle-video').srcObject=cirStream;
cirChunks=[];cirSec=0;document.getElementById('circle-timer').textContent='0:00';
let mime='video/webm;codecs=vp8,opus';
if(!MediaRecorder.isTypeSupported(mime))mime='video/webm';
cirRec=new MediaRecorder(cirStream,{mimeType:mime,videoBitsPerSecond:150000,audioBitsPerSecond:32000});
cirRec.ondataavailable=e=>{if(e.data.size>0)cirChunks.push(e.data)};
cirRec.onstop=async()=>{
const blob=new Blob(cirChunks,{type:mime});
if(blob.size>500000){toast('Кружок слишком большой. Запишите короче.',true);if(cirStream)cirStream.getTracks().forEach(t=>t.stop());cirStream=null;return}
const r=new FileReader();
r.onload=async ev=>{
const {error}=await sb.from('messages').insert({chat_id:chatId,sender_id:me,kind:'circle',media:ev.target.result});
if(error)return toast('Ошибка: '+error.message);
await loadM(chatId);renderM()};
r.readAsDataURL(blob);
if(cirStream)cirStream.getTracks().forEach(t=>t.stop());
cirStream=null};
cirRec.start();openM('m-circle');
cirInt=setInterval(()=>{cirSec++;document.getElementById('circle-timer').textContent=fSec(cirSec);if(cirSec>=15)sendCircle()},1000)}
function sendCircle(){if(cirRec&&cirRec.state==='recording')cirRec.stop();if(cirInt){clearInterval(cirInt);cirInt=null}closeM('m-circle')}
function cancelCircle(){if(cirRec&&cirRec.state==='recording'){cirRec.onstop=null;cirRec.stop()}if(cirStream){cirStream.getTracks().forEach(t=>t.stop());cirStream=null}if(cirInt){clearInterval(cirInt);cirInt=null}closeM('m-circle')}

async function pickStory(){document.getElementById('f-story').click()}
document.getElementById('f-story').addEventListener('change',e=>{
const f=e.target.files[0];if(!f)return;
if(f.size>500*1024)return toast('Файл > 500 КБ');
const r=new FileReader();
r.onload=async ev=>{
const kind=f.type.startsWith('video')?'story_video':'story';
const {error}=await sb.from('messages').insert({chat_id:'00000000-0000-0000-0000-000000000000',sender_id:me,kind,media:ev.target.result});
if(error)return toast('Ошибка: '+error.message);
await loadAll();toast('История опубликована')};
r.readAsDataURL(f);e.target.value=''});

/* ОПРОСЫ */
function openPollCreator(){
pollOptions=['',''];
renderPollOptions();
document.getElementById('poll-q').value='';
openM('m-poll')}
function renderPollOptions(){
document.getElementById('poll-options').innerHTML=pollOptions.map((o,i)=>`<div class="poll-opt-row"><input type="text" value="${esc(o)}" placeholder="Вариант ${i+1}" oninput="pollOptions[${i}]=this.value">${pollOptions.length>2?`<button onclick="removePollOption(${i})">×</button>`:''}</div>`).join('')}
function addPollOption(){if(pollOptions.length>=6)return toast('Максимум 6');pollOptions.push('');renderPollOptions()}
function removePollOption(i){pollOptions.splice(i,1);renderPollOptions()}
async function createPoll(){
const q=document.getElementById('poll-q').value.trim();
if(!q)return toast('Введите вопрос');
const opts=pollOptions.filter(o=>o.trim());
if(opts.length<2)return toast('Минимум 2 варианта');
const poll={question:q,options:opts,votes:{}};
const {error}=await sb.from('messages').insert({chat_id:chatId,sender_id:me,kind:'poll',content:JSON.stringify(poll)});
if(error)return toast('Ошибка: '+error.message);
closeM('m-poll');await loadM(chatId);renderM()}

/* ГРУППЫ */
function openChatMenu(){openM('m-chatmenu')}
function openGroupMembers(){
if(!chatId)return;
const c=chats.find(x=>x.id===chatId);
if(!c)return;
const members=c.members||[];
const names=members.map(id=>{const u=allP.find(x=>x.id===id);return u?('@'+u.nick):'?'}).join(', ');
alert('Участники: '+names)}
function leaveOrDeleteChat(){
if(!chatId)return;
if(!confirm('Выйти из чата?'))return;
sb.from('chats').delete().eq('id',chatId).then(()=>{closeChat();toast('Удалено')})}

/* ЗВОНКИ */
async function startCall(type){
if(!peer)return toast('Нет собеседника');
if(peer.id===BOT)return fakeBotCall(type);
const stream=await checkMedia(type==='video'?'video':'audio');
if(!stream)return;
ls=stream;
if(type==='video'){document.getElementById('call-video-local').srcObject=ls;document.getElementById('call-video-local').style.display='block';isVid=true}
pc=new RTCPeerConnection({iceServers:ICE});
ls.getTracks().forEach(t=>pc.addTrack(t,ls));
pc.onicecandidate=e=>{if(e.candidate&&callCh)callCh.send({type:'broadcast',event:'signal',payload:{type:'ice',candidate:e.candidate,from:me,to:peer.id}})};
pc.ontrack=e=>{
const remote=e.streams[0];
const rv=document.getElementById('call-video-remote');
rv.srcObject=remote;rv.style.display='block';
let a=document.getElementById('remoteAudio');
if(!a){a=document.createElement('audio');a.id='remoteAudio';a.autoplay=true;document.body.appendChild(a)}
a.srcObject=remote;
document.getElementById('call-status').textContent='🔊 Разговор';
startTmr()};
pc.onconnectionstatechange=()=>{if(pc.connectionState==='connected')document.getElementById('call-status').textContent='🔊 Разговор';if(pc.connectionState==='failed'||pc.connectionState==='disconnected')endCall(true)};
callCh=sb.channel('call:'+[me,peer.id].sort().join(':'));
callCh.on('broadcast',{event:'signal'},async({payload})=>{
if(payload.to!==me)return;
if(payload.type==='answer'&&pc)await pc.setRemoteDescription(payload.sdp);
else if(payload.type==='ice'&&pc){try{await pc.addIceCandidate(payload.candidate)}catch{}}
else if(payload.type==='end')endCall(true)});
await callCh.subscribe();
const off=await pc.createOffer();await pc.setLocalDescription(off);
callCh.send({type:'broadcast',event:'signal',payload:{type:'offer',sdp:off,from:me,to:peer.id,callType:type}});
showCallUI(peer,'Звоним...',type)}

function showCallUI(p,status,type){
document.getElementById('call-who').textContent=displayName(p);
document.getElementById('call-status').textContent=status;
document.getElementById('call-av').innerHTML=avH(p.avatar);
document.getElementById('call-btns').innerHTML=`
<button class="call-btn" id="b-mute" onclick="tMute()">🎤</button>
<button class="call-btn" id="b-vid" onclick="tVideo()" style="display:${type==='video'?'flex':'none'}">📹</button>
<button class="call-btn" id="b-scr" onclick="tScreen()">🖥️</button>
<button class="call-btn" id="b-spk" onclick="tSpk()">🔊</button>
<button class="call-btn dgr" onclick="endCall()">✕</button>`;
document.getElementById('call-overlay').classList.add('show')}

function startTmr(){cSec=0;if(cTmr)clearInterval(cTmr);cTmr=setInterval(()=>{cSec++;document.getElementById('call-status').textContent='🔊 '+fSec(cSec)},1000)}
function tMute(){if(!ls)return;isMuted=!isMuted;ls.getAudioTracks().forEach(t=>t.enabled=!isMuted);document.getElementById('b-mute').classList.toggle('act',isMuted)}
function tVideo(){if(!ls)return;isVid=!isVid;ls.getVideoTracks().forEach(t=>t.enabled=isVid);const b=document.getElementById('b-vid');if(b)b.classList.toggle('act',!isVid);const v=document.getElementById('call-video-local');if(v)v.style.display=isVid?'block':'none'}
function tSpk(){const b=document.getElementById('b-spk');if(b)b.classList.toggle('act');const a=document.getElementById('remoteAudio');if(a)a.volume=a.volume===1?0.4:1}
async function tScreen(){
if(!pc)return;
if(!isScr){
try{scrStream=await navigator.mediaDevices.getDisplayMedia({video:true});
const tr=scrStream.getVideoTracks()[0];
const snd=pc.getSenders().find(s=>s.track&&s.track.kind==='video');
if(snd)await snd.replaceTrack(tr);else pc.addTrack(tr,scrStream);
tr.onended=()=>tScreen();
isScr=true;document.getElementById('b-scr').classList.add('act');toast('Демонстрация включена')}
catch(e){toast('Отменено')}}else{
if(scrStream){scrStream.getTracks().forEach(t=>t.stop());scrStream=null}
const vt=ls?ls.getVideoTracks()[0]:null;
if(vt){const snd=pc.getSenders().find(s=>s.track&&s.track.kind==='video');if(snd)await snd.replaceTrack(vt)}
isScr=false;document.getElementById('b-scr').classList.remove('act')}}

function endCall(remote){
if(pc){try{pc.close()}catch{}pc=null}
if(ls){ls.getTracks().forEach(t=>t.stop());ls=null}
if(scrStream){scrStream.getTracks().forEach(t=>t.stop());scrStream=null}
if(callCh&&!remote&&peer)callCh.send({type:'broadcast',event:'signal',payload:{type:'end',from:me,to:peer.id}}).catch(()=>{});
if(callCh){setTimeout(()=>{try{sb.removeChannel(callCh)}catch{}callCh=null},300)}
if(cTmr){clearInterval(cTmr);cTmr=null}
isMuted=false;isVid=false;isScr=false;fakeMode=false;
document.getElementById('call-overlay').classList.remove('show');
document.getElementById('call-video-local').style.display='none';
document.getElementById('call-video-remote').style.display='none';
const cc=document.getElementById('call-av');if(cc)cc.style.display='flex'}

function subIn(){
if(subI)sb.removeChannel(subI);
subI=sb.channel('in-'+me).on('broadcast',{event:'signal'},async({payload})=>{
if(payload.to!==me)return;
if(payload.type==='offer'){
if(isBlocked(payload.from))return;
pendOffer=payload.sdp;pendFrom=payload.from;
const caller=allP.find(u=>u.id===payload.from);
if(!caller)return;
peer=caller;
showIncoming(caller,payload.callType||'audio')}}).subscribe()}

function showIncoming(caller,type){
document.getElementById('call-who').textContent=displayName(caller);
document.getElementById('call-status').textContent='Входящий '+(type==='video'?'видео':'аудио');
document.getElementById('call-av').innerHTML=avH(caller.avatar);
document.getElementById('call-btns').innerHTML=`<button class="call-btn dgr" onclick="rejectCall()">✕</button><button class="call-btn ok" onclick="acceptCall('${type}')">✓</button>`;
document.getElementById('call-overlay').classList.add('show')}

async function acceptCall(type){
const stream=await checkMedia(type==='video'?'video':'audio');
if(!stream)return;
ls=stream;
if(type==='video'){document.getElementById('call-video-local').srcObject=ls;document.getElementById('call-video-local').style.display='block';isVid=true}
pc=new RTCPeerConnection({iceServers:ICE});
ls.getTracks().forEach(t=>pc.addTrack(t,ls));
pc.onicecandidate=e=>{if(e.candidate&&callCh)callCh.send({type:'broadcast',event:'signal',payload:{type:'ice',candidate:e.candidate,from:me,to:pendFrom}})};
pc.ontrack=e=>{
const remote=e.streams[0];
const rv=document.getElementById('call-video-remote');
rv.srcObject=remote;rv.style.display='block';
let a=document.getElementById('remoteAudio');
if(!a){a=document.createElement('audio');a.id='remoteAudio';a.autoplay=true;document.body.appendChild(a)}
a.srcObject=remote;
document.getElementById('call-status').textContent='🔊 Разговор';startTmr()};
callCh=sb.channel('call:'+[me,pendFrom].sort().join(':'));
callCh.on('broadcast',{event:'signal'},async({payload})=>{
if(payload.to!==me)return;
if(payload.type==='ice'&&pc){try{await pc.addIceCandidate(payload.candidate)}catch{}}
else if(payload.type==='end')endCall(true)});
await callCh.subscribe();
await pc.setRemoteDescription(pendOffer);
const ans=await pc.createAnswer();await pc.setLocalDescription(ans);
callCh.send({type:'broadcast',event:'signal',payload:{type:'answer',sdp:ans,from:me,to:pendFrom}});
document.getElementById('call-btns').innerHTML=`
<button class="call-btn" id="b-mute" onclick="tMute()">🎤</button>
<button class="call-btn" id="b-vid" onclick="tVideo()" style="display:${type==='video'?'flex':'none'}">📹</button>
<button class="call-btn" id="b-scr" onclick="tScreen()">🖥️</button>
<button class="call-btn" id="b-spk" onclick="tSpk()">🔊</button>
<button class="call-btn dgr" onclick="endCall()">✕</button>`;
pendOffer=null;pendFrom=null}

function rejectCall(){
if(callCh&&pendFrom)callCh.send({type:'broadcast',event:'signal',payload:{type:'end',from:me,to:pendFrom}}).catch(()=>{});
pendOffer=null;pendFrom=null;peer=null;
document.getElementById('call-overlay').classList.remove('show')}

async function fakeBotCall(type){
fakeMode=true;
document.getElementById('call-who').textContent='@demo_bot';
document.getElementById('call-status').textContent='Звоним...';
document.getElementById('call-av').innerHTML='🤖';
document.getElementById('call-btns').innerHTML=`
<button class="call-btn" id="b-mute" onclick="tMute()">🎤</button>
<button class="call-btn" id="b-vid" onclick="fakeVideo()">📹</button>
<button class="call-btn dgr" onclick="endCall()">✕</button>`;
document.getElementById('call-overlay').classList.add('show');
setTimeout(()=>{
if(!document.getElementById('call-overlay').classList.contains('show'))return;
document.getElementById('call-status').textContent='Соединение...';
setTimeout(()=>{
if(!document.getElementById('call-overlay').classList.contains('show'))return;
startTmr();
document.getElementById('call-status').textContent='🔊 '+fSec(0);
},1500)},3000)}

async function fakeVideo(){
if(!fakeMode)return;
if(!isVid){
const stream=await checkMedia('video');
if(!stream)return;
ls=stream;
document.getElementById('call-video-local').srcObject=ls;
document.getElementById('call-video-local').style.display='block';
isVid=true;
document.getElementById('b-vid').classList.add('act');
document.getElementById('call-av').style.display='none';
toast('Только вы видите камеру')}
else{
if(ls){ls.getTracks().forEach(t=>t.stop());ls=null}
document.getElementById('call-video-local').style.display='none';
isVid=false;
document.getElementById('b-vid').classList.remove('act');
document.getElementById('call-av').style.display='flex'}}

function openDoc(t){const d=DOCS[t];document.getElementById('doc-title').textContent=d.title;document.getElementById('doc-content').innerHTML=d.html;showSc('sc-doc')}
function closeDoc(){showSc('sc-main')}

let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e});
async function installPWA(){
if(deferredPrompt){deferredPrompt.prompt();const c=await deferredPrompt.userChoice;if(c.outcome==='accepted')toast('Установлено');deferredPrompt=null}
else{toast('Меню браузера → «Установить приложение»')}}

async function confirmDelete(){
closeM('m-del');
if(subM)sb.removeChannel(subM);if(subC)sb.removeChannel(subC);if(subI)sb.removeChannel(subI);if(subK)sb.removeChannel(subK);if(subP)sb.removeChannel(subP);
await sb.from('messages').delete().eq('sender_id',me);
await sb.from('chats').delete().contains('members',[me]);
await sb.from('contacts').delete().eq('owner_id',me);
await sb.from('profiles').delete().eq('id',me);
localStorage.removeItem(SESS);
toast('Аккаунт удалён');
setTimeout(()=>location.reload(),900)}

function closeStory(){document.getElementById('story-viewer').classList.remove('show');if(window._st)clearInterval(window._st)}

(async function init(){
try{
if('serviceWorker' in navigator){try{navigator.serviceWorker.register('sw.js').catch(()=>{})}catch{}}
const hash=location.hash.match(/invite=([a-zA-Z0-9-]+)/);
if(hash)localStorage.setItem('pending_invite',hash[1]);
const sid=localStorage.getItem(SESS);
if(sid){
const {data}=await sb.from('profiles').select('*').eq('id',sid).maybeSingle();
if(data){
me=data.id;mp=data;
if(isBanned(data)){showBannedScreen(data);return}
if(data.status==='pending'){showSc('sc-wait');return}
if(data.status==='rejected'){document.getElementById('wait-icon').textContent='❌';document.getElementById('wait-title').textContent='Заявка отклонена';document.getElementById('wait-status').textContent='❌ Отклонено';document.getElementById('wait-status').className='status rejected';showSc('sc-wait');return}
await loadAll();subRT();subIn();subParent();
showSc('sc-main');switchTab('chats');
setTimeout(()=>{if('Notification' in window&&Notification.permission==='default')openM('m-notif')},2000);
return}
localStorage.removeItem(SESS)}
showSc('sc-auth')
}catch(e){console.error(e);showSc('sc-auth');toast('Ошибка: '+e.message,true)}})();
