(function(){
  const btn = document.getElementById('musicBtn');
  const audio = document.createElement('audio');
  audio.id = 'muslimahStudyBgMusic';
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.30;
  audio.setAttribute('playsinline','');
  const source = document.createElement('source');
  source.src = 'muslimah-study-bg-music.mp3';
  source.type = 'audio/mpeg';
  audio.appendChild(source);
  const fallback = document.createElement('source');
  fallback.src = 'muslimah-study-bg-music.wav';
  fallback.type = 'audio/wav';
  audio.appendChild(fallback);
  document.body.appendChild(audio);

  function update(on){
    if(!btn) return;
    btn.textContent = on ? '🔊 Musik ON' : '🎵 Musik OFF';
    btn.classList.toggle('music-on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.title = on ? 'Matikan musik' : 'Nyalakan musik';
  }
  async function start(){
    try{
      await audio.play();
      update(true);
      if(window.toast) window.toast('Musik Muslimah Study dinyalakan 🎵🌷');
    }catch(e){
      update(false);
      if(window.toast) window.toast('Musik belum jalan. Klik tombol Musik sekali lagi 🎧');
      console.warn('Music playback error:', e);
    }
  }
  function stop(){ audio.pause(); update(false); if(window.toast) window.toast('Musik dimatikan 🌙'); }
  if(btn) btn.addEventListener('click', function(){ audio.paused ? start() : stop(); });
  audio.addEventListener('play',()=>update(true));
  audio.addEventListener('pause',()=>update(false));
  window.MuslimahStudyMusic={start,stop,toggle:()=>audio.paused?start():stop(),setVolume:v=>audio.volume=Math.max(0,Math.min(1,v)),isPlaying:()=>!audio.paused};
})();
