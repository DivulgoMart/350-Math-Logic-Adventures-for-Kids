(() => {
  'use strict';
  const key = 'math350_offer_deadline_v1';
  const duration = (25 * 60 + 40) * 60 * 1000;
  const now = Date.now();
  const valid = value => Number.isFinite(value) && value > 0 && value <= now + duration;
  const cookie = document.cookie.split('; ').find(part => part.startsWith(key + '='));
  const saved = [];
  if (cookie) saved.push(Number(cookie.slice(key.length + 1)));
  try { const local = localStorage.getItem(key); if (local) saved.push(Number(local)); } catch {}
  const previous = saved.filter(valid);
  let deadline = previous.length ? Math.min(...previous) : now + duration;
  function saveDeadline() {
    document.cookie = `${key}=${deadline}; Max-Age=31536000; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    try { localStorage.setItem(key, String(deadline)); } catch {}
  }
  const pad = number => String(number).padStart(2, '0');
  function render() {
    const currentTime = Date.now();
    if (deadline <= currentTime) {
      deadline += (Math.floor((currentTime - deadline) / duration) + 1) * duration;
      saveDeadline();
    }
    const remaining = Math.ceil((deadline - currentTime) / 1000);
    document.body.classList.remove('offer-expired');
    document.querySelectorAll('.countdown-box').forEach(box => { box.hidden = false; });
    const values = { hours: Math.floor(remaining / 3600), minutes: Math.floor(remaining % 3600 / 60), seconds: remaining % 60 };
    for (const [part, value] of Object.entries(values)) {
      document.querySelectorAll(`[data-${part}]`).forEach(element => { element.textContent = pad(value); });
    }
  }
  render();
  saveDeadline();
  setInterval(render, 1000);
  document.addEventListener('visibilitychange', render);
})();
