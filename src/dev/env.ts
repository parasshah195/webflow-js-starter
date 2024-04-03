import type { SCRIPTS_ENV } from 'global';

const ENV_LOCALSTORAGE_ID = 'jsEnv';

export const ENV_NAMES = {
  dev: 'Development',
  prod: 'Production',
};

window.SCRIPTS_ENV = getENV();

window.setScriptsENV = (env) => {
  if (env !== 'dev' && env !== 'prod') {
    console.error('Invalid environment. Pass `dev` or `prod`');
    return;
  }

  localStorage.setItem(ENV_LOCALSTORAGE_ID, env);
  window.SCRIPTS_ENV = env;

  console.log(`Environment successfully set to ${ENV_NAMES[env]}`);
};

function getENV(): SCRIPTS_ENV {
  const localStorageItem = localStorage.getItem(ENV_LOCALSTORAGE_ID) as SCRIPTS_ENV;
  return localStorageItem || 'prod';
}

export function outputEnvSwitchLog(env: SCRIPTS_ENV) {
  if ('prod' === env) {
    console.log(
      'To switch to dev mode and serve files from localhost, run `window.setScriptsENV("dev")` in the console'
    );
  } else {
    console.log(
      'To switch to production mode and serve files from CDN, either run `window.setScriptsENV("prod")` in the console or turn off localhost dev server'
    );
  }
}

export {};
