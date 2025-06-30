declare global {
  interface Window {
    axe: {
      run: Function;
    };
  }
}

window.axe = window.axe || {};
