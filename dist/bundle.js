/*!
 * measure.js v1.0.0
 * Copyright (c) 2021 weijian zhu
 * Released under the MIT License.
*/
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var config = {
  DashedColor: '#5392FC',
  selectedDomBorderColor: '#ED5666',
  targetDomBorderColor: '#0A91FC',
  markerColor: '#ED5666'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);

/***/ }),

/***/ "./src/marker.ts":
/*!***********************!*\
  !*** ./src/marker.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "placeMarkOutside": () => (/* binding */ placeMarkOutside),
/* harmony export */   "placeMark": () => (/* binding */ placeMark),
/* harmony export */   "removeMarks": () => (/* binding */ removeMarks)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ "./src/config.ts");


function createLine(width, height, top, left, text) {
  var border = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'none';
  var marker = document.createElement('span');
  marker.style.backgroundColor = _config__WEBPACK_IMPORTED_MODULE_0__["default"].markerColor;
  marker.style.position = 'fixed';
  marker.classList.add("measure-js-marker");
  marker.style.width = "".concat(width, "px");
  marker.style.height = "".concat(height, "px");

  if (border === 'x') {
    marker.style.borderLeft = '1px solid rgba(255, 255, 255, .8)';
    marker.style.borderRight = '1px solid rgba(255, 255, 255, .8)';
  }

  if (border === 'y') {
    marker.style.borderTop = '1px solid rgba(255, 255, 255, .8)';
    marker.style.borderBottom = '1px solid rgba(255, 255, 255, .8)';
  }

  marker.style.pointerEvents = 'none';
  marker.style.top = "".concat(top, "px");
  marker.style.left = "".concat(left, "px");
  marker.style.zIndex = '9998';
  marker.style.boxSizing = 'content-box';
  var value = document.createElement('span');
  value.classList.add("measure-js-value");
  value.style.backgroundColor = _config__WEBPACK_IMPORTED_MODULE_0__["default"].markerColor;
  value.style.color = 'white';
  value.style.fontSize = '10px';
  value.style.display = 'inline-block';
  value.style.fontFamily = 'Helvetica, sans-serif';
  value.style.fontWeight = 'bold';
  value.style.borderRadius = '20px';
  value.style.position = 'fixed';
  value.style.width = '42px';
  value.style.lineHeight = '15px';
  value.style.height = '16px';
  value.style.textAlign = 'center';
  value.style.zIndex = '10000';
  value.style.pointerEvents = 'none';
  value.innerText = "".concat(parseInt(text), "px");
  value.style.boxSizing = 'content-box';

  if (border === 'x') {
    // 防止文字在屏幕外面
    var topOffset = top + height / 2 - 7; //超过屏幕高度

    if (topOffset > document.documentElement.clientHeight - 20) {
      topOffset = document.documentElement.clientHeight - 20;
    } //小于屏幕高度


    if (topOffset < 0) {
      topOffset = 6;
    }

    value.style.top = "".concat(topOffset, "px");
    value.style.left = "".concat(left + 6, "px");
  } else if (border === 'y') {
    var leftOffset = left + width / 2 - 20;

    if (leftOffset > document.documentElement.clientWidth - 48) {
      leftOffset = document.documentElement.clientWidth - 48;
    }

    if (leftOffset < 0) {
      leftOffset = 6;
    }

    value.style.top = "".concat(top + 6, "px");
    value.style.left = "".concat(leftOffset, "px");
  }

  document.body.appendChild(marker);
  document.body.appendChild(value);
}

function createDashLine(width, height, top, left) {
  var border = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'none';
  var marker = document.createElement('span');
  marker.style.position = 'fixed';
  marker.classList.add("measure-js-dashed-marker");
  marker.style.width = "".concat(width, "px");
  marker.style.height = "".concat(height, "px");

  if (border === 'x') {
    marker.style.background = "linear-gradient(to bottom, ".concat(_config__WEBPACK_IMPORTED_MODULE_0__["default"].DashedColor, ", ").concat(_config__WEBPACK_IMPORTED_MODULE_0__["default"].DashedColor, " 3px, transparent 3px, transparent)");
    marker.style.backgroundSize = '100% 5px';
  }

  if (border === 'y') {
    marker.style.background = "linear-gradient(to right, ".concat(_config__WEBPACK_IMPORTED_MODULE_0__["default"].DashedColor, ", ").concat(_config__WEBPACK_IMPORTED_MODULE_0__["default"].DashedColor, " 3px, transparent 3px, transparent)");
    marker.style.backgroundSize = '5px 100%';
  }

  marker.style.pointerEvents = 'none';
  marker.style.top = "".concat(top, "px");
  marker.style.left = "".concat(left, "px");
  marker.style.zIndex = '9998';
  marker.style.boxSizing = 'content-box';
  document.body.appendChild(marker);
}

