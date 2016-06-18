const DOMNodeCollection = require('./dom_node_collection.js');

function $l(selector) {
  this.queueFunctions = [];

  switch (selector.constructor) {
    case String:
      console.log("selected a string");
      let nodeList = Array.from(document.querySelectorAll(selector));
      let dom = new DOMNodeCollection(nodeList);
      return dom;
    case HTMLElement:
    console.log("selected a html element");
      let arr = [];
      arr.push(selector);
      return new DOMNodeCollection(arr);
    case Function:
      this.queueFunctions.push(selector);
      const onReady = () => {
        this.queueFunctions.forEach( func => func() );
      };
      document.addEventListener("DOMContentLoaded", onReady.bind(this));
      break;
    default:
      break;
  }
}

$l.extend = function (first, ...objects) {
  objects.forEach( object => {
    Object.keys(object).forEach( key => {
      first[key] = object[key];
    });
  });
  return first;
};

$l.ajax = function(options) {
  const defaults = {
    success: function() { console.log("it worked dude"); },
    error: function() { console.log("o shit"); },
    url: "/",
    method: "GET",
    data: {},
    contentType: "json"
  };

  options = $l.extend(defaults, options);

  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    // math success
    console.log(xhr.response);
    // const response = xhr.response;
    const response = (options.contentType.toLowerCase() === "json" ? xhr.response : JSON.stringify(xhr.response));
    if (Math.floor(xhr.status / 100) === 2) {
      options.success(response);
    } else {
      options.error(response);
    }
  };

  xhr.open(options.method, options.url);
  xhr.responseType = options.contentType;
  xhr.send(options.data);
};

module.exports = $l;
