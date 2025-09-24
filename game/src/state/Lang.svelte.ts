const en = {
  isTyping: '{name} is typing...',
  selectScenario: 'Select a scenario',
  tryAgain: 'Try again',
  tryAnother: 'Try another scenario',
};

const es = {
  isTyping: '{name} está escribiendo...',
  selectScenario: 'Elige un escenario',
  tryAgain: 'Inténtalo de nuevo',
  tryAnother: 'Prueba otro escenario',
};

const locales = { en, es };

const key = 'texty::locale';

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