function placeMarkOutside(rect1, rect2, direction, value) {
  //select dom 和 target dom 并集outside的情况
  if (rect1.outsideAndNOIntersection(rect2)) {
    //水平和垂直方向没有相交的情况
    // 水平方向
    {
      var xTop = (rect1.top + rect1.bottom) / 2;
      var xLeft = rect1.left > rect2.right ? rect2.right : rect1.right;
      var xHeight = 1;
      var xWidth = Math.abs(rect1.left > rect2.right ? rect1.left - rect2.right : rect2.left - rect1.right);
      createLine(xWidth, xHeight, xTop, xLeft, "".concat(xWidth, "px"), 'y'); //画虚线

      var top = rect2.top > rect1.bottom ? xTop : rect2.bottom;
      var height = Math.abs(rect2.top > rect1.bottom ? xTop - rect2.top : xTop - rect2.bottom);
      var width = 1;
      var left = rect2.left > rect1.right ? xLeft + xWidth : rect2.right;
      createDashLine(width, height, top, left, 'x');
    } //垂直方向

    {
      var yTop = rect1.top > rect2.bottom ? rect2.bottom : rect1.bottom;
      var yLeft = (rect1.left + rect1.right) / 2;
      var yHeight = Math.abs(rect1.top > rect2.bottom ? rect1.top - rect2.bottom : rect2.top - rect1.bottom);
      var yWidth = 1;
      createLine(yWidth, yHeight, yTop, yLeft, "".concat(yHeight, "px"), 'x'); //画虚线

      var _top = rect2.top > rect1.bottom ? yHeight + rect1.bottom : rect2.bottom;

      var _height = 1;

      var _width = Math.abs(rect2.left > rect1.right ? yLeft - rect2.left : yLeft - rect2.right);

      var _left = rect2.left > rect1.right ? yLeft : rect2.right;

      createDashLine(_width, _height, _top, _left, 'y');
    } //水平或者垂直方向空间上有相交的情况
  } else {
    if (!rect1.outsideAndNOIntersectionY(rect2)) {
      //垂直方向上有相交
      var _left2 = rect1.left > rect2.left ? (rect2.right + rect1.left) / 2 : (rect1.right + rect2.left) / 2;

      if (rect1.outsideIncludeY(rect2) || rect2.outsideIncludeY(rect1)) {
        _left2 = (rect2.width > rect1.width ? rect1.left + rect1.right : rect2.left + rect2.right) / 2;
      }

      var _height2 = Math.min(Math.abs(rect2.top - rect1.bottom), Math.abs(rect2.bottom - rect1.top));

      var _top2 = rect2.top > rect1.bottom ? rect1.bottom : rect2.bottom;

      var _width2 = 1;
      createLine(_width2, _height2, _top2, _left2, "".concat(_height2, "px"), 'x'); //---------

      {
        // 右对右的线
        var _xTop = rect2.right > rect1.right ? (rect1.top + rect1.bottom) / 2 : (rect2.top + rect2.bottom) / 2;

        var _xLeft = rect2.right > rect1.right ? rect1.right : rect2.right;

        var _xHeight = 1;

        var _xWidth = Math.abs(rect2.right - rect1.right);

        createLine(_xWidth, _xHeight, _xTop, _xLeft, "".concat(_xWidth, "px"), 'y'); //画虚线

        var _top3 = Math.min(_xTop, rect2.bottom, rect1.bottom);

        var _height3 = rect2.right > rect1.right ? Math.min(Math.abs(_xTop - rect2.top), Math.abs(_xTop - rect2.bottom)) : Math.min(Math.abs(_xTop - rect1.top), Math.abs(_xTop - rect1.bottom));

        var _width3 = 1;

        var _left3 = Math.max(rect1.right, rect2.right);

        createDashLine(_width3, _height3, _top3, _left3, 'x');
      }
      {
        // 左对左的线
        var _xTop2 = rect2.left > rect1.left ? (rect2.top + rect2.bottom) / 2 : (rect1.top + rect1.bottom) / 2;

        var _xLeft2 = rect2.left > rect1.left ? rect1.left : rect2.left;

        var _xHeight2 = 1;

        var _xWidth2 = Math.abs(rect2.left - rect1.left);

        createLine(_xWidth2, _xHeight2, _xTop2, _xLeft2, "".concat(_xWidth2, "px"), 'y'); //画虚线

        var _top4 = Math.min(_xTop2, rect2.bottom, rect1.bottom);

        var _height4 = rect2.left > rect1.left ? Math.min(Math.abs(_xTop2 - rect1.bottom), Math.abs(_xTop2 - rect1.top)) : Math.min(Math.abs(_xTop2 - rect2.bottom), Math.abs(_xTop2 - rect2.top));

        var _width4 = 1;

        var _left4 = Math.min(rect1.left, rect2.left);

        createDashLine(_width4, _height4, _top4, _left4, 'x');
      }
    } else if (!rect1.outsideAndNOIntersectionX(rect2)) {
      //水平方向上有相交
      var _top5 = rect1.top > rect2.top ? (rect2.bottom + rect1.top) / 2 : (rect1.bottom + rect2.top) / 2;

      if (rect1.outsideIncludeX(rect2) || rect2.outsideIncludeX(rect1)) {
        _top5 = (rect2.height > rect1.height ? rect1.top + rect1.bottom : rect2.top + rect2.bottom) / 2;
      }

      var _height5 = 1;

      var _left5 = rect2.left > rect1.right ? rect1.right : rect2.right;

      var _width5 = Math.min(Math.abs(rect2.left - rect1.right), Math.abs(rect2.right - rect1.left));

      createLine(_width5, _height5, _top5, _left5, "".concat(_width5, "px"), 'y');
      {
        //下对下
        var _xTop3 = rect2.bottom > rect1.bottom ? rect1.bottom : rect2.bottom;

        var _xLeft3 = rect2.bottom > rect1.bottom ? (rect1.left + rect1.right) / 2 : (rect2.left + rect2.right) / 2;

        var _xHeight3 = Math.abs(rect2.bottom - rect1.bottom);

        var _xWidth3 = 1;
        createLine(_xWidth3, _xHeight3, _xTop3, _xLeft3, "".concat(_xHeight3, "px"), 'x'); //画虚线

        var _top6 = Math.max(rect1.bottom, rect2.bottom);

        var _height6 = 1;

        var _width6 = rect2.bottom > rect1.bottom ? Math.min(Math.abs(_xLeft3 - rect2.left), Math.abs(_xLeft3 - rect2.right)) : Math.min(Math.abs(_xLeft3 - rect1.left), Math.abs(_xLeft3 - rect1.right));

        var _left6 = Math.min(_xLeft3, rect2.right, rect1.right);

        createDashLine(_width6, _height6, _top6, _left6, 'y');
      }
      {
        //left top
        //right bottom
        //width height
        //上对上
        var _xTop4 = rect2.top > rect1.top ? rect1.top : rect2.top;

        var _xLeft4 = rect2.top > rect1.top ? (rect2.left + rect2.right) / 2 : (rect1.left + rect1.right) / 2;

        var _xHeight4 = Math.abs(rect2.top - rect1.top);

        var _xWidth4 = 1;
        createLine(_xWidth4, _xHeight4, _xTop4, _xLeft4, "".concat(_xHeight4, "px"), 'x'); //画虚线

        var _top7 = Math.min(rect1.top, rect2.top);

        var _height7 = 1;

        var _width7 = rect2.top > rect1.top ? Math.min(Math.abs(_xLeft4 - rect1.right), Math.abs(_xLeft4 - rect1.left)) : Math.min(Math.abs(_xLeft4 - rect2.right), Math.abs(_xLeft4 - rect2.left));

        var _left7 = Math.min(_xLeft4, rect2.right, rect1.right);

        createDashLine(_width7, _height7, _top7, _left7, 'y');
      }
    }
  }
}
function placeMark(rect1, rect2, direction, value) {
  var _actions$direction;

  //select dom 和 target dom 交集的情况
  var actions = {
    top: function top() {
      var width = 1;
      var height = Math.abs(rect1.top - rect2.top);
      var left = Math.floor((Math.min(rect1.right, rect2.right) + Math.max(rect1.left, rect2.left)) / 2);
      var top = Math.min(rect1.top, rect2.top);
      createLine(width, height, top, left, value, 'x');
    },
    left: function left() {
      var width = Math.abs(rect1.left - rect2.left);
      var height = 1;
      var top = Math.floor((Math.min(rect1.bottom, rect2.bottom) + Math.max(rect1.top, rect2.top)) / 2);
      var left = Math.min(rect1.left, rect2.left);
      createLine(width, height, top, left, value, 'y');
    },
    right: function right() {
      var width = Math.abs(rect1.right - rect2.right);
      var height = 1;
      var top = Math.floor((Math.min(rect1.bottom, rect2.bottom) + Math.max(rect1.top, rect2.top)) / 2);
      var left = Math.min(rect1.right, rect2.right);
      createLine(width, height, top, left, value, 'y');
    },
    bottom: function bottom() {
      var width = 1;
      var height = Math.abs(rect1.bottom - rect2.bottom);
      var top = Math.min(rect1.bottom, rect2.bottom);
      var left = Math.floor((Math.min(rect1.right, rect2.right) + Math.max(rect1.left, rect2.left)) / 2);
      createLine(width, height, top, left, value, 'x');
    }
  };
  (_actions$direction = actions[direction]) === null || _actions$direction === void 0 ? void 0 : _actions$direction.call(actions);
}
function removeMarks() {
  document.querySelectorAll('.measure-js-marker').forEach(function (element) {
    element.remove();
  });
  document.querySelectorAll('.measure-js-dashed-marker').forEach(function (element) {
    element.remove();
  });
  document.querySelectorAll('.measure-js-value').forEach(function (element) {
    element.remove();
  });
}

