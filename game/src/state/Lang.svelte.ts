const en = {
  blocked: 'Blocked',
  date: 'Date',
  friendzoned: 'Friendzoned',
  isTyping: '{name} is typing...',
  rejected: 'Rejected',
  resetGame: 'Reset game',
  selectScenario: 'Select a scenario',
};

const es = {
  blocked: 'Bloqueado',
  date: 'Cita',
  friendzoned: 'Friendzoned',
  isTyping: '{name} está escribiendo...',
  rejected: 'Rechazado',
  resetGame: 'Reinciar juego',
  selectScenario: 'Elige un scenario',
};

const locales = { en, es };

const key = 'fms::locale';

let locale = $state((() => {
  let locale: keyof typeof locales = 'en';
  const stored = localStorage.getItem(key) as keyof typeof locales;
  if (locales[stored]) {
    locale = stored;
  } else {
    const languages = (navigator.languages || [navigator.language]);
    for (let i = 0, l = languages.length; i < l; i++) {
      const lang = languages[i].split('-')[0].toLowerCase() as keyof typeof locales;
      if (locales[lang]) {
        locale = lang;
        break;
      }
    }
    localStorage.setItem(key, locale);
  }
  return locale;
})());

let current = $derived(locales[locale]);

export const Lang = {
  get current() { return current },
  set locale(value: keyof typeof locales) {
    locale = value;
    localStorage.setItem(key, locale);
  }
};
