/**
 * Entry point for the build system.
 * Fetches scripts from localhost or production site depending on the setup
 * Polls `localhost` on page load, else falls back to deriving code from production URL
 */
import './dev/scripts-source';

// Add ScriptOptions and ScriptListItem types for global use
interface ScriptOptions {
  placement: 'head' | 'body';
  defer: boolean;
  isModule: boolean;
  scriptName?: string;
}

window.PRODUCTION_BASE = 'https://cdn.jsdelivr.net/gh/igniteagency/{{repo}}/dist/prod/';

/**
 * Loads a script either from the JS repo, or accepts a direct library URL too
 * Examples:
 * ```ts
 * window.loadScript('global.js');
 * window.loadScript('https://cdn.jsdelivr.net/npm/some-lib@1.0.0/dist/index.js', {
 *   placement: 'head',
 *   scriptName: 'some-lib',
 * });
 * ```
 * @param url - The URL of the script to load
 * @param options - The options for the script
 * @returns A promise that resolves when the script is loaded
 */
window.loadScript = function (url, options): Promise<void> {
  const opts: ScriptOptions = { placement: 'body', isModule: true, defer: true, ...options };

  if (document.querySelector(`script[src="${url}"]`)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    if (opts.isModule) script.type = 'module';
    if (opts.defer) script.defer = true;
    script.onload = () => {
      if (opts.scriptName) {
        document.dispatchEvent(
          new CustomEvent(`scriptLoaded:${opts.scriptName}`, {
            detail: { url, scriptName: opts.scriptName },
          })
        );
      }
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));

    document[opts.placement].appendChild(script);
  });
};
