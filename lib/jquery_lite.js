/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/lib/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);
	const $l = __webpack_require__(2);
	
	$l( () => {
	
	  let test = new $l("div");
	
	  $l.ajax({
	    url: "https://api.github.com/users/mralexgray/repos",
	    success: (data) => {
	      console.log(data.toString());
	    },
	    contentType: "text"
	  });
	
	
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

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
	  if(object instanceof DOMNodeCollection){
	    object.forEach( element => {
	      this.nodeList.forEach( node => {
	        node.innerHTML = node.innerHTML + element.outerHTML;
	      });
	    });
	  } else if (object instanceof String){
	    this.nodeList.forEach( node => {
	      node.innerHTML = node.innerHTML + object;
	    });
	  } else if (object instanceof HTMLElement){
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);
	
	function $l(selector) {
	  this.queueFunctions = [];
	
	  switch (selector.constructor) {
	    case String:
	      let nodeList = Array.from(document.querySelectorAll(selector));
	      let dom = new DOMNodeCollection(nodeList);
	      return dom;
	    case HTMLElement:
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


/***/ }
/******/ ]);
//# sourceMappingURL=jquery_lite.js.map