/***/ }),

/***/ "./src/measure.ts":
/*!************************!*\
  !*** ./src/measure.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rect */ "./src/rect.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./src/config.ts");
/* harmony import */ var _placeholder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./placeholder */ "./src/placeholder.ts");
/* harmony import */ var _marker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./marker */ "./src/marker.ts");




var active = false;
var hoveringElement = null;
var selectedElement;
var targetElement;
var delayedDismiss = false;
var delayedRef = null;
var Spacing = {
  start: function start() {
    if (!document.body) {
      console.warn("\u521D\u59CB\u5316measure.js\u63D2\u4EF6\u5931\u8D25");
      return;
    }

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    window.addEventListener('mousemove', cursorMovedHandler);
  }
};

function keyDownHandler(e) {
  if (delayedDismiss) {
    cleanUp();

    if (delayedRef) {
      clearTimeout(delayedRef);
      delayedRef = null;
    }
  }

  if (e.key === 'Alt' && !active) {
    e.preventDefault();
    active = true;
    setSelectedElement(); //使用插件中禁用滚动

    preventPageScroll(true);
  }

  if (e.shiftKey) delayedDismiss = true;
}

function keyUpHandler(e) {
  if (e.key === 'Alt' && active) {
    active = false;
    delayedRef = setTimeout(function () {
      cleanUp();
    }, delayedDismiss ? 3000000 : 0);
  }
}

