import { CONSOLE_STYLES } from '$dev/console-styles';

export type SCRIPTS_ENV = 'local' | 'cdn';
export const ENV_NAMES: Record<SCRIPTS_ENV, string> = {
  local: 'Localhost',
  cdn: 'CDN',
};

const ENV_LOCALSTORAGE_ID = 'jsEnv';

window.SCRIPTS_ENV = getENV();

window.setScriptMode = (env) => {
  if (env !== 'local' && env !== 'cdn') {
    console.error(
      'Invalid environment. Pass %c`local`%c or %c`cdn`%c in the console',
      CONSOLE_STYLES.highlight,
      CONSOLE_STYLES.normal,
      CONSOLE_STYLES.highlight,
      CONSOLE_STYLES.normal
    );
    return;
  }

  localStorage.setItem(ENV_LOCALSTORAGE_ID, env);
  window.SCRIPTS_ENV = env;

  console.log(`Environment successfully set to %c${ENV_NAMES[env]}`, CONSOLE_STYLES.highlight);
};

function getENV(): SCRIPTS_ENV {
  let localStorageItem = localStorage.getItem(ENV_LOCALSTORAGE_ID) as SCRIPTS_ENV;

  if (localStorageItem === 'local') {
    fetch('http://localhost:3000', { method: 'HEAD', cache: 'no-store' }).catch(() => {
      console.log('Localhost server is not available, switching to production mode');
      localStorage.setItem(ENV_LOCALSTORAGE_ID, 'cdn');
      localStorageItem = 'cdn';
      window.SCRIPTS_ENV = 'cdn';
    });
  }

  return localStorageItem || 'cdn';
}

export function outputEnvSwitchLog(env: SCRIPTS_ENV) {
  if ('cdn' === env) {
    console.log(
      'To switch to dev mode and serve files from localhost, run %c`window.setScriptsENV("local")`%c in the console',
      CONSOLE_STYLES.highlight,
      CONSOLE_STYLES.normal
    );
  } else {
    console.log(
      'To switch to production mode, either run %c`window.setScriptsENV("cdn")`%c in the console or turn off localhost dev server',
      CONSOLE_STYLES.highlight,
      CONSOLE_STYLES.normal
    );
  }
}

export {};
