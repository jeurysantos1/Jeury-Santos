/* ============================================
   MobileSite Contact Collection Prototype
   Matches Figma: H1-26 MobileSite Contact Collection
   ============================================ */

const CHANNELS = [
  { id: 'email', label: 'Email address', icon: 'envelope', inputLabel: 'Email address', placeholder: 'name@example.com', inputType: 'email' },
  { id: 'mobile', label: 'Mobile phone number', icon: 'phone', inputLabel: 'Mobile phone number', placeholder: '+1 (555) 000-0000', inputType: 'tel' },
  { id: 'whatsapp', label: 'WhatsApp phone number', icon: 'whatsapp', inputLabel: 'WhatsApp phone number', placeholder: '+1 (555) 000-0000', inputType: 'tel' },
];

const CHANNEL_CONFIG = {
  email: {
    title: 'Add your email address',
    subtitle: 'Receive updates about your ads and payments by email.',
    verifyTitle: 'Confirm your email address',
    verifySubtitle: (val) => `Enter the code we sent to ${val} to confirm your email address. This code will expire in 60 minutes.`,
    successToast: 'Email address verified',
    optInText: 'Receive marketing communications and personalized guidance by email and Messenger.',
  },
  mobile: {
    title: 'Add your mobile phone number',
    subtitle: 'Receive important notifications about your ads and payments by SMS.',
    verifyTitle: 'Confirm your mobile phone number',
    verifySubtitle: (val) => `Enter the code we sent by SMS to ${val}. This code will expire in 60 minutes.`,
    successToast: 'Mobile phone number verified',
    optInText: 'Receive calls about personalized advertising guidance by phone and WhatsApp, and marketing communications by SMS.',
  },
  whatsapp: {
    title: 'Add your WhatsApp phone number',
    subtitle: 'Receive messages on WhatsApp about your ads and payments.',
    verifyTitle: 'Confirm your WhatsApp phone number',
    verifySubtitle: (val) => `Enter the code we sent by WhatsApp to ${val}. This code will expire in 60 minutes.`,
    successToast: 'WhatsApp phone number verified',
    optInText: 'Receive marketing messages, and calls and messages about personalized advertising guidance on WhatsApp.',
  },
};

