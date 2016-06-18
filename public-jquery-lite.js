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

function DOMNodeCollection(nodeList) {
  this.nodeList = nodeList;
}

DOMNodeCollection.prototype.html = function (string) {
  if (string === undefined) {
    return this.nodeList[0].innerHTML;
  } else {
    this.nodeList.forEach( (node) => {
      node.innerHTML = string;
    });
  }

  return this.nodeList;
};

DOMNodeCollection.prototype.empty = function () {
  this.nodeList.forEach( node => {
    node.innerHTML = "";
  });
};

DOMNodeCollection.prototype.append = function (object) {
  if(object.constructor === DOMNodeCollection){
    object.nodeList.forEach( element => {
      this.nodeList.forEach( node => {
        node.innerHTML = node.innerHTML + element.outerHTML;
      });
    });
  } else if (object.constructor === String){
    this.nodeList.forEach( node => {
      node.innerHTML = node.innerHTML + object;
    });
  } else if (object.constructor === HTMLElement){
    this.nodeList.forEach( node => {
      node.innerHTML = node.innerHTML + object.outerHTML;
    });
  }
};

DOMNodeCollection.prototype.attr = function (attr, value) {
  if(value === undefined){
    return this[0].getAttribute(attr);
  } else {
    this.nodeList.forEach( node => {
      node.setAttribute(attr, value);
    });
    return this.nodeList;
  }
};

DOMNodeCollection.prototype.addClass = function (string) {
  this.nodeList.forEach( node => {
    node.className += ` ${string}`;
  });
};

DOMNodeCollection.prototype.removeClass = function (string) {
  this.nodeList.forEach( node => {
    node.className = node.className.replace(string, "");
  });
};

DOMNodeCollection.prototype.children = function () {
  let result = [];

  this.nodeList.forEach((node) => {
    Array.from(node.children).forEach((child) => {
      result.push(child);
    });
  });

  return new DOMNodeCollection(result);
};

DOMNodeCollection.prototype.parent = function () {
  let result = this.nodeList.map( el => el.parentNode );
  return new DOMNodeCollection(result);
};

DOMNodeCollection.prototype.find = function (selector) {
  switch (selector.constructor) {
    case String:
      const el = this.findByString(selector);
      return new DOMNodeCollection(el);

    case HTMLElement:
      break;
    default:
      break;
  }
};

DOMNodeCollection.prototype.findByString = function (string) {
  let result = [];
  this.nodeList.forEach( node => {
    Array.from(node.querySelectorAll(string)).forEach( item => {
      result.push(item);
    });
  });
  return result;
};

DOMNodeCollection.prototype.remove = function () {
  while (this.nodeList.length > 0) {
    this.nodeList[0].outerHTML = "";
    this.nodeList.shift();
  }
};

DOMNodeCollection.prototype.on = function (event, callback) {
  this.nodeList.forEach(node => {
    node.addEventListener(event, callback);
  });
};

DOMNodeCollection.prototype.off = function (event, callback) {
  this.nodeList.forEach(node => {
    node.removeEventListener(event, callback);
  });
};
