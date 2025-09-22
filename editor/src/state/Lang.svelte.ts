const en = {
  blocked: 'Blocked',
  collaborators: 'Collaborators',
  confirmPassword: 'Confirm password',
  createScenario: 'Create a new scenario',
  creator: 'Creator',
  date: 'Date',
  description: 'Description',
  friendzoned: 'Friendzoned',
  message: 'Message',
  password: 'Password',
  responses: 'Responses',
  rejected: 'Rejected',
  remove: 'Remove',
  resolution: 'Resolution',
  selectScenario: 'Select a scenario',
  signup: 'Create an account',
  signupAlternative: 'Already have an account?',
  signupError: 'Error creating account',
  signin: 'Sign in',
  signinAlternative: 'Need an account?',
  signinError: 'Error signing in',
  status: 'Status',
  title: 'Title',
  username: 'Username',
};

const es = {
  blocked: 'Bloqueado',
  collaborators: 'Colaboradores',
  confirmPassword: 'Confirmar contraseña',
  createScenario: 'Crear nuevo escenario',
  creator: 'Creador',
  date: 'Cita',
  description: 'Descripción',
  friendzoned: 'Friendzoned',
  message: 'Mensaje',
  password: 'Contraseña',
  responses: 'Respuestas',
  rejected: 'Rechazado',
  remove: 'Eliminar',
  resolution: 'Resolución',
  selectScenario: 'Elige un escenario',
  signup: 'Crear una cuenta',
  signupAlternative: 'Ya tienes una cuenta?',
  signupError: 'Error creando cuenta',
  signin: 'Iniciar sesión',
  signinAlternative: 'Necesitas una cuenta?',
  signinError: 'Error iniciando sesión',
  status: 'Estado',
  title: 'Título',
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
