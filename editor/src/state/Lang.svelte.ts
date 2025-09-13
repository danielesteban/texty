const en = {
  blocked: 'Blocked',
  confirmPassword: 'Confirm password',
  date: 'Date',
  friendzoned: 'Friendzoned',
  message: 'Message',
  password: 'Password',
  responses: 'Responses',
  signup: 'Create an account',
  signupAlternative: 'Already have an account?',
  signupError: 'Error creating account',
  signin: 'Sign in',
  signinAlternative: 'Need an account?',
  signinError: 'Error signing in',
  username: 'Username',
};

const es = {
  blocked: 'Bloqueado',
  confirmPassword: 'Confirmar contraseña',
  date: 'Cita',
  friendzoned: 'Friendzoned',
  message: 'Mensaje',
  password: 'Contraseña',
  responses: 'Respuestas',
  signup: 'Crear una cuenta',
  signupAlternative: 'Ya tienes una cuenta?',
  signupError: 'Error creando cuenta',
  signin: 'Iniciar sesión',
  signinAlternative: 'Necesitas una cuenta?',
  signinError: 'Error iniciando sesión',
  username: 'Usuario',
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
