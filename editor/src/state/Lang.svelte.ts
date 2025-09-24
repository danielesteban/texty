const en = {
  collaborators: 'Collaborators',
  confirmPassword: 'Confirm password',
  createScenario: 'Create a new scenario',
  creator: 'Creator',
  description: 'Description',
  emptyCollaborators: 'You haven\'t added any collaborators yet.',
  emptyScenarios: 'You haven\'t created any scenarios yet.',
  failure: 'Failure',
  language: 'Language',
  message: 'Message',
  name: 'Name',
  password: 'Password',
  preview: 'Preview scenario',
  privacy: 'Privacy',
  private: 'Private',
  public: 'Public',
  responses: 'Responses',
  remove: 'Remove',
  resolution: 'Resolution',
  result: 'Result',
  selectScenario: 'Select a scenario',
  signup: 'Create an account',
  signupAlternative: 'Already have an account?',
  signupError: 'Error creating account',
  signin: 'Sign in',
  signinAlternative: 'Need an account?',
  signinError: 'Error signing in',
  status: 'Status',
  success: 'Success',
  username: 'Username',
};

const es = {
  collaborators: 'Colaboradores',
  confirmPassword: 'Confirmar contraseña',
  createScenario: 'Crear nuevo escenario',
  creator: 'Creador',
  description: 'Descripción',
  emptyCollaborators: 'Aún no has añadido ningún colaborador.',
  emptyScenarios: 'Aún no has creado ningún escenario.',
  failure: 'Fracaso',
  language: 'Idioma',
  message: 'Mensaje',
  name: 'Nombre',
  password: 'Contraseña',
  preview: 'Previsualizar escenario',
  privacy: 'Privacidad',
  private: 'Privado',
  public: 'Público',
  responses: 'Respuestas',
  remove: 'Eliminar',
  resolution: 'Resolución',
  result: 'Resultado',
  selectScenario: 'Elige un escenario',
  signup: 'Crear una cuenta',
  signupAlternative: 'Ya tienes una cuenta?',
  signupError: 'Error creando cuenta',
  signin: 'Iniciar sesión',
  signinAlternative: 'Necesitas una cuenta?',
  signinError: 'Error iniciando sesión',
  status: 'Estado',
  success: 'Éxito',
  username: 'Usuario',
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
  get locale() { return locale },
  set locale(value: keyof typeof locales) {
    locale = value;
    localStorage.setItem(key, locale);
  }
};