const ICONS = {
  envelope: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H2c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1z" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M1.5 3.5L8 8.5l6.5-5" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`,
  phone: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.6 1.4C3.8 1.1 4.2 1 4.5 1.2l2.3 1.5c.3.2.4.6.3.9L6.4 5.4c-.1.3 0 .6.2.8l3.2 3.2c.2.2.5.3.8.2l1.8-.7c.3-.1.7 0 .9.3l1.5 2.3c.2.3.1.7-.2.9l-1.6 1.2c-.4.3-.9.4-1.4.2C8.5 12.6 3.4 7.5 2.2 4.4c-.2-.5-.1-1 .2-1.4L3.6 1.4z" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`,
  whatsapp: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a7 7 0 00-6.1 10.4L1 15l3.7-.9A7 7 0 108 1z" stroke="currentColor" stroke-width="1.1" fill="none"/><path d="M11.1 9.5l-1.4-.7c-.2-.1-.4 0-.5.1l-.4.5c-.1.1-.3.2-.4.1-.8-.3-2-1.3-2.4-2-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.3 0-.5l-.6-1.3c-.1-.3-.4-.3-.5-.3h-.5c-.2 0-.4.1-.6.3-.5.6-.6 1.4-.2 2.2.7 1.4 1.6 2.3 3.2 3.1.8.4 1.4.5 1.9.4.5-.1.9-.5 1.1-.9.1-.2 0-.4-.2-.5z" fill="currentColor"/></svg>`,
  chevronRight: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevronLeft: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

// ============================================
// State
// ============================================

const state = {
  screen: 'landing',
  currentChannel: null,
  channelOrder: ['email', 'mobile', 'whatsapp'],
  channelData: {
    email: { value: '', verified: false, code: '' },
    mobile: { value: '', verified: false, code: '' },
    whatsapp: { value: '', verified: false, code: '' },
  },
  animationDirection: 'right',
};

// ============================================
// Router
// ============================================

function navigate(screen, channel, direction = 'right') {
  state.screen = screen;
  state.currentChannel = channel || null;
  state.animationDirection = direction;
  render();
}

// ============================================
// Renderers
// ============================================

function render() {
  const card = document.getElementById('content-card');
  const heading = document.getElementById('main-heading');
  const desc = document.getElementById('main-description');
  const animClass = state.animationDirection === 'right' ? 'slide-in-right' : 'slide-in-left';

  switch (state.screen) {
    case 'landing':
      heading.textContent = 'Contact info';
      desc.textContent = "We'll use this info to notify you about your ad accounts. You can update your notification settings anytime to stop receiving optional notifications.";
      card.innerHTML = renderLanding();
      break;
    case 'input':
      heading.textContent = 'Contact info';
      desc.textContent = "We'll use this info to notify you about your ad accounts. You can update your notification settings anytime to stop receiving optional notifications.";
      card.innerHTML = renderInput(state.currentChannel);
      break;
    case 'verify':
      heading.textContent = 'Contact info';
      desc.textContent = "We'll use this info to notify you about your ad accounts. You can update your notification settings anytime to stop receiving optional notifications.";
      card.innerHTML = renderVerify(state.currentChannel);
      break;
    case 'partial':
      heading.textContent = "You're making progress";
      desc.textContent = "Add another contact method to help make sure you see updates about your ad accounts.";
      card.innerHTML = renderCompletion(false);
      break;
    case 'complete':
      heading.textContent = "You're all set";
      desc.textContent = "Thanks for adding your contact info. We'll use it to notify you about your ad accounts.";
      card.innerHTML = renderCompletion(true);
      break;
  }

  card.className = `content-card ${animClass}`;
  bindEvents();
}

function renderLanding() {
  const items = CHANNELS.map((ch, i) => {
    const data = state.channelData[ch.id];
    const label = data.verified ? data.value : 'None';
    const checkIcon = data.verified
      ? `<span class="channel-check">${ICONS.check}</span>`
      : `<span class="channel-chevron">${ICONS.chevronRight}</span>`;

    return `
      ${i > 0 ? '<div class="geo-divider"></div>' : ''}
      <div class="channel-item" data-action="open-channel" data-channel="${ch.id}">
        <span class="channel-icon">${ICONS[ch.icon]}</span>
        <div class="channel-info">
          <div class="channel-label">${label}</div>
          <div class="channel-description">${ch.label}</div>
        </div>
        ${checkIcon}
      </div>
    `;
  }).join('');

  return `<div class="channel-list">${items}</div>`;
}

function renderInput(channelId) {
  const ch = CHANNELS.find(c => c.id === channelId);
  const config = CHANNEL_CONFIG[channelId];
  const data = state.channelData[channelId];

  return `
    <div class="form-card">
      <div class="channel-header">
        <div class="channel-toggle">
          <button class="back-button" data-action="back">${ICONS.chevronLeft}</button>
          <span class="channel-title">${config.title}</span>
        </div>
        <div class="channel-subtitle">${config.subtitle}</div>
      </div>

      <div class="input-group">
        <label class="input-label">${ch.inputLabel}</label>
        <div class="input-wrapper">
          <input
            class="geo-input"
            id="channel-input"
            type="${ch.inputType}"
            placeholder="${ch.placeholder}"
            value="${data.value}"
            autocomplete="off"
          />
        </div>
        <div class="input-error" id="input-error">Please enter a valid ${ch.label.toLowerCase()}</div>
      </div>

      <div class="checkbox-item">
        <input type="checkbox" class="geo-checkbox" id="opt-in" checked />
        <label class="checkbox-label" for="opt-in">${config.optInText}</label>
      </div>

      <div class="privacy-text">
        Read our <a href="#">Privacy Policy</a> for details.
      </div>

      <div class="geo-divider-short"></div>

      <div class="button-group">
        <button class="geo-button geo-button-primary" id="btn-continue" data-action="submit-input" disabled>Continue</button>
        <button class="geo-button geo-button-secondary" data-action="skip">Skip</button>
      </div>
    </div>
  `;
}

function renderVerify(channelId) {
  const config = CHANNEL_CONFIG[channelId];
  const data = state.channelData[channelId];

  return `
    <div class="form-card">
      <div class="channel-header">
        <div class="channel-toggle">
          <button class="back-button" data-action="back-to-input">${ICONS.chevronLeft}</button>
          <span class="channel-title">${config.verifyTitle}</span>
        </div>
        <div class="channel-subtitle">${config.verifySubtitle(data.value)}</div>
      </div>

      <div class="input-group">
        <label class="input-label">Confirmation code</label>
        <div class="input-wrapper">
          <input
            class="geo-input"
            id="code-input"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            placeholder="Enter code"
            autocomplete="one-time-code"
          />
        </div>
        <div class="input-error" id="code-error">This code isn't correct. Check the code and try again.</div>
      </div>

      <a class="geo-link" data-action="resend-code">Resend code</a>

      <div class="geo-divider-short"></div>

      <div class="button-group">
        <button class="geo-button geo-button-primary" id="btn-verify" data-action="submit-code" disabled>Continue</button>
        <button class="geo-button geo-button-secondary" data-action="skip">Skip</button>
      </div>
    </div>
  `;
}

function renderCompletion(isComplete) {
  const items = CHANNELS.map((ch, i) => {
    const data = state.channelData[ch.id];
    const label = data.verified ? data.value : 'None';
    const checkIcon = data.verified
      ? `<span class="channel-check" style="color: var(--color-success)">${ICONS.check}</span>`
      : `<span class="channel-chevron">${ICONS.chevronRight}</span>`;

    return `
      ${i > 0 ? '<div class="geo-divider"></div>' : ''}
      <div class="channel-item" data-action="open-channel" data-channel="${ch.id}">
        <span class="channel-icon">${ICONS[ch.icon]}</span>
        <div class="channel-info">
          <div class="channel-label">${label}</div>
          <div class="channel-description">${ch.label}</div>
        </div>
        ${checkIcon}
      </div>
    `;
  }).join('');

  return `<div class="channel-list">${items}</div>`;
}

// ============================================
// Event Binding
// ============================================

function bindEvents() {
  document.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', handleAction);
  });

  const channelInput = document.getElementById('channel-input');
  if (channelInput) {
    channelInput.addEventListener('input', () => {
      const btn = document.getElementById('btn-continue');
      const error = document.getElementById('input-error');
      btn.disabled = !channelInput.value.trim();
      error.classList.remove('visible');
      channelInput.classList.remove('error');
    });
    channelInput.focus();
  }

  const codeInput = document.getElementById('code-input');
  if (codeInput) {
    codeInput.addEventListener('input', () => {
      const btn = document.getElementById('btn-verify');
      const error = document.getElementById('code-error');
      btn.disabled = codeInput.value.length < 4;
      error.classList.remove('visible');
      codeInput.classList.remove('error');
    });
    codeInput.focus();
  }
}

