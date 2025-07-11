/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************************************************!*\
  !*** ./inc/support/modules/smoothscroll/src/js/admin.js ***!
  \**********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * @package: 	WeCodeArt SmoothScroll Admin
 * @author: 	Bican Marian Valeriu
 * @license:	https://www.wecodeart.com/
 * @version:	1.0.0
 */

const {
  i18n: {
    __
  },
  hooks: {
    addFilter
  },
  components: {
    Placeholder,
    Card,
    CardHeader,
    CardBody,
    Spinner,
    Button,
    TextControl,
    BaseControl,
    RangeControl,
    SelectControl,
    ToggleControl,
    __experimentalHStack: HStack,
    __experimentalVStack: VStack,
    __experimentalNumberControl: NumberControl
  },
  element: {
    useState
  },
  blockEditor: {
    useSetting
  }
} = wp;
addFilter('wecodeart.admin.tabs.plugins', 'wecodeart/smoothscroll/admin/panel', optionsPanel);
function optionsPanel(panels) {
  return [...panels, {
    name: 'wca-smoothscroll',
    title: __('Smooth Scroll', 'wecodeart'),
    render: props => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Options, {
      ...props
    })
  }];
}
const Options = props => {
  const {
    settings,
    saveSettings,
    isRequesting,
    createNotice
  } = props;
  if (isRequesting || !settings) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Placeholder, {
      icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Spinner, {}),
      label: __('Loading', 'wecodeart'),
      instructions: __('Please wait, loading settings...', 'wecodeart')
    });
  }
  const apiOptions = (({
    smoothscroll
  }) => smoothscroll)(settings);
  const [loading, setLoading] = useState(null);
  const [formData, setFormData] = useState(apiOptions);
  const handleSave = async () => {
    setLoading(true);
    try {
      await saveSettings({
        smoothscroll: formData
      });
      createNotice('success', __('Smooth scroll settings saved successfully.', 'wecodeart'));
    } catch (error) {
      createNotice('error', __('Failed to save settings.', 'wecodeart'));
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    setFormData(apiOptions);
    createNotice('info', __('Settings reset.', 'wecodeart'));
  };
  const updateConfig = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
      className: "grid",
      style: {
        '--wca--columns': 2
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "g-col-1",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(Card, {
          className: "border shadow-none",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CardHeader, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h5", {
              className: "text-uppercase fw-medium m-0",
              children: __('Core Settings', 'wecodeart')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CardBody, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(VStack, {
              spacing: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(NumberControl, {
                label: __('Frame Rate', 'wecodeart'),
                value: formData?.frameRate || 150,
                onChange: value => updateConfig('frameRate', parseInt(value)),
                min: 30,
                max: 300,
                step: 10,
                help: __('Animation frame rate (30-300). Higher values = smoother animation.', 'wecodeart')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(NumberControl, {
                label: __('Animation Duration', 'wecodeart'),
                value: formData?.animationTime || 1000,
                onChange: value => updateConfig('animationTime', parseInt(value)),
                min: 100,
                max: 5000,
                step: 100,
                help: __('Duration of scroll animations in milliseconds.', 'wecodeart')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(NumberControl, {
                label: __('Step Size', 'wecodeart'),
                value: formData?.stepSize || 100,
                onChange: value => updateConfig('stepSize', parseInt(value)),
                min: 10,
                max: 500,
                step: 10,
                help: __('Scroll step size in pixels.', 'wecodeart')
              })]
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(Card, {
          className: "border shadow-none mt-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CardHeader, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h5", {
              className: "text-uppercase fw-medium m-0",
              children: __('Pulse Settings', 'wecodeart')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CardBody, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(VStack, {
              spacing: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ToggleControl, {
                label: __('Enable Pulse Algorithm', 'wecodeart'),
                checked: formData?.pulseAlgorithm !== false,
                onChange: value => updateConfig('pulseAlgorithm', value),
                help: __('Use pulse algorithm for smoother acceleration.', 'wecodeart')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(NumberControl, {
                label: __('Pulse Scale', 'wecodeart'),
                value: formData?.pulseScale || 4,
                onChange: value => updateConfig('pulseScale', parseInt(value)),
                min: 1,
                max: 10,
                step: 1,
                help: __('Pulse algorithm scale factor.', 'wecodeart')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(NumberControl, {
                label: __('Pulse Normalize', 'wecodeart'),
                value: formData?.pulseNormalize || 1,
                onChange: value => updateConfig('pulseNormalize', parseInt(value)),
                min: 1,
                max: 10,
                step: 1,
                help: __('Pulse algorithm normalization factor.', 'wecodeart')
              })]
            })
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "g-col-1",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(Card, {
          className: "border shadow-none",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CardHeader, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h5", {
              className: "text-uppercase fw-medium m-0",
              children: __('Acceleration Settings', 'wecodeart')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CardBody, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(VStack, {
              spacing: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(NumberControl, {
                label: __('Acceleration Delta', 'wecodeart'),
                value: formData?.accelerationDelta || 50,
                onChange: value => updateConfig('accelerationDelta', parseInt(value)),
                min: 10,
                max: 200,
                step: 10,
                help: __('Acceleration delta for scroll speed changes.', 'wecodeart')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(NumberControl, {
                label: __('Acceleration Max', 'wecodeart'),
                value: formData?.accelerationMax || 3,
                onChange: value => updateConfig('accelerationMax', parseInt(value)),
                min: 1,
                max: 10,
                step: 1,
                help: __('Maximum acceleration multiplier.', 'wecodeart')
              })]
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(Card, {
          className: "border shadow-none mt-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CardHeader, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h5", {
              className: "text-uppercase fw-medium m-0",
              children: __('Keyboard Settings', 'wecodeart')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CardBody, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(VStack, {
              spacing: 4,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(ToggleControl, {
                label: __('Enable Keyboard Support', 'wecodeart'),
                checked: formData?.keyboardSupport !== false,
                onChange: value => updateConfig('keyboardSupport', value),
                help: __('Enable keyboard navigation (arrow keys, space, page up/down).', 'wecodeart')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(NumberControl, {
                label: __('Arrow Scroll Distance', 'wecodeart'),
                value: formData?.arrowScroll || 50,
                onChange: value => updateConfig('arrowScroll', parseInt(value)),
                min: 10,
                max: 200,
                step: 10,
                help: __('Distance to scroll with arrow keys in pixels.', 'wecodeart')
              })]
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(Card, {
          className: "border shadow-none mt-4",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CardHeader, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h5", {
              className: "text-uppercase fw-medium m-0",
              children: __('Page Exclusions', 'wecodeart')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(CardBody, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(TextControl, {
              label: __('Exclude Pages', 'wecodeart'),
              value: formData?.excludeIds || '',
              onChange: value => updateConfig('excludeIds', value),
              placeholder: __('e.g., 1, 5, 10, 25', 'wecodeart'),
              help: __('Enter object IDs separated by commas to exclude them from smooth scrolling.', 'wecodeart')
            })
          })]
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("hr", {
      style: {
        margin: '20px 0'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(HStack, {
      spacing: 3,
      style: {
        justifyContent: 'flex-end'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Button, {
        isSecondary: true,
        onClick: handleReset,
        disabled: loading,
        children: __('Reset Settings', 'wecodeart')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Button, {
        isPrimary: true,
        onClick: handleSave,
        disabled: loading,
        children: loading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Spinner, {}) : __('Save Settings', 'wecodeart')
      })]
    })]
  });
};
})();

/******/ })()
;
//# sourceMappingURL=admin.js.map