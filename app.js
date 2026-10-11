(() => {
  'use strict';
  const book = document.getElementById('book');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const counter = document.getElementById('counter');
  const music = document.getElementById('music');
  const audio = document.getElementById('soundtrack');
  const err = document.getElementById('load-error');
  if (!window.St || !window.St.PageFlip) {
    err.hidden = false;
    return;
  }
  // La biblioteca se adapta a una sola página en vertical y dos en escritorio.
  const album = new St.PageFlip(book, {
    width: 460,
    height: 635,
    size: 'stretch',
    minWidth: 245,
    maxWidth: 460,
    minHeight: 338,
    maxHeight: 635,
    showCover: true,
    usePortrait: true,
    drawShadow: true,
    maxShadowOpacity: .5,
    flippingTime: 2250,
    autoSize: true,
    mobileScrollSupport: true
  });
  album.loadFromHTML(document.querySelectorAll('#book > .page'));
  const count = album.getPageCount();
  function updateCounter() {
    const i = album.getCurrentPageIndex();
    counter.textContent = i === 0 ? 'Portada' : i === count - 1 ? 'Contraportada' : `Página ${i} de 5`;
    prev.disabled = i === 0;
    next.disabled = i >= count - 1;
  }
  album.on('flip', updateCounter);
  album.on('changeOrientation', updateCounter);
  next.addEventListener('click', () => album.flipNext('bottom'));
  prev.addEventListener('click', () => album.flipPrev('bottom'));
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea,select')) return;
    if (e.key === 'ArrowRight') album.flipNext('bottom');
    if (e.key === 'ArrowLeft') album.flipPrev('bottom');
  });
  updateCounter();
  // La reproducción de audio empieza mediante un toque del usuario.
  music.addEventListener('click', async () => {
    if (!audio.paused) {
      audio.pause();
      music.textContent = '♫ Música: activar';
      music.setAttribute('aria-pressed', 'false');
      return;
    }
    try {
      audio.volume = 0.35;
      await audio.play();
      music.textContent = '♫ Música: pausar';
      music.setAttribute('aria-pressed', 'true');
    } catch (e) {
      music.textContent = '♫ Toca para escuchar';
      console.warn('No se pudo iniciar la música', e);
    }
  });
})();