function cleanUp() {
  (0,_placeholder__WEBPACK_IMPORTED_MODULE_2__.clearPlaceholderElement)('selected');
  (0,_placeholder__WEBPACK_IMPORTED_MODULE_2__.clearPlaceholderElement)('target');
  delayedDismiss = false;
  selectedElement = null;
  targetElement = null;
  (0,_marker__WEBPACK_IMPORTED_MODULE_3__.removeMarks)();
  preventPageScroll(false);
}

function cursorMovedHandler(e) {
  if (e.composedPath) {
    //使用composedPath来检测悬停元素是否支持阴影DOM
    hoveringElement = e.composedPath()[0];
  } else {
    // 兼容方案
    hoveringElement = e.target;
  }

  if (!active) return;
  setTargetElement().then(function () {
    if (selectedElement != null && targetElement != null) {
      // 框选出select dom和target dom后，计算两者的间距
      var selectedElementRect = selectedElement.getBoundingClientRect();
      var targetElementRect = targetElement.getBoundingClientRect();
      var selected = new _rect__WEBPACK_IMPORTED_MODULE_0__["default"](selectedElementRect);
      var target = new _rect__WEBPACK_IMPORTED_MODULE_0__["default"](targetElementRect);
      (0,_marker__WEBPACK_IMPORTED_MODULE_3__.removeMarks)();
      var top, bottom, left, right; //select dom和target dom之间是否有接触或者在内部

      if (selected.containing(target) || selected.inside(target) || selected.colliding(target)) {
        top = Math.round(Math.abs(selectedElementRect.top - targetElementRect.top));
        bottom = Math.round(Math.abs(selectedElementRect.bottom - targetElementRect.bottom));
        left = Math.round(Math.abs(selectedElementRect.left - targetElementRect.left));
        right = Math.round(Math.abs(selectedElementRect.right - targetElementRect.right));
        (0,_marker__WEBPACK_IMPORTED_MODULE_3__.placeMark)(selected, target, 'top', "".concat(top, "px"));
        (0,_marker__WEBPACK_IMPORTED_MODULE_3__.placeMark)(selected, target, 'bottom', "".concat(bottom, "px"));
        (0,_marker__WEBPACK_IMPORTED_MODULE_3__.placeMark)(selected, target, 'left', "".concat(left, "px"));
        (0,_marker__WEBPACK_IMPORTED_MODULE_3__.placeMark)(selected, target, 'right', "".concat(right, "px"));
      } else {
        top = Math.round(Math.abs(selectedElementRect.top - targetElementRect.bottom));
        bottom = Math.round(Math.abs(selectedElementRect.bottom - targetElementRect.top));
        left = Math.round(Math.abs(selectedElementRect.left - targetElementRect.right));
        right = Math.round(Math.abs(selectedElementRect.right - targetElementRect.left));
        (0,_marker__WEBPACK_IMPORTED_MODULE_3__.placeMarkOutside)(selected, target, 'top', "".concat(top, "px"));
      }
    }
  });
}

