const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={
 tasks:JSON.parse(localStorage.getItem("ms_tasks")||"[]"),
 ibadah:JSON.parse(localStorage.getItem("ms_ibadah")||"{}"),
 notes:JSON.parse(localStorage.getItem("ms_notes")||"[]"),
 theme:localStorage.getItem("ms_theme")||"light",
 page:"dashboard", quizIndex:0, quizScore:0, quizSelected:null, timer:null, seconds:1500
};
function save(){localStorage.setItem("ms_tasks",JSON.stringify(state.tasks));localStorage.setItem("ms_ibadah",JSON.stringify(state.ibadah));localStorage.setItem("ms_notes",JSON.stringify(state.notes));}
function toast(msg){let t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function todayKey(){return new Date().toISOString().slice(0,10)}
function todayLabel(){return new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date())}
function progressTasks(){let done=state.tasks.filter(x=>x.done).length;return state.tasks.length?Math.round(done/state.tasks.length*100):0}
function ibadahItems(){return ["Shalat","Tilawah","Dzikir","Sedekah","Puasa sunnah","Doa harian"]}
function ibadahProgress(){let d=state.ibadah[todayKey()]||{};let n=ibadahItems().filter(x=>d[x]).length;return Math.round(n/ibadahItems().length*100)}
function layout(title,subtitle,body){return `<div class="page"><div class="section-head"><div><div class="eyebrow">MUSLIMAH STUDY 🌷</div><h1 style="font-family:'Playfair Display';margin:5px 0">${title}</h1><div class="muted">${subtitle}</div></div></div>${body}</div>`}
function dashboard(){
 const tp=progressTasks(), ip=ibadahProgress(), mot=motivations[new Date().getDate()%motivations.length];
 return `<div class="page">
 <section class="hero"><div><div class="eyebrow">WELCOME BACK ♡</div><h1>Assalamu'alaikum,<br>MUSLIMAH 🌷 sahabat Nitaa...</h1><p>Mari belajar, bertumbuh, dan menjadi versi terbaik dari dirimu bersama aku, <b>Putri Donita</b>.</p><div class="date">${todayLabel()}</div></div></section>
 <div class="section-head"><h2>Ringkasan Hari Ini</h2><span>Data tersimpan otomatis</span></div>
 <div class="grid">
  <div class="card stat"><div><div class="num">${tp}%</div><div class="label">📖 Belajar Hari Ini</div></div><div class="stat-icon">📚</div></div>
  <div class="card stat"><div><div class="num">${ip}%</div><div class="label">🕌 Ibadah Hari Ini</div></div><div class="stat-icon">🕌</div></div>
  <div class="card stat"><div><div class="num">${state.tasks.filter(x=>!x.done).length}</div><div class="label">🎯 Target Belum Selesai</div></div><div class="stat-icon">🎯</div></div>
  <div class="card stat"><div><div class="num">${state.notes.length}</div><div class="label">📝 Catatan Tersimpan</div></div><div class="stat-icon">📝</div></div>
 </div>
 <div class="two-col">
  <div class="card"><div class="section-head" style="margin:0 0 8px"><h2>🎯 Target Hari Ini</h2><button class="btn ghost" onclick="go('planner')">Kelola</button></div>${state.tasks.slice(0,5).map(t=>`<label class="task ${t.done?'done':''}"><input type="checkbox" ${t.done?'checked':''} onchange="toggleTask('${t.id}')"><span>${escapeHtml(t.text)}</span></label>`).join("")||'<div class="empty">Belum ada target. Tambahkan tugas pertamamu 🌸</div>'}</div>
  <div class="card"><div class="section-head" style="margin:0 0 8px"><h2>🕌 Ibadah Hari Ini</h2><span>${ip}%</span></div><div class="progress"><i style="width:${ip}%"></i></div><div class="muted" style="margin-top:12px">Sedikit demi sedikit, konsisten setiap hari.</div><button class="btn" style="margin-top:14px" onclick="go('ibadah')">Buka Tracker</button></div>
 </div>
 <div class="card" style="margin-top:16px"><div class="eyebrow">DAILY MOTIVATION 🌸</div><h2 style="margin:8px 0">${mot}</h2><div class="muted">Kamu tidak perlu menjadi sempurna untuk mulai bertumbuh.</div></div>
 </div>`
}
function study(){
 return layout("Islamic Study","Ruang belajar ringkas untuk menambah ilmu dan refleksi.",`<div class="study-grid">${studyData.map(s=>`<article class="card study-card" onclick="openStudy('${s.id}')"><div class="big-icon">${s.icon}</div><h3>${s.title}</h3><p>${s.desc}</p><span class="tag">${s.items.length} topik</span></article>`).join("")}</div><div id="studyDetail"></div>`)
}
function openStudy(id){let s=studyData.find(x=>x.id===id);$("#studyDetail").innerHTML=`<div class="card" style="margin-top:16px"><div class="section-head" style="margin:0"><h2>${s.icon} ${s.title}</h2><button class="btn ghost" onclick="$('#studyDetail').innerHTML=''">Tutup</button></div><p class="muted">${s.desc}</p><div class="grid">${s.items.map((x,i)=>`<div class="card" style="box-shadow:none;background:var(--cream)"><b>${i+1}. ${x}</b><p class="muted">Pelajari poin ini secara bertahap, lalu tuliskan satu refleksi di My Notes.</p><button class="btn secondary" onclick="go('notes','${x}')">Catat refleksi</button></div>`).join("")}</div></div>`;$("#studyDetail").scrollIntoView({behavior:"smooth"})}
function planner(){
 let tasks=state.tasks;
 return layout("Muslimah Planner","Atur tugas, target belajar, dan fokus harianmu.",`<div class="two-col"><div class="card"><h2>➕ Tambah Target</h2><div class="form-row"><input id="taskInput" class="input" placeholder="Contoh: Review materi fiqih"><button class="btn" onclick="addTask()">Tambah</button></div><div class="progress-row"><span>Progress tugas</span><b>${progressTasks()}%</b></div><div class="progress"><i style="width:${progressTasks()}%"></i></div><div style="margin-top:14px">${tasks.map(t=>`<div class="task ${t.done?'done':''}"><input type="checkbox" ${t.done?'checked':''} onchange="toggleTask('${t.id}')"><span style="flex:1">${escapeHtml(t.text)}</span><button class="btn ghost" onclick="deleteTask('${t.id}')">×</button></div>`).join("")||'<div class="empty">Belum ada target.</div>'}</div></div><div class="card center"><div class="eyebrow">FOCUS TIMER</div><div class="timer" id="timer">${fmt(state.seconds)}</div><div class="actions" style="justify-content:center"><button class="btn" onclick="startTimer()">▶ Mulai</button><button class="btn secondary" onclick="pauseTimer()">Ⅱ Jeda</button><button class="btn ghost" onclick="resetTimer()">↺ Reset</button></div><p class="muted">Teknik Pomodoro: 25 menit fokus, lalu istirahat.</p></div></div>`)
}
function addTask(){let x=$("#taskInput").value.trim();if(!x)return;state.tasks.unshift({id:Date.now().toString(),text:x,done:false});save();toast("Target ditambahkan 🌷");render()}
function toggleTask(id){let t=state.tasks.find(x=>x.id===id);if(t)t.done=!t.done;save();render()}
function deleteTask(id){state.tasks=state.tasks.filter(x=>x.id!==id);save();render()}
function ibadah(){
 let d=state.ibadah[todayKey()]||{};let p=ibadahProgress();
 return layout("Ibadah Tracker","Checklist sederhana untuk menemani rutinitas harian.",`<div class="two-col"><div class="card"><div class="section-head" style="margin:0 0 10px"><h2>🕌 Hari ini</h2><b>${p}%</b></div><div class="progress"><i style="width:${p}%"></i></div><div class="check-grid" style="margin-top:16px">${ibadahItems().map(x=>`<label class="check"><input type="checkbox" ${d[x]?'checked':''} onchange="toggleIbadah('${x}')"><span>${x}</span></label>`).join("")}</div></div><div class="card"><h2>🌿 Catatan Hari Ini</h2><p class="muted">Jadikan tracker sebagai pengingat, bukan tekanan. Konsisten dengan kemampuanmu.</p><button class="btn" onclick="go('notes','Refleksi ibadah hari ini: ')">Tulis refleksi</button></div></div>`)
}
function toggleIbadah(x){let k=todayKey();state.ibadah[k]??={};state.ibadah[k][x]=!state.ibadah[k][x];save();render()}
function quiz(){
 let q=quizData[state.quizIndex];
 if(state.quizIndex>=quizData.length)return layout("Knowledge Quiz","Selesai!","<div class='card center'><div style='font-size:55px'>🎉</div><h2>MasyaAllah, quiz selesai!</h2><p class='muted'>Skormu: <b>"+state.quizScore+" / "+quizData.length+"</b></p><button class='btn' onclick='restartQuiz()'>Coba Lagi</button></div>");
 return layout("Knowledge Quiz","Uji pengetahuanmu dengan kuis singkat.",`<div class="card"><div class="progress-row"><span>Soal ${state.quizIndex+1} dari ${quizData.length}</span><b>${Math.round(state.quizIndex/quizData.length*100)}%</b></div><div class="progress"><i style="width:${(state.quizIndex/quizData.length)*100}%"></i></div><h2 style="margin-top:25px">${q.q}</h2>${q.opts.map((o,i)=>`<button class="quiz-option ${state.quizSelected===i?'selected':''}" onclick="answer(${i})">${String.fromCharCode(65+i)}. ${o}</button>`).join("")}<div id="quizMsg"></div></div>`)
}
function answer(i){if(state.quizSelected!==null)return;state.quizSelected=i;let q=quizData[state.quizIndex],ok=i===q.a;if(ok)state.quizScore++;$("#quizMsg").innerHTML=`<div class="result">${ok?'✨ Benar! MasyaAllah.':'🌷 Belum tepat. Jawaban yang benar: '+q.opts[q.a]}<br><button class="btn" style="margin-top:10px" onclick="nextQuiz()">Lanjut</button></div>`;$$(".quiz-option")[i].classList.add("selected")}
function nextQuiz(){state.quizIndex++;state.quizSelected=null;render()}
function restartQuiz(){state.quizIndex=0;state.quizScore=0;state.quizSelected=null;render()}
function notes(prefill=""){
 return layout("My Notes","Simpan catatan kajian, pelajaran, dan refleksi secara lokal.",`<div class="card"><div class="form-row"><input id="noteTitle" class="input" placeholder="Judul catatan"><button class="btn" onclick="addNote()">Simpan</button></div><textarea id="noteBody" class="textarea" placeholder="Tulis catatanmu di sini...">${escapeHtml(prefill)}</textarea></div><div class="grid" style="margin-top:16px">${state.notes.map(n=>`<article class="card note"><button class="btn ghost note-actions" onclick="deleteNote('${n.id}')">×</button><span class="tag">${new Date(n.date).toLocaleDateString('id-ID')}</span><h3>${escapeHtml(n.title)}</h3><div class="muted">${escapeHtml(n.body).replace(/\n/g,"<br>")}</div></article>`).join("")||'<div class="card empty">Belum ada catatan. Mulai tulis satu hal yang kamu pelajari hari ini 🤍</div>'}</div>`)
}
function addNote(){let title=$("#noteTitle").value.trim()||"Catatan Muslimah",body=$("#noteBody").value.trim();if(!body)return;state.notes.unshift({id:Date.now().toString(),title,body,date:Date.now()});save();toast("Catatan tersimpan 📝");render()}
function deleteNote(id){state.notes=state.notes.filter(n=>n.id!==id);save();render()}
function motivation(){let i=new Date().getDate()%motivations.length;return layout("Motivation","Pesan kecil untuk menemani perjalanan belajarmu.",`<div class="card center" style="padding:50px 25px"><div style="font-size:60px">🌸</div><div class="eyebrow">TODAY'S REMINDER</div><h2 style="font-family:'Playfair Display';font-size:29px;max-width:650px;margin:15px auto">${motivations[i]}</h2><button class="btn" onclick="randomMotivation()">Motivasi lainnya ✨</button></div>`)}
function randomMotivation(){motivations.push(motivations.shift());render()}
function fmt(s){return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function startTimer(){if(state.timer)return;state.timer=setInterval(()=>{if(state.seconds>0){state.seconds--;let e=$("#timer");if(e)e.textContent=fmt(state.seconds)}else{pauseTimer();toast("Waktu fokus selesai! Istirahat sebentar 🌷")}},1000);toast("Focus mode dimulai ✨")}
function pauseTimer(){clearInterval(state.timer);state.timer=null}
function resetTimer(){pauseTimer();state.seconds=1500;render()}
function go(page,prefill=""){state.page=page;state.prefill=prefill;$$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$("#sidebar").classList.remove("open");render()}
function render(){let p=state.page;$("#app").innerHTML=p==="dashboard"?dashboard():p==="study"?study():p==="planner"?planner():p==="ibadah"?ibadah():p==="quiz"?quiz():p==="notes"?notes(state.prefill||""):motivation();state.prefill=""}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");state.theme=document.body.classList.contains("dark")?"dark":"light";localStorage.setItem("ms_theme",state.theme)}
if(state.theme==="dark")document.body.classList.add("dark");
$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
$("#globalSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){let q=e.target.value.toLowerCase();if(!q)return;if(studyData.some(s=>(s.title+" "+s.desc+" "+s.items.join(" ")).toLowerCase().includes(q)))go("study");else if(q.includes("catat")||q.includes("note"))go("notes");else if(q.includes("ibadah")||q.includes("sholat"))go("ibadah");else if(q.includes("quiz")||q.includes("kuis"))go("quiz");else go("planner");}});
render();