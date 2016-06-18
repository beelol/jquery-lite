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
    object.forEach( element => {
      this.nodeList.forEach( node => {
        node.innerHTML = node.innerHTML + element.outerHTML;
      });
    });
  } else if (object.constructor === String){
    console.log("apppending");
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

module.exports = DOMNodeCollection;