function setSelectedElement() {
  if (hoveringElement && hoveringElement !== selectedElement) {
    selectedElement = hoveringElement;
    (0,_placeholder__WEBPACK_IMPORTED_MODULE_2__.clearPlaceholderElement)('selected');
    var rect = selectedElement.getBoundingClientRect();
    (0,_placeholder__WEBPACK_IMPORTED_MODULE_2__.createPlaceholderElement)('selected', rect.width, rect.height, rect.top, rect.left, _config__WEBPACK_IMPORTED_MODULE_1__["default"].selectedDomBorderColor);
  }
}

function setTargetElement() {
  return new Promise(function (resolve, reject) {
    //进入到这里一定是active=true的状态
    //如果hover = select，清空target所有的状态
    if (hoveringElement === selectedElement) {
      (0,_placeholder__WEBPACK_IMPORTED_MODULE_2__.clearPlaceholderElement)('target');
      (0,_marker__WEBPACK_IMPORTED_MODULE_3__.removeMarks)();
      targetElement = null;
      return;
    }

    if (hoveringElement && hoveringElement !== selectedElement && hoveringElement !== targetElement) {
      targetElement = hoveringElement;
      (0,_placeholder__WEBPACK_IMPORTED_MODULE_2__.clearPlaceholderElement)('target');
      var rect = targetElement.getBoundingClientRect();
      (0,_placeholder__WEBPACK_IMPORTED_MODULE_2__.createPlaceholderElement)('target', rect.width, rect.height, rect.top, rect.left, _config__WEBPACK_IMPORTED_MODULE_1__["default"].targetDomBorderColor);
      resolve();
    }
  });
}

function preventPageScroll(active) {
  if (active) {
    window.addEventListener('DOMMouseScroll', scrollingPreventDefault, false);
    window.addEventListener('wheel', scrollingPreventDefault, {
      passive: false
    });
    window.addEventListener('mousewheel', scrollingPreventDefault, {
      passive: false
    });
  } else {
    window.removeEventListener('DOMMouseScroll', scrollingPreventDefault);
    window.removeEventListener('wheel', scrollingPreventDefault);
    window.removeEventListener('mousewheel', scrollingPreventDefault);
  }
}

function scrollingPreventDefault(e) {
  e.preventDefault();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Spacing);

/***/ }),

/***/ "./src/placeholder.ts":
/*!****************************!*\
  !*** ./src/placeholder.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPlaceholderElement": () => (/* binding */ createPlaceholderElement),
