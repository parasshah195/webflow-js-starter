import type { Webflow } from '@finsweet/ts-utils';

export type SCRIPTS_SOURCES = 'local' | 'cdn';

declare global {
  interface Window {
    JS_SCRIPTS: Set<string> | undefined;
    Webflow: Webflow;

    SCRIPTS_ENV: ENV;
    setScriptSource(env: ENV): void;

    IS_DEBUG_MODE: boolean;
    setDebugMode(mode: boolean): void;

    PRODUCTION_BASE: string;

    loadExternalScript(url: string, placement: 'head' | 'body', defer: boolean): void;
  }

  // Extend `querySelector` and `querySelectorAll` function to stop the nagging of converting `Element` to `HTMLElement` all the time
  interface ParentNode {
    querySelector<E extends HTMLElement = HTMLElement>(selectors: string): E | null;
    querySelectorAll<E extends HTMLElement = HTMLElement>(selectors: string): NodeListOf<E>;
  }
}

export {};
