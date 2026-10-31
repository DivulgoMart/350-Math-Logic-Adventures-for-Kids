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
  const deadline = previous.length ? Math.min(...previous) : now + duration;
  document.cookie = `${key}=${deadline}; Max-Age=31536000; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  try { localStorage.setItem(key, String(deadline)); } catch {}
  const pad = number => String(number).padStart(2, '0');
  let interval;
  function render() {
    const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    document.body.classList.toggle('offer-expired', remaining === 0);
    document.querySelectorAll('.countdown-box').forEach(box => { box.hidden = remaining === 0; });
    const values = { hours: Math.floor(remaining / 3600), minutes: Math.floor(remaining % 3600 / 60), seconds: remaining % 60 };
    for (const [part, value] of Object.entries(values)) {
      document.querySelectorAll(`[data-${part}]`).forEach(element => { element.textContent = pad(value); });
    }
    if (!remaining && interval) clearInterval(interval);
  }
  render();
  if (deadline > Date.now()) interval = setInterval(render, 1000);
  document.addEventListener('visibilitychange', render);
})();