/* harmony export */   "clearPlaceholderElement": () => (/* binding */ clearPlaceholderElement)
/* harmony export */ });
function createPlaceholderElement(type, width, height, top, left, color) {
  //创建select dom的框框
  var placeholder = document.createElement('div');
  placeholder.classList.add("measure-js-".concat(type, "-placeholder"));
  placeholder.style.border = "1px solid ".concat(color);
  placeholder.style.position = 'fixed';
  placeholder.style.background = 'none';
  placeholder.style.borderRadius = '2px';
  placeholder.style.padding = '0';
  placeholder.style.margin = '0';
  placeholder.style.width = "".concat(width - 1, "px");
  placeholder.style.height = "".concat(height - 1, "px");
  placeholder.style.top = "".concat(top - 0.5, "px");
  placeholder.style.left = "".concat(left - 0.5, "px");
  placeholder.style.pointerEvents = 'none';
  placeholder.style.zIndex = '9999';
  placeholder.style.boxSizing = 'content-box';
  document.body.appendChild(placeholder); //创建尺寸展示文本

  var dimension = document.createElement('span');
  dimension.style.background = color;
  dimension.style.position = 'fixed';
  dimension.style.display = 'inline-block';
  dimension.style.color = '#fff';
  dimension.style.padding = '2px 4px';
  dimension.style.fontSize = '10px';
  var arrow = '';
  var topOffset = top;

  if (top < 20) {
    //被select 的dom的top值小于0
    if (top < 0) {
      topOffset = 0;
      arrow = '↑'; // ↑标记为超出屏幕，表示select的dom左上角超出了视图（屏幕）
    }

    dimension.style.borderRadius = '2px 0 2px 0';
  } else {
    //+1px 是为了抵消1px的border
    dimension.style.transform = 'translateY(calc(-100% + 1px))';
    dimension.style.borderRadius = '2px 2px 0 0';
  } //-1 是为了和框选出来的border范围，左对齐


  dimension.style.top = "".concat(topOffset - 1, "px");
  dimension.style.left = "".concat(left - 1, "px");
  dimension.innerText = "".concat(arrow, " ").concat(Math.round(width), "px \xD7 ").concat(Math.round(height), "px");
  placeholder.appendChild(dimension);
}
function clearPlaceholderElement(type) {
  var _document$querySelect;

  (_document$querySelect = document.querySelector(".measure-js-".concat(type, "-placeholder"))) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.remove();
}

/***/ }),

/***/ "./src/rect.ts":
/*!*********************!*\
  !*** ./src/rect.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Rect)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Rect = /*#__PURE__*/function () {
  function Rect(rect) {
    _classCallCheck(this, Rect);

    this.top = rect.top;
    this.left = rect.left;
    this.width = rect.width;
    this.height = rect.height;
    this.right = rect.right;
    this.bottom = rect.bottom;
  }

  _createClass(Rect, [{
    key: "colliding",
    value: function colliding(other) {
      return !(this.top > other.bottom || this.right < other.left || this.bottom < other.top || this.left > other.right);
    }
  }, {
    key: "containing",
    value: function containing(other) {
      return this.left <= other.left && other.left < this.width && this.top <= other.top && other.top < this.height;
    }
  }, {
    key: "inside",
    value: function inside(other) {
      return other.top <= this.top && this.top <= other.bottom && other.top <= this.bottom && this.bottom <= other.bottom && other.left <= this.left && this.left <= other.right && other.left <= this.right && this.right <= other.right;
    }
  }, {
    key: "outsideAndNOIntersectionY",
    value: function outsideAndNOIntersectionY(other) {
      return this.left > other.right || other.left > this.right;
    }
  }, {
    key: "outsideAndNOIntersectionX",
    value: function outsideAndNOIntersectionX(other) {
      return this.top > other.bottom || other.top > this.bottom;
    }
  }, {
    key: "outsideAndNOIntersection",
    value: function outsideAndNOIntersection(other) {
      return this.outsideAndNOIntersectionY(other) && this.outsideAndNOIntersectionX(other);
    } //垂直方向上是否包含另外一个

  }, {
    key: "outsideIncludeY",
    value: function outsideIncludeY(other) {
      return this.right >= other.right && this.left <= other.left;
    } //水平方向上是否包含另外一个

  }, {
    key: "outsideIncludeX",
    value: function outsideIncludeX(other) {
      return this.bottom >= other.bottom && this.top <= other.top;
    }
  }]);

  return Rect;
}();



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
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _measure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./measure */ "./src/measure.ts");
 //入口

_measure__WEBPACK_IMPORTED_MODULE_0__["default"].start();
})();

window.measure = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=bundle.js.map