
export type TScriptElementAttributes = {
  async: boolean;
  crossOrigin: string | null;
  defer: boolean;
  src: string;
  text: string;
  type: string;
}

export interface HTMLScriptElementInIE extends HTMLScriptElement {
  readyState: 'loaded' | 'complete';
  onreadystatechange: Function;
}

export type TSettings = {
  options: TScriptElementAttributes;
  callback: Function;
  parentNode: HTMLElement;
}


export type TLoadScript = (url: string, settings: TSettings) => void;

/**
 * Create script html element and insert it into parentNode if it's provided or into <head> if it's not.
 * @param url script src value
 * @param settings contains options - script attributes, callback to execute after script was loaded, and parentNode that will be a container for the script element
 */
const loadScript: TLoadScript = function loadScript(url, settings) {
  const { options, callback, parentNode } = settings;

  const script = document.createElement('script') as HTMLScriptElementInIE;
  script.type = 'text/javascript';

  if (options) {
    for (const opt in options) {
      script[opt] = options[opt];
    }
  }

  if (script.readyState) {
    // handle IE
    script.onreadystatechange = function () {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null;
        if (callback) callback();
      }
    };
  } else {
    // handle other browsers
    script.onload = function () {
      if (callback) callback();
    };
  }

  script.src = url;

  if (parentNode) parentNode.appendChild(script);
  else document.getElementsByTagName('head')[0].appendChild(script);
}

export default loadScript;
