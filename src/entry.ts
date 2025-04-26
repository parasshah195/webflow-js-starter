/**
 * Entry point for the build system.
 * Fetches scripts from localhost or production site depending on the setup
 * Polls `localhost` on page load, else falls back to deriving code from production URL
 */
import { CONSOLE_STYLES } from '$dev/console-styles';

import { SCRIPTS_LOADED_EVENT } from './constants';
import './dev/scripts-source';

const LOCALHOST_BASE = 'http://localhost:3000/';
window.PRODUCTION_BASE = 'https://cdn.jsdelivr.net/gh/igniteagency/{{repo}}/dist/prod/';

window.JS_SCRIPTS = new Set();

const SCRIPT_LOAD_PROMISES: Array<Promise<unknown>> = [];

// init adding scripts to the page
window.addEventListener('DOMContentLoaded', addJS);

/**
 * Adds all the set scripts to the `window.JS_SCRIPTS` Set
 */
function addJS() {
  console.log(`Current script loading source: ${window.SCRIPTS_ENV}`);

  if (window.SCRIPTS_ENV === 'local') {
    console.log(
      "To run JS scripts from production CDN, execute %c`window.setScriptMode('cdn')`%c in the browser console",
      CONSOLE_STYLES.highlight,
      CONSOLE_STYLES.normal
    );
    fetchLocalScripts();
  } else {
    console.log(
      "To run JS scripts from localhost, execute %c`window.setScriptMode('local')`%c in the browser console",
      CONSOLE_STYLES.highlight,
      CONSOLE_STYLES.normal
    );
    appendScripts();
  }
}

function appendScripts() {
  const BASE = window.SCRIPTS_ENV === 'local' ? LOCALHOST_BASE : window.PRODUCTION_BASE;

  window.JS_SCRIPTS?.forEach((url) => {
    const script = document.createElement('script');
    script.src = BASE + url;
    script.defer = true;

    const promise = new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => {
        console.error(`Failed to load script: ${url}`);
        reject;
      };
    });

    SCRIPT_LOAD_PROMISES.push(promise);

    document.body.appendChild(script);
  });

  Promise.allSettled(SCRIPT_LOAD_PROMISES).then(() => {
    console.debug('All scripts loaded');
    // Add a small delay to ensure all scripts have had a chance to execute
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(SCRIPTS_LOADED_EVENT));
    }, 50);
  });
}

function fetchLocalScripts() {
  const LOCALHOST_CONNECTION_TIMEOUT_IN_MS = 150;
  const localhostFetchController = new AbortController();

  const localhostFetchTimeout = setTimeout(() => {
    localhostFetchController.abort();
  }, LOCALHOST_CONNECTION_TIMEOUT_IN_MS);

  fetch(LOCALHOST_BASE, {
    method: 'HEAD',
    cache: 'no-store',
    signal: localhostFetchController.signal,
  })
    .then((response) => {
      if (!response.ok) {
        console.error({ response });
        throw new Error('localhost response not ok');
      }
    })
    .catch(() => {
      console.error('localhost not resolved. Switching to production');
      window.setScriptMode('cdn');
    })
    .finally(() => {
      clearTimeout(localhostFetchTimeout);
      appendScripts();
    });
}
