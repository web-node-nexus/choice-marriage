/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/scripts/script.js":
/*!**********************************!*\
  !*** ./assets/scripts/script.js ***!
  \**********************************/
/***/ (() => {

var slickslideElem = document.querySelectorAll('.slick-slide');
var eyeIconElem = document.querySelectorAll('.eye-icon');
var dataIndex = 1;
var bannerSlide = function bannerSlide() {
  slickslideElem.forEach(function (item) {
    // console.log(item.getAttribute('data-index'));
    if (item.getAttribute('data-index') === dataIndex.toString()) {
      item.classList.remove('custom-none');
      item.classList.add('custom-block');
      item.classList.add('active');
    } else {
      item.classList.remove('custom-block');
      item.classList.add('custom-none');
      item.classList.remove('active');
    }
  });
  dataIndex++;
  if (dataIndex >= 8) {
    dataIndex = 1;
  }
};
bannerSlide();
setInterval(bannerSlide, 5000);
document.getElementById('sign-in-btn').addEventListener('click', function (e) {
  e.target.classList.remove('bg-[#575556]');
  e.target.classList.add('bg-[#D10A11]');
  document.getElementById('register-btn').classList.remove('bg-[#D10A11]');
  document.getElementById('register-btn').classList.add('bg-[#575556]');
  document.querySelector('.form-btns .App').style.display = 'none';
  document.querySelector('.form-btns .font-segeo').style.display = 'block';
});
document.getElementById('register-btn').addEventListener('click', function (e) {
  e.target.classList.remove('bg-[#575556]');
  e.target.classList.add('bg-[#D10A11]');
  document.getElementById('sign-in-btn').classList.remove('bg-[#D10A11]');
  document.getElementById('sign-in-btn').classList.add('bg-[#575556]');
  document.querySelector('.form-btns .font-segeo').style.display = 'none';
  document.querySelector('.form-btns .App').style.display = 'block';
});
eyeIconElem.forEach(function (item) {
  item.addEventListener('click', function (e) {
    if (e.target.src !== 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABkklEQVR4nO1Uu0pDQRBNYaf4alUEBYM/IeKvqJVfYKF+Sh57ThYXIU1QECRibCxMYZFGxcJWxQdqGTlkhHW95NEECxcGLnfOnJk9M7O53P/50yeEMA1gC0CN5D3JT7N7/ZNPmIGJ6/X6CIBtAG8k291MGGEV0xe5c24WwEVEcAxg3TmXL5fLozJ96598Ee5CsV3JAcyTvLWAGwArvQoShuS1JboVRyYwhDAGoGXAs0KhMPnt897PATgg+SoDUNUtotgJAKdWWEtcWZWUDNCMAb5D/pih/5N8SYFN4yiluq+a48N7v5gkPjBfrVgszkhnkoeWJMRYxYpDPnHGJA0L2E1vxo4s7biBqtzwLxn4HSuokZVgZ5AEAJ4zpN77leBbIpLvJBeSgKr5DpXEenJkJPuJREu2iD8liptM8lKzHiXPq6EZTX6Ib+WcGyd5ldnkdEw1chq9RJIgzWWqPCYnOUXyvOuYpoum5eln0SqVyhqAu56L1u2pILnhvV9WZTJ9A9gEcDLQUzGUx24oz/X/Ger5At4LNcVmBGWNAAAAAElFTkSuQmCC') {
      document.querySelectorAll('#password').forEach(function (elem) {
        elem.setAttribute('type', 'text');
      });
      e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABkklEQVR4nO1Uu0pDQRBNYaf4alUEBYM/IeKvqJVfYKF+Sh57ThYXIU1QECRibCxMYZFGxcJWxQdqGTlkhHW95NEECxcGLnfOnJk9M7O53P/50yeEMA1gC0CN5D3JT7N7/ZNPmIGJ6/X6CIBtAG8k291MGGEV0xe5c24WwEVEcAxg3TmXL5fLozJ96598Ee5CsV3JAcyTvLWAGwArvQoShuS1JboVRyYwhDAGoGXAs0KhMPnt897PATgg+SoDUNUtotgJAKdWWEtcWZWUDNCMAb5D/pih/5N8SYFN4yiluq+a48N7v5gkPjBfrVgszkhnkoeWJMRYxYpDPnHGJA0L2E1vxo4s7biBqtzwLxn4HSuokZVgZ5AEAJ4zpN77leBbIpLvJBeSgKr5DpXEenJkJPuJREu2iD8liptM8lKzHiXPq6EZTX6Ib+WcGyd5ldnkdEw1chq9RJIgzWWqPCYnOUXyvOuYpoum5eln0SqVyhqAu56L1u2pILnhvV9WZTJ9A9gEcDLQUzGUx24oz/X/Ger5At4LNcVmBGWNAAAAAElFTkSuQmCC';
    } else {
      document.querySelectorAll('#password').forEach(function (elem) {
        elem.setAttribute('type', 'password');
      });
      e.target.src = 'https://kalyanmatrimony.com/static/media/passwordeye.6e939f25292da30a783eb7f9cd773e66.svg';
    }
  });
});
function darken_screen(yesno) {
  if (yesno == true) {
    document.querySelector('.screen-darken').classList.add('active');
  } else if (yesno == false) {
    document.querySelector('.screen-darken').classList.remove('active');
  }
}
function close_offcanvas() {
  darken_screen(false);
  document.querySelector('.mobile-offcanvas.show').classList.remove('show');
  document.body.classList.remove('offcanvas-active');
}
function show_offcanvas(offcanvas_id) {
  darken_screen(true);
  document.getElementById(offcanvas_id).classList.add('show');
  document.body.classList.add('offcanvas-active');
}
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('[data-trigger]').forEach(function (everyelement) {
    var offcanvas_id = everyelement.getAttribute('data-trigger');
    everyelement.addEventListener('click', function (e) {
      e.preventDefault();
      show_offcanvas(offcanvas_id);
    });
  });
  document.querySelectorAll('.btn-close').forEach(function (everybutton) {
    everybutton.addEventListener('click', function (e) {
      close_offcanvas();
    });
  });
  document.querySelector('.screen-darken').addEventListener('click', function (event) {
    close_offcanvas();
  });
});

/***/ }),

/***/ "./assets/styles/style.scss":
/*!**********************************!*\
  !*** ./assets/styles/style.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/styles/home.scss":
/*!*********************************!*\
  !*** ./assets/styles/home.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/styles/chat.scss":
/*!*********************************!*\
  !*** ./assets/styles/chat.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/styles/pricing-plan.scss":
/*!*****************************************!*\
  !*** ./assets/styles/pricing-plan.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/script": 0,
/******/ 			"home": 0,
/******/ 			"pricing-plan": 0,
/******/ 			"chat": 0,
/******/ 			"style": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkmatrimony_2_clone"] = self["webpackChunkmatrimony_2_clone"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["home","pricing-plan","chat","style"], () => (__webpack_require__("./assets/scripts/script.js")))
/******/ 	__webpack_require__.O(undefined, ["home","pricing-plan","chat","style"], () => (__webpack_require__("./assets/styles/style.scss")))
/******/ 	__webpack_require__.O(undefined, ["home","pricing-plan","chat","style"], () => (__webpack_require__("./assets/styles/home.scss")))
/******/ 	__webpack_require__.O(undefined, ["home","pricing-plan","chat","style"], () => (__webpack_require__("./assets/styles/chat.scss")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["home","pricing-plan","chat","style"], () => (__webpack_require__("./assets/styles/pricing-plan.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;