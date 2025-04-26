import type { Webflow } from '@finsweet/ts-utils';
import type GSAP from 'gsap';
import type ScrollTrigger from 'gsap/ScrollTrigger';

import type { SCRIPTS_ENV } from '$dev/env';
import type { loadExternalScript } from '$utils/external-script-embed';

declare global {
  /** GSAP and sub-libs loading from Webflow CDN */
  gsap: GSAP;
  ScrollTrigger: typeof ScrollTrigger;

  interface Window {
    JS_SCRIPTS: Set<string> | undefined;
    Webflow: Webflow;

    SCRIPTS_ENV: SCRIPTS_ENV;
    setScriptMode(env: SCRIPTS_ENV): void;

    IS_DEBUG_MODE: boolean;
    setDebugMode(mode: boolean): void;

    PRODUCTION_BASE: string;

    loadExternalScript: typeof loadExternalScript;
  }

  // Extend `querySelector` and `querySelectorAll` function to stop the nagging of converting `Element` to `HTMLElement` all the time
  interface ParentNode {
    querySelector<E extends HTMLElement = HTMLElement>(selectors: string): E | null;
    querySelectorAll<E extends HTMLElement = HTMLElement>(selectors: string): NodeListOf<E>;
  }
}

export {};
