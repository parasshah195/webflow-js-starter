const DEBUG_MODE_LOCALSTORAGE_ID = 'IS_DEBUG_MODE';

window.IS_DEBUG_MODE = getDebugMode();

window.setDebugMode = (mode) => {
  localStorage.setItem(DEBUG_MODE_LOCALSTORAGE_ID, mode.toString());
};

export function getDebugMode(): boolean {
  const localStorageItem = localStorage.getItem(DEBUG_MODE_LOCALSTORAGE_ID);
  if (localStorageItem && localStorageItem === 'true') {
    return true;
  }
  return false;
}

const status = window.IS_DEBUG_MODE ? 'enabled' : 'disabled';
console.log(`Debug mode is ${status}`);
console.log(
  `To ${window.IS_DEBUG_MODE ? 'disable' : 'enable'} debug mode and show debug logs, run \`window.setDebugMode(${window.IS_DEBUG_MODE ? 'false' : 'true'})\` in the console`
);
