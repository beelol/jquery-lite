const DOMNodeCollection = require('./dom_node_collection.js');

function $l(input) {
  this.queueFunctions = [];
  
  if (input.constructor === String) {
    const nodeList = Array.from(document.querySelectorAll(input));
    console.log(nodeList);
    return new DOMNodeCollection(nodeList);
  } else if (input instanceof HTMLElement) {
    return new DOMNodeCollection([input]);
  } else if (input instanceof Function) {
    this.queueFunctions.push(input);
    const onReady = () => {
      this.queueFunctions.forEach( func => func() );
    };
    document.addEventListener("DOMContentLoaded", onReady.bind(this));
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
