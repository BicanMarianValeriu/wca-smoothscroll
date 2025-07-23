/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/*!**********************************************************!*\
  !*** ./inc/support/modules/smoothscroll/src/js/front.js ***!
  \**********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * --------------------------------------------------------------------------
 * SmoothScroll Plugin (Based on SmoothScroll v1.5.1 by Balazs Galambosi)
 *
 * @author 	Bican Marian Valeriu
 * @version 1.0.0
 * --------------------------------------------------------------------------
 */

const NAME = 'smoothscroll';
const DATA_KEY = `wp.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_SCROLL = `scroll${EVENT_KEY}`;
const EVENT_WHEEL = `wheel${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_LOAD = `load${EVENT_KEY}`;
const EVENT_CLICK = `click${EVENT_KEY}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
const EVENT_MOUSEDOWN = `mousedown${EVENT_KEY}`;
const DefaultType = {
  // Scrolling Core
  frameRate: 'number',
  animationTime: 'number',
  stepSize: 'number',
  // Pulse
  pulseAlgorithm: 'boolean',
  pulseScale: 'number',
  pulseNormalize: 'number',
  // Acceleration
  accelerationDelta: 'number',
  accelerationMax: 'number',
  // Keyboard Settings
  keyboardSupport: 'boolean',
  arrowScroll: 'number',
  // Custom settings
  behavior: 'string',
  offset: 'number'
};
const Default = {
  // Scrolling Core
  frameRate: 150,
  animationTime: 1000,
  stepSize: 100,
  // Pulse
  pulseAlgorithm: true,
  pulseScale: 4,
  pulseNormalize: 1,
  // Acceleration
  accelerationDelta: 50,
  accelerationMax: 3,
  // Keyboard Settings
  keyboardSupport: true,
  arrowScroll: 50,
  // Custom settings
  behavior: 'smooth',
  offset: 0
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((function (wecodeart) {
  const {
    Component,
    Events,
    Selector,
    fn: {
      getElement,
      getOptions
    }
  } = wecodeart;

  /**
   * Class definition
   */
  class SmoothScroll extends Component {
    constructor(element, config) {
      super(element, config);
      this._config = this._getConfig(config);
      this._init();
    }

    // Getters
    static get Default() {
      return Default;
    }
    static get DefaultType() {
      return DefaultType;
    }
    static get NAME() {
      return NAME;
    }

    // Public
    scrollTo(target, options = {
      offset: Selector.findOne('.wp-site-header.is-position-sticky')?.offsetHeight || 0
    }) {
      const targetElement = getElement(target);
      if (!targetElement) {
        console.warn('SmoothScroll: Target element not found:', target);
        return;
      }
      const config = {
        ...this._config,
        ...options
      };
      const scrollRoot = this._getScrollRoot();
      const targetPosition = targetElement.offsetTop - config.offset;
      if (config.behavior === 'smooth') {
        this._smoothScrollTo(targetPosition, scrollRoot);
      } else {
        window.scrollTo({
          top: targetPosition,
          behavior: config.behavior
        });
      }
    }
    destroy() {
      // Clear all timers
      this._clearAllTimers();

      // Remove all event listeners
      this._removeAllEventListeners();

      // Clear all caches
      this._clearAllCaches();

      // Disconnect observers
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }

      // Clear references
      this._wheelHandler = null;
      this._keydownHandler = null;
      this._mousedownHandler = null;
      this._clickHandler = null;
      this._refreshSize = null;
      super.dispose();
    }

    // Private
    _init() {
      // Get config from localized script if available
      if (typeof wecodeartSupportModulesSmoothscroll !== 'undefined') {
        this._config = {
          ...this._config,
          ...wecodeartSupportModulesSmoothscroll
        };
      }

      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this._config.behavior = 'auto';
        this._config.animationTime = 0;
      }
      this._setupVariables();
      this._addEventListeners();
      this._initSmoothScroll();
    }
    _initSmoothScroll() {
      if (this._initDone || !document.body) return;
      this._initDone = true;
      this._initTest();
      this._setupFrameDetection();
    }
    _initTest() {
      // Browser compatibility checks
      this._isEnabledForBrowser = this._isEnabledForBrowserCheck();
    }
    _setupFrameDetection() {
      if (top !== self) {
        this._isFrame = true;
      }
    }
    _setupVariables() {
      this._isFrame = false;
      this._direction = {
        x: 0,
        y: 0
      };
      this._initDone = false;
      this._root = document.documentElement;
      this._activeElement = document.body;
      this._observer = null;
      this._deltaBuffer = [];
      this._deltaBufferTimer = null;
      this._isMac = /^Mac/.test(navigator.platform);
      this._que = [];
      this._pending = false;
      this._lastScroll = Date.now();

      // Use WeakMap for better memory management - allows garbage collection
      this._cacheX = new WeakMap();
      this._cacheY = new WeakMap();
      this._clearCacheTimer = null;
      this._resizeTimer = null;
      this._smoothBehaviorForElement = new WeakMap();

      // Performance optimizations
      this._wheelHandler = this._handleWheel.bind(this);
      this._keydownHandler = this._handleKeydown.bind(this);
      this._mousedownHandler = this._handleMousedown.bind(this);
      this._clickHandler = this._handleClick.bind(this);
      this._refreshSize = this._handleResize.bind(this);
    }
    _addEventListeners() {
      // Add event listeners to anchor links
      Events.on(document, EVENT_CLICK, this._clickHandler);

      // Wheel event
      if (this._config.keyboardSupport) {
        Events.on(document, EVENT_KEYDOWN, this._keydownHandler);
      }
      Events.on(document, EVENT_MOUSEDOWN, this._mousedownHandler);

      // Use native addEventListener for wheel event to support passive: false
      window.addEventListener('wheel', this._wheelHandler, {
        passive: false,
        capture: true
      });

      // Add resize listener to clear caches when window size changes
      Events.on(window, EVENT_RESIZE, this._refreshSize);
    }
    _handleClick(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link || link.getAttribute('href') === '#') {
        return;
      }
      e.preventDefault();
      this.scrollTo(link.getAttribute('href'));
    }
    _handleResize() {
      // Debounce resize events to prevent excessive cache clearing
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(() => {
        this._clearAllCaches();
      }, 250); // Wait 250ms after resize stops
    }
    _handleMousedown(e) {
      this._activeElement = this._getEventTargetDeep(e);
    }
    _handleKeydown(event) {
      try {
        const target = this._getEventTargetDeep(event);
        const modifier = event.ctrlKey || event.altKey || event.metaKey || event.shiftKey && event.code !== 'Space';

        // Do nothing if user is editing text or using a modifier key
        const inputNodeNames = /^(textarea|select|embed|object)$/i;
        const buttonTypes = /^(button|submit|radio|checkbox|file|color|image)$/i;
        if (event.defaultPrevented || inputNodeNames.test(target.nodeName) || this._isNodeName(target, 'input') && !buttonTypes.test(target.type) || this._isNodeName(this._activeElement, 'video') || target.isContentEditable || modifier) {
          return true;
        }
        const overflowing = this._overflowingAncestor(this._activeElement);
        if (!overflowing) {
          return true;
        }
        const clientHeight = overflowing.clientHeight;
        let x = 0,
          y = 0;
        switch (event.code) {
          case 'ArrowUp':
            y = -this._config.arrowScroll;
            break;
          case 'ArrowDown':
            y = this._config.arrowScroll;
            break;
          case 'Space':
            const shift = event.shiftKey ? 1 : -1;
            y = -shift * clientHeight * 0.9;
            break;
          case 'PageUp':
            y = -clientHeight * 0.9;
            break;
          case 'PageDown':
            y = clientHeight * 0.9;
            break;
          case 'Home':
            y = -overflowing.scrollTop;
            break;
          case 'End':
            const scroll = overflowing.scrollHeight - overflowing.scrollTop;
            const scrollRemaining = scroll - clientHeight;
            y = scrollRemaining > 0 ? scrollRemaining + 10 : 0;
            break;
          case 'ArrowLeft':
            x = -this._config.arrowScroll;
            break;
          case 'ArrowRight':
            x = this._config.arrowScroll;
            break;
          default:
            return true;
        }
        this._scrollArray(overflowing, x, y);
        event.preventDefault();
        this._scheduleClearCache();
      } catch (error) {
        console.warn('SmoothScroll: Error in keydown handler:', error);
        return true; // Allow default behavior
      }
    }
    _handleWheel(event) {
      try {
        if (!this._shouldHandleWheel(event)) return true;
        const deltas = this._calculateDeltas(event);
        const overflowing = this._findOverflowingElement(event.target);
        if (!overflowing) return true;
        this._processScroll(overflowing, deltas);
        event.preventDefault();
      } catch (error) {
        console.warn('SmoothScroll: Error in wheel handler:', error);
        return true; // Allow default behavior
      }
    }
    _shouldHandleWheel(event) {
      try {
        if (!this._initDone) {
          this._initSmoothScroll();
        }
        const target = this._getEventTargetDeep(event);

        // Leave early if default action is prevented or it's a zooming event with CTRL
        if (event.defaultPrevented || event.ctrlKey) {
          return false; // Do not process wheel if default action is prevented
        }

        // Leave embedded content alone
        if (this._isNodeName(this._activeElement, 'embed') || this._isNodeName(target, 'embed') && /\.pdf/i.test(target.src) || this._isNodeName(this._activeElement, 'object')) {
          return false; // Do not process wheel if it's an embedded content
        }
        return true; // Allow processing if none of the above conditions are met
      } catch (error) {
        console.warn('SmoothScroll: Error in wheel handler:', error);
        return false; // Do not process wheel on error
      }
    }
    _calculateDeltas(event) {
      let deltaX = -event.wheelDeltaX || event.deltaX || 0;
      let deltaY = -event.wheelDeltaY || event.deltaY || 0;
      if (this._isMac) {
        if (event.wheelDeltaX && this._isDivisible(event.wheelDeltaX, 120)) {
          deltaX = -120 * (event.wheelDeltaX / Math.abs(event.wheelDeltaX));
        }
        if (event.wheelDeltaY && this._isDivisible(event.wheelDeltaY, 120)) {
          deltaY = -120 * (event.wheelDeltaY / Math.abs(event.wheelDeltaY));
        }
      }

      // Use wheelDelta if deltaX/Y is not available
      if (!deltaX && !deltaY) {
        deltaY = -event.wheelDelta || 0;
      }

      // Line based scrolling (Firefox mostly)
      if (event.deltaMode === 1) {
        deltaX *= 40;
        deltaY *= 40;
      }
      return {
        deltaX,
        deltaY
      };
    }
    _findOverflowingElement(target) {
      const elems = [];
      const body = document.body;
      const rootScrollHeight = this._root.scrollHeight;
      while (target) {
        const cached = this._getCache(target, false);
        if (cached) {
          return this._setCache(elems, cached);
        }
        elems.push(target);
        if (rootScrollHeight === target.scrollHeight) {
          const topOverflowsNotHidden = this._overflowNotHidden(this._root) && this._overflowNotHidden(body);
          const isOverflowCSS = topOverflowsNotHidden || this._overflowAutoOrScroll(this._root);
          if (this._isFrame && this._isContentOverflowing(this._root) || !this._isFrame && isOverflowCSS) {
            return this._setCache(elems, this._getScrollRoot());
          }
        } else if (this._isContentOverflowing(target) && this._overflowAutoOrScroll(target)) {
          return this._setCache(elems, target);
        }
        // Support shadow DOM
        target = target.parentElement || target.getRootNode && target.getRootNode().host;
      }
      return null; // No scrollable ancestor found
    }
    _processScroll(overflowing, deltas) {
      let {
        deltaX,
        deltaY
      } = deltas;
      if (this._config.accelerationMax !== 1) {
        const now = Date.now();
        const elapsed = now - this._lastScroll;
        if (elapsed < this._config.accelerationDelta) {
          const factor = (1 + 50 / elapsed) / 2;
          if (factor > 1) {
            const maxFactor = Math.min(factor, this._config.accelerationMax);
            deltaX *= maxFactor;
            deltaY *= maxFactor;
          }
        }
        this._lastScroll = Date.now();
      }

      // Push a scroll command
      this._que.push({
        x: deltaX,
        y: deltaY,
        lastX: deltaX < 0 ? 0.99 : -0.99,
        lastY: deltaY < 0 ? 0.99 : -0.99,
        start: Date.now()
      });

      // Don't act if there's a pending queue
      if (this._pending) {
        return;
      }
      const scrollRoot = this._getScrollRoot();
      const isWindowScroll = overflowing === scrollRoot || overflowing === document.body;

      // If we haven't already fixed the behavior, and it needs fixing for this session
      if (overflowing.$scrollBehavior == null && this._isScrollBehaviorSmooth(overflowing)) {
        overflowing.$scrollBehavior = overflowing.style.scrollBehavior;
        overflowing.style.scrollBehavior = 'auto';
      }
      const step = time => {
        const now = Date.now();
        let scrollX = 0;
        let scrollY = 0;
        for (let i = 0; i < this._que.length; i++) {
          const item = this._que[i];
          const elapsed = now - item.start;
          const finished = elapsed >= this._config.animationTime;

          // Scroll position: [0, 1]
          let position = finished ? 1 : elapsed / this._config.animationTime;

          // Easing [optional]
          if (this._config.pulseAlgorithm) {
            position = this._pulse(position);
          }

          // Only need the difference
          const x = item.x * position - item.lastX >> 0;
          const y = item.y * position - item.lastY >> 0;

          // Add this to the total scrolling
          scrollX += x;
          scrollY += y;

          // Update last values
          item.lastX += x;
          item.lastY += y;

          // Delete and step back if it's over
          if (finished) {
            this._que.splice(i, 1);
            i--;
          }
        }

        // Scroll left and top
        if (isWindowScroll) {
          window.scrollBy(scrollX, scrollY);
        } else {
          if (scrollX) overflowing.scrollLeft += scrollX;
          if (scrollY) overflowing.scrollTop += scrollY;
        }

        // Clean up if there's nothing left to do
        if (!deltaX && !deltaY) {
          this._que = [];
        }
        if (this._que.length) {
          this._requestFrame(step, overflowing, 1000 / this._config.frameRate + 1);
        } else {
          this._pending = false;
          // Restore default behavior at the end of scrolling session
          if (overflowing.$scrollBehavior != null) {
            overflowing.style.scrollBehavior = overflowing.$scrollBehavior;
            overflowing.$scrollBehavior = null;
          }
        }
      };

      // Start a new queue of actions
      this._requestFrame(step, overflowing, 0);
      this._pending = true;
    }
    _scrollArray(elem, left, top) {
      this._directionCheck(left, top);
      if (this._config.accelerationMax !== 1) {
        const now = Date.now();
        const elapsed = now - this._lastScroll;
        if (elapsed < this._config.accelerationDelta) {
          const factor = (1 + 50 / elapsed) / 2;
          if (factor > 1) {
            const maxFactor = Math.min(factor, this._config.accelerationMax);
            left *= maxFactor;
            top *= maxFactor;
          }
        }
        this._lastScroll = Date.now();
      }

      // Push a scroll command
      this._que.push({
        x: left,
        y: top,
        lastX: left < 0 ? 0.99 : -0.99,
        lastY: top < 0 ? 0.99 : -0.99,
        start: Date.now()
      });

      // Don't act if there's a pending queue
      if (this._pending) {
        return;
      }
      const scrollRoot = this._getScrollRoot();
      const isWindowScroll = elem === scrollRoot || elem === document.body;

      // If we haven't already fixed the behavior, and it needs fixing for this session
      if (elem.$scrollBehavior == null && this._isScrollBehaviorSmooth(elem)) {
        elem.$scrollBehavior = elem.style.scrollBehavior;
        elem.style.scrollBehavior = 'auto';
      }
      const step = time => {
        const now = Date.now();
        let scrollX = 0;
        let scrollY = 0;
        for (let i = 0; i < this._que.length; i++) {
          const item = this._que[i];
          const elapsed = now - item.start;
          const finished = elapsed >= this._config.animationTime;

          // Scroll position: [0, 1]
          let position = finished ? 1 : elapsed / this._config.animationTime;

          // Easing [optional]
          if (this._config.pulseAlgorithm) {
            position = this._pulse(position);
          }

          // Only need the difference
          const x = item.x * position - item.lastX >> 0;
          const y = item.y * position - item.lastY >> 0;

          // Add this to the total scrolling
          scrollX += x;
          scrollY += y;

          // Update last values
          item.lastX += x;
          item.lastY += y;

          // Delete and step back if it's over
          if (finished) {
            this._que.splice(i, 1);
            i--;
          }
        }

        // Scroll left and top
        if (isWindowScroll) {
          window.scrollBy(scrollX, scrollY);
        } else {
          if (scrollX) elem.scrollLeft += scrollX;
          if (scrollY) elem.scrollTop += scrollY;
        }

        // Clean up if there's nothing left to do
        if (!left && !top) {
          this._que = [];
        }
        if (this._que.length) {
          this._requestFrame(step, elem, 1000 / this._config.frameRate + 1);
        } else {
          this._pending = false;
          // Restore default behavior at the end of scrolling session
          if (elem.$scrollBehavior != null) {
            elem.style.scrollBehavior = elem.$scrollBehavior;
            elem.$scrollBehavior = null;
          }
        }
      };

      // Start a new queue of actions
      this._requestFrame(step, elem, 0);
      this._pending = true;
    }
    _smoothScrollTo(targetPosition, scrollRoot) {
      const currentScroll = scrollRoot === document.documentElement ? window.pageYOffset : scrollRoot.scrollTop;
      this._scrollArray(scrollRoot, 0, targetPosition - currentScroll);
    }
    _directionCheck(x, y) {
      x = x > 0 ? 1 : -1;
      y = y > 0 ? 1 : -1;
      if (this._direction.x !== x || this._direction.y !== y) {
        this._direction.x = x;
        this._direction.y = y;
        this._que = [];
        this._lastScroll = 0;
      }
    }
    _isContentOverflowing(el) {
      return el.clientHeight + 10 < el.scrollHeight;
    }
    _overflowingAncestor(el) {
      const elems = [];
      const body = document.body;
      const rootScrollHeight = this._root.scrollHeight;
      while (el) {
        const cached = this._getCache(el, false);
        if (cached) {
          return this._setCache(elems, cached);
        }
        elems.push(el);
        if (rootScrollHeight === el.scrollHeight) {
          const topOverflowsNotHidden = this._overflowNotHidden(this._root) && this._overflowNotHidden(body);
          const isOverflowCSS = topOverflowsNotHidden || this._overflowAutoOrScroll(this._root);
          if (this._isFrame && this._isContentOverflowing(this._root) || !this._isFrame && isOverflowCSS) {
            return this._setCache(elems, this._getScrollRoot());
          }
        } else if (this._isContentOverflowing(el) && this._overflowAutoOrScroll(el)) {
          return this._setCache(elems, el);
        }
        // Support shadow DOM
        el = el.parentElement || el.getRootNode && el.getRootNode().host;
      }
    }
    _overflowNotHidden(el) {
      const overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
      return overflow !== 'hidden';
    }
    _overflowAutoOrScroll(el) {
      const overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
      return overflow === 'scroll' || overflow === 'auto';
    }
    _isScrollBehaviorSmooth(el) {
      if (!this._smoothBehaviorForElement.has(el)) {
        const scrollBehavior = getComputedStyle(el, '')['scroll-behavior'];
        this._smoothBehaviorForElement.set(el, 'smooth' == scrollBehavior);
      }
      return this._smoothBehaviorForElement.get(el);
    }
    _getScrollRoot() {
      if (!this._scrollRoot) {
        this._scrollRoot = document.scrollingElement;
        if (!this._scrollRoot) {
          const dummy = document.createElement('div');
          dummy.style.cssText = 'height:10000px;width:1px;';
          document.body.appendChild(dummy);
          const bodyScrollTop = document.body.scrollTop;
          const docElScrollTop = document.documentElement.scrollTop;
          window.scrollBy(0, 3);
          if (document.body.scrollTop !== bodyScrollTop) {
            this._scrollRoot = document.body;
          } else {
            this._scrollRoot = document.documentElement;
          }
          window.scrollBy(0, -3);
          document.body.removeChild(dummy);
        }
      }
      return this._scrollRoot;
    }
    _setCache(elems, overflowing, x = false) {
      const cache = x ? this._cacheX : this._cacheY;
      for (let i = elems.length; i--;) {
        // WeakMap uses the element itself as the key for better memory management
        cache.set(elems[i], overflowing);
      }
      return overflowing;
    }
    _getCache(el, x) {
      const cache = x ? this._cacheX : this._cacheY;
      // WeakMap uses the element itself as the key
      return cache.get(el);
    }
    _scheduleClearCache() {
      // WeakMap automatically handles garbage collection when elements are removed
      // No need to manually clear - just clear the timer
      clearTimeout(this._clearCacheTimer);
      this._clearCacheTimer = null;
    }
    _isTouchpad(deltaY) {
      if (!deltaY) return false;
      if (!this._deltaBuffer.length) {
        this._deltaBuffer = [deltaY, deltaY, deltaY];
      }
      deltaY = Math.abs(deltaY);
      this._deltaBuffer.push(deltaY);
      this._deltaBuffer.shift();
      clearTimeout(this._deltaBufferTimer);
      this._deltaBufferTimer = setTimeout(() => {
        try {
          localStorage.SS_deltaBuffer = this._deltaBuffer.join(',');
        } catch (e) {}
      }, 1000);
      const dpiScaledWheelDelta = deltaY > 120 && this._allDeltasDivisableBy(deltaY);
      const tp = !this._allDeltasDivisableBy(120) && !this._allDeltasDivisableBy(100) && !dpiScaledWheelDelta;
      if (deltaY < 50) return true;
      return tp;
    }
    _isDivisible(n, divisor) {
      return Math.floor(n / divisor) == n / divisor;
    }
    _allDeltasDivisableBy(divisor) {
      return this._isDivisible(this._deltaBuffer[0], divisor) && this._isDivisible(this._deltaBuffer[1], divisor) && this._isDivisible(this._deltaBuffer[2], divisor);
    }
    _pulse(x) {
      if (x >= 1) return 1;
      if (x <= 0) return 0;
      if (this._config.pulseNormalize == 1) {
        this._config.pulseNormalize /= this._pulse_(1);
      }
      return this._pulse_(x);
    }
    _pulse_(x) {
      let val, start, expx;
      x = x * this._config.pulseScale;
      if (x < 1) {
        val = x - (1 - Math.exp(-x));
      } else {
        start = Math.exp(-1);
        x -= 1;
        expx = 1 - Math.exp(-x);
        val = start + expx * (1 - start);
      }
      return val * this._config.pulseNormalize;
    }
    _requestFrame(callback, element, delay) {
      return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback, element, delay) {
        window.setTimeout(callback, delay || 1000 / 60);
      })(callback, element, delay);
    }
    _getEventTargetDeep(event) {
      return event.composedPath ? event.composedPath()[0] : event.target;
    }
    _isNodeName(el, tag) {
      return el && (el.nodeName || '').toLowerCase() === tag.toLowerCase();
    }
    _isEnabledForBrowserCheck() {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;

      // More comprehensive browser detection
      const browserInfo = this._detectBrowser(userAgent, platform);
      return this._isBrowserSupported(browserInfo);
    }
    _isBrowserSupported(browserInfo) {
      const allowedBrowsers = ['Mobile', 'Edge', 'Chrome', 'Safari', 'Firefox', 'IEWin7', 'other'];
      if (browserInfo.isMobile) return allowedBrowsers.indexOf('Mobile') >= 0;
      if (browserInfo.isEdge) return allowedBrowsers.indexOf('Edge') >= 0;
      if (browserInfo.isChrome) return allowedBrowsers.indexOf('Chrome') >= 0;
      if (browserInfo.isSafari) return allowedBrowsers.indexOf('Safari') >= 0;
      if (browserInfo.isFirefox) return allowedBrowsers.indexOf('Firefox') >= 0;
      if (browserInfo.isIEWin7) return allowedBrowsers.indexOf('IEWin7') >= 0;
      return allowedBrowsers.indexOf('other') >= 0;
    }
    _detectBrowser(userAgent, platform) {
      const isEdge = /Edge/.test(userAgent);
      const isChrome = /chrome/i.test(userAgent) && !isEdge;
      const isSafari = /safari/i.test(userAgent) && !isEdge;
      const isFirefox = /firefox/i.test(userAgent);
      const isMobile = /mobile/i.test(userAgent);
      const isIEWin7 = /Windows NT 6.1/i.test(userAgent) && /rv:11/i.test(userAgent);
      const isOldSafari = isSafari && (/Version\/8/i.test(userAgent) || /Version\/9/i.test(userAgent));
      return {
        isEdge,
        isChrome,
        isSafari,
        isFirefox,
        isMobile,
        isIEWin7,
        isOldSafari
      };
    }
    _clearAllTimers() {
      clearTimeout(this._deltaBufferTimer);
      clearTimeout(this._clearCacheTimer);
      clearTimeout(this._resizeTimer);
    }
    _clearAllCaches() {
      // WeakMap doesn't have clear() method - it automatically handles garbage collection
      // Just clear the arrays and reset state
      this._deltaBuffer = [];
      this._que = [];
      this._pending = false;
    }
    _removeAllEventListeners() {
      Events.off(document, EVENT_CLICK, this._clickHandler);
      Events.off(document, EVENT_KEYDOWN, this._keydownHandler);
      Events.off(document, EVENT_MOUSEDOWN, this._mousedownHandler);
      Events.off(window, EVENT_RESIZE, this._refreshSize);
      Events.off(window, EVENT_LOAD, this._initSmoothScroll);
      window.removeEventListener('wheel', this._wheelHandler, {
        passive: false,
        capture: true
      });
    }
    _getConfig(config) {
      config = {
        ...Default,
        ...getOptions(this._element),
        ...config
      };
      this._typeCheckConfig(config);
      return config;
    }
  }

  /**
   * @static
   * @memberof Component
   */
  wecodeart.plugins.SmoothScroll = SmoothScroll;

  // Auto initialize
  Events.on(document, 'DOMContentLoaded', () => {
    // Initialize smooth scroll for the document
    new SmoothScroll(document.documentElement);
  });
}).apply(undefined, [window.wecodeart]));
/******/ })()
;
//# sourceMappingURL=front.js.map