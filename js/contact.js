

export function initContact() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'jayzeelance7201@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ Copied to clipboard!';
        copyBtn.style.backgroundColor = 'var(--status-available)';
        copyBtn.style.color = '#ffffff';
        copyBtn.style.borderColor = 'var(--status-available)';

        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.backgroundColor = '';
          copyBtn.style.color = '';
          copyBtn.style.borderColor = '';
        }, 2500);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  }

  const form = document.getElementById('postcard-form');
  const successMsg = document.getElementById('form-success');
  const failureMsg = document.getElementById('form-failure');

  if (!form) return;

  const fields = {
    name: {
      el: form.querySelector('#sender-name'),
      validate: (val) => val.trim().length >= 2,
      msg: 'Please provide your name (at least 2 characters)',
    },
    email: {
      el: form.querySelector('#sender-email'),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      msg: 'Please provide a valid email address',
    },
    message: {
      el: form.querySelector('#sender-message'),
      validate: (val) => val.trim().length >= 10,
      msg: 'Please write a brief note (at least 10 characters)',
    },
  };

  function validateField(field) {
    const group = field.el.closest('.form-group');
    const errorEl = group?.querySelector('.form-group__error');

    if (!field.validate(field.el.value)) {
      group?.classList.add('error');
      if (errorEl) errorEl.textContent = field.msg;
      return false;
    } else {
      group?.classList.remove('error');
      return true;
    }
  }

  Object.values(fields).forEach((field) => {
    if (!field.el) return;
    field.el.addEventListener('blur', () => validateField(field));
    field.el.addEventListener('input', () => {
      field.el.closest('.form-group')?.classList.remove('error');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    Object.values(fields).forEach((field) => {
      if (field.el && !validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      form.querySelector('.form-group.error input, .form-group.error textarea')?.focus();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Transmitting...';
    submitBtn.disabled = true;
    if (failureMsg) {
      failureMsg.classList.remove('visible');
      failureMsg.textContent = '';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fields.name.el.value.trim(),
          email: fields.email.el.value.trim(),
          message: fields.message.el.value.trim(),
          _subject: 'New portfolio message for Jayzee',
          _template: 'table',
          _honey: form.elements._honey?.value || '',
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false || result.success === 'false') {
        throw new Error(result.message || 'The message service could not accept this message.');
      }

      form.style.display = 'none';
      if (successMsg) successMsg.classList.add('visible');
      form.reset();

      setTimeout(() => {
        form.style.display = '';
        if (successMsg) successMsg.classList.remove('visible');
      }, 6000);
    } catch (error) {
      if (failureMsg) {
        failureMsg.textContent = 'Message failed to send. Please try again or email me directly at jayzeelance7201@gmail.com.';
        failureMsg.classList.add('visible');
      }
      console.error('Contact form submission failed:', error);
    } finally {
      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
    }
  });
}
