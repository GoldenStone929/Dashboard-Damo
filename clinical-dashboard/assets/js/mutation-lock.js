/**
 * Mutation Section Access Lock
 * Requires password to view mutation pages (per browser session).
 */
(function() {
  const EXPECTED_HASH = 'c7e616822f366fb1b5e0756af498cc11d2c0862edcb32ca65882f622ff39de1b';
  const SESSION_KEY = 'mutation_section_unlocked';

  if (sessionStorage.getItem(SESSION_KEY) === 'true') return;

  document.documentElement.style.overflow = 'hidden';

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'mutationLockOverlay';
    overlay.innerHTML = `
      <div style="
        position:fixed;inset:0;z-index:99999;
        background:linear-gradient(135deg,#1a2332 0%,#2c3e50 100%);
        display:flex;align-items:center;justify-content:center;
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
      ">
        <div style="
          background:white;border-radius:16px;padding:40px 36px 32px;
          box-shadow:0 20px 60px rgba(0,0,0,0.4);
          text-align:center;max-width:380px;width:90%;
        ">
          <div style="
            width:64px;height:64px;margin:0 auto 20px;
            background:linear-gradient(135deg,#3498db,#2980b9);
            border-radius:50%;display:flex;align-items:center;justify-content:center;
          ">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 style="margin:0 0 6px;color:#2c3e50;font-size:1.3rem;">Restricted Section</h2>
          <p style="margin:0 0 24px;color:#7f8c8d;font-size:0.88rem;">Mutation analysis requires authorization.</p>
          <form id="mutationLockForm" autocomplete="off">
            <input id="mutationLockInput" type="password" placeholder="Enter access code"
              autocomplete="new-password"
              style="
                width:100%;padding:12px 14px;border:2px solid #dee2e6;border-radius:8px;
                font-size:1rem;outline:none;text-align:center;letter-spacing:4px;
                transition:border-color 0.2s;box-sizing:border-box;
              "
            />
            <div id="mutationLockError" style="
              color:#e74c3c;font-size:0.82rem;margin-top:8px;min-height:20px;
            "></div>
            <button type="submit" style="
              width:100%;padding:12px;margin-top:8px;
              background:linear-gradient(135deg,#3498db,#2980b9);color:white;
              border:none;border-radius:8px;font-size:0.95rem;font-weight:600;
              cursor:pointer;transition:all 0.2s;
            ">Unlock</button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = document.getElementById('mutationLockInput');
    const error = document.getElementById('mutationLockError');

    input.addEventListener('focus', function() { this.style.borderColor = '#3498db'; });
    input.addEventListener('blur', function() { this.style.borderColor = '#dee2e6'; });

    document.getElementById('mutationLockForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const val = input.value;
      if (!val) { error.textContent = 'Please enter the access code.'; return; }
      const hash = await sha256(val);
      if (hash === EXPECTED_HASH) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        overlay.style.transition = 'opacity 0.3s';
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          document.documentElement.style.overflow = '';
        }, 300);
      } else {
        error.textContent = 'Incorrect access code.';
        input.value = '';
        input.style.borderColor = '#e74c3c';
        input.focus();
      }
    });

    setTimeout(() => input.focus(), 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createOverlay);
  } else {
    createOverlay();
  }
})();