// ============================================
// Action Handlers
// ============================================

function handleAction(e) {
  const action = e.currentTarget.dataset.action;
  const channelId = e.currentTarget.dataset.channel;

  switch (action) {
    case 'open-channel':
      if (state.channelData[channelId].verified) return;
      navigate('input', channelId);
      break;

    case 'back':
      if (state.screen === 'input') {
        const isFromCompletion = Object.values(state.channelData).some(d => d.verified);
        navigate(isFromCompletion ? 'partial' : 'landing', null, 'left');
      }
      break;

    case 'back-to-input':
      navigate('input', state.currentChannel, 'left');
      break;

    case 'submit-input': {
      const input = document.getElementById('channel-input');
      const value = input.value.trim();

      if (!validateInput(state.currentChannel, value)) {
        input.classList.add('error');
        document.getElementById('input-error').classList.add('visible');
        return;
      }

      state.channelData[state.currentChannel].value = value;
      navigate('verify', state.currentChannel);
      break;
    }

    case 'submit-code': {
      const codeInput = document.getElementById('code-input');
      const code = codeInput.value.trim();
      const btn = document.getElementById('btn-verify');

      if (code.length < 4) return;

      // Simulate wrong code for "0000"
      if (code === '0000') {
        codeInput.classList.add('error');
        document.getElementById('code-error').classList.add('visible');
        return;
      }

      btn.classList.add('geo-button-loading');
      btn.textContent = 'Verifying';
      btn.disabled = true;

      setTimeout(() => {
        state.channelData[state.currentChannel].verified = true;
        state.channelData[state.currentChannel].code = code;
        showToast(CHANNEL_CONFIG[state.currentChannel].successToast);

        setTimeout(() => {
          const nextChannel = getNextUnverifiedChannel();
          if (nextChannel) {
            navigate('input', nextChannel);
          } else if (Object.values(state.channelData).every(d => d.verified)) {
            navigate('complete');
          } else {
            navigate('partial');
          }
        }, 1500);
      }, 1200);
      break;
    }

    case 'resend-code':
      showToast('Confirmation code sent');
      break;

    case 'skip': {
      const nextChannel = getNextUnverifiedChannel();
      const anyVerified = Object.values(state.channelData).some(d => d.verified);

      if (nextChannel && !anyVerified) {
        navigate('input', nextChannel);
      } else if (anyVerified) {
        navigate('partial');
      } else {
        navigate('landing', null, 'left');
      }
      break;
    }
  }
}

// ============================================
// Helpers
// ============================================

function validateInput(channelId, value) {
  if (!value) return false;
  if (channelId === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  return value.replace(/\D/g, '').length >= 7;
}

function getNextUnverifiedChannel() {
  const currentIdx = state.channelOrder.indexOf(state.currentChannel);
  for (let i = 1; i <= state.channelOrder.length; i++) {
    const idx = (currentIdx + i) % state.channelOrder.length;
    const ch = state.channelOrder[idx];
    if (!state.channelData[ch].verified) return ch;
  }
  return null;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toast-text');
  text.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// ============================================
// Init
// ============================================

render();
