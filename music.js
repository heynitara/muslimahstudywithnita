(function(){
  const audio = new Audio("muslimah-study-bg-music.wav");
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.25;
  const btn = document.getElementById("musicBtn");
  function update(on){
    if(!btn) return;
    btn.textContent = on ? "🔊 Musik ON" : "🎵 Musik OFF";
    btn.classList.toggle("music-on", on);
    btn.setAttribute("aria-pressed", String(on));
    btn.title = on ? "Matikan musik" : "Nyalakan musik";
  }
  async function start(){
    try{ await audio.play(); update(true); if(window.toast) toast("Musik Muslimah Study dinyalakan 🎵🌷"); }
    catch(e){ update(false); if(window.toast) toast("Klik tombol Musik sekali lagi ya 🎧"); }
  }
  function stop(){ audio.pause(); audio.currentTime=0; update(false); if(window.toast) toast("Musik dimatikan 🌙"); }
  if(btn) btn.addEventListener("click",()=> audio.paused ? start() : stop());
  window.MuslimahStudyMusic={start,stop,toggle:()=>audio.paused?start():stop(),setVolume:v=>audio.volume=Math.max(0,Math.min(1,v)),isPlaying:()=>!audio.paused};
})();
