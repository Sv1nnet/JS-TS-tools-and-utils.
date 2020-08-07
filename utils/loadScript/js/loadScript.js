/**
 * Create script html element and insert it into parentNode if it's provided or into <head> if it's not.
 * @param {String} url - url to load script 
 * @param {Object} [settings] - contains extra settings
 * @param {Object} [settings.options] - contains options for script element
 * @param {function} [settings.callback] - callback to execute after script loaded
 * @param {Node|Element} [settings.parentNode] - node where script should be appended
 */
function loadScript(url, settings) {
  const { options, callback, parentNode } = settings;

  var script = document.createElement('script')
  script.type = 'text/javascript';

  if (options) {
    for (const opt in options) {
      script[opt] = options[opt];
    }
  }

  if (script.readyState) {
    // handle IE
    script.onreadystatechange = function() {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null;
        if (callback) callback();
      }
    };
  } else {
    // handle other browsers
    script.onload = function() {
      if (callback) callback();
    };
  }

  script.src = url;

  if (parentNode) parentNode.appendChild(script);
  else document.getElementsByTagName('head')[0].appendChild(script);
}

export default loadScript;
