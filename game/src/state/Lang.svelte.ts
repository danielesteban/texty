const en = {
  blocked: "You've been blocked!",
  date: "You've got a date!",
  friendzoned: "You've been friendzoned!",
  isTyping: '{name} is typing...',
  rejected: "You've been rejected!",
  selectScenario: 'Select a scenario',
  tryAgain: 'Try again',
  tryAnother: 'Try another scenario',
};

const es = {
  blocked: 'Te han bloqueado!',
  date: 'Tienes una cita!',
  friendzoned: 'Te han friendzoneado!',
  isTyping: '{name} está escribiendo...',
  rejected: 'Te han rechazado!',
  selectScenario: 'Elige un scenario',
  tryAgain: 'Inténtalo de nuevo',
  tryAnother: 'Prueba otro scenario',
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
