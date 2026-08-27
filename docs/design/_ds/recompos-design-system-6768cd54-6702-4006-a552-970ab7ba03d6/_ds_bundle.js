/* @ds-bundle: {"namespace":"RecompOS","components":[{"name":"BottomNav","sourcePath":"components/shared/BottomNav/BottomNav.jsx"},{"name":"Button","sourcePath":"components/primitives/Button/Button.jsx"},{"name":"Card","sourcePath":"components/primitives/Card/Card.jsx"},{"name":"Field","sourcePath":"components/primitives/Field/Field.jsx"},{"name":"Input","sourcePath":"components/primitives/Input/Input.jsx"},{"name":"LineChart","sourcePath":"components/charts/LineChart/LineChart.jsx"},{"name":"Progress","sourcePath":"components/primitives/Progress/Progress.jsx"},{"name":"QuickActionFab","sourcePath":"components/shared/QuickActionFab/QuickActionFab.jsx"},{"name":"ScreenHeader","sourcePath":"components/shared/ScreenHeader/ScreenHeader.jsx"},{"name":"Segmented","sourcePath":"components/primitives/Segmented/Segmented.jsx"},{"name":"Sheet","sourcePath":"components/primitives/Sheet/Sheet.jsx"},{"name":"Textarea","sourcePath":"components/primitives/Textarea/Textarea.jsx"},{"name":"Toast","sourcePath":"components/shared/Toast/Toast.jsx"},{"name":"ToggleRow","sourcePath":"components/primitives/ToggleRow/ToggleRow.jsx"},{"name":"UpdatePrompt","sourcePath":"components/shared/UpdatePrompt/UpdatePrompt.jsx"}],"sourceHashes":{"components/shared/BottomNav/BottomNav.jsx":"a52ea3d7f689","components/shared/BottomNav/BottomNav.d.ts":"82298c0ebdb0","components/shared/BottomNav/BottomNav.prompt.md":"ac72eeb9d081","components/primitives/Button/Button.jsx":"f3e328c263d9","components/primitives/Button/Button.d.ts":"cf21d82d9e48","components/primitives/Button/Button.prompt.md":"146682b3db5c","components/primitives/Card/Card.jsx":"2291d6fcea49","components/primitives/Card/Card.d.ts":"f0eb3f995bce","components/primitives/Card/Card.prompt.md":"185f626d589b","components/primitives/Field/Field.jsx":"d4d63b0b65ab","components/primitives/Field/Field.d.ts":"f94cd86e49ea","components/primitives/Field/Field.prompt.md":"4a29d9be6794","components/primitives/Input/Input.jsx":"70ffa742136e","components/primitives/Input/Input.d.ts":"e74d5ea0781d","components/primitives/Input/Input.prompt.md":"1d6a36e6ce98","components/charts/LineChart/LineChart.jsx":"e5f77407b91c","components/charts/LineChart/LineChart.d.ts":"01a9b82492f0","components/charts/LineChart/LineChart.prompt.md":"5881d021488f","components/primitives/Progress/Progress.jsx":"87e6974b75d6","components/primitives/Progress/Progress.d.ts":"a03d67c177d9","components/primitives/Progress/Progress.prompt.md":"5c1e1ae53b88","components/shared/QuickActionFab/QuickActionFab.jsx":"4b4fc19f8d5b","components/shared/QuickActionFab/QuickActionFab.d.ts":"cd5ed8fdb5a1","components/shared/QuickActionFab/QuickActionFab.prompt.md":"10f02180f02c","components/shared/ScreenHeader/ScreenHeader.jsx":"1523b3c52ec4","components/shared/ScreenHeader/ScreenHeader.d.ts":"d0d4d6a6cbe6","components/shared/ScreenHeader/ScreenHeader.prompt.md":"559f7a92ead2","components/primitives/Segmented/Segmented.jsx":"ca3d67a654f7","components/primitives/Segmented/Segmented.d.ts":"044107163627","components/primitives/Segmented/Segmented.prompt.md":"dda25e5dce15","components/primitives/Sheet/Sheet.jsx":"815363e17bb6","components/primitives/Sheet/Sheet.d.ts":"85adfb7c4689","components/primitives/Sheet/Sheet.prompt.md":"eede7f4abb80","components/primitives/Textarea/Textarea.jsx":"e7cc07262e15","components/primitives/Textarea/Textarea.d.ts":"00160403f918","components/primitives/Textarea/Textarea.prompt.md":"981b75a2b495","components/shared/Toast/Toast.jsx":"3d4b366675c6","components/shared/Toast/Toast.d.ts":"094ff9f70fe0","components/shared/Toast/Toast.prompt.md":"a82c18b26fee","components/primitives/ToggleRow/ToggleRow.jsx":"33d4b6b6f386","components/primitives/ToggleRow/ToggleRow.d.ts":"e9e7cc9d201b","components/primitives/ToggleRow/ToggleRow.prompt.md":"9d670fc66da8","components/shared/UpdatePrompt/UpdatePrompt.jsx":"dd68ee189688","components/shared/UpdatePrompt/UpdatePrompt.d.ts":"954c93dc318f","components/shared/UpdatePrompt/UpdatePrompt.prompt.md":"4fc754e8d77d"},"inlinedExternals":["@remix-run/router","class-variance-authority","clsx","dexie","dexie-react-hooks","lucide-react","react-router","react-router-dom","tailwind-merge","use-sync-external-store","zustand"],"builtBy":"cc-design-sync"} */
"use strict";
var RecompOS = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // <define:import.meta.env>
  var define_import_meta_env_default;
  var init_define_import_meta_env = __esm({
    "<define:import.meta.env>"() {
      define_import_meta_env_default = { MODE: "development", DEV: true, PROD: false, SSR: false, BASE_URL: "/" };
    }
  });

  // shim:react-shim
  var require_react_shim = __commonJS({
    "shim:react-shim"(exports, module) {
      init_define_import_meta_env();
      var R = window.React;
      function np(p, k) {
        var o = {};
        for (var x in p) if (x !== "children") o[x] = p[x];
        if (k !== void 0) o.key = k;
        return o;
      }
      function jsx15(t2, p, k) {
        var c = p && p.children;
        return c === void 0 ? R.createElement(t2, np(p, k)) : R.createElement(t2, np(p, k), c);
      }
      function jsxs10(t2, p, k) {
        return R.createElement.apply(R, [t2, np(p, k)].concat(p.children));
      }
      module.exports = R;
      module.exports.jsx = jsx15;
      module.exports.jsxs = jsxs10;
      module.exports.jsxDEV = function(t2, p, k, s) {
        return (s ? jsxs10 : jsx15)(t2, p, k);
      };
      module.exports.Fragment = R.Fragment;
    }
  });

  // shim:react-dom-shim
  var require_react_dom_shim = __commonJS({
    "shim:react-dom-shim"(exports, module) {
      init_define_import_meta_env();
      var D = window.ReactDOM;
      var n = function() {
      };
      module.exports = Object.assign({ preload: n, preinit: n, preconnect: n, prefetchDNS: n, preloadModule: n, preinitModule: n }, D);
    }
  });

  // node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
  var require_use_sync_external_store_shim_development = __commonJS({
    "node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js"(exports) {
      "use strict";
      init_define_import_meta_env();
      (function() {
        function is(x, y) {
          return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
        }
        function useSyncExternalStore$2(subscribe, getSnapshot) {
          didWarnOld18Alpha || void 0 === React5.startTransition || (didWarnOld18Alpha = true, console.error(
            "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
          ));
          var value = getSnapshot();
          if (!didWarnUncachedGetSnapshot) {
            var cachedValue = getSnapshot();
            objectIs(value, cachedValue) || (console.error(
              "The result of getSnapshot should be cached to avoid an infinite loop"
            ), didWarnUncachedGetSnapshot = true);
          }
          cachedValue = useState6({
            inst: { value, getSnapshot }
          });
          var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
          useLayoutEffect3(
            function() {
              inst.value = value;
              inst.getSnapshot = getSnapshot;
              checkIfSnapshotChanged(inst) && forceUpdate({ inst });
            },
            [subscribe, value, getSnapshot]
          );
          useEffect6(
            function() {
              checkIfSnapshotChanged(inst) && forceUpdate({ inst });
              return subscribe(function() {
                checkIfSnapshotChanged(inst) && forceUpdate({ inst });
              });
            },
            [subscribe]
          );
          useDebugValue2(value);
          return value;
        }
        function checkIfSnapshotChanged(inst) {
          var latestGetSnapshot = inst.getSnapshot;
          inst = inst.value;
          try {
            var nextValue = latestGetSnapshot();
            return !objectIs(inst, nextValue);
          } catch (error) {
            return true;
          }
        }
        function useSyncExternalStore$1(subscribe, getSnapshot) {
          return getSnapshot();
        }
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
        var React5 = require_react_shim(), objectIs = "function" === typeof Object.is ? Object.is : is, useState6 = React5.useState, useEffect6 = React5.useEffect, useLayoutEffect3 = React5.useLayoutEffect, useDebugValue2 = React5.useDebugValue, didWarnOld18Alpha = false, didWarnUncachedGetSnapshot = false, shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
        exports.useSyncExternalStore = void 0 !== React5.useSyncExternalStore ? React5.useSyncExternalStore : shim;
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
      })();
    }
  });

  // node_modules/use-sync-external-store/shim/index.js
  var require_shim = __commonJS({
    "node_modules/use-sync-external-store/shim/index.js"(exports, module) {
      "use strict";
      init_define_import_meta_env();
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_use_sync_external_store_shim_development();
      }
    }
  });

  // node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js
  var require_with_selector_development = __commonJS({
    "node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js"(exports) {
      "use strict";
      init_define_import_meta_env();
      (function() {
        function is(x, y) {
          return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
        }
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
        var React5 = require_react_shim(), shim = require_shim(), objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim.useSyncExternalStore, useRef3 = React5.useRef, useEffect6 = React5.useEffect, useMemo4 = React5.useMemo, useDebugValue2 = React5.useDebugValue;
        exports.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
          var instRef = useRef3(null);
          if (null === instRef.current) {
            var inst = { hasValue: false, value: null };
            instRef.current = inst;
          } else inst = instRef.current;
          instRef = useMemo4(
            function() {
              function memoizedSelector(nextSnapshot) {
                if (!hasMemo) {
                  hasMemo = true;
                  memoizedSnapshot = nextSnapshot;
                  nextSnapshot = selector(nextSnapshot);
                  if (void 0 !== isEqual && inst.hasValue) {
                    var currentSelection = inst.value;
                    if (isEqual(currentSelection, nextSnapshot))
                      return memoizedSelection = currentSelection;
                  }
                  return memoizedSelection = nextSnapshot;
                }
                currentSelection = memoizedSelection;
                if (objectIs(memoizedSnapshot, nextSnapshot))
                  return currentSelection;
                var nextSelection = selector(nextSnapshot);
                if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
                  return memoizedSnapshot = nextSnapshot, currentSelection;
                memoizedSnapshot = nextSnapshot;
                return memoizedSelection = nextSelection;
              }
              var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
              return [
                function() {
                  return memoizedSelector(getSnapshot());
                },
                null === maybeGetServerSnapshot ? void 0 : function() {
                  return memoizedSelector(maybeGetServerSnapshot());
                }
              ];
            },
            [getSnapshot, getServerSnapshot, selector, isEqual]
          );
          var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
          useEffect6(
            function() {
              inst.hasValue = true;
              inst.value = value;
            },
            [value]
          );
          useDebugValue2(value);
          return value;
        };
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
      })();
    }
  });

  // node_modules/use-sync-external-store/shim/with-selector.js
  var require_with_selector = __commonJS({
    "node_modules/use-sync-external-store/shim/with-selector.js"(exports, module) {
      "use strict";
      init_define_import_meta_env();
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_with_selector_development();
      }
    }
  });

  // node_modules/dexie/dist/dexie.js
  var require_dexie = __commonJS({
    "node_modules/dexie/dist/dexie.js"(exports, module) {
      init_define_import_meta_env();
      (function(global2, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2.Dexie = factory());
      })(exports, (function() {
        "use strict";
        var extendStatics = function(d, b) {
          extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
            d2.__proto__ = b2;
          } || function(d2, b2) {
            for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
          };
          return extendStatics(d, b);
        };
        function __extends(d, b) {
          if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        }
        var __assign = function() {
          __assign = Object.assign || function __assign2(t2) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t2[p] = s[p];
            }
            return t2;
          };
          return __assign.apply(this, arguments);
        };
        function __spreadArray(to, from, pack) {
          if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
              if (!ar) ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
            }
          }
          return to.concat(ar || Array.prototype.slice.call(from));
        }
        typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
          var e = new Error(message);
          return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
        };
        var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
        var keys = Object.keys;
        var isArray = Array.isArray;
        if (typeof Promise !== "undefined" && !_global.Promise) {
          _global.Promise = Promise;
        }
        function extend(obj, extension) {
          if (typeof extension !== "object")
            return obj;
          keys(extension).forEach(function(key) {
            obj[key] = extension[key];
          });
          return obj;
        }
        var getProto = Object.getPrototypeOf;
        var _hasOwn = {}.hasOwnProperty;
        function hasOwn(obj, prop) {
          return _hasOwn.call(obj, prop);
        }
        function props(proto, extension) {
          if (typeof extension === "function")
            extension = extension(getProto(proto));
          (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(function(key) {
            setProp(proto, key, extension[key]);
          });
        }
        var defineProperty = Object.defineProperty;
        function setProp(obj, prop, functionOrGetSet, options) {
          defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? {
            get: functionOrGetSet.get,
            set: functionOrGetSet.set,
            configurable: true
          } : { value: functionOrGetSet, configurable: true, writable: true }, options));
        }
        function derive(Child) {
          return {
            from: function(Parent) {
              Child.prototype = Object.create(Parent.prototype);
              setProp(Child.prototype, "constructor", Child);
              return {
                extend: props.bind(null, Child.prototype)
              };
            }
          };
        }
        var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        function getPropertyDescriptor(obj, prop) {
          var pd = getOwnPropertyDescriptor(obj, prop);
          var proto;
          return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
        }
        var _slice = [].slice;
        function slice(args, start, end) {
          return _slice.call(args, start, end);
        }
        function override(origFunc, overridedFactory) {
          return overridedFactory(origFunc);
        }
        function assert(b) {
          if (!b)
            throw new Error("Assertion Failed");
        }
        function asap$1(fn) {
          if (_global.setImmediate)
            setImmediate(fn);
          else
            setTimeout(fn, 0);
        }
        function arrayToObject(array, extractor) {
          return array.reduce(function(result, item, i) {
            var nameAndValue = extractor(item, i);
            if (nameAndValue)
              result[nameAndValue[0]] = nameAndValue[1];
            return result;
          }, {});
        }
        function getByKeyPath(obj, keyPath) {
          if (typeof keyPath === "string" && hasOwn(obj, keyPath))
            return obj[keyPath];
          if (!keyPath)
            return obj;
          if (typeof keyPath !== "string") {
            var rv = [];
            for (var i = 0, l = keyPath.length; i < l; ++i) {
              var val = getByKeyPath(obj, keyPath[i]);
              rv.push(val);
            }
            return rv;
          }
          var period = keyPath.indexOf(".");
          if (period !== -1) {
            var innerObj = obj[keyPath.substr(0, period)];
            return innerObj == null ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
          }
          return void 0;
        }
        function setByKeyPath(obj, keyPath, value) {
          if (!obj || keyPath === void 0)
            return;
          if ("isFrozen" in Object && Object.isFrozen(obj))
            return;
          if (typeof keyPath !== "string" && "length" in keyPath) {
            assert(typeof value !== "string" && "length" in value);
            for (var i = 0, l = keyPath.length; i < l; ++i) {
              setByKeyPath(obj, keyPath[i], value[i]);
            }
          } else {
            var period = keyPath.indexOf(".");
            if (period !== -1) {
              var currentKeyPath = keyPath.substr(0, period);
              var remainingKeyPath = keyPath.substr(period + 1);
              if (remainingKeyPath === "")
                if (value === void 0) {
                  if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
                    obj.splice(currentKeyPath, 1);
                  else
                    delete obj[currentKeyPath];
                } else
                  obj[currentKeyPath] = value;
              else {
                var innerObj = obj[currentKeyPath];
                if (!innerObj || !hasOwn(obj, currentKeyPath)) {
                  if (value === void 0)
                    return;
                  innerObj = obj[currentKeyPath] = {};
                }
                setByKeyPath(innerObj, remainingKeyPath, value);
              }
            } else {
              if (value === void 0) {
                if (isArray(obj) && !isNaN(parseInt(keyPath)))
                  obj.splice(keyPath, 1);
                else
                  delete obj[keyPath];
              } else
                obj[keyPath] = value;
            }
          }
        }
        function delByKeyPath(obj, keyPath) {
          if (typeof keyPath === "string")
            setByKeyPath(obj, keyPath, void 0);
          else if ("length" in keyPath)
            [].map.call(keyPath, function(kp) {
              setByKeyPath(obj, kp, void 0);
            });
        }
        function shallowClone(obj) {
          var rv = {};
          for (var m in obj) {
            if (hasOwn(obj, m))
              rv[m] = obj[m];
          }
          return rv;
        }
        var concat = [].concat;
        function flatten(a) {
          return concat.apply([], a);
        }
        var intrinsicTypeNames = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(flatten([8, 16, 32, 64].map(function(num) {
          return ["Int", "Uint", "Float"].map(function(t2) {
            return t2 + num + "Array";
          });
        }))).filter(function(t2) {
          return _global[t2];
        });
        var intrinsicTypes = new Set(intrinsicTypeNames.map(function(t2) {
          return _global[t2];
        }));
        function cloneSimpleObjectTree(o) {
          var rv = {};
          for (var k in o)
            if (hasOwn(o, k)) {
              var v = o[k];
              rv[k] = !v || typeof v !== "object" || intrinsicTypes.has(v.constructor) ? v : cloneSimpleObjectTree(v);
            }
          return rv;
        }
        var circularRefs = null;
        function deepClone(any) {
          circularRefs = /* @__PURE__ */ new WeakMap();
          var rv = innerDeepClone(any);
          circularRefs = null;
          return rv;
        }
        function innerDeepClone(x) {
          if (!x || typeof x !== "object")
            return x;
          var rv = circularRefs.get(x);
          if (rv)
            return rv;
          if (isArray(x)) {
            rv = [];
            circularRefs.set(x, rv);
            for (var i = 0, l = x.length; i < l; ++i) {
              rv.push(innerDeepClone(x[i]));
            }
          } else if (intrinsicTypes.has(x.constructor)) {
            rv = x;
          } else {
            var proto = getProto(x);
            rv = proto === Object.prototype ? {} : Object.create(proto);
            circularRefs.set(x, rv);
            for (var prop in x) {
              if (hasOwn(x, prop)) {
                rv[prop] = innerDeepClone(x[prop]);
              }
            }
          }
          return rv;
        }
        var toString = {}.toString;
        function toStringTag(o) {
          return toString.call(o).slice(8, -1);
        }
        var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
        var getIteratorOf = typeof iteratorSymbol === "symbol" ? function(x) {
          var i;
          return x != null && (i = x[iteratorSymbol]) && i.apply(x);
        } : function() {
          return null;
        };
        function delArrayItem(a, x) {
          var i = a.indexOf(x);
          if (i >= 0)
            a.splice(i, 1);
          return i >= 0;
        }
        var NO_CHAR_ARRAY = {};
        function getArrayOf(arrayLike) {
          var i, a, x, it;
          if (arguments.length === 1) {
            if (isArray(arrayLike))
              return arrayLike.slice();
            if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
              return [arrayLike];
            if (it = getIteratorOf(arrayLike)) {
              a = [];
              while (x = it.next(), !x.done)
                a.push(x.value);
              return a;
            }
            if (arrayLike == null)
              return [arrayLike];
            i = arrayLike.length;
            if (typeof i === "number") {
              a = new Array(i);
              while (i--)
                a[i] = arrayLike[i];
              return a;
            }
            return [arrayLike];
          }
          i = arguments.length;
          a = new Array(i);
          while (i--)
            a[i] = arguments[i];
          return a;
        }
        var isAsyncFunction = typeof Symbol !== "undefined" ? function(fn) {
          return fn[Symbol.toStringTag] === "AsyncFunction";
        } : function() {
          return false;
        };
        var dexieErrorNames = [
          "Modify",
          "Bulk",
          "OpenFailed",
          "VersionChange",
          "Schema",
          "Upgrade",
          "InvalidTable",
          "MissingAPI",
          "NoSuchDatabase",
          "InvalidArgument",
          "SubTransaction",
          "Unsupported",
          "Internal",
          "DatabaseClosed",
          "PrematureCommit",
          "ForeignAwait"
        ];
        var idbDomErrorNames = [
          "Unknown",
          "Constraint",
          "Data",
          "TransactionInactive",
          "ReadOnly",
          "Version",
          "NotFound",
          "InvalidState",
          "InvalidAccess",
          "Abort",
          "Timeout",
          "QuotaExceeded",
          "Syntax",
          "DataClone"
        ];
        var errorList = dexieErrorNames.concat(idbDomErrorNames);
        var defaultTexts = {
          VersionChanged: "Database version changed by other database connection",
          DatabaseClosed: "Database has been closed",
          Abort: "Transaction aborted",
          TransactionInactive: "Transaction has already completed or failed",
          MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
        };
        function DexieError(name, msg) {
          this.name = name;
          this.message = msg;
        }
        derive(DexieError).from(Error).extend({
          toString: function() {
            return this.name + ": " + this.message;
          }
        });
        function getMultiErrorMessage(msg, failures) {
          return msg + ". Errors: " + Object.keys(failures).map(function(key) {
            return failures[key].toString();
          }).filter(function(v, i, s) {
            return s.indexOf(v) === i;
          }).join("\n");
        }
        function ModifyError(msg, failures, successCount, failedKeys) {
          this.failures = failures;
          this.failedKeys = failedKeys;
          this.successCount = successCount;
          this.message = getMultiErrorMessage(msg, failures);
        }
        derive(ModifyError).from(DexieError);
        function BulkError(msg, failures) {
          this.name = "BulkError";
          this.failures = Object.keys(failures).map(function(pos) {
            return failures[pos];
          });
          this.failuresByPos = failures;
          this.message = getMultiErrorMessage(msg, this.failures);
        }
        derive(BulkError).from(DexieError);
        var errnames = errorList.reduce(function(obj, name) {
          return obj[name] = name + "Error", obj;
        }, {});
        var BaseException = DexieError;
        var exceptions = errorList.reduce(function(obj, name) {
          var fullName = name + "Error";
          function DexieError2(msgOrInner, inner) {
            this.name = fullName;
            if (!msgOrInner) {
              this.message = defaultTexts[name] || fullName;
              this.inner = null;
            } else if (typeof msgOrInner === "string") {
              this.message = "".concat(msgOrInner).concat(!inner ? "" : "\n " + inner);
              this.inner = inner || null;
            } else if (typeof msgOrInner === "object") {
              this.message = "".concat(msgOrInner.name, " ").concat(msgOrInner.message);
              this.inner = msgOrInner;
            }
          }
          derive(DexieError2).from(BaseException);
          obj[name] = DexieError2;
          return obj;
        }, {});
        exceptions.Syntax = SyntaxError;
        exceptions.Type = TypeError;
        exceptions.Range = RangeError;
        var exceptionMap = idbDomErrorNames.reduce(function(obj, name) {
          obj[name + "Error"] = exceptions[name];
          return obj;
        }, {});
        function mapError(domError, message) {
          if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
            return domError;
          var rv = new exceptionMap[domError.name](message || domError.message, domError);
          if ("stack" in domError) {
            setProp(rv, "stack", {
              get: function() {
                return this.inner.stack;
              }
            });
          }
          return rv;
        }
        var fullNameExceptions = errorList.reduce(function(obj, name) {
          if (["Syntax", "Type", "Range"].indexOf(name) === -1)
            obj[name + "Error"] = exceptions[name];
          return obj;
        }, {});
        fullNameExceptions.ModifyError = ModifyError;
        fullNameExceptions.DexieError = DexieError;
        fullNameExceptions.BulkError = BulkError;
        function nop() {
        }
        function mirror(val) {
          return val;
        }
        function pureFunctionChain(f1, f2) {
          if (f1 == null || f1 === mirror)
            return f2;
          return function(val) {
            return f2(f1(val));
          };
        }
        function callBoth(on1, on2) {
          return function() {
            on1.apply(this, arguments);
            on2.apply(this, arguments);
          };
        }
        function hookCreatingChain(f1, f2) {
          if (f1 === nop)
            return f2;
          return function() {
            var res = f1.apply(this, arguments);
            if (res !== void 0)
              arguments[0] = res;
            var onsuccess = this.onsuccess, onerror = this.onerror;
            this.onsuccess = null;
            this.onerror = null;
            var res2 = f2.apply(this, arguments);
            if (onsuccess)
              this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
              this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
            return res2 !== void 0 ? res2 : res;
          };
        }
        function hookDeletingChain(f1, f2) {
          if (f1 === nop)
            return f2;
          return function() {
            f1.apply(this, arguments);
            var onsuccess = this.onsuccess, onerror = this.onerror;
            this.onsuccess = this.onerror = null;
            f2.apply(this, arguments);
            if (onsuccess)
              this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
              this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
          };
        }
        function hookUpdatingChain(f1, f2) {
          if (f1 === nop)
            return f2;
          return function(modifications) {
            var res = f1.apply(this, arguments);
            extend(modifications, res);
            var onsuccess = this.onsuccess, onerror = this.onerror;
            this.onsuccess = null;
            this.onerror = null;
            var res2 = f2.apply(this, arguments);
            if (onsuccess)
              this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
              this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
            return res === void 0 ? res2 === void 0 ? void 0 : res2 : extend(res, res2);
          };
        }
        function reverseStoppableEventChain(f1, f2) {
          if (f1 === nop)
            return f2;
          return function() {
            if (f2.apply(this, arguments) === false)
              return false;
            return f1.apply(this, arguments);
          };
        }
        function promisableChain(f1, f2) {
          if (f1 === nop)
            return f2;
          return function() {
            var res = f1.apply(this, arguments);
            if (res && typeof res.then === "function") {
              var thiz = this, i = arguments.length, args = new Array(i);
              while (i--)
                args[i] = arguments[i];
              return res.then(function() {
                return f2.apply(thiz, args);
              });
            }
            return f2.apply(this, arguments);
          };
        }
        var debug = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
        function setDebug(value, filter) {
          debug = value;
        }
        var INTERNAL = {};
        var ZONE_ECHO_LIMIT = 100, _a$1 = typeof Promise === "undefined" ? [] : (function() {
          var globalP = Promise.resolve();
          if (typeof crypto === "undefined" || !crypto.subtle)
            return [globalP, getProto(globalP), globalP];
          var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
          return [nativeP, getProto(nativeP), globalP];
        })(), resolvedNativePromise = _a$1[0], nativePromiseProto = _a$1[1], resolvedGlobalPromise = _a$1[2], nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
        var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
        var patchGlobalPromise = !!resolvedGlobalPromise;
        function schedulePhysicalTick() {
          queueMicrotask(physicalTick);
        }
        var asap = function(callback, args) {
          microtickQueue.push([callback, args]);
          if (needsNewPhysicalTick) {
            schedulePhysicalTick();
            needsNewPhysicalTick = false;
          }
        };
        var isOutsideMicroTick = true, needsNewPhysicalTick = true, unhandledErrors = [], rejectingErrors = [], rejectionMapper = mirror;
        var globalPSD = {
          id: "global",
          global: true,
          ref: 0,
          unhandleds: [],
          onunhandled: nop,
          pgp: false,
          env: {},
          finalize: nop
        };
        var PSD = globalPSD;
        var microtickQueue = [];
        var numScheduledCalls = 0;
        var tickFinalizers = [];
        function DexiePromise(fn) {
          if (typeof this !== "object")
            throw new TypeError("Promises must be constructed via new");
          this._listeners = [];
          this._lib = false;
          var psd = this._PSD = PSD;
          if (typeof fn !== "function") {
            if (fn !== INTERNAL)
              throw new TypeError("Not a function");
            this._state = arguments[1];
            this._value = arguments[2];
            if (this._state === false)
              handleRejection(this, this._value);
            return;
          }
          this._state = null;
          this._value = null;
          ++psd.ref;
          executePromiseTask(this, fn);
        }
        var thenProp = {
          get: function() {
            var psd = PSD, microTaskId = totalEchoes;
            function then(onFulfilled, onRejected) {
              var _this = this;
              var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
              var cleanup = possibleAwait && !decrementExpectedAwaits();
              var rv = new DexiePromise(function(resolve, reject) {
                propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
              });
              if (this._consoleTask)
                rv._consoleTask = this._consoleTask;
              return rv;
            }
            then.prototype = INTERNAL;
            return then;
          },
          set: function(value) {
            setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
              get: function() {
                return value;
              },
              set: thenProp.set
            });
          }
        };
        props(DexiePromise.prototype, {
          then: thenProp,
          _then: function(onFulfilled, onRejected) {
            propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
          },
          catch: function(onRejected) {
            if (arguments.length === 1)
              return this.then(null, onRejected);
            var type2 = arguments[0], handler = arguments[1];
            return typeof type2 === "function" ? this.then(null, function(err) {
              return err instanceof type2 ? handler(err) : PromiseReject(err);
            }) : this.then(null, function(err) {
              return err && err.name === type2 ? handler(err) : PromiseReject(err);
            });
          },
          finally: function(onFinally) {
            return this.then(function(value) {
              return DexiePromise.resolve(onFinally()).then(function() {
                return value;
              });
            }, function(err) {
              return DexiePromise.resolve(onFinally()).then(function() {
                return PromiseReject(err);
              });
            });
          },
          timeout: function(ms, msg) {
            var _this = this;
            return ms < Infinity ? new DexiePromise(function(resolve, reject) {
              var handle = setTimeout(function() {
                return reject(new exceptions.Timeout(msg));
              }, ms);
              _this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
            }) : this;
          }
        });
        if (typeof Symbol !== "undefined" && Symbol.toStringTag)
          setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
        globalPSD.env = snapShot();
        function Listener(onFulfilled, onRejected, resolve, reject, zone) {
          this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
          this.onRejected = typeof onRejected === "function" ? onRejected : null;
          this.resolve = resolve;
          this.reject = reject;
          this.psd = zone;
        }
        props(DexiePromise, {
          all: function() {
            var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function(resolve, reject) {
              if (values.length === 0)
                resolve([]);
              var remaining = values.length;
              values.forEach(function(a, i) {
                return DexiePromise.resolve(a).then(function(x) {
                  values[i] = x;
                  if (!--remaining)
                    resolve(values);
                }, reject);
              });
            });
          },
          resolve: function(value) {
            if (value instanceof DexiePromise)
              return value;
            if (value && typeof value.then === "function")
              return new DexiePromise(function(resolve, reject) {
                value.then(resolve, reject);
              });
            var rv = new DexiePromise(INTERNAL, true, value);
            return rv;
          },
          reject: PromiseReject,
          race: function() {
            var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function(resolve, reject) {
              values.map(function(value) {
                return DexiePromise.resolve(value).then(resolve, reject);
              });
            });
          },
          PSD: {
            get: function() {
              return PSD;
            },
            set: function(value) {
              return PSD = value;
            }
          },
          totalEchoes: { get: function() {
            return totalEchoes;
          } },
          newPSD: newScope,
          usePSD,
          scheduler: {
            get: function() {
              return asap;
            },
            set: function(value) {
              asap = value;
            }
          },
          rejectionMapper: {
            get: function() {
              return rejectionMapper;
            },
            set: function(value) {
              rejectionMapper = value;
            }
          },
          follow: function(fn, zoneProps) {
            return new DexiePromise(function(resolve, reject) {
              return newScope(function(resolve2, reject2) {
                var psd = PSD;
                psd.unhandleds = [];
                psd.onunhandled = reject2;
                psd.finalize = callBoth(function() {
                  var _this = this;
                  run_at_end_of_this_or_next_physical_tick(function() {
                    _this.unhandleds.length === 0 ? resolve2() : reject2(_this.unhandleds[0]);
                  });
                }, psd.finalize);
                fn();
              }, zoneProps, resolve, reject);
            });
          }
        });
        if (NativePromise) {
          if (NativePromise.allSettled)
            setProp(DexiePromise, "allSettled", function() {
              var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
              return new DexiePromise(function(resolve) {
                if (possiblePromises.length === 0)
                  resolve([]);
                var remaining = possiblePromises.length;
                var results = new Array(remaining);
                possiblePromises.forEach(function(p, i) {
                  return DexiePromise.resolve(p).then(function(value) {
                    return results[i] = { status: "fulfilled", value };
                  }, function(reason) {
                    return results[i] = { status: "rejected", reason };
                  }).then(function() {
                    return --remaining || resolve(results);
                  });
                });
              });
            });
          if (NativePromise.any && typeof AggregateError !== "undefined")
            setProp(DexiePromise, "any", function() {
              var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
              return new DexiePromise(function(resolve, reject) {
                if (possiblePromises.length === 0)
                  reject(new AggregateError([]));
                var remaining = possiblePromises.length;
                var failures = new Array(remaining);
                possiblePromises.forEach(function(p, i) {
                  return DexiePromise.resolve(p).then(function(value) {
                    return resolve(value);
                  }, function(failure) {
                    failures[i] = failure;
                    if (!--remaining)
                      reject(new AggregateError(failures));
                  });
                });
              });
            });
          if (NativePromise.withResolvers)
            DexiePromise.withResolvers = NativePromise.withResolvers;
        }
        function executePromiseTask(promise, fn) {
          try {
            fn(function(value) {
              if (promise._state !== null)
                return;
              if (value === promise)
                throw new TypeError("A promise cannot be resolved with itself.");
              var shouldExecuteTick = promise._lib && beginMicroTickScope();
              if (value && typeof value.then === "function") {
                executePromiseTask(promise, function(resolve, reject) {
                  value instanceof DexiePromise ? value._then(resolve, reject) : value.then(resolve, reject);
                });
              } else {
                promise._state = true;
                promise._value = value;
                propagateAllListeners(promise);
              }
              if (shouldExecuteTick)
                endMicroTickScope();
            }, handleRejection.bind(null, promise));
          } catch (ex) {
            handleRejection(promise, ex);
          }
        }
        function handleRejection(promise, reason) {
          rejectingErrors.push(reason);
          if (promise._state !== null)
            return;
          var shouldExecuteTick = promise._lib && beginMicroTickScope();
          reason = rejectionMapper(reason);
          promise._state = false;
          promise._value = reason;
          addPossiblyUnhandledError(promise);
          propagateAllListeners(promise);
          if (shouldExecuteTick)
            endMicroTickScope();
        }
        function propagateAllListeners(promise) {
          var listeners = promise._listeners;
          promise._listeners = [];
          for (var i = 0, len = listeners.length; i < len; ++i) {
            propagateToListener(promise, listeners[i]);
          }
          var psd = promise._PSD;
          --psd.ref || psd.finalize();
          if (numScheduledCalls === 0) {
            ++numScheduledCalls;
            asap(function() {
              if (--numScheduledCalls === 0)
                finalizePhysicalTick();
            }, []);
          }
        }
        function propagateToListener(promise, listener) {
          if (promise._state === null) {
            promise._listeners.push(listener);
            return;
          }
          var cb = promise._state ? listener.onFulfilled : listener.onRejected;
          if (cb === null) {
            return (promise._state ? listener.resolve : listener.reject)(promise._value);
          }
          ++listener.psd.ref;
          ++numScheduledCalls;
          asap(callListener, [cb, promise, listener]);
        }
        function callListener(cb, promise, listener) {
          try {
            var ret, value = promise._value;
            if (!promise._state && rejectingErrors.length)
              rejectingErrors = [];
            ret = debug && promise._consoleTask ? promise._consoleTask.run(function() {
              return cb(value);
            }) : cb(value);
            if (!promise._state && rejectingErrors.indexOf(value) === -1) {
              markErrorAsHandled(promise);
            }
            listener.resolve(ret);
          } catch (e) {
            listener.reject(e);
          } finally {
            if (--numScheduledCalls === 0)
              finalizePhysicalTick();
            --listener.psd.ref || listener.psd.finalize();
          }
        }
        function physicalTick() {
          usePSD(globalPSD, function() {
            beginMicroTickScope() && endMicroTickScope();
          });
        }
        function beginMicroTickScope() {
          var wasRootExec = isOutsideMicroTick;
          isOutsideMicroTick = false;
          needsNewPhysicalTick = false;
          return wasRootExec;
        }
        function endMicroTickScope() {
          var callbacks, i, l;
          do {
            while (microtickQueue.length > 0) {
              callbacks = microtickQueue;
              microtickQueue = [];
              l = callbacks.length;
              for (i = 0; i < l; ++i) {
                var item = callbacks[i];
                item[0].apply(null, item[1]);
              }
            }
          } while (microtickQueue.length > 0);
          isOutsideMicroTick = true;
          needsNewPhysicalTick = true;
        }
        function finalizePhysicalTick() {
          var unhandledErrs = unhandledErrors;
          unhandledErrors = [];
          unhandledErrs.forEach(function(p) {
            p._PSD.onunhandled.call(null, p._value, p);
          });
          var finalizers = tickFinalizers.slice(0);
          var i = finalizers.length;
          while (i)
            finalizers[--i]();
        }
        function run_at_end_of_this_or_next_physical_tick(fn) {
          function finalizer() {
            fn();
            tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
          }
          tickFinalizers.push(finalizer);
          ++numScheduledCalls;
          asap(function() {
            if (--numScheduledCalls === 0)
              finalizePhysicalTick();
          }, []);
        }
        function addPossiblyUnhandledError(promise) {
          if (!unhandledErrors.some(function(p) {
            return p._value === promise._value;
          }))
            unhandledErrors.push(promise);
        }
        function markErrorAsHandled(promise) {
          var i = unhandledErrors.length;
          while (i)
            if (unhandledErrors[--i]._value === promise._value) {
              unhandledErrors.splice(i, 1);
              return;
            }
        }
        function PromiseReject(reason) {
          return new DexiePromise(INTERNAL, false, reason);
        }
        function wrap(fn, errorCatcher) {
          var psd = PSD;
          return function() {
            var wasRootExec = beginMicroTickScope(), outerScope = PSD;
            try {
              switchToZone(psd, true);
              return fn.apply(this, arguments);
            } catch (e) {
              errorCatcher && errorCatcher(e);
            } finally {
              switchToZone(outerScope, false);
              if (wasRootExec)
                endMicroTickScope();
            }
          };
        }
        var task = { awaits: 0, echoes: 0, id: 0 };
        var taskCounter = 0;
        var zoneStack = [];
        var zoneEchoes = 0;
        var totalEchoes = 0;
        var zone_id_counter = 0;
        function newScope(fn, props2, a1, a2) {
          var parent = PSD, psd = Object.create(parent);
          psd.parent = parent;
          psd.ref = 0;
          psd.global = false;
          psd.id = ++zone_id_counter;
          globalPSD.env;
          psd.env = patchGlobalPromise ? {
            Promise: DexiePromise,
            PromiseProp: {
              value: DexiePromise,
              configurable: true,
              writable: true
            },
            all: DexiePromise.all,
            race: DexiePromise.race,
            allSettled: DexiePromise.allSettled,
            any: DexiePromise.any,
            resolve: DexiePromise.resolve,
            reject: DexiePromise.reject
          } : {};
          if (props2)
            extend(psd, props2);
          ++parent.ref;
          psd.finalize = function() {
            --this.parent.ref || this.parent.finalize();
          };
          var rv = usePSD(psd, fn, a1, a2);
          if (psd.ref === 0)
            psd.finalize();
          return rv;
        }
        function incrementExpectedAwaits() {
          if (!task.id)
            task.id = ++taskCounter;
          ++task.awaits;
          task.echoes += ZONE_ECHO_LIMIT;
          return task.id;
        }
        function decrementExpectedAwaits() {
          if (!task.awaits)
            return false;
          if (--task.awaits === 0)
            task.id = 0;
          task.echoes = task.awaits * ZONE_ECHO_LIMIT;
          return true;
        }
        if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
          incrementExpectedAwaits = decrementExpectedAwaits = nop;
        }
        function onPossibleParallellAsync(possiblePromise) {
          if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
            incrementExpectedAwaits();
            return possiblePromise.then(function(x) {
              decrementExpectedAwaits();
              return x;
            }, function(e) {
              decrementExpectedAwaits();
              return rejection(e);
            });
          }
          return possiblePromise;
        }
        function zoneEnterEcho(targetZone) {
          ++totalEchoes;
          if (!task.echoes || --task.echoes === 0) {
            task.echoes = task.awaits = task.id = 0;
          }
          zoneStack.push(PSD);
          switchToZone(targetZone, true);
        }
        function zoneLeaveEcho() {
          var zone = zoneStack[zoneStack.length - 1];
          zoneStack.pop();
          switchToZone(zone, false);
        }
        function switchToZone(targetZone, bEnteringZone) {
          var currentZone = PSD;
          if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
            queueMicrotask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
          }
          if (targetZone === PSD)
            return;
          PSD = targetZone;
          if (currentZone === globalPSD)
            globalPSD.env = snapShot();
          if (patchGlobalPromise) {
            var GlobalPromise = globalPSD.env.Promise;
            var targetEnv = targetZone.env;
            if (currentZone.global || targetZone.global) {
              Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
              GlobalPromise.all = targetEnv.all;
              GlobalPromise.race = targetEnv.race;
              GlobalPromise.resolve = targetEnv.resolve;
              GlobalPromise.reject = targetEnv.reject;
              if (targetEnv.allSettled)
                GlobalPromise.allSettled = targetEnv.allSettled;
              if (targetEnv.any)
                GlobalPromise.any = targetEnv.any;
            }
          }
        }
        function snapShot() {
          var GlobalPromise = _global.Promise;
          return patchGlobalPromise ? {
            Promise: GlobalPromise,
            PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
            all: GlobalPromise.all,
            race: GlobalPromise.race,
            allSettled: GlobalPromise.allSettled,
            any: GlobalPromise.any,
            resolve: GlobalPromise.resolve,
            reject: GlobalPromise.reject
          } : {};
        }
        function usePSD(psd, fn, a1, a2, a3) {
          var outerScope = PSD;
          try {
            switchToZone(psd, true);
            return fn(a1, a2, a3);
          } finally {
            switchToZone(outerScope, false);
          }
        }
        function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
          return typeof fn !== "function" ? fn : function() {
            var outerZone = PSD;
            if (possibleAwait)
              incrementExpectedAwaits();
            switchToZone(zone, true);
            try {
              return fn.apply(this, arguments);
            } finally {
              switchToZone(outerZone, false);
              if (cleanup)
                queueMicrotask(decrementExpectedAwaits);
            }
          };
        }
        function execInGlobalContext(cb) {
          if (Promise === NativePromise && task.echoes === 0) {
            if (zoneEchoes === 0) {
              cb();
            } else {
              enqueueNativeMicroTask(cb);
            }
          } else {
            setTimeout(cb, 0);
          }
        }
        var rejection = DexiePromise.reject;
        function tempTransaction(db2, mode, storeNames, fn) {
          if (!db2.idbdb || !db2._state.openComplete && !PSD.letThrough && !db2._vip) {
            if (db2._state.openComplete) {
              return rejection(new exceptions.DatabaseClosed(db2._state.dbOpenError));
            }
            if (!db2._state.isBeingOpened) {
              if (!db2._state.autoOpen)
                return rejection(new exceptions.DatabaseClosed());
              db2.open().catch(nop);
            }
            return db2._state.dbReadyPromise.then(function() {
              return tempTransaction(db2, mode, storeNames, fn);
            });
          } else {
            var trans = db2._createTransaction(mode, storeNames, db2._dbSchema);
            try {
              trans.create();
              db2._state.PR1398_maxLoop = 3;
            } catch (ex) {
              if (ex.name === errnames.InvalidState && db2.isOpen() && --db2._state.PR1398_maxLoop > 0) {
                console.warn("Dexie: Need to reopen db");
                db2.close({ disableAutoOpen: false });
                return db2.open().then(function() {
                  return tempTransaction(db2, mode, storeNames, fn);
                });
              }
              return rejection(ex);
            }
            return trans._promise(mode, function(resolve, reject) {
              return newScope(function() {
                PSD.trans = trans;
                return fn(resolve, reject, trans);
              });
            }).then(function(result) {
              if (mode === "readwrite")
                try {
                  trans.idbtrans.commit();
                } catch (_a2) {
                }
              return mode === "readonly" ? result : trans._completion.then(function() {
                return result;
              });
            });
          }
        }
        var DEXIE_VERSION = "4.4.5";
        var maxString = String.fromCharCode(65535);
        var minKey = -Infinity;
        var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
        var STRING_EXPECTED = "String expected.";
        var DEFAULT_MAX_CONNECTIONS = 1e3;
        var DBNAMES_DB = "__dbnames";
        var READONLY = "readonly";
        var READWRITE = "readwrite";
        function combine(filter1, filter2) {
          return filter1 ? filter2 ? function() {
            return filter1.apply(this, arguments) && filter2.apply(this, arguments);
          } : filter1 : filter2;
        }
        var AnyRange = {
          type: 3,
          lower: -Infinity,
          lowerOpen: false,
          upper: [[]],
          upperOpen: false
        };
        function workaroundForUndefinedPrimKey(keyPath) {
          return typeof keyPath === "string" && !/\./.test(keyPath) ? function(obj) {
            if (obj[keyPath] === void 0 && keyPath in obj) {
              obj = deepClone(obj);
              delete obj[keyPath];
            }
            return obj;
          } : function(obj) {
            return obj;
          };
        }
        function Entity2() {
          throw exceptions.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
        }
        function cmp2(a, b) {
          try {
            var ta = type(a);
            var tb = type(b);
            if (ta !== tb) {
              if (ta === "Array")
                return 1;
              if (tb === "Array")
                return -1;
              if (ta === "binary")
                return 1;
              if (tb === "binary")
                return -1;
              if (ta === "string")
                return 1;
              if (tb === "string")
                return -1;
              if (ta === "Date")
                return 1;
              if (tb !== "Date")
                return NaN;
              return -1;
            }
            switch (ta) {
              case "number":
              case "Date":
              case "string":
                return a > b ? 1 : a < b ? -1 : 0;
              case "binary": {
                return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
              }
              case "Array":
                return compareArrays(a, b);
            }
          } catch (_a2) {
          }
          return NaN;
        }
        function compareArrays(a, b) {
          var al = a.length;
          var bl = b.length;
          var l = al < bl ? al : bl;
          for (var i = 0; i < l; ++i) {
            var res = cmp2(a[i], b[i]);
            if (res !== 0)
              return res;
          }
          return al === bl ? 0 : al < bl ? -1 : 1;
        }
        function compareUint8Arrays(a, b) {
          var al = a.length;
          var bl = b.length;
          var l = al < bl ? al : bl;
          for (var i = 0; i < l; ++i) {
            if (a[i] !== b[i])
              return a[i] < b[i] ? -1 : 1;
          }
          return al === bl ? 0 : al < bl ? -1 : 1;
        }
        function type(x) {
          var t2 = typeof x;
          if (t2 !== "object")
            return t2;
          if (ArrayBuffer.isView(x))
            return "binary";
          var tsTag = toStringTag(x);
          return tsTag === "ArrayBuffer" ? "binary" : tsTag;
        }
        function getUint8Array(a) {
          if (a instanceof Uint8Array)
            return a;
          if (ArrayBuffer.isView(a))
            return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
          return new Uint8Array(a);
        }
        function builtInDeletionTrigger(table, keys2, res) {
          var yProps = table.schema.yProps;
          if (!yProps)
            return res;
          if (keys2 && res.numFailures > 0)
            keys2 = keys2.filter(function(_, i) {
              return !res.failures[i];
            });
          return Promise.all(yProps.map(function(_a2) {
            var updatesTable = _a2.updatesTable;
            return keys2 ? table.db.table(updatesTable).where("k").anyOf(keys2).delete() : table.db.table(updatesTable).clear();
          })).then(function() {
            return res;
          });
        }
        var PropModification2 = (function() {
          function PropModification3(spec) {
            this["@@propmod"] = spec;
          }
          PropModification3.prototype.execute = function(value) {
            var _a2;
            var spec = this["@@propmod"];
            if (spec.add !== void 0) {
              var term = spec.add;
              if (isArray(term)) {
                return __spreadArray(__spreadArray([], isArray(value) ? value : [], true), term, true).sort();
              }
              if (typeof term === "number")
                return (Number(value) || 0) + term;
              if (typeof term === "bigint") {
                try {
                  return BigInt(value) + term;
                } catch (_b) {
                  return BigInt(0) + term;
                }
              }
              throw new TypeError("Invalid term ".concat(term));
            }
            if (spec.remove !== void 0) {
              var subtrahend_1 = spec.remove;
              if (isArray(subtrahend_1)) {
                return isArray(value) ? value.filter(function(item) {
                  return !subtrahend_1.includes(item);
                }).sort() : [];
              }
              if (typeof subtrahend_1 === "number")
                return Number(value) - subtrahend_1;
              if (typeof subtrahend_1 === "bigint") {
                try {
                  return BigInt(value) - subtrahend_1;
                } catch (_c) {
                  return BigInt(0) - subtrahend_1;
                }
              }
              throw new TypeError("Invalid subtrahend ".concat(subtrahend_1));
            }
            var prefixToReplace = (_a2 = spec.replacePrefix) === null || _a2 === void 0 ? void 0 : _a2[0];
            if (prefixToReplace && typeof value === "string" && value.startsWith(prefixToReplace)) {
              return spec.replacePrefix[1] + value.substring(prefixToReplace.length);
            }
            return value;
          };
          return PropModification3;
        })();
        function applyUpdateSpec(obj, changes) {
          var keyPaths = keys(changes);
          var numKeys = keyPaths.length;
          var anythingModified = false;
          for (var i = 0; i < numKeys; ++i) {
            var keyPath = keyPaths[i];
            var value = changes[keyPath];
            var origValue = getByKeyPath(obj, keyPath);
            if (value instanceof PropModification2) {
              setByKeyPath(obj, keyPath, value.execute(origValue));
              anythingModified = true;
            } else if (origValue !== value) {
              setByKeyPath(obj, keyPath, value);
              anythingModified = true;
            }
          }
          return anythingModified;
        }
        var Table = (function() {
          function Table2() {
          }
          Table2.prototype._trans = function(mode, fn, writeLocked) {
            var trans = this._tx || PSD.trans;
            var tableName = this.name;
            var task2 = debug && typeof console !== "undefined" && console.createTask && console.createTask("Dexie: ".concat(mode === "readonly" ? "read" : "write", " ").concat(this.name));
            function checkTableInTransaction(resolve, reject, trans2) {
              if (!trans2.schema[tableName])
                throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
              return fn(trans2.idbtrans, trans2);
            }
            var wasRootExec = beginMicroTickScope();
            try {
              var p = trans && trans.db._novip === this.db._novip ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(function() {
                return trans._promise(mode, checkTableInTransaction, writeLocked);
              }, { trans, transless: PSD.transless || PSD }) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
              if (task2) {
                p._consoleTask = task2;
                p = p.catch(function(err) {
                  console.trace(err);
                  return rejection(err);
                });
              }
              return p;
            } finally {
              if (wasRootExec)
                endMicroTickScope();
            }
          };
          Table2.prototype.get = function(keyOrCrit, cb) {
            var _this = this;
            if (keyOrCrit && keyOrCrit.constructor === Object)
              return this.where(keyOrCrit).first(cb);
            if (keyOrCrit == null)
              return rejection(new exceptions.Type("Invalid argument to Table.get()"));
            return this._trans("readonly", function(trans) {
              return _this.core.get({ trans, key: keyOrCrit }).then(function(res) {
                return _this.hook.reading.fire(res);
              });
            }).then(cb);
          };
          Table2.prototype.where = function(indexOrCrit) {
            if (typeof indexOrCrit === "string")
              return new this.db.WhereClause(this, indexOrCrit);
            if (isArray(indexOrCrit))
              return new this.db.WhereClause(this, "[".concat(indexOrCrit.join("+"), "]"));
            var keyPaths = keys(indexOrCrit);
            if (keyPaths.length === 1)
              return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
            var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function(ix) {
              if (ix.compound && keyPaths.every(function(keyPath) {
                return ix.keyPath.indexOf(keyPath) >= 0;
              })) {
                for (var i = 0; i < keyPaths.length; ++i) {
                  if (keyPaths.indexOf(ix.keyPath[i]) === -1)
                    return false;
                }
                return true;
              }
              return false;
            }).sort(function(a, b) {
              return a.keyPath.length - b.keyPath.length;
            })[0];
            if (compoundIndex && this.db._maxKey !== maxString) {
              var keyPathsInValidOrder = compoundIndex.keyPath.slice(0, keyPaths.length);
              return this.where(keyPathsInValidOrder).equals(keyPathsInValidOrder.map(function(kp) {
                return indexOrCrit[kp];
              }));
            }
            if (!compoundIndex && debug)
              console.warn("The query ".concat(JSON.stringify(indexOrCrit), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(keyPaths.join("+"), "]"));
            var idxByName = this.schema.idxByName;
            function equals(a, b) {
              return cmp2(a, b) === 0;
            }
            var _a2 = keyPaths.reduce(function(_a3, keyPath) {
              var prevIndex = _a3[0], prevFilterFn = _a3[1];
              var index = idxByName[keyPath];
              var value = indexOrCrit[keyPath];
              return [
                prevIndex || index,
                prevIndex || !index ? combine(prevFilterFn, index && index.multi ? function(x) {
                  var prop = getByKeyPath(x, keyPath);
                  return isArray(prop) && prop.some(function(item) {
                    return equals(value, item);
                  });
                } : function(x) {
                  return equals(value, getByKeyPath(x, keyPath));
                }) : prevFilterFn
              ];
            }, [null, null]), idx = _a2[0], filterFunction = _a2[1];
            return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
          };
          Table2.prototype.filter = function(filterFunction) {
            return this.toCollection().and(filterFunction);
          };
          Table2.prototype.count = function(thenShortcut) {
            return this.toCollection().count(thenShortcut);
          };
          Table2.prototype.offset = function(offset) {
            return this.toCollection().offset(offset);
          };
          Table2.prototype.limit = function(numRows) {
            return this.toCollection().limit(numRows);
          };
          Table2.prototype.each = function(callback) {
            return this.toCollection().each(callback);
          };
          Table2.prototype.toArray = function(thenShortcut) {
            return this.toCollection().toArray(thenShortcut);
          };
          Table2.prototype.toCollection = function() {
            return new this.db.Collection(new this.db.WhereClause(this));
          };
          Table2.prototype.orderBy = function(index) {
            return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ? "[".concat(index.join("+"), "]") : index));
          };
          Table2.prototype.reverse = function() {
            return this.toCollection().reverse();
          };
          Table2.prototype.mapToClass = function(constructor) {
            var _a2 = this, db2 = _a2.db, tableName = _a2.name;
            this.schema.mappedClass = constructor;
            if (constructor.prototype instanceof Entity2) {
              constructor = (function(_super) {
                __extends(class_1, _super);
                function class_1() {
                  return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(class_1.prototype, "db", {
                  get: function() {
                    return db2;
                  },
                  enumerable: false,
                  configurable: true
                });
                class_1.prototype.table = function() {
                  return tableName;
                };
                return class_1;
              })(constructor);
            }
            var inheritedProps = /* @__PURE__ */ new Set();
            for (var proto = constructor.prototype; proto; proto = getProto(proto)) {
              Object.getOwnPropertyNames(proto).forEach(function(propName) {
                return inheritedProps.add(propName);
              });
            }
            var readHook = function(obj) {
              if (!obj)
                return obj;
              var res = Object.create(constructor.prototype);
              for (var m in obj)
                if (!inheritedProps.has(m))
                  try {
                    res[m] = obj[m];
                  } catch (_) {
                  }
              return res;
            };
            if (this.schema.readHook) {
              this.hook.reading.unsubscribe(this.schema.readHook);
            }
            this.schema.readHook = readHook;
            this.hook("reading", readHook);
            return constructor;
          };
          Table2.prototype.defineClass = function() {
            function Class(content) {
              extend(this, content);
            }
            return this.mapToClass(Class);
          };
          Table2.prototype.add = function(obj, key) {
            var _this = this;
            var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
            var objToAdd = obj;
            if (keyPath && auto) {
              objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
            }
            return this._trans("readwrite", function(trans) {
              return _this.core.mutate({
                trans,
                type: "add",
                keys: key != null ? [key] : null,
                values: [objToAdd]
              });
            }).then(function(res) {
              return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
            }).then(function(lastResult) {
              if (keyPath) {
                try {
                  setByKeyPath(obj, keyPath, lastResult);
                } catch (_) {
                }
              }
              return lastResult;
            });
          };
          Table2.prototype.upsert = function(key, modifications) {
            var _this = this;
            var keyPath = this.schema.primKey.keyPath;
            return this._trans("readwrite", function(trans) {
              return _this.core.get({ trans, key }).then(function(existing) {
                var obj = existing !== null && existing !== void 0 ? existing : {};
                applyUpdateSpec(obj, modifications);
                if (keyPath)
                  setByKeyPath(obj, keyPath, key);
                return _this.core.mutate({
                  trans,
                  type: "put",
                  values: [obj],
                  keys: [key],
                  upsert: true,
                  updates: { keys: [key], changeSpecs: [modifications] }
                }).then(function(res) {
                  return res.numFailures ? DexiePromise.reject(res.failures[0]) : !!existing;
                });
              });
            });
          };
          Table2.prototype.update = function(keyOrObject, modifications) {
            if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
              var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
              if (key === void 0)
                return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
              return this.where(":id").equals(key).modify(modifications);
            } else {
              return this.where(":id").equals(keyOrObject).modify(modifications);
            }
          };
          Table2.prototype.put = function(obj, key) {
            var _this = this;
            var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
            var objToAdd = obj;
            if (keyPath && auto) {
              objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
            }
            return this._trans("readwrite", function(trans) {
              return _this.core.mutate({
                trans,
                type: "put",
                values: [objToAdd],
                keys: key != null ? [key] : null
              });
            }).then(function(res) {
              return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
            }).then(function(lastResult) {
              if (keyPath) {
                try {
                  setByKeyPath(obj, keyPath, lastResult);
                } catch (_) {
                }
              }
              return lastResult;
            });
          };
          Table2.prototype.delete = function(key) {
            var _this = this;
            return this._trans("readwrite", function(trans) {
              return _this.core.mutate({ trans, type: "delete", keys: [key] }).then(function(res) {
                return builtInDeletionTrigger(_this, [key], res);
              }).then(function(res) {
                return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
              });
            });
          };
          Table2.prototype.clear = function() {
            var _this = this;
            return this._trans("readwrite", function(trans) {
              return _this.core.mutate({ trans, type: "deleteRange", range: AnyRange }).then(function(res) {
                return builtInDeletionTrigger(_this, null, res);
              });
            }).then(function(res) {
              return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
            });
          };
          Table2.prototype.bulkGet = function(keys2) {
            var _this = this;
            return this._trans("readonly", function(trans) {
              return _this.core.getMany({
                keys: keys2,
                trans
              }).then(function(result) {
                return result.map(function(res) {
                  return _this.hook.reading.fire(res);
                });
              });
            });
          };
          Table2.prototype.bulkAdd = function(objects, keysOrOptions, options) {
            var _this = this;
            var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
            options = options || (keys2 ? void 0 : keysOrOptions);
            var wantResults = options ? options.allKeys : void 0;
            return this._trans("readwrite", function(trans) {
              var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
              if (keyPath && keys2)
                throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
              if (keys2 && keys2.length !== objects.length)
                throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
              var numObjects = objects.length;
              var objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
              return _this.core.mutate({
                trans,
                type: "add",
                keys: keys2,
                values: objectsToAdd,
                wantResults
              }).then(function(_a3) {
                var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
                var result = wantResults ? results : lastResult;
                if (numFailures === 0)
                  return result;
                throw new BulkError("".concat(_this.name, ".bulkAdd(): ").concat(numFailures, " of ").concat(numObjects, " operations failed"), failures);
              });
            });
          };
          Table2.prototype.bulkPut = function(objects, keysOrOptions, options) {
            var _this = this;
            var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
            options = options || (keys2 ? void 0 : keysOrOptions);
            var wantResults = options ? options.allKeys : void 0;
            return this._trans("readwrite", function(trans) {
              var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
              if (keyPath && keys2)
                throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
              if (keys2 && keys2.length !== objects.length)
                throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
              var numObjects = objects.length;
              var objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
              return _this.core.mutate({
                trans,
                type: "put",
                keys: keys2,
                values: objectsToPut,
                wantResults
              }).then(function(_a3) {
                var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
                var result = wantResults ? results : lastResult;
                if (numFailures === 0)
                  return result;
                throw new BulkError("".concat(_this.name, ".bulkPut(): ").concat(numFailures, " of ").concat(numObjects, " operations failed"), failures);
              });
            });
          };
          Table2.prototype.bulkUpdate = function(keysAndChanges) {
            var _this = this;
            var coreTable = this.core;
            var keys2 = keysAndChanges.map(function(entry) {
              return entry.key;
            });
            var changeSpecs = keysAndChanges.map(function(entry) {
              return entry.changes;
            });
            var offsetMap = [];
            return this._trans("readwrite", function(trans) {
              return coreTable.getMany({ trans, keys: keys2, cache: "clone" }).then(function(objs) {
                var resultKeys = [];
                var resultObjs = [];
                keysAndChanges.forEach(function(_a2, idx) {
                  var key = _a2.key, changes = _a2.changes;
                  var obj = objs[idx];
                  if (obj) {
                    for (var _i = 0, _b = Object.keys(changes); _i < _b.length; _i++) {
                      var keyPath = _b[_i];
                      var value = changes[keyPath];
                      if (keyPath === _this.schema.primKey.keyPath) {
                        if (cmp2(value, key) !== 0) {
                          throw new exceptions.Constraint("Cannot update primary key in bulkUpdate()");
                        }
                      } else {
                        setByKeyPath(obj, keyPath, value);
                      }
                    }
                    offsetMap.push(idx);
                    resultKeys.push(key);
                    resultObjs.push(obj);
                  }
                });
                var numEntries = resultKeys.length;
                return coreTable.mutate({
                  trans,
                  type: "put",
                  keys: resultKeys,
                  values: resultObjs,
                  updates: {
                    keys: keys2,
                    changeSpecs
                  }
                }).then(function(_a2) {
                  var numFailures = _a2.numFailures, failures = _a2.failures;
                  if (numFailures === 0)
                    return numEntries;
                  for (var _i = 0, _b = Object.keys(failures); _i < _b.length; _i++) {
                    var offset = _b[_i];
                    var mappedOffset = offsetMap[Number(offset)];
                    if (mappedOffset != null) {
                      var failure = failures[offset];
                      delete failures[offset];
                      failures[mappedOffset] = failure;
                    }
                  }
                  throw new BulkError("".concat(_this.name, ".bulkUpdate(): ").concat(numFailures, " of ").concat(numEntries, " operations failed"), failures);
                });
              });
            });
          };
          Table2.prototype.bulkDelete = function(keys2) {
            var _this = this;
            var numKeys = keys2.length;
            return this._trans("readwrite", function(trans) {
              return _this.core.mutate({ trans, type: "delete", keys: keys2 }).then(function(res) {
                return builtInDeletionTrigger(_this, keys2, res);
              });
            }).then(function(_a2) {
              var numFailures = _a2.numFailures, lastResult = _a2.lastResult, failures = _a2.failures;
              if (numFailures === 0)
                return lastResult;
              throw new BulkError("".concat(_this.name, ".bulkDelete(): ").concat(numFailures, " of ").concat(numKeys, " operations failed"), failures);
            });
          };
          return Table2;
        })();
        function Events(ctx) {
          var evs = {};
          var rv = function(eventName, subscriber) {
            if (subscriber) {
              var i2 = arguments.length, args = new Array(i2 - 1);
              while (--i2)
                args[i2 - 1] = arguments[i2];
              evs[eventName].subscribe.apply(null, args);
              return ctx;
            } else if (typeof eventName === "string") {
              return evs[eventName];
            }
          };
          rv.addEventType = add3;
          for (var i = 1, l = arguments.length; i < l; ++i) {
            add3(arguments[i]);
          }
          return rv;
          function add3(eventName, chainFunction, defaultFunction) {
            if (typeof eventName === "object")
              return addConfiguredEvents(eventName);
            if (!chainFunction)
              chainFunction = reverseStoppableEventChain;
            if (!defaultFunction)
              defaultFunction = nop;
            var context = {
              subscribers: [],
              fire: defaultFunction,
              subscribe: function(cb) {
                if (context.subscribers.indexOf(cb) === -1) {
                  context.subscribers.push(cb);
                  context.fire = chainFunction(context.fire, cb);
                }
              },
              unsubscribe: function(cb) {
                context.subscribers = context.subscribers.filter(function(fn) {
                  return fn !== cb;
                });
                context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
              }
            };
            evs[eventName] = rv[eventName] = context;
            return context;
          }
          function addConfiguredEvents(cfg) {
            keys(cfg).forEach(function(eventName) {
              var args = cfg[eventName];
              if (isArray(args)) {
                add3(eventName, cfg[eventName][0], cfg[eventName][1]);
              } else if (args === "asap") {
                var context = add3(eventName, mirror, function fire() {
                  var i2 = arguments.length, args2 = new Array(i2);
                  while (i2--)
                    args2[i2] = arguments[i2];
                  context.subscribers.forEach(function(fn) {
                    asap$1(function fireEvent() {
                      fn.apply(null, args2);
                    });
                  });
                });
              } else
                throw new exceptions.InvalidArgument("Invalid event config");
            });
          }
        }
        function makeClassConstructor(prototype, constructor) {
          derive(constructor).from({ prototype });
          return constructor;
        }
        function createTableConstructor(db2) {
          return makeClassConstructor(Table.prototype, function Table2(name, tableSchema, trans) {
            this.db = db2;
            this._tx = trans;
            this.name = name;
            this.schema = tableSchema;
            this.hook = db2._allTables[name] ? db2._allTables[name].hook : Events(null, {
              creating: [hookCreatingChain, nop],
              reading: [pureFunctionChain, mirror],
              updating: [hookUpdatingChain, nop],
              deleting: [hookDeletingChain, nop]
            });
          });
        }
        function isPlainKeyRange(ctx, ignoreLimitFilter) {
          return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
        }
        function addFilter(ctx, fn) {
          ctx.filter = combine(ctx.filter, fn);
        }
        function addReplayFilter(ctx, factory, isLimitFilter) {
          var curr = ctx.replayFilter;
          ctx.replayFilter = curr ? function() {
            return combine(curr(), factory());
          } : factory;
          ctx.justLimit = isLimitFilter && !curr;
        }
        function addMatchFilter(ctx, fn) {
          ctx.isMatch = combine(ctx.isMatch, fn);
        }
        function getIndexOrStore(ctx, coreSchema) {
          if (ctx.isPrimKey)
            return coreSchema.primaryKey;
          var index = coreSchema.getIndexByKeyPath(ctx.index);
          if (!index)
            throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
          return index;
        }
        function openCursor(ctx, coreTable, trans) {
          var index = getIndexOrStore(ctx, coreTable.schema);
          return coreTable.openCursor({
            trans,
            values: !ctx.keysOnly,
            reverse: ctx.dir === "prev",
            unique: !!ctx.unique,
            query: {
              index,
              range: ctx.range
            }
          });
        }
        function iter(ctx, fn, coreTrans, coreTable) {
          var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
          if (!ctx.or) {
            return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
          } else {
            var set_1 = {};
            var union = function(item, cursor, advance) {
              if (!filter || filter(cursor, advance, function(result) {
                return cursor.stop(result);
              }, function(err) {
                return cursor.fail(err);
              })) {
                var primaryKey = cursor.primaryKey;
                var key = "" + primaryKey;
                if (key === "[object ArrayBuffer]")
                  key = "" + new Uint8Array(primaryKey);
                if (!hasOwn(set_1, key)) {
                  set_1[key] = true;
                  fn(item, cursor, advance);
                }
              }
            };
            return Promise.all([
              ctx.or._iterate(union, coreTrans),
              iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
            ]);
          }
        }
        function iterate(cursorPromise, filter, fn, valueMapper) {
          var mappedFn = valueMapper ? function(x, c, a) {
            return fn(valueMapper(x), c, a);
          } : fn;
          var wrappedFn = wrap(mappedFn);
          return cursorPromise.then(function(cursor) {
            if (cursor) {
              return cursor.start(function() {
                var c = function() {
                  return cursor.continue();
                };
                if (!filter || filter(cursor, function(advancer) {
                  return c = advancer;
                }, function(val) {
                  cursor.stop(val);
                  c = nop;
                }, function(e) {
                  cursor.fail(e);
                  c = nop;
                }))
                  wrappedFn(cursor.value, cursor, function(advancer) {
                    return c = advancer;
                  });
                c();
              });
            }
          });
        }
        var Collection = (function() {
          function Collection2() {
          }
          Collection2.prototype._read = function(fn, cb) {
            var ctx = this._ctx;
            return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
          };
          Collection2.prototype._write = function(fn) {
            var ctx = this._ctx;
            return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
          };
          Collection2.prototype._addAlgorithm = function(fn) {
            var ctx = this._ctx;
            ctx.algorithm = combine(ctx.algorithm, fn);
          };
          Collection2.prototype._iterate = function(fn, coreTrans) {
            return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
          };
          Collection2.prototype.clone = function(props2) {
            var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
            if (props2)
              extend(ctx, props2);
            rv._ctx = ctx;
            return rv;
          };
          Collection2.prototype.raw = function() {
            this._ctx.valueMapper = null;
            return this;
          };
          Collection2.prototype.each = function(fn) {
            var ctx = this._ctx;
            return this._read(function(trans) {
              return iter(ctx, fn, trans, ctx.table.core);
            });
          };
          Collection2.prototype.count = function(cb) {
            var _this = this;
            return this._read(function(trans) {
              var ctx = _this._ctx;
              var coreTable = ctx.table.core;
              if (isPlainKeyRange(ctx, true)) {
                return coreTable.count({
                  trans,
                  query: {
                    index: getIndexOrStore(ctx, coreTable.schema),
                    range: ctx.range
                  }
                }).then(function(count2) {
                  return Math.min(count2, ctx.limit);
                });
              } else {
                var count = 0;
                return iter(ctx, function() {
                  ++count;
                  return false;
                }, trans, coreTable).then(function() {
                  return count;
                });
              }
            }).then(cb);
          };
          Collection2.prototype.sortBy = function(keyPath, cb) {
            var parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
            function getval(obj, i) {
              if (i)
                return getval(obj[parts[i]], i - 1);
              return obj[lastPart];
            }
            var order = this._ctx.dir === "next" ? 1 : -1;
            function sorter(a, b) {
              var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
              return cmp2(aVal, bVal) * order;
            }
            return this.toArray(function(a) {
              return a.slice().sort(sorter);
            }).then(cb);
          };
          Collection2.prototype.toArray = function(cb) {
            var _this = this;
            return this._read(function(trans) {
              var ctx = _this._ctx;
              if (isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                var valueMapper_1 = ctx.valueMapper;
                var index = getIndexOrStore(ctx, ctx.table.core.schema);
                return ctx.table.core.query({
                  trans,
                  limit: ctx.limit,
                  values: true,
                  direction: ctx.dir === "prev" ? "prev" : void 0,
                  query: {
                    index,
                    range: ctx.range
                  }
                }).then(function(_a2) {
                  var result = _a2.result;
                  return valueMapper_1 ? result.map(valueMapper_1) : result;
                });
              } else {
                var a_1 = [];
                return iter(ctx, function(item) {
                  return a_1.push(item);
                }, trans, ctx.table.core).then(function() {
                  return a_1;
                });
              }
            }, cb);
          };
          Collection2.prototype.offset = function(offset) {
            var ctx = this._ctx;
            if (offset <= 0)
              return this;
            ctx.offset += offset;
            if (isPlainKeyRange(ctx)) {
              addReplayFilter(ctx, function() {
                var offsetLeft = offset;
                return function(cursor, advance) {
                  if (offsetLeft === 0)
                    return true;
                  if (offsetLeft === 1) {
                    --offsetLeft;
                    return false;
                  }
                  advance(function() {
                    cursor.advance(offsetLeft);
                    offsetLeft = 0;
                  });
                  return false;
                };
              });
            } else {
              addReplayFilter(ctx, function() {
                var offsetLeft = offset;
                return function() {
                  return --offsetLeft < 0;
                };
              });
            }
            return this;
          };
          Collection2.prototype.limit = function(numRows) {
            this._ctx.limit = Math.min(this._ctx.limit, numRows);
            addReplayFilter(this._ctx, function() {
              var rowsLeft = numRows;
              return function(cursor, advance, resolve) {
                if (--rowsLeft <= 0)
                  advance(resolve);
                return rowsLeft >= 0;
              };
            }, true);
            return this;
          };
          Collection2.prototype.until = function(filterFunction, bIncludeStopEntry) {
            addFilter(this._ctx, function(cursor, advance, resolve) {
              if (filterFunction(cursor.value)) {
                advance(resolve);
                return bIncludeStopEntry;
              } else {
                return true;
              }
            });
            return this;
          };
          Collection2.prototype.first = function(cb) {
            return this.limit(1).toArray(function(a) {
              return a[0];
            }).then(cb);
          };
          Collection2.prototype.last = function(cb) {
            return this.reverse().first(cb);
          };
          Collection2.prototype.filter = function(filterFunction) {
            addFilter(this._ctx, function(cursor) {
              return filterFunction(cursor.value);
            });
            addMatchFilter(this._ctx, filterFunction);
            return this;
          };
          Collection2.prototype.and = function(filter) {
            return this.filter(filter);
          };
          Collection2.prototype.or = function(indexName) {
            return new this.db.WhereClause(this._ctx.table, indexName, this);
          };
          Collection2.prototype.reverse = function() {
            this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
            if (this._ondirectionchange)
              this._ondirectionchange(this._ctx.dir);
            return this;
          };
          Collection2.prototype.desc = function() {
            return this.reverse();
          };
          Collection2.prototype.eachKey = function(cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            return this.each(function(val, cursor) {
              cb(cursor.key, cursor);
            });
          };
          Collection2.prototype.eachUniqueKey = function(cb) {
            this._ctx.unique = "unique";
            return this.eachKey(cb);
          };
          Collection2.prototype.eachPrimaryKey = function(cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            return this.each(function(val, cursor) {
              cb(cursor.primaryKey, cursor);
            });
          };
          Collection2.prototype.keys = function(cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            var a = [];
            return this.each(function(item, cursor) {
              a.push(cursor.key);
            }).then(function() {
              return a;
            }).then(cb);
          };
          Collection2.prototype.primaryKeys = function(cb) {
            var ctx = this._ctx;
            if (isPlainKeyRange(ctx, true) && ctx.limit > 0) {
              return this._read(function(trans) {
                var index = getIndexOrStore(ctx, ctx.table.core.schema);
                return ctx.table.core.query({
                  trans,
                  values: false,
                  limit: ctx.limit,
                  direction: ctx.dir === "prev" ? "prev" : void 0,
                  query: {
                    index,
                    range: ctx.range
                  }
                });
              }).then(function(_a2) {
                var result = _a2.result;
                return result;
              }).then(cb);
            }
            ctx.keysOnly = !ctx.isMatch;
            var a = [];
            return this.each(function(item, cursor) {
              a.push(cursor.primaryKey);
            }).then(function() {
              return a;
            }).then(cb);
          };
          Collection2.prototype.uniqueKeys = function(cb) {
            this._ctx.unique = "unique";
            return this.keys(cb);
          };
          Collection2.prototype.firstKey = function(cb) {
            return this.limit(1).keys(function(a) {
              return a[0];
            }).then(cb);
          };
          Collection2.prototype.lastKey = function(cb) {
            return this.reverse().firstKey(cb);
          };
          Collection2.prototype.distinct = function() {
            var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
            if (!idx || !idx.multi)
              return this;
            var set = {};
            addFilter(this._ctx, function(cursor) {
              var strKey = cursor.primaryKey.toString();
              var found = hasOwn(set, strKey);
              set[strKey] = true;
              return !found;
            });
            return this;
          };
          Collection2.prototype.modify = function(changes) {
            var _this = this;
            var ctx = this._ctx;
            return this._write(function(trans) {
              var modifyer;
              if (typeof changes === "function") {
                modifyer = changes;
              } else {
                modifyer = function(item) {
                  return applyUpdateSpec(item, changes);
                };
              }
              var coreTable = ctx.table.core;
              var _a2 = coreTable.schema.primaryKey, outbound = _a2.outbound, extractKey = _a2.extractKey;
              var limit = 200;
              var modifyChunkSize = _this.db._options.modifyChunkSize;
              if (modifyChunkSize) {
                if (typeof modifyChunkSize == "object") {
                  limit = modifyChunkSize[coreTable.name] || modifyChunkSize["*"] || 200;
                } else {
                  limit = modifyChunkSize;
                }
              }
              var totalFailures = [];
              var successCount = 0;
              var failedKeys = [];
              var applyMutateResult = function(expectedCount, res) {
                var failures = res.failures, numFailures = res.numFailures;
                successCount += expectedCount - numFailures;
                for (var _i = 0, _a3 = keys(failures); _i < _a3.length; _i++) {
                  var pos = _a3[_i];
                  totalFailures.push(failures[pos]);
                }
              };
              var isUnconditionalDelete = changes === deleteCallback;
              return _this.clone().primaryKeys().then(function(keys2) {
                var criteria = isPlainKeyRange(ctx) && ctx.limit === Infinity && (typeof changes !== "function" || isUnconditionalDelete) && {
                  index: ctx.index,
                  range: ctx.range
                };
                var nextChunk = function(offset) {
                  var count = Math.min(limit, keys2.length - offset);
                  var keysInChunk = keys2.slice(offset, offset + count);
                  return (isUnconditionalDelete ? Promise.resolve([]) : coreTable.getMany({
                    trans,
                    keys: keysInChunk,
                    cache: "immutable"
                  })).then(function(values) {
                    var addValues = [];
                    var putValues = [];
                    var putKeys = outbound ? [] : null;
                    var deleteKeys = isUnconditionalDelete ? keysInChunk : [];
                    if (!isUnconditionalDelete)
                      for (var i = 0; i < count; ++i) {
                        var origValue = values[i];
                        var ctx_1 = {
                          value: deepClone(origValue),
                          primKey: keys2[offset + i]
                        };
                        if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                          if (ctx_1.value == null) {
                            deleteKeys.push(keys2[offset + i]);
                          } else if (!outbound && cmp2(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                            deleteKeys.push(keys2[offset + i]);
                            addValues.push(ctx_1.value);
                          } else {
                            putValues.push(ctx_1.value);
                            if (outbound)
                              putKeys.push(keys2[offset + i]);
                          }
                        }
                      }
                    return Promise.resolve(addValues.length > 0 && coreTable.mutate({ trans, type: "add", values: addValues }).then(function(res) {
                      for (var pos in res.failures) {
                        deleteKeys.splice(parseInt(pos), 1);
                      }
                      applyMutateResult(addValues.length, res);
                    })).then(function() {
                      return (putValues.length > 0 || criteria && typeof changes === "object") && coreTable.mutate({
                        trans,
                        type: "put",
                        keys: putKeys,
                        values: putValues,
                        criteria,
                        changeSpec: typeof changes !== "function" && changes,
                        isAdditionalChunk: offset > 0
                      }).then(function(res) {
                        return applyMutateResult(putValues.length, res);
                      });
                    }).then(function() {
                      return (deleteKeys.length > 0 || criteria && isUnconditionalDelete) && coreTable.mutate({
                        trans,
                        type: "delete",
                        keys: deleteKeys,
                        criteria,
                        isAdditionalChunk: offset > 0
                      }).then(function(res) {
                        return builtInDeletionTrigger(ctx.table, deleteKeys, res);
                      }).then(function(res) {
                        return applyMutateResult(deleteKeys.length, res);
                      });
                    }).then(function() {
                      return keys2.length > offset + count && nextChunk(offset + limit);
                    });
                  });
                };
                return nextChunk(0).then(function() {
                  if (totalFailures.length > 0)
                    throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
                  return keys2.length;
                });
              });
            });
          };
          Collection2.prototype.delete = function() {
            var ctx = this._ctx, range = ctx.range;
            if (isPlainKeyRange(ctx) && !ctx.table.schema.yProps && (ctx.isPrimKey || range.type === 3)) {
              return this._write(function(trans) {
                var primaryKey = ctx.table.core.schema.primaryKey;
                var coreRange = range;
                return ctx.table.core.count({ trans, query: { index: primaryKey, range: coreRange } }).then(function(count) {
                  return ctx.table.core.mutate({ trans, type: "deleteRange", range: coreRange }).then(function(_a2) {
                    var failures = _a2.failures, numFailures = _a2.numFailures;
                    if (numFailures)
                      throw new ModifyError("Could not delete some values", Object.keys(failures).map(function(pos) {
                        return failures[pos];
                      }), count - numFailures);
                    return count - numFailures;
                  });
                });
              });
            }
            return this.modify(deleteCallback);
          };
          return Collection2;
        })();
        var deleteCallback = function(value, ctx) {
          return ctx.value = null;
        };
        function createCollectionConstructor(db2) {
          return makeClassConstructor(Collection.prototype, function Collection2(whereClause, keyRangeGenerator) {
            this.db = db2;
            var keyRange = AnyRange, error = null;
            if (keyRangeGenerator)
              try {
                keyRange = keyRangeGenerator();
              } catch (ex) {
                error = ex;
              }
            var whereCtx = whereClause._ctx;
            var table = whereCtx.table;
            var readingHook = table.hook.reading.fire;
            this._ctx = {
              table,
              index: whereCtx.index,
              isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
              range: keyRange,
              keysOnly: false,
              dir: "next",
              unique: "",
              algorithm: null,
              filter: null,
              replayFilter: null,
              justLimit: true,
              isMatch: null,
              offset: 0,
              limit: Infinity,
              error,
              or: whereCtx.or,
              valueMapper: readingHook !== mirror ? readingHook : null
            };
          });
        }
        function simpleCompare(a, b) {
          return a < b ? -1 : a === b ? 0 : 1;
        }
        function simpleCompareReverse(a, b) {
          return a > b ? -1 : a === b ? 0 : 1;
        }
        function fail(collectionOrWhereClause, err, T) {
          var collection = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
          collection._ctx.error = T ? new T(err) : new TypeError(err);
          return collection;
        }
        function emptyCollection(whereClause) {
          return new whereClause.Collection(whereClause, function() {
            return rangeEqual("");
          }).limit(0);
        }
        function upperFactory(dir) {
          return dir === "next" ? function(s) {
            return s.toUpperCase();
          } : function(s) {
            return s.toLowerCase();
          };
        }
        function lowerFactory(dir) {
          return dir === "next" ? function(s) {
            return s.toLowerCase();
          } : function(s) {
            return s.toUpperCase();
          };
        }
        function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp3, dir) {
          var length = Math.min(key.length, lowerNeedle.length);
          var llp = -1;
          for (var i = 0; i < length; ++i) {
            var lwrKeyChar = lowerKey[i];
            if (lwrKeyChar !== lowerNeedle[i]) {
              if (cmp3(key[i], upperNeedle[i]) < 0)
                return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
              if (cmp3(key[i], lowerNeedle[i]) < 0)
                return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
              if (llp >= 0)
                return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
              return null;
            }
            if (cmp3(key[i], lwrKeyChar) < 0)
              llp = i;
          }
          if (length < lowerNeedle.length && dir === "next")
            return key + upperNeedle.substr(key.length);
          if (length < key.length && dir === "prev")
            return key.substr(0, upperNeedle.length);
          return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
        }
        function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
          var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
          if (!needles.every(function(s) {
            return typeof s === "string";
          })) {
            return fail(whereClause, STRING_EXPECTED);
          }
          function initDirection(dir) {
            upper = upperFactory(dir);
            lower = lowerFactory(dir);
            compare = dir === "next" ? simpleCompare : simpleCompareReverse;
            var needleBounds = needles.map(function(needle) {
              return { lower: lower(needle), upper: upper(needle) };
            }).sort(function(a, b) {
              return compare(a.lower, b.lower);
            });
            upperNeedles = needleBounds.map(function(nb) {
              return nb.upper;
            });
            lowerNeedles = needleBounds.map(function(nb) {
              return nb.lower;
            });
            direction = dir;
            nextKeySuffix = dir === "next" ? "" : suffix;
          }
          initDirection("next");
          var c = new whereClause.Collection(whereClause, function() {
            return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix);
          });
          c._ondirectionchange = function(direction2) {
            initDirection(direction2);
          };
          var firstPossibleNeedle = 0;
          c._addAlgorithm(function(cursor, advance, resolve) {
            var key = cursor.key;
            if (typeof key !== "string")
              return false;
            var lowerKey = lower(key);
            if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
              return true;
            } else {
              var lowestPossibleCasing = null;
              for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
                var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
                if (casing === null && lowestPossibleCasing === null)
                  firstPossibleNeedle = i + 1;
                else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
                  lowestPossibleCasing = casing;
                }
              }
              if (lowestPossibleCasing !== null) {
                advance(function() {
                  cursor.continue(lowestPossibleCasing + nextKeySuffix);
                });
              } else {
                advance(resolve);
              }
              return false;
            }
          });
          return c;
        }
        function createRange(lower, upper, lowerOpen, upperOpen) {
          return {
            type: 2,
            lower,
            upper,
            lowerOpen,
            upperOpen
          };
        }
        function rangeEqual(value) {
          return {
            type: 1,
            lower: value,
            upper: value
          };
        }
        var WhereClause = (function() {
          function WhereClause2() {
          }
          Object.defineProperty(WhereClause2.prototype, "Collection", {
            get: function() {
              return this._ctx.table.db.Collection;
            },
            enumerable: false,
            configurable: true
          });
          WhereClause2.prototype.between = function(lower, upper, includeLower, includeUpper) {
            includeLower = includeLower !== false;
            includeUpper = includeUpper === true;
            try {
              if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
                return emptyCollection(this);
              return new this.Collection(this, function() {
                return createRange(lower, upper, !includeLower, !includeUpper);
              });
            } catch (e) {
              return fail(this, INVALID_KEY_ARGUMENT);
            }
          };
          WhereClause2.prototype.equals = function(value) {
            if (value == null)
              return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function() {
              return rangeEqual(value);
            });
          };
          WhereClause2.prototype.above = function(value) {
            if (value == null)
              return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function() {
              return createRange(value, void 0, true);
            });
          };
          WhereClause2.prototype.aboveOrEqual = function(value) {
            if (value == null)
              return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function() {
              return createRange(value, void 0, false);
            });
          };
          WhereClause2.prototype.below = function(value) {
            if (value == null)
              return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function() {
              return createRange(void 0, value, false, true);
            });
          };
          WhereClause2.prototype.belowOrEqual = function(value) {
            if (value == null)
              return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function() {
              return createRange(void 0, value);
            });
          };
          WhereClause2.prototype.startsWith = function(str) {
            if (typeof str !== "string")
              return fail(this, STRING_EXPECTED);
            return this.between(str, str + maxString, true, true);
          };
          WhereClause2.prototype.startsWithIgnoreCase = function(str) {
            if (str === "")
              return this.startsWith(str);
            return addIgnoreCaseAlgorithm(this, function(x, a) {
              return x.indexOf(a[0]) === 0;
            }, [str], maxString);
          };
          WhereClause2.prototype.equalsIgnoreCase = function(str) {
            return addIgnoreCaseAlgorithm(this, function(x, a) {
              return x === a[0];
            }, [str], "");
          };
          WhereClause2.prototype.anyOfIgnoreCase = function() {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
              return emptyCollection(this);
            return addIgnoreCaseAlgorithm(this, function(x, a) {
              return a.indexOf(x) !== -1;
            }, set, "");
          };
          WhereClause2.prototype.startsWithAnyOfIgnoreCase = function() {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
              return emptyCollection(this);
            return addIgnoreCaseAlgorithm(this, function(x, a) {
              return a.some(function(n) {
                return x.indexOf(n) === 0;
              });
            }, set, maxString);
          };
          WhereClause2.prototype.anyOf = function() {
            var _this = this;
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            var compare = this._cmp;
            try {
              set.sort(compare);
            } catch (e) {
              return fail(this, INVALID_KEY_ARGUMENT);
            }
            if (set.length === 0)
              return emptyCollection(this);
            var c = new this.Collection(this, function() {
              return createRange(set[0], set[set.length - 1]);
            });
            c._ondirectionchange = function(direction) {
              compare = direction === "next" ? _this._ascending : _this._descending;
              set.sort(compare);
            };
            var i = 0;
            c._addAlgorithm(function(cursor, advance, resolve) {
              var key = cursor.key;
              while (compare(key, set[i]) > 0) {
                ++i;
                if (i === set.length) {
                  advance(resolve);
                  return false;
                }
              }
              if (compare(key, set[i]) === 0) {
                return true;
              } else {
                advance(function() {
                  cursor.continue(set[i]);
                });
                return false;
              }
            });
            return c;
          };
          WhereClause2.prototype.notEqual = function(value) {
            return this.inAnyRange([
              [minKey, value],
              [value, this.db._maxKey]
            ], { includeLowers: false, includeUppers: false });
          };
          WhereClause2.prototype.noneOf = function() {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
              return new this.Collection(this);
            try {
              set.sort(this._ascending);
            } catch (e) {
              return fail(this, INVALID_KEY_ARGUMENT);
            }
            var ranges = set.reduce(function(res, val) {
              return res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]];
            }, null);
            ranges.push([set[set.length - 1], this.db._maxKey]);
            return this.inAnyRange(ranges, {
              includeLowers: false,
              includeUppers: false
            });
          };
          WhereClause2.prototype.inAnyRange = function(ranges, options) {
            var _this = this;
            var cmp3 = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
            if (ranges.length === 0)
              return emptyCollection(this);
            if (!ranges.every(function(range) {
              return range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0;
            })) {
              return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
            }
            var includeLowers = !options || options.includeLowers !== false;
            var includeUppers = options && options.includeUppers === true;
            function addRange2(ranges2, newRange) {
              var i = 0, l = ranges2.length;
              for (; i < l; ++i) {
                var range = ranges2[i];
                if (cmp3(newRange[0], range[1]) < 0 && cmp3(newRange[1], range[0]) > 0) {
                  range[0] = min(range[0], newRange[0]);
                  range[1] = max(range[1], newRange[1]);
                  break;
                }
              }
              if (i === l)
                ranges2.push(newRange);
              return ranges2;
            }
            var sortDirection = ascending;
            function rangeSorter(a, b) {
              return sortDirection(a[0], b[0]);
            }
            var set;
            try {
              set = ranges.reduce(addRange2, []);
              set.sort(rangeSorter);
            } catch (ex) {
              return fail(this, INVALID_KEY_ARGUMENT);
            }
            var rangePos = 0;
            var keyIsBeyondCurrentEntry = includeUppers ? function(key) {
              return ascending(key, set[rangePos][1]) > 0;
            } : function(key) {
              return ascending(key, set[rangePos][1]) >= 0;
            };
            var keyIsBeforeCurrentEntry = includeLowers ? function(key) {
              return descending(key, set[rangePos][0]) > 0;
            } : function(key) {
              return descending(key, set[rangePos][0]) >= 0;
            };
            function keyWithinCurrentRange(key) {
              return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
            }
            var checkKey = keyIsBeyondCurrentEntry;
            var c = new this.Collection(this, function() {
              return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers);
            });
            c._ondirectionchange = function(direction) {
              if (direction === "next") {
                checkKey = keyIsBeyondCurrentEntry;
                sortDirection = ascending;
              } else {
                checkKey = keyIsBeforeCurrentEntry;
                sortDirection = descending;
              }
              set.sort(rangeSorter);
            };
            c._addAlgorithm(function(cursor, advance, resolve) {
              var key = cursor.key;
              while (checkKey(key)) {
                ++rangePos;
                if (rangePos === set.length) {
                  advance(resolve);
                  return false;
                }
              }
              if (keyWithinCurrentRange(key)) {
                return true;
              } else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
                return false;
              } else {
                advance(function() {
                  if (sortDirection === ascending)
                    cursor.continue(set[rangePos][0]);
                  else
                    cursor.continue(set[rangePos][1]);
                });
                return false;
              }
            });
            return c;
          };
          WhereClause2.prototype.startsWithAnyOf = function() {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (!set.every(function(s) {
              return typeof s === "string";
            })) {
              return fail(this, "startsWithAnyOf() only works with strings");
            }
            if (set.length === 0)
              return emptyCollection(this);
            return this.inAnyRange(set.map(function(str) {
              return [str, str + maxString];
            }));
          };
          return WhereClause2;
        })();
        function createWhereClauseConstructor(db2) {
          return makeClassConstructor(WhereClause.prototype, function WhereClause2(table, index, orCollection) {
            this.db = db2;
            this._ctx = {
              table,
              index: index === ":id" ? null : index,
              or: orCollection
            };
            this._cmp = this._ascending = cmp2;
            this._descending = function(a, b) {
              return cmp2(b, a);
            };
            this._max = function(a, b) {
              return cmp2(a, b) > 0 ? a : b;
            };
            this._min = function(a, b) {
              return cmp2(a, b) < 0 ? a : b;
            };
            this._IDBKeyRange = db2._deps.IDBKeyRange;
            if (!this._IDBKeyRange)
              throw new exceptions.MissingAPI();
          });
        }
        function eventRejectHandler(reject) {
          return wrap(function(event) {
            preventDefault(event);
            reject(event.target.error);
            return false;
          });
        }
        function preventDefault(event) {
          if (event.stopPropagation)
            event.stopPropagation();
          if (event.preventDefault)
            event.preventDefault();
        }
        var DEXIE_STORAGE_MUTATED_EVENT_NAME = "storagemutated";
        var STORAGE_MUTATED_DOM_EVENT_NAME = "x-storagemutated-1";
        var globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);
        var Transaction = (function() {
          function Transaction2() {
          }
          Transaction2.prototype._lock = function() {
            assert(!PSD.global);
            ++this._reculock;
            if (this._reculock === 1 && !PSD.global)
              PSD.lockOwnerFor = this;
            return this;
          };
          Transaction2.prototype._unlock = function() {
            assert(!PSD.global);
            if (--this._reculock === 0) {
              if (!PSD.global)
                PSD.lockOwnerFor = null;
              while (this._blockedFuncs.length > 0 && !this._locked()) {
                var fnAndPSD = this._blockedFuncs.shift();
                try {
                  usePSD(fnAndPSD[1], fnAndPSD[0]);
                } catch (e) {
                }
              }
            }
            return this;
          };
          Transaction2.prototype._locked = function() {
            return this._reculock && PSD.lockOwnerFor !== this;
          };
          Transaction2.prototype.create = function(idbtrans) {
            var _this = this;
            if (!this.mode)
              return this;
            var idbdb = this.db.idbdb;
            var dbOpenError = this.db._state.dbOpenError;
            assert(!this.idbtrans);
            if (!idbtrans && !idbdb) {
              switch (dbOpenError && dbOpenError.name) {
                case "DatabaseClosedError":
                  throw new exceptions.DatabaseClosed(dbOpenError);
                case "MissingAPIError":
                  throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
                default:
                  throw new exceptions.OpenFailed(dbOpenError);
              }
            }
            if (!this.active)
              throw new exceptions.TransactionInactive();
            assert(this._completion._state === null);
            idbtrans = this.idbtrans = idbtrans || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }) : idbdb.transaction(this.storeNames, this.mode, {
              durability: this.chromeTransactionDurability
            }));
            idbtrans.onerror = wrap(function(ev) {
              preventDefault(ev);
              _this._reject(idbtrans.error);
            });
            idbtrans.onabort = wrap(function(ev) {
              preventDefault(ev);
              _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
              _this.active = false;
              _this.on("abort").fire(ev);
            });
            idbtrans.oncomplete = wrap(function() {
              _this.active = false;
              _this._resolve();
              if ("mutatedParts" in idbtrans) {
                globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
              }
            });
            return this;
          };
          Transaction2.prototype._promise = function(mode, fn, bWriteLock) {
            var _this = this;
            if (mode === "readwrite" && this.mode !== "readwrite")
              return rejection(new exceptions.ReadOnly("Transaction is readonly"));
            if (!this.active)
              return rejection(new exceptions.TransactionInactive());
            if (this._locked()) {
              return new DexiePromise(function(resolve, reject) {
                _this._blockedFuncs.push([
                  function() {
                    _this._promise(mode, fn, bWriteLock).then(resolve, reject);
                  },
                  PSD
                ]);
              });
            } else if (bWriteLock) {
              return newScope(function() {
                var p2 = new DexiePromise(function(resolve, reject) {
                  _this._lock();
                  var rv = fn(resolve, reject, _this);
                  if (rv && rv.then)
                    rv.then(resolve, reject);
                });
                p2.finally(function() {
                  return _this._unlock();
                });
                p2._lib = true;
                return p2;
              });
            } else {
              var p = new DexiePromise(function(resolve, reject) {
                var rv = fn(resolve, reject, _this);
                if (rv && rv.then)
                  rv.then(resolve, reject);
              });
              p._lib = true;
              return p;
            }
          };
          Transaction2.prototype._root = function() {
            return this.parent ? this.parent._root() : this;
          };
          Transaction2.prototype.waitFor = function(promiseLike) {
            var root = this._root();
            var promise = DexiePromise.resolve(promiseLike);
            if (root._waitingFor) {
              root._waitingFor = root._waitingFor.then(function() {
                return promise;
              });
            } else {
              root._waitingFor = promise;
              root._waitingQueue = [];
              var store = root.idbtrans.objectStore(root.storeNames[0]);
              (function spin() {
                ++root._spinCount;
                while (root._waitingQueue.length)
                  root._waitingQueue.shift()();
                if (root._waitingFor)
                  store.get(-Infinity).onsuccess = spin;
              })();
            }
            var currentWaitPromise = root._waitingFor;
            return new DexiePromise(function(resolve, reject) {
              promise.then(function(res) {
                return root._waitingQueue.push(wrap(resolve.bind(null, res)));
              }, function(err) {
                return root._waitingQueue.push(wrap(reject.bind(null, err)));
              }).finally(function() {
                if (root._waitingFor === currentWaitPromise) {
                  root._waitingFor = null;
                }
              });
            });
          };
          Transaction2.prototype.abort = function() {
            if (this.active) {
              this.active = false;
              if (this.idbtrans)
                this.idbtrans.abort();
              this._reject(new exceptions.Abort());
            }
          };
          Transaction2.prototype.table = function(tableName) {
            var memoizedTables = this._memoizedTables || (this._memoizedTables = {});
            if (hasOwn(memoizedTables, tableName))
              return memoizedTables[tableName];
            var tableSchema = this.schema[tableName];
            if (!tableSchema) {
              throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
            }
            var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
            transactionBoundTable.core = this.db.core.table(tableName);
            memoizedTables[tableName] = transactionBoundTable;
            return transactionBoundTable;
          };
          return Transaction2;
        })();
        function createTransactionConstructor(db2) {
          return makeClassConstructor(Transaction.prototype, function Transaction2(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
            var _this = this;
            if (mode !== "readonly")
              storeNames.forEach(function(storeName) {
                var _a2;
                var yProps = (_a2 = dbschema[storeName]) === null || _a2 === void 0 ? void 0 : _a2.yProps;
                if (yProps)
                  storeNames = storeNames.concat(yProps.map(function(p) {
                    return p.updatesTable;
                  }));
              });
            this.db = db2;
            this.mode = mode;
            this.storeNames = storeNames;
            this.schema = dbschema;
            this.chromeTransactionDurability = chromeTransactionDurability;
            this.idbtrans = null;
            this.on = Events(this, "complete", "error", "abort");
            this.parent = parent || null;
            this.active = true;
            this._reculock = 0;
            this._blockedFuncs = [];
            this._resolve = null;
            this._reject = null;
            this._waitingFor = null;
            this._waitingQueue = null;
            this._spinCount = 0;
            this._completion = new DexiePromise(function(resolve, reject) {
              _this._resolve = resolve;
              _this._reject = reject;
            });
            this._completion.then(function() {
              _this.active = false;
              _this.on.complete.fire();
            }, function(e) {
              var wasActive = _this.active;
              _this.active = false;
              _this.on.error.fire(e);
              _this.parent ? _this.parent._reject(e) : wasActive && _this.idbtrans && _this.idbtrans.abort();
              return rejection(e);
            });
          });
        }
        function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey, type2) {
          return {
            name,
            keyPath,
            unique,
            multi,
            auto,
            compound,
            src: (unique && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath),
            type: type2
          };
        }
        function nameFromKeyPath(keyPath) {
          return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
        }
        function createTableSchema(name, primKey, indexes) {
          return {
            name,
            primKey,
            indexes,
            mappedClass: null,
            idxByName: arrayToObject(indexes, function(index) {
              return [index.name, index];
            })
          };
        }
        function safariMultiStoreFix(storeNames) {
          return storeNames.length === 1 ? storeNames[0] : storeNames;
        }
        var getMaxKey = function(IdbKeyRange) {
          try {
            IdbKeyRange.only([[]]);
            getMaxKey = function() {
              return [[]];
            };
            return [[]];
          } catch (e) {
            getMaxKey = function() {
              return maxString;
            };
            return maxString;
          }
        };
        function getKeyExtractor(keyPath) {
          if (keyPath == null) {
            return function() {
              return void 0;
            };
          } else if (typeof keyPath === "string") {
            return getSinglePathKeyExtractor(keyPath);
          } else {
            return function(obj) {
              return getByKeyPath(obj, keyPath);
            };
          }
        }
        function getSinglePathKeyExtractor(keyPath) {
          var split = keyPath.split(".");
          if (split.length === 1) {
            return function(obj) {
              return obj[keyPath];
            };
          } else {
            return function(obj) {
              return getByKeyPath(obj, keyPath);
            };
          }
        }
        function arrayify(arrayLike) {
          return [].slice.call(arrayLike);
        }
        var _id_counter = 0;
        function getKeyPathAlias(keyPath) {
          return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : "[".concat(keyPath.join("+"), "]");
        }
        function createDBCore(db2, IdbKeyRange, tmpTrans) {
          function extractSchema(db3, trans) {
            var tables2 = arrayify(db3.objectStoreNames);
            var tempStore = tables2.length > 0 ? trans.objectStore(tables2[0]) : {};
            return {
              schema: {
                name: db3.name,
                tables: tables2.map(function(table) {
                  return trans.objectStore(table);
                }).map(function(store) {
                  var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
                  var compound = isArray(keyPath);
                  var outbound = keyPath == null;
                  var indexByKeyPath = {};
                  var result = {
                    name: store.name,
                    primaryKey: {
                      name: null,
                      isPrimaryKey: true,
                      outbound,
                      compound,
                      keyPath,
                      autoIncrement,
                      unique: true,
                      extractKey: getKeyExtractor(keyPath)
                    },
                    indexes: arrayify(store.indexNames).map(function(indexName) {
                      return store.index(indexName);
                    }).map(function(index) {
                      var name = index.name, unique = index.unique, multiEntry = index.multiEntry, keyPath2 = index.keyPath;
                      var compound2 = isArray(keyPath2);
                      var result2 = {
                        name,
                        compound: compound2,
                        keyPath: keyPath2,
                        unique,
                        multiEntry,
                        extractKey: getKeyExtractor(keyPath2)
                      };
                      indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
                      return result2;
                    }),
                    getIndexByKeyPath: function(keyPath2) {
                      return indexByKeyPath[getKeyPathAlias(keyPath2)];
                    }
                  };
                  indexByKeyPath[":id"] = result.primaryKey;
                  if (keyPath != null) {
                    indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
                  }
                  return result;
                })
              },
              hasGetAll: tables2.length > 0 && "getAll" in tempStore && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604),
              hasIdb3Features: "getAllRecords" in tempStore
            };
          }
          function makeIDBKeyRange(range) {
            if (range.type === 3)
              return null;
            if (range.type === 4)
              throw new Error("Cannot convert never type to IDBKeyRange");
            var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
            var idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
            return idbRange;
          }
          function createDbCoreTable(tableSchema) {
            var tableName = tableSchema.name;
            function mutate(_a3) {
              var trans = _a3.trans, type2 = _a3.type, keys2 = _a3.keys, values = _a3.values, range = _a3.range;
              return new Promise(function(resolve, reject) {
                resolve = wrap(resolve);
                var store = trans.objectStore(tableName);
                var outbound = store.keyPath == null;
                var isAddOrPut = type2 === "put" || type2 === "add";
                if (!isAddOrPut && type2 !== "delete" && type2 !== "deleteRange")
                  throw new Error("Invalid operation type: " + type2);
                var length = (keys2 || values || { length: 1 }).length;
                if (keys2 && values && keys2.length !== values.length) {
                  throw new Error("Given keys array must have same length as given values array.");
                }
                if (length === 0)
                  return resolve({
                    numFailures: 0,
                    failures: {},
                    results: [],
                    lastResult: void 0
                  });
                var req;
                var reqs = [];
                var failures = [];
                var numFailures = 0;
                var errorHandler = function(event) {
                  ++numFailures;
                  preventDefault(event);
                };
                if (type2 === "deleteRange") {
                  if (range.type === 4)
                    return resolve({
                      numFailures,
                      failures,
                      results: [],
                      lastResult: void 0
                    });
                  if (range.type === 3)
                    reqs.push(req = store.clear());
                  else
                    reqs.push(req = store.delete(makeIDBKeyRange(range)));
                } else {
                  var _a4 = isAddOrPut ? outbound ? [values, keys2] : [values, null] : [keys2, null], args1 = _a4[0], args2 = _a4[1];
                  if (isAddOrPut) {
                    for (var i = 0; i < length; ++i) {
                      reqs.push(req = args2 && args2[i] !== void 0 ? store[type2](args1[i], args2[i]) : store[type2](args1[i]));
                      req.onerror = errorHandler;
                    }
                  } else {
                    for (var i = 0; i < length; ++i) {
                      reqs.push(req = store[type2](args1[i]));
                      req.onerror = errorHandler;
                    }
                  }
                }
                var done = function(event) {
                  var lastResult = event.target.result;
                  reqs.forEach(function(req2, i2) {
                    return req2.error != null && (failures[i2] = req2.error);
                  });
                  resolve({
                    numFailures,
                    failures,
                    results: type2 === "delete" ? keys2 : reqs.map(function(req2) {
                      return req2.result;
                    }),
                    lastResult
                  });
                };
                req.onerror = function(event) {
                  errorHandler(event);
                  done(event);
                };
                req.onsuccess = done;
              });
            }
            function openCursor2(_a3) {
              var trans = _a3.trans, values = _a3.values, query2 = _a3.query, reverse = _a3.reverse, unique = _a3.unique;
              return new Promise(function(resolve, reject) {
                resolve = wrap(resolve);
                var index = query2.index, range = query2.range;
                var store = trans.objectStore(tableName);
                var source = index.isPrimaryKey ? store : store.index(index.name);
                var direction = reverse ? unique ? "prevunique" : "prev" : unique ? "nextunique" : "next";
                var req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
                req.onerror = eventRejectHandler(reject);
                req.onsuccess = wrap(function(ev) {
                  var cursor = req.result;
                  if (!cursor) {
                    resolve(null);
                    return;
                  }
                  cursor.___id = ++_id_counter;
                  cursor.done = false;
                  var _cursorContinue = cursor.continue.bind(cursor);
                  var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
                  if (_cursorContinuePrimaryKey)
                    _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
                  var _cursorAdvance = cursor.advance.bind(cursor);
                  var doThrowCursorIsNotStarted = function() {
                    throw new Error("Cursor not started");
                  };
                  var doThrowCursorIsStopped = function() {
                    throw new Error("Cursor not stopped");
                  };
                  cursor.trans = trans;
                  cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
                  cursor.fail = wrap(reject);
                  cursor.next = function() {
                    var _this = this;
                    var gotOne = 1;
                    return this.start(function() {
                      return gotOne-- ? _this.continue() : _this.stop();
                    }).then(function() {
                      return _this;
                    });
                  };
                  cursor.start = function(callback) {
                    var iterationPromise = new Promise(function(resolveIteration, rejectIteration) {
                      resolveIteration = wrap(resolveIteration);
                      req.onerror = eventRejectHandler(rejectIteration);
                      cursor.fail = rejectIteration;
                      cursor.stop = function(value) {
                        cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                        resolveIteration(value);
                      };
                    });
                    var guardedCallback = function() {
                      if (req.result) {
                        try {
                          callback();
                        } catch (err) {
                          cursor.fail(err);
                        }
                      } else {
                        cursor.done = true;
                        cursor.start = function() {
                          throw new Error("Cursor behind last entry");
                        };
                        cursor.stop();
                      }
                    };
                    req.onsuccess = wrap(function(ev2) {
                      req.onsuccess = guardedCallback;
                      guardedCallback();
                    });
                    cursor.continue = _cursorContinue;
                    cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
                    cursor.advance = _cursorAdvance;
                    guardedCallback();
                    return iterationPromise;
                  };
                  resolve(cursor);
                }, reject);
              });
            }
            function query(hasGetAll2, hasIdb3Features2) {
              return function(request) {
                return new Promise(function(resolve, reject) {
                  var _a3;
                  resolve = wrap(resolve);
                  var trans = request.trans, values = request.values, limit = request.limit, query2 = request.query;
                  var direction = (_a3 = request.direction) !== null && _a3 !== void 0 ? _a3 : "next";
                  var nonInfinitLimit = limit === Infinity ? void 0 : limit;
                  var index = query2.index, range = query2.range;
                  var store = trans.objectStore(tableName);
                  var source = index.isPrimaryKey ? store : store.index(index.name);
                  var idbKeyRange = makeIDBKeyRange(range);
                  if (limit === 0)
                    return resolve({ result: [] });
                  if (hasIdb3Features2) {
                    var options = {
                      query: idbKeyRange,
                      count: nonInfinitLimit,
                      direction
                    };
                    var req = values ? source.getAll(options) : source.getAllKeys(options);
                    req.onsuccess = function(event) {
                      return resolve({ result: event.target.result });
                    };
                    req.onerror = eventRejectHandler(reject);
                  } else if (hasGetAll2 && direction === "next") {
                    var req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
                    req.onsuccess = function(event) {
                      return resolve({ result: event.target.result });
                    };
                    req.onerror = eventRejectHandler(reject);
                  } else {
                    var count_1 = 0;
                    var req_1 = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange, direction) : source.openKeyCursor(idbKeyRange, direction);
                    var result_1 = [];
                    req_1.onsuccess = function() {
                      var cursor = req_1.result;
                      if (!cursor)
                        return resolve({ result: result_1 });
                      result_1.push(values ? cursor.value : cursor.primaryKey);
                      if (++count_1 === limit)
                        return resolve({ result: result_1 });
                      cursor.continue();
                    };
                    req_1.onerror = eventRejectHandler(reject);
                  }
                });
              };
            }
            return {
              name: tableName,
              schema: tableSchema,
              mutate,
              getMany: function(_a3) {
                var trans = _a3.trans, keys2 = _a3.keys;
                return new Promise(function(resolve, reject) {
                  resolve = wrap(resolve);
                  var store = trans.objectStore(tableName);
                  var length = keys2.length;
                  var result = new Array(length);
                  var keyCount = 0;
                  var callbackCount = 0;
                  var req;
                  var successHandler = function(event) {
                    var req2 = event.target;
                    if ((result[req2._pos] = req2.result) != null)
                      ;
                    if (++callbackCount === keyCount)
                      resolve(result);
                  };
                  var errorHandler = eventRejectHandler(reject);
                  for (var i = 0; i < length; ++i) {
                    var key = keys2[i];
                    if (key != null) {
                      req = store.get(keys2[i]);
                      req._pos = i;
                      req.onsuccess = successHandler;
                      req.onerror = errorHandler;
                      ++keyCount;
                    }
                  }
                  if (keyCount === 0)
                    resolve(result);
                });
              },
              get: function(_a3) {
                var trans = _a3.trans, key = _a3.key;
                return new Promise(function(resolve, reject) {
                  resolve = wrap(resolve);
                  var store = trans.objectStore(tableName);
                  var req = store.get(key);
                  req.onsuccess = function(event) {
                    return resolve(event.target.result);
                  };
                  req.onerror = eventRejectHandler(reject);
                });
              },
              query: query(hasGetAll, hasIdb3Features),
              openCursor: openCursor2,
              count: function(_a3) {
                var query2 = _a3.query, trans = _a3.trans;
                var index = query2.index, range = query2.range;
                return new Promise(function(resolve, reject) {
                  var store = trans.objectStore(tableName);
                  var source = index.isPrimaryKey ? store : store.index(index.name);
                  var idbKeyRange = makeIDBKeyRange(range);
                  var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
                  req.onsuccess = wrap(function(ev) {
                    return resolve(ev.target.result);
                  });
                  req.onerror = eventRejectHandler(reject);
                });
              }
            };
          }
          var _a2 = extractSchema(db2, tmpTrans), schema = _a2.schema, hasGetAll = _a2.hasGetAll, hasIdb3Features = _a2.hasIdb3Features;
          var tables = schema.tables.map(function(tableSchema) {
            return createDbCoreTable(tableSchema);
          });
          var tableMap = {};
          tables.forEach(function(table) {
            return tableMap[table.name] = table;
          });
          return {
            stack: "dbcore",
            transaction: db2.transaction.bind(db2),
            table: function(name) {
              var result = tableMap[name];
              if (!result)
                throw new Error("Table '".concat(name, "' not found"));
              return tableMap[name];
            },
            MIN_KEY: -Infinity,
            MAX_KEY: getMaxKey(IdbKeyRange),
            schema
          };
        }
        function createMiddlewareStack(stackImpl, middlewares) {
          return middlewares.reduce(function(down, _a2) {
            var create2 = _a2.create;
            return __assign(__assign({}, down), create2(down));
          }, stackImpl);
        }
        function createMiddlewareStacks(middlewares, idbdb, _a2, tmpTrans) {
          var IDBKeyRange = _a2.IDBKeyRange;
          _a2.indexedDB;
          var dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange, tmpTrans), middlewares.dbcore);
          return {
            dbcore
          };
        }
        function generateMiddlewareStacks(db2, tmpTrans) {
          var idbdb = tmpTrans.db;
          var stacks = createMiddlewareStacks(db2._middlewares, idbdb, db2._deps, tmpTrans);
          db2.core = stacks.dbcore;
          db2.tables.forEach(function(table) {
            var tableName = table.name;
            if (db2.core.schema.tables.some(function(tbl) {
              return tbl.name === tableName;
            })) {
              table.core = db2.core.table(tableName);
              if (db2[tableName] instanceof db2.Table) {
                db2[tableName].core = table.core;
              }
            }
          });
        }
        function setApiOnPlace(db2, objs, tableNames, dbschema) {
          tableNames.forEach(function(tableName) {
            var schema = dbschema[tableName];
            objs.forEach(function(obj) {
              var propDesc = getPropertyDescriptor(obj, tableName);
              if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
                if (obj === db2.Transaction.prototype || obj instanceof db2.Transaction) {
                  setProp(obj, tableName, {
                    get: function() {
                      return this.table(tableName);
                    },
                    set: function(value) {
                      defineProperty(this, tableName, {
                        value,
                        writable: true,
                        configurable: true,
                        enumerable: true
                      });
                    }
                  });
                } else {
                  obj[tableName] = new db2.Table(tableName, schema);
                }
              }
            });
          });
        }
        function removeTablesApi(db2, objs) {
          objs.forEach(function(obj) {
            for (var key in obj) {
              if (obj[key] instanceof db2.Table)
                delete obj[key];
            }
          });
        }
        function lowerVersionFirst(a, b) {
          return a._cfg.version - b._cfg.version;
        }
        function runUpgraders(db2, oldVersion, idbUpgradeTrans, reject) {
          var globalSchema = db2._dbSchema;
          if (idbUpgradeTrans.objectStoreNames.contains("$meta") && !globalSchema.$meta) {
            globalSchema.$meta = createTableSchema("$meta", parseIndexSyntax("")[0], []);
            db2._storeNames.push("$meta");
          }
          var trans = db2._createTransaction("readwrite", db2._storeNames, globalSchema);
          trans.create(idbUpgradeTrans);
          trans._completion.catch(reject);
          var rejectTransaction = trans._reject.bind(trans);
          var transless = PSD.transless || PSD;
          newScope(function() {
            PSD.trans = trans;
            PSD.transless = transless;
            if (oldVersion === 0) {
              keys(globalSchema).forEach(function(tableName) {
                createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
              });
              generateMiddlewareStacks(db2, idbUpgradeTrans);
              DexiePromise.follow(function() {
                return db2.on.populate.fire(trans);
              }).catch(rejectTransaction);
            } else {
              generateMiddlewareStacks(db2, idbUpgradeTrans);
              return getExistingVersion(db2, trans, oldVersion).then(function(oldVersion2) {
                return updateTablesAndIndexes(db2, oldVersion2, trans, idbUpgradeTrans);
              }).catch(rejectTransaction);
            }
          });
        }
        function patchCurrentVersion(db2, idbUpgradeTrans) {
          createMissingTables(db2._dbSchema, idbUpgradeTrans);
          if (idbUpgradeTrans.db.version % 10 === 0 && !idbUpgradeTrans.objectStoreNames.contains("$meta")) {
            idbUpgradeTrans.db.createObjectStore("$meta").add(Math.ceil(idbUpgradeTrans.db.version / 10 - 1), "version");
          }
          var globalSchema = buildGlobalSchema(db2, db2.idbdb, idbUpgradeTrans);
          adjustToExistingIndexNames(db2, db2._dbSchema, idbUpgradeTrans);
          var diff = getSchemaDiff(globalSchema, db2._dbSchema);
          var _loop_1 = function(tableChange2) {
            if (tableChange2.change.length || tableChange2.recreate) {
              console.warn("Unable to patch indexes of table ".concat(tableChange2.name, " because it has changes on the type of index or primary key."));
              return { value: void 0 };
            }
            var store = idbUpgradeTrans.objectStore(tableChange2.name);
            tableChange2.add.forEach(function(idx) {
              if (debug)
                console.debug("Dexie upgrade patch: Creating missing index ".concat(tableChange2.name, ".").concat(idx.src));
              addIndex(store, idx);
            });
          };
          for (var _i = 0, _a2 = diff.change; _i < _a2.length; _i++) {
            var tableChange = _a2[_i];
            var state_1 = _loop_1(tableChange);
            if (typeof state_1 === "object")
              return state_1.value;
          }
        }
        function getExistingVersion(db2, trans, oldVersion) {
          if (trans.storeNames.includes("$meta")) {
            return trans.table("$meta").get("version").then(function(metaVersion) {
              return metaVersion != null ? metaVersion : oldVersion;
            });
          } else {
            return DexiePromise.resolve(oldVersion);
          }
        }
        function updateTablesAndIndexes(db2, oldVersion, trans, idbUpgradeTrans) {
          var queue = [];
          var versions = db2._versions;
          var globalSchema = db2._dbSchema = buildGlobalSchema(db2, db2.idbdb, idbUpgradeTrans);
          var versToRun = versions.filter(function(v) {
            return v._cfg.version >= oldVersion;
          });
          if (versToRun.length === 0) {
            return DexiePromise.resolve();
          }
          versToRun.forEach(function(version) {
            queue.push(function() {
              var oldSchema = globalSchema;
              var newSchema = version._cfg.dbschema;
              adjustToExistingIndexNames(db2, oldSchema, idbUpgradeTrans);
              adjustToExistingIndexNames(db2, newSchema, idbUpgradeTrans);
              globalSchema = db2._dbSchema = newSchema;
              var diff = getSchemaDiff(oldSchema, newSchema);
              diff.add.forEach(function(tuple) {
                createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
              });
              diff.change.forEach(function(change) {
                if (change.recreate) {
                  throw new exceptions.Upgrade("Not yet support for changing primary key");
                } else {
                  var store_1 = idbUpgradeTrans.objectStore(change.name);
                  change.add.forEach(function(idx) {
                    return addIndex(store_1, idx);
                  });
                  change.change.forEach(function(idx) {
                    store_1.deleteIndex(idx.name);
                    addIndex(store_1, idx);
                  });
                  change.del.forEach(function(idxName) {
                    return store_1.deleteIndex(idxName);
                  });
                }
              });
              var contentUpgrade = version._cfg.contentUpgrade;
              if (contentUpgrade && version._cfg.version > oldVersion) {
                generateMiddlewareStacks(db2, idbUpgradeTrans);
                trans._memoizedTables = {};
                var upgradeSchema_1 = shallowClone(newSchema);
                diff.del.forEach(function(table) {
                  upgradeSchema_1[table] = oldSchema[table];
                });
                removeTablesApi(db2, [db2.Transaction.prototype]);
                setApiOnPlace(db2, [db2.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
                trans.schema = upgradeSchema_1;
                var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
                if (contentUpgradeIsAsync_1) {
                  incrementExpectedAwaits();
                }
                var returnValue_1;
                var promiseFollowed = DexiePromise.follow(function() {
                  returnValue_1 = contentUpgrade(trans);
                  if (returnValue_1) {
                    if (contentUpgradeIsAsync_1) {
                      var decrementor = decrementExpectedAwaits.bind(null, null);
                      returnValue_1.then(decrementor, decrementor);
                    }
                  }
                });
                return returnValue_1 && typeof returnValue_1.then === "function" ? DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function() {
                  return returnValue_1;
                });
              }
            });
            queue.push(function(idbtrans) {
              var newSchema = version._cfg.dbschema;
              deleteRemovedTables(newSchema, idbtrans);
              removeTablesApi(db2, [db2.Transaction.prototype]);
              setApiOnPlace(db2, [db2.Transaction.prototype], db2._storeNames, db2._dbSchema);
              trans.schema = db2._dbSchema;
            });
            queue.push(function(idbtrans) {
              if (db2.idbdb.objectStoreNames.contains("$meta")) {
                if (Math.ceil(db2.idbdb.version / 10) === version._cfg.version) {
                  db2.idbdb.deleteObjectStore("$meta");
                  delete db2._dbSchema.$meta;
                  db2._storeNames = db2._storeNames.filter(function(name) {
                    return name !== "$meta";
                  });
                } else {
                  idbtrans.objectStore("$meta").put(version._cfg.version, "version");
                }
              }
            });
          });
          function runQueue() {
            return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
          }
          return runQueue().then(function() {
            createMissingTables(globalSchema, idbUpgradeTrans);
          });
        }
        function getSchemaDiff(oldSchema, newSchema) {
          var diff = {
            del: [],
            add: [],
            change: []
          };
          var table;
          for (table in oldSchema) {
            if (!newSchema[table])
              diff.del.push(table);
          }
          for (table in newSchema) {
            var oldDef = oldSchema[table], newDef = newSchema[table];
            if (!oldDef) {
              diff.add.push([table, newDef]);
            } else {
              var change = {
                name: table,
                def: newDef,
                recreate: false,
                del: [],
                add: [],
                change: []
              };
              if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto) {
                change.recreate = true;
                diff.change.push(change);
              } else {
                var oldIndexes = oldDef.idxByName;
                var newIndexes = newDef.idxByName;
                var idxName = void 0;
                for (idxName in oldIndexes) {
                  if (!newIndexes[idxName])
                    change.del.push(idxName);
                }
                for (idxName in newIndexes) {
                  var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                  if (!oldIdx)
                    change.add.push(newIdx);
                  else if (oldIdx.src !== newIdx.src)
                    change.change.push(newIdx);
                }
                if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                  diff.change.push(change);
                }
              }
            }
          }
          return diff;
        }
        function createTable(idbtrans, tableName, primKey, indexes) {
          var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto } : { autoIncrement: primKey.auto });
          indexes.forEach(function(idx) {
            return addIndex(store, idx);
          });
          return store;
        }
        function createMissingTables(newSchema, idbtrans) {
          keys(newSchema).forEach(function(tableName) {
            if (!idbtrans.db.objectStoreNames.contains(tableName)) {
              if (debug)
                console.debug("Dexie: Creating missing table", tableName);
              createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
            }
          });
        }
        function deleteRemovedTables(newSchema, idbtrans) {
          [].slice.call(idbtrans.db.objectStoreNames).forEach(function(storeName) {
            return newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName);
          });
        }
        function addIndex(store, idx) {
          store.createIndex(idx.name, idx.keyPath, {
            unique: idx.unique,
            multiEntry: idx.multi
          });
        }
        function buildGlobalSchema(db2, idbdb, tmpTrans) {
          var globalSchema = {};
          var dbStoreNames = slice(idbdb.objectStoreNames, 0);
          dbStoreNames.forEach(function(storeName) {
            var store = tmpTrans.objectStore(storeName);
            var keyPath = store.keyPath;
            var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", true, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
            var indexes = [];
            for (var j = 0; j < store.indexNames.length; ++j) {
              var idbindex = store.index(store.indexNames[j]);
              keyPath = idbindex.keyPath;
              var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
              indexes.push(index);
            }
            globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
          });
          return globalSchema;
        }
        function readGlobalSchema(db2, idbdb, tmpTrans) {
          db2.verno = idbdb.version / 10;
          var globalSchema = db2._dbSchema = buildGlobalSchema(db2, idbdb, tmpTrans);
          db2._storeNames = slice(idbdb.objectStoreNames, 0);
          setApiOnPlace(db2, [db2._allTables], keys(globalSchema), globalSchema);
        }
        function verifyInstalledSchema(db2, tmpTrans) {
          var installedSchema = buildGlobalSchema(db2, db2.idbdb, tmpTrans);
          var diff = getSchemaDiff(installedSchema, db2._dbSchema);
          return !(diff.add.length || diff.change.some(function(ch) {
            return ch.add.length || ch.change.length;
          }));
        }
        function adjustToExistingIndexNames(db2, schema, idbtrans) {
          var storeNames = idbtrans.db.objectStoreNames;
          for (var i = 0; i < storeNames.length; ++i) {
            var storeName = storeNames[i];
            var store = idbtrans.objectStore(storeName);
            db2._hasGetAll = "getAll" in store;
            for (var j = 0; j < store.indexNames.length; ++j) {
              var indexName = store.indexNames[j];
              var keyPath = store.index(indexName).keyPath;
              var dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
              if (schema[storeName]) {
                var indexSpec = schema[storeName].idxByName[dexieName];
                if (indexSpec) {
                  indexSpec.name = indexName;
                  delete schema[storeName].idxByName[dexieName];
                  schema[storeName].idxByName[indexName] = indexSpec;
                }
              }
            }
          }
          if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
            db2._hasGetAll = false;
          }
        }
        function parseIndexSyntax(primKeyAndIndexes) {
          return primKeyAndIndexes.split(",").map(function(index, indexNum) {
            var _a2;
            var typeSplit = index.split(":");
            var type2 = (_a2 = typeSplit[1]) === null || _a2 === void 0 ? void 0 : _a2.trim();
            index = typeSplit[0].trim();
            var name = index.replace(/([&*]|\+\+)/g, "");
            var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
            return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0, type2);
          });
        }
        var Version = (function() {
          function Version2() {
          }
          Version2.prototype._createTableSchema = function(name, primKey, indexes) {
            return createTableSchema(name, primKey, indexes);
          };
          Version2.prototype._parseIndexSyntax = function(primKeyAndIndexes) {
            return parseIndexSyntax(primKeyAndIndexes);
          };
          Version2.prototype._parseStoresSpec = function(stores, outSchema) {
            var _this = this;
            keys(stores).forEach(function(tableName) {
              if (stores[tableName] !== null) {
                var indexes = _this._parseIndexSyntax(stores[tableName]);
                var primKey = indexes.shift();
                if (!primKey) {
                  throw new exceptions.Schema("Invalid schema for table " + tableName + ": " + stores[tableName]);
                }
                primKey.unique = true;
                if (primKey.multi)
                  throw new exceptions.Schema("Primary key cannot be multiEntry*");
                indexes.forEach(function(idx) {
                  if (idx.auto)
                    throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                  if (!idx.keyPath)
                    throw new exceptions.Schema("Index must have a name and cannot be an empty string");
                });
                var tblSchema = _this._createTableSchema(tableName, primKey, indexes);
                outSchema[tableName] = tblSchema;
              }
            });
          };
          Version2.prototype.stores = function(stores) {
            var db2 = this.db;
            this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
            var versions = db2._versions;
            var storesSpec = {};
            var dbschema = {};
            versions.forEach(function(version) {
              extend(storesSpec, version._cfg.storesSource);
              dbschema = version._cfg.dbschema = {};
              version._parseStoresSpec(storesSpec, dbschema);
            });
            db2._dbSchema = dbschema;
            removeTablesApi(db2, [db2._allTables, db2, db2.Transaction.prototype]);
            setApiOnPlace(db2, [db2._allTables, db2, db2.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
            db2._storeNames = keys(dbschema);
            return this;
          };
          Version2.prototype.upgrade = function(upgradeFunction) {
            this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
            return this;
          };
          return Version2;
        })();
        function createVersionConstructor(db2) {
          return makeClassConstructor(Version.prototype, function Version2(versionNumber) {
            this.db = db2;
            this._cfg = {
              version: versionNumber,
              storesSource: null,
              dbschema: {},
              tables: {},
              contentUpgrade: null
            };
          });
        }
        var connections = createConnectionsManager();
        function createConnectionsManager() {
          if (typeof FinalizationRegistry !== "undefined" && typeof WeakRef !== "undefined") {
            var _refs_1 = /* @__PURE__ */ new Set();
            var _registry_1 = new FinalizationRegistry(function(ref) {
              _refs_1.delete(ref);
            });
            var toArray = function() {
              return Array.from(_refs_1).map(function(ref) {
                return ref.deref();
              }).filter(function(db2) {
                return db2 !== void 0;
              });
            };
            var add3 = function(db2) {
              var ref = new WeakRef(db2._novip);
              _refs_1.add(ref);
              _registry_1.register(db2._novip, ref, ref);
              if (_refs_1.size > db2._options.maxConnections) {
                var oldestRef = _refs_1.values().next().value;
                _refs_1.delete(oldestRef);
                _registry_1.unregister(oldestRef);
              }
            };
            var remove3 = function(db2) {
              if (!db2)
                return;
              var iterator = _refs_1.values();
              var result = iterator.next();
              while (!result.done) {
                var ref = result.value;
                if (ref.deref() === db2._novip) {
                  _refs_1.delete(ref);
                  _registry_1.unregister(ref);
                  return;
                }
                result = iterator.next();
              }
            };
            return { toArray, add: add3, remove: remove3 };
          } else {
            var connections_1 = [];
            var toArray = function() {
              return connections_1;
            };
            var add3 = function(db2) {
              connections_1.push(db2._novip);
            };
            var remove3 = function(db2) {
              if (!db2)
                return;
              var index = connections_1.indexOf(db2._novip);
              if (index !== -1) {
                connections_1.splice(index, 1);
              }
            };
            return { toArray, add: add3, remove: remove3 };
          }
        }
        function getDbNamesTable(indexedDB2, IDBKeyRange) {
          var dbNamesDB = indexedDB2["_dbNamesDB"];
          if (!dbNamesDB) {
            dbNamesDB = indexedDB2["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
              addons: [],
              indexedDB: indexedDB2,
              IDBKeyRange
            });
            dbNamesDB.version(1).stores({ dbnames: "name" });
          }
          return dbNamesDB.table("dbnames");
        }
        function hasDatabasesNative(indexedDB2) {
          return indexedDB2 && typeof indexedDB2.databases === "function";
        }
        function getDatabaseNames(_a2) {
          var indexedDB2 = _a2.indexedDB, IDBKeyRange = _a2.IDBKeyRange;
          return hasDatabasesNative(indexedDB2) ? Promise.resolve(indexedDB2.databases()).then(function(infos) {
            return infos.map(function(info) {
              return info.name;
            }).filter(function(name) {
              return name !== DBNAMES_DB;
            });
          }) : getDbNamesTable(indexedDB2, IDBKeyRange).toCollection().primaryKeys();
        }
        function _onDatabaseCreated(_a2, name) {
          var indexedDB2 = _a2.indexedDB, IDBKeyRange = _a2.IDBKeyRange;
          !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).put({ name }).catch(nop);
        }
        function _onDatabaseDeleted(_a2, name) {
          var indexedDB2 = _a2.indexedDB, IDBKeyRange = _a2.IDBKeyRange;
          !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).delete(name).catch(nop);
        }
        function vip(fn) {
          return newScope(function() {
            PSD.letThrough = true;
            return fn();
          });
        }
        function idbReady() {
          var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
          if (!isSafari || !indexedDB.databases)
            return Promise.resolve();
          var intervalId;
          return new Promise(function(resolve) {
            var tryIdb = function() {
              return indexedDB.databases().finally(resolve);
            };
            intervalId = setInterval(tryIdb, 100);
            tryIdb();
          }).finally(function() {
            return clearInterval(intervalId);
          });
        }
        var _a;
        function isEmptyRange(node) {
          return !("from" in node);
        }
        var RangeSet2 = function(fromOrTree, to) {
          if (this) {
            extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
          } else {
            var rv = new RangeSet2();
            if (fromOrTree && "d" in fromOrTree) {
              extend(rv, fromOrTree);
            }
            return rv;
          }
        };
        props(RangeSet2.prototype, (_a = {
          add: function(rangeSet) {
            mergeRanges2(this, rangeSet);
            return this;
          },
          addKey: function(key) {
            addRange(this, key, key);
            return this;
          },
          addKeys: function(keys2) {
            var _this = this;
            keys2.forEach(function(key) {
              return addRange(_this, key, key);
            });
            return this;
          },
          hasKey: function(key) {
            var node = getRangeSetIterator(this).next(key).value;
            return node && cmp2(node.from, key) <= 0 && cmp2(node.to, key) >= 0;
          }
        }, _a[iteratorSymbol] = function() {
          return getRangeSetIterator(this);
        }, _a));
        function addRange(target, from, to) {
          var diff = cmp2(from, to);
          if (isNaN(diff))
            return;
          if (diff > 0)
            throw RangeError();
          if (isEmptyRange(target))
            return extend(target, { from, to, d: 1 });
          var left = target.l;
          var right = target.r;
          if (cmp2(to, target.from) < 0) {
            left ? addRange(left, from, to) : target.l = { from, to, d: 1, l: null, r: null };
            return rebalance(target);
          }
          if (cmp2(from, target.to) > 0) {
            right ? addRange(right, from, to) : target.r = { from, to, d: 1, l: null, r: null };
            return rebalance(target);
          }
          if (cmp2(from, target.from) < 0) {
            target.from = from;
            target.l = null;
            target.d = right ? right.d + 1 : 1;
          }
          if (cmp2(to, target.to) > 0) {
            target.to = to;
            target.r = null;
            target.d = target.l ? target.l.d + 1 : 1;
          }
          var rightWasCutOff = !target.r;
          if (left && !target.l) {
            mergeRanges2(target, left);
          }
          if (right && rightWasCutOff) {
            mergeRanges2(target, right);
          }
        }
        function mergeRanges2(target, newSet) {
          function _addRangeSet(target2, _a2) {
            var from = _a2.from, to = _a2.to, l = _a2.l, r2 = _a2.r;
            addRange(target2, from, to);
            if (l)
              _addRangeSet(target2, l);
            if (r2)
              _addRangeSet(target2, r2);
          }
          if (!isEmptyRange(newSet))
            _addRangeSet(target, newSet);
        }
        function rangesOverlap2(rangeSet1, rangeSet2) {
          var i1 = getRangeSetIterator(rangeSet2);
          var nextResult1 = i1.next();
          if (nextResult1.done)
            return false;
          var a = nextResult1.value;
          var i2 = getRangeSetIterator(rangeSet1);
          var nextResult2 = i2.next(a.from);
          var b = nextResult2.value;
          while (!nextResult1.done && !nextResult2.done) {
            if (cmp2(b.from, a.to) <= 0 && cmp2(b.to, a.from) >= 0)
              return true;
            cmp2(a.from, b.from) < 0 ? a = (nextResult1 = i1.next(b.from)).value : b = (nextResult2 = i2.next(a.from)).value;
          }
          return false;
        }
        function getRangeSetIterator(node) {
          var state = isEmptyRange(node) ? null : { s: 0, n: node };
          return {
            next: function(key) {
              var keyProvided = arguments.length > 0;
              while (state) {
                switch (state.s) {
                  case 0:
                    state.s = 1;
                    if (keyProvided) {
                      while (state.n.l && cmp2(key, state.n.from) < 0)
                        state = { up: state, n: state.n.l, s: 1 };
                    } else {
                      while (state.n.l)
                        state = { up: state, n: state.n.l, s: 1 };
                    }
                  case 1:
                    state.s = 2;
                    if (!keyProvided || cmp2(key, state.n.to) <= 0)
                      return { value: state.n, done: false };
                  case 2:
                    if (state.n.r) {
                      state.s = 3;
                      state = { up: state, n: state.n.r, s: 0 };
                      continue;
                    }
                  case 3:
                    state = state.up;
                }
              }
              return { done: true };
            }
          };
        }
        function rebalance(target) {
          var _a2, _b;
          var diff = (((_a2 = target.r) === null || _a2 === void 0 ? void 0 : _a2.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
          var r2 = diff > 1 ? "r" : diff < -1 ? "l" : "";
          if (r2) {
            var l = r2 === "r" ? "l" : "r";
            var rootClone = __assign({}, target);
            var oldRootRight = target[r2];
            target.from = oldRootRight.from;
            target.to = oldRootRight.to;
            target[r2] = oldRootRight[r2];
            rootClone[r2] = oldRootRight[l];
            target[l] = rootClone;
            rootClone.d = computeDepth(rootClone);
          }
          target.d = computeDepth(target);
        }
        function computeDepth(_a2) {
          var r2 = _a2.r, l = _a2.l;
          return (r2 ? l ? Math.max(r2.d, l.d) : r2.d : l ? l.d : 0) + 1;
        }
        function extendObservabilitySet(target, newSet) {
          keys(newSet).forEach(function(part) {
            if (target[part])
              mergeRanges2(target[part], newSet[part]);
            else
              target[part] = cloneSimpleObjectTree(newSet[part]);
          });
          return target;
        }
        function obsSetsOverlap(os1, os2) {
          return os1.all || os2.all || Object.keys(os1).some(function(key) {
            return os2[key] && rangesOverlap2(os2[key], os1[key]);
          });
        }
        var cache = {};
        var unsignaledParts = {};
        var isTaskEnqueued = false;
        function signalSubscribersLazily(part, optimistic) {
          extendObservabilitySet(unsignaledParts, part);
          if (!isTaskEnqueued) {
            isTaskEnqueued = true;
            setTimeout(function() {
              isTaskEnqueued = false;
              var parts = unsignaledParts;
              unsignaledParts = {};
              signalSubscribersNow(parts, false);
            }, 0);
          }
        }
        function signalSubscribersNow(updatedParts, deleteAffectedCacheEntries) {
          if (deleteAffectedCacheEntries === void 0) {
            deleteAffectedCacheEntries = false;
          }
          var queriesToSignal = /* @__PURE__ */ new Set();
          if (updatedParts.all) {
            for (var _i = 0, _a2 = Object.values(cache); _i < _a2.length; _i++) {
              var tblCache = _a2[_i];
              collectTableSubscribers(tblCache, updatedParts, queriesToSignal, deleteAffectedCacheEntries);
            }
          } else {
            for (var key in updatedParts) {
              var parts = /^idb\:\/\/(.*)\/(.*)\//.exec(key);
              if (parts) {
                var dbName = parts[1], tableName = parts[2];
                var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
                if (tblCache)
                  collectTableSubscribers(tblCache, updatedParts, queriesToSignal, deleteAffectedCacheEntries);
              }
            }
          }
          queriesToSignal.forEach(function(requery) {
            return requery();
          });
        }
        function collectTableSubscribers(tblCache, updatedParts, outQueriesToSignal, deleteAffectedCacheEntries) {
          var updatedEntryLists = [];
          for (var _i = 0, _a2 = Object.entries(tblCache.queries.query); _i < _a2.length; _i++) {
            var _b = _a2[_i], indexName = _b[0], entries = _b[1];
            var filteredEntries = [];
            for (var _c = 0, entries_1 = entries; _c < entries_1.length; _c++) {
              var entry = entries_1[_c];
              if (obsSetsOverlap(updatedParts, entry.obsSet)) {
                entry.subscribers.forEach(function(requery) {
                  return outQueriesToSignal.add(requery);
                });
              } else if (deleteAffectedCacheEntries) {
                filteredEntries.push(entry);
              }
            }
            if (deleteAffectedCacheEntries)
              updatedEntryLists.push([indexName, filteredEntries]);
          }
          if (deleteAffectedCacheEntries) {
            for (var _d = 0, updatedEntryLists_1 = updatedEntryLists; _d < updatedEntryLists_1.length; _d++) {
              var _e = updatedEntryLists_1[_d], indexName = _e[0], filteredEntries = _e[1];
              tblCache.queries.query[indexName] = filteredEntries;
            }
          }
        }
        function dexieOpen(db2) {
          var state = db2._state;
          var indexedDB2 = db2._deps.indexedDB;
          if (state.isBeingOpened || db2.idbdb)
            return state.dbReadyPromise.then(function() {
              return state.dbOpenError ? rejection(state.dbOpenError) : db2;
            });
          state.isBeingOpened = true;
          state.dbOpenError = null;
          state.openComplete = false;
          var openCanceller = state.openCanceller;
          var nativeVerToOpen = Math.round(db2.verno * 10);
          var schemaPatchMode = false;
          function throwIfCancelled() {
            if (state.openCanceller !== openCanceller)
              throw new exceptions.DatabaseClosed("db.open() was cancelled");
          }
          var resolveDbReady = state.dbReadyResolve, upgradeTransaction = null, wasCreated = false;
          var tryOpenDB = function() {
            return new DexiePromise(function(resolve, reject) {
              throwIfCancelled();
              if (!indexedDB2)
                throw new exceptions.MissingAPI();
              var dbName = db2.name;
              var req = state.autoSchema || !nativeVerToOpen ? indexedDB2.open(dbName) : indexedDB2.open(dbName, nativeVerToOpen);
              if (!req)
                throw new exceptions.MissingAPI();
              req.onerror = eventRejectHandler(reject);
              req.onblocked = wrap(db2._fireOnBlocked);
              req.onupgradeneeded = wrap(function(e) {
                upgradeTransaction = req.transaction;
                if (state.autoSchema && !db2._options.allowEmptyDB) {
                  req.onerror = preventDefault;
                  upgradeTransaction.abort();
                  req.result.close();
                  var delreq = indexedDB2.deleteDatabase(dbName);
                  delreq.onsuccess = delreq.onerror = wrap(function() {
                    reject(new exceptions.NoSuchDatabase("Database ".concat(dbName, " doesnt exist")));
                  });
                } else {
                  upgradeTransaction.onerror = eventRejectHandler(reject);
                  var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
                  wasCreated = oldVer < 1;
                  db2.idbdb = req.result;
                  if (schemaPatchMode) {
                    patchCurrentVersion(db2, upgradeTransaction);
                  }
                  runUpgraders(db2, oldVer / 10, upgradeTransaction, reject);
                }
              }, reject);
              req.onsuccess = wrap(function() {
                upgradeTransaction = null;
                var idbdb = db2.idbdb = req.result;
                var objectStoreNames = slice(idbdb.objectStoreNames);
                if (objectStoreNames.length > 0)
                  try {
                    var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
                    if (state.autoSchema)
                      readGlobalSchema(db2, idbdb, tmpTrans);
                    else {
                      adjustToExistingIndexNames(db2, db2._dbSchema, tmpTrans);
                      if (!verifyInstalledSchema(db2, tmpTrans) && !schemaPatchMode) {
                        console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this.");
                        idbdb.close();
                        nativeVerToOpen = idbdb.version + 1;
                        schemaPatchMode = true;
                        return resolve(tryOpenDB());
                      }
                    }
                    generateMiddlewareStacks(db2, tmpTrans);
                  } catch (e) {
                  }
                connections.add(db2);
                idbdb.onversionchange = wrap(function(ev) {
                  state.vcFired = true;
                  db2.on("versionchange").fire(ev);
                });
                idbdb.onclose = wrap(function() {
                  db2.close({ disableAutoOpen: false });
                });
                if (wasCreated)
                  _onDatabaseCreated(db2._deps, dbName);
                resolve();
              }, reject);
            }).catch(function(err) {
              switch (err === null || err === void 0 ? void 0 : err.name) {
                case "UnknownError":
                  if (state.PR1398_maxLoop > 0) {
                    state.PR1398_maxLoop--;
                    console.warn("Dexie: Workaround for Chrome UnknownError on open()");
                    return tryOpenDB();
                  }
                  break;
                case "VersionError":
                  if (nativeVerToOpen > 0) {
                    nativeVerToOpen = 0;
                    return tryOpenDB();
                  }
                  break;
              }
              return DexiePromise.reject(err);
            });
          };
          return DexiePromise.race([
            openCanceller,
            (typeof navigator === "undefined" ? DexiePromise.resolve() : idbReady()).then(tryOpenDB)
          ]).then(function() {
            throwIfCancelled();
            state.onReadyBeingFired = [];
            return DexiePromise.resolve(vip(function() {
              return db2.on.ready.fire(db2.vip);
            })).then(function fireRemainders() {
              if (state.onReadyBeingFired.length > 0) {
                var remainders_1 = state.onReadyBeingFired.reduce(promisableChain, nop);
                state.onReadyBeingFired = [];
                return DexiePromise.resolve(vip(function() {
                  return remainders_1(db2.vip);
                })).then(fireRemainders);
              }
            });
          }).finally(function() {
            if (state.openCanceller === openCanceller) {
              state.onReadyBeingFired = null;
              state.isBeingOpened = false;
            }
          }).catch(function(err) {
            state.dbOpenError = err;
            try {
              upgradeTransaction && upgradeTransaction.abort();
            } catch (_a2) {
            }
            if (openCanceller === state.openCanceller) {
              db2._close();
            }
            return rejection(err);
          }).finally(function() {
            state.openComplete = true;
            resolveDbReady();
          }).then(function() {
            if (wasCreated) {
              var everything_1 = {};
              db2.tables.forEach(function(table) {
                table.schema.indexes.forEach(function(idx) {
                  if (idx.name)
                    everything_1["idb://".concat(db2.name, "/").concat(table.name, "/").concat(idx.name)] = new RangeSet2(-Infinity, [[[]]]);
                });
                everything_1["idb://".concat(db2.name, "/").concat(table.name, "/")] = everything_1["idb://".concat(db2.name, "/").concat(table.name, "/:dels")] = new RangeSet2(-Infinity, [[[]]]);
              });
              globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME).fire(everything_1);
              signalSubscribersNow(everything_1, true);
            }
            return db2;
          });
        }
        function awaitIterator(iterator) {
          var callNext = function(result) {
            return iterator.next(result);
          }, doThrow = function(error) {
            return iterator.throw(error);
          }, onSuccess = step(callNext), onError = step(doThrow);
          function step(getNext) {
            return function(val) {
              var next = getNext(val), value = next.value;
              return next.done ? value : !value || typeof value.then !== "function" ? isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
            };
          }
          return step(callNext)();
        }
        function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
          var i = arguments.length;
          if (i < 2)
            throw new exceptions.InvalidArgument("Too few arguments");
          var args = new Array(i - 1);
          while (--i)
            args[i - 1] = arguments[i];
          scopeFunc = args.pop();
          var tables = flatten(args);
          return [mode, tables, scopeFunc];
        }
        function enterTransactionScope(db2, mode, storeNames, parentTransaction, scopeFunc) {
          return DexiePromise.resolve().then(function() {
            var transless = PSD.transless || PSD;
            var trans = db2._createTransaction(mode, storeNames, db2._dbSchema, parentTransaction);
            trans.explicit = true;
            var zoneProps = {
              trans,
              transless
            };
            if (parentTransaction) {
              trans.idbtrans = parentTransaction.idbtrans;
            } else {
              try {
                trans.create();
                trans.idbtrans._explicit = true;
                db2._state.PR1398_maxLoop = 3;
              } catch (ex) {
                if (ex.name === errnames.InvalidState && db2.isOpen() && --db2._state.PR1398_maxLoop > 0) {
                  console.warn("Dexie: Need to reopen db");
                  db2.close({ disableAutoOpen: false });
                  return db2.open().then(function() {
                    return enterTransactionScope(db2, mode, storeNames, null, scopeFunc);
                  });
                }
                return rejection(ex);
              }
            }
            var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
            if (scopeFuncIsAsync) {
              incrementExpectedAwaits();
            }
            var returnValue;
            var promiseFollowed = DexiePromise.follow(function() {
              returnValue = scopeFunc.call(trans, trans);
              if (returnValue) {
                if (scopeFuncIsAsync) {
                  var decrementor = decrementExpectedAwaits.bind(null, null);
                  returnValue.then(decrementor, decrementor);
                } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
                  returnValue = awaitIterator(returnValue);
                }
              }
            }, zoneProps);
            return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then(function(x) {
              return trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
            }) : promiseFollowed.then(function() {
              return returnValue;
            })).then(function(x) {
              if (parentTransaction)
                trans._resolve();
              return trans._completion.then(function() {
                return x;
              });
            }).catch(function(e) {
              trans._reject(e);
              return rejection(e);
            });
          });
        }
        function pad2(a, value, count) {
          var result = isArray(a) ? a.slice() : [a];
          for (var i = 0; i < count; ++i)
            result.push(value);
          return result;
        }
        function createVirtualIndexMiddleware(down) {
          return __assign(__assign({}, down), { table: function(tableName) {
            var table = down.table(tableName);
            var schema = table.schema;
            var indexLookup = /* @__PURE__ */ Object.create(null);
            var allVirtualIndexes = [];
            function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
              var keyPathAlias = getKeyPathAlias(keyPath);
              var indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
              var keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
              var isVirtual = keyTail > 0;
              var virtualIndex = __assign(__assign({}, lowLevelIndex), { name: isVirtual ? "".concat(keyPathAlias, "(virtual-from:").concat(lowLevelIndex.name, ")") : lowLevelIndex.name, lowLevelIndex, isVirtual, keyTail, keyLength, extractKey: getKeyExtractor(keyPath), unique: !isVirtual && lowLevelIndex.unique });
              indexList.push(virtualIndex);
              if (!virtualIndex.isPrimaryKey) {
                allVirtualIndexes.push(virtualIndex);
              }
              if (keyLength > 1) {
                var virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
                addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
              }
              indexList.sort(function(a, b) {
                return a.keyTail - b.keyTail;
              });
              return virtualIndex;
            }
            var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
            indexLookup[":id"] = [primaryKey];
            for (var _i = 0, _a2 = schema.indexes; _i < _a2.length; _i++) {
              var index = _a2[_i];
              addVirtualIndexes(index.keyPath, 0, index);
            }
            function findBestIndex(keyPath) {
              var result2 = indexLookup[getKeyPathAlias(keyPath)];
              return result2 && result2[0];
            }
            function translateRange(range, keyTail) {
              return {
                type: range.type === 1 ? 2 : range.type,
                lower: pad2(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
                lowerOpen: true,
                upper: pad2(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
                upperOpen: true
              };
            }
            function translateRequest(req) {
              var index2 = req.query.index;
              return index2.isVirtual ? __assign(__assign({}, req), { query: {
                index: index2.lowLevelIndex,
                range: translateRange(req.query.range, index2.keyTail)
              } }) : req;
            }
            var result = __assign(__assign({}, table), { schema: __assign(__assign({}, schema), { primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex }), count: function(req) {
              return table.count(translateRequest(req));
            }, query: function(req) {
              return table.query(translateRequest(req));
            }, openCursor: function(req) {
              var _a3 = req.query.index, keyTail = _a3.keyTail, isVirtual = _a3.isVirtual, keyLength = _a3.keyLength;
              if (!isVirtual)
                return table.openCursor(req);
              function createVirtualCursor(cursor) {
                function _continue(key) {
                  key != null ? cursor.continue(pad2(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(cursor.key.slice(0, keyLength).concat(req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
                }
                var virtualCursor = Object.create(cursor, {
                  continue: { value: _continue },
                  continuePrimaryKey: {
                    value: function(key, primaryKey2) {
                      cursor.continuePrimaryKey(pad2(key, down.MAX_KEY, keyTail), primaryKey2);
                    }
                  },
                  primaryKey: {
                    get: function() {
                      return cursor.primaryKey;
                    }
                  },
                  key: {
                    get: function() {
                      var key = cursor.key;
                      return keyLength === 1 ? key[0] : key.slice(0, keyLength);
                    }
                  },
                  value: {
                    get: function() {
                      return cursor.value;
                    }
                  }
                });
                return virtualCursor;
              }
              return table.openCursor(translateRequest(req)).then(function(cursor) {
                return cursor && createVirtualCursor(cursor);
              });
            } });
            return result;
          } });
        }
        var virtualIndexMiddleware = {
          stack: "dbcore",
          name: "VirtualIndexMiddleware",
          level: 1,
          create: createVirtualIndexMiddleware
        };
        function getObjectDiff(a, b, rv, prfx) {
          rv = rv || {};
          prfx = prfx || "";
          keys(a).forEach(function(prop) {
            if (!hasOwn(b, prop)) {
              rv[prfx + prop] = void 0;
            } else {
              var ap = a[prop], bp = b[prop];
              if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
                var apTypeName = toStringTag(ap);
                var bpTypeName = toStringTag(bp);
                if (apTypeName !== bpTypeName) {
                  rv[prfx + prop] = b[prop];
                } else if (apTypeName === "Object") {
                  getObjectDiff(ap, bp, rv, prfx + prop + ".");
                } else if (ap !== bp) {
                  rv[prfx + prop] = b[prop];
                }
              } else if (ap !== bp)
                rv[prfx + prop] = b[prop];
            }
          });
          keys(b).forEach(function(prop) {
            if (!hasOwn(a, prop)) {
              rv[prfx + prop] = b[prop];
            }
          });
          return rv;
        }
        function getEffectiveKeys(primaryKey, req) {
          if (req.type === "delete")
            return req.keys;
          return req.keys || req.values.map(primaryKey.extractKey);
        }
        var hooksMiddleware = {
          stack: "dbcore",
          name: "HooksMiddleware",
          level: 2,
          create: function(downCore) {
            return __assign(__assign({}, downCore), { table: function(tableName) {
              var downTable = downCore.table(tableName);
              var primaryKey = downTable.schema.primaryKey;
              var tableMiddleware = __assign(__assign({}, downTable), { mutate: function(req) {
                var dxTrans = PSD.trans;
                var _a2 = dxTrans.table(tableName).hook, deleting = _a2.deleting, creating = _a2.creating, updating = _a2.updating;
                switch (req.type) {
                  case "add":
                    if (creating.fire === nop)
                      break;
                    return dxTrans._promise("readwrite", function() {
                      return addPutOrDelete(req);
                    }, true);
                  case "put":
                    if (creating.fire === nop && updating.fire === nop)
                      break;
                    return dxTrans._promise("readwrite", function() {
                      return addPutOrDelete(req);
                    }, true);
                  case "delete":
                    if (deleting.fire === nop)
                      break;
                    return dxTrans._promise("readwrite", function() {
                      return addPutOrDelete(req);
                    }, true);
                  case "deleteRange":
                    if (deleting.fire === nop)
                      break;
                    return dxTrans._promise("readwrite", function() {
                      return deleteRange(req);
                    }, true);
                }
                return downTable.mutate(req);
                function addPutOrDelete(req2) {
                  var dxTrans2 = PSD.trans;
                  var keys2 = req2.keys || getEffectiveKeys(primaryKey, req2);
                  if (!keys2)
                    throw new Error("Keys missing");
                  req2 = req2.type === "add" || req2.type === "put" ? __assign(__assign({}, req2), { keys: keys2 }) : __assign({}, req2);
                  if (req2.type !== "delete")
                    req2.values = __spreadArray([], req2.values, true);
                  if (req2.keys)
                    req2.keys = __spreadArray([], req2.keys, true);
                  return getExistingValues(downTable, req2, keys2).then(function(existingValues) {
                    var contexts = keys2.map(function(key, i) {
                      var existingValue = existingValues[i];
                      var ctx = { onerror: null, onsuccess: null };
                      if (req2.type === "delete") {
                        deleting.fire.call(ctx, key, existingValue, dxTrans2);
                      } else if (req2.type === "add" || existingValue === void 0) {
                        var generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i], dxTrans2);
                        if (key == null && generatedPrimaryKey != null) {
                          key = generatedPrimaryKey;
                          req2.keys[i] = key;
                          if (!primaryKey.outbound) {
                            setByKeyPath(req2.values[i], primaryKey.keyPath, key);
                          }
                        }
                      } else {
                        var objectDiff = getObjectDiff(existingValue, req2.values[i]);
                        var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                        if (additionalChanges_1) {
                          var requestedValue_1 = req2.values[i];
                          Object.keys(additionalChanges_1).forEach(function(keyPath) {
                            if (hasOwn(requestedValue_1, keyPath)) {
                              requestedValue_1[keyPath] = additionalChanges_1[keyPath];
                            } else {
                              setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                            }
                          });
                        }
                      }
                      return ctx;
                    });
                    return downTable.mutate(req2).then(function(_a3) {
                      var failures = _a3.failures, results = _a3.results, numFailures = _a3.numFailures, lastResult = _a3.lastResult;
                      for (var i = 0; i < keys2.length; ++i) {
                        var primKey = results ? results[i] : keys2[i];
                        var ctx = contexts[i];
                        if (primKey == null) {
                          ctx.onerror && ctx.onerror(failures[i]);
                        } else {
                          ctx.onsuccess && ctx.onsuccess(
                            req2.type === "put" && existingValues[i] ? req2.values[i] : primKey
                          );
                        }
                      }
                      return { failures, results, numFailures, lastResult };
                    }).catch(function(error) {
                      contexts.forEach(function(ctx) {
                        return ctx.onerror && ctx.onerror(error);
                      });
                      return Promise.reject(error);
                    });
                  });
                }
                function deleteRange(req2) {
                  return deleteNextChunk(req2.trans, req2.range, 1e4);
                }
                function deleteNextChunk(trans, range, limit) {
                  return downTable.query({
                    trans,
                    values: false,
                    query: { index: primaryKey, range },
                    limit
                  }).then(function(_a3) {
                    var result = _a3.result;
                    return addPutOrDelete({
                      type: "delete",
                      keys: result,
                      trans
                    }).then(function(res) {
                      if (res.numFailures > 0)
                        return Promise.reject(res.failures[0]);
                      if (result.length < limit) {
                        return {
                          failures: [],
                          numFailures: 0,
                          lastResult: void 0
                        };
                      } else {
                        return deleteNextChunk(trans, __assign(__assign({}, range), { lower: result[result.length - 1], lowerOpen: true }), limit);
                      }
                    });
                  });
                }
              } });
              return tableMiddleware;
            } });
          }
        };
        function getExistingValues(table, req, effectiveKeys) {
          return req.type === "add" ? Promise.resolve([]) : table.getMany({
            trans: req.trans,
            keys: effectiveKeys,
            cache: "immutable"
          });
        }
        function getFromTransactionCache(keys2, cache2, clone) {
          try {
            if (!cache2)
              return null;
            if (cache2.keys.length < keys2.length)
              return null;
            var result = [];
            for (var i = 0, j = 0; i < cache2.keys.length && j < keys2.length; ++i) {
              if (cmp2(cache2.keys[i], keys2[j]) !== 0)
                continue;
              result.push(clone ? deepClone(cache2.values[i]) : cache2.values[i]);
              ++j;
            }
            return result.length === keys2.length ? result : null;
          } catch (_a2) {
            return null;
          }
        }
        var cacheExistingValuesMiddleware = {
          stack: "dbcore",
          level: -1,
          create: function(core) {
            return {
              table: function(tableName) {
                var table = core.table(tableName);
                return __assign(__assign({}, table), { getMany: function(req) {
                  if (!req.cache) {
                    return table.getMany(req);
                  }
                  var cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
                  if (cachedResult) {
                    return DexiePromise.resolve(cachedResult);
                  }
                  return table.getMany(req).then(function(res) {
                    req.trans["_cache"] = {
                      keys: req.keys,
                      values: req.cache === "clone" ? deepClone(res) : res
                    };
                    return res;
                  });
                }, mutate: function(req) {
                  if (req.type !== "add")
                    req.trans["_cache"] = null;
                  return table.mutate(req);
                } });
              }
            };
          }
        };
        function isCachableContext(ctx, table) {
          return ctx.trans.mode === "readonly" && !!ctx.subscr && !ctx.trans.explicit && ctx.trans.db._options.cache !== "disabled" && !table.schema.primaryKey.outbound;
        }
        function isCachableRequest(type2, req) {
          switch (type2) {
            case "query":
              return req.values && !req.unique;
            case "get":
              return false;
            case "getMany":
              return false;
            case "count":
              return false;
            case "openCursor":
              return false;
          }
        }
        var observabilityMiddleware = {
          stack: "dbcore",
          level: 0,
          name: "Observability",
          create: function(core) {
            var dbName = core.schema.name;
            var FULL_RANGE = new RangeSet2(core.MIN_KEY, core.MAX_KEY);
            return __assign(__assign({}, core), { transaction: function(stores, mode, options) {
              if (PSD.subscr && mode !== "readonly") {
                throw new exceptions.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(PSD.querier));
              }
              return core.transaction(stores, mode, options);
            }, table: function(tableName) {
              var table = core.table(tableName);
              var schema = table.schema;
              var primaryKey = schema.primaryKey, indexes = schema.indexes;
              var extractKey = primaryKey.extractKey, outbound = primaryKey.outbound;
              var indexesWithAutoIncPK = primaryKey.autoIncrement && indexes.filter(function(index) {
                return index.compound && index.keyPath.includes(primaryKey.keyPath);
              });
              var tableClone = __assign(__assign({}, table), { mutate: function(req) {
                var _a2, _b;
                var trans = req.trans;
                var mutatedParts = req.mutatedParts || (req.mutatedParts = {});
                var getRangeSet = function(indexName) {
                  var part = "idb://".concat(dbName, "/").concat(tableName, "/").concat(indexName);
                  return mutatedParts[part] || (mutatedParts[part] = new RangeSet2());
                };
                var pkRangeSet = getRangeSet("");
                var delsRangeSet = getRangeSet(":dels");
                var type2 = req.type;
                var _c = req.type === "deleteRange" ? [req.range] : req.type === "delete" ? [req.keys] : req.values.length < 50 ? [
                  getEffectiveKeys(primaryKey, req).filter(function(id) {
                    return id;
                  }),
                  req.values
                ] : [], keys2 = _c[0], newObjs = _c[1];
                var oldCache = req.trans["_cache"];
                if (isArray(keys2)) {
                  pkRangeSet.addKeys(keys2);
                  var oldObjs = type2 === "delete" || keys2.length === newObjs.length ? getFromTransactionCache(keys2, oldCache) : null;
                  if (!oldObjs) {
                    delsRangeSet.addKeys(keys2);
                  }
                  if (oldObjs || newObjs) {
                    trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                  }
                } else if (keys2) {
                  var range = {
                    from: (_a2 = keys2.lower) !== null && _a2 !== void 0 ? _a2 : core.MIN_KEY,
                    to: (_b = keys2.upper) !== null && _b !== void 0 ? _b : core.MAX_KEY
                  };
                  delsRangeSet.add(range);
                  pkRangeSet.add(range);
                } else {
                  pkRangeSet.add(FULL_RANGE);
                  delsRangeSet.add(FULL_RANGE);
                  schema.indexes.forEach(function(idx) {
                    return getRangeSet(idx.name).add(FULL_RANGE);
                  });
                }
                return table.mutate(req).then(function(res) {
                  if (keys2 && (req.type === "add" || req.type === "put")) {
                    pkRangeSet.addKeys(res.results);
                    if (indexesWithAutoIncPK) {
                      indexesWithAutoIncPK.forEach(function(idx) {
                        var idxVals = req.values.map(function(v) {
                          return idx.extractKey(v);
                        });
                        var pkPos = idx.keyPath.findIndex(function(prop) {
                          return prop === primaryKey.keyPath;
                        });
                        for (var i = 0, len = res.results.length; i < len; ++i) {
                          idxVals[i][pkPos] = res.results[i];
                        }
                        getRangeSet(idx.name).addKeys(idxVals);
                      });
                    }
                  }
                  trans.mutatedParts = extendObservabilitySet(trans.mutatedParts || {}, mutatedParts);
                  return res;
                });
              } });
              var getRange = function(_a2) {
                var _b, _c;
                var _d = _a2.query, index = _d.index, range = _d.range;
                return [
                  index,
                  new RangeSet2((_b = range.lower) !== null && _b !== void 0 ? _b : core.MIN_KEY, (_c = range.upper) !== null && _c !== void 0 ? _c : core.MAX_KEY)
                ];
              };
              var readSubscribers = {
                get: function(req) {
                  return [primaryKey, new RangeSet2(req.key)];
                },
                getMany: function(req) {
                  return [primaryKey, new RangeSet2().addKeys(req.keys)];
                },
                count: getRange,
                query: getRange,
                openCursor: getRange
              };
              keys(readSubscribers).forEach(function(method) {
                tableClone[method] = function(req) {
                  var subscr = PSD.subscr;
                  var isLiveQuery = !!subscr;
                  var cachable = isCachableContext(PSD, table) && isCachableRequest(method, req);
                  var obsSet = cachable ? req.obsSet = {} : subscr;
                  if (isLiveQuery) {
                    var getRangeSet = function(indexName) {
                      var part = "idb://".concat(dbName, "/").concat(tableName, "/").concat(indexName);
                      return obsSet[part] || (obsSet[part] = new RangeSet2());
                    };
                    var pkRangeSet_1 = getRangeSet("");
                    var delsRangeSet_1 = getRangeSet(":dels");
                    var _a2 = readSubscribers[method](req), queriedIndex = _a2[0], queriedRanges = _a2[1];
                    if (method === "query" && queriedIndex.isPrimaryKey && !req.values) {
                      delsRangeSet_1.add(queriedRanges);
                    } else {
                      getRangeSet(queriedIndex.name || "").add(queriedRanges);
                    }
                    if (!queriedIndex.isPrimaryKey) {
                      if (method === "count") {
                        delsRangeSet_1.add(FULL_RANGE);
                      } else {
                        var keysPromise_1 = method === "query" && outbound && req.values && table.query(__assign(__assign({}, req), { values: false }));
                        return table[method].apply(this, arguments).then(function(res) {
                          if (method === "query") {
                            if (outbound && req.values) {
                              return keysPromise_1.then(function(_a3) {
                                var resultingKeys = _a3.result;
                                pkRangeSet_1.addKeys(resultingKeys);
                                return res;
                              });
                            }
                            var pKeys = req.values ? res.result.map(extractKey) : res.result;
                            if (req.values) {
                              pkRangeSet_1.addKeys(pKeys);
                            } else {
                              delsRangeSet_1.addKeys(pKeys);
                            }
                          } else if (method === "openCursor") {
                            var cursor_1 = res;
                            var wantValues_1 = req.values;
                            return cursor_1 && Object.create(cursor_1, {
                              key: {
                                get: function() {
                                  delsRangeSet_1.addKey(cursor_1.primaryKey);
                                  return cursor_1.key;
                                }
                              },
                              primaryKey: {
                                get: function() {
                                  var pkey = cursor_1.primaryKey;
                                  delsRangeSet_1.addKey(pkey);
                                  return pkey;
                                }
                              },
                              value: {
                                get: function() {
                                  wantValues_1 && pkRangeSet_1.addKey(cursor_1.primaryKey);
                                  return cursor_1.value;
                                }
                              }
                            });
                          }
                          return res;
                        });
                      }
                    }
                  }
                  return table[method].apply(this, arguments);
                };
              });
              return tableClone;
            } });
          }
        };
        function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
          function addAffectedIndex(ix) {
            var rangeSet = getRangeSet(ix.name || "");
            function extractKey(obj) {
              return obj != null ? ix.extractKey(obj) : null;
            }
            var addKeyOrKeys = function(key) {
              return ix.multiEntry && isArray(key) ? key.forEach(function(key2) {
                return rangeSet.addKey(key2);
              }) : rangeSet.addKey(key);
            };
            (oldObjs || newObjs).forEach(function(_, i) {
              var oldKey = oldObjs && extractKey(oldObjs[i]);
              var newKey = newObjs && extractKey(newObjs[i]);
              if (cmp2(oldKey, newKey) !== 0) {
                if (oldKey != null)
                  addKeyOrKeys(oldKey);
                if (newKey != null)
                  addKeyOrKeys(newKey);
              }
            });
          }
          schema.indexes.forEach(addAffectedIndex);
        }
        function adjustOptimisticFromFailures(tblCache, req, res) {
          if (res.numFailures === 0)
            return req;
          if (req.type === "deleteRange") {
            return null;
          }
          var numBulkOps = req.keys ? req.keys.length : "values" in req && req.values ? req.values.length : 1;
          if (res.numFailures === numBulkOps) {
            return null;
          }
          var clone = __assign({}, req);
          if (isArray(clone.keys)) {
            clone.keys = clone.keys.filter(function(_, i) {
              return !(i in res.failures);
            });
          }
          if ("values" in clone && isArray(clone.values)) {
            clone.values = clone.values.filter(function(_, i) {
              return !(i in res.failures);
            });
          }
          return clone;
        }
        function isAboveLower(key, range) {
          return range.lower === void 0 ? true : range.lowerOpen ? cmp2(key, range.lower) > 0 : cmp2(key, range.lower) >= 0;
        }
        function isBelowUpper(key, range) {
          return range.upper === void 0 ? true : range.upperOpen ? cmp2(key, range.upper) < 0 : cmp2(key, range.upper) <= 0;
        }
        function isWithinRange(key, range) {
          return isAboveLower(key, range) && isBelowUpper(key, range);
        }
        function applyOptimisticOps(result, req, ops, table, cacheEntry, immutable) {
          if (!ops || ops.length === 0)
            return result;
          var index = req.query.index;
          var multiEntry = index.multiEntry;
          var queryRange = req.query.range;
          var primaryKey = table.schema.primaryKey;
          var extractPrimKey = primaryKey.extractKey;
          var extractIndex = index.extractKey;
          var extractLowLevelIndex = (index.lowLevelIndex || index).extractKey;
          var finalResult = ops.reduce(function(result2, op) {
            var modifedResult = result2;
            var includedValues = [];
            if (op.type === "add" || op.type === "put") {
              var includedPKs = new RangeSet2();
              for (var i = op.values.length - 1; i >= 0; --i) {
                var value = op.values[i];
                var pk = extractPrimKey(value);
                if (includedPKs.hasKey(pk))
                  continue;
                var key = extractIndex(value);
                if (multiEntry && isArray(key) ? key.some(function(k) {
                  return isWithinRange(k, queryRange);
                }) : isWithinRange(key, queryRange)) {
                  includedPKs.addKey(pk);
                  includedValues.push(value);
                }
              }
            }
            switch (op.type) {
              case "add": {
                var existingKeys_1 = new RangeSet2().addKeys(req.values ? result2.map(function(v) {
                  return extractPrimKey(v);
                }) : result2);
                modifedResult = result2.concat(req.values ? includedValues.filter(function(v) {
                  var key2 = extractPrimKey(v);
                  if (existingKeys_1.hasKey(key2))
                    return false;
                  existingKeys_1.addKey(key2);
                  return true;
                }) : includedValues.map(function(v) {
                  return extractPrimKey(v);
                }).filter(function(k) {
                  if (existingKeys_1.hasKey(k))
                    return false;
                  existingKeys_1.addKey(k);
                  return true;
                }));
                break;
              }
              case "put": {
                var keySet_1 = new RangeSet2().addKeys(op.values.map(function(v) {
                  return extractPrimKey(v);
                }));
                modifedResult = result2.filter(
                  function(item) {
                    return !keySet_1.hasKey(req.values ? extractPrimKey(item) : item);
                  }
                ).concat(
                  req.values ? includedValues : includedValues.map(function(v) {
                    return extractPrimKey(v);
                  })
                );
                break;
              }
              case "delete":
                var keysToDelete_1 = new RangeSet2().addKeys(op.keys);
                modifedResult = result2.filter(function(item) {
                  return !keysToDelete_1.hasKey(req.values ? extractPrimKey(item) : item);
                });
                break;
              case "deleteRange":
                var range_1 = op.range;
                modifedResult = result2.filter(function(item) {
                  return !isWithinRange(extractPrimKey(item), range_1);
                });
                break;
            }
            return modifedResult;
          }, result);
          if (finalResult === result)
            return result;
          var sorter = function(a, b) {
            return cmp2(extractLowLevelIndex(a), extractLowLevelIndex(b)) || cmp2(extractPrimKey(a), extractPrimKey(b));
          };
          finalResult.sort(req.direction === "prev" || req.direction === "prevunique" ? function(a, b) {
            return sorter(b, a);
          } : sorter);
          if (req.limit && req.limit < Infinity) {
            if (finalResult.length > req.limit) {
              finalResult.length = req.limit;
            } else if (result.length === req.limit && finalResult.length < req.limit) {
              cacheEntry.dirty = true;
            }
          }
          return immutable ? Object.freeze(finalResult) : finalResult;
        }
        function areRangesEqual(r1, r2) {
          return cmp2(r1.lower, r2.lower) === 0 && cmp2(r1.upper, r2.upper) === 0 && !!r1.lowerOpen === !!r2.lowerOpen && !!r1.upperOpen === !!r2.upperOpen;
        }
        function compareLowers(lower1, lower2, lowerOpen1, lowerOpen2) {
          if (lower1 === void 0)
            return lower2 !== void 0 ? -1 : 0;
          if (lower2 === void 0)
            return 1;
          var c = cmp2(lower1, lower2);
          if (c === 0) {
            if (lowerOpen1 && lowerOpen2)
              return 0;
            if (lowerOpen1)
              return 1;
            if (lowerOpen2)
              return -1;
          }
          return c;
        }
        function compareUppers(upper1, upper2, upperOpen1, upperOpen2) {
          if (upper1 === void 0)
            return upper2 !== void 0 ? 1 : 0;
          if (upper2 === void 0)
            return -1;
          var c = cmp2(upper1, upper2);
          if (c === 0) {
            if (upperOpen1 && upperOpen2)
              return 0;
            if (upperOpen1)
              return -1;
            if (upperOpen2)
              return 1;
          }
          return c;
        }
        function isSuperRange(r1, r2) {
          return compareLowers(r1.lower, r2.lower, r1.lowerOpen, r2.lowerOpen) <= 0 && compareUppers(r1.upper, r2.upper, r1.upperOpen, r2.upperOpen) >= 0;
        }
        function findCompatibleQuery(dbName, tableName, type2, req) {
          var _a2;
          var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
          if (!tblCache)
            return [];
          var queries = tblCache.queries[type2];
          if (!queries)
            return [null, false, tblCache, null];
          var indexName = req.query ? req.query.index.name : null;
          var entries = queries[indexName || ""];
          if (!entries)
            return [null, false, tblCache, null];
          switch (type2) {
            case "query":
              var reqDirection_1 = (_a2 = req.direction) !== null && _a2 !== void 0 ? _a2 : "next";
              var equalEntry = entries.find(function(entry) {
                var _a3;
                return entry.req.limit === req.limit && entry.req.values === req.values && ((_a3 = entry.req.direction) !== null && _a3 !== void 0 ? _a3 : "next") === reqDirection_1 && areRangesEqual(entry.req.query.range, req.query.range);
              });
              if (equalEntry)
                return [
                  equalEntry,
                  true,
                  tblCache,
                  entries
                ];
              var superEntry = entries.find(function(entry) {
                var _a3;
                var limit = "limit" in entry.req ? entry.req.limit : Infinity;
                return limit >= req.limit && ((_a3 = entry.req.direction) !== null && _a3 !== void 0 ? _a3 : "next") === reqDirection_1 && (req.values ? entry.req.values : true) && isSuperRange(entry.req.query.range, req.query.range);
              });
              return [superEntry, false, tblCache, entries];
            case "count":
              var countQuery = entries.find(function(entry) {
                return areRangesEqual(entry.req.query.range, req.query.range);
              });
              return [countQuery, !!countQuery, tblCache, entries];
          }
        }
        function subscribeToCacheEntry(cacheEntry, container, requery, signal) {
          cacheEntry.subscribers.add(requery);
          signal.addEventListener("abort", function() {
            cacheEntry.subscribers.delete(requery);
            if (cacheEntry.subscribers.size === 0) {
              enqueForDeletion(cacheEntry, container);
            }
          });
        }
        function enqueForDeletion(cacheEntry, container) {
          setTimeout(function() {
            if (cacheEntry.subscribers.size === 0) {
              delArrayItem(container, cacheEntry);
            }
          }, 3e3);
        }
        var cacheMiddleware = {
          stack: "dbcore",
          level: 0,
          name: "Cache",
          create: function(core) {
            var dbName = core.schema.name;
            var coreMW = __assign(__assign({}, core), { transaction: function(stores, mode, options) {
              var idbtrans = core.transaction(stores, mode, options);
              if (mode === "readwrite") {
                var ac_1 = new AbortController();
                var signal = ac_1.signal;
                var endTransaction = function(wasCommitted) {
                  return function() {
                    ac_1.abort();
                    if (mode === "readwrite") {
                      var affectedSubscribers_1 = /* @__PURE__ */ new Set();
                      for (var _i = 0, stores_1 = stores; _i < stores_1.length; _i++) {
                        var storeName = stores_1[_i];
                        var tblCache = cache["idb://".concat(dbName, "/").concat(storeName)];
                        if (tblCache) {
                          var table = core.table(storeName);
                          var ops = tblCache.optimisticOps.filter(function(op) {
                            return op.trans === idbtrans;
                          });
                          if (idbtrans._explicit && wasCommitted && idbtrans.mutatedParts) {
                            for (var _a2 = 0, _b = Object.values(tblCache.queries.query); _a2 < _b.length; _a2++) {
                              var entries = _b[_a2];
                              for (var _c = 0, _d = entries.slice(); _c < _d.length; _c++) {
                                var entry = _d[_c];
                                if (obsSetsOverlap(entry.obsSet, idbtrans.mutatedParts)) {
                                  delArrayItem(entries, entry);
                                  entry.subscribers.forEach(function(requery) {
                                    return affectedSubscribers_1.add(requery);
                                  });
                                }
                              }
                            }
                          } else if (ops.length > 0) {
                            tblCache.optimisticOps = tblCache.optimisticOps.filter(function(op) {
                              return op.trans !== idbtrans;
                            });
                            for (var _e = 0, _f = Object.values(tblCache.queries.query); _e < _f.length; _e++) {
                              var entries = _f[_e];
                              for (var _g = 0, _h = entries.slice(); _g < _h.length; _g++) {
                                var entry = _h[_g];
                                if (entry.res != null && idbtrans.mutatedParts) {
                                  if (wasCommitted && !entry.dirty) {
                                    var freezeResults = Object.isFrozen(entry.res);
                                    var modRes = applyOptimisticOps(entry.res, entry.req, ops, table, entry, freezeResults);
                                    if (entry.dirty) {
                                      delArrayItem(entries, entry);
                                      entry.subscribers.forEach(function(requery) {
                                        return affectedSubscribers_1.add(requery);
                                      });
                                    } else if (modRes !== entry.res) {
                                      entry.res = modRes;
                                      entry.promise = DexiePromise.resolve({
                                        result: modRes
                                      });
                                    }
                                  } else {
                                    if (entry.dirty) {
                                      delArrayItem(entries, entry);
                                    }
                                    entry.subscribers.forEach(function(requery) {
                                      return affectedSubscribers_1.add(requery);
                                    });
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                      affectedSubscribers_1.forEach(function(requery) {
                        return requery();
                      });
                    }
                  };
                };
                idbtrans.addEventListener("abort", endTransaction(false), {
                  signal
                });
                idbtrans.addEventListener("error", endTransaction(false), {
                  signal
                });
                idbtrans.addEventListener("complete", endTransaction(true), {
                  signal
                });
              }
              return idbtrans;
            }, table: function(tableName) {
              var downTable = core.table(tableName);
              var primKey = downTable.schema.primaryKey;
              var tableMW = __assign(__assign({}, downTable), { mutate: function(req) {
                var trans = PSD.trans;
                if (primKey.outbound || trans.db._options.cache === "disabled" || trans.explicit || trans.idbtrans.mode !== "readwrite") {
                  return downTable.mutate(req);
                }
                var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
                if (!tblCache)
                  return downTable.mutate(req);
                var promise = downTable.mutate(req);
                if ((req.type === "add" || req.type === "put") && (req.values.length >= 50 || getEffectiveKeys(primKey, req).some(function(key) {
                  return key == null;
                }))) {
                  promise.then(function(res) {
                    var reqWithResolvedKeys = __assign(__assign({}, req), { values: req.values.map(function(value, i) {
                      var _a2;
                      if (res.failures[i])
                        return value;
                      var valueWithKey = ((_a2 = primKey.keyPath) === null || _a2 === void 0 ? void 0 : _a2.includes(".")) ? deepClone(value) : __assign({}, value);
                      setByKeyPath(valueWithKey, primKey.keyPath, res.results[i]);
                      return valueWithKey;
                    }) });
                    var adjustedReq = adjustOptimisticFromFailures(tblCache, reqWithResolvedKeys, res);
                    tblCache.optimisticOps.push(adjustedReq);
                    queueMicrotask(function() {
                      return req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                    });
                  });
                } else {
                  tblCache.optimisticOps.push(req);
                  req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                  promise.then(function(res) {
                    if (res.numFailures > 0) {
                      delArrayItem(tblCache.optimisticOps, req);
                      var adjustedReq = adjustOptimisticFromFailures(tblCache, req, res);
                      if (adjustedReq) {
                        tblCache.optimisticOps.push(adjustedReq);
                      }
                      req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                    }
                  });
                  promise.catch(function() {
                    delArrayItem(tblCache.optimisticOps, req);
                    req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                  });
                }
                return promise;
              }, query: function(req) {
                var _a2;
                if (!isCachableContext(PSD, downTable) || !isCachableRequest("query", req))
                  return downTable.query(req);
                var freezeResults = ((_a2 = PSD.trans) === null || _a2 === void 0 ? void 0 : _a2.db._options.cache) === "immutable";
                var _b = PSD, requery = _b.requery, signal = _b.signal;
                var _c = findCompatibleQuery(dbName, tableName, "query", req), cacheEntry = _c[0], exactMatch = _c[1], tblCache = _c[2], container = _c[3];
                if (cacheEntry && exactMatch) {
                  cacheEntry.obsSet = req.obsSet;
                } else {
                  var promise = downTable.query(req).then(function(res) {
                    var result = res.result;
                    if (cacheEntry)
                      cacheEntry.res = result;
                    if (freezeResults) {
                      for (var i = 0, l = result.length; i < l; ++i) {
                        Object.freeze(result[i]);
                      }
                      Object.freeze(result);
                    }
                    return res;
                  }).catch(function(error) {
                    if (container && cacheEntry)
                      delArrayItem(container, cacheEntry);
                    return Promise.reject(error);
                  });
                  cacheEntry = {
                    obsSet: req.obsSet,
                    promise,
                    subscribers: /* @__PURE__ */ new Set(),
                    type: "query",
                    req,
                    dirty: false
                  };
                  if (container) {
                    container.push(cacheEntry);
                  } else {
                    container = [cacheEntry];
                    if (!tblCache) {
                      tblCache = cache["idb://".concat(dbName, "/").concat(tableName)] = {
                        queries: {
                          query: {},
                          count: {}
                        },
                        objs: /* @__PURE__ */ new Map(),
                        optimisticOps: [],
                        unsignaledParts: {}
                      };
                    }
                    tblCache.queries.query[req.query.index.name || ""] = container;
                  }
                }
                subscribeToCacheEntry(cacheEntry, container, requery, signal);
                return cacheEntry.promise.then(function(res) {
                  var result = applyOptimisticOps(res.result, req, tblCache === null || tblCache === void 0 ? void 0 : tblCache.optimisticOps, downTable, cacheEntry, freezeResults);
                  return {
                    result: freezeResults ? result : deepClone(result)
                  };
                });
              } });
              return tableMW;
            } });
            return coreMW;
          }
        };
        function vipify(target, vipDb) {
          return new Proxy(target, {
            get: function(target2, prop, receiver) {
              if (prop === "db")
                return vipDb;
              return Reflect.get(target2, prop, receiver);
            }
          });
        }
        var Dexie$1 = (function() {
          function Dexie3(name, options) {
            var _this = this;
            this._middlewares = {};
            this.verno = 0;
            var deps = Dexie3.dependencies;
            this._options = options = __assign({
              addons: Dexie3.addons,
              autoOpen: true,
              indexedDB: deps.indexedDB,
              IDBKeyRange: deps.IDBKeyRange,
              cache: "cloned",
              maxConnections: DEFAULT_MAX_CONNECTIONS
            }, options);
            this._deps = {
              indexedDB: options.indexedDB,
              IDBKeyRange: options.IDBKeyRange
            };
            var addons = options.addons;
            this._dbSchema = {};
            this._versions = [];
            this._storeNames = [];
            this._allTables = {};
            this.idbdb = null;
            this._novip = this;
            var state = {
              dbOpenError: null,
              isBeingOpened: false,
              onReadyBeingFired: null,
              openComplete: false,
              dbReadyResolve: nop,
              dbReadyPromise: null,
              cancelOpen: nop,
              openCanceller: null,
              autoSchema: true,
              PR1398_maxLoop: 3,
              autoOpen: options.autoOpen
            };
            state.dbReadyPromise = new DexiePromise(function(resolve) {
              state.dbReadyResolve = resolve;
            });
            state.openCanceller = new DexiePromise(function(_, reject) {
              state.cancelOpen = reject;
            });
            this._state = state;
            this.name = name;
            this.on = Events(this, "populate", "blocked", "versionchange", "close", {
              ready: [promisableChain, nop]
            });
            this.once = function(event, callback) {
              var fn = function() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
                }
                _this.on(event).unsubscribe(fn);
                callback.apply(_this, args);
              };
              return _this.on(event, fn);
            };
            this.on.ready.subscribe = override(this.on.ready.subscribe, function(subscribe) {
              return function(subscriber, bSticky) {
                Dexie3.vip(function() {
                  var state2 = _this._state;
                  if (state2.openComplete) {
                    if (!state2.dbOpenError)
                      DexiePromise.resolve().then(subscriber);
                    if (bSticky)
                      subscribe(subscriber);
                  } else if (state2.onReadyBeingFired) {
                    state2.onReadyBeingFired.push(subscriber);
                    if (bSticky)
                      subscribe(subscriber);
                  } else {
                    subscribe(subscriber);
                    var db_1 = _this;
                    if (!bSticky)
                      subscribe(function unsubscribe() {
                        db_1.on.ready.unsubscribe(subscriber);
                        db_1.on.ready.unsubscribe(unsubscribe);
                      });
                  }
                });
              };
            });
            this.Collection = createCollectionConstructor(this);
            this.Table = createTableConstructor(this);
            this.Transaction = createTransactionConstructor(this);
            this.Version = createVersionConstructor(this);
            this.WhereClause = createWhereClauseConstructor(this);
            this.on("versionchange", function(ev) {
              if (ev.newVersion > 0)
                console.warn("Another connection wants to upgrade database '".concat(_this.name, "'. Closing db now to resume the upgrade."));
              else
                console.warn("Another connection wants to delete database '".concat(_this.name, "'. Closing db now to resume the delete request."));
              _this.close({ disableAutoOpen: false });
            });
            this.on("blocked", function(ev) {
              if (!ev.newVersion || ev.newVersion < ev.oldVersion)
                console.warn("Dexie.delete('".concat(_this.name, "') was blocked"));
              else
                console.warn("Upgrade '".concat(_this.name, "' blocked by other connection holding version ").concat(ev.oldVersion / 10));
            });
            this._maxKey = getMaxKey(options.IDBKeyRange);
            this._createTransaction = function(mode, storeNames, dbschema, parentTransaction) {
              return new _this.Transaction(mode, storeNames, dbschema, _this._options.chromeTransactionDurability, parentTransaction);
            };
            this._fireOnBlocked = function(ev) {
              _this.on("blocked").fire(ev);
              connections.toArray().filter(function(c) {
                return c.name === _this.name && c !== _this && !c._state.vcFired;
              }).map(function(c) {
                return c.on("versionchange").fire(ev);
              });
            };
            this.use(cacheExistingValuesMiddleware);
            this.use(cacheMiddleware);
            this.use(observabilityMiddleware);
            this.use(virtualIndexMiddleware);
            this.use(hooksMiddleware);
            var vipDB = new Proxy(this, {
              get: function(_, prop, receiver) {
                if (prop === "_vip")
                  return true;
                if (prop === "table")
                  return function(tableName) {
                    return vipify(_this.table(tableName), vipDB);
                  };
                var rv = Reflect.get(_, prop, receiver);
                if (rv instanceof Table)
                  return vipify(rv, vipDB);
                if (prop === "tables")
                  return rv.map(function(t2) {
                    return vipify(t2, vipDB);
                  });
                if (prop === "_createTransaction")
                  return function() {
                    var tx = rv.apply(this, arguments);
                    return vipify(tx, vipDB);
                  };
                return rv;
              }
            });
            this.vip = vipDB;
            addons.forEach(function(addon) {
              return addon(_this);
            });
          }
          Dexie3.prototype.version = function(versionNumber) {
            if (isNaN(versionNumber) || versionNumber < 0.1)
              throw new exceptions.Type("Given version is not a positive number");
            versionNumber = Math.round(versionNumber * 10) / 10;
            if (this.idbdb || this._state.isBeingOpened)
              throw new exceptions.Schema("Cannot add version when database is open");
            this.verno = Math.max(this.verno, versionNumber);
            var versions = this._versions;
            var versionInstance = versions.filter(function(v) {
              return v._cfg.version === versionNumber;
            })[0];
            if (versionInstance)
              return versionInstance;
            versionInstance = new this.Version(versionNumber);
            versions.push(versionInstance);
            versions.sort(lowerVersionFirst);
            versionInstance.stores({});
            this._state.autoSchema = false;
            return versionInstance;
          };
          Dexie3.prototype._whenReady = function(fn) {
            var _this = this;
            return this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip) ? fn() : new DexiePromise(function(resolve, reject) {
              if (_this._state.openComplete) {
                return reject(new exceptions.DatabaseClosed(_this._state.dbOpenError));
              }
              if (!_this._state.isBeingOpened) {
                if (!_this._state.autoOpen) {
                  reject(new exceptions.DatabaseClosed());
                  return;
                }
                _this.open().catch(nop);
              }
              _this._state.dbReadyPromise.then(resolve, reject);
            }).then(fn);
          };
          Dexie3.prototype.use = function(_a2) {
            var stack = _a2.stack, create2 = _a2.create, level = _a2.level, name = _a2.name;
            if (name)
              this.unuse({ stack, name });
            var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
            middlewares.push({
              stack,
              create: create2,
              level: level == null ? 10 : level,
              name
            });
            middlewares.sort(function(a, b) {
              return a.level - b.level;
            });
            return this;
          };
          Dexie3.prototype.unuse = function(_a2) {
            var stack = _a2.stack, name = _a2.name, create2 = _a2.create;
            if (stack && this._middlewares[stack]) {
              this._middlewares[stack] = this._middlewares[stack].filter(function(mw) {
                return create2 ? mw.create !== create2 : name ? mw.name !== name : false;
              });
            }
            return this;
          };
          Dexie3.prototype.open = function() {
            var _this = this;
            return usePSD(
              globalPSD,
              function() {
                return dexieOpen(_this);
              }
            );
          };
          Dexie3.prototype._close = function() {
            this.on.close.fire(new CustomEvent("close"));
            var state = this._state;
            connections.remove(this);
            if (this.idbdb) {
              try {
                this.idbdb.close();
              } catch (e) {
              }
              this.idbdb = null;
            }
            if (!state.isBeingOpened) {
              state.dbReadyPromise = new DexiePromise(function(resolve) {
                state.dbReadyResolve = resolve;
              });
              state.openCanceller = new DexiePromise(function(_, reject) {
                state.cancelOpen = reject;
              });
            }
          };
          Dexie3.prototype.close = function(_a2) {
            var _b = _a2 === void 0 ? { disableAutoOpen: true } : _a2, disableAutoOpen = _b.disableAutoOpen;
            var state = this._state;
            if (disableAutoOpen) {
              if (state.isBeingOpened) {
                state.cancelOpen(new exceptions.DatabaseClosed());
              }
              this._close();
              state.autoOpen = false;
              state.dbOpenError = new exceptions.DatabaseClosed();
            } else {
              this._close();
              state.autoOpen = this._options.autoOpen || state.isBeingOpened;
              state.openComplete = false;
              state.dbOpenError = null;
            }
          };
          Dexie3.prototype.delete = function(closeOptions) {
            var _this = this;
            if (closeOptions === void 0) {
              closeOptions = { disableAutoOpen: true };
            }
            var hasInvalidArguments = arguments.length > 0 && typeof arguments[0] !== "object";
            var state = this._state;
            return new DexiePromise(function(resolve, reject) {
              var doDelete = function() {
                _this.close(closeOptions);
                var req = _this._deps.indexedDB.deleteDatabase(_this.name);
                req.onsuccess = wrap(function() {
                  _onDatabaseDeleted(_this._deps, _this.name);
                  resolve();
                });
                req.onerror = eventRejectHandler(reject);
                req.onblocked = _this._fireOnBlocked;
              };
              if (hasInvalidArguments)
                throw new exceptions.InvalidArgument("Invalid closeOptions argument to db.delete()");
              if (state.isBeingOpened) {
                state.dbReadyPromise.then(doDelete);
              } else {
                doDelete();
              }
            });
          };
          Dexie3.prototype.backendDB = function() {
            return this.idbdb;
          };
          Dexie3.prototype.isOpen = function() {
            return this.idbdb !== null;
          };
          Dexie3.prototype.hasBeenClosed = function() {
            var dbOpenError = this._state.dbOpenError;
            return dbOpenError && dbOpenError.name === "DatabaseClosed";
          };
          Dexie3.prototype.hasFailed = function() {
            return this._state.dbOpenError !== null;
          };
          Dexie3.prototype.dynamicallyOpened = function() {
            return this._state.autoSchema;
          };
          Object.defineProperty(Dexie3.prototype, "tables", {
            get: function() {
              var _this = this;
              return keys(this._allTables).map(function(name) {
                return _this._allTables[name];
              });
            },
            enumerable: false,
            configurable: true
          });
          Dexie3.prototype.transaction = function() {
            var args = extractTransactionArgs.apply(this, arguments);
            return this._transaction.apply(this, args);
          };
          Dexie3.prototype._transaction = function(mode, tables, scopeFunc) {
            var _this = this;
            var parentTransaction = PSD.trans;
            if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
              parentTransaction = null;
            var onlyIfCompatible = mode.indexOf("?") !== -1;
            mode = mode.replace("!", "").replace("?", "");
            var idbMode, storeNames;
            try {
              storeNames = tables.map(function(table) {
                var storeName = table instanceof _this.Table ? table.name : table;
                if (typeof storeName !== "string")
                  throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
                return storeName;
              });
              if (mode == "r" || mode === READONLY)
                idbMode = READONLY;
              else if (mode == "rw" || mode == READWRITE)
                idbMode = READWRITE;
              else
                throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
              if (parentTransaction) {
                if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
                  if (onlyIfCompatible) {
                    parentTransaction = null;
                  } else
                    throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                }
                if (parentTransaction) {
                  storeNames.forEach(function(storeName) {
                    if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                      if (onlyIfCompatible) {
                        parentTransaction = null;
                      } else
                        throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
                    }
                  });
                }
                if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                  parentTransaction = null;
                }
              }
            } catch (e) {
              return parentTransaction ? parentTransaction._promise(null, function(_, reject) {
                reject(e);
              }) : rejection(e);
            }
            var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
            return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, function() {
              return _this._whenReady(enterTransaction);
            }) : this._whenReady(enterTransaction);
          };
          Dexie3.prototype.table = function(tableName) {
            if (!hasOwn(this._allTables, tableName)) {
              throw new exceptions.InvalidTable("Table ".concat(tableName, " does not exist"));
            }
            return this._allTables[tableName];
          };
          return Dexie3;
        })();
        var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol ? Symbol.observable : "@@observable";
        var Observable = (function() {
          function Observable2(subscribe) {
            this._subscribe = subscribe;
          }
          Observable2.prototype.subscribe = function(x, error, complete) {
            return this._subscribe(!x || typeof x === "function" ? { next: x, error, complete } : x);
          };
          Observable2.prototype[symbolObservable] = function() {
            return this;
          };
          return Observable2;
        })();
        var domDeps;
        try {
          domDeps = {
            indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
            IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
          };
        } catch (e) {
          domDeps = { indexedDB: null, IDBKeyRange: null };
        }
        function liveQuery2(querier) {
          var hasValue = false;
          var currentValue;
          var observable = new Observable(function(observer) {
            var scopeFuncIsAsync = isAsyncFunction(querier);
            function execute(ctx) {
              var wasRootExec = beginMicroTickScope();
              try {
                if (scopeFuncIsAsync) {
                  incrementExpectedAwaits();
                }
                var rv = newScope(querier, ctx);
                if (scopeFuncIsAsync) {
                  rv = rv.finally(decrementExpectedAwaits);
                }
                return rv;
              } finally {
                wasRootExec && endMicroTickScope();
              }
            }
            var closed = false;
            var abortController;
            var accumMuts = {};
            var currentObs = {};
            var subscription = {
              get closed() {
                return closed;
              },
              unsubscribe: function() {
                if (closed)
                  return;
                closed = true;
                if (abortController)
                  abortController.abort();
                if (startedListening)
                  globalEvents.storagemutated.unsubscribe(mutationListener);
              }
            };
            observer.start && observer.start(subscription);
            var startedListening = false;
            var doQuery = function() {
              return execInGlobalContext(_doQuery);
            };
            function shouldNotify() {
              return obsSetsOverlap(currentObs, accumMuts);
            }
            var mutationListener = function(parts) {
              extendObservabilitySet(accumMuts, parts);
              if (shouldNotify()) {
                doQuery();
              }
            };
            var _doQuery = function() {
              if (closed || !domDeps.indexedDB) {
                return;
              }
              accumMuts = {};
              var subscr = {};
              if (abortController)
                abortController.abort();
              abortController = new AbortController();
              var ctx = {
                subscr,
                signal: abortController.signal,
                requery: doQuery,
                querier,
                trans: null
              };
              var ret = execute(ctx);
              if (!startedListening) {
                globalEvents.storagemutated.subscribe(mutationListener);
                startedListening = true;
              }
              Promise.resolve(ret).then(function(result) {
                hasValue = true;
                currentValue = result;
                if (closed || ctx.signal.aborted) {
                  return;
                }
                if (shouldNotify()) {
                  doQuery();
                } else {
                  currentObs = subscr;
                  if (shouldNotify()) {
                    doQuery();
                  } else {
                    accumMuts = {};
                    execInGlobalContext(function() {
                      return !closed && observer.next && observer.next(result);
                    });
                  }
                }
              }, function(err) {
                hasValue = false;
                if (!["DatabaseClosedError", "AbortError"].includes(err === null || err === void 0 ? void 0 : err.name)) {
                  if (!closed)
                    execInGlobalContext(function() {
                      if (closed)
                        return;
                      observer.error && observer.error(err);
                    });
                }
              });
            };
            setTimeout(doQuery, 0);
            return subscription;
          });
          observable.hasValue = function() {
            return hasValue;
          };
          observable.getValue = function() {
            return currentValue;
          };
          return observable;
        }
        var Dexie2 = Dexie$1;
        props(Dexie2, __assign(__assign({}, fullNameExceptions), {
          delete: function(databaseName) {
            var db2 = new Dexie2(databaseName, { addons: [] });
            return db2.delete();
          },
          exists: function(name) {
            return new Dexie2(name, { addons: [] }).open().then(function(db2) {
              db2.close();
              return true;
            }).catch("NoSuchDatabaseError", function() {
              return false;
            });
          },
          getDatabaseNames: function(cb) {
            try {
              return getDatabaseNames(Dexie2.dependencies).then(cb);
            } catch (_a2) {
              return rejection(new exceptions.MissingAPI());
            }
          },
          defineClass: function() {
            function Class(content) {
              extend(this, content);
            }
            return Class;
          },
          ignoreTransaction: function(scopeFunc) {
            return PSD.trans ? usePSD(PSD.transless || globalPSD, scopeFunc) : scopeFunc();
          },
          vip,
          async: function(generatorFn) {
            return function() {
              try {
                var rv = awaitIterator(generatorFn.apply(this, arguments));
                if (!rv || typeof rv.then !== "function")
                  return DexiePromise.resolve(rv);
                return rv;
              } catch (e) {
                return rejection(e);
              }
            };
          },
          spawn: function(generatorFn, args, thiz) {
            try {
              var rv = awaitIterator(generatorFn.apply(thiz, args || []));
              if (!rv || typeof rv.then !== "function")
                return DexiePromise.resolve(rv);
              return rv;
            } catch (e) {
              return rejection(e);
            }
          },
          currentTransaction: {
            get: function() {
              return PSD.trans || null;
            }
          },
          waitFor: function(promiseOrFunction, optionalTimeout) {
            var promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie2.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
            return PSD.trans ? PSD.trans.waitFor(promise) : promise;
          },
          Promise: DexiePromise,
          debug: {
            get: function() {
              return debug;
            },
            set: function(value) {
              setDebug(value);
            }
          },
          derive,
          extend,
          props,
          override,
          Events,
          on: globalEvents,
          liveQuery: liveQuery2,
          extendObservabilitySet,
          getByKeyPath,
          setByKeyPath,
          delByKeyPath,
          shallowClone,
          deepClone,
          getObjectDiff,
          cmp: cmp2,
          asap: asap$1,
          minKey,
          addons: [],
          connections: {
            get: connections.toArray
          },
          errnames,
          dependencies: domDeps,
          cache,
          semVer: DEXIE_VERSION,
          version: DEXIE_VERSION.split(".").map(function(n) {
            return parseInt(n);
          }).reduce(function(p, c, i) {
            return p + c / Math.pow(10, i * 2);
          })
        }));
        Dexie2.maxKey = getMaxKey(Dexie2.dependencies.IDBKeyRange);
        if (typeof dispatchEvent !== "undefined" && typeof addEventListener !== "undefined") {
          globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(updatedParts) {
            if (!propagatingLocally) {
              var event_1;
              event_1 = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
                detail: updatedParts
              });
              propagatingLocally = true;
              dispatchEvent(event_1);
              propagatingLocally = false;
            }
          });
          addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, function(_a2) {
            var detail = _a2.detail;
            if (!propagatingLocally) {
              propagateLocally(detail);
            }
          });
        }
        function propagateLocally(updateParts) {
          var wasMe = propagatingLocally;
          try {
            propagatingLocally = true;
            globalEvents.storagemutated.fire(updateParts);
            signalSubscribersNow(updateParts, true);
          } finally {
            propagatingLocally = wasMe;
          }
        }
        var propagatingLocally = false;
        var bc;
        var createBC = function() {
        };
        if (typeof BroadcastChannel !== "undefined") {
          createBC = function() {
            bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
            bc.onmessage = function(ev) {
              return ev.data && propagateLocally(ev.data);
            };
          };
          createBC();
          if (typeof bc.unref === "function") {
            bc.unref();
          }
          globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(changedParts) {
            if (!propagatingLocally) {
              bc.postMessage(changedParts);
            }
          });
        }
        if (typeof addEventListener !== "undefined") {
          addEventListener("pagehide", function(event) {
            if (!Dexie$1.disableBfCache && event.persisted) {
              if (debug)
                console.debug("Dexie: handling persisted pagehide");
              bc === null || bc === void 0 ? void 0 : bc.close();
              for (var _i = 0, _a2 = connections.toArray(); _i < _a2.length; _i++) {
                var db2 = _a2[_i];
                db2.close({ disableAutoOpen: false });
              }
            }
          });
          addEventListener("pageshow", function(event) {
            if (!Dexie$1.disableBfCache && event.persisted) {
              if (debug)
                console.debug("Dexie: handling persisted pageshow");
              createBC();
              propagateLocally({ all: new RangeSet2(-Infinity, [[]]) });
            }
          });
        }
        function add2(value) {
          return new PropModification2({ add: value });
        }
        function remove2(value) {
          return new PropModification2({ remove: value });
        }
        function replacePrefix2(a, b) {
          return new PropModification2({ replacePrefix: [a, b] });
        }
        DexiePromise.rejectionMapper = mapError;
        setDebug(debug);
        var namedExports = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          DEFAULT_MAX_CONNECTIONS,
          Dexie: Dexie$1,
          Entity: Entity2,
          PropModification: PropModification2,
          RangeSet: RangeSet2,
          add: add2,
          cmp: cmp2,
          default: Dexie$1,
          liveQuery: liveQuery2,
          mergeRanges: mergeRanges2,
          rangesOverlap: rangesOverlap2,
          remove: remove2,
          replacePrefix: replacePrefix2
        });
        __assign(Dexie$1, namedExports, { default: Dexie$1 });
        return Dexie$1;
      }));
    }
  });

  // ds-bundle/.bundle-entry.mjs
  var bundle_entry_exports = {};
  __export(bundle_entry_exports, {
    AbortedDeferredError: () => AbortedDeferredError,
    Await: () => Await,
    BottomNav: () => BottomNav,
    BrowserRouter: () => BrowserRouter,
    Button: () => Button,
    Card: () => Card,
    CardContent: () => CardContent,
    CardDescription: () => CardDescription,
    CardHeader: () => CardHeader,
    CardTitle: () => CardTitle,
    Field: () => Field,
    Form: () => Form,
    HashRouter: () => HashRouter,
    Input: () => Input,
    LineChart: () => LineChart,
    Link: () => Link,
    MemoryRouter: () => MemoryRouter,
    NavLink: () => NavLink,
    Navigate: () => Navigate,
    NavigationType: () => Action,
    Outlet: () => Outlet,
    Progress: () => Progress,
    QuickActionFab: () => QuickActionFab,
    Route: () => Route,
    Router: () => Router,
    RouterProvider: () => RouterProvider,
    Routes: () => Routes,
    ScreenHeader: () => ScreenHeader,
    ScrollRestoration: () => ScrollRestoration,
    Segmented: () => Segmented,
    Sheet: () => Sheet,
    Textarea: () => Textarea,
    Toast: () => Toast,
    ToggleRow: () => ToggleRow,
    UNDO_TOAST_MS: () => UNDO_TOAST_MS,
    UNSAFE_DataRouterContext: () => DataRouterContext,
    UNSAFE_DataRouterStateContext: () => DataRouterStateContext,
    UNSAFE_ErrorResponseImpl: () => ErrorResponseImpl,
    UNSAFE_FetchersContext: () => FetchersContext,
    UNSAFE_LocationContext: () => LocationContext,
    UNSAFE_NavigationContext: () => NavigationContext,
    UNSAFE_RouteContext: () => RouteContext,
    UNSAFE_ViewTransitionContext: () => ViewTransitionContext,
    UNSAFE_useRouteId: () => useRouteId,
    UNSAFE_useScrollRestoration: () => useScrollRestoration,
    UpdatePrompt: () => UpdatePrompt,
    __dsMainNs: () => pkg_entry_exports,
    createBrowserRouter: () => createBrowserRouter,
    createHashRouter: () => createHashRouter,
    createMemoryRouter: () => createMemoryRouter,
    createPath: () => createPath,
    createRoutesFromChildren: () => createRoutesFromChildren,
    createRoutesFromElements: () => createRoutesFromChildren,
    createSearchParams: () => createSearchParams,
    defer: () => defer,
    generatePath: () => generatePath,
    isRouteErrorResponse: () => isRouteErrorResponse,
    json: () => json,
    matchPath: () => matchPath,
    matchRoutes: () => matchRoutes,
    parsePath: () => parsePath,
    redirect: () => redirect,
    redirectDocument: () => redirectDocument,
    renderMatches: () => renderMatches,
    replace: () => replace,
    resolvePath: () => resolvePath,
    unstable_HistoryRouter: () => HistoryRouter,
    unstable_usePrompt: () => usePrompt,
    useActionData: () => useActionData,
    useAsyncError: () => useAsyncError,
    useAsyncValue: () => useAsyncValue,
    useBeforeUnload: () => useBeforeUnload,
    useBlocker: () => useBlocker,
    useFetcher: () => useFetcher,
    useFetchers: () => useFetchers,
    useFormAction: () => useFormAction,
    useHref: () => useHref,
    useInRouterContext: () => useInRouterContext,
    useLinkClickHandler: () => useLinkClickHandler,
    useLoaderData: () => useLoaderData,
    useLocation: () => useLocation,
    useMatch: () => useMatch,
    useMatches: () => useMatches,
    useNavigate: () => useNavigate,
    useNavigation: () => useNavigation,
    useNavigationType: () => useNavigationType,
    useOutlet: () => useOutlet,
    useOutletContext: () => useOutletContext,
    useParams: () => useParams,
    useResolvedPath: () => useResolvedPath,
    useRevalidator: () => useRevalidator,
    useRouteError: () => useRouteError,
    useRouteLoaderData: () => useRouteLoaderData,
    useRoutes: () => useRoutes,
    useSearchParams: () => useSearchParams,
    useSubmit: () => useSubmit,
    useUiStore: () => useUiStore,
    useViewTransitionState: () => useViewTransitionState
  });
  init_define_import_meta_env();

  // node_modules/react-router-dom/dist/index.js
  init_define_import_meta_env();
  var React3 = __toESM(require_react_shim());
  var ReactDOM = __toESM(require_react_dom_shim());

  // node_modules/react-router/dist/index.js
  init_define_import_meta_env();
  var React2 = __toESM(require_react_shim());

  // node_modules/@remix-run/router/dist/router.js
  init_define_import_meta_env();
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function(n) {
      for (var e = 1; e < arguments.length; e++) {
        var t2 = arguments[e];
        for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n[r2] = t2[r2]);
      }
      return n;
    }, _extends.apply(null, arguments);
  }
  var Action;
  (function(Action2) {
    Action2["Pop"] = "POP";
    Action2["Push"] = "PUSH";
    Action2["Replace"] = "REPLACE";
  })(Action || (Action = {}));
  var PopStateEventType = "popstate";
  function createMemoryHistory(options) {
    if (options === void 0) {
      options = {};
    }
    let {
      initialEntries = ["/"],
      initialIndex,
      v5Compat = false
    } = options;
    let entries;
    entries = initialEntries.map((entry, index2) => createMemoryLocation(entry, typeof entry === "string" ? null : entry.state, index2 === 0 ? "default" : void 0));
    let index = clampIndex(initialIndex == null ? entries.length - 1 : initialIndex);
    let action = Action.Pop;
    let listener = null;
    function clampIndex(n) {
      return Math.min(Math.max(n, 0), entries.length - 1);
    }
    function getCurrentLocation() {
      return entries[index];
    }
    function createMemoryLocation(to, state, key) {
      if (state === void 0) {
        state = null;
      }
      let location2 = createLocation(entries ? getCurrentLocation().pathname : "/", to, state, key);
      warning(location2.pathname.charAt(0) === "/", "relative pathnames are not supported in memory history: " + JSON.stringify(to));
      return location2;
    }
    function createHref(to) {
      return typeof to === "string" ? to : createPath(to);
    }
    let history = {
      get index() {
        return index;
      },
      get action() {
        return action;
      },
      get location() {
        return getCurrentLocation();
      },
      createHref,
      createURL(to) {
        return new URL(createHref(to), "http://localhost");
      },
      encodeLocation(to) {
        let path = typeof to === "string" ? parsePath(to) : to;
        return {
          pathname: path.pathname || "",
          search: path.search || "",
          hash: path.hash || ""
        };
      },
      push(to, state) {
        action = Action.Push;
        let nextLocation = createMemoryLocation(to, state);
        index += 1;
        entries.splice(index, entries.length, nextLocation);
        if (v5Compat && listener) {
          listener({
            action,
            location: nextLocation,
            delta: 1
          });
        }
      },
      replace(to, state) {
        action = Action.Replace;
        let nextLocation = createMemoryLocation(to, state);
        entries[index] = nextLocation;
        if (v5Compat && listener) {
          listener({
            action,
            location: nextLocation,
            delta: 0
          });
        }
      },
      go(delta) {
        action = Action.Pop;
        let nextIndex = clampIndex(index + delta);
        let nextLocation = entries[nextIndex];
        index = nextIndex;
        if (listener) {
          listener({
            action,
            location: nextLocation,
            delta
          });
        }
      },
      listen(fn) {
        listener = fn;
        return () => {
          listener = null;
        };
      }
    };
    return history;
  }
  function createBrowserHistory(options) {
    if (options === void 0) {
      options = {};
    }
    function createBrowserLocation(window2, globalHistory) {
      let {
        pathname,
        search,
        hash
      } = window2.location;
      return createLocation(
        "",
        {
          pathname,
          search,
          hash
        },
        // state defaults to `null` because `window.history.state` does
        globalHistory.state && globalHistory.state.usr || null,
        globalHistory.state && globalHistory.state.key || "default"
      );
    }
    function createBrowserHref(window2, to) {
      return typeof to === "string" ? to : createPath(to);
    }
    return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
  }
  function createHashHistory(options) {
    if (options === void 0) {
      options = {};
    }
    function createHashLocation(window2, globalHistory) {
      let {
        pathname = "/",
        search = "",
        hash = ""
      } = parsePath(window2.location.hash.substr(1));
      if (!pathname.startsWith("/") && !pathname.startsWith(".")) {
        pathname = "/" + pathname;
      }
      return createLocation(
        "",
        {
          pathname,
          search,
          hash
        },
        // state defaults to `null` because `window.history.state` does
        globalHistory.state && globalHistory.state.usr || null,
        globalHistory.state && globalHistory.state.key || "default"
      );
    }
    function createHashHref(window2, to) {
      let base2 = window2.document.querySelector("base");
      let href = "";
      if (base2 && base2.getAttribute("href")) {
        let url = window2.location.href;
        let hashIndex = url.indexOf("#");
        href = hashIndex === -1 ? url : url.slice(0, hashIndex);
      }
      return href + "#" + (typeof to === "string" ? to : createPath(to));
    }
    function validateHashLocation(location2, to) {
      warning(location2.pathname.charAt(0) === "/", "relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")");
    }
    return getUrlBasedHistory(createHashLocation, createHashHref, validateHashLocation, options);
  }
  function invariant(value, message) {
    if (value === false || value === null || typeof value === "undefined") {
      throw new Error(message);
    }
  }
  function warning(cond, message) {
    if (!cond) {
      if (typeof console !== "undefined") console.warn(message);
      try {
        throw new Error(message);
      } catch (e) {
      }
    }
  }
  function createKey() {
    return Math.random().toString(36).substr(2, 8);
  }
  function getHistoryState(location2, index) {
    return {
      usr: location2.state,
      key: location2.key,
      idx: index
    };
  }
  function createLocation(current, to, state, key) {
    if (state === void 0) {
      state = null;
    }
    let location2 = _extends({
      pathname: typeof current === "string" ? current : current.pathname,
      search: "",
      hash: ""
    }, typeof to === "string" ? parsePath(to) : to, {
      state,
      // TODO: This could be cleaned up.  push/replace should probably just take
      // full Locations now and avoid the need to run through this flow at all
      // But that's a pretty big refactor to the current test suite so going to
      // keep as is for the time being and just let any incoming keys take precedence
      key: to && to.key || key || createKey()
    });
    return location2;
  }
  function createPath(_ref) {
    let {
      pathname = "/",
      search = "",
      hash = ""
    } = _ref;
    if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
    if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
    return pathname;
  }
  function parsePath(path) {
    let parsedPath = {};
    if (path) {
      let hashIndex = path.indexOf("#");
      if (hashIndex >= 0) {
        parsedPath.hash = path.substr(hashIndex);
        path = path.substr(0, hashIndex);
      }
      let searchIndex = path.indexOf("?");
      if (searchIndex >= 0) {
        parsedPath.search = path.substr(searchIndex);
        path = path.substr(0, searchIndex);
      }
      if (path) {
        parsedPath.pathname = path;
      }
    }
    return parsedPath;
  }
  function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
    if (options === void 0) {
      options = {};
    }
    let {
      window: window2 = document.defaultView,
      v5Compat = false
    } = options;
    let globalHistory = window2.history;
    let action = Action.Pop;
    let listener = null;
    let index = getIndex();
    if (index == null) {
      index = 0;
      globalHistory.replaceState(_extends({}, globalHistory.state, {
        idx: index
      }), "");
    }
    function getIndex() {
      let state = globalHistory.state || {
        idx: null
      };
      return state.idx;
    }
    function handlePop() {
      action = Action.Pop;
      let nextIndex = getIndex();
      let delta = nextIndex == null ? null : nextIndex - index;
      index = nextIndex;
      if (listener) {
        listener({
          action,
          location: history.location,
          delta
        });
      }
    }
    function push(to, state) {
      action = Action.Push;
      let location2 = createLocation(history.location, to, state);
      if (validateLocation) validateLocation(location2, to);
      index = getIndex() + 1;
      let historyState = getHistoryState(location2, index);
      let url = history.createHref(location2);
      try {
        globalHistory.pushState(historyState, "", url);
      } catch (error) {
        if (error instanceof DOMException && error.name === "DataCloneError") {
          throw error;
        }
        window2.location.assign(url);
      }
      if (v5Compat && listener) {
        listener({
          action,
          location: history.location,
          delta: 1
        });
      }
    }
    function replace2(to, state) {
      action = Action.Replace;
      let location2 = createLocation(history.location, to, state);
      if (validateLocation) validateLocation(location2, to);
      index = getIndex();
      let historyState = getHistoryState(location2, index);
      let url = history.createHref(location2);
      globalHistory.replaceState(historyState, "", url);
      if (v5Compat && listener) {
        listener({
          action,
          location: history.location,
          delta: 0
        });
      }
    }
    function createURL(to) {
      let base2 = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
      let href = typeof to === "string" ? to : createPath(to);
      href = href.replace(/ $/, "%20");
      invariant(base2, "No window.location.(origin|href) available to create URL for href: " + href);
      return new URL(href, base2);
    }
    let history = {
      get action() {
        return action;
      },
      get location() {
        return getLocation(window2, globalHistory);
      },
      listen(fn) {
        if (listener) {
          throw new Error("A history only accepts one active listener");
        }
        window2.addEventListener(PopStateEventType, handlePop);
        listener = fn;
        return () => {
          window2.removeEventListener(PopStateEventType, handlePop);
          listener = null;
        };
      },
      createHref(to) {
        return createHref(window2, to);
      },
      createURL,
      encodeLocation(to) {
        let url = createURL(to);
        return {
          pathname: url.pathname,
          search: url.search,
          hash: url.hash
        };
      },
      push,
      replace: replace2,
      go(n) {
        return globalHistory.go(n);
      }
    };
    return history;
  }
  var ResultType;
  (function(ResultType2) {
    ResultType2["data"] = "data";
    ResultType2["deferred"] = "deferred";
    ResultType2["redirect"] = "redirect";
    ResultType2["error"] = "error";
  })(ResultType || (ResultType = {}));
  var immutableRouteKeys = /* @__PURE__ */ new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
  function isIndexRoute(route) {
    return route.index === true;
  }
  function convertRoutesToDataRoutes(routes, mapRouteProperties2, parentPath, manifest) {
    if (parentPath === void 0) {
      parentPath = [];
    }
    if (manifest === void 0) {
      manifest = {};
    }
    return routes.map((route, index) => {
      let treePath = [...parentPath, String(index)];
      let id = typeof route.id === "string" ? route.id : treePath.join("-");
      invariant(route.index !== true || !route.children, "Cannot specify children on an index route");
      invariant(!manifest[id], 'Found a route id collision on id "' + id + `".  Route id's must be globally unique within Data Router usages`);
      if (isIndexRoute(route)) {
        let indexRoute = _extends({}, route, mapRouteProperties2(route), {
          id
        });
        manifest[id] = indexRoute;
        return indexRoute;
      } else {
        let pathOrLayoutRoute = _extends({}, route, mapRouteProperties2(route), {
          id,
          children: void 0
        });
        manifest[id] = pathOrLayoutRoute;
        if (route.children) {
          pathOrLayoutRoute.children = convertRoutesToDataRoutes(route.children, mapRouteProperties2, treePath, manifest);
        }
        return pathOrLayoutRoute;
      }
    });
  }
  function matchRoutes(routes, locationArg, basename) {
    if (basename === void 0) {
      basename = "/";
    }
    return matchRoutesImpl(routes, locationArg, basename, false);
  }
  function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
    let location2 = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    let pathname = stripBasename(location2.pathname || "/", basename);
    if (pathname == null) {
      return null;
    }
    let branches = flattenRoutes(routes);
    rankRouteBranches(branches);
    let matches = null;
    let decoded = decodePath(pathname);
    for (let i = 0; matches == null && i < branches.length; ++i) {
      matches = matchRouteBranch(branches[i], decoded, allowPartial);
    }
    return matches;
  }
  function convertRouteMatchToUiMatch(match, loaderData) {
    let {
      route,
      pathname,
      params
    } = match;
    return {
      id: route.id,
      pathname,
      params,
      data: loaderData[route.id],
      handle: route.handle
    };
  }
  function flattenRoutes(routes, branches, parentsMeta, parentPath) {
    if (branches === void 0) {
      branches = [];
    }
    if (parentsMeta === void 0) {
      parentsMeta = [];
    }
    if (parentPath === void 0) {
      parentPath = "";
    }
    let flattenRoute = (route, index, relativePath) => {
      let meta = {
        relativePath: relativePath === void 0 ? route.path || "" : relativePath,
        caseSensitive: route.caseSensitive === true,
        childrenIndex: index,
        route
      };
      if (meta.relativePath.startsWith("/")) {
        invariant(meta.relativePath.startsWith(parentPath), 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
        meta.relativePath = meta.relativePath.slice(parentPath.length);
      }
      let path = joinPaths([parentPath, meta.relativePath]);
      let routesMeta = parentsMeta.concat(meta);
      if (route.children && route.children.length > 0) {
        invariant(
          // Our types know better, but runtime JS may not!
          // @ts-expect-error
          route.index !== true,
          "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
        );
        flattenRoutes(route.children, branches, routesMeta, path);
      }
      if (route.path == null && !route.index) {
        return;
      }
      branches.push({
        path,
        score: computeScore(path, route.index),
        routesMeta
      });
    };
    routes.forEach((route, index) => {
      var _route$path;
      if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
        flattenRoute(route, index);
      } else {
        for (let exploded of explodeOptionalSegments(route.path)) {
          flattenRoute(route, index, exploded);
        }
      }
    });
    return branches;
  }
  function explodeOptionalSegments(path) {
    let segments = path.split("/");
    if (segments.length === 0) return [];
    let [first, ...rest] = segments;
    let isOptional = first.endsWith("?");
    let required = first.replace(/\?$/, "");
    if (rest.length === 0) {
      return isOptional ? [required, ""] : [required];
    }
    let restExploded = explodeOptionalSegments(rest.join("/"));
    let result = [];
    result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
    if (isOptional) {
      result.push(...restExploded);
    }
    return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
  }
  function rankRouteBranches(branches) {
    branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta) => meta.childrenIndex), b.routesMeta.map((meta) => meta.childrenIndex)));
  }
  var paramRe = /^:[\w-]+$/;
  var dynamicSegmentValue = 3;
  var indexRouteValue = 2;
  var emptySegmentValue = 1;
  var staticSegmentValue = 10;
  var splatPenalty = -2;
  var isSplat = (s) => s === "*";
  function computeScore(path, index) {
    let segments = path.split("/");
    let initialScore = segments.length;
    if (segments.some(isSplat)) {
      initialScore += splatPenalty;
    }
    if (index) {
      initialScore += indexRouteValue;
    }
    return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
  }
  function compareIndexes(a, b) {
    let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
    return siblings ? (
      // If two routes are siblings, we should try to match the earlier sibling
      // first. This allows people to have fine-grained control over the matching
      // behavior by simply putting routes with identical paths in the order they
      // want them tried.
      a[a.length - 1] - b[b.length - 1]
    ) : (
      // Otherwise, it doesn't really make sense to rank non-siblings by index,
      // so they sort equally.
      0
    );
  }
  function matchRouteBranch(branch, pathname, allowPartial) {
    if (allowPartial === void 0) {
      allowPartial = false;
    }
    let {
      routesMeta
    } = branch;
    let matchedParams = {};
    let matchedPathname = "/";
    let matches = [];
    for (let i = 0; i < routesMeta.length; ++i) {
      let meta = routesMeta[i];
      let end = i === routesMeta.length - 1;
      let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
      let match = matchPath({
        path: meta.relativePath,
        caseSensitive: meta.caseSensitive,
        end
      }, remainingPathname);
      let route = meta.route;
      if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
        match = matchPath({
          path: meta.relativePath,
          caseSensitive: meta.caseSensitive,
          end: false
        }, remainingPathname);
      }
      if (!match) {
        return null;
      }
      Object.assign(matchedParams, match.params);
      matches.push({
        // TODO: Can this as be avoided?
        params: matchedParams,
        pathname: joinPaths([matchedPathname, match.pathname]),
        pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
        route
      });
      if (match.pathnameBase !== "/") {
        matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
      }
    }
    return matches;
  }
  function generatePath(originalPath, params) {
    if (params === void 0) {
      params = {};
    }
    let path = originalPath;
    if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
      warning(false, 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
      path = path.replace(/\*$/, "/*");
    }
    const prefix = path.startsWith("/") ? "/" : "";
    const stringify = (p) => p == null ? "" : typeof p === "string" ? p : String(p);
    const segments = path.split(/\/+/).map((segment, index, array) => {
      const isLastSegment = index === array.length - 1;
      if (isLastSegment && segment === "*") {
        const star = "*";
        return stringify(params[star]);
      }
      const keyMatch = segment.match(/^:([\w-]+)(\??)$/);
      if (keyMatch) {
        const [, key, optional] = keyMatch;
        let param = params[key];
        invariant(optional === "?" || param != null, 'Missing ":' + key + '" param');
        return stringify(param);
      }
      return segment.replace(/\?$/g, "");
    }).filter((segment) => !!segment);
    return prefix + segments.join("/");
  }
  function matchPath(pattern, pathname) {
    if (typeof pattern === "string") {
      pattern = {
        path: pattern,
        caseSensitive: false,
        end: true
      };
    }
    let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
    let match = pathname.match(matcher);
    if (!match) return null;
    let matchedPathname = match[0];
    let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
    let captureGroups = match.slice(1);
    let params = compiledParams.reduce((memo2, _ref, index) => {
      let {
        paramName,
        isOptional
      } = _ref;
      if (paramName === "*") {
        let splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
      }
      const value = captureGroups[index];
      if (isOptional && !value) {
        memo2[paramName] = void 0;
      } else {
        memo2[paramName] = (value || "").replace(/%2F/g, "/");
      }
      return memo2;
    }, {});
    return {
      params,
      pathname: matchedPathname,
      pathnameBase,
      pattern
    };
  }
  function compilePath(path, caseSensitive, end) {
    if (caseSensitive === void 0) {
      caseSensitive = false;
    }
    if (end === void 0) {
      end = true;
    }
    warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
    let params = [];
    let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
      params.push({
        paramName,
        isOptional: isOptional != null
      });
      return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
    });
    if (path.endsWith("*")) {
      params.push({
        paramName: "*"
      });
      regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
    } else if (end) {
      regexpSource += "\\/*$";
    } else if (path !== "" && path !== "/") {
      regexpSource += "(?:(?=\\/|$))";
    } else ;
    let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
    return [matcher, params];
  }
  function decodePath(value) {
    try {
      return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
    } catch (error) {
      warning(false, 'The URL path "' + value + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
      return value;
    }
  }
  function stripBasename(pathname, basename) {
    if (basename === "/") return pathname;
    if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
      return null;
    }
    let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
    let nextChar = pathname.charAt(startIndex);
    if (nextChar && nextChar !== "/") {
      return null;
    }
    return pathname.slice(startIndex) || "/";
  }
  function resolvePath(to, fromPathname) {
    if (fromPathname === void 0) {
      fromPathname = "/";
    }
    let {
      pathname: toPathname,
      search = "",
      hash = ""
    } = typeof to === "string" ? parsePath(to) : to;
    let pathname;
    if (toPathname) {
      toPathname = removeDoubleSlashes(toPathname);
      if (toPathname.startsWith("/")) {
        pathname = resolvePathname(toPathname.substring(1), "/");
      } else {
        pathname = resolvePathname(toPathname, fromPathname);
      }
    } else {
      pathname = fromPathname;
    }
    return {
      pathname,
      search: normalizeSearch(search),
      hash: normalizeHash(hash)
    };
  }
  function resolvePathname(relativePath, fromPathname) {
    let segments = fromPathname.replace(/\/+$/, "").split("/");
    let relativeSegments = relativePath.split("/");
    relativeSegments.forEach((segment) => {
      if (segment === "..") {
        if (segments.length > 1) segments.pop();
      } else if (segment !== ".") {
        segments.push(segment);
      }
    });
    return segments.length > 1 ? segments.join("/") : "/";
  }
  function getInvalidPathError(char, field, dest, path) {
    return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
  }
  function getPathContributingMatches(matches) {
    return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
  }
  function getResolveToMatches(matches, v7_relativeSplatPath) {
    let pathMatches = getPathContributingMatches(matches);
    if (v7_relativeSplatPath) {
      return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
    }
    return pathMatches.map((match) => match.pathnameBase);
  }
  function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
    if (isPathRelative === void 0) {
      isPathRelative = false;
    }
    let to;
    if (typeof toArg === "string") {
      to = parsePath(toArg);
    } else {
      to = _extends({}, toArg);
      invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
      invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
      invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
    }
    let isEmptyPath = toArg === "" || to.pathname === "";
    let toPathname = isEmptyPath ? "/" : to.pathname;
    let from;
    if (toPathname == null) {
      from = locationPathname;
    } else {
      let routePathnameIndex = routePathnames.length - 1;
      if (!isPathRelative && toPathname.startsWith("..")) {
        let toSegments = toPathname.split("/");
        while (toSegments[0] === "..") {
          toSegments.shift();
          routePathnameIndex -= 1;
        }
        to.pathname = toSegments.join("/");
      }
      from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
    }
    let path = resolvePath(to, from);
    let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
    let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
    if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
      path.pathname += "/";
    }
    return path;
  }
  var removeDoubleSlashes = (path) => path.replace(/\/\/+/g, "/");
  var joinPaths = (paths) => removeDoubleSlashes(paths.join("/"));
  var normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
  var normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
  var normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
  var json = function json2(data, init) {
    if (init === void 0) {
      init = {};
    }
    let responseInit = typeof init === "number" ? {
      status: init
    } : init;
    let headers = new Headers(responseInit.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json; charset=utf-8");
    }
    return new Response(JSON.stringify(data), _extends({}, responseInit, {
      headers
    }));
  };
  var AbortedDeferredError = class extends Error {
  };
  var DeferredData = class {
    constructor(data, responseInit) {
      this.pendingKeysSet = /* @__PURE__ */ new Set();
      this.subscribers = /* @__PURE__ */ new Set();
      this.deferredKeys = [];
      invariant(data && typeof data === "object" && !Array.isArray(data), "defer() only accepts plain objects");
      let reject;
      this.abortPromise = new Promise((_, r2) => reject = r2);
      this.controller = new AbortController();
      let onAbort = () => reject(new AbortedDeferredError("Deferred data aborted"));
      this.unlistenAbortSignal = () => this.controller.signal.removeEventListener("abort", onAbort);
      this.controller.signal.addEventListener("abort", onAbort);
      this.data = Object.entries(data).reduce((acc, _ref2) => {
        let [key, value] = _ref2;
        return Object.assign(acc, {
          [key]: this.trackPromise(key, value)
        });
      }, {});
      if (this.done) {
        this.unlistenAbortSignal();
      }
      this.init = responseInit;
    }
    trackPromise(key, value) {
      if (!(value instanceof Promise)) {
        return value;
      }
      this.deferredKeys.push(key);
      this.pendingKeysSet.add(key);
      let promise = Promise.race([value, this.abortPromise]).then((data) => this.onSettle(promise, key, void 0, data), (error) => this.onSettle(promise, key, error));
      promise.catch(() => {
      });
      Object.defineProperty(promise, "_tracked", {
        get: () => true
      });
      return promise;
    }
    onSettle(promise, key, error, data) {
      if (this.controller.signal.aborted && error instanceof AbortedDeferredError) {
        this.unlistenAbortSignal();
        Object.defineProperty(promise, "_error", {
          get: () => error
        });
        return Promise.reject(error);
      }
      this.pendingKeysSet.delete(key);
      if (this.done) {
        this.unlistenAbortSignal();
      }
      if (error === void 0 && data === void 0) {
        let undefinedError = new Error('Deferred data for key "' + key + '" resolved/rejected with `undefined`, you must resolve/reject with a value or `null`.');
        Object.defineProperty(promise, "_error", {
          get: () => undefinedError
        });
        this.emit(false, key);
        return Promise.reject(undefinedError);
      }
      if (data === void 0) {
        Object.defineProperty(promise, "_error", {
          get: () => error
        });
        this.emit(false, key);
        return Promise.reject(error);
      }
      Object.defineProperty(promise, "_data", {
        get: () => data
      });
      this.emit(false, key);
      return data;
    }
    emit(aborted, settledKey) {
      this.subscribers.forEach((subscriber) => subscriber(aborted, settledKey));
    }
    subscribe(fn) {
      this.subscribers.add(fn);
      return () => this.subscribers.delete(fn);
    }
    cancel() {
      this.controller.abort();
      this.pendingKeysSet.forEach((v, k) => this.pendingKeysSet.delete(k));
      this.emit(true);
    }
    async resolveData(signal) {
      let aborted = false;
      if (!this.done) {
        let onAbort = () => this.cancel();
        signal.addEventListener("abort", onAbort);
        aborted = await new Promise((resolve) => {
          this.subscribe((aborted2) => {
            signal.removeEventListener("abort", onAbort);
            if (aborted2 || this.done) {
              resolve(aborted2);
            }
          });
        });
      }
      return aborted;
    }
    get done() {
      return this.pendingKeysSet.size === 0;
    }
    get unwrappedData() {
      invariant(this.data !== null && this.done, "Can only unwrap data on initialized and settled deferreds");
      return Object.entries(this.data).reduce((acc, _ref3) => {
        let [key, value] = _ref3;
        return Object.assign(acc, {
          [key]: unwrapTrackedPromise(value)
        });
      }, {});
    }
    get pendingKeys() {
      return Array.from(this.pendingKeysSet);
    }
  };
  function isTrackedPromise(value) {
    return value instanceof Promise && value._tracked === true;
  }
  function unwrapTrackedPromise(value) {
    if (!isTrackedPromise(value)) {
      return value;
    }
    if (value._error) {
      throw value._error;
    }
    return value._data;
  }
  var defer = function defer2(data, init) {
    if (init === void 0) {
      init = {};
    }
    let responseInit = typeof init === "number" ? {
      status: init
    } : init;
    return new DeferredData(data, responseInit);
  };
  var redirect = function redirect2(url, init) {
    if (init === void 0) {
      init = 302;
    }
    let responseInit = init;
    if (typeof responseInit === "number") {
      responseInit = {
        status: responseInit
      };
    } else if (typeof responseInit.status === "undefined") {
      responseInit.status = 302;
    }
    let headers = new Headers(responseInit.headers);
    headers.set("Location", url);
    return new Response(null, _extends({}, responseInit, {
      headers
    }));
  };
  var redirectDocument = (url, init) => {
    let response = redirect(url, init);
    response.headers.set("X-Remix-Reload-Document", "true");
    return response;
  };
  var replace = (url, init) => {
    let response = redirect(url, init);
    response.headers.set("X-Remix-Replace", "true");
    return response;
  };
  var ErrorResponseImpl = class {
    constructor(status, statusText, data, internal) {
      if (internal === void 0) {
        internal = false;
      }
      this.status = status;
      this.statusText = statusText || "";
      this.internal = internal;
      if (data instanceof Error) {
        this.data = data.toString();
        this.error = data;
      } else {
        this.data = data;
      }
    }
  };
  function isRouteErrorResponse(error) {
    return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
  }
  var validMutationMethodsArr = ["post", "put", "patch", "delete"];
  var validMutationMethods = new Set(validMutationMethodsArr);
  var validRequestMethodsArr = ["get", ...validMutationMethodsArr];
  var validRequestMethods = new Set(validRequestMethodsArr);
  var redirectStatusCodes = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
  var redirectPreserveMethodStatusCodes = /* @__PURE__ */ new Set([307, 308]);
  var IDLE_NAVIGATION = {
    state: "idle",
    location: void 0,
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0
  };
  var IDLE_FETCHER = {
    state: "idle",
    data: void 0,
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0
  };
  var IDLE_BLOCKER = {
    state: "unblocked",
    proceed: void 0,
    reset: void 0,
    location: void 0
  };
  var ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
  var defaultMapRouteProperties = (route) => ({
    hasErrorBoundary: Boolean(route.hasErrorBoundary)
  });
  var TRANSITIONS_STORAGE_KEY = "remix-router-transitions";
  function createRouter(init) {
    const routerWindow = init.window ? init.window : typeof window !== "undefined" ? window : void 0;
    const isBrowser2 = typeof routerWindow !== "undefined" && typeof routerWindow.document !== "undefined" && typeof routerWindow.document.createElement !== "undefined";
    const isServer = !isBrowser2;
    invariant(init.routes.length > 0, "You must provide a non-empty routes array to createRouter");
    let mapRouteProperties2;
    if (init.mapRouteProperties) {
      mapRouteProperties2 = init.mapRouteProperties;
    } else if (init.detectErrorBoundary) {
      let detectErrorBoundary = init.detectErrorBoundary;
      mapRouteProperties2 = (route) => ({
        hasErrorBoundary: detectErrorBoundary(route)
      });
    } else {
      mapRouteProperties2 = defaultMapRouteProperties;
    }
    let manifest = {};
    let dataRoutes = convertRoutesToDataRoutes(init.routes, mapRouteProperties2, void 0, manifest);
    let inFlightDataRoutes;
    let basename = init.basename || "/";
    let dataStrategyImpl = init.dataStrategy || defaultDataStrategy;
    let patchRoutesOnNavigationImpl = init.patchRoutesOnNavigation;
    let future = _extends({
      v7_fetcherPersist: false,
      v7_normalizeFormMethod: false,
      v7_partialHydration: false,
      v7_prependBasename: false,
      v7_relativeSplatPath: false,
      v7_skipActionErrorRevalidation: false
    }, init.future);
    let unlistenHistory = null;
    let subscribers = /* @__PURE__ */ new Set();
    let savedScrollPositions2 = null;
    let getScrollRestorationKey = null;
    let getScrollPosition = null;
    let initialScrollRestored = init.hydrationData != null;
    let initialMatches = matchRoutes(dataRoutes, init.history.location, basename);
    let initialMatchesIsFOW = false;
    let initialErrors = null;
    if (initialMatches == null && !patchRoutesOnNavigationImpl) {
      let error = getInternalRouterError(404, {
        pathname: init.history.location.pathname
      });
      let {
        matches,
        route
      } = getShortCircuitMatches(dataRoutes);
      initialMatches = matches;
      initialErrors = {
        [route.id]: error
      };
    }
    if (initialMatches && !init.hydrationData) {
      let fogOfWar = checkFogOfWar(initialMatches, dataRoutes, init.history.location.pathname);
      if (fogOfWar.active) {
        initialMatches = null;
      }
    }
    let initialized;
    if (!initialMatches) {
      initialized = false;
      initialMatches = [];
      if (future.v7_partialHydration) {
        let fogOfWar = checkFogOfWar(null, dataRoutes, init.history.location.pathname);
        if (fogOfWar.active && fogOfWar.matches) {
          initialMatchesIsFOW = true;
          initialMatches = fogOfWar.matches;
        }
      }
    } else if (initialMatches.some((m) => m.route.lazy)) {
      initialized = false;
    } else if (!initialMatches.some((m) => m.route.loader)) {
      initialized = true;
    } else if (future.v7_partialHydration) {
      let loaderData = init.hydrationData ? init.hydrationData.loaderData : null;
      let errors = init.hydrationData ? init.hydrationData.errors : null;
      if (errors) {
        let idx = initialMatches.findIndex((m) => errors[m.route.id] !== void 0);
        initialized = initialMatches.slice(0, idx + 1).every((m) => !shouldLoadRouteOnHydration(m.route, loaderData, errors));
      } else {
        initialized = initialMatches.every((m) => !shouldLoadRouteOnHydration(m.route, loaderData, errors));
      }
    } else {
      initialized = init.hydrationData != null;
    }
    let router;
    let state = {
      historyAction: init.history.action,
      location: init.history.location,
      matches: initialMatches,
      initialized,
      navigation: IDLE_NAVIGATION,
      // Don't restore on initial updateState() if we were SSR'd
      restoreScrollPosition: init.hydrationData != null ? false : null,
      preventScrollReset: false,
      revalidation: "idle",
      loaderData: init.hydrationData && init.hydrationData.loaderData || {},
      actionData: init.hydrationData && init.hydrationData.actionData || null,
      errors: init.hydrationData && init.hydrationData.errors || initialErrors,
      fetchers: /* @__PURE__ */ new Map(),
      blockers: /* @__PURE__ */ new Map()
    };
    let pendingAction = Action.Pop;
    let pendingPreventScrollReset = false;
    let pendingNavigationController;
    let pendingViewTransitionEnabled = false;
    let appliedViewTransitions = /* @__PURE__ */ new Map();
    let removePageHideEventListener = null;
    let isUninterruptedRevalidation = false;
    let isRevalidationRequired = false;
    let cancelledDeferredRoutes = [];
    let cancelledFetcherLoads = /* @__PURE__ */ new Set();
    let fetchControllers = /* @__PURE__ */ new Map();
    let incrementingLoadId = 0;
    let pendingNavigationLoadId = -1;
    let fetchReloadIds = /* @__PURE__ */ new Map();
    let fetchRedirectIds = /* @__PURE__ */ new Set();
    let fetchLoadMatches = /* @__PURE__ */ new Map();
    let activeFetchers = /* @__PURE__ */ new Map();
    let deletedFetchers = /* @__PURE__ */ new Set();
    let activeDeferreds = /* @__PURE__ */ new Map();
    let blockerFunctions = /* @__PURE__ */ new Map();
    let unblockBlockerHistoryUpdate = void 0;
    function initialize() {
      unlistenHistory = init.history.listen((_ref) => {
        let {
          action: historyAction,
          location: location2,
          delta
        } = _ref;
        if (unblockBlockerHistoryUpdate) {
          unblockBlockerHistoryUpdate();
          unblockBlockerHistoryUpdate = void 0;
          return;
        }
        warning(blockerFunctions.size === 0 || delta != null, "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.");
        let blockerKey = shouldBlockNavigation({
          currentLocation: state.location,
          nextLocation: location2,
          historyAction
        });
        if (blockerKey && delta != null) {
          let nextHistoryUpdatePromise = new Promise((resolve) => {
            unblockBlockerHistoryUpdate = resolve;
          });
          init.history.go(delta * -1);
          updateBlocker(blockerKey, {
            state: "blocked",
            location: location2,
            proceed() {
              updateBlocker(blockerKey, {
                state: "proceeding",
                proceed: void 0,
                reset: void 0,
                location: location2
              });
              nextHistoryUpdatePromise.then(() => init.history.go(delta));
            },
            reset() {
              let blockers = new Map(state.blockers);
              blockers.set(blockerKey, IDLE_BLOCKER);
              updateState({
                blockers
              });
            }
          });
          return;
        }
        return startNavigation(historyAction, location2);
      });
      if (isBrowser2) {
        restoreAppliedTransitions(routerWindow, appliedViewTransitions);
        let _saveAppliedTransitions = () => persistAppliedTransitions(routerWindow, appliedViewTransitions);
        routerWindow.addEventListener("pagehide", _saveAppliedTransitions);
        removePageHideEventListener = () => routerWindow.removeEventListener("pagehide", _saveAppliedTransitions);
      }
      if (!state.initialized) {
        startNavigation(Action.Pop, state.location, {
          initialHydration: true
        });
      }
      return router;
    }
    function dispose() {
      if (unlistenHistory) {
        unlistenHistory();
      }
      if (removePageHideEventListener) {
        removePageHideEventListener();
      }
      subscribers.clear();
      pendingNavigationController && pendingNavigationController.abort();
      state.fetchers.forEach((_, key) => deleteFetcher(key));
      state.blockers.forEach((_, key) => deleteBlocker(key));
    }
    function subscribe(fn) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    }
    function updateState(newState, opts) {
      if (opts === void 0) {
        opts = {};
      }
      state = _extends({}, state, newState);
      let completedFetchers = [];
      let deletedFetchersKeys = [];
      if (future.v7_fetcherPersist) {
        state.fetchers.forEach((fetcher, key) => {
          if (fetcher.state === "idle") {
            if (deletedFetchers.has(key)) {
              deletedFetchersKeys.push(key);
            } else {
              completedFetchers.push(key);
            }
          }
        });
      }
      deletedFetchers.forEach((key) => {
        if (!state.fetchers.has(key) && !fetchControllers.has(key)) {
          deletedFetchersKeys.push(key);
        }
      });
      [...subscribers].forEach((subscriber) => subscriber(state, {
        deletedFetchers: deletedFetchersKeys,
        viewTransitionOpts: opts.viewTransitionOpts,
        flushSync: opts.flushSync === true
      }));
      if (future.v7_fetcherPersist) {
        completedFetchers.forEach((key) => state.fetchers.delete(key));
        deletedFetchersKeys.forEach((key) => deleteFetcher(key));
      } else {
        deletedFetchersKeys.forEach((key) => deletedFetchers.delete(key));
      }
    }
    function completeNavigation(location2, newState, _temp) {
      var _location$state, _location$state2;
      let {
        flushSync
      } = _temp === void 0 ? {} : _temp;
      let isActionReload = state.actionData != null && state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && state.navigation.state === "loading" && ((_location$state = location2.state) == null ? void 0 : _location$state._isRedirect) !== true;
      let actionData;
      if (newState.actionData) {
        if (Object.keys(newState.actionData).length > 0) {
          actionData = newState.actionData;
        } else {
          actionData = null;
        }
      } else if (isActionReload) {
        actionData = state.actionData;
      } else {
        actionData = null;
      }
      let loaderData = newState.loaderData ? mergeLoaderData(state.loaderData, newState.loaderData, newState.matches || [], newState.errors) : state.loaderData;
      let blockers = state.blockers;
      if (blockers.size > 0) {
        blockers = new Map(blockers);
        blockers.forEach((_, k) => blockers.set(k, IDLE_BLOCKER));
      }
      let preventScrollReset = pendingPreventScrollReset === true || state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && ((_location$state2 = location2.state) == null ? void 0 : _location$state2._isRedirect) !== true;
      if (inFlightDataRoutes) {
        dataRoutes = inFlightDataRoutes;
        inFlightDataRoutes = void 0;
      }
      if (isUninterruptedRevalidation) ;
      else if (pendingAction === Action.Pop) ;
      else if (pendingAction === Action.Push) {
        init.history.push(location2, location2.state);
      } else if (pendingAction === Action.Replace) {
        init.history.replace(location2, location2.state);
      }
      let viewTransitionOpts;
      if (pendingAction === Action.Pop) {
        let priorPaths = appliedViewTransitions.get(state.location.pathname);
        if (priorPaths && priorPaths.has(location2.pathname)) {
          viewTransitionOpts = {
            currentLocation: state.location,
            nextLocation: location2
          };
        } else if (appliedViewTransitions.has(location2.pathname)) {
          viewTransitionOpts = {
            currentLocation: location2,
            nextLocation: state.location
          };
        }
      } else if (pendingViewTransitionEnabled) {
        let toPaths = appliedViewTransitions.get(state.location.pathname);
        if (toPaths) {
          toPaths.add(location2.pathname);
        } else {
          toPaths = /* @__PURE__ */ new Set([location2.pathname]);
          appliedViewTransitions.set(state.location.pathname, toPaths);
        }
        viewTransitionOpts = {
          currentLocation: state.location,
          nextLocation: location2
        };
      }
      updateState(_extends({}, newState, {
        actionData,
        loaderData,
        historyAction: pendingAction,
        location: location2,
        initialized: true,
        navigation: IDLE_NAVIGATION,
        revalidation: "idle",
        restoreScrollPosition: getSavedScrollPosition(location2, newState.matches || state.matches),
        preventScrollReset,
        blockers
      }), {
        viewTransitionOpts,
        flushSync: flushSync === true
      });
      pendingAction = Action.Pop;
      pendingPreventScrollReset = false;
      pendingViewTransitionEnabled = false;
      isUninterruptedRevalidation = false;
      isRevalidationRequired = false;
      cancelledDeferredRoutes = [];
    }
    async function navigate(to, opts) {
      if (typeof to === "number") {
        init.history.go(to);
        return;
      }
      let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, to, future.v7_relativeSplatPath, opts == null ? void 0 : opts.fromRouteId, opts == null ? void 0 : opts.relative);
      let {
        path,
        submission,
        error
      } = normalizeNavigateOptions(future.v7_normalizeFormMethod, false, normalizedPath, opts);
      let currentLocation = state.location;
      let nextLocation = createLocation(state.location, path, opts && opts.state);
      nextLocation = _extends({}, nextLocation, init.history.encodeLocation(nextLocation));
      let userReplace = opts && opts.replace != null ? opts.replace : void 0;
      let historyAction = Action.Push;
      if (userReplace === true) {
        historyAction = Action.Replace;
      } else if (userReplace === false) ;
      else if (submission != null && isMutationMethod(submission.formMethod) && submission.formAction === state.location.pathname + state.location.search) {
        historyAction = Action.Replace;
      }
      let preventScrollReset = opts && "preventScrollReset" in opts ? opts.preventScrollReset === true : void 0;
      let flushSync = (opts && opts.flushSync) === true;
      let blockerKey = shouldBlockNavigation({
        currentLocation,
        nextLocation,
        historyAction
      });
      if (blockerKey) {
        updateBlocker(blockerKey, {
          state: "blocked",
          location: nextLocation,
          proceed() {
            updateBlocker(blockerKey, {
              state: "proceeding",
              proceed: void 0,
              reset: void 0,
              location: nextLocation
            });
            navigate(to, opts);
          },
          reset() {
            let blockers = new Map(state.blockers);
            blockers.set(blockerKey, IDLE_BLOCKER);
            updateState({
              blockers
            });
          }
        });
        return;
      }
      return await startNavigation(historyAction, nextLocation, {
        submission,
        // Send through the formData serialization error if we have one so we can
        // render at the right error boundary after we match routes
        pendingError: error,
        preventScrollReset,
        replace: opts && opts.replace,
        enableViewTransition: opts && opts.viewTransition,
        flushSync
      });
    }
    function revalidate() {
      interruptActiveLoads();
      updateState({
        revalidation: "loading"
      });
      if (state.navigation.state === "submitting") {
        return;
      }
      if (state.navigation.state === "idle") {
        startNavigation(state.historyAction, state.location, {
          startUninterruptedRevalidation: true
        });
        return;
      }
      startNavigation(pendingAction || state.historyAction, state.navigation.location, {
        overrideNavigation: state.navigation,
        // Proxy through any rending view transition
        enableViewTransition: pendingViewTransitionEnabled === true
      });
    }
    async function startNavigation(historyAction, location2, opts) {
      pendingNavigationController && pendingNavigationController.abort();
      pendingNavigationController = null;
      pendingAction = historyAction;
      isUninterruptedRevalidation = (opts && opts.startUninterruptedRevalidation) === true;
      saveScrollPosition(state.location, state.matches);
      pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
      pendingViewTransitionEnabled = (opts && opts.enableViewTransition) === true;
      let routesToUse = inFlightDataRoutes || dataRoutes;
      let loadingNavigation = opts && opts.overrideNavigation;
      let matches = opts != null && opts.initialHydration && state.matches && state.matches.length > 0 && !initialMatchesIsFOW ? (
        // `matchRoutes()` has already been called if we're in here via `router.initialize()`
        state.matches
      ) : matchRoutes(routesToUse, location2, basename);
      let flushSync = (opts && opts.flushSync) === true;
      if (matches && state.initialized && !isRevalidationRequired && isHashChangeOnly(state.location, location2) && !(opts && opts.submission && isMutationMethod(opts.submission.formMethod))) {
        completeNavigation(location2, {
          matches
        }, {
          flushSync
        });
        return;
      }
      let fogOfWar = checkFogOfWar(matches, routesToUse, location2.pathname);
      if (fogOfWar.active && fogOfWar.matches) {
        matches = fogOfWar.matches;
      }
      if (!matches) {
        let {
          error,
          notFoundMatches,
          route
        } = handleNavigational404(location2.pathname);
        completeNavigation(location2, {
          matches: notFoundMatches,
          loaderData: {},
          errors: {
            [route.id]: error
          }
        }, {
          flushSync
        });
        return;
      }
      pendingNavigationController = new AbortController();
      let request = createClientSideRequest(init.history, location2, pendingNavigationController.signal, opts && opts.submission);
      let pendingActionResult;
      if (opts && opts.pendingError) {
        pendingActionResult = [findNearestBoundary(matches).route.id, {
          type: ResultType.error,
          error: opts.pendingError
        }];
      } else if (opts && opts.submission && isMutationMethod(opts.submission.formMethod)) {
        let actionResult = await handleAction(request, location2, opts.submission, matches, fogOfWar.active, {
          replace: opts.replace,
          flushSync
        });
        if (actionResult.shortCircuited) {
          return;
        }
        if (actionResult.pendingActionResult) {
          let [routeId, result] = actionResult.pendingActionResult;
          if (isErrorResult(result) && isRouteErrorResponse(result.error) && result.error.status === 404) {
            pendingNavigationController = null;
            completeNavigation(location2, {
              matches: actionResult.matches,
              loaderData: {},
              errors: {
                [routeId]: result.error
              }
            });
            return;
          }
        }
        matches = actionResult.matches || matches;
        pendingActionResult = actionResult.pendingActionResult;
        loadingNavigation = getLoadingNavigation(location2, opts.submission);
        flushSync = false;
        fogOfWar.active = false;
        request = createClientSideRequest(init.history, request.url, request.signal);
      }
      let {
        shortCircuited,
        matches: updatedMatches,
        loaderData,
        errors
      } = await handleLoaders(request, location2, matches, fogOfWar.active, loadingNavigation, opts && opts.submission, opts && opts.fetcherSubmission, opts && opts.replace, opts && opts.initialHydration === true, flushSync, pendingActionResult);
      if (shortCircuited) {
        return;
      }
      pendingNavigationController = null;
      completeNavigation(location2, _extends({
        matches: updatedMatches || matches
      }, getActionDataForCommit(pendingActionResult), {
        loaderData,
        errors
      }));
    }
    async function handleAction(request, location2, submission, matches, isFogOfWar, opts) {
      if (opts === void 0) {
        opts = {};
      }
      interruptActiveLoads();
      let navigation = getSubmittingNavigation(location2, submission);
      updateState({
        navigation
      }, {
        flushSync: opts.flushSync === true
      });
      if (isFogOfWar) {
        let discoverResult = await discoverRoutes(matches, location2.pathname, request.signal);
        if (discoverResult.type === "aborted") {
          return {
            shortCircuited: true
          };
        } else if (discoverResult.type === "error") {
          let boundaryId = findNearestBoundary(discoverResult.partialMatches).route.id;
          return {
            matches: discoverResult.partialMatches,
            pendingActionResult: [boundaryId, {
              type: ResultType.error,
              error: discoverResult.error
            }]
          };
        } else if (!discoverResult.matches) {
          let {
            notFoundMatches,
            error,
            route
          } = handleNavigational404(location2.pathname);
          return {
            matches: notFoundMatches,
            pendingActionResult: [route.id, {
              type: ResultType.error,
              error
            }]
          };
        } else {
          matches = discoverResult.matches;
        }
      }
      let result;
      let actionMatch = getTargetMatch(matches, location2);
      if (!actionMatch.route.action && !actionMatch.route.lazy) {
        result = {
          type: ResultType.error,
          error: getInternalRouterError(405, {
            method: request.method,
            pathname: location2.pathname,
            routeId: actionMatch.route.id
          })
        };
      } else {
        let results = await callDataStrategy("action", state, request, [actionMatch], matches, null);
        result = results[actionMatch.route.id];
        if (request.signal.aborted) {
          return {
            shortCircuited: true
          };
        }
      }
      if (isRedirectResult(result)) {
        let replace2;
        if (opts && opts.replace != null) {
          replace2 = opts.replace;
        } else {
          let location3 = normalizeRedirectLocation(result.response.headers.get("Location"), new URL(request.url), basename, init.history);
          replace2 = location3 === state.location.pathname + state.location.search;
        }
        await startRedirectNavigation(request, result, true, {
          submission,
          replace: replace2
        });
        return {
          shortCircuited: true
        };
      }
      if (isDeferredResult(result)) {
        throw getInternalRouterError(400, {
          type: "defer-action"
        });
      }
      if (isErrorResult(result)) {
        let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
        if ((opts && opts.replace) !== true) {
          pendingAction = Action.Push;
        }
        return {
          matches,
          pendingActionResult: [boundaryMatch.route.id, result]
        };
      }
      return {
        matches,
        pendingActionResult: [actionMatch.route.id, result]
      };
    }
    async function handleLoaders(request, location2, matches, isFogOfWar, overrideNavigation, submission, fetcherSubmission, replace2, initialHydration, flushSync, pendingActionResult) {
      let loadingNavigation = overrideNavigation || getLoadingNavigation(location2, submission);
      let activeSubmission = submission || fetcherSubmission || getSubmissionFromNavigation(loadingNavigation);
      let shouldUpdateNavigationState = !isUninterruptedRevalidation && (!future.v7_partialHydration || !initialHydration);
      if (isFogOfWar) {
        if (shouldUpdateNavigationState) {
          let actionData = getUpdatedActionData(pendingActionResult);
          updateState(_extends({
            navigation: loadingNavigation
          }, actionData !== void 0 ? {
            actionData
          } : {}), {
            flushSync
          });
        }
        let discoverResult = await discoverRoutes(matches, location2.pathname, request.signal);
        if (discoverResult.type === "aborted") {
          return {
            shortCircuited: true
          };
        } else if (discoverResult.type === "error") {
          let boundaryId = findNearestBoundary(discoverResult.partialMatches).route.id;
          return {
            matches: discoverResult.partialMatches,
            loaderData: {},
            errors: {
              [boundaryId]: discoverResult.error
            }
          };
        } else if (!discoverResult.matches) {
          let {
            error,
            notFoundMatches,
            route
          } = handleNavigational404(location2.pathname);
          return {
            matches: notFoundMatches,
            loaderData: {},
            errors: {
              [route.id]: error
            }
          };
        } else {
          matches = discoverResult.matches;
        }
      }
      let routesToUse = inFlightDataRoutes || dataRoutes;
      let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, activeSubmission, location2, future.v7_partialHydration && initialHydration === true, future.v7_skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionResult);
      cancelActiveDeferreds((routeId) => !(matches && matches.some((m) => m.route.id === routeId)) || matchesToLoad && matchesToLoad.some((m) => m.route.id === routeId));
      pendingNavigationLoadId = ++incrementingLoadId;
      if (matchesToLoad.length === 0 && revalidatingFetchers.length === 0) {
        let updatedFetchers2 = markFetchRedirectsDone();
        completeNavigation(location2, _extends({
          matches,
          loaderData: {},
          // Commit pending error if we're short circuiting
          errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? {
            [pendingActionResult[0]]: pendingActionResult[1].error
          } : null
        }, getActionDataForCommit(pendingActionResult), updatedFetchers2 ? {
          fetchers: new Map(state.fetchers)
        } : {}), {
          flushSync
        });
        return {
          shortCircuited: true
        };
      }
      if (shouldUpdateNavigationState) {
        let updates = {};
        if (!isFogOfWar) {
          updates.navigation = loadingNavigation;
          let actionData = getUpdatedActionData(pendingActionResult);
          if (actionData !== void 0) {
            updates.actionData = actionData;
          }
        }
        if (revalidatingFetchers.length > 0) {
          updates.fetchers = getUpdatedRevalidatingFetchers(revalidatingFetchers);
        }
        updateState(updates, {
          flushSync
        });
      }
      revalidatingFetchers.forEach((rf) => {
        abortFetcher(rf.key);
        if (rf.controller) {
          fetchControllers.set(rf.key, rf.controller);
        }
      });
      let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach((f) => abortFetcher(f.key));
      if (pendingNavigationController) {
        pendingNavigationController.signal.addEventListener("abort", abortPendingFetchRevalidations);
      }
      let {
        loaderResults,
        fetcherResults
      } = await callLoadersAndMaybeResolveData(state, matches, matchesToLoad, revalidatingFetchers, request);
      if (request.signal.aborted) {
        return {
          shortCircuited: true
        };
      }
      if (pendingNavigationController) {
        pendingNavigationController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
      }
      revalidatingFetchers.forEach((rf) => fetchControllers.delete(rf.key));
      let redirect3 = findRedirect(loaderResults);
      if (redirect3) {
        await startRedirectNavigation(request, redirect3.result, true, {
          replace: replace2
        });
        return {
          shortCircuited: true
        };
      }
      redirect3 = findRedirect(fetcherResults);
      if (redirect3) {
        fetchRedirectIds.add(redirect3.key);
        await startRedirectNavigation(request, redirect3.result, true, {
          replace: replace2
        });
        return {
          shortCircuited: true
        };
      }
      let {
        loaderData,
        errors
      } = processLoaderData(state, matches, loaderResults, pendingActionResult, revalidatingFetchers, fetcherResults, activeDeferreds);
      activeDeferreds.forEach((deferredData, routeId) => {
        deferredData.subscribe((aborted) => {
          if (aborted || deferredData.done) {
            activeDeferreds.delete(routeId);
          }
        });
      });
      if (future.v7_partialHydration && initialHydration && state.errors) {
        errors = _extends({}, state.errors, errors);
      }
      let updatedFetchers = markFetchRedirectsDone();
      let didAbortFetchLoads = abortStaleFetchLoads(pendingNavigationLoadId);
      let shouldUpdateFetchers = updatedFetchers || didAbortFetchLoads || revalidatingFetchers.length > 0;
      return _extends({
        matches,
        loaderData,
        errors
      }, shouldUpdateFetchers ? {
        fetchers: new Map(state.fetchers)
      } : {});
    }
    function getUpdatedActionData(pendingActionResult) {
      if (pendingActionResult && !isErrorResult(pendingActionResult[1])) {
        return {
          [pendingActionResult[0]]: pendingActionResult[1].data
        };
      } else if (state.actionData) {
        if (Object.keys(state.actionData).length === 0) {
          return null;
        } else {
          return state.actionData;
        }
      }
    }
    function getUpdatedRevalidatingFetchers(revalidatingFetchers) {
      revalidatingFetchers.forEach((rf) => {
        let fetcher = state.fetchers.get(rf.key);
        let revalidatingFetcher = getLoadingFetcher(void 0, fetcher ? fetcher.data : void 0);
        state.fetchers.set(rf.key, revalidatingFetcher);
      });
      return new Map(state.fetchers);
    }
    function fetch(key, routeId, href, opts) {
      if (isServer) {
        throw new Error("router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback.");
      }
      abortFetcher(key);
      let flushSync = (opts && opts.flushSync) === true;
      let routesToUse = inFlightDataRoutes || dataRoutes;
      let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, href, future.v7_relativeSplatPath, routeId, opts == null ? void 0 : opts.relative);
      let matches = matchRoutes(routesToUse, normalizedPath, basename);
      let fogOfWar = checkFogOfWar(matches, routesToUse, normalizedPath);
      if (fogOfWar.active && fogOfWar.matches) {
        matches = fogOfWar.matches;
      }
      if (!matches) {
        setFetcherError(key, routeId, getInternalRouterError(404, {
          pathname: normalizedPath
        }), {
          flushSync
        });
        return;
      }
      let {
        path,
        submission,
        error
      } = normalizeNavigateOptions(future.v7_normalizeFormMethod, true, normalizedPath, opts);
      if (error) {
        setFetcherError(key, routeId, error, {
          flushSync
        });
        return;
      }
      let match = getTargetMatch(matches, path);
      let preventScrollReset = (opts && opts.preventScrollReset) === true;
      if (submission && isMutationMethod(submission.formMethod)) {
        handleFetcherAction(key, routeId, path, match, matches, fogOfWar.active, flushSync, preventScrollReset, submission);
        return;
      }
      fetchLoadMatches.set(key, {
        routeId,
        path
      });
      handleFetcherLoader(key, routeId, path, match, matches, fogOfWar.active, flushSync, preventScrollReset, submission);
    }
    async function handleFetcherAction(key, routeId, path, match, requestMatches, isFogOfWar, flushSync, preventScrollReset, submission) {
      interruptActiveLoads();
      fetchLoadMatches.delete(key);
      function detectAndHandle405Error(m) {
        if (!m.route.action && !m.route.lazy) {
          let error = getInternalRouterError(405, {
            method: submission.formMethod,
            pathname: path,
            routeId
          });
          setFetcherError(key, routeId, error, {
            flushSync
          });
          return true;
        }
        return false;
      }
      if (!isFogOfWar && detectAndHandle405Error(match)) {
        return;
      }
      let existingFetcher = state.fetchers.get(key);
      updateFetcherState(key, getSubmittingFetcher(submission, existingFetcher), {
        flushSync
      });
      let abortController = new AbortController();
      let fetchRequest = createClientSideRequest(init.history, path, abortController.signal, submission);
      if (isFogOfWar) {
        let discoverResult = await discoverRoutes(requestMatches, new URL(fetchRequest.url).pathname, fetchRequest.signal, key);
        if (discoverResult.type === "aborted") {
          return;
        } else if (discoverResult.type === "error") {
          setFetcherError(key, routeId, discoverResult.error, {
            flushSync
          });
          return;
        } else if (!discoverResult.matches) {
          setFetcherError(key, routeId, getInternalRouterError(404, {
            pathname: path
          }), {
            flushSync
          });
          return;
        } else {
          requestMatches = discoverResult.matches;
          match = getTargetMatch(requestMatches, path);
          if (detectAndHandle405Error(match)) {
            return;
          }
        }
      }
      fetchControllers.set(key, abortController);
      let originatingLoadId = incrementingLoadId;
      let actionResults = await callDataStrategy("action", state, fetchRequest, [match], requestMatches, key);
      let actionResult = actionResults[match.route.id];
      if (fetchRequest.signal.aborted) {
        if (fetchControllers.get(key) === abortController) {
          fetchControllers.delete(key);
        }
        return;
      }
      if (future.v7_fetcherPersist && deletedFetchers.has(key)) {
        if (isRedirectResult(actionResult) || isErrorResult(actionResult)) {
          updateFetcherState(key, getDoneFetcher(void 0));
          return;
        }
      } else {
        if (isRedirectResult(actionResult)) {
          fetchControllers.delete(key);
          if (pendingNavigationLoadId > originatingLoadId) {
            updateFetcherState(key, getDoneFetcher(void 0));
            return;
          } else {
            fetchRedirectIds.add(key);
            updateFetcherState(key, getLoadingFetcher(submission));
            return startRedirectNavigation(fetchRequest, actionResult, false, {
              fetcherSubmission: submission,
              preventScrollReset
            });
          }
        }
        if (isErrorResult(actionResult)) {
          setFetcherError(key, routeId, actionResult.error);
          return;
        }
      }
      if (isDeferredResult(actionResult)) {
        throw getInternalRouterError(400, {
          type: "defer-action"
        });
      }
      let nextLocation = state.navigation.location || state.location;
      let revalidationRequest = createClientSideRequest(init.history, nextLocation, abortController.signal);
      let routesToUse = inFlightDataRoutes || dataRoutes;
      let matches = state.navigation.state !== "idle" ? matchRoutes(routesToUse, state.navigation.location, basename) : state.matches;
      invariant(matches, "Didn't find any matches after fetcher action");
      let loadId = ++incrementingLoadId;
      fetchReloadIds.set(key, loadId);
      let loadFetcher = getLoadingFetcher(submission, actionResult.data);
      state.fetchers.set(key, loadFetcher);
      let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, submission, nextLocation, false, future.v7_skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, [match.route.id, actionResult]);
      revalidatingFetchers.filter((rf) => rf.key !== key).forEach((rf) => {
        let staleKey = rf.key;
        let existingFetcher2 = state.fetchers.get(staleKey);
        let revalidatingFetcher = getLoadingFetcher(void 0, existingFetcher2 ? existingFetcher2.data : void 0);
        state.fetchers.set(staleKey, revalidatingFetcher);
        abortFetcher(staleKey);
        if (rf.controller) {
          fetchControllers.set(staleKey, rf.controller);
        }
      });
      updateState({
        fetchers: new Map(state.fetchers)
      });
      let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach((rf) => abortFetcher(rf.key));
      abortController.signal.addEventListener("abort", abortPendingFetchRevalidations);
      let {
        loaderResults,
        fetcherResults
      } = await callLoadersAndMaybeResolveData(state, matches, matchesToLoad, revalidatingFetchers, revalidationRequest);
      if (abortController.signal.aborted) {
        return;
      }
      abortController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
      fetchReloadIds.delete(key);
      fetchControllers.delete(key);
      revalidatingFetchers.forEach((r2) => fetchControllers.delete(r2.key));
      let redirect3 = findRedirect(loaderResults);
      if (redirect3) {
        return startRedirectNavigation(revalidationRequest, redirect3.result, false, {
          preventScrollReset
        });
      }
      redirect3 = findRedirect(fetcherResults);
      if (redirect3) {
        fetchRedirectIds.add(redirect3.key);
        return startRedirectNavigation(revalidationRequest, redirect3.result, false, {
          preventScrollReset
        });
      }
      let {
        loaderData,
        errors
      } = processLoaderData(state, matches, loaderResults, void 0, revalidatingFetchers, fetcherResults, activeDeferreds);
      if (state.fetchers.has(key)) {
        let doneFetcher = getDoneFetcher(actionResult.data);
        state.fetchers.set(key, doneFetcher);
      }
      abortStaleFetchLoads(loadId);
      if (state.navigation.state === "loading" && loadId > pendingNavigationLoadId) {
        invariant(pendingAction, "Expected pending action");
        pendingNavigationController && pendingNavigationController.abort();
        completeNavigation(state.navigation.location, {
          matches,
          loaderData,
          errors,
          fetchers: new Map(state.fetchers)
        });
      } else {
        updateState({
          errors,
          loaderData: mergeLoaderData(state.loaderData, loaderData, matches, errors),
          fetchers: new Map(state.fetchers)
        });
        isRevalidationRequired = false;
      }
    }
    async function handleFetcherLoader(key, routeId, path, match, matches, isFogOfWar, flushSync, preventScrollReset, submission) {
      let existingFetcher = state.fetchers.get(key);
      updateFetcherState(key, getLoadingFetcher(submission, existingFetcher ? existingFetcher.data : void 0), {
        flushSync
      });
      let abortController = new AbortController();
      let fetchRequest = createClientSideRequest(init.history, path, abortController.signal);
      if (isFogOfWar) {
        let discoverResult = await discoverRoutes(matches, new URL(fetchRequest.url).pathname, fetchRequest.signal, key);
        if (discoverResult.type === "aborted") {
          return;
        } else if (discoverResult.type === "error") {
          setFetcherError(key, routeId, discoverResult.error, {
            flushSync
          });
          return;
        } else if (!discoverResult.matches) {
          setFetcherError(key, routeId, getInternalRouterError(404, {
            pathname: path
          }), {
            flushSync
          });
          return;
        } else {
          matches = discoverResult.matches;
          match = getTargetMatch(matches, path);
        }
      }
      fetchControllers.set(key, abortController);
      let originatingLoadId = incrementingLoadId;
      let results = await callDataStrategy("loader", state, fetchRequest, [match], matches, key);
      let result = results[match.route.id];
      if (isDeferredResult(result)) {
        result = await resolveDeferredData(result, fetchRequest.signal, true) || result;
      }
      if (fetchControllers.get(key) === abortController) {
        fetchControllers.delete(key);
      }
      if (fetchRequest.signal.aborted) {
        return;
      }
      if (deletedFetchers.has(key)) {
        updateFetcherState(key, getDoneFetcher(void 0));
        return;
      }
      if (isRedirectResult(result)) {
        if (pendingNavigationLoadId > originatingLoadId) {
          updateFetcherState(key, getDoneFetcher(void 0));
          return;
        } else {
          fetchRedirectIds.add(key);
          await startRedirectNavigation(fetchRequest, result, false, {
            preventScrollReset
          });
          return;
        }
      }
      if (isErrorResult(result)) {
        setFetcherError(key, routeId, result.error);
        return;
      }
      invariant(!isDeferredResult(result), "Unhandled fetcher deferred data");
      updateFetcherState(key, getDoneFetcher(result.data));
    }
    async function startRedirectNavigation(request, redirect3, isNavigation, _temp2) {
      let {
        submission,
        fetcherSubmission,
        preventScrollReset,
        replace: replace2
      } = _temp2 === void 0 ? {} : _temp2;
      if (redirect3.response.headers.has("X-Remix-Revalidate")) {
        isRevalidationRequired = true;
      }
      let location2 = redirect3.response.headers.get("Location");
      invariant(location2, "Expected a Location header on the redirect Response");
      location2 = normalizeRedirectLocation(location2, new URL(request.url), basename, init.history);
      let redirectLocation = createLocation(state.location, location2, {
        _isRedirect: true
      });
      if (isBrowser2) {
        let isDocumentReload = false;
        if (redirect3.response.headers.has("X-Remix-Reload-Document")) {
          isDocumentReload = true;
        } else if (ABSOLUTE_URL_REGEX.test(location2)) {
          const url = init.history.createURL(location2);
          isDocumentReload = // Hard reload if it's an absolute URL to a new origin
          url.origin !== routerWindow.location.origin || // Hard reload if it's an absolute URL that does not match our basename
          stripBasename(url.pathname, basename) == null;
        }
        if (isDocumentReload) {
          if (replace2) {
            routerWindow.location.replace(location2);
          } else {
            routerWindow.location.assign(location2);
          }
          return;
        }
      }
      pendingNavigationController = null;
      let redirectHistoryAction = replace2 === true || redirect3.response.headers.has("X-Remix-Replace") ? Action.Replace : Action.Push;
      let {
        formMethod,
        formAction,
        formEncType
      } = state.navigation;
      if (!submission && !fetcherSubmission && formMethod && formAction && formEncType) {
        submission = getSubmissionFromNavigation(state.navigation);
      }
      let activeSubmission = submission || fetcherSubmission;
      if (redirectPreserveMethodStatusCodes.has(redirect3.response.status) && activeSubmission && isMutationMethod(activeSubmission.formMethod)) {
        await startNavigation(redirectHistoryAction, redirectLocation, {
          submission: _extends({}, activeSubmission, {
            formAction: location2
          }),
          // Preserve these flags across redirects
          preventScrollReset: preventScrollReset || pendingPreventScrollReset,
          enableViewTransition: isNavigation ? pendingViewTransitionEnabled : void 0
        });
      } else {
        let overrideNavigation = getLoadingNavigation(redirectLocation, submission);
        await startNavigation(redirectHistoryAction, redirectLocation, {
          overrideNavigation,
          // Send fetcher submissions through for shouldRevalidate
          fetcherSubmission,
          // Preserve these flags across redirects
          preventScrollReset: preventScrollReset || pendingPreventScrollReset,
          enableViewTransition: isNavigation ? pendingViewTransitionEnabled : void 0
        });
      }
    }
    async function callDataStrategy(type, state2, request, matchesToLoad, matches, fetcherKey) {
      let results;
      let dataResults = {};
      try {
        results = await callDataStrategyImpl(dataStrategyImpl, type, state2, request, matchesToLoad, matches, fetcherKey, manifest, mapRouteProperties2);
      } catch (e) {
        matchesToLoad.forEach((m) => {
          dataResults[m.route.id] = {
            type: ResultType.error,
            error: e
          };
        });
        return dataResults;
      }
      for (let [routeId, result] of Object.entries(results)) {
        if (isRedirectDataStrategyResultResult(result)) {
          let response = result.result;
          dataResults[routeId] = {
            type: ResultType.redirect,
            response: normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename, future.v7_relativeSplatPath)
          };
        } else {
          dataResults[routeId] = await convertDataStrategyResultToDataResult(result);
        }
      }
      return dataResults;
    }
    async function callLoadersAndMaybeResolveData(state2, matches, matchesToLoad, fetchersToLoad, request) {
      let currentMatches = state2.matches;
      let loaderResultsPromise = callDataStrategy("loader", state2, request, matchesToLoad, matches, null);
      let fetcherResultsPromise = Promise.all(fetchersToLoad.map(async (f) => {
        if (f.matches && f.match && f.controller) {
          let results = await callDataStrategy("loader", state2, createClientSideRequest(init.history, f.path, f.controller.signal), [f.match], f.matches, f.key);
          let result = results[f.match.route.id];
          return {
            [f.key]: result
          };
        } else {
          return Promise.resolve({
            [f.key]: {
              type: ResultType.error,
              error: getInternalRouterError(404, {
                pathname: f.path
              })
            }
          });
        }
      }));
      let loaderResults = await loaderResultsPromise;
      let fetcherResults = (await fetcherResultsPromise).reduce((acc, r2) => Object.assign(acc, r2), {});
      await Promise.all([resolveNavigationDeferredResults(matches, loaderResults, request.signal, currentMatches, state2.loaderData), resolveFetcherDeferredResults(matches, fetcherResults, fetchersToLoad)]);
      return {
        loaderResults,
        fetcherResults
      };
    }
    function interruptActiveLoads() {
      isRevalidationRequired = true;
      cancelledDeferredRoutes.push(...cancelActiveDeferreds());
      fetchLoadMatches.forEach((_, key) => {
        if (fetchControllers.has(key)) {
          cancelledFetcherLoads.add(key);
        }
        abortFetcher(key);
      });
    }
    function updateFetcherState(key, fetcher, opts) {
      if (opts === void 0) {
        opts = {};
      }
      state.fetchers.set(key, fetcher);
      updateState({
        fetchers: new Map(state.fetchers)
      }, {
        flushSync: (opts && opts.flushSync) === true
      });
    }
    function setFetcherError(key, routeId, error, opts) {
      if (opts === void 0) {
        opts = {};
      }
      let boundaryMatch = findNearestBoundary(state.matches, routeId);
      deleteFetcher(key);
      updateState({
        errors: {
          [boundaryMatch.route.id]: error
        },
        fetchers: new Map(state.fetchers)
      }, {
        flushSync: (opts && opts.flushSync) === true
      });
    }
    function getFetcher(key) {
      activeFetchers.set(key, (activeFetchers.get(key) || 0) + 1);
      if (deletedFetchers.has(key)) {
        deletedFetchers.delete(key);
      }
      return state.fetchers.get(key) || IDLE_FETCHER;
    }
    function deleteFetcher(key) {
      let fetcher = state.fetchers.get(key);
      if (fetchControllers.has(key) && !(fetcher && fetcher.state === "loading" && fetchReloadIds.has(key))) {
        abortFetcher(key);
      }
      fetchLoadMatches.delete(key);
      fetchReloadIds.delete(key);
      fetchRedirectIds.delete(key);
      if (future.v7_fetcherPersist) {
        deletedFetchers.delete(key);
      }
      cancelledFetcherLoads.delete(key);
      state.fetchers.delete(key);
    }
    function deleteFetcherAndUpdateState(key) {
      let count = (activeFetchers.get(key) || 0) - 1;
      if (count <= 0) {
        activeFetchers.delete(key);
        deletedFetchers.add(key);
        if (!future.v7_fetcherPersist) {
          deleteFetcher(key);
        }
      } else {
        activeFetchers.set(key, count);
      }
      updateState({
        fetchers: new Map(state.fetchers)
      });
    }
    function abortFetcher(key) {
      let controller = fetchControllers.get(key);
      if (controller) {
        controller.abort();
        fetchControllers.delete(key);
      }
    }
    function markFetchersDone(keys) {
      for (let key of keys) {
        let fetcher = getFetcher(key);
        let doneFetcher = getDoneFetcher(fetcher.data);
        state.fetchers.set(key, doneFetcher);
      }
    }
    function markFetchRedirectsDone() {
      let doneKeys = [];
      let updatedFetchers = false;
      for (let key of fetchRedirectIds) {
        let fetcher = state.fetchers.get(key);
        invariant(fetcher, "Expected fetcher: " + key);
        if (fetcher.state === "loading") {
          fetchRedirectIds.delete(key);
          doneKeys.push(key);
          updatedFetchers = true;
        }
      }
      markFetchersDone(doneKeys);
      return updatedFetchers;
    }
    function abortStaleFetchLoads(landedId) {
      let yeetedKeys = [];
      for (let [key, id] of fetchReloadIds) {
        if (id < landedId) {
          let fetcher = state.fetchers.get(key);
          invariant(fetcher, "Expected fetcher: " + key);
          if (fetcher.state === "loading") {
            abortFetcher(key);
            fetchReloadIds.delete(key);
            yeetedKeys.push(key);
          }
        }
      }
      markFetchersDone(yeetedKeys);
      return yeetedKeys.length > 0;
    }
    function getBlocker(key, fn) {
      let blocker = state.blockers.get(key) || IDLE_BLOCKER;
      if (blockerFunctions.get(key) !== fn) {
        blockerFunctions.set(key, fn);
      }
      return blocker;
    }
    function deleteBlocker(key) {
      state.blockers.delete(key);
      blockerFunctions.delete(key);
    }
    function updateBlocker(key, newBlocker) {
      let blocker = state.blockers.get(key) || IDLE_BLOCKER;
      invariant(blocker.state === "unblocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "proceeding" || blocker.state === "blocked" && newBlocker.state === "unblocked" || blocker.state === "proceeding" && newBlocker.state === "unblocked", "Invalid blocker state transition: " + blocker.state + " -> " + newBlocker.state);
      let blockers = new Map(state.blockers);
      blockers.set(key, newBlocker);
      updateState({
        blockers
      });
    }
    function shouldBlockNavigation(_ref2) {
      let {
        currentLocation,
        nextLocation,
        historyAction
      } = _ref2;
      if (blockerFunctions.size === 0) {
        return;
      }
      if (blockerFunctions.size > 1) {
        warning(false, "A router only supports one blocker at a time");
      }
      let entries = Array.from(blockerFunctions.entries());
      let [blockerKey, blockerFunction] = entries[entries.length - 1];
      let blocker = state.blockers.get(blockerKey);
      if (blocker && blocker.state === "proceeding") {
        return;
      }
      if (blockerFunction({
        currentLocation,
        nextLocation,
        historyAction
      })) {
        return blockerKey;
      }
    }
    function handleNavigational404(pathname) {
      let error = getInternalRouterError(404, {
        pathname
      });
      let routesToUse = inFlightDataRoutes || dataRoutes;
      let {
        matches,
        route
      } = getShortCircuitMatches(routesToUse);
      cancelActiveDeferreds();
      return {
        notFoundMatches: matches,
        route,
        error
      };
    }
    function cancelActiveDeferreds(predicate) {
      let cancelledRouteIds = [];
      activeDeferreds.forEach((dfd, routeId) => {
        if (!predicate || predicate(routeId)) {
          dfd.cancel();
          cancelledRouteIds.push(routeId);
          activeDeferreds.delete(routeId);
        }
      });
      return cancelledRouteIds;
    }
    function enableScrollRestoration(positions, getPosition, getKey) {
      savedScrollPositions2 = positions;
      getScrollPosition = getPosition;
      getScrollRestorationKey = getKey || null;
      if (!initialScrollRestored && state.navigation === IDLE_NAVIGATION) {
        initialScrollRestored = true;
        let y = getSavedScrollPosition(state.location, state.matches);
        if (y != null) {
          updateState({
            restoreScrollPosition: y
          });
        }
      }
      return () => {
        savedScrollPositions2 = null;
        getScrollPosition = null;
        getScrollRestorationKey = null;
      };
    }
    function getScrollKey(location2, matches) {
      if (getScrollRestorationKey) {
        let key = getScrollRestorationKey(location2, matches.map((m) => convertRouteMatchToUiMatch(m, state.loaderData)));
        return key || location2.key;
      }
      return location2.key;
    }
    function saveScrollPosition(location2, matches) {
      if (savedScrollPositions2 && getScrollPosition) {
        let key = getScrollKey(location2, matches);
        savedScrollPositions2[key] = getScrollPosition();
      }
    }
    function getSavedScrollPosition(location2, matches) {
      if (savedScrollPositions2) {
        let key = getScrollKey(location2, matches);
        let y = savedScrollPositions2[key];
        if (typeof y === "number") {
          return y;
        }
      }
      return null;
    }
    function checkFogOfWar(matches, routesToUse, pathname) {
      if (patchRoutesOnNavigationImpl) {
        if (!matches) {
          let fogMatches = matchRoutesImpl(routesToUse, pathname, basename, true);
          return {
            active: true,
            matches: fogMatches || []
          };
        } else {
          if (Object.keys(matches[0].params).length > 0) {
            let partialMatches = matchRoutesImpl(routesToUse, pathname, basename, true);
            return {
              active: true,
              matches: partialMatches
            };
          }
        }
      }
      return {
        active: false,
        matches: null
      };
    }
    async function discoverRoutes(matches, pathname, signal, fetcherKey) {
      if (!patchRoutesOnNavigationImpl) {
        return {
          type: "success",
          matches
        };
      }
      let partialMatches = matches;
      while (true) {
        let isNonHMR = inFlightDataRoutes == null;
        let routesToUse = inFlightDataRoutes || dataRoutes;
        let localManifest = manifest;
        try {
          await patchRoutesOnNavigationImpl({
            signal,
            path: pathname,
            matches: partialMatches,
            fetcherKey,
            patch: (routeId, children) => {
              if (signal.aborted) return;
              patchRoutesImpl(routeId, children, routesToUse, localManifest, mapRouteProperties2);
            }
          });
        } catch (e) {
          return {
            type: "error",
            error: e,
            partialMatches
          };
        } finally {
          if (isNonHMR && !signal.aborted) {
            dataRoutes = [...dataRoutes];
          }
        }
        if (signal.aborted) {
          return {
            type: "aborted"
          };
        }
        let newMatches = matchRoutes(routesToUse, pathname, basename);
        if (newMatches) {
          return {
            type: "success",
            matches: newMatches
          };
        }
        let newPartialMatches = matchRoutesImpl(routesToUse, pathname, basename, true);
        if (!newPartialMatches || partialMatches.length === newPartialMatches.length && partialMatches.every((m, i) => m.route.id === newPartialMatches[i].route.id)) {
          return {
            type: "success",
            matches: null
          };
        }
        partialMatches = newPartialMatches;
      }
    }
    function _internalSetRoutes(newRoutes) {
      manifest = {};
      inFlightDataRoutes = convertRoutesToDataRoutes(newRoutes, mapRouteProperties2, void 0, manifest);
    }
    function patchRoutes(routeId, children) {
      let isNonHMR = inFlightDataRoutes == null;
      let routesToUse = inFlightDataRoutes || dataRoutes;
      patchRoutesImpl(routeId, children, routesToUse, manifest, mapRouteProperties2);
      if (isNonHMR) {
        dataRoutes = [...dataRoutes];
        updateState({});
      }
    }
    router = {
      get basename() {
        return basename;
      },
      get future() {
        return future;
      },
      get state() {
        return state;
      },
      get routes() {
        return dataRoutes;
      },
      get window() {
        return routerWindow;
      },
      initialize,
      subscribe,
      enableScrollRestoration,
      navigate,
      fetch,
      revalidate,
      // Passthrough to history-aware createHref used by useHref so we get proper
      // hash-aware URLs in DOM paths
      createHref: (to) => init.history.createHref(to),
      encodeLocation: (to) => init.history.encodeLocation(to),
      getFetcher,
      deleteFetcher: deleteFetcherAndUpdateState,
      dispose,
      getBlocker,
      deleteBlocker,
      patchRoutes,
      _internalFetchControllers: fetchControllers,
      _internalActiveDeferreds: activeDeferreds,
      // TODO: Remove setRoutes, it's temporary to avoid dealing with
      // updating the tree while validating the update algorithm.
      _internalSetRoutes
    };
    return router;
  }
  function isSubmissionNavigation(opts) {
    return opts != null && ("formData" in opts && opts.formData != null || "body" in opts && opts.body !== void 0);
  }
  function normalizeTo(location2, matches, basename, prependBasename, to, v7_relativeSplatPath, fromRouteId, relative) {
    let contextualMatches;
    let activeRouteMatch;
    if (fromRouteId) {
      contextualMatches = [];
      for (let match of matches) {
        contextualMatches.push(match);
        if (match.route.id === fromRouteId) {
          activeRouteMatch = match;
          break;
        }
      }
    } else {
      contextualMatches = matches;
      activeRouteMatch = matches[matches.length - 1];
    }
    let path = resolveTo(to ? to : ".", getResolveToMatches(contextualMatches, v7_relativeSplatPath), stripBasename(location2.pathname, basename) || location2.pathname, relative === "path");
    if (to == null) {
      path.search = location2.search;
      path.hash = location2.hash;
    }
    if ((to == null || to === "" || to === ".") && activeRouteMatch) {
      let nakedIndex = hasNakedIndexQuery(path.search);
      if (activeRouteMatch.route.index && !nakedIndex) {
        path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
      } else if (!activeRouteMatch.route.index && nakedIndex) {
        let params = new URLSearchParams(path.search);
        let indexValues = params.getAll("index");
        params.delete("index");
        indexValues.filter((v) => v).forEach((v) => params.append("index", v));
        let qs = params.toString();
        path.search = qs ? "?" + qs : "";
      }
    }
    if (prependBasename && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    return createPath(path);
  }
  function normalizeNavigateOptions(normalizeFormMethod, isFetcher, path, opts) {
    if (!opts || !isSubmissionNavigation(opts)) {
      return {
        path
      };
    }
    if (opts.formMethod && !isValidMethod(opts.formMethod)) {
      return {
        path,
        error: getInternalRouterError(405, {
          method: opts.formMethod
        })
      };
    }
    let getInvalidBodyError = () => ({
      path,
      error: getInternalRouterError(400, {
        type: "invalid-body"
      })
    });
    let rawFormMethod = opts.formMethod || "get";
    let formMethod = normalizeFormMethod ? rawFormMethod.toUpperCase() : rawFormMethod.toLowerCase();
    let formAction = stripHashFromPath(path);
    if (opts.body !== void 0) {
      if (opts.formEncType === "text/plain") {
        if (!isMutationMethod(formMethod)) {
          return getInvalidBodyError();
        }
        let text = typeof opts.body === "string" ? opts.body : opts.body instanceof FormData || opts.body instanceof URLSearchParams ? (
          // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
          Array.from(opts.body.entries()).reduce((acc, _ref3) => {
            let [name, value] = _ref3;
            return "" + acc + name + "=" + value + "\n";
          }, "")
        ) : String(opts.body);
        return {
          path,
          submission: {
            formMethod,
            formAction,
            formEncType: opts.formEncType,
            formData: void 0,
            json: void 0,
            text
          }
        };
      } else if (opts.formEncType === "application/json") {
        if (!isMutationMethod(formMethod)) {
          return getInvalidBodyError();
        }
        try {
          let json3 = typeof opts.body === "string" ? JSON.parse(opts.body) : opts.body;
          return {
            path,
            submission: {
              formMethod,
              formAction,
              formEncType: opts.formEncType,
              formData: void 0,
              json: json3,
              text: void 0
            }
          };
        } catch (e) {
          return getInvalidBodyError();
        }
      }
    }
    invariant(typeof FormData === "function", "FormData is not available in this environment");
    let searchParams;
    let formData;
    if (opts.formData) {
      searchParams = convertFormDataToSearchParams(opts.formData);
      formData = opts.formData;
    } else if (opts.body instanceof FormData) {
      searchParams = convertFormDataToSearchParams(opts.body);
      formData = opts.body;
    } else if (opts.body instanceof URLSearchParams) {
      searchParams = opts.body;
      formData = convertSearchParamsToFormData(searchParams);
    } else if (opts.body == null) {
      searchParams = new URLSearchParams();
      formData = new FormData();
    } else {
      try {
        searchParams = new URLSearchParams(opts.body);
        formData = convertSearchParamsToFormData(searchParams);
      } catch (e) {
        return getInvalidBodyError();
      }
    }
    let submission = {
      formMethod,
      formAction,
      formEncType: opts && opts.formEncType || "application/x-www-form-urlencoded",
      formData,
      json: void 0,
      text: void 0
    };
    if (isMutationMethod(submission.formMethod)) {
      return {
        path,
        submission
      };
    }
    let parsedPath = parsePath(path);
    if (isFetcher && parsedPath.search && hasNakedIndexQuery(parsedPath.search)) {
      searchParams.append("index", "");
    }
    parsedPath.search = "?" + searchParams;
    return {
      path: createPath(parsedPath),
      submission
    };
  }
  function getLoaderMatchesUntilBoundary(matches, boundaryId, includeBoundary) {
    if (includeBoundary === void 0) {
      includeBoundary = false;
    }
    let index = matches.findIndex((m) => m.route.id === boundaryId);
    if (index >= 0) {
      return matches.slice(0, includeBoundary ? index + 1 : index);
    }
    return matches;
  }
  function getMatchesToLoad(history, state, matches, submission, location2, initialHydration, skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionResult) {
    let actionResult = pendingActionResult ? isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : pendingActionResult[1].data : void 0;
    let currentUrl = history.createURL(state.location);
    let nextUrl = history.createURL(location2);
    let boundaryMatches = matches;
    if (initialHydration && state.errors) {
      boundaryMatches = getLoaderMatchesUntilBoundary(matches, Object.keys(state.errors)[0], true);
    } else if (pendingActionResult && isErrorResult(pendingActionResult[1])) {
      boundaryMatches = getLoaderMatchesUntilBoundary(matches, pendingActionResult[0]);
    }
    let actionStatus = pendingActionResult ? pendingActionResult[1].statusCode : void 0;
    let shouldSkipRevalidation = skipActionErrorRevalidation && actionStatus && actionStatus >= 400;
    let navigationMatches = boundaryMatches.filter((match, index) => {
      let {
        route
      } = match;
      if (route.lazy) {
        return true;
      }
      if (route.loader == null) {
        return false;
      }
      if (initialHydration) {
        return shouldLoadRouteOnHydration(route, state.loaderData, state.errors);
      }
      if (isNewLoader(state.loaderData, state.matches[index], match) || cancelledDeferredRoutes.some((id) => id === match.route.id)) {
        return true;
      }
      let currentRouteMatch = state.matches[index];
      let nextRouteMatch = match;
      return shouldRevalidateLoader(match, _extends({
        currentUrl,
        currentParams: currentRouteMatch.params,
        nextUrl,
        nextParams: nextRouteMatch.params
      }, submission, {
        actionResult,
        actionStatus,
        defaultShouldRevalidate: shouldSkipRevalidation ? false : (
          // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
          isRevalidationRequired || currentUrl.pathname + currentUrl.search === nextUrl.pathname + nextUrl.search || // Search params affect all loaders
          currentUrl.search !== nextUrl.search || isNewRouteInstance(currentRouteMatch, nextRouteMatch)
        )
      }));
    });
    let revalidatingFetchers = [];
    fetchLoadMatches.forEach((f, key) => {
      if (initialHydration || !matches.some((m) => m.route.id === f.routeId) || deletedFetchers.has(key)) {
        return;
      }
      let fetcherMatches = matchRoutes(routesToUse, f.path, basename);
      if (!fetcherMatches) {
        revalidatingFetchers.push({
          key,
          routeId: f.routeId,
          path: f.path,
          matches: null,
          match: null,
          controller: null
        });
        return;
      }
      let fetcher = state.fetchers.get(key);
      let fetcherMatch = getTargetMatch(fetcherMatches, f.path);
      let shouldRevalidate = false;
      if (fetchRedirectIds.has(key)) {
        shouldRevalidate = false;
      } else if (cancelledFetcherLoads.has(key)) {
        cancelledFetcherLoads.delete(key);
        shouldRevalidate = true;
      } else if (fetcher && fetcher.state !== "idle" && fetcher.data === void 0) {
        shouldRevalidate = isRevalidationRequired;
      } else {
        shouldRevalidate = shouldRevalidateLoader(fetcherMatch, _extends({
          currentUrl,
          currentParams: state.matches[state.matches.length - 1].params,
          nextUrl,
          nextParams: matches[matches.length - 1].params
        }, submission, {
          actionResult,
          actionStatus,
          defaultShouldRevalidate: shouldSkipRevalidation ? false : isRevalidationRequired
        }));
      }
      if (shouldRevalidate) {
        revalidatingFetchers.push({
          key,
          routeId: f.routeId,
          path: f.path,
          matches: fetcherMatches,
          match: fetcherMatch,
          controller: new AbortController()
        });
      }
    });
    return [navigationMatches, revalidatingFetchers];
  }
  function shouldLoadRouteOnHydration(route, loaderData, errors) {
    if (route.lazy) {
      return true;
    }
    if (!route.loader) {
      return false;
    }
    let hasData = loaderData != null && loaderData[route.id] !== void 0;
    let hasError = errors != null && errors[route.id] !== void 0;
    if (!hasData && hasError) {
      return false;
    }
    if (typeof route.loader === "function" && route.loader.hydrate === true) {
      return true;
    }
    return !hasData && !hasError;
  }
  function isNewLoader(currentLoaderData, currentMatch, match) {
    let isNew = (
      // [a] -> [a, b]
      !currentMatch || // [a, b] -> [a, c]
      match.route.id !== currentMatch.route.id
    );
    let isMissingData = currentLoaderData[match.route.id] === void 0;
    return isNew || isMissingData;
  }
  function isNewRouteInstance(currentMatch, match) {
    let currentPath = currentMatch.route.path;
    return (
      // param change for this match, /users/123 -> /users/456
      currentMatch.pathname !== match.pathname || // splat param changed, which is not present in match.path
      // e.g. /files/images/avatar.jpg -> files/finances.xls
      currentPath != null && currentPath.endsWith("*") && currentMatch.params["*"] !== match.params["*"]
    );
  }
  function shouldRevalidateLoader(loaderMatch, arg) {
    if (loaderMatch.route.shouldRevalidate) {
      let routeChoice = loaderMatch.route.shouldRevalidate(arg);
      if (typeof routeChoice === "boolean") {
        return routeChoice;
      }
    }
    return arg.defaultShouldRevalidate;
  }
  function patchRoutesImpl(routeId, children, routesToUse, manifest, mapRouteProperties2) {
    var _childrenToPatch;
    let childrenToPatch;
    if (routeId) {
      let route = manifest[routeId];
      invariant(route, "No route found to patch children into: routeId = " + routeId);
      if (!route.children) {
        route.children = [];
      }
      childrenToPatch = route.children;
    } else {
      childrenToPatch = routesToUse;
    }
    let uniqueChildren = children.filter((newRoute) => !childrenToPatch.some((existingRoute) => isSameRoute(newRoute, existingRoute)));
    let newRoutes = convertRoutesToDataRoutes(uniqueChildren, mapRouteProperties2, [routeId || "_", "patch", String(((_childrenToPatch = childrenToPatch) == null ? void 0 : _childrenToPatch.length) || "0")], manifest);
    childrenToPatch.push(...newRoutes);
  }
  function isSameRoute(newRoute, existingRoute) {
    if ("id" in newRoute && "id" in existingRoute && newRoute.id === existingRoute.id) {
      return true;
    }
    if (!(newRoute.index === existingRoute.index && newRoute.path === existingRoute.path && newRoute.caseSensitive === existingRoute.caseSensitive)) {
      return false;
    }
    if ((!newRoute.children || newRoute.children.length === 0) && (!existingRoute.children || existingRoute.children.length === 0)) {
      return true;
    }
    return newRoute.children.every((aChild, i) => {
      var _existingRoute$childr;
      return (_existingRoute$childr = existingRoute.children) == null ? void 0 : _existingRoute$childr.some((bChild) => isSameRoute(aChild, bChild));
    });
  }
  async function loadLazyRouteModule(route, mapRouteProperties2, manifest) {
    if (!route.lazy) {
      return;
    }
    let lazyRoute = await route.lazy();
    if (!route.lazy) {
      return;
    }
    let routeToUpdate = manifest[route.id];
    invariant(routeToUpdate, "No route found in manifest");
    let routeUpdates = {};
    for (let lazyRouteProperty in lazyRoute) {
      let staticRouteValue = routeToUpdate[lazyRouteProperty];
      let isPropertyStaticallyDefined = staticRouteValue !== void 0 && // This property isn't static since it should always be updated based
      // on the route updates
      lazyRouteProperty !== "hasErrorBoundary";
      warning(!isPropertyStaticallyDefined, 'Route "' + routeToUpdate.id + '" has a static property "' + lazyRouteProperty + '" defined but its lazy function is also returning a value for this property. ' + ('The lazy route property "' + lazyRouteProperty + '" will be ignored.'));
      if (!isPropertyStaticallyDefined && !immutableRouteKeys.has(lazyRouteProperty)) {
        routeUpdates[lazyRouteProperty] = lazyRoute[lazyRouteProperty];
      }
    }
    Object.assign(routeToUpdate, routeUpdates);
    Object.assign(routeToUpdate, _extends({}, mapRouteProperties2(routeToUpdate), {
      lazy: void 0
    }));
  }
  async function defaultDataStrategy(_ref4) {
    let {
      matches
    } = _ref4;
    let matchesToLoad = matches.filter((m) => m.shouldLoad);
    let results = await Promise.all(matchesToLoad.map((m) => m.resolve()));
    return results.reduce((acc, result, i) => Object.assign(acc, {
      [matchesToLoad[i].route.id]: result
    }), {});
  }
  async function callDataStrategyImpl(dataStrategyImpl, type, state, request, matchesToLoad, matches, fetcherKey, manifest, mapRouteProperties2, requestContext) {
    let loadRouteDefinitionsPromises = matches.map((m) => m.route.lazy ? loadLazyRouteModule(m.route, mapRouteProperties2, manifest) : void 0);
    let dsMatches = matches.map((match, i) => {
      let loadRoutePromise = loadRouteDefinitionsPromises[i];
      let shouldLoad = matchesToLoad.some((m) => m.route.id === match.route.id);
      let resolve = async (handlerOverride) => {
        if (handlerOverride && request.method === "GET" && (match.route.lazy || match.route.loader)) {
          shouldLoad = true;
        }
        return shouldLoad ? callLoaderOrAction(type, request, match, loadRoutePromise, handlerOverride, requestContext) : Promise.resolve({
          type: ResultType.data,
          result: void 0
        });
      };
      return _extends({}, match, {
        shouldLoad,
        resolve
      });
    });
    let results = await dataStrategyImpl({
      matches: dsMatches,
      request,
      params: matches[0].params,
      fetcherKey,
      context: requestContext
    });
    try {
      await Promise.all(loadRouteDefinitionsPromises);
    } catch (e) {
    }
    return results;
  }
  async function callLoaderOrAction(type, request, match, loadRoutePromise, handlerOverride, staticContext) {
    let result;
    let onReject;
    let runHandler = (handler) => {
      let reject;
      let abortPromise = new Promise((_, r2) => reject = r2);
      onReject = () => reject();
      request.signal.addEventListener("abort", onReject);
      let actualHandler = (ctx) => {
        if (typeof handler !== "function") {
          return Promise.reject(new Error("You cannot call the handler for a route which defines a boolean " + ('"' + type + '" [routeId: ' + match.route.id + "]")));
        }
        return handler({
          request,
          params: match.params,
          context: staticContext
        }, ...ctx !== void 0 ? [ctx] : []);
      };
      let handlerPromise = (async () => {
        try {
          let val = await (handlerOverride ? handlerOverride((ctx) => actualHandler(ctx)) : actualHandler());
          return {
            type: "data",
            result: val
          };
        } catch (e) {
          return {
            type: "error",
            result: e
          };
        }
      })();
      return Promise.race([handlerPromise, abortPromise]);
    };
    try {
      let handler = match.route[type];
      if (loadRoutePromise) {
        if (handler) {
          let handlerError;
          let [value] = await Promise.all([
            // If the handler throws, don't let it immediately bubble out,
            // since we need to let the lazy() execution finish so we know if this
            // route has a boundary that can handle the error
            runHandler(handler).catch((e) => {
              handlerError = e;
            }),
            loadRoutePromise
          ]);
          if (handlerError !== void 0) {
            throw handlerError;
          }
          result = value;
        } else {
          await loadRoutePromise;
          handler = match.route[type];
          if (handler) {
            result = await runHandler(handler);
          } else if (type === "action") {
            let url = new URL(request.url);
            let pathname = url.pathname + url.search;
            throw getInternalRouterError(405, {
              method: request.method,
              pathname,
              routeId: match.route.id
            });
          } else {
            return {
              type: ResultType.data,
              result: void 0
            };
          }
        }
      } else if (!handler) {
        let url = new URL(request.url);
        let pathname = url.pathname + url.search;
        throw getInternalRouterError(404, {
          pathname
        });
      } else {
        result = await runHandler(handler);
      }
      invariant(result.result !== void 0, "You defined " + (type === "action" ? "an action" : "a loader") + " for route " + ('"' + match.route.id + "\" but didn't return anything from your `" + type + "` ") + "function. Please return a value or `null`.");
    } catch (e) {
      return {
        type: ResultType.error,
        result: e
      };
    } finally {
      if (onReject) {
        request.signal.removeEventListener("abort", onReject);
      }
    }
    return result;
  }
  async function convertDataStrategyResultToDataResult(dataStrategyResult) {
    let {
      result,
      type
    } = dataStrategyResult;
    if (isResponse(result)) {
      let data;
      try {
        let contentType = result.headers.get("Content-Type");
        if (contentType && /\bapplication\/json\b/.test(contentType)) {
          if (result.body == null) {
            data = null;
          } else {
            data = await result.json();
          }
        } else {
          data = await result.text();
        }
      } catch (e) {
        return {
          type: ResultType.error,
          error: e
        };
      }
      if (type === ResultType.error) {
        return {
          type: ResultType.error,
          error: new ErrorResponseImpl(result.status, result.statusText, data),
          statusCode: result.status,
          headers: result.headers
        };
      }
      return {
        type: ResultType.data,
        data,
        statusCode: result.status,
        headers: result.headers
      };
    }
    if (type === ResultType.error) {
      if (isDataWithResponseInit(result)) {
        var _result$init3, _result$init4;
        if (result.data instanceof Error) {
          var _result$init, _result$init2;
          return {
            type: ResultType.error,
            error: result.data,
            statusCode: (_result$init = result.init) == null ? void 0 : _result$init.status,
            headers: (_result$init2 = result.init) != null && _result$init2.headers ? new Headers(result.init.headers) : void 0
          };
        }
        return {
          type: ResultType.error,
          error: new ErrorResponseImpl(((_result$init3 = result.init) == null ? void 0 : _result$init3.status) || 500, void 0, result.data),
          statusCode: isRouteErrorResponse(result) ? result.status : void 0,
          headers: (_result$init4 = result.init) != null && _result$init4.headers ? new Headers(result.init.headers) : void 0
        };
      }
      return {
        type: ResultType.error,
        error: result,
        statusCode: isRouteErrorResponse(result) ? result.status : void 0
      };
    }
    if (isDeferredData(result)) {
      var _result$init5, _result$init6;
      return {
        type: ResultType.deferred,
        deferredData: result,
        statusCode: (_result$init5 = result.init) == null ? void 0 : _result$init5.status,
        headers: ((_result$init6 = result.init) == null ? void 0 : _result$init6.headers) && new Headers(result.init.headers)
      };
    }
    if (isDataWithResponseInit(result)) {
      var _result$init7, _result$init8;
      return {
        type: ResultType.data,
        data: result.data,
        statusCode: (_result$init7 = result.init) == null ? void 0 : _result$init7.status,
        headers: (_result$init8 = result.init) != null && _result$init8.headers ? new Headers(result.init.headers) : void 0
      };
    }
    return {
      type: ResultType.data,
      data: result
    };
  }
  function normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename, v7_relativeSplatPath) {
    let location2 = response.headers.get("Location");
    invariant(location2, "Redirects returned/thrown from loaders/actions must have a Location header");
    if (!ABSOLUTE_URL_REGEX.test(location2)) {
      let trimmedMatches = matches.slice(0, matches.findIndex((m) => m.route.id === routeId) + 1);
      location2 = normalizeTo(new URL(request.url), trimmedMatches, basename, true, location2, v7_relativeSplatPath);
      response.headers.set("Location", location2);
    }
    return response;
  }
  function normalizeRedirectLocation(location2, currentUrl, basename, historyInstance) {
    let invalidProtocols = [
      "about:",
      "blob:",
      "chrome:",
      "chrome-untrusted:",
      "content:",
      "data:",
      "devtools:",
      "file:",
      "filesystem:",
      // eslint-disable-next-line no-script-url
      "javascript:"
    ];
    if (ABSOLUTE_URL_REGEX.test(location2)) {
      let normalizedLocation = location2;
      let url = normalizedLocation.startsWith("//") ? new URL(currentUrl.protocol + normalizedLocation) : new URL(normalizedLocation);
      if (invalidProtocols.includes(url.protocol)) {
        throw new Error("Invalid redirect location");
      }
      let isSameBasename = stripBasename(url.pathname, basename) != null;
      if (url.origin === currentUrl.origin && isSameBasename) {
        return removeDoubleSlashes(url.pathname) + url.search + url.hash;
      }
    }
    try {
      let url = historyInstance.createURL(location2);
      if (invalidProtocols.includes(url.protocol)) {
        throw new Error("Invalid redirect location");
      }
    } catch (e) {
    }
    return location2;
  }
  function createClientSideRequest(history, location2, signal, submission) {
    let url = history.createURL(stripHashFromPath(location2)).toString();
    let init = {
      signal
    };
    if (submission && isMutationMethod(submission.formMethod)) {
      let {
        formMethod,
        formEncType
      } = submission;
      init.method = formMethod.toUpperCase();
      if (formEncType === "application/json") {
        init.headers = new Headers({
          "Content-Type": formEncType
        });
        init.body = JSON.stringify(submission.json);
      } else if (formEncType === "text/plain") {
        init.body = submission.text;
      } else if (formEncType === "application/x-www-form-urlencoded" && submission.formData) {
        init.body = convertFormDataToSearchParams(submission.formData);
      } else {
        init.body = submission.formData;
      }
    }
    return new Request(url, init);
  }
  function convertFormDataToSearchParams(formData) {
    let searchParams = new URLSearchParams();
    for (let [key, value] of formData.entries()) {
      searchParams.append(key, typeof value === "string" ? value : value.name);
    }
    return searchParams;
  }
  function convertSearchParamsToFormData(searchParams) {
    let formData = new FormData();
    for (let [key, value] of searchParams.entries()) {
      formData.append(key, value);
    }
    return formData;
  }
  function processRouteLoaderData(matches, results, pendingActionResult, activeDeferreds, skipLoaderErrorBubbling) {
    let loaderData = {};
    let errors = null;
    let statusCode;
    let foundError = false;
    let loaderHeaders = {};
    let pendingError = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : void 0;
    matches.forEach((match) => {
      if (!(match.route.id in results)) {
        return;
      }
      let id = match.route.id;
      let result = results[id];
      invariant(!isRedirectResult(result), "Cannot handle redirect results in processLoaderData");
      if (isErrorResult(result)) {
        let error = result.error;
        if (pendingError !== void 0) {
          error = pendingError;
          pendingError = void 0;
        }
        errors = errors || {};
        if (skipLoaderErrorBubbling) {
          errors[id] = error;
        } else {
          let boundaryMatch = findNearestBoundary(matches, id);
          if (errors[boundaryMatch.route.id] == null) {
            errors[boundaryMatch.route.id] = error;
          }
        }
        loaderData[id] = void 0;
        if (!foundError) {
          foundError = true;
          statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
        }
        if (result.headers) {
          loaderHeaders[id] = result.headers;
        }
      } else {
        if (isDeferredResult(result)) {
          activeDeferreds.set(id, result.deferredData);
          loaderData[id] = result.deferredData.data;
          if (result.statusCode != null && result.statusCode !== 200 && !foundError) {
            statusCode = result.statusCode;
          }
          if (result.headers) {
            loaderHeaders[id] = result.headers;
          }
        } else {
          loaderData[id] = result.data;
          if (result.statusCode && result.statusCode !== 200 && !foundError) {
            statusCode = result.statusCode;
          }
          if (result.headers) {
            loaderHeaders[id] = result.headers;
          }
        }
      }
    });
    if (pendingError !== void 0 && pendingActionResult) {
      errors = {
        [pendingActionResult[0]]: pendingError
      };
      loaderData[pendingActionResult[0]] = void 0;
    }
    return {
      loaderData,
      errors,
      statusCode: statusCode || 200,
      loaderHeaders
    };
  }
  function processLoaderData(state, matches, results, pendingActionResult, revalidatingFetchers, fetcherResults, activeDeferreds) {
    let {
      loaderData,
      errors
    } = processRouteLoaderData(
      matches,
      results,
      pendingActionResult,
      activeDeferreds,
      false
      // This method is only called client side so we always want to bubble
    );
    revalidatingFetchers.forEach((rf) => {
      let {
        key,
        match,
        controller
      } = rf;
      let result = fetcherResults[key];
      invariant(result, "Did not find corresponding fetcher result");
      if (controller && controller.signal.aborted) {
        return;
      } else if (isErrorResult(result)) {
        let boundaryMatch = findNearestBoundary(state.matches, match == null ? void 0 : match.route.id);
        if (!(errors && errors[boundaryMatch.route.id])) {
          errors = _extends({}, errors, {
            [boundaryMatch.route.id]: result.error
          });
        }
        state.fetchers.delete(key);
      } else if (isRedirectResult(result)) {
        invariant(false, "Unhandled fetcher revalidation redirect");
      } else if (isDeferredResult(result)) {
        invariant(false, "Unhandled fetcher deferred data");
      } else {
        let doneFetcher = getDoneFetcher(result.data);
        state.fetchers.set(key, doneFetcher);
      }
    });
    return {
      loaderData,
      errors
    };
  }
  function mergeLoaderData(loaderData, newLoaderData, matches, errors) {
    let mergedLoaderData = _extends({}, newLoaderData);
    for (let match of matches) {
      let id = match.route.id;
      if (newLoaderData.hasOwnProperty(id)) {
        if (newLoaderData[id] !== void 0) {
          mergedLoaderData[id] = newLoaderData[id];
        }
      } else if (loaderData[id] !== void 0 && match.route.loader) {
        mergedLoaderData[id] = loaderData[id];
      }
      if (errors && errors.hasOwnProperty(id)) {
        break;
      }
    }
    return mergedLoaderData;
  }
  function getActionDataForCommit(pendingActionResult) {
    if (!pendingActionResult) {
      return {};
    }
    return isErrorResult(pendingActionResult[1]) ? {
      // Clear out prior actionData on errors
      actionData: {}
    } : {
      actionData: {
        [pendingActionResult[0]]: pendingActionResult[1].data
      }
    };
  }
  function findNearestBoundary(matches, routeId) {
    let eligibleMatches = routeId ? matches.slice(0, matches.findIndex((m) => m.route.id === routeId) + 1) : [...matches];
    return eligibleMatches.reverse().find((m) => m.route.hasErrorBoundary === true) || matches[0];
  }
  function getShortCircuitMatches(routes) {
    let route = routes.length === 1 ? routes[0] : routes.find((r2) => r2.index || !r2.path || r2.path === "/") || {
      id: "__shim-error-route__"
    };
    return {
      matches: [{
        params: {},
        pathname: "",
        pathnameBase: "",
        route
      }],
      route
    };
  }
  function getInternalRouterError(status, _temp5) {
    let {
      pathname,
      routeId,
      method,
      type,
      message
    } = _temp5 === void 0 ? {} : _temp5;
    let statusText = "Unknown Server Error";
    let errorMessage = "Unknown @remix-run/router error";
    if (status === 400) {
      statusText = "Bad Request";
      if (method && pathname && routeId) {
        errorMessage = "You made a " + method + ' request to "' + pathname + '" but ' + ('did not provide a `loader` for route "' + routeId + '", ') + "so there is no way to handle the request.";
      } else if (type === "defer-action") {
        errorMessage = "defer() is not supported in actions";
      } else if (type === "invalid-body") {
        errorMessage = "Unable to encode submission body";
      }
    } else if (status === 403) {
      statusText = "Forbidden";
      errorMessage = 'Route "' + routeId + '" does not match URL "' + pathname + '"';
    } else if (status === 404) {
      statusText = "Not Found";
      errorMessage = 'No route matches URL "' + pathname + '"';
    } else if (status === 405) {
      statusText = "Method Not Allowed";
      if (method && pathname && routeId) {
        errorMessage = "You made a " + method.toUpperCase() + ' request to "' + pathname + '" but ' + ('did not provide an `action` for route "' + routeId + '", ') + "so there is no way to handle the request.";
      } else if (method) {
        errorMessage = 'Invalid request method "' + method.toUpperCase() + '"';
      }
    }
    return new ErrorResponseImpl(status || 500, statusText, new Error(errorMessage), true);
  }
  function findRedirect(results) {
    let entries = Object.entries(results);
    for (let i = entries.length - 1; i >= 0; i--) {
      let [key, result] = entries[i];
      if (isRedirectResult(result)) {
        return {
          key,
          result
        };
      }
    }
  }
  function stripHashFromPath(path) {
    let parsedPath = typeof path === "string" ? parsePath(path) : path;
    return createPath(_extends({}, parsedPath, {
      hash: ""
    }));
  }
  function isHashChangeOnly(a, b) {
    if (a.pathname !== b.pathname || a.search !== b.search) {
      return false;
    }
    if (a.hash === "") {
      return b.hash !== "";
    } else if (a.hash === b.hash) {
      return true;
    } else if (b.hash !== "") {
      return true;
    }
    return false;
  }
  function isRedirectDataStrategyResultResult(result) {
    return isResponse(result.result) && redirectStatusCodes.has(result.result.status);
  }
  function isDeferredResult(result) {
    return result.type === ResultType.deferred;
  }
  function isErrorResult(result) {
    return result.type === ResultType.error;
  }
  function isRedirectResult(result) {
    return (result && result.type) === ResultType.redirect;
  }
  function isDataWithResponseInit(value) {
    return typeof value === "object" && value != null && "type" in value && "data" in value && "init" in value && value.type === "DataWithResponseInit";
  }
  function isDeferredData(value) {
    let deferred = value;
    return deferred && typeof deferred === "object" && typeof deferred.data === "object" && typeof deferred.subscribe === "function" && typeof deferred.cancel === "function" && typeof deferred.resolveData === "function";
  }
  function isResponse(value) {
    return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
  }
  function isValidMethod(method) {
    return validRequestMethods.has(method.toLowerCase());
  }
  function isMutationMethod(method) {
    return validMutationMethods.has(method.toLowerCase());
  }
  async function resolveNavigationDeferredResults(matches, results, signal, currentMatches, currentLoaderData) {
    let entries = Object.entries(results);
    for (let index = 0; index < entries.length; index++) {
      let [routeId, result] = entries[index];
      let match = matches.find((m) => (m == null ? void 0 : m.route.id) === routeId);
      if (!match) {
        continue;
      }
      let currentMatch = currentMatches.find((m) => m.route.id === match.route.id);
      let isRevalidatingLoader = currentMatch != null && !isNewRouteInstance(currentMatch, match) && (currentLoaderData && currentLoaderData[match.route.id]) !== void 0;
      if (isDeferredResult(result) && isRevalidatingLoader) {
        await resolveDeferredData(result, signal, false).then((result2) => {
          if (result2) {
            results[routeId] = result2;
          }
        });
      }
    }
  }
  async function resolveFetcherDeferredResults(matches, results, revalidatingFetchers) {
    for (let index = 0; index < revalidatingFetchers.length; index++) {
      let {
        key,
        routeId,
        controller
      } = revalidatingFetchers[index];
      let result = results[key];
      let match = matches.find((m) => (m == null ? void 0 : m.route.id) === routeId);
      if (!match) {
        continue;
      }
      if (isDeferredResult(result)) {
        invariant(controller, "Expected an AbortController for revalidating fetcher deferred result");
        await resolveDeferredData(result, controller.signal, true).then((result2) => {
          if (result2) {
            results[key] = result2;
          }
        });
      }
    }
  }
  async function resolveDeferredData(result, signal, unwrap) {
    if (unwrap === void 0) {
      unwrap = false;
    }
    let aborted = await result.deferredData.resolveData(signal);
    if (aborted) {
      return;
    }
    if (unwrap) {
      try {
        return {
          type: ResultType.data,
          data: result.deferredData.unwrappedData
        };
      } catch (e) {
        return {
          type: ResultType.error,
          error: e
        };
      }
    }
    return {
      type: ResultType.data,
      data: result.deferredData.data
    };
  }
  function hasNakedIndexQuery(search) {
    return new URLSearchParams(search).getAll("index").some((v) => v === "");
  }
  function getTargetMatch(matches, location2) {
    let search = typeof location2 === "string" ? parsePath(location2).search : location2.search;
    if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) {
      return matches[matches.length - 1];
    }
    let pathMatches = getPathContributingMatches(matches);
    return pathMatches[pathMatches.length - 1];
  }
  function getSubmissionFromNavigation(navigation) {
    let {
      formMethod,
      formAction,
      formEncType,
      text,
      formData,
      json: json3
    } = navigation;
    if (!formMethod || !formAction || !formEncType) {
      return;
    }
    if (text != null) {
      return {
        formMethod,
        formAction,
        formEncType,
        formData: void 0,
        json: void 0,
        text
      };
    } else if (formData != null) {
      return {
        formMethod,
        formAction,
        formEncType,
        formData,
        json: void 0,
        text: void 0
      };
    } else if (json3 !== void 0) {
      return {
        formMethod,
        formAction,
        formEncType,
        formData: void 0,
        json: json3,
        text: void 0
      };
    }
  }
  function getLoadingNavigation(location2, submission) {
    if (submission) {
      let navigation = {
        state: "loading",
        location: location2,
        formMethod: submission.formMethod,
        formAction: submission.formAction,
        formEncType: submission.formEncType,
        formData: submission.formData,
        json: submission.json,
        text: submission.text
      };
      return navigation;
    } else {
      let navigation = {
        state: "loading",
        location: location2,
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        json: void 0,
        text: void 0
      };
      return navigation;
    }
  }
  function getSubmittingNavigation(location2, submission) {
    let navigation = {
      state: "submitting",
      location: location2,
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text
    };
    return navigation;
  }
  function getLoadingFetcher(submission, data) {
    if (submission) {
      let fetcher = {
        state: "loading",
        formMethod: submission.formMethod,
        formAction: submission.formAction,
        formEncType: submission.formEncType,
        formData: submission.formData,
        json: submission.json,
        text: submission.text,
        data
      };
      return fetcher;
    } else {
      let fetcher = {
        state: "loading",
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        json: void 0,
        text: void 0,
        data
      };
      return fetcher;
    }
  }
  function getSubmittingFetcher(submission, existingFetcher) {
    let fetcher = {
      state: "submitting",
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text,
      data: existingFetcher ? existingFetcher.data : void 0
    };
    return fetcher;
  }
  function getDoneFetcher(data) {
    let fetcher = {
      state: "idle",
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      json: void 0,
      text: void 0,
      data
    };
    return fetcher;
  }
  function restoreAppliedTransitions(_window, transitions) {
    try {
      let sessionPositions = _window.sessionStorage.getItem(TRANSITIONS_STORAGE_KEY);
      if (sessionPositions) {
        let json3 = JSON.parse(sessionPositions);
        for (let [k, v] of Object.entries(json3 || {})) {
          if (v && Array.isArray(v)) {
            transitions.set(k, new Set(v || []));
          }
        }
      }
    } catch (e) {
    }
  }
  function persistAppliedTransitions(_window, transitions) {
    if (transitions.size > 0) {
      let json3 = {};
      for (let [k, v] of transitions) {
        json3[k] = [...v];
      }
      try {
        _window.sessionStorage.setItem(TRANSITIONS_STORAGE_KEY, JSON.stringify(json3));
      } catch (error) {
        warning(false, "Failed to save applied view transitions in sessionStorage (" + error + ").");
      }
    }
  }

  // node_modules/react-router/dist/index.js
  function _extends2() {
    return _extends2 = Object.assign ? Object.assign.bind() : function(n) {
      for (var e = 1; e < arguments.length; e++) {
        var t2 = arguments[e];
        for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n[r2] = t2[r2]);
      }
      return n;
    }, _extends2.apply(null, arguments);
  }
  var DataRouterContext = /* @__PURE__ */ React2.createContext(null);
  if (true) {
    DataRouterContext.displayName = "DataRouter";
  }
  var DataRouterStateContext = /* @__PURE__ */ React2.createContext(null);
  if (true) {
    DataRouterStateContext.displayName = "DataRouterState";
  }
  var AwaitContext = /* @__PURE__ */ React2.createContext(null);
  if (true) {
    AwaitContext.displayName = "Await";
  }
  var NavigationContext = /* @__PURE__ */ React2.createContext(null);
  if (true) {
    NavigationContext.displayName = "Navigation";
  }
  var LocationContext = /* @__PURE__ */ React2.createContext(null);
  if (true) {
    LocationContext.displayName = "Location";
  }
  var RouteContext = /* @__PURE__ */ React2.createContext({
    outlet: null,
    matches: [],
    isDataRoute: false
  });
  if (true) {
    RouteContext.displayName = "Route";
  }
  var RouteErrorContext = /* @__PURE__ */ React2.createContext(null);
  if (true) {
    RouteErrorContext.displayName = "RouteError";
  }
  function useHref(to, _temp) {
    let {
      relative
    } = _temp === void 0 ? {} : _temp;
    !useInRouterContext() ? true ? invariant(
      false,
      // TODO: This error is probably because they somehow have 2 versions of the
      // router loaded. We can help them understand how to avoid that.
      "useHref() may be used only in the context of a <Router> component."
    ) : invariant(false) : void 0;
    let {
      basename,
      navigator: navigator2
    } = React2.useContext(NavigationContext);
    let {
      hash,
      pathname,
      search
    } = useResolvedPath(to, {
      relative
    });
    let joinedPathname = pathname;
    if (basename !== "/") {
      joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
    }
    return navigator2.createHref({
      pathname: joinedPathname,
      search,
      hash
    });
  }
  function useInRouterContext() {
    return React2.useContext(LocationContext) != null;
  }
  function useLocation() {
    !useInRouterContext() ? true ? invariant(
      false,
      // TODO: This error is probably because they somehow have 2 versions of the
      // router loaded. We can help them understand how to avoid that.
      "useLocation() may be used only in the context of a <Router> component."
    ) : invariant(false) : void 0;
    return React2.useContext(LocationContext).location;
  }
  function useNavigationType() {
    return React2.useContext(LocationContext).navigationType;
  }
  function useMatch(pattern) {
    !useInRouterContext() ? true ? invariant(
      false,
      // TODO: This error is probably because they somehow have 2 versions of the
      // router loaded. We can help them understand how to avoid that.
      "useMatch() may be used only in the context of a <Router> component."
    ) : invariant(false) : void 0;
    let {
      pathname
    } = useLocation();
    return React2.useMemo(() => matchPath(pattern, decodePath(pathname)), [pathname, pattern]);
  }
  var navigateEffectWarning = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
  function useIsomorphicLayoutEffect(cb) {
    let isStatic = React2.useContext(NavigationContext).static;
    if (!isStatic) {
      React2.useLayoutEffect(cb);
    }
  }
  function useNavigate() {
    let {
      isDataRoute
    } = React2.useContext(RouteContext);
    return isDataRoute ? useNavigateStable() : useNavigateUnstable();
  }
  function useNavigateUnstable() {
    !useInRouterContext() ? true ? invariant(
      false,
      // TODO: This error is probably because they somehow have 2 versions of the
      // router loaded. We can help them understand how to avoid that.
      "useNavigate() may be used only in the context of a <Router> component."
    ) : invariant(false) : void 0;
    let dataRouterContext = React2.useContext(DataRouterContext);
    let {
      basename,
      future,
      navigator: navigator2
    } = React2.useContext(NavigationContext);
    let {
      matches
    } = React2.useContext(RouteContext);
    let {
      pathname: locationPathname
    } = useLocation();
    let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
    let activeRef = React2.useRef(false);
    useIsomorphicLayoutEffect(() => {
      activeRef.current = true;
    });
    let navigate = React2.useCallback(function(to, options) {
      if (options === void 0) {
        options = {};
      }
      true ? warning(activeRef.current, navigateEffectWarning) : void 0;
      if (!activeRef.current) return;
      if (typeof to === "number") {
        navigator2.go(to);
        return;
      }
      let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
      if (dataRouterContext == null && basename !== "/") {
        path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
      }
      (!!options.replace ? navigator2.replace : navigator2.push)(path, options.state, options);
    }, [basename, navigator2, routePathnamesJson, locationPathname, dataRouterContext]);
    return navigate;
  }
  var OutletContext = /* @__PURE__ */ React2.createContext(null);
  function useOutletContext() {
    return React2.useContext(OutletContext);
  }
  function useOutlet(context) {
    let outlet = React2.useContext(RouteContext).outlet;
    if (outlet) {
      return /* @__PURE__ */ React2.createElement(OutletContext.Provider, {
        value: context
      }, outlet);
    }
    return outlet;
  }
  function useParams() {
    let {
      matches
    } = React2.useContext(RouteContext);
    let routeMatch = matches[matches.length - 1];
    return routeMatch ? routeMatch.params : {};
  }
  function useResolvedPath(to, _temp2) {
    let {
      relative
    } = _temp2 === void 0 ? {} : _temp2;
    let {
      future
    } = React2.useContext(NavigationContext);
    let {
      matches
    } = React2.useContext(RouteContext);
    let {
      pathname: locationPathname
    } = useLocation();
    let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
    return React2.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
  }
  function useRoutes(routes, locationArg) {
    return useRoutesImpl(routes, locationArg);
  }
  function useRoutesImpl(routes, locationArg, dataRouterState, future) {
    !useInRouterContext() ? true ? invariant(
      false,
      // TODO: This error is probably because they somehow have 2 versions of the
      // router loaded. We can help them understand how to avoid that.
      "useRoutes() may be used only in the context of a <Router> component."
    ) : invariant(false) : void 0;
    let {
      navigator: navigator2
    } = React2.useContext(NavigationContext);
    let {
      matches: parentMatches
    } = React2.useContext(RouteContext);
    let routeMatch = parentMatches[parentMatches.length - 1];
    let parentParams = routeMatch ? routeMatch.params : {};
    let parentPathname = routeMatch ? routeMatch.pathname : "/";
    let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
    let parentRoute = routeMatch && routeMatch.route;
    if (true) {
      let parentPath = parentRoute && parentRoute.path || "";
      warningOnce(parentPathname, !parentRoute || parentPath.endsWith("*"), "You rendered descendant <Routes> (or called `useRoutes()`) at " + ('"' + parentPathname + '" (under <Route path="' + parentPath + '">) but the ') + `parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

` + ('Please change the parent <Route path="' + parentPath + '"> to <Route ') + ('path="' + (parentPath === "/" ? "*" : parentPath + "/*") + '">.'));
    }
    let locationFromContext = useLocation();
    let location2;
    if (locationArg) {
      var _parsedLocationArg$pa;
      let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
      !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? true ? invariant(false, "When overriding the location using `<Routes location>` or `useRoutes(routes, location)`, the location pathname must begin with the portion of the URL pathname that was " + ('matched by all parent routes. The current pathname base is "' + parentPathnameBase + '" ') + ('but pathname "' + parsedLocationArg.pathname + '" was given in the `location` prop.')) : invariant(false) : void 0;
      location2 = parsedLocationArg;
    } else {
      location2 = locationFromContext;
    }
    let pathname = location2.pathname || "/";
    let remainingPathname = pathname;
    if (parentPathnameBase !== "/") {
      let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
      let segments = pathname.replace(/^\//, "").split("/");
      remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
    }
    let matches = matchRoutes(routes, {
      pathname: remainingPathname
    });
    if (true) {
      true ? warning(parentRoute || matches != null, 'No routes matched location "' + location2.pathname + location2.search + location2.hash + '" ') : void 0;
      true ? warning(matches == null || matches[matches.length - 1].route.element !== void 0 || matches[matches.length - 1].route.Component !== void 0 || matches[matches.length - 1].route.lazy !== void 0, 'Matched leaf route at location "' + location2.pathname + location2.search + location2.hash + '" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.') : void 0;
    }
    let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
      params: Object.assign({}, parentParams, match.params),
      pathname: joinPaths([
        parentPathnameBase,
        // Re-encode pathnames that were decoded inside matchRoutes
        navigator2.encodeLocation ? navigator2.encodeLocation(match.pathname).pathname : match.pathname
      ]),
      pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
        parentPathnameBase,
        // Re-encode pathnames that were decoded inside matchRoutes
        navigator2.encodeLocation ? navigator2.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
      ])
    })), parentMatches, dataRouterState, future);
    if (locationArg && renderedMatches) {
      return /* @__PURE__ */ React2.createElement(LocationContext.Provider, {
        value: {
          location: _extends2({
            pathname: "/",
            search: "",
            hash: "",
            state: null,
            key: "default"
          }, location2),
          navigationType: Action.Pop
        }
      }, renderedMatches);
    }
    return renderedMatches;
  }
  function DefaultErrorComponent() {
    let error = useRouteError();
    let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
    let stack = error instanceof Error ? error.stack : null;
    let lightgrey = "rgba(200,200,200, 0.5)";
    let preStyles = {
      padding: "0.5rem",
      backgroundColor: lightgrey
    };
    let codeStyles = {
      padding: "2px 4px",
      backgroundColor: lightgrey
    };
    let devInfo = null;
    if (true) {
      console.error("Error handled by React Router default ErrorBoundary:", error);
      devInfo = /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("p", null, "\u{1F4BF} Hey developer \u{1F44B}"), /* @__PURE__ */ React2.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ React2.createElement("code", {
        style: codeStyles
      }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ React2.createElement("code", {
        style: codeStyles
      }, "errorElement"), " prop on your route."));
    }
    return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ React2.createElement("h3", {
      style: {
        fontStyle: "italic"
      }
    }, message), stack ? /* @__PURE__ */ React2.createElement("pre", {
      style: preStyles
    }, stack) : null, devInfo);
  }
  var defaultErrorElement = /* @__PURE__ */ React2.createElement(DefaultErrorComponent, null);
  var RenderErrorBoundary = class extends React2.Component {
    constructor(props) {
      super(props);
      this.state = {
        location: props.location,
        revalidation: props.revalidation,
        error: props.error
      };
    }
    static getDerivedStateFromError(error) {
      return {
        error
      };
    }
    static getDerivedStateFromProps(props, state) {
      if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
        return {
          error: props.error,
          location: props.location,
          revalidation: props.revalidation
        };
      }
      return {
        error: props.error !== void 0 ? props.error : state.error,
        location: state.location,
        revalidation: props.revalidation || state.revalidation
      };
    }
    componentDidCatch(error, errorInfo) {
      console.error("React Router caught the following error during render", error, errorInfo);
    }
    render() {
      return this.state.error !== void 0 ? /* @__PURE__ */ React2.createElement(RouteContext.Provider, {
        value: this.props.routeContext
      }, /* @__PURE__ */ React2.createElement(RouteErrorContext.Provider, {
        value: this.state.error,
        children: this.props.component
      })) : this.props.children;
    }
  };
  function RenderedRoute(_ref) {
    let {
      routeContext,
      match,
      children
    } = _ref;
    let dataRouterContext = React2.useContext(DataRouterContext);
    if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
      dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
    }
    return /* @__PURE__ */ React2.createElement(RouteContext.Provider, {
      value: routeContext
    }, children);
  }
  function _renderMatches(matches, parentMatches, dataRouterState, future) {
    var _dataRouterState;
    if (parentMatches === void 0) {
      parentMatches = [];
    }
    if (dataRouterState === void 0) {
      dataRouterState = null;
    }
    if (future === void 0) {
      future = null;
    }
    if (matches == null) {
      var _future;
      if (!dataRouterState) {
        return null;
      }
      if (dataRouterState.errors) {
        matches = dataRouterState.matches;
      } else if ((_future = future) != null && _future.v7_partialHydration && parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
        matches = dataRouterState.matches;
      } else {
        return null;
      }
    }
    let renderedMatches = matches;
    let errors = (_dataRouterState = dataRouterState) == null ? void 0 : _dataRouterState.errors;
    if (errors != null) {
      let errorIndex = renderedMatches.findIndex((m) => m.route.id && (errors == null ? void 0 : errors[m.route.id]) !== void 0);
      !(errorIndex >= 0) ? true ? invariant(false, "Could not find a matching route for errors on route IDs: " + Object.keys(errors).join(",")) : invariant(false) : void 0;
      renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
    }
    let renderFallback = false;
    let fallbackIndex = -1;
    if (dataRouterState && future && future.v7_partialHydration) {
      for (let i = 0; i < renderedMatches.length; i++) {
        let match = renderedMatches[i];
        if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
          fallbackIndex = i;
        }
        if (match.route.id) {
          let {
            loaderData,
            errors: errors2
          } = dataRouterState;
          let needsToRunLoader = match.route.loader && loaderData[match.route.id] === void 0 && (!errors2 || errors2[match.route.id] === void 0);
          if (match.route.lazy || needsToRunLoader) {
            renderFallback = true;
            if (fallbackIndex >= 0) {
              renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
            } else {
              renderedMatches = [renderedMatches[0]];
            }
            break;
          }
        }
      }
    }
    return renderedMatches.reduceRight((outlet, match, index) => {
      let error;
      let shouldRenderHydrateFallback = false;
      let errorElement = null;
      let hydrateFallbackElement = null;
      if (dataRouterState) {
        error = errors && match.route.id ? errors[match.route.id] : void 0;
        errorElement = match.route.errorElement || defaultErrorElement;
        if (renderFallback) {
          if (fallbackIndex < 0 && index === 0) {
            warningOnce("route-fallback", false, "No `HydrateFallback` element provided to render during initial hydration");
            shouldRenderHydrateFallback = true;
            hydrateFallbackElement = null;
          } else if (fallbackIndex === index) {
            shouldRenderHydrateFallback = true;
            hydrateFallbackElement = match.route.hydrateFallbackElement || null;
          }
        }
      }
      let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
      let getChildren = () => {
        let children;
        if (error) {
          children = errorElement;
        } else if (shouldRenderHydrateFallback) {
          children = hydrateFallbackElement;
        } else if (match.route.Component) {
          children = /* @__PURE__ */ React2.createElement(match.route.Component, null);
        } else if (match.route.element) {
          children = match.route.element;
        } else {
          children = outlet;
        }
        return /* @__PURE__ */ React2.createElement(RenderedRoute, {
          match,
          routeContext: {
            outlet,
            matches: matches2,
            isDataRoute: dataRouterState != null
          },
          children
        });
      };
      return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ React2.createElement(RenderErrorBoundary, {
        location: dataRouterState.location,
        revalidation: dataRouterState.revalidation,
        component: errorElement,
        error,
        children: getChildren(),
        routeContext: {
          outlet: null,
          matches: matches2,
          isDataRoute: true
        }
      }) : getChildren();
    }, null);
  }
  var DataRouterHook = /* @__PURE__ */ (function(DataRouterHook3) {
    DataRouterHook3["UseBlocker"] = "useBlocker";
    DataRouterHook3["UseRevalidator"] = "useRevalidator";
    DataRouterHook3["UseNavigateStable"] = "useNavigate";
    return DataRouterHook3;
  })(DataRouterHook || {});
  var DataRouterStateHook = /* @__PURE__ */ (function(DataRouterStateHook3) {
    DataRouterStateHook3["UseBlocker"] = "useBlocker";
    DataRouterStateHook3["UseLoaderData"] = "useLoaderData";
    DataRouterStateHook3["UseActionData"] = "useActionData";
    DataRouterStateHook3["UseRouteError"] = "useRouteError";
    DataRouterStateHook3["UseNavigation"] = "useNavigation";
    DataRouterStateHook3["UseRouteLoaderData"] = "useRouteLoaderData";
    DataRouterStateHook3["UseMatches"] = "useMatches";
    DataRouterStateHook3["UseRevalidator"] = "useRevalidator";
    DataRouterStateHook3["UseNavigateStable"] = "useNavigate";
    DataRouterStateHook3["UseRouteId"] = "useRouteId";
    return DataRouterStateHook3;
  })(DataRouterStateHook || {});
  function getDataRouterConsoleError(hookName) {
    return hookName + " must be used within a data router.  See https://reactrouter.com/v6/routers/picking-a-router.";
  }
  function useDataRouterContext(hookName) {
    let ctx = React2.useContext(DataRouterContext);
    !ctx ? true ? invariant(false, getDataRouterConsoleError(hookName)) : invariant(false) : void 0;
    return ctx;
  }
  function useDataRouterState(hookName) {
    let state = React2.useContext(DataRouterStateContext);
    !state ? true ? invariant(false, getDataRouterConsoleError(hookName)) : invariant(false) : void 0;
    return state;
  }
  function useRouteContext(hookName) {
    let route = React2.useContext(RouteContext);
    !route ? true ? invariant(false, getDataRouterConsoleError(hookName)) : invariant(false) : void 0;
    return route;
  }
  function useCurrentRouteId(hookName) {
    let route = useRouteContext(hookName);
    let thisRoute = route.matches[route.matches.length - 1];
    !thisRoute.route.id ? true ? invariant(false, hookName + ' can only be used on routes that contain a unique "id"') : invariant(false) : void 0;
    return thisRoute.route.id;
  }
  function useRouteId() {
    return useCurrentRouteId(DataRouterStateHook.UseRouteId);
  }
  function useNavigation() {
    let state = useDataRouterState(DataRouterStateHook.UseNavigation);
    return state.navigation;
  }
  function useRevalidator() {
    let dataRouterContext = useDataRouterContext(DataRouterHook.UseRevalidator);
    let state = useDataRouterState(DataRouterStateHook.UseRevalidator);
    return React2.useMemo(() => ({
      revalidate: dataRouterContext.router.revalidate,
      state: state.revalidation
    }), [dataRouterContext.router.revalidate, state.revalidation]);
  }
  function useMatches() {
    let {
      matches,
      loaderData
    } = useDataRouterState(DataRouterStateHook.UseMatches);
    return React2.useMemo(() => matches.map((m) => convertRouteMatchToUiMatch(m, loaderData)), [matches, loaderData]);
  }
  function useLoaderData() {
    let state = useDataRouterState(DataRouterStateHook.UseLoaderData);
    let routeId = useCurrentRouteId(DataRouterStateHook.UseLoaderData);
    if (state.errors && state.errors[routeId] != null) {
      console.error("You cannot `useLoaderData` in an errorElement (routeId: " + routeId + ")");
      return void 0;
    }
    return state.loaderData[routeId];
  }
  function useRouteLoaderData(routeId) {
    let state = useDataRouterState(DataRouterStateHook.UseRouteLoaderData);
    return state.loaderData[routeId];
  }
  function useActionData() {
    let state = useDataRouterState(DataRouterStateHook.UseActionData);
    let routeId = useCurrentRouteId(DataRouterStateHook.UseLoaderData);
    return state.actionData ? state.actionData[routeId] : void 0;
  }
  function useRouteError() {
    var _state$errors;
    let error = React2.useContext(RouteErrorContext);
    let state = useDataRouterState(DataRouterStateHook.UseRouteError);
    let routeId = useCurrentRouteId(DataRouterStateHook.UseRouteError);
    if (error !== void 0) {
      return error;
    }
    return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
  }
  function useAsyncValue() {
    let value = React2.useContext(AwaitContext);
    return value == null ? void 0 : value._data;
  }
  function useAsyncError() {
    let value = React2.useContext(AwaitContext);
    return value == null ? void 0 : value._error;
  }
  var blockerId = 0;
  function useBlocker(shouldBlock) {
    let {
      router,
      basename
    } = useDataRouterContext(DataRouterHook.UseBlocker);
    let state = useDataRouterState(DataRouterStateHook.UseBlocker);
    let [blockerKey, setBlockerKey] = React2.useState("");
    let blockerFunction = React2.useCallback((arg) => {
      if (typeof shouldBlock !== "function") {
        return !!shouldBlock;
      }
      if (basename === "/") {
        return shouldBlock(arg);
      }
      let {
        currentLocation,
        nextLocation,
        historyAction
      } = arg;
      return shouldBlock({
        currentLocation: _extends2({}, currentLocation, {
          pathname: stripBasename(currentLocation.pathname, basename) || currentLocation.pathname
        }),
        nextLocation: _extends2({}, nextLocation, {
          pathname: stripBasename(nextLocation.pathname, basename) || nextLocation.pathname
        }),
        historyAction
      });
    }, [basename, shouldBlock]);
    React2.useEffect(() => {
      let key = String(++blockerId);
      setBlockerKey(key);
      return () => router.deleteBlocker(key);
    }, [router]);
    React2.useEffect(() => {
      if (blockerKey !== "") {
        router.getBlocker(blockerKey, blockerFunction);
      }
    }, [router, blockerKey, blockerFunction]);
    return blockerKey && state.blockers.has(blockerKey) ? state.blockers.get(blockerKey) : IDLE_BLOCKER;
  }
  function useNavigateStable() {
    let {
      router
    } = useDataRouterContext(DataRouterHook.UseNavigateStable);
    let id = useCurrentRouteId(DataRouterStateHook.UseNavigateStable);
    let activeRef = React2.useRef(false);
    useIsomorphicLayoutEffect(() => {
      activeRef.current = true;
    });
    let navigate = React2.useCallback(function(to, options) {
      if (options === void 0) {
        options = {};
      }
      true ? warning(activeRef.current, navigateEffectWarning) : void 0;
      if (!activeRef.current) return;
      if (typeof to === "number") {
        router.navigate(to);
      } else {
        router.navigate(to, _extends2({
          fromRouteId: id
        }, options));
      }
    }, [router, id]);
    return navigate;
  }
  var alreadyWarned$1 = {};
  function warningOnce(key, cond, message) {
    if (!cond && !alreadyWarned$1[key]) {
      alreadyWarned$1[key] = true;
      true ? warning(false, message) : void 0;
    }
  }
  var alreadyWarned = {};
  function warnOnce(key, message) {
    if (!alreadyWarned[message]) {
      alreadyWarned[message] = true;
      console.warn(message);
    }
  }
  var logDeprecation = (flag, msg, link) => warnOnce(flag, "\u26A0\uFE0F React Router Future Flag Warning: " + msg + ". " + ("You can use the `" + flag + "` future flag to opt-in early. ") + ("For more information, see " + link + "."));
  function logV6DeprecationWarnings(renderFuture, routerFuture) {
    if ((renderFuture == null ? void 0 : renderFuture.v7_startTransition) === void 0) {
      logDeprecation("v7_startTransition", "React Router will begin wrapping state updates in `React.startTransition` in v7", "https://reactrouter.com/v6/upgrading/future#v7_starttransition");
    }
    if ((renderFuture == null ? void 0 : renderFuture.v7_relativeSplatPath) === void 0 && (!routerFuture || routerFuture.v7_relativeSplatPath === void 0)) {
      logDeprecation("v7_relativeSplatPath", "Relative route resolution within Splat routes is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath");
    }
    if (routerFuture) {
      if (routerFuture.v7_fetcherPersist === void 0) {
        logDeprecation("v7_fetcherPersist", "The persistence behavior of fetchers is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_fetcherpersist");
      }
      if (routerFuture.v7_normalizeFormMethod === void 0) {
        logDeprecation("v7_normalizeFormMethod", "Casing of `formMethod` fields is being normalized to uppercase in v7", "https://reactrouter.com/v6/upgrading/future#v7_normalizeformmethod");
      }
      if (routerFuture.v7_partialHydration === void 0) {
        logDeprecation("v7_partialHydration", "`RouterProvider` hydration behavior is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_partialhydration");
      }
      if (routerFuture.v7_skipActionErrorRevalidation === void 0) {
        logDeprecation("v7_skipActionErrorRevalidation", "The revalidation behavior after 4xx/5xx `action` responses is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_skipactionerrorrevalidation");
      }
    }
  }
  var START_TRANSITION = "startTransition";
  var startTransitionImpl = React2[START_TRANSITION];
  function MemoryRouter(_ref3) {
    let {
      basename,
      children,
      initialEntries,
      initialIndex,
      future
    } = _ref3;
    let historyRef = React2.useRef();
    if (historyRef.current == null) {
      historyRef.current = createMemoryHistory({
        initialEntries,
        initialIndex,
        v5Compat: true
      });
    }
    let history = historyRef.current;
    let [state, setStateImpl] = React2.useState({
      action: history.action,
      location: history.location
    });
    let {
      v7_startTransition
    } = future || {};
    let setState = React2.useCallback((newState) => {
      v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
    }, [setStateImpl, v7_startTransition]);
    React2.useLayoutEffect(() => history.listen(setState), [history, setState]);
    React2.useEffect(() => logV6DeprecationWarnings(future), [future]);
    return /* @__PURE__ */ React2.createElement(Router, {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      future
    });
  }
  function Navigate(_ref4) {
    let {
      to,
      replace: replace2,
      state,
      relative
    } = _ref4;
    !useInRouterContext() ? true ? invariant(
      false,
      // TODO: This error is probably because they somehow have 2 versions of
      // the router loaded. We can help them understand how to avoid that.
      "<Navigate> may be used only in the context of a <Router> component."
    ) : invariant(false) : void 0;
    let {
      future,
      static: isStatic
    } = React2.useContext(NavigationContext);
    true ? warning(!isStatic, "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.") : void 0;
    let {
      matches
    } = React2.useContext(RouteContext);
    let {
      pathname: locationPathname
    } = useLocation();
    let navigate = useNavigate();
    let path = resolveTo(to, getResolveToMatches(matches, future.v7_relativeSplatPath), locationPathname, relative === "path");
    let jsonPath = JSON.stringify(path);
    React2.useEffect(() => navigate(JSON.parse(jsonPath), {
      replace: replace2,
      state,
      relative
    }), [navigate, jsonPath, relative, replace2, state]);
    return null;
  }
  function Outlet(props) {
    return useOutlet(props.context);
  }
  function Route(_props) {
    true ? invariant(false, "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.") : invariant(false);
  }
  function Router(_ref5) {
    let {
      basename: basenameProp = "/",
      children = null,
      location: locationProp,
      navigationType = Action.Pop,
      navigator: navigator2,
      static: staticProp = false,
      future
    } = _ref5;
    !!useInRouterContext() ? true ? invariant(false, "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.") : invariant(false) : void 0;
    let basename = basenameProp.replace(/^\/*/, "/");
    let navigationContext = React2.useMemo(() => ({
      basename,
      navigator: navigator2,
      static: staticProp,
      future: _extends2({
        v7_relativeSplatPath: false
      }, future)
    }), [basename, future, navigator2, staticProp]);
    if (typeof locationProp === "string") {
      locationProp = parsePath(locationProp);
    }
    let {
      pathname = "/",
      search = "",
      hash = "",
      state = null,
      key = "default"
    } = locationProp;
    let locationContext = React2.useMemo(() => {
      let trailingPathname = stripBasename(pathname, basename);
      if (trailingPathname == null) {
        return null;
      }
      return {
        location: {
          pathname: trailingPathname,
          search,
          hash,
          state,
          key
        },
        navigationType
      };
    }, [basename, pathname, search, hash, state, key, navigationType]);
    true ? warning(locationContext != null, '<Router basename="' + basename + '"> is not able to match the URL ' + ('"' + pathname + search + hash + '" because it does not start with the ') + "basename, so the <Router> won't render anything.") : void 0;
    if (locationContext == null) {
      return null;
    }
    return /* @__PURE__ */ React2.createElement(NavigationContext.Provider, {
      value: navigationContext
    }, /* @__PURE__ */ React2.createElement(LocationContext.Provider, {
      children,
      value: locationContext
    }));
  }
  function Routes(_ref6) {
    let {
      children,
      location: location2
    } = _ref6;
    return useRoutes(createRoutesFromChildren(children), location2);
  }
  function Await(_ref7) {
    let {
      children,
      errorElement,
      resolve
    } = _ref7;
    return /* @__PURE__ */ React2.createElement(AwaitErrorBoundary, {
      resolve,
      errorElement
    }, /* @__PURE__ */ React2.createElement(ResolveAwait, null, children));
  }
  var AwaitRenderStatus = /* @__PURE__ */ (function(AwaitRenderStatus2) {
    AwaitRenderStatus2[AwaitRenderStatus2["pending"] = 0] = "pending";
    AwaitRenderStatus2[AwaitRenderStatus2["success"] = 1] = "success";
    AwaitRenderStatus2[AwaitRenderStatus2["error"] = 2] = "error";
    return AwaitRenderStatus2;
  })(AwaitRenderStatus || {});
  var neverSettledPromise = new Promise(() => {
  });
  var AwaitErrorBoundary = class extends React2.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null
      };
    }
    static getDerivedStateFromError(error) {
      return {
        error
      };
    }
    componentDidCatch(error, errorInfo) {
      console.error("<Await> caught the following error during render", error, errorInfo);
    }
    render() {
      let {
        children,
        errorElement,
        resolve
      } = this.props;
      let promise = null;
      let status = AwaitRenderStatus.pending;
      if (!(resolve instanceof Promise)) {
        status = AwaitRenderStatus.success;
        promise = Promise.resolve();
        Object.defineProperty(promise, "_tracked", {
          get: () => true
        });
        Object.defineProperty(promise, "_data", {
          get: () => resolve
        });
      } else if (this.state.error) {
        status = AwaitRenderStatus.error;
        let renderError = this.state.error;
        promise = Promise.reject().catch(() => {
        });
        Object.defineProperty(promise, "_tracked", {
          get: () => true
        });
        Object.defineProperty(promise, "_error", {
          get: () => renderError
        });
      } else if (resolve._tracked) {
        promise = resolve;
        status = "_error" in promise ? AwaitRenderStatus.error : "_data" in promise ? AwaitRenderStatus.success : AwaitRenderStatus.pending;
      } else {
        status = AwaitRenderStatus.pending;
        Object.defineProperty(resolve, "_tracked", {
          get: () => true
        });
        promise = resolve.then((data) => Object.defineProperty(resolve, "_data", {
          get: () => data
        }), (error) => Object.defineProperty(resolve, "_error", {
          get: () => error
        }));
      }
      if (status === AwaitRenderStatus.error && promise._error instanceof AbortedDeferredError) {
        throw neverSettledPromise;
      }
      if (status === AwaitRenderStatus.error && !errorElement) {
        throw promise._error;
      }
      if (status === AwaitRenderStatus.error) {
        return /* @__PURE__ */ React2.createElement(AwaitContext.Provider, {
          value: promise,
          children: errorElement
        });
      }
      if (status === AwaitRenderStatus.success) {
        return /* @__PURE__ */ React2.createElement(AwaitContext.Provider, {
          value: promise,
          children
        });
      }
      throw promise;
    }
  };
  function ResolveAwait(_ref8) {
    let {
      children
    } = _ref8;
    let data = useAsyncValue();
    let toRender = typeof children === "function" ? children(data) : children;
    return /* @__PURE__ */ React2.createElement(React2.Fragment, null, toRender);
  }
  function createRoutesFromChildren(children, parentPath) {
    if (parentPath === void 0) {
      parentPath = [];
    }
    let routes = [];
    React2.Children.forEach(children, (element, index) => {
      if (!/* @__PURE__ */ React2.isValidElement(element)) {
        return;
      }
      let treePath = [...parentPath, index];
      if (element.type === React2.Fragment) {
        routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
        return;
      }
      !(element.type === Route) ? true ? invariant(false, "[" + (typeof element.type === "string" ? element.type : element.type.name) + "] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>") : invariant(false) : void 0;
      !(!element.props.index || !element.props.children) ? true ? invariant(false, "An index route cannot have child routes.") : invariant(false) : void 0;
      let route = {
        id: element.props.id || treePath.join("-"),
        caseSensitive: element.props.caseSensitive,
        element: element.props.element,
        Component: element.props.Component,
        index: element.props.index,
        path: element.props.path,
        loader: element.props.loader,
        action: element.props.action,
        errorElement: element.props.errorElement,
        ErrorBoundary: element.props.ErrorBoundary,
        hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
        shouldRevalidate: element.props.shouldRevalidate,
        handle: element.props.handle,
        lazy: element.props.lazy
      };
      if (element.props.children) {
        route.children = createRoutesFromChildren(element.props.children, treePath);
      }
      routes.push(route);
    });
    return routes;
  }
  function renderMatches(matches) {
    return _renderMatches(matches);
  }
  function mapRouteProperties(route) {
    let updates = {
      // Note: this check also occurs in createRoutesFromChildren so update
      // there if you change this -- please and thank you!
      hasErrorBoundary: route.ErrorBoundary != null || route.errorElement != null
    };
    if (route.Component) {
      if (true) {
        if (route.element) {
          true ? warning(false, "You should not include both `Component` and `element` on your route - `Component` will be used.") : void 0;
        }
      }
      Object.assign(updates, {
        element: /* @__PURE__ */ React2.createElement(route.Component),
        Component: void 0
      });
    }
    if (route.HydrateFallback) {
      if (true) {
        if (route.hydrateFallbackElement) {
          true ? warning(false, "You should not include both `HydrateFallback` and `hydrateFallbackElement` on your route - `HydrateFallback` will be used.") : void 0;
        }
      }
      Object.assign(updates, {
        hydrateFallbackElement: /* @__PURE__ */ React2.createElement(route.HydrateFallback),
        HydrateFallback: void 0
      });
    }
    if (route.ErrorBoundary) {
      if (true) {
        if (route.errorElement) {
          true ? warning(false, "You should not include both `ErrorBoundary` and `errorElement` on your route - `ErrorBoundary` will be used.") : void 0;
        }
      }
      Object.assign(updates, {
        errorElement: /* @__PURE__ */ React2.createElement(route.ErrorBoundary),
        ErrorBoundary: void 0
      });
    }
    return updates;
  }
  function createMemoryRouter(routes, opts) {
    return createRouter({
      basename: opts == null ? void 0 : opts.basename,
      future: _extends2({}, opts == null ? void 0 : opts.future, {
        v7_prependBasename: true
      }),
      history: createMemoryHistory({
        initialEntries: opts == null ? void 0 : opts.initialEntries,
        initialIndex: opts == null ? void 0 : opts.initialIndex
      }),
      hydrationData: opts == null ? void 0 : opts.hydrationData,
      routes,
      mapRouteProperties,
      dataStrategy: opts == null ? void 0 : opts.dataStrategy,
      patchRoutesOnNavigation: opts == null ? void 0 : opts.patchRoutesOnNavigation
    }).initialize();
  }

  // node_modules/react-router-dom/dist/index.js
  function _extends3() {
    return _extends3 = Object.assign ? Object.assign.bind() : function(n) {
      for (var e = 1; e < arguments.length; e++) {
        var t2 = arguments[e];
        for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n[r2] = t2[r2]);
      }
      return n;
    }, _extends3.apply(null, arguments);
  }
  function _objectWithoutPropertiesLoose(r2, e) {
    if (null == r2) return {};
    var t2 = {};
    for (var n in r2) if ({}.hasOwnProperty.call(r2, n)) {
      if (-1 !== e.indexOf(n)) continue;
      t2[n] = r2[n];
    }
    return t2;
  }
  var defaultMethod = "get";
  var defaultEncType = "application/x-www-form-urlencoded";
  function isHtmlElement(object) {
    return object != null && typeof object.tagName === "string";
  }
  function isButtonElement(object) {
    return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
  }
  function isFormElement(object) {
    return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
  }
  function isInputElement(object) {
    return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
  }
  function isModifiedEvent(event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
  }
  function shouldProcessLinkClick(event, target) {
    return event.button === 0 && // Ignore everything but left clicks
    (!target || target === "_self") && // Let browser handle "target=_blank" etc.
    !isModifiedEvent(event);
  }
  function createSearchParams(init) {
    if (init === void 0) {
      init = "";
    }
    return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo2, key) => {
      let value = init[key];
      return memo2.concat(Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]);
    }, []));
  }
  function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
    let searchParams = createSearchParams(locationSearch);
    if (defaultSearchParams) {
      defaultSearchParams.forEach((_, key) => {
        if (!searchParams.has(key)) {
          defaultSearchParams.getAll(key).forEach((value) => {
            searchParams.append(key, value);
          });
        }
      });
    }
    return searchParams;
  }
  var _formDataSupportsSubmitter = null;
  function isFormDataSubmitterSupported() {
    if (_formDataSupportsSubmitter === null) {
      try {
        new FormData(
          document.createElement("form"),
          // @ts-expect-error if FormData supports the submitter parameter, this will throw
          0
        );
        _formDataSupportsSubmitter = false;
      } catch (e) {
        _formDataSupportsSubmitter = true;
      }
    }
    return _formDataSupportsSubmitter;
  }
  var supportedFormEncTypes = /* @__PURE__ */ new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
  function getFormEncType(encType) {
    if (encType != null && !supportedFormEncTypes.has(encType)) {
      true ? warning(false, '"' + encType + '" is not a valid `encType` for `<Form>`/`<fetcher.Form>` ' + ('and will default to "' + defaultEncType + '"')) : void 0;
      return null;
    }
    return encType;
  }
  function getFormSubmissionInfo(target, basename) {
    let method;
    let action;
    let encType;
    let formData;
    let body;
    if (isFormElement(target)) {
      let attr = target.getAttribute("action");
      action = attr ? stripBasename(attr, basename) : null;
      method = target.getAttribute("method") || defaultMethod;
      encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
      formData = new FormData(target);
    } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
      let form = target.form;
      if (form == null) {
        throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
      }
      let attr = target.getAttribute("formaction") || form.getAttribute("action");
      action = attr ? stripBasename(attr, basename) : null;
      method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
      encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
      formData = new FormData(form, target);
      if (!isFormDataSubmitterSupported()) {
        let {
          name,
          type,
          value
        } = target;
        if (type === "image") {
          let prefix = name ? name + "." : "";
          formData.append(prefix + "x", "0");
          formData.append(prefix + "y", "0");
        } else if (name) {
          formData.append(name, value);
        }
      }
    } else if (isHtmlElement(target)) {
      throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
    } else {
      method = defaultMethod;
      action = null;
      encType = defaultEncType;
      body = target;
    }
    if (formData && encType === "text/plain") {
      body = formData;
      formData = void 0;
    }
    return {
      action,
      method: method.toLowerCase(),
      encType,
      formData,
      body
    };
  }
  var _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"];
  var _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "viewTransition", "children"];
  var _excluded3 = ["fetcherKey", "navigate", "reloadDocument", "replace", "state", "method", "action", "onSubmit", "relative", "preventScrollReset", "viewTransition"];
  var REACT_ROUTER_VERSION = "6";
  try {
    window.__reactRouterVersion = REACT_ROUTER_VERSION;
  } catch (e) {
  }
  function createBrowserRouter(routes, opts) {
    return createRouter({
      basename: opts == null ? void 0 : opts.basename,
      future: _extends3({}, opts == null ? void 0 : opts.future, {
        v7_prependBasename: true
      }),
      history: createBrowserHistory({
        window: opts == null ? void 0 : opts.window
      }),
      hydrationData: (opts == null ? void 0 : opts.hydrationData) || parseHydrationData(),
      routes,
      mapRouteProperties,
      dataStrategy: opts == null ? void 0 : opts.dataStrategy,
      patchRoutesOnNavigation: opts == null ? void 0 : opts.patchRoutesOnNavigation,
      window: opts == null ? void 0 : opts.window
    }).initialize();
  }
  function createHashRouter(routes, opts) {
    return createRouter({
      basename: opts == null ? void 0 : opts.basename,
      future: _extends3({}, opts == null ? void 0 : opts.future, {
        v7_prependBasename: true
      }),
      history: createHashHistory({
        window: opts == null ? void 0 : opts.window
      }),
      hydrationData: (opts == null ? void 0 : opts.hydrationData) || parseHydrationData(),
      routes,
      mapRouteProperties,
      dataStrategy: opts == null ? void 0 : opts.dataStrategy,
      patchRoutesOnNavigation: opts == null ? void 0 : opts.patchRoutesOnNavigation,
      window: opts == null ? void 0 : opts.window
    }).initialize();
  }
  function parseHydrationData() {
    var _window;
    let state = (_window = window) == null ? void 0 : _window.__staticRouterHydrationData;
    if (state && state.errors) {
      state = _extends3({}, state, {
        errors: deserializeErrors(state.errors)
      });
    }
    return state;
  }
  function deserializeErrors(errors) {
    if (!errors) return null;
    let entries = Object.entries(errors);
    let serialized = {};
    for (let [key, val] of entries) {
      if (val && val.__type === "RouteErrorResponse") {
        serialized[key] = new ErrorResponseImpl(val.status, val.statusText, val.data, val.internal === true);
      } else if (val && val.__type === "Error") {
        if (val.__subType) {
          let ErrorConstructor = window[val.__subType];
          if (typeof ErrorConstructor === "function") {
            try {
              let error = new ErrorConstructor(val.message);
              error.stack = "";
              serialized[key] = error;
            } catch (e) {
            }
          }
        }
        if (serialized[key] == null) {
          let error = new Error(val.message);
          error.stack = "";
          serialized[key] = error;
        }
      } else {
        serialized[key] = val;
      }
    }
    return serialized;
  }
  var ViewTransitionContext = /* @__PURE__ */ React3.createContext({
    isTransitioning: false
  });
  if (true) {
    ViewTransitionContext.displayName = "ViewTransition";
  }
  var FetchersContext = /* @__PURE__ */ React3.createContext(/* @__PURE__ */ new Map());
  if (true) {
    FetchersContext.displayName = "Fetchers";
  }
  var START_TRANSITION2 = "startTransition";
  var startTransitionImpl2 = React3[START_TRANSITION2];
  var FLUSH_SYNC = "flushSync";
  var flushSyncImpl = ReactDOM[FLUSH_SYNC];
  var USE_ID = "useId";
  var useIdImpl = React3[USE_ID];
  function startTransitionSafe(cb) {
    if (startTransitionImpl2) {
      startTransitionImpl2(cb);
    } else {
      cb();
    }
  }
  function flushSyncSafe(cb) {
    if (flushSyncImpl) {
      flushSyncImpl(cb);
    } else {
      cb();
    }
  }
  var Deferred = class {
    constructor() {
      this.status = "pending";
      this.promise = new Promise((resolve, reject) => {
        this.resolve = (value) => {
          if (this.status === "pending") {
            this.status = "resolved";
            resolve(value);
          }
        };
        this.reject = (reason) => {
          if (this.status === "pending") {
            this.status = "rejected";
            reject(reason);
          }
        };
      });
    }
  };
  function RouterProvider(_ref) {
    let {
      fallbackElement,
      router,
      future
    } = _ref;
    let [state, setStateImpl] = React3.useState(router.state);
    let [pendingState, setPendingState] = React3.useState();
    let [vtContext, setVtContext] = React3.useState({
      isTransitioning: false
    });
    let [renderDfd, setRenderDfd] = React3.useState();
    let [transition, setTransition] = React3.useState();
    let [interruption, setInterruption] = React3.useState();
    let fetcherData = React3.useRef(/* @__PURE__ */ new Map());
    let {
      v7_startTransition
    } = future || {};
    let optInStartTransition = React3.useCallback((cb) => {
      if (v7_startTransition) {
        startTransitionSafe(cb);
      } else {
        cb();
      }
    }, [v7_startTransition]);
    let setState = React3.useCallback((newState, _ref2) => {
      let {
        deletedFetchers,
        flushSync,
        viewTransitionOpts
      } = _ref2;
      newState.fetchers.forEach((fetcher, key) => {
        if (fetcher.data !== void 0) {
          fetcherData.current.set(key, fetcher.data);
        }
      });
      deletedFetchers.forEach((key) => fetcherData.current.delete(key));
      let isViewTransitionUnavailable = router.window == null || router.window.document == null || typeof router.window.document.startViewTransition !== "function";
      if (!viewTransitionOpts || isViewTransitionUnavailable) {
        if (flushSync) {
          flushSyncSafe(() => setStateImpl(newState));
        } else {
          optInStartTransition(() => setStateImpl(newState));
        }
        return;
      }
      if (flushSync) {
        flushSyncSafe(() => {
          if (transition) {
            renderDfd && renderDfd.resolve();
            transition.skipTransition();
          }
          setVtContext({
            isTransitioning: true,
            flushSync: true,
            currentLocation: viewTransitionOpts.currentLocation,
            nextLocation: viewTransitionOpts.nextLocation
          });
        });
        let t2 = router.window.document.startViewTransition(() => {
          flushSyncSafe(() => setStateImpl(newState));
        });
        t2.finished.finally(() => {
          flushSyncSafe(() => {
            setRenderDfd(void 0);
            setTransition(void 0);
            setPendingState(void 0);
            setVtContext({
              isTransitioning: false
            });
          });
        });
        flushSyncSafe(() => setTransition(t2));
        return;
      }
      if (transition) {
        renderDfd && renderDfd.resolve();
        transition.skipTransition();
        setInterruption({
          state: newState,
          currentLocation: viewTransitionOpts.currentLocation,
          nextLocation: viewTransitionOpts.nextLocation
        });
      } else {
        setPendingState(newState);
        setVtContext({
          isTransitioning: true,
          flushSync: false,
          currentLocation: viewTransitionOpts.currentLocation,
          nextLocation: viewTransitionOpts.nextLocation
        });
      }
    }, [router.window, transition, renderDfd, fetcherData, optInStartTransition]);
    React3.useLayoutEffect(() => router.subscribe(setState), [router, setState]);
    React3.useEffect(() => {
      if (vtContext.isTransitioning && !vtContext.flushSync) {
        setRenderDfd(new Deferred());
      }
    }, [vtContext]);
    React3.useEffect(() => {
      if (renderDfd && pendingState && router.window) {
        let newState = pendingState;
        let renderPromise = renderDfd.promise;
        let transition2 = router.window.document.startViewTransition(async () => {
          optInStartTransition(() => setStateImpl(newState));
          await renderPromise;
        });
        transition2.finished.finally(() => {
          setRenderDfd(void 0);
          setTransition(void 0);
          setPendingState(void 0);
          setVtContext({
            isTransitioning: false
          });
        });
        setTransition(transition2);
      }
    }, [optInStartTransition, pendingState, renderDfd, router.window]);
    React3.useEffect(() => {
      if (renderDfd && pendingState && state.location.key === pendingState.location.key) {
        renderDfd.resolve();
      }
    }, [renderDfd, transition, state.location, pendingState]);
    React3.useEffect(() => {
      if (!vtContext.isTransitioning && interruption) {
        setPendingState(interruption.state);
        setVtContext({
          isTransitioning: true,
          flushSync: false,
          currentLocation: interruption.currentLocation,
          nextLocation: interruption.nextLocation
        });
        setInterruption(void 0);
      }
    }, [vtContext.isTransitioning, interruption]);
    React3.useEffect(() => {
      true ? warning(fallbackElement == null || !router.future.v7_partialHydration, "`<RouterProvider fallbackElement>` is deprecated when using `v7_partialHydration`, use a `HydrateFallback` component instead") : void 0;
    }, []);
    let navigator2 = React3.useMemo(() => {
      return {
        createHref: router.createHref,
        encodeLocation: router.encodeLocation,
        go: (n) => router.navigate(n),
        push: (to, state2, opts) => router.navigate(to, {
          state: state2,
          preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
        }),
        replace: (to, state2, opts) => router.navigate(to, {
          replace: true,
          state: state2,
          preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
        })
      };
    }, [router]);
    let basename = router.basename || "/";
    let dataRouterContext = React3.useMemo(() => ({
      router,
      navigator: navigator2,
      static: false,
      basename
    }), [router, navigator2, basename]);
    let routerFuture = React3.useMemo(() => ({
      v7_relativeSplatPath: router.future.v7_relativeSplatPath
    }), [router.future.v7_relativeSplatPath]);
    React3.useEffect(() => logV6DeprecationWarnings(future, router.future), [future, router.future]);
    return /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement(DataRouterContext.Provider, {
      value: dataRouterContext
    }, /* @__PURE__ */ React3.createElement(DataRouterStateContext.Provider, {
      value: state
    }, /* @__PURE__ */ React3.createElement(FetchersContext.Provider, {
      value: fetcherData.current
    }, /* @__PURE__ */ React3.createElement(ViewTransitionContext.Provider, {
      value: vtContext
    }, /* @__PURE__ */ React3.createElement(Router, {
      basename,
      location: state.location,
      navigationType: state.historyAction,
      navigator: navigator2,
      future: routerFuture
    }, state.initialized || router.future.v7_partialHydration ? /* @__PURE__ */ React3.createElement(MemoizedDataRoutes, {
      routes: router.routes,
      future: router.future,
      state
    }) : fallbackElement))))), null);
  }
  var MemoizedDataRoutes = /* @__PURE__ */ React3.memo(DataRoutes);
  function DataRoutes(_ref3) {
    let {
      routes,
      future,
      state
    } = _ref3;
    return useRoutesImpl(routes, void 0, state, future);
  }
  function BrowserRouter(_ref4) {
    let {
      basename,
      children,
      future,
      window: window2
    } = _ref4;
    let historyRef = React3.useRef();
    if (historyRef.current == null) {
      historyRef.current = createBrowserHistory({
        window: window2,
        v5Compat: true
      });
    }
    let history = historyRef.current;
    let [state, setStateImpl] = React3.useState({
      action: history.action,
      location: history.location
    });
    let {
      v7_startTransition
    } = future || {};
    let setState = React3.useCallback((newState) => {
      v7_startTransition && startTransitionImpl2 ? startTransitionImpl2(() => setStateImpl(newState)) : setStateImpl(newState);
    }, [setStateImpl, v7_startTransition]);
    React3.useLayoutEffect(() => history.listen(setState), [history, setState]);
    React3.useEffect(() => logV6DeprecationWarnings(future), [future]);
    return /* @__PURE__ */ React3.createElement(Router, {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      future
    });
  }
  function HashRouter(_ref5) {
    let {
      basename,
      children,
      future,
      window: window2
    } = _ref5;
    let historyRef = React3.useRef();
    if (historyRef.current == null) {
      historyRef.current = createHashHistory({
        window: window2,
        v5Compat: true
      });
    }
    let history = historyRef.current;
    let [state, setStateImpl] = React3.useState({
      action: history.action,
      location: history.location
    });
    let {
      v7_startTransition
    } = future || {};
    let setState = React3.useCallback((newState) => {
      v7_startTransition && startTransitionImpl2 ? startTransitionImpl2(() => setStateImpl(newState)) : setStateImpl(newState);
    }, [setStateImpl, v7_startTransition]);
    React3.useLayoutEffect(() => history.listen(setState), [history, setState]);
    React3.useEffect(() => logV6DeprecationWarnings(future), [future]);
    return /* @__PURE__ */ React3.createElement(Router, {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      future
    });
  }
  function HistoryRouter(_ref6) {
    let {
      basename,
      children,
      future,
      history
    } = _ref6;
    let [state, setStateImpl] = React3.useState({
      action: history.action,
      location: history.location
    });
    let {
      v7_startTransition
    } = future || {};
    let setState = React3.useCallback((newState) => {
      v7_startTransition && startTransitionImpl2 ? startTransitionImpl2(() => setStateImpl(newState)) : setStateImpl(newState);
    }, [setStateImpl, v7_startTransition]);
    React3.useLayoutEffect(() => history.listen(setState), [history, setState]);
    React3.useEffect(() => logV6DeprecationWarnings(future), [future]);
    return /* @__PURE__ */ React3.createElement(Router, {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      future
    });
  }
  if (true) {
    HistoryRouter.displayName = "unstable_HistoryRouter";
  }
  var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
  var ABSOLUTE_URL_REGEX2 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
  var Link = /* @__PURE__ */ React3.forwardRef(function LinkWithRef(_ref7, ref) {
    let {
      onClick,
      relative,
      reloadDocument,
      replace: replace2,
      state,
      target,
      to,
      preventScrollReset,
      viewTransition
    } = _ref7, rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
    let {
      basename
    } = React3.useContext(NavigationContext);
    let absoluteHref;
    let isExternal = false;
    if (typeof to === "string" && ABSOLUTE_URL_REGEX2.test(to)) {
      absoluteHref = to;
      if (isBrowser) {
        try {
          let currentUrl = new URL(window.location.href);
          let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
          let path = stripBasename(targetUrl.pathname, basename);
          if (targetUrl.origin === currentUrl.origin && path != null) {
            to = path + targetUrl.search + targetUrl.hash;
          } else {
            isExternal = true;
          }
        } catch (e) {
          true ? warning(false, '<Link to="' + to + '"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.') : void 0;
        }
      }
    }
    let href = useHref(to, {
      relative
    });
    let internalOnClick = useLinkClickHandler(to, {
      replace: replace2,
      state,
      target,
      preventScrollReset,
      relative,
      viewTransition
    });
    function handleClick(event) {
      if (onClick) onClick(event);
      if (!event.defaultPrevented) {
        internalOnClick(event);
      }
    }
    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ React3.createElement("a", _extends3({}, rest, {
        href: absoluteHref || href,
        onClick: isExternal || reloadDocument ? onClick : handleClick,
        ref,
        target
      }))
    );
  });
  if (true) {
    Link.displayName = "Link";
  }
  var NavLink = /* @__PURE__ */ React3.forwardRef(function NavLinkWithRef(_ref8, ref) {
    let {
      "aria-current": ariaCurrentProp = "page",
      caseSensitive = false,
      className: classNameProp = "",
      end = false,
      style: styleProp,
      to,
      viewTransition,
      children
    } = _ref8, rest = _objectWithoutPropertiesLoose(_ref8, _excluded2);
    let path = useResolvedPath(to, {
      relative: rest.relative
    });
    let location2 = useLocation();
    let routerState = React3.useContext(DataRouterStateContext);
    let {
      navigator: navigator2,
      basename
    } = React3.useContext(NavigationContext);
    let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useViewTransitionState(path) && viewTransition === true;
    let toPathname = navigator2.encodeLocation ? navigator2.encodeLocation(path).pathname : path.pathname;
    let locationPathname = location2.pathname;
    let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
    if (!caseSensitive) {
      locationPathname = locationPathname.toLowerCase();
      nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
      toPathname = toPathname.toLowerCase();
    }
    if (nextLocationPathname && basename) {
      nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
    }
    const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
    let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
    let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
    let renderProps = {
      isActive,
      isPending,
      isTransitioning
    };
    let ariaCurrent = isActive ? ariaCurrentProp : void 0;
    let className;
    if (typeof classNameProp === "function") {
      className = classNameProp(renderProps);
    } else {
      className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null, isTransitioning ? "transitioning" : null].filter(Boolean).join(" ");
    }
    let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
    return /* @__PURE__ */ React3.createElement(Link, _extends3({}, rest, {
      "aria-current": ariaCurrent,
      className,
      ref,
      style,
      to,
      viewTransition
    }), typeof children === "function" ? children(renderProps) : children);
  });
  if (true) {
    NavLink.displayName = "NavLink";
  }
  var Form = /* @__PURE__ */ React3.forwardRef((_ref9, forwardedRef) => {
    let {
      fetcherKey,
      navigate,
      reloadDocument,
      replace: replace2,
      state,
      method = defaultMethod,
      action,
      onSubmit,
      relative,
      preventScrollReset,
      viewTransition
    } = _ref9, props = _objectWithoutPropertiesLoose(_ref9, _excluded3);
    let submit = useSubmit();
    let formAction = useFormAction(action, {
      relative
    });
    let formMethod = method.toLowerCase() === "get" ? "get" : "post";
    let submitHandler = (event) => {
      onSubmit && onSubmit(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      let submitter = event.nativeEvent.submitter;
      let submitMethod = (submitter == null ? void 0 : submitter.getAttribute("formmethod")) || method;
      submit(submitter || event.currentTarget, {
        fetcherKey,
        method: submitMethod,
        navigate,
        replace: replace2,
        state,
        relative,
        preventScrollReset,
        viewTransition
      });
    };
    return /* @__PURE__ */ React3.createElement("form", _extends3({
      ref: forwardedRef,
      method: formMethod,
      action: formAction,
      onSubmit: reloadDocument ? onSubmit : submitHandler
    }, props));
  });
  if (true) {
    Form.displayName = "Form";
  }
  function ScrollRestoration(_ref0) {
    let {
      getKey,
      storageKey
    } = _ref0;
    useScrollRestoration({
      getKey,
      storageKey
    });
    return null;
  }
  if (true) {
    ScrollRestoration.displayName = "ScrollRestoration";
  }
  var DataRouterHook2;
  (function(DataRouterHook3) {
    DataRouterHook3["UseScrollRestoration"] = "useScrollRestoration";
    DataRouterHook3["UseSubmit"] = "useSubmit";
    DataRouterHook3["UseSubmitFetcher"] = "useSubmitFetcher";
    DataRouterHook3["UseFetcher"] = "useFetcher";
    DataRouterHook3["useViewTransitionState"] = "useViewTransitionState";
  })(DataRouterHook2 || (DataRouterHook2 = {}));
  var DataRouterStateHook2;
  (function(DataRouterStateHook3) {
    DataRouterStateHook3["UseFetcher"] = "useFetcher";
    DataRouterStateHook3["UseFetchers"] = "useFetchers";
    DataRouterStateHook3["UseScrollRestoration"] = "useScrollRestoration";
  })(DataRouterStateHook2 || (DataRouterStateHook2 = {}));
  function getDataRouterConsoleError2(hookName) {
    return hookName + " must be used within a data router.  See https://reactrouter.com/v6/routers/picking-a-router.";
  }
  function useDataRouterContext2(hookName) {
    let ctx = React3.useContext(DataRouterContext);
    !ctx ? true ? invariant(false, getDataRouterConsoleError2(hookName)) : invariant(false) : void 0;
    return ctx;
  }
  function useDataRouterState2(hookName) {
    let state = React3.useContext(DataRouterStateContext);
    !state ? true ? invariant(false, getDataRouterConsoleError2(hookName)) : invariant(false) : void 0;
    return state;
  }
  function useLinkClickHandler(to, _temp) {
    let {
      target,
      replace: replaceProp,
      state,
      preventScrollReset,
      relative,
      viewTransition
    } = _temp === void 0 ? {} : _temp;
    let navigate = useNavigate();
    let location2 = useLocation();
    let path = useResolvedPath(to, {
      relative
    });
    return React3.useCallback((event) => {
      if (shouldProcessLinkClick(event, target)) {
        event.preventDefault();
        let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location2) === createPath(path);
        navigate(to, {
          replace: replace2,
          state,
          preventScrollReset,
          relative,
          viewTransition
        });
      }
    }, [location2, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, viewTransition]);
  }
  function useSearchParams(defaultInit) {
    true ? warning(typeof URLSearchParams !== "undefined", "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.") : void 0;
    let defaultSearchParamsRef = React3.useRef(createSearchParams(defaultInit));
    let hasSetSearchParamsRef = React3.useRef(false);
    let location2 = useLocation();
    let searchParams = React3.useMemo(() => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      getSearchParamsForLocation(location2.search, hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current)
    ), [location2.search]);
    let navigate = useNavigate();
    let setSearchParams = React3.useCallback((nextInit, navigateOptions) => {
      const newSearchParams = createSearchParams(typeof nextInit === "function" ? nextInit(searchParams) : nextInit);
      hasSetSearchParamsRef.current = true;
      navigate("?" + newSearchParams, navigateOptions);
    }, [navigate, searchParams]);
    return [searchParams, setSearchParams];
  }
  function validateClientSideSubmission() {
    if (typeof document === "undefined") {
      throw new Error("You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead.");
    }
  }
  var fetcherId = 0;
  var getUniqueFetcherId = () => "__" + String(++fetcherId) + "__";
  function useSubmit() {
    let {
      router
    } = useDataRouterContext2(DataRouterHook2.UseSubmit);
    let {
      basename
    } = React3.useContext(NavigationContext);
    let currentRouteId = useRouteId();
    return React3.useCallback(function(target, options) {
      if (options === void 0) {
        options = {};
      }
      validateClientSideSubmission();
      let {
        action,
        method,
        encType,
        formData,
        body
      } = getFormSubmissionInfo(target, basename);
      if (options.navigate === false) {
        let key = options.fetcherKey || getUniqueFetcherId();
        router.fetch(key, currentRouteId, options.action || action, {
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          flushSync: options.flushSync
        });
      } else {
        router.navigate(options.action || action, {
          preventScrollReset: options.preventScrollReset,
          formData,
          body,
          formMethod: options.method || method,
          formEncType: options.encType || encType,
          replace: options.replace,
          state: options.state,
          fromRouteId: currentRouteId,
          flushSync: options.flushSync,
          viewTransition: options.viewTransition
        });
      }
    }, [router, basename, currentRouteId]);
  }
  function useFormAction(action, _temp2) {
    let {
      relative
    } = _temp2 === void 0 ? {} : _temp2;
    let {
      basename
    } = React3.useContext(NavigationContext);
    let routeContext = React3.useContext(RouteContext);
    !routeContext ? true ? invariant(false, "useFormAction must be used inside a RouteContext") : invariant(false) : void 0;
    let [match] = routeContext.matches.slice(-1);
    let path = _extends3({}, useResolvedPath(action ? action : ".", {
      relative
    }));
    let location2 = useLocation();
    if (action == null) {
      path.search = location2.search;
      let params = new URLSearchParams(path.search);
      let indexValues = params.getAll("index");
      let hasNakedIndexParam = indexValues.some((v) => v === "");
      if (hasNakedIndexParam) {
        params.delete("index");
        indexValues.filter((v) => v).forEach((v) => params.append("index", v));
        let qs = params.toString();
        path.search = qs ? "?" + qs : "";
      }
    }
    if ((!action || action === ".") && match.route.index) {
      path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
    }
    if (basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    return createPath(path);
  }
  function useFetcher(_temp3) {
    var _route$matches;
    let {
      key
    } = _temp3 === void 0 ? {} : _temp3;
    let {
      router
    } = useDataRouterContext2(DataRouterHook2.UseFetcher);
    let state = useDataRouterState2(DataRouterStateHook2.UseFetcher);
    let fetcherData = React3.useContext(FetchersContext);
    let route = React3.useContext(RouteContext);
    let routeId = (_route$matches = route.matches[route.matches.length - 1]) == null ? void 0 : _route$matches.route.id;
    !fetcherData ? true ? invariant(false, "useFetcher must be used inside a FetchersContext") : invariant(false) : void 0;
    !route ? true ? invariant(false, "useFetcher must be used inside a RouteContext") : invariant(false) : void 0;
    !(routeId != null) ? true ? invariant(false, 'useFetcher can only be used on routes that contain a unique "id"') : invariant(false) : void 0;
    let defaultKey = useIdImpl ? useIdImpl() : "";
    let [fetcherKey, setFetcherKey] = React3.useState(key || defaultKey);
    if (key && key !== fetcherKey) {
      setFetcherKey(key);
    } else if (!fetcherKey) {
      setFetcherKey(getUniqueFetcherId());
    }
    React3.useEffect(() => {
      router.getFetcher(fetcherKey);
      return () => {
        router.deleteFetcher(fetcherKey);
      };
    }, [router, fetcherKey]);
    let load = React3.useCallback((href, opts) => {
      !routeId ? true ? invariant(false, "No routeId available for fetcher.load()") : invariant(false) : void 0;
      router.fetch(fetcherKey, routeId, href, opts);
    }, [fetcherKey, routeId, router]);
    let submitImpl = useSubmit();
    let submit = React3.useCallback((target, opts) => {
      submitImpl(target, _extends3({}, opts, {
        navigate: false,
        fetcherKey
      }));
    }, [fetcherKey, submitImpl]);
    let FetcherForm = React3.useMemo(() => {
      let FetcherForm2 = /* @__PURE__ */ React3.forwardRef((props, ref) => {
        return /* @__PURE__ */ React3.createElement(Form, _extends3({}, props, {
          navigate: false,
          fetcherKey,
          ref
        }));
      });
      if (true) {
        FetcherForm2.displayName = "fetcher.Form";
      }
      return FetcherForm2;
    }, [fetcherKey]);
    let fetcher = state.fetchers.get(fetcherKey) || IDLE_FETCHER;
    let data = fetcherData.get(fetcherKey);
    let fetcherWithComponents = React3.useMemo(() => _extends3({
      Form: FetcherForm,
      submit,
      load
    }, fetcher, {
      data
    }), [FetcherForm, submit, load, fetcher, data]);
    return fetcherWithComponents;
  }
  function useFetchers() {
    let state = useDataRouterState2(DataRouterStateHook2.UseFetchers);
    return Array.from(state.fetchers.entries()).map((_ref1) => {
      let [key, fetcher] = _ref1;
      return _extends3({}, fetcher, {
        key
      });
    });
  }
  var SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
  var savedScrollPositions = {};
  function useScrollRestoration(_temp4) {
    let {
      getKey,
      storageKey
    } = _temp4 === void 0 ? {} : _temp4;
    let {
      router
    } = useDataRouterContext2(DataRouterHook2.UseScrollRestoration);
    let {
      restoreScrollPosition,
      preventScrollReset
    } = useDataRouterState2(DataRouterStateHook2.UseScrollRestoration);
    let {
      basename
    } = React3.useContext(NavigationContext);
    let location2 = useLocation();
    let matches = useMatches();
    let navigation = useNavigation();
    React3.useEffect(() => {
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = "auto";
      };
    }, []);
    usePageHide(React3.useCallback(() => {
      if (navigation.state === "idle") {
        let key = (getKey ? getKey(location2, matches) : null) || location2.key;
        savedScrollPositions[key] = window.scrollY;
      }
      try {
        sessionStorage.setItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY, JSON.stringify(savedScrollPositions));
      } catch (error) {
        true ? warning(false, "Failed to save scroll positions in sessionStorage, <ScrollRestoration /> will not work properly (" + error + ").") : void 0;
      }
      window.history.scrollRestoration = "auto";
    }, [storageKey, getKey, navigation.state, location2, matches]));
    if (typeof document !== "undefined") {
      React3.useLayoutEffect(() => {
        try {
          let sessionPositions = sessionStorage.getItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY);
          if (sessionPositions) {
            savedScrollPositions = JSON.parse(sessionPositions);
          }
        } catch (e) {
        }
      }, [storageKey]);
      React3.useLayoutEffect(() => {
        let getKeyWithoutBasename = getKey && basename !== "/" ? (location3, matches2) => getKey(
          // Strip the basename to match useLocation()
          _extends3({}, location3, {
            pathname: stripBasename(location3.pathname, basename) || location3.pathname
          }),
          matches2
        ) : getKey;
        let disableScrollRestoration = router == null ? void 0 : router.enableScrollRestoration(savedScrollPositions, () => window.scrollY, getKeyWithoutBasename);
        return () => disableScrollRestoration && disableScrollRestoration();
      }, [router, basename, getKey]);
      React3.useLayoutEffect(() => {
        if (restoreScrollPosition === false) {
          return;
        }
        if (typeof restoreScrollPosition === "number") {
          window.scrollTo(0, restoreScrollPosition);
          return;
        }
        if (location2.hash) {
          let el = document.getElementById(decodeURIComponent(location2.hash.slice(1)));
          if (el) {
            el.scrollIntoView();
            return;
          }
        }
        if (preventScrollReset === true) {
          return;
        }
        window.scrollTo(0, 0);
      }, [location2, restoreScrollPosition, preventScrollReset]);
    }
  }
  function useBeforeUnload(callback, options) {
    let {
      capture
    } = options || {};
    React3.useEffect(() => {
      let opts = capture != null ? {
        capture
      } : void 0;
      window.addEventListener("beforeunload", callback, opts);
      return () => {
        window.removeEventListener("beforeunload", callback, opts);
      };
    }, [callback, capture]);
  }
  function usePageHide(callback, options) {
    let {
      capture
    } = options || {};
    React3.useEffect(() => {
      let opts = capture != null ? {
        capture
      } : void 0;
      window.addEventListener("pagehide", callback, opts);
      return () => {
        window.removeEventListener("pagehide", callback, opts);
      };
    }, [callback, capture]);
  }
  function usePrompt(_ref10) {
    let {
      when,
      message
    } = _ref10;
    let blocker = useBlocker(when);
    React3.useEffect(() => {
      if (blocker.state === "blocked") {
        let proceed = window.confirm(message);
        if (proceed) {
          setTimeout(blocker.proceed, 0);
        } else {
          blocker.reset();
        }
      }
    }, [blocker, message]);
    React3.useEffect(() => {
      if (blocker.state === "blocked" && !when) {
        blocker.reset();
      }
    }, [blocker, when]);
  }
  function useViewTransitionState(to, opts) {
    if (opts === void 0) {
      opts = {};
    }
    let vtContext = React3.useContext(ViewTransitionContext);
    !(vtContext != null) ? true ? invariant(false, "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?") : invariant(false) : void 0;
    let {
      basename
    } = useDataRouterContext2(DataRouterHook2.useViewTransitionState);
    let path = useResolvedPath(to, {
      relative: opts.relative
    });
    if (!vtContext.isTransitioning) {
      return false;
    }
    let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
    let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
    return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
  }

  // src/stores/uiStore.ts
  init_define_import_meta_env();

  // node_modules/zustand/esm/index.mjs
  init_define_import_meta_env();

  // node_modules/zustand/esm/vanilla.mjs
  init_define_import_meta_env();
  var createStoreImpl = (createState) => {
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState = (partial, replace2) => {
      const nextState = typeof partial === "function" ? partial(state) : partial;
      if (!Object.is(nextState, state)) {
        const previousState = state;
        state = (replace2 != null ? replace2 : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
        listeners.forEach((listener) => listener(state, previousState));
      }
    };
    const getState = () => state;
    const getInitialState = () => initialState;
    const subscribe = (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };
    const destroy = () => {
      if ((define_import_meta_env_default ? define_import_meta_env_default.MODE : void 0) !== "production") {
        console.warn(
          "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
        );
      }
      listeners.clear();
    };
    const api = { setState, getState, getInitialState, subscribe, destroy };
    const initialState = state = createState(setState, getState, api);
    return api;
  };
  var createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;

  // node_modules/zustand/esm/index.mjs
  var import_react = __toESM(require_react_shim(), 1);
  var import_with_selector = __toESM(require_with_selector(), 1);
  var { useDebugValue } = import_react.default;
  var { useSyncExternalStoreWithSelector } = import_with_selector.default;
  var didWarnAboutEqualityFn = false;
  var identity = (arg) => arg;
  function useStore(api, selector = identity, equalityFn) {
    if ((define_import_meta_env_default ? define_import_meta_env_default.MODE : void 0) !== "production" && equalityFn && !didWarnAboutEqualityFn) {
      console.warn(
        "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
      );
      didWarnAboutEqualityFn = true;
    }
    const slice = useSyncExternalStoreWithSelector(
      api.subscribe,
      api.getState,
      api.getServerState || api.getInitialState,
      selector,
      equalityFn
    );
    useDebugValue(slice);
    return slice;
  }
  var createImpl = (createState) => {
    if ((define_import_meta_env_default ? define_import_meta_env_default.MODE : void 0) !== "production" && typeof createState !== "function") {
      console.warn(
        "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
      );
    }
    const api = typeof createState === "function" ? createStore(createState) : createState;
    const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
    Object.assign(useBoundStore, api);
    return useBoundStore;
  };
  var create = (createState) => createState ? createImpl(createState) : createImpl;

  // src/stores/uiStore.ts
  var DEFAULT_TOAST_MS = 2600;
  var UNDO_TOAST_MS = 1e4;
  var toastId = 0;
  var useUiStore = create((set) => ({
    quickActionOpen: false,
    setQuickActionOpen: (open) => set({ quickActionOpen: open }),
    microSetRequested: false,
    requestMicroSet: () => set({ microSetRequested: true, quickActionOpen: false }),
    clearMicroSet: () => set({ microSetRequested: false }),
    toast: null,
    showToast: (message, action, durationMs) => set({
      toast: {
        id: ++toastId,
        message,
        action,
        durationMs: durationMs ?? (action ? UNDO_TOAST_MS : DEFAULT_TOAST_MS)
      }
    }),
    dismissToast: () => set({ toast: null })
  }));

  // ds-bundle/.pkg-entry.mjs
  var pkg_entry_exports = {};
  __export(pkg_entry_exports, {
    BottomNav: () => BottomNav,
    Button: () => Button,
    Card: () => Card,
    CardContent: () => CardContent,
    CardDescription: () => CardDescription,
    CardHeader: () => CardHeader,
    CardTitle: () => CardTitle,
    Field: () => Field,
    Input: () => Input,
    LineChart: () => LineChart,
    Progress: () => Progress,
    QuickActionFab: () => QuickActionFab,
    ScreenHeader: () => ScreenHeader,
    Segmented: () => Segmented,
    Sheet: () => Sheet,
    Textarea: () => Textarea,
    Toast: () => Toast,
    ToggleRow: () => ToggleRow,
    UpdatePrompt: () => UpdatePrompt
  });
  init_define_import_meta_env();

  // src/components/charts/LineChart.tsx
  init_define_import_meta_env();
  var import_react2 = __toESM(require_react_shim(), 1);

  // src/lib/utils.ts
  init_define_import_meta_env();

  // node_modules/clsx/dist/clsx.mjs
  init_define_import_meta_env();
  function r(e) {
    var t2, f, n = "";
    if ("string" == typeof e || "number" == typeof e) n += e;
    else if ("object" == typeof e) if (Array.isArray(e)) {
      var o = e.length;
      for (t2 = 0; t2 < o; t2++) e[t2] && (f = r(e[t2])) && (n && (n += " "), n += f);
    } else for (f in e) e[f] && (n && (n += " "), n += f);
    return n;
  }
  function clsx() {
    for (var e, t2, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t2 = r(e)) && (n && (n += " "), n += t2);
    return n;
  }

  // node_modules/tailwind-merge/dist/bundle-mjs.mjs
  init_define_import_meta_env();
  var CLASS_PART_SEPARATOR = "-";
  var createClassGroupUtils = (config) => {
    const classMap = createClassMap(config);
    const {
      conflictingClassGroups,
      conflictingClassGroupModifiers
    } = config;
    const getClassGroupId = (className) => {
      const classParts = className.split(CLASS_PART_SEPARATOR);
      if (classParts[0] === "" && classParts.length !== 1) {
        classParts.shift();
      }
      return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
    };
    const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
      const conflicts = conflictingClassGroups[classGroupId] || [];
      if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
        return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
      }
      return conflicts;
    };
    return {
      getClassGroupId,
      getConflictingClassGroupIds
    };
  };
  var getGroupRecursive = (classParts, classPartObject) => {
    if (classParts.length === 0) {
      return classPartObject.classGroupId;
    }
    const currentClassPart = classParts[0];
    const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
    const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : void 0;
    if (classGroupFromNextClassPart) {
      return classGroupFromNextClassPart;
    }
    if (classPartObject.validators.length === 0) {
      return void 0;
    }
    const classRest = classParts.join(CLASS_PART_SEPARATOR);
    return classPartObject.validators.find(({
      validator
    }) => validator(classRest))?.classGroupId;
  };
  var arbitraryPropertyRegex = /^\[(.+)\]$/;
  var getGroupIdForArbitraryProperty = (className) => {
    if (arbitraryPropertyRegex.test(className)) {
      const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
      const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(":"));
      if (property) {
        return "arbitrary.." + property;
      }
    }
  };
  var createClassMap = (config) => {
    const {
      theme,
      prefix
    } = config;
    const classMap = {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    };
    const prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
    prefixedClassGroupEntries.forEach(([classGroupId, classGroup]) => {
      processClassesRecursively(classGroup, classMap, classGroupId, theme);
    });
    return classMap;
  };
  var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
    classGroup.forEach((classDefinition) => {
      if (typeof classDefinition === "string") {
        const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
        classPartObjectToEdit.classGroupId = classGroupId;
        return;
      }
      if (typeof classDefinition === "function") {
        if (isThemeGetter(classDefinition)) {
          processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
          return;
        }
        classPartObject.validators.push({
          validator: classDefinition,
          classGroupId
        });
        return;
      }
      Object.entries(classDefinition).forEach(([key, classGroup2]) => {
        processClassesRecursively(classGroup2, getPart(classPartObject, key), classGroupId, theme);
      });
    });
  };
  var getPart = (classPartObject, path) => {
    let currentClassPartObject = classPartObject;
    path.split(CLASS_PART_SEPARATOR).forEach((pathPart) => {
      if (!currentClassPartObject.nextPart.has(pathPart)) {
        currentClassPartObject.nextPart.set(pathPart, {
          nextPart: /* @__PURE__ */ new Map(),
          validators: []
        });
      }
      currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
    });
    return currentClassPartObject;
  };
  var isThemeGetter = (func) => func.isThemeGetter;
  var getPrefixedClassGroupEntries = (classGroupEntries, prefix) => {
    if (!prefix) {
      return classGroupEntries;
    }
    return classGroupEntries.map(([classGroupId, classGroup]) => {
      const prefixedClassGroup = classGroup.map((classDefinition) => {
        if (typeof classDefinition === "string") {
          return prefix + classDefinition;
        }
        if (typeof classDefinition === "object") {
          return Object.fromEntries(Object.entries(classDefinition).map(([key, value]) => [prefix + key, value]));
        }
        return classDefinition;
      });
      return [classGroupId, prefixedClassGroup];
    });
  };
  var createLruCache = (maxCacheSize) => {
    if (maxCacheSize < 1) {
      return {
        get: () => void 0,
        set: () => {
        }
      };
    }
    let cacheSize = 0;
    let cache = /* @__PURE__ */ new Map();
    let previousCache = /* @__PURE__ */ new Map();
    const update = (key, value) => {
      cache.set(key, value);
      cacheSize++;
      if (cacheSize > maxCacheSize) {
        cacheSize = 0;
        previousCache = cache;
        cache = /* @__PURE__ */ new Map();
      }
    };
    return {
      get(key) {
        let value = cache.get(key);
        if (value !== void 0) {
          return value;
        }
        if ((value = previousCache.get(key)) !== void 0) {
          update(key, value);
          return value;
        }
      },
      set(key, value) {
        if (cache.has(key)) {
          cache.set(key, value);
        } else {
          update(key, value);
        }
      }
    };
  };
  var IMPORTANT_MODIFIER = "!";
  var createParseClassName = (config) => {
    const {
      separator,
      experimentalParseClassName
    } = config;
    const isSeparatorSingleCharacter = separator.length === 1;
    const firstSeparatorCharacter = separator[0];
    const separatorLength = separator.length;
    const parseClassName = (className) => {
      const modifiers = [];
      let bracketDepth = 0;
      let modifierStart = 0;
      let postfixModifierPosition;
      for (let index = 0; index < className.length; index++) {
        let currentCharacter = className[index];
        if (bracketDepth === 0) {
          if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)) {
            modifiers.push(className.slice(modifierStart, index));
            modifierStart = index + separatorLength;
            continue;
          }
          if (currentCharacter === "/") {
            postfixModifierPosition = index;
            continue;
          }
        }
        if (currentCharacter === "[") {
          bracketDepth++;
        } else if (currentCharacter === "]") {
          bracketDepth--;
        }
      }
      const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
      const hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
      const baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
      const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
      return {
        modifiers,
        hasImportantModifier,
        baseClassName,
        maybePostfixModifierPosition
      };
    };
    if (experimentalParseClassName) {
      return (className) => experimentalParseClassName({
        className,
        parseClassName
      });
    }
    return parseClassName;
  };
  var sortModifiers = (modifiers) => {
    if (modifiers.length <= 1) {
      return modifiers;
    }
    const sortedModifiers = [];
    let unsortedModifiers = [];
    modifiers.forEach((modifier) => {
      const isArbitraryVariant = modifier[0] === "[";
      if (isArbitraryVariant) {
        sortedModifiers.push(...unsortedModifiers.sort(), modifier);
        unsortedModifiers = [];
      } else {
        unsortedModifiers.push(modifier);
      }
    });
    sortedModifiers.push(...unsortedModifiers.sort());
    return sortedModifiers;
  };
  var createConfigUtils = (config) => ({
    cache: createLruCache(config.cacheSize),
    parseClassName: createParseClassName(config),
    ...createClassGroupUtils(config)
  });
  var SPLIT_CLASSES_REGEX = /\s+/;
  var mergeClassList = (classList, configUtils) => {
    const {
      parseClassName,
      getClassGroupId,
      getConflictingClassGroupIds
    } = configUtils;
    const classGroupsInConflict = [];
    const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
    let result = "";
    for (let index = classNames.length - 1; index >= 0; index -= 1) {
      const originalClassName = classNames[index];
      const {
        modifiers,
        hasImportantModifier,
        baseClassName,
        maybePostfixModifierPosition
      } = parseClassName(originalClassName);
      let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
      let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
      if (!classGroupId) {
        if (!hasPostfixModifier) {
          result = originalClassName + (result.length > 0 ? " " + result : result);
          continue;
        }
        classGroupId = getClassGroupId(baseClassName);
        if (!classGroupId) {
          result = originalClassName + (result.length > 0 ? " " + result : result);
          continue;
        }
        hasPostfixModifier = false;
      }
      const variantModifier = sortModifiers(modifiers).join(":");
      const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
      const classId = modifierId + classGroupId;
      if (classGroupsInConflict.includes(classId)) {
        continue;
      }
      classGroupsInConflict.push(classId);
      const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
      for (let i = 0; i < conflictGroups.length; ++i) {
        const group = conflictGroups[i];
        classGroupsInConflict.push(modifierId + group);
      }
      result = originalClassName + (result.length > 0 ? " " + result : result);
    }
    return result;
  };
  function twJoin() {
    let index = 0;
    let argument;
    let resolvedValue;
    let string = "";
    while (index < arguments.length) {
      if (argument = arguments[index++]) {
        if (resolvedValue = toValue(argument)) {
          string && (string += " ");
          string += resolvedValue;
        }
      }
    }
    return string;
  }
  var toValue = (mix) => {
    if (typeof mix === "string") {
      return mix;
    }
    let resolvedValue;
    let string = "";
    for (let k = 0; k < mix.length; k++) {
      if (mix[k]) {
        if (resolvedValue = toValue(mix[k])) {
          string && (string += " ");
          string += resolvedValue;
        }
      }
    }
    return string;
  };
  function createTailwindMerge(createConfigFirst, ...createConfigRest) {
    let configUtils;
    let cacheGet;
    let cacheSet;
    let functionToCall = initTailwindMerge;
    function initTailwindMerge(classList) {
      const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
      configUtils = createConfigUtils(config);
      cacheGet = configUtils.cache.get;
      cacheSet = configUtils.cache.set;
      functionToCall = tailwindMerge;
      return tailwindMerge(classList);
    }
    function tailwindMerge(classList) {
      const cachedResult = cacheGet(classList);
      if (cachedResult) {
        return cachedResult;
      }
      const result = mergeClassList(classList, configUtils);
      cacheSet(classList, result);
      return result;
    }
    return function callTailwindMerge() {
      return functionToCall(twJoin.apply(null, arguments));
    };
  }
  var fromTheme = (key) => {
    const themeGetter = (theme) => theme[key] || [];
    themeGetter.isThemeGetter = true;
    return themeGetter;
  };
  var arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
  var fractionRegex = /^\d+\/\d+$/;
  var stringLengths = /* @__PURE__ */ new Set(["px", "full", "screen"]);
  var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
  var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
  var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
  var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
  var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
  var isLength = (value) => isNumber(value) || stringLengths.has(value) || fractionRegex.test(value);
  var isArbitraryLength = (value) => getIsArbitraryValue(value, "length", isLengthOnly);
  var isNumber = (value) => Boolean(value) && !Number.isNaN(Number(value));
  var isArbitraryNumber = (value) => getIsArbitraryValue(value, "number", isNumber);
  var isInteger = (value) => Boolean(value) && Number.isInteger(Number(value));
  var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
  var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
  var isTshirtSize = (value) => tshirtUnitRegex.test(value);
  var sizeLabels = /* @__PURE__ */ new Set(["length", "size", "percentage"]);
  var isArbitrarySize = (value) => getIsArbitraryValue(value, sizeLabels, isNever);
  var isArbitraryPosition = (value) => getIsArbitraryValue(value, "position", isNever);
  var imageLabels = /* @__PURE__ */ new Set(["image", "url"]);
  var isArbitraryImage = (value) => getIsArbitraryValue(value, imageLabels, isImage);
  var isArbitraryShadow = (value) => getIsArbitraryValue(value, "", isShadow);
  var isAny = () => true;
  var getIsArbitraryValue = (value, label, testValue) => {
    const result = arbitraryValueRegex.exec(value);
    if (result) {
      if (result[1]) {
        return typeof label === "string" ? result[1] === label : label.has(result[1]);
      }
      return testValue(result[2]);
    }
    return false;
  };
  var isLengthOnly = (value) => (
    // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
    // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
    // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
    lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
  );
  var isNever = () => false;
  var isShadow = (value) => shadowRegex.test(value);
  var isImage = (value) => imageRegex.test(value);
  var getDefaultConfig = () => {
    const colors = fromTheme("colors");
    const spacing = fromTheme("spacing");
    const blur = fromTheme("blur");
    const brightness = fromTheme("brightness");
    const borderColor = fromTheme("borderColor");
    const borderRadius = fromTheme("borderRadius");
    const borderSpacing = fromTheme("borderSpacing");
    const borderWidth = fromTheme("borderWidth");
    const contrast = fromTheme("contrast");
    const grayscale = fromTheme("grayscale");
    const hueRotate = fromTheme("hueRotate");
    const invert = fromTheme("invert");
    const gap = fromTheme("gap");
    const gradientColorStops = fromTheme("gradientColorStops");
    const gradientColorStopPositions = fromTheme("gradientColorStopPositions");
    const inset = fromTheme("inset");
    const margin = fromTheme("margin");
    const opacity = fromTheme("opacity");
    const padding = fromTheme("padding");
    const saturate = fromTheme("saturate");
    const scale = fromTheme("scale");
    const sepia = fromTheme("sepia");
    const skew = fromTheme("skew");
    const space = fromTheme("space");
    const translate = fromTheme("translate");
    const getOverscroll = () => ["auto", "contain", "none"];
    const getOverflow = () => ["auto", "hidden", "clip", "visible", "scroll"];
    const getSpacingWithAutoAndArbitrary = () => ["auto", isArbitraryValue, spacing];
    const getSpacingWithArbitrary = () => [isArbitraryValue, spacing];
    const getLengthWithEmptyAndArbitrary = () => ["", isLength, isArbitraryLength];
    const getNumberWithAutoAndArbitrary = () => ["auto", isNumber, isArbitraryValue];
    const getPositions = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"];
    const getLineStyles = () => ["solid", "dashed", "dotted", "double", "none"];
    const getBlendModes = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
    const getAlign = () => ["start", "end", "center", "between", "around", "evenly", "stretch"];
    const getZeroAndEmpty = () => ["", "0", isArbitraryValue];
    const getBreaks = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
    const getNumberAndArbitrary = () => [isNumber, isArbitraryValue];
    return {
      cacheSize: 500,
      separator: ":",
      theme: {
        colors: [isAny],
        spacing: [isLength, isArbitraryLength],
        blur: ["none", "", isTshirtSize, isArbitraryValue],
        brightness: getNumberAndArbitrary(),
        borderColor: [colors],
        borderRadius: ["none", "", "full", isTshirtSize, isArbitraryValue],
        borderSpacing: getSpacingWithArbitrary(),
        borderWidth: getLengthWithEmptyAndArbitrary(),
        contrast: getNumberAndArbitrary(),
        grayscale: getZeroAndEmpty(),
        hueRotate: getNumberAndArbitrary(),
        invert: getZeroAndEmpty(),
        gap: getSpacingWithArbitrary(),
        gradientColorStops: [colors],
        gradientColorStopPositions: [isPercent, isArbitraryLength],
        inset: getSpacingWithAutoAndArbitrary(),
        margin: getSpacingWithAutoAndArbitrary(),
        opacity: getNumberAndArbitrary(),
        padding: getSpacingWithArbitrary(),
        saturate: getNumberAndArbitrary(),
        scale: getNumberAndArbitrary(),
        sepia: getZeroAndEmpty(),
        skew: getNumberAndArbitrary(),
        space: getSpacingWithArbitrary(),
        translate: getSpacingWithArbitrary()
      },
      classGroups: {
        // Layout
        /**
         * Aspect Ratio
         * @see https://tailwindcss.com/docs/aspect-ratio
         */
        aspect: [{
          aspect: ["auto", "square", "video", isArbitraryValue]
        }],
        /**
         * Container
         * @see https://tailwindcss.com/docs/container
         */
        container: ["container"],
        /**
         * Columns
         * @see https://tailwindcss.com/docs/columns
         */
        columns: [{
          columns: [isTshirtSize]
        }],
        /**
         * Break After
         * @see https://tailwindcss.com/docs/break-after
         */
        "break-after": [{
          "break-after": getBreaks()
        }],
        /**
         * Break Before
         * @see https://tailwindcss.com/docs/break-before
         */
        "break-before": [{
          "break-before": getBreaks()
        }],
        /**
         * Break Inside
         * @see https://tailwindcss.com/docs/break-inside
         */
        "break-inside": [{
          "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
        }],
        /**
         * Box Decoration Break
         * @see https://tailwindcss.com/docs/box-decoration-break
         */
        "box-decoration": [{
          "box-decoration": ["slice", "clone"]
        }],
        /**
         * Box Sizing
         * @see https://tailwindcss.com/docs/box-sizing
         */
        box: [{
          box: ["border", "content"]
        }],
        /**
         * Display
         * @see https://tailwindcss.com/docs/display
         */
        display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
        /**
         * Floats
         * @see https://tailwindcss.com/docs/float
         */
        float: [{
          float: ["right", "left", "none", "start", "end"]
        }],
        /**
         * Clear
         * @see https://tailwindcss.com/docs/clear
         */
        clear: [{
          clear: ["left", "right", "both", "none", "start", "end"]
        }],
        /**
         * Isolation
         * @see https://tailwindcss.com/docs/isolation
         */
        isolation: ["isolate", "isolation-auto"],
        /**
         * Object Fit
         * @see https://tailwindcss.com/docs/object-fit
         */
        "object-fit": [{
          object: ["contain", "cover", "fill", "none", "scale-down"]
        }],
        /**
         * Object Position
         * @see https://tailwindcss.com/docs/object-position
         */
        "object-position": [{
          object: [...getPositions(), isArbitraryValue]
        }],
        /**
         * Overflow
         * @see https://tailwindcss.com/docs/overflow
         */
        overflow: [{
          overflow: getOverflow()
        }],
        /**
         * Overflow X
         * @see https://tailwindcss.com/docs/overflow
         */
        "overflow-x": [{
          "overflow-x": getOverflow()
        }],
        /**
         * Overflow Y
         * @see https://tailwindcss.com/docs/overflow
         */
        "overflow-y": [{
          "overflow-y": getOverflow()
        }],
        /**
         * Overscroll Behavior
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        overscroll: [{
          overscroll: getOverscroll()
        }],
        /**
         * Overscroll Behavior X
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        "overscroll-x": [{
          "overscroll-x": getOverscroll()
        }],
        /**
         * Overscroll Behavior Y
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        "overscroll-y": [{
          "overscroll-y": getOverscroll()
        }],
        /**
         * Position
         * @see https://tailwindcss.com/docs/position
         */
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        /**
         * Top / Right / Bottom / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        inset: [{
          inset: [inset]
        }],
        /**
         * Right / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        "inset-x": [{
          "inset-x": [inset]
        }],
        /**
         * Top / Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        "inset-y": [{
          "inset-y": [inset]
        }],
        /**
         * Start
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        start: [{
          start: [inset]
        }],
        /**
         * End
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        end: [{
          end: [inset]
        }],
        /**
         * Top
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        top: [{
          top: [inset]
        }],
        /**
         * Right
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        right: [{
          right: [inset]
        }],
        /**
         * Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        bottom: [{
          bottom: [inset]
        }],
        /**
         * Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        left: [{
          left: [inset]
        }],
        /**
         * Visibility
         * @see https://tailwindcss.com/docs/visibility
         */
        visibility: ["visible", "invisible", "collapse"],
        /**
         * Z-Index
         * @see https://tailwindcss.com/docs/z-index
         */
        z: [{
          z: ["auto", isInteger, isArbitraryValue]
        }],
        // Flexbox and Grid
        /**
         * Flex Basis
         * @see https://tailwindcss.com/docs/flex-basis
         */
        basis: [{
          basis: getSpacingWithAutoAndArbitrary()
        }],
        /**
         * Flex Direction
         * @see https://tailwindcss.com/docs/flex-direction
         */
        "flex-direction": [{
          flex: ["row", "row-reverse", "col", "col-reverse"]
        }],
        /**
         * Flex Wrap
         * @see https://tailwindcss.com/docs/flex-wrap
         */
        "flex-wrap": [{
          flex: ["wrap", "wrap-reverse", "nowrap"]
        }],
        /**
         * Flex
         * @see https://tailwindcss.com/docs/flex
         */
        flex: [{
          flex: ["1", "auto", "initial", "none", isArbitraryValue]
        }],
        /**
         * Flex Grow
         * @see https://tailwindcss.com/docs/flex-grow
         */
        grow: [{
          grow: getZeroAndEmpty()
        }],
        /**
         * Flex Shrink
         * @see https://tailwindcss.com/docs/flex-shrink
         */
        shrink: [{
          shrink: getZeroAndEmpty()
        }],
        /**
         * Order
         * @see https://tailwindcss.com/docs/order
         */
        order: [{
          order: ["first", "last", "none", isInteger, isArbitraryValue]
        }],
        /**
         * Grid Template Columns
         * @see https://tailwindcss.com/docs/grid-template-columns
         */
        "grid-cols": [{
          "grid-cols": [isAny]
        }],
        /**
         * Grid Column Start / End
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-start-end": [{
          col: ["auto", {
            span: ["full", isInteger, isArbitraryValue]
          }, isArbitraryValue]
        }],
        /**
         * Grid Column Start
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-start": [{
          "col-start": getNumberWithAutoAndArbitrary()
        }],
        /**
         * Grid Column End
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-end": [{
          "col-end": getNumberWithAutoAndArbitrary()
        }],
        /**
         * Grid Template Rows
         * @see https://tailwindcss.com/docs/grid-template-rows
         */
        "grid-rows": [{
          "grid-rows": [isAny]
        }],
        /**
         * Grid Row Start / End
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-start-end": [{
          row: ["auto", {
            span: [isInteger, isArbitraryValue]
          }, isArbitraryValue]
        }],
        /**
         * Grid Row Start
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-start": [{
          "row-start": getNumberWithAutoAndArbitrary()
        }],
        /**
         * Grid Row End
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-end": [{
          "row-end": getNumberWithAutoAndArbitrary()
        }],
        /**
         * Grid Auto Flow
         * @see https://tailwindcss.com/docs/grid-auto-flow
         */
        "grid-flow": [{
          "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
        }],
        /**
         * Grid Auto Columns
         * @see https://tailwindcss.com/docs/grid-auto-columns
         */
        "auto-cols": [{
          "auto-cols": ["auto", "min", "max", "fr", isArbitraryValue]
        }],
        /**
         * Grid Auto Rows
         * @see https://tailwindcss.com/docs/grid-auto-rows
         */
        "auto-rows": [{
          "auto-rows": ["auto", "min", "max", "fr", isArbitraryValue]
        }],
        /**
         * Gap
         * @see https://tailwindcss.com/docs/gap
         */
        gap: [{
          gap: [gap]
        }],
        /**
         * Gap X
         * @see https://tailwindcss.com/docs/gap
         */
        "gap-x": [{
          "gap-x": [gap]
        }],
        /**
         * Gap Y
         * @see https://tailwindcss.com/docs/gap
         */
        "gap-y": [{
          "gap-y": [gap]
        }],
        /**
         * Justify Content
         * @see https://tailwindcss.com/docs/justify-content
         */
        "justify-content": [{
          justify: ["normal", ...getAlign()]
        }],
        /**
         * Justify Items
         * @see https://tailwindcss.com/docs/justify-items
         */
        "justify-items": [{
          "justify-items": ["start", "end", "center", "stretch"]
        }],
        /**
         * Justify Self
         * @see https://tailwindcss.com/docs/justify-self
         */
        "justify-self": [{
          "justify-self": ["auto", "start", "end", "center", "stretch"]
        }],
        /**
         * Align Content
         * @see https://tailwindcss.com/docs/align-content
         */
        "align-content": [{
          content: ["normal", ...getAlign(), "baseline"]
        }],
        /**
         * Align Items
         * @see https://tailwindcss.com/docs/align-items
         */
        "align-items": [{
          items: ["start", "end", "center", "baseline", "stretch"]
        }],
        /**
         * Align Self
         * @see https://tailwindcss.com/docs/align-self
         */
        "align-self": [{
          self: ["auto", "start", "end", "center", "stretch", "baseline"]
        }],
        /**
         * Place Content
         * @see https://tailwindcss.com/docs/place-content
         */
        "place-content": [{
          "place-content": [...getAlign(), "baseline"]
        }],
        /**
         * Place Items
         * @see https://tailwindcss.com/docs/place-items
         */
        "place-items": [{
          "place-items": ["start", "end", "center", "baseline", "stretch"]
        }],
        /**
         * Place Self
         * @see https://tailwindcss.com/docs/place-self
         */
        "place-self": [{
          "place-self": ["auto", "start", "end", "center", "stretch"]
        }],
        // Spacing
        /**
         * Padding
         * @see https://tailwindcss.com/docs/padding
         */
        p: [{
          p: [padding]
        }],
        /**
         * Padding X
         * @see https://tailwindcss.com/docs/padding
         */
        px: [{
          px: [padding]
        }],
        /**
         * Padding Y
         * @see https://tailwindcss.com/docs/padding
         */
        py: [{
          py: [padding]
        }],
        /**
         * Padding Start
         * @see https://tailwindcss.com/docs/padding
         */
        ps: [{
          ps: [padding]
        }],
        /**
         * Padding End
         * @see https://tailwindcss.com/docs/padding
         */
        pe: [{
          pe: [padding]
        }],
        /**
         * Padding Top
         * @see https://tailwindcss.com/docs/padding
         */
        pt: [{
          pt: [padding]
        }],
        /**
         * Padding Right
         * @see https://tailwindcss.com/docs/padding
         */
        pr: [{
          pr: [padding]
        }],
        /**
         * Padding Bottom
         * @see https://tailwindcss.com/docs/padding
         */
        pb: [{
          pb: [padding]
        }],
        /**
         * Padding Left
         * @see https://tailwindcss.com/docs/padding
         */
        pl: [{
          pl: [padding]
        }],
        /**
         * Margin
         * @see https://tailwindcss.com/docs/margin
         */
        m: [{
          m: [margin]
        }],
        /**
         * Margin X
         * @see https://tailwindcss.com/docs/margin
         */
        mx: [{
          mx: [margin]
        }],
        /**
         * Margin Y
         * @see https://tailwindcss.com/docs/margin
         */
        my: [{
          my: [margin]
        }],
        /**
         * Margin Start
         * @see https://tailwindcss.com/docs/margin
         */
        ms: [{
          ms: [margin]
        }],
        /**
         * Margin End
         * @see https://tailwindcss.com/docs/margin
         */
        me: [{
          me: [margin]
        }],
        /**
         * Margin Top
         * @see https://tailwindcss.com/docs/margin
         */
        mt: [{
          mt: [margin]
        }],
        /**
         * Margin Right
         * @see https://tailwindcss.com/docs/margin
         */
        mr: [{
          mr: [margin]
        }],
        /**
         * Margin Bottom
         * @see https://tailwindcss.com/docs/margin
         */
        mb: [{
          mb: [margin]
        }],
        /**
         * Margin Left
         * @see https://tailwindcss.com/docs/margin
         */
        ml: [{
          ml: [margin]
        }],
        /**
         * Space Between X
         * @see https://tailwindcss.com/docs/space
         */
        "space-x": [{
          "space-x": [space]
        }],
        /**
         * Space Between X Reverse
         * @see https://tailwindcss.com/docs/space
         */
        "space-x-reverse": ["space-x-reverse"],
        /**
         * Space Between Y
         * @see https://tailwindcss.com/docs/space
         */
        "space-y": [{
          "space-y": [space]
        }],
        /**
         * Space Between Y Reverse
         * @see https://tailwindcss.com/docs/space
         */
        "space-y-reverse": ["space-y-reverse"],
        // Sizing
        /**
         * Width
         * @see https://tailwindcss.com/docs/width
         */
        w: [{
          w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", isArbitraryValue, spacing]
        }],
        /**
         * Min-Width
         * @see https://tailwindcss.com/docs/min-width
         */
        "min-w": [{
          "min-w": [isArbitraryValue, spacing, "min", "max", "fit"]
        }],
        /**
         * Max-Width
         * @see https://tailwindcss.com/docs/max-width
         */
        "max-w": [{
          "max-w": [isArbitraryValue, spacing, "none", "full", "min", "max", "fit", "prose", {
            screen: [isTshirtSize]
          }, isTshirtSize]
        }],
        /**
         * Height
         * @see https://tailwindcss.com/docs/height
         */
        h: [{
          h: [isArbitraryValue, spacing, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
        }],
        /**
         * Min-Height
         * @see https://tailwindcss.com/docs/min-height
         */
        "min-h": [{
          "min-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
        }],
        /**
         * Max-Height
         * @see https://tailwindcss.com/docs/max-height
         */
        "max-h": [{
          "max-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
        }],
        /**
         * Size
         * @see https://tailwindcss.com/docs/size
         */
        size: [{
          size: [isArbitraryValue, spacing, "auto", "min", "max", "fit"]
        }],
        // Typography
        /**
         * Font Size
         * @see https://tailwindcss.com/docs/font-size
         */
        "font-size": [{
          text: ["base", isTshirtSize, isArbitraryLength]
        }],
        /**
         * Font Smoothing
         * @see https://tailwindcss.com/docs/font-smoothing
         */
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        /**
         * Font Style
         * @see https://tailwindcss.com/docs/font-style
         */
        "font-style": ["italic", "not-italic"],
        /**
         * Font Weight
         * @see https://tailwindcss.com/docs/font-weight
         */
        "font-weight": [{
          font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", isArbitraryNumber]
        }],
        /**
         * Font Family
         * @see https://tailwindcss.com/docs/font-family
         */
        "font-family": [{
          font: [isAny]
        }],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-normal": ["normal-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-ordinal": ["ordinal"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-slashed-zero": ["slashed-zero"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        /**
         * Letter Spacing
         * @see https://tailwindcss.com/docs/letter-spacing
         */
        tracking: [{
          tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", isArbitraryValue]
        }],
        /**
         * Line Clamp
         * @see https://tailwindcss.com/docs/line-clamp
         */
        "line-clamp": [{
          "line-clamp": ["none", isNumber, isArbitraryNumber]
        }],
        /**
         * Line Height
         * @see https://tailwindcss.com/docs/line-height
         */
        leading: [{
          leading: ["none", "tight", "snug", "normal", "relaxed", "loose", isLength, isArbitraryValue]
        }],
        /**
         * List Style Image
         * @see https://tailwindcss.com/docs/list-style-image
         */
        "list-image": [{
          "list-image": ["none", isArbitraryValue]
        }],
        /**
         * List Style Type
         * @see https://tailwindcss.com/docs/list-style-type
         */
        "list-style-type": [{
          list: ["none", "disc", "decimal", isArbitraryValue]
        }],
        /**
         * List Style Position
         * @see https://tailwindcss.com/docs/list-style-position
         */
        "list-style-position": [{
          list: ["inside", "outside"]
        }],
        /**
         * Placeholder Color
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://tailwindcss.com/docs/placeholder-color
         */
        "placeholder-color": [{
          placeholder: [colors]
        }],
        /**
         * Placeholder Opacity
         * @see https://tailwindcss.com/docs/placeholder-opacity
         */
        "placeholder-opacity": [{
          "placeholder-opacity": [opacity]
        }],
        /**
         * Text Alignment
         * @see https://tailwindcss.com/docs/text-align
         */
        "text-alignment": [{
          text: ["left", "center", "right", "justify", "start", "end"]
        }],
        /**
         * Text Color
         * @see https://tailwindcss.com/docs/text-color
         */
        "text-color": [{
          text: [colors]
        }],
        /**
         * Text Opacity
         * @see https://tailwindcss.com/docs/text-opacity
         */
        "text-opacity": [{
          "text-opacity": [opacity]
        }],
        /**
         * Text Decoration
         * @see https://tailwindcss.com/docs/text-decoration
         */
        "text-decoration": ["underline", "overline", "line-through", "no-underline"],
        /**
         * Text Decoration Style
         * @see https://tailwindcss.com/docs/text-decoration-style
         */
        "text-decoration-style": [{
          decoration: [...getLineStyles(), "wavy"]
        }],
        /**
         * Text Decoration Thickness
         * @see https://tailwindcss.com/docs/text-decoration-thickness
         */
        "text-decoration-thickness": [{
          decoration: ["auto", "from-font", isLength, isArbitraryLength]
        }],
        /**
         * Text Underline Offset
         * @see https://tailwindcss.com/docs/text-underline-offset
         */
        "underline-offset": [{
          "underline-offset": ["auto", isLength, isArbitraryValue]
        }],
        /**
         * Text Decoration Color
         * @see https://tailwindcss.com/docs/text-decoration-color
         */
        "text-decoration-color": [{
          decoration: [colors]
        }],
        /**
         * Text Transform
         * @see https://tailwindcss.com/docs/text-transform
         */
        "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
        /**
         * Text Overflow
         * @see https://tailwindcss.com/docs/text-overflow
         */
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        /**
         * Text Wrap
         * @see https://tailwindcss.com/docs/text-wrap
         */
        "text-wrap": [{
          text: ["wrap", "nowrap", "balance", "pretty"]
        }],
        /**
         * Text Indent
         * @see https://tailwindcss.com/docs/text-indent
         */
        indent: [{
          indent: getSpacingWithArbitrary()
        }],
        /**
         * Vertical Alignment
         * @see https://tailwindcss.com/docs/vertical-align
         */
        "vertical-align": [{
          align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryValue]
        }],
        /**
         * Whitespace
         * @see https://tailwindcss.com/docs/whitespace
         */
        whitespace: [{
          whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
        }],
        /**
         * Word Break
         * @see https://tailwindcss.com/docs/word-break
         */
        break: [{
          break: ["normal", "words", "all", "keep"]
        }],
        /**
         * Hyphens
         * @see https://tailwindcss.com/docs/hyphens
         */
        hyphens: [{
          hyphens: ["none", "manual", "auto"]
        }],
        /**
         * Content
         * @see https://tailwindcss.com/docs/content
         */
        content: [{
          content: ["none", isArbitraryValue]
        }],
        // Backgrounds
        /**
         * Background Attachment
         * @see https://tailwindcss.com/docs/background-attachment
         */
        "bg-attachment": [{
          bg: ["fixed", "local", "scroll"]
        }],
        /**
         * Background Clip
         * @see https://tailwindcss.com/docs/background-clip
         */
        "bg-clip": [{
          "bg-clip": ["border", "padding", "content", "text"]
        }],
        /**
         * Background Opacity
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://tailwindcss.com/docs/background-opacity
         */
        "bg-opacity": [{
          "bg-opacity": [opacity]
        }],
        /**
         * Background Origin
         * @see https://tailwindcss.com/docs/background-origin
         */
        "bg-origin": [{
          "bg-origin": ["border", "padding", "content"]
        }],
        /**
         * Background Position
         * @see https://tailwindcss.com/docs/background-position
         */
        "bg-position": [{
          bg: [...getPositions(), isArbitraryPosition]
        }],
        /**
         * Background Repeat
         * @see https://tailwindcss.com/docs/background-repeat
         */
        "bg-repeat": [{
          bg: ["no-repeat", {
            repeat: ["", "x", "y", "round", "space"]
          }]
        }],
        /**
         * Background Size
         * @see https://tailwindcss.com/docs/background-size
         */
        "bg-size": [{
          bg: ["auto", "cover", "contain", isArbitrarySize]
        }],
        /**
         * Background Image
         * @see https://tailwindcss.com/docs/background-image
         */
        "bg-image": [{
          bg: ["none", {
            "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, isArbitraryImage]
        }],
        /**
         * Background Color
         * @see https://tailwindcss.com/docs/background-color
         */
        "bg-color": [{
          bg: [colors]
        }],
        /**
         * Gradient Color Stops From Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-from-pos": [{
          from: [gradientColorStopPositions]
        }],
        /**
         * Gradient Color Stops Via Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-via-pos": [{
          via: [gradientColorStopPositions]
        }],
        /**
         * Gradient Color Stops To Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-to-pos": [{
          to: [gradientColorStopPositions]
        }],
        /**
         * Gradient Color Stops From
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-from": [{
          from: [gradientColorStops]
        }],
        /**
         * Gradient Color Stops Via
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-via": [{
          via: [gradientColorStops]
        }],
        /**
         * Gradient Color Stops To
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-to": [{
          to: [gradientColorStops]
        }],
        // Borders
        /**
         * Border Radius
         * @see https://tailwindcss.com/docs/border-radius
         */
        rounded: [{
          rounded: [borderRadius]
        }],
        /**
         * Border Radius Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-s": [{
          "rounded-s": [borderRadius]
        }],
        /**
         * Border Radius End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-e": [{
          "rounded-e": [borderRadius]
        }],
        /**
         * Border Radius Top
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-t": [{
          "rounded-t": [borderRadius]
        }],
        /**
         * Border Radius Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-r": [{
          "rounded-r": [borderRadius]
        }],
        /**
         * Border Radius Bottom
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-b": [{
          "rounded-b": [borderRadius]
        }],
        /**
         * Border Radius Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-l": [{
          "rounded-l": [borderRadius]
        }],
        /**
         * Border Radius Start Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-ss": [{
          "rounded-ss": [borderRadius]
        }],
        /**
         * Border Radius Start End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-se": [{
          "rounded-se": [borderRadius]
        }],
        /**
         * Border Radius End End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-ee": [{
          "rounded-ee": [borderRadius]
        }],
        /**
         * Border Radius End Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-es": [{
          "rounded-es": [borderRadius]
        }],
        /**
         * Border Radius Top Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-tl": [{
          "rounded-tl": [borderRadius]
        }],
        /**
         * Border Radius Top Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-tr": [{
          "rounded-tr": [borderRadius]
        }],
        /**
         * Border Radius Bottom Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-br": [{
          "rounded-br": [borderRadius]
        }],
        /**
         * Border Radius Bottom Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-bl": [{
          "rounded-bl": [borderRadius]
        }],
        /**
         * Border Width
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w": [{
          border: [borderWidth]
        }],
        /**
         * Border Width X
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-x": [{
          "border-x": [borderWidth]
        }],
        /**
         * Border Width Y
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-y": [{
          "border-y": [borderWidth]
        }],
        /**
         * Border Width Start
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-s": [{
          "border-s": [borderWidth]
        }],
        /**
         * Border Width End
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-e": [{
          "border-e": [borderWidth]
        }],
        /**
         * Border Width Top
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-t": [{
          "border-t": [borderWidth]
        }],
        /**
         * Border Width Right
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-r": [{
          "border-r": [borderWidth]
        }],
        /**
         * Border Width Bottom
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-b": [{
          "border-b": [borderWidth]
        }],
        /**
         * Border Width Left
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-l": [{
          "border-l": [borderWidth]
        }],
        /**
         * Border Opacity
         * @see https://tailwindcss.com/docs/border-opacity
         */
        "border-opacity": [{
          "border-opacity": [opacity]
        }],
        /**
         * Border Style
         * @see https://tailwindcss.com/docs/border-style
         */
        "border-style": [{
          border: [...getLineStyles(), "hidden"]
        }],
        /**
         * Divide Width X
         * @see https://tailwindcss.com/docs/divide-width
         */
        "divide-x": [{
          "divide-x": [borderWidth]
        }],
        /**
         * Divide Width X Reverse
         * @see https://tailwindcss.com/docs/divide-width
         */
        "divide-x-reverse": ["divide-x-reverse"],
        /**
         * Divide Width Y
         * @see https://tailwindcss.com/docs/divide-width
         */
        "divide-y": [{
          "divide-y": [borderWidth]
        }],
        /**
         * Divide Width Y Reverse
         * @see https://tailwindcss.com/docs/divide-width
         */
        "divide-y-reverse": ["divide-y-reverse"],
        /**
         * Divide Opacity
         * @see https://tailwindcss.com/docs/divide-opacity
         */
        "divide-opacity": [{
          "divide-opacity": [opacity]
        }],
        /**
         * Divide Style
         * @see https://tailwindcss.com/docs/divide-style
         */
        "divide-style": [{
          divide: getLineStyles()
        }],
        /**
         * Border Color
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color": [{
          border: [borderColor]
        }],
        /**
         * Border Color X
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-x": [{
          "border-x": [borderColor]
        }],
        /**
         * Border Color Y
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-y": [{
          "border-y": [borderColor]
        }],
        /**
         * Border Color S
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-s": [{
          "border-s": [borderColor]
        }],
        /**
         * Border Color E
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-e": [{
          "border-e": [borderColor]
        }],
        /**
         * Border Color Top
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-t": [{
          "border-t": [borderColor]
        }],
        /**
         * Border Color Right
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-r": [{
          "border-r": [borderColor]
        }],
        /**
         * Border Color Bottom
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-b": [{
          "border-b": [borderColor]
        }],
        /**
         * Border Color Left
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-l": [{
          "border-l": [borderColor]
        }],
        /**
         * Divide Color
         * @see https://tailwindcss.com/docs/divide-color
         */
        "divide-color": [{
          divide: [borderColor]
        }],
        /**
         * Outline Style
         * @see https://tailwindcss.com/docs/outline-style
         */
        "outline-style": [{
          outline: ["", ...getLineStyles()]
        }],
        /**
         * Outline Offset
         * @see https://tailwindcss.com/docs/outline-offset
         */
        "outline-offset": [{
          "outline-offset": [isLength, isArbitraryValue]
        }],
        /**
         * Outline Width
         * @see https://tailwindcss.com/docs/outline-width
         */
        "outline-w": [{
          outline: [isLength, isArbitraryLength]
        }],
        /**
         * Outline Color
         * @see https://tailwindcss.com/docs/outline-color
         */
        "outline-color": [{
          outline: [colors]
        }],
        /**
         * Ring Width
         * @see https://tailwindcss.com/docs/ring-width
         */
        "ring-w": [{
          ring: getLengthWithEmptyAndArbitrary()
        }],
        /**
         * Ring Width Inset
         * @see https://tailwindcss.com/docs/ring-width
         */
        "ring-w-inset": ["ring-inset"],
        /**
         * Ring Color
         * @see https://tailwindcss.com/docs/ring-color
         */
        "ring-color": [{
          ring: [colors]
        }],
        /**
         * Ring Opacity
         * @see https://tailwindcss.com/docs/ring-opacity
         */
        "ring-opacity": [{
          "ring-opacity": [opacity]
        }],
        /**
         * Ring Offset Width
         * @see https://tailwindcss.com/docs/ring-offset-width
         */
        "ring-offset-w": [{
          "ring-offset": [isLength, isArbitraryLength]
        }],
        /**
         * Ring Offset Color
         * @see https://tailwindcss.com/docs/ring-offset-color
         */
        "ring-offset-color": [{
          "ring-offset": [colors]
        }],
        // Effects
        /**
         * Box Shadow
         * @see https://tailwindcss.com/docs/box-shadow
         */
        shadow: [{
          shadow: ["", "inner", "none", isTshirtSize, isArbitraryShadow]
        }],
        /**
         * Box Shadow Color
         * @see https://tailwindcss.com/docs/box-shadow-color
         */
        "shadow-color": [{
          shadow: [isAny]
        }],
        /**
         * Opacity
         * @see https://tailwindcss.com/docs/opacity
         */
        opacity: [{
          opacity: [opacity]
        }],
        /**
         * Mix Blend Mode
         * @see https://tailwindcss.com/docs/mix-blend-mode
         */
        "mix-blend": [{
          "mix-blend": [...getBlendModes(), "plus-lighter", "plus-darker"]
        }],
        /**
         * Background Blend Mode
         * @see https://tailwindcss.com/docs/background-blend-mode
         */
        "bg-blend": [{
          "bg-blend": getBlendModes()
        }],
        // Filters
        /**
         * Filter
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://tailwindcss.com/docs/filter
         */
        filter: [{
          filter: ["", "none"]
        }],
        /**
         * Blur
         * @see https://tailwindcss.com/docs/blur
         */
        blur: [{
          blur: [blur]
        }],
        /**
         * Brightness
         * @see https://tailwindcss.com/docs/brightness
         */
        brightness: [{
          brightness: [brightness]
        }],
        /**
         * Contrast
         * @see https://tailwindcss.com/docs/contrast
         */
        contrast: [{
          contrast: [contrast]
        }],
        /**
         * Drop Shadow
         * @see https://tailwindcss.com/docs/drop-shadow
         */
        "drop-shadow": [{
          "drop-shadow": ["", "none", isTshirtSize, isArbitraryValue]
        }],
        /**
         * Grayscale
         * @see https://tailwindcss.com/docs/grayscale
         */
        grayscale: [{
          grayscale: [grayscale]
        }],
        /**
         * Hue Rotate
         * @see https://tailwindcss.com/docs/hue-rotate
         */
        "hue-rotate": [{
          "hue-rotate": [hueRotate]
        }],
        /**
         * Invert
         * @see https://tailwindcss.com/docs/invert
         */
        invert: [{
          invert: [invert]
        }],
        /**
         * Saturate
         * @see https://tailwindcss.com/docs/saturate
         */
        saturate: [{
          saturate: [saturate]
        }],
        /**
         * Sepia
         * @see https://tailwindcss.com/docs/sepia
         */
        sepia: [{
          sepia: [sepia]
        }],
        /**
         * Backdrop Filter
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://tailwindcss.com/docs/backdrop-filter
         */
        "backdrop-filter": [{
          "backdrop-filter": ["", "none"]
        }],
        /**
         * Backdrop Blur
         * @see https://tailwindcss.com/docs/backdrop-blur
         */
        "backdrop-blur": [{
          "backdrop-blur": [blur]
        }],
        /**
         * Backdrop Brightness
         * @see https://tailwindcss.com/docs/backdrop-brightness
         */
        "backdrop-brightness": [{
          "backdrop-brightness": [brightness]
        }],
        /**
         * Backdrop Contrast
         * @see https://tailwindcss.com/docs/backdrop-contrast
         */
        "backdrop-contrast": [{
          "backdrop-contrast": [contrast]
        }],
        /**
         * Backdrop Grayscale
         * @see https://tailwindcss.com/docs/backdrop-grayscale
         */
        "backdrop-grayscale": [{
          "backdrop-grayscale": [grayscale]
        }],
        /**
         * Backdrop Hue Rotate
         * @see https://tailwindcss.com/docs/backdrop-hue-rotate
         */
        "backdrop-hue-rotate": [{
          "backdrop-hue-rotate": [hueRotate]
        }],
        /**
         * Backdrop Invert
         * @see https://tailwindcss.com/docs/backdrop-invert
         */
        "backdrop-invert": [{
          "backdrop-invert": [invert]
        }],
        /**
         * Backdrop Opacity
         * @see https://tailwindcss.com/docs/backdrop-opacity
         */
        "backdrop-opacity": [{
          "backdrop-opacity": [opacity]
        }],
        /**
         * Backdrop Saturate
         * @see https://tailwindcss.com/docs/backdrop-saturate
         */
        "backdrop-saturate": [{
          "backdrop-saturate": [saturate]
        }],
        /**
         * Backdrop Sepia
         * @see https://tailwindcss.com/docs/backdrop-sepia
         */
        "backdrop-sepia": [{
          "backdrop-sepia": [sepia]
        }],
        // Tables
        /**
         * Border Collapse
         * @see https://tailwindcss.com/docs/border-collapse
         */
        "border-collapse": [{
          border: ["collapse", "separate"]
        }],
        /**
         * Border Spacing
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing": [{
          "border-spacing": [borderSpacing]
        }],
        /**
         * Border Spacing X
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing-x": [{
          "border-spacing-x": [borderSpacing]
        }],
        /**
         * Border Spacing Y
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing-y": [{
          "border-spacing-y": [borderSpacing]
        }],
        /**
         * Table Layout
         * @see https://tailwindcss.com/docs/table-layout
         */
        "table-layout": [{
          table: ["auto", "fixed"]
        }],
        /**
         * Caption Side
         * @see https://tailwindcss.com/docs/caption-side
         */
        caption: [{
          caption: ["top", "bottom"]
        }],
        // Transitions and Animation
        /**
         * Tranisition Property
         * @see https://tailwindcss.com/docs/transition-property
         */
        transition: [{
          transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", isArbitraryValue]
        }],
        /**
         * Transition Duration
         * @see https://tailwindcss.com/docs/transition-duration
         */
        duration: [{
          duration: getNumberAndArbitrary()
        }],
        /**
         * Transition Timing Function
         * @see https://tailwindcss.com/docs/transition-timing-function
         */
        ease: [{
          ease: ["linear", "in", "out", "in-out", isArbitraryValue]
        }],
        /**
         * Transition Delay
         * @see https://tailwindcss.com/docs/transition-delay
         */
        delay: [{
          delay: getNumberAndArbitrary()
        }],
        /**
         * Animation
         * @see https://tailwindcss.com/docs/animation
         */
        animate: [{
          animate: ["none", "spin", "ping", "pulse", "bounce", isArbitraryValue]
        }],
        // Transforms
        /**
         * Transform
         * @see https://tailwindcss.com/docs/transform
         */
        transform: [{
          transform: ["", "gpu", "none"]
        }],
        /**
         * Scale
         * @see https://tailwindcss.com/docs/scale
         */
        scale: [{
          scale: [scale]
        }],
        /**
         * Scale X
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-x": [{
          "scale-x": [scale]
        }],
        /**
         * Scale Y
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-y": [{
          "scale-y": [scale]
        }],
        /**
         * Rotate
         * @see https://tailwindcss.com/docs/rotate
         */
        rotate: [{
          rotate: [isInteger, isArbitraryValue]
        }],
        /**
         * Translate X
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-x": [{
          "translate-x": [translate]
        }],
        /**
         * Translate Y
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-y": [{
          "translate-y": [translate]
        }],
        /**
         * Skew X
         * @see https://tailwindcss.com/docs/skew
         */
        "skew-x": [{
          "skew-x": [skew]
        }],
        /**
         * Skew Y
         * @see https://tailwindcss.com/docs/skew
         */
        "skew-y": [{
          "skew-y": [skew]
        }],
        /**
         * Transform Origin
         * @see https://tailwindcss.com/docs/transform-origin
         */
        "transform-origin": [{
          origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", isArbitraryValue]
        }],
        // Interactivity
        /**
         * Accent Color
         * @see https://tailwindcss.com/docs/accent-color
         */
        accent: [{
          accent: ["auto", colors]
        }],
        /**
         * Appearance
         * @see https://tailwindcss.com/docs/appearance
         */
        appearance: [{
          appearance: ["none", "auto"]
        }],
        /**
         * Cursor
         * @see https://tailwindcss.com/docs/cursor
         */
        cursor: [{
          cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryValue]
        }],
        /**
         * Caret Color
         * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
         */
        "caret-color": [{
          caret: [colors]
        }],
        /**
         * Pointer Events
         * @see https://tailwindcss.com/docs/pointer-events
         */
        "pointer-events": [{
          "pointer-events": ["none", "auto"]
        }],
        /**
         * Resize
         * @see https://tailwindcss.com/docs/resize
         */
        resize: [{
          resize: ["none", "y", "x", ""]
        }],
        /**
         * Scroll Behavior
         * @see https://tailwindcss.com/docs/scroll-behavior
         */
        "scroll-behavior": [{
          scroll: ["auto", "smooth"]
        }],
        /**
         * Scroll Margin
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-m": [{
          "scroll-m": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin X
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mx": [{
          "scroll-mx": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Y
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-my": [{
          "scroll-my": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Start
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-ms": [{
          "scroll-ms": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin End
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-me": [{
          "scroll-me": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Top
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mt": [{
          "scroll-mt": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Right
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mr": [{
          "scroll-mr": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Bottom
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mb": [{
          "scroll-mb": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Left
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-ml": [{
          "scroll-ml": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-p": [{
          "scroll-p": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding X
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-px": [{
          "scroll-px": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Y
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-py": [{
          "scroll-py": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Start
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-ps": [{
          "scroll-ps": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding End
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pe": [{
          "scroll-pe": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Top
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pt": [{
          "scroll-pt": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Right
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pr": [{
          "scroll-pr": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Bottom
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pb": [{
          "scroll-pb": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Left
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pl": [{
          "scroll-pl": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Snap Align
         * @see https://tailwindcss.com/docs/scroll-snap-align
         */
        "snap-align": [{
          snap: ["start", "end", "center", "align-none"]
        }],
        /**
         * Scroll Snap Stop
         * @see https://tailwindcss.com/docs/scroll-snap-stop
         */
        "snap-stop": [{
          snap: ["normal", "always"]
        }],
        /**
         * Scroll Snap Type
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        "snap-type": [{
          snap: ["none", "x", "y", "both"]
        }],
        /**
         * Scroll Snap Type Strictness
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        "snap-strictness": [{
          snap: ["mandatory", "proximity"]
        }],
        /**
         * Touch Action
         * @see https://tailwindcss.com/docs/touch-action
         */
        touch: [{
          touch: ["auto", "none", "manipulation"]
        }],
        /**
         * Touch Action X
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-x": [{
          "touch-pan": ["x", "left", "right"]
        }],
        /**
         * Touch Action Y
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-y": [{
          "touch-pan": ["y", "up", "down"]
        }],
        /**
         * Touch Action Pinch Zoom
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-pz": ["touch-pinch-zoom"],
        /**
         * User Select
         * @see https://tailwindcss.com/docs/user-select
         */
        select: [{
          select: ["none", "text", "all", "auto"]
        }],
        /**
         * Will Change
         * @see https://tailwindcss.com/docs/will-change
         */
        "will-change": [{
          "will-change": ["auto", "scroll", "contents", "transform", isArbitraryValue]
        }],
        // SVG
        /**
         * Fill
         * @see https://tailwindcss.com/docs/fill
         */
        fill: [{
          fill: [colors, "none"]
        }],
        /**
         * Stroke Width
         * @see https://tailwindcss.com/docs/stroke-width
         */
        "stroke-w": [{
          stroke: [isLength, isArbitraryLength, isArbitraryNumber]
        }],
        /**
         * Stroke
         * @see https://tailwindcss.com/docs/stroke
         */
        stroke: [{
          stroke: [colors, "none"]
        }],
        // Accessibility
        /**
         * Screen Readers
         * @see https://tailwindcss.com/docs/screen-readers
         */
        sr: ["sr-only", "not-sr-only"],
        /**
         * Forced Color Adjust
         * @see https://tailwindcss.com/docs/forced-color-adjust
         */
        "forced-color-adjust": [{
          "forced-color-adjust": ["auto", "none"]
        }]
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"]
      },
      conflictingClassGroupModifiers: {
        "font-size": ["leading"]
      }
    };
  };
  var twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);

  // src/lib/utils.ts
  function cn(...inputs) {
    return twMerge(clsx(inputs));
  }
  function createId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
  var lastIssuedMs = 0;
  function nowIso() {
    const now = Date.now();
    lastIssuedMs = now > lastIssuedMs ? now : lastIssuedMs + 1;
    return new Date(lastIssuedMs).toISOString();
  }
  function haptic(durationMs = 30) {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(durationMs);
    }
  }

  // src/components/charts/LineChart.tsx
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var WIDTH = 320;
  var HEIGHT = 140;
  var PAD = { left: 34, right: 8, top: 8, bottom: 18 };
  function pickDecimals(ticks) {
    for (const decimals of [0, 1, 2]) {
      const labels = new Set(ticks.map((value) => value.toFixed(decimals)));
      if (labels.size === ticks.length) return decimals;
    }
    return 2;
  }
  function LineChart({ points, ariaLabel, overlay, formatValue, className }) {
    const gradientId = (0, import_react2.useId)();
    const values = [...points.map((point) => point.value), ...overlay ?? []].filter(
      (value) => value !== null
    );
    if (values.length < 2) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || Math.max(1, Math.abs(max) * 0.1);
    const top = max + span * 0.1;
    const bottom = min - span * 0.1;
    const ticks = min === max ? [min] : [max, (min + max) / 2, min];
    const decimals = pickDecimals(ticks);
    const label = formatValue ?? ((value) => value.toFixed(decimals).replace(".", ","));
    const plotWidth = WIDTH - PAD.left - PAD.right;
    const plotHeight = HEIGHT - PAD.top - PAD.bottom;
    const x = (index) => PAD.left + (points.length === 1 ? plotWidth / 2 : index / (points.length - 1) * plotWidth);
    const y = (value) => PAD.top + plotHeight - (value - bottom) / (top - bottom) * plotHeight;
    const segments = [];
    let current = [];
    points.forEach((point, index) => {
      if (point.value === null) {
        if (current.length > 1) segments.push(current);
        current = [];
        return;
      }
      current.push({ x: x(index), y: y(point.value) });
    });
    if (current.length > 1) segments.push(current);
    const toPolyline = (segment) => segment.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const overlayPoints = (overlay ?? []).map((value, index) => value === null ? null : { x: x(index), y: y(value) }).filter((point) => point !== null);
    const lastSegment = segments[segments.length - 1];
    const baseline = PAD.top + plotHeight;
    const area = lastSegment ? `M ${lastSegment[0].x.toFixed(1)},${baseline.toFixed(1)} L ${toPolyline(lastSegment)} L ${lastSegment[lastSegment.length - 1].x.toFixed(1)},${baseline.toFixed(1)} Z` : null;
    const lastDot = lastSegment?.[lastSegment.length - 1] ?? null;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "svg",
      {
        viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
        role: "img",
        "aria-label": ariaLabel,
        className: cn("w-full", className),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", { id: gradientId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", { offset: "0%", stopColor: "hsl(var(--primary))", stopOpacity: "0.28" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", { offset: "100%", stopColor: "hsl(var(--primary))", stopOpacity: "0" })
          ] }) }),
          ticks.map((value, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "line",
              {
                x1: PAD.left,
                x2: WIDTH - PAD.right,
                y1: y(value),
                y2: y(value),
                stroke: "hsl(var(--border))",
                strokeWidth: 1
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "text",
              {
                x: PAD.left - 4,
                y: y(value) + 3,
                textAnchor: "end",
                fontSize: "8",
                fill: "hsl(var(--muted-foreground))",
                children: label(value)
              }
            )
          ] }, index)),
          area ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: area, fill: `url(#${gradientId})` }) : null,
          segments.map((segment, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "polyline",
            {
              points: toPolyline(segment),
              fill: "none",
              stroke: "hsl(var(--primary))",
              strokeWidth: 2,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              vectorEffect: "non-scaling-stroke"
            },
            index
          )),
          overlayPoints.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "polyline",
            {
              points: toPolyline(overlayPoints),
              fill: "none",
              stroke: "hsl(var(--muted-foreground))",
              strokeWidth: 1.5,
              strokeDasharray: "3 3",
              vectorEffect: "non-scaling-stroke"
            }
          ) : null,
          lastDot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: lastDot.x, cy: lastDot.y, r: 3, fill: "hsl(var(--primary))" }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", { x: PAD.left, y: HEIGHT - 4, fontSize: "8", fill: "hsl(var(--muted-foreground))", children: points[0]?.label }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "text",
            {
              x: WIDTH - PAD.right,
              y: HEIGHT - 4,
              textAnchor: "end",
              fontSize: "8",
              fill: "hsl(var(--muted-foreground))",
              children: points[points.length - 1]?.label
            }
          )
        ]
      }
    );
  }

  // src/components/shared/BottomNav.tsx
  init_define_import_meta_env();

  // node_modules/lucide-react/dist/esm/lucide-react.js
  init_define_import_meta_env();

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  init_define_import_meta_env();
  var import_react4 = __toESM(require_react_shim());

  // node_modules/lucide-react/dist/esm/shared/src/utils.js
  init_define_import_meta_env();
  var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  var mergeClasses = (...classes) => classes.filter((className, index, array) => {
    return Boolean(className) && array.indexOf(className) === index;
  }).join(" ");

  // node_modules/lucide-react/dist/esm/Icon.js
  init_define_import_meta_env();
  var import_react3 = __toESM(require_react_shim());

  // node_modules/lucide-react/dist/esm/defaultAttributes.js
  init_define_import_meta_env();
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  // node_modules/lucide-react/dist/esm/Icon.js
  var Icon = (0, import_react3.forwardRef)(
    ({
      color = "currentColor",
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      className = "",
      children,
      iconNode,
      ...rest
    }, ref) => {
      return (0, import_react3.createElement)(
        "svg",
        {
          ref,
          ...defaultAttributes,
          width: size,
          height: size,
          stroke: color,
          strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
          className: mergeClasses("lucide", className),
          ...rest
        },
        [
          ...iconNode.map(([tag, attrs]) => (0, import_react3.createElement)(tag, attrs)),
          ...Array.isArray(children) ? children : [children]
        ]
      );
    }
  );

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  var createLucideIcon = (iconName, iconNode) => {
    const Component2 = (0, import_react4.forwardRef)(
      ({ className, ...props }, ref) => (0, import_react4.createElement)(Icon, {
        ref,
        iconNode,
        className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
        ...props
      })
    );
    Component2.displayName = `${iconName}`;
    return Component2;
  };

  // node_modules/lucide-react/dist/esm/icons/check.js
  init_define_import_meta_env();
  var Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);

  // node_modules/lucide-react/dist/esm/icons/circle-plus.js
  init_define_import_meta_env();
  var CirclePlus = createLucideIcon("CirclePlus", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M8 12h8", key: "1wcyev" }],
    ["path", { d: "M12 8v8", key: "napkw2" }]
  ]);

  // node_modules/lucide-react/dist/esm/icons/dumbbell.js
  init_define_import_meta_env();
  var Dumbbell = createLucideIcon("Dumbbell", [
    ["path", { d: "M14.4 14.4 9.6 9.6", key: "ic80wn" }],
    [
      "path",
      {
        d: "M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z",
        key: "nnl7wr"
      }
    ],
    ["path", { d: "m21.5 21.5-1.4-1.4", key: "1f1ice" }],
    ["path", { d: "M3.9 3.9 2.5 2.5", key: "1evmna" }],
    [
      "path",
      {
        d: "M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z",
        key: "yhosts"
      }
    ]
  ]);

  // node_modules/lucide-react/dist/esm/icons/house.js
  init_define_import_meta_env();
  var House = createLucideIcon("House", [
    ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
    [
      "path",
      {
        d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        key: "1d0kgt"
      }
    ]
  ]);

  // node_modules/lucide-react/dist/esm/icons/plus.js
  init_define_import_meta_env();
  var Plus = createLucideIcon("Plus", [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }]
  ]);

  // node_modules/lucide-react/dist/esm/icons/salad.js
  init_define_import_meta_env();
  var Salad = createLucideIcon("Salad", [
    ["path", { d: "M7 21h10", key: "1b0cd5" }],
    ["path", { d: "M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z", key: "4rw317" }],
    [
      "path",
      {
        d: "M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1",
        key: "10xrj0"
      }
    ],
    ["path", { d: "m13 12 4-4", key: "1hckqy" }],
    ["path", { d: "M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2", key: "1p4srx" }]
  ]);

  // node_modules/lucide-react/dist/esm/icons/scale.js
  init_define_import_meta_env();
  var Scale = createLucideIcon("Scale", [
    ["path", { d: "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z", key: "7g6ntu" }],
    ["path", { d: "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z", key: "ijws7r" }],
    ["path", { d: "M7 21h10", key: "1b0cd5" }],
    ["path", { d: "M12 3v18", key: "108xh3" }],
    ["path", { d: "M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2", key: "3gwbw2" }]
  ]);

  // node_modules/lucide-react/dist/esm/icons/settings.js
  init_define_import_meta_env();
  var Settings = createLucideIcon("Settings", [
    [
      "path",
      {
        d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
        key: "1qme2f"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
  ]);

  // node_modules/lucide-react/dist/esm/icons/trending-up.js
  init_define_import_meta_env();
  var TrendingUp = createLucideIcon("TrendingUp", [
    ["polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17", key: "126l90" }],
    ["polyline", { points: "16 7 22 7 22 13", key: "kwv8wd" }]
  ]);

  // src/i18n/fr.ts
  init_define_import_meta_env();
  var fr = {
    app: {
      name: "RecompOS",
      tagline: "Le syst\xE8me, pas la motivation."
    },
    nav: {
      today: "Aujourd'hui",
      workouts: "S\xE9ances",
      nutrition: "Nutrition",
      trends: "Tendances",
      settings: "R\xE9glages"
    },
    today: {
      dayMilestone: (n) => `Jour ${n}`,
      floorTitle: "Plancher du jour",
      floorSubtitle: "Non n\xE9gociable, et volontairement ridicule.",
      floorDone: "Plancher valid\xE9",
      floorDoneHint: "La journ\xE9e compte. Tout le reste est du bonus.",
      floorCollapse: "Replier le plancher",
      floorExpand: "Revoir le plancher",
      validateAll: "Tout valider",
      stackTitle: "Habitudes empil\xE9es",
      stackSubtitle: "Accroch\xE9es \xE0 un moment qui existe d\xE9j\xE0.",
      proteinTitle: "Prot\xE9ines",
      proteinOf: (current, target) => `${current} g sur ${target} g`,
      weighInDue: "Pes\xE9e de la semaine",
      weighInDueHint: "Quand tu veux. L'app ne regarde que la tendance, jamais le chiffre du jour.",
      startWorkout: "S\xE9ance 20 min",
      resumeWorkout: "Reprendre la s\xE9ance"
    },
    nutrition: {
      pickPortion: "Quelle source de prot\xE9ines ?",
      pickPortionHint: "Le choix est ajout\xE9 au total du jour.",
      targetFromWeight: (weightKg, perKg) => `Calcul\xE9 sur ${weightKg} kg \xD7 ${String(perKg).replace(".", ",")} g/kg`,
      targetManual: "Cible ajust\xE9e \xE0 la main",
      targetNoWeight: "Cible provisoire \u2014 ajoute ton poids pour la calculer",
      addedGrams: (grams) => `+${grams} g ajout\xE9s`,
      ofTarget: (target) => `sur ${target} g`,
      remaining: (grams) => `encore ${grams} g`,
      targetReached: "Cible atteinte",
      custom: "Montant libre",
      addGrams: (grams) => `Ajouter ${grams} g`,
      deleteDigit: "Effacer un chiffre",
      todayTitle: "Aujourd\u2019hui",
      noLogYet: "Rien de logu\xE9 pour le moment.",
      editLog: (grams) => `Entr\xE9e de ${grams} g`,
      sourceLabel: "Type de source",
      removeLog: "Supprimer cette entr\xE9e",
      undo: "Annuler",
      manage: "G\xE9rer la liste",
      manageDone: "Termin\xE9",
      editItem: (name) => `Modifier ${name}`,
      deleteItem: (name) => `Supprimer ${name}`,
      itemSaved: "Enregistr\xE9",
      itemDeleted: (name) => `${name} supprim\xE9`,
      fieldName: "Nom",
      fieldGrams: "Prot\xE9ines par portion",
      fieldServing: "Portion",
      fieldServingPlaceholder: "1 pot 150 g",
      fieldCuisine: "Cuisine",
      fieldCuisinePlaceholder: "Grec",
      fieldPick: "\xC0 prendre",
      fieldPickPlaceholder: "Gyros poulet, salade",
      fieldAvoid: "\xC0 \xE9viter",
      fieldAvoidPlaceholder: "Frites, sauce blanche",
      fieldEstimate: "Estimation de prot\xE9ines",
      zeroCookAdd: "Ajouter une source",
      zeroCookNew: "Nouvelle source",
      zeroCookEdit: "Modifier la source",
      zeroCookEmpty: "Aucune source. Ajoute ce que tu as dans le frigo.",
      takeoutAdd: "Ajouter une cuisine",
      takeoutNew: "Nouvelle entr\xE9e",
      takeoutEdit: "Modifier l\u2019entr\xE9e",
      zeroCookTitle: "Z\xE9ro-cuisson",
      zeroCookHint: "Ce qu\u2019il y a dans le frigo, et ce que \xE7a rapporte.",
      inStock: (name) => `${name} en stock`,
      logItem: (name, grams) => `Ajouter ${name}, ${grams} g`,
      takeoutTitle: "Livraison",
      takeoutHint: "Quoi commander quand tu ne cuisines pas. Grammes estim\xE9s.",
      allCuisines: "Tout",
      noTakeout: "Aucune entr\xE9e pour cette cuisine.",
      source: {
        shake: "Shaker",
        zero_cook: "Z\xE9ro-cuisson",
        takeout: "Livraison",
        meal: "Repas"
      }
    },
    weight: {
      title: "Poids",
      smoothedHint: "Moyenne des derni\xE8res pes\xE9es, pas le chiffre du jour.",
      emptyHint: "Une pes\xE9e suffit pour calculer ta cible de prot\xE9ines.",
      logCta: "Enregistrer une pes\xE9e",
      logTitle: "Ton poids",
      logHint: "\xC0 jeun de pr\xE9f\xE9rence, mais la r\xE9gularit\xE9 compte plus que le moment.",
      lastEntry: (date, kg) => `Derni\xE8re pes\xE9e : ${date}, ${kg} kg`,
      saved: (kg) => `${kg} kg enregistr\xE9s`,
      history: "Historique",
      empty: "Aucune pes\xE9e enregistr\xE9e."
    },
    habits: {
      title: "Habitudes",
      floorGroup: "Plancher",
      floorGroupHint: "Non n\xE9gociable. Garde-le ridiculement petit.",
      stackGroup: "Empil\xE9es",
      stackGroupHint: "Accroch\xE9es \xE0 un moment qui existe d\xE9j\xE0.",
      archivedGroup: "Archiv\xE9es",
      archivedHint: "Retir\xE9es d'aujourd'hui, mais gard\xE9es dans l'historique.",
      add: "Ajouter une habitude",
      addToFloor: "Ajouter au plancher",
      addToStack: "Ajouter une empil\xE9e",
      edit: (title) => `Modifier ${title}`,
      newTitle: "Nouvelle habitude",
      editTitle: "Modifier l\u2019habitude",
      fieldTitle: "Intitul\xE9",
      fieldTitlePlaceholder: "10 squats",
      fieldAnchor: "Ancre",
      fieldAnchorPlaceholder: "Pendant que le caf\xE9 coule",
      fieldAnchorHint: "Le moment de la journ\xE9e qui d\xE9clenche l\u2019habitude.",
      fieldAction: "Action vis\xE9e",
      fieldActionPlaceholder: "10 squats \xE0 vide",
      fieldKind: "Type",
      fieldCategory: "Cat\xE9gorie",
      fieldMode: "Validation",
      modeToggle: "Case \xE0 cocher",
      modePortion: "Portion de prot\xE9ines",
      modePortionHint: "Valider demande la source et ajoute ses grammes au total du jour.",
      kind: { floor: "Plancher", stack: "Empil\xE9e" },
      category: { workout: "S\xE9ance", nutrition: "Nutrition", mobility: "Mobilit\xE9" },
      moveUp: "Monter",
      moveDown: "Descendre",
      archive: "Archiver",
      restore: "Restaurer",
      archived: (title) => `${title} archiv\xE9e`,
      restored: (title) => `${title} restaur\xE9e`,
      created: "Habitude ajout\xE9e",
      updated: "Habitude modifi\xE9e",
      lastFloorWarning: "C\u2019est la derni\xE8re habitude du plancher. Sans elle, aucune journ\xE9e ne peut \xEAtre valid\xE9e.",
      history: "Historique",
      historyTotal: (n) => `${n} validation${n > 1 ? "s" : ""} au total`,
      historyNever: "Jamais valid\xE9e pour l\u2019instant.",
      historySince: (date) => `Depuis le ${date}`,
      empty: "Aucune habitude ici."
    },
    heatmap: {
      title: "12 derni\xE8res semaines",
      hint: "Une case par jour. Les jours avant l\u2019installation restent vides.",
      legendLess: "Rien",
      legendMore: "Valid\xE9",
      cell: (date, done) => `${date} \u2014 ${done ? "valid\xE9" : "non valid\xE9"}`
    },
    workouts: {
      title: "S\xE9ances",
      circuitTitle: "Circuit 20 min",
      circuitHint: "Trois blocs. Le chrono est un rep\xE8re, pas un compte \xE0 rebours.",
      startCircuit: "D\xE9marrer le circuit",
      endSession: "Terminer la s\xE9ance",
      sessionEnded: (minutes, sets) => `${minutes} min, ${sets} s\xE9rie${sets > 1 ? "s" : ""}`,
      sessionDiscarded: "S\xE9ance abandonn\xE9e, rien n\u2019a \xE9t\xE9 enregistr\xE9.",
      elapsed: "Temps \xE9coul\xE9",
      block: {
        push: "Pouss\xE9e",
        pull: "Tirage",
        legs: "Bas du corps",
        core: "Gainage",
        other: "Autre"
      },
      circuitPlan: "Au programme",
      circuitPlanHint: "Un bloc par groupe. Tu peux changer un mouvement avant de d\xE9marrer.",
      repRangeSummary: (min, max) => `${min} \xE0 ${max} reps`,
      changeExercise: "Changer de mouvement",
      pickExercise: "Choisir un mouvement",
      addExercise: "Ajouter un mouvement",
      newExerciseTitle: "Nouveau mouvement",
      exerciseName: "Nom",
      exerciseNamePlaceholder: "Dips sur chaise",
      exercisePattern: "Groupe",
      repRange: "Fourchette de reps",
      repRangeMin: "Minimum",
      repRangeMax: "Maximum",
      exerciseCreated: (name) => `${name} ajout\xE9`,
      deleteExercise: (name) => `Supprimer ${name}`,
      exerciseDeleted: (name) => `${name} supprim\xE9`,
      exerciseInUse: "Des s\xE9ries r\xE9f\xE9rencent ce mouvement \u2014 il reste dans la liste.",
      customBadge: "perso",
      microSets: "Micro-s\xE9ries",
      microSetsHint: "Une s\xE9rie isol\xE9e, n\u2019importe quand, sans ouvrir de s\xE9ance.",
      logSet: "Logguer une s\xE9rie",
      logSetFor: (name) => `Logguer une s\xE9rie de ${name}`,
      setsToday: "S\xE9ries du jour",
      noSetsToday: "Aucune s\xE9rie aujourd\u2019hui.",
      setSummary: (reps, load) => `${reps} reps \u2014 ${load}`,
      lastTime: "La derni\xE8re fois",
      lastSet: (reps, load) => `${reps} reps, ${load}`,
      firstTime: "Premi\xE8re fois sur ce mouvement.",
      suggestion: "Suggestion",
      progressedTo: (name) => `Haut de la fourchette atteint \u2014 on passe \xE0 ${name}, en repartant du bas.`,
      reps: "R\xE9p\xE9titions",
      load: "Charge ou \xE9lastique",
      loadPlaceholder: "Poids du corps",
      difficulty: "C\u2019\xE9tait comment ?",
      difficultyLabel: { easy: "Facile", target: "Cible", hard: "Difficile" },
      saveSet: "Enregistrer la s\xE9rie",
      setSaved: (reps, name) => `${reps} reps de ${name} enregistr\xE9es`,
      deleteSet: "Supprimer cette s\xE9rie",
      history: "S\xE9ances pass\xE9es",
      noHistory: "Aucune s\xE9ance termin\xE9e pour l\u2019instant.",
      sessionType: { "20min_circuit": "Circuit 20 min", micro_sets: "Micro-s\xE9ries", custom: "Libre" },
      rest: "Repos",
      restStart: (seconds) => `Repos ${seconds} s`,
      restSkip: "Passer le repos",
      restAdd: "+30 s",
      restDone: "Repos termin\xE9"
    },
    strength: {
      title: "Force",
      hint: "Le volume de tes s\xE9ries, semaine par semaine.",
      baseline: "Ta premi\xE8re semaine de s\xE9ries vaut 100.",
      baselineWeek: "C\u2019est ta semaine de r\xE9f\xE9rence : tout se compare \xE0 elle.",
      vsStart: (delta) => delta === 0 ? "Au niveau de ta premi\xE8re semaine" : `${delta > 0 ? "+" : "\u2212"}${Math.abs(delta)} % de volume vs ta premi\xE8re semaine`,
      explainOpen: "Comment c\u2019est calcul\xE9",
      explainClose: "Masquer le calcul",
      explainBody: "On additionne les r\xE9p\xE9titions de toutes tes s\xE9ries de la semaine. Une s\xE9rie au poids du corps compte 1 par rep ; avec une charge ajout\xE9e elle compte un peu plus, \xE0 hauteur de ce que la charge ajoute \xE0 ton poids (8 kg sur 80 kg = 1,1 par rep). Ce total est ramen\xE9 \xE0 100 sur ta premi\xE8re semaine : 130 = tu fais 30 % de volume en plus qu\u2019au d\xE9part. C\u2019est un rep\xE8re de progression, pas une charge maximale.",
      index: (value) => `${value}`,
      weeks: (n) => `${n} semaines`,
      setsThisWeek: (n) => `${n} s\xE9rie${n > 1 ? "s" : ""} cette semaine`,
      empty: "Logue quelques s\xE9ries et la courbe appara\xEEtra.",
      needMoreWeeks: "Une deuxi\xE8me semaine de s\xE9ries et la courbe d\xE9marre.",
      bestSets: "Meilleures s\xE9ries",
      noBest: "Aucune s\xE9rie enregistr\xE9e."
    },
    waist: {
      title: "Tour de taille",
      hint: "Moyenne glissante en pointill\xE9s \u2014 c\u2019est elle qui compte, pas le point du jour.",
      logCta: "Enregistrer une mesure",
      logTitle: "Ton tour de taille",
      logHint: "Au nombril, sans rentrer le ventre, le matin de pr\xE9f\xE9rence.",
      saved: (cm) => `${cm} cm enregistr\xE9s`,
      empty: "Aucune mesure enregistr\xE9e.",
      history: "Historique",
      trendDown: (cm) => `\u2212${cm} cm depuis la premi\xE8re mesure`,
      trendUp: (cm) => `+${cm} cm depuis la premi\xE8re mesure`,
      trendFlat: "Stable depuis la premi\xE8re mesure"
    },
    photos: {
      title: "Coffre photos",
      hint: "Redimensionn\xE9es sur l\u2019appareil, jamais envoy\xE9es nulle part.",
      add: "Ajouter une photo",
      angleLabel: "Angle",
      angle: { front: "Face", side: "Profil", back: "Dos" },
      empty: "Aucune photo pour le moment.",
      compare: "Premi\xE8re et derni\xE8re",
      delete: "Supprimer cette photo",
      deleted: "Photo supprim\xE9e",
      added: "Photo ajout\xE9e",
      failed: "Impossible de lire cette image.",
      storage: (used, count) => `${count} photo${count > 1 ? "s" : ""}, ${used} sur l\u2019appareil`,
      of: (date, angle) => `${angle}, ${date}`
    },
    backup: {
      exportTitle: "Exporter mes donn\xE9es",
      exportHint: "Un fichier JSON, sur ton appareil. \xC0 garder quelque part de s\xFBr.",
      exportedTo: (file) => `${file} t\xE9l\xE9charg\xE9`,
      exportedWithPhotos: "Photos export\xE9es dans un second fichier.",
      importTitle: "Importer une sauvegarde",
      importHint: "Remplace tout ce qui est dans l\u2019app.",
      pickFile: "Choisir un fichier",
      confirmTitle: "Remplacer toutes tes donn\xE9es ?",
      confirmBody: (date) => `La sauvegarde du ${date} va \xE9craser l\u2019int\xE9gralit\xE9 de l\u2019app : habitudes, historique, s\xE9ries, mesures et photos. Cette action est irr\xE9versible.`,
      confirmCta: "Oui, tout remplacer",
      imported: (days, sets) => `Sauvegarde restaur\xE9e : ${days} jour${days > 1 ? "s" : ""}, ${sets} s\xE9rie${sets > 1 ? "s" : ""}`,
      errorNotJson: "Ce fichier n\u2019est pas un JSON lisible.",
      errorNotBundle: "Ce fichier n\u2019est pas une sauvegarde RecompOS.",
      errorFutureVersion: "Cette sauvegarde vient d\u2019une version plus r\xE9cente de l\u2019app. Mets \xE0 jour avant de l\u2019importer."
    },
    consistency: {
      rolling7: "7 jours",
      rolling30: "30 jours",
      band: {
        restart: "\xE0 relancer",
        onTrack: "en route",
        solid: "solide"
      }
    },
    quickAction: {
      open: "Action rapide",
      title: "Action rapide",
      validateFloor: "Valider le plancher",
      addProtein: "+30 g de prot\xE9ines",
      addSet: "+1 s\xE9rie",
      logWeight: "Enregistrer une pes\xE9e",
      close: "Fermer"
    },
    meals: {
      title: "Repas",
      hint: "Photographie l\u2019assiette. Corrige ce qui est faux \u2014 c\u2019est le d\xE9tail qui compte, pas le total.",
      capture: "Photographier un repas",
      capturing: "Lecture de la photo\u2026",
      analysing: "Analyse en cours\u2026",
      retry: "Relancer l\u2019analyse",
      hintTitle: "Ce n\u2019est pas \xE7a ?",
      hintHint: "Dis ce que c\u2019est vraiment. Le mod\xE8le te croit sur les aliments et refait l\u2019estimation des portions depuis la photo.",
      hintPlaceholder: "couscous, b\u0153uf, lben, carottes",
      hintSubmit: "Relancer avec cette pr\xE9cision",
      hintKept: (text) => `Pr\xE9cision donn\xE9e : ${text}`,
      hintNoPhoto: "La photo a \xE9t\xE9 effac\xE9e par la r\xE9tention \u2014 corrige les lignes \xE0 la main.",
      pending: "En attente de r\xE9seau",
      failed: (reason) => `Analyse impossible : ${reason}`,
      empty: "Aucun repas aujourd\u2019hui.",
      noProvider: "Ajoute une cl\xE9 dans les r\xE9glages pour analyser tes photos.",
      addManual: "Saisir \xE0 la main",
      manualTitle: "Repas saisi \xE0 la main",
      photoGone: "photo effac\xE9e par la r\xE9tention",
      unknownError: "erreur inattendue",
      slot: { breakfast: "Petit-d\xE9j", lunch: "D\xE9jeuner", dinner: "D\xEEner", snack: "Collation" },
      slotLabel: "Moment",
      confidence: {
        low: "estimation large",
        medium: "estimation correcte",
        high: "estimation fiable"
      },
      correctedBadge: "corrig\xE9",
      manualBadge: "manuel",
      kcal: (value) => `${value} kcal`,
      macros: (proteinG, carbsG, fatG) => `P ${proteinG} \xB7 G ${carbsG} \xB7 L ${fatG}`,
      editTitle: "D\xE9tail du repas",
      editLabel: "Nom du repas",
      itemName: "Aliment",
      itemQuantity: "Portion",
      itemKcal: "kcal",
      itemProtein: "Prot\xE9ines (g)",
      itemCarbs: "Glucides (g)",
      itemFat: "Lipides (g)",
      addItem: "Ajouter un aliment",
      removeItem: (name) => `Retirer ${name}`,
      delete: "Supprimer ce repas",
      deleted: "Repas supprim\xE9",
      saved: (kcal) => `${kcal} kcal enregistr\xE9es`,
      total: "Total du repas",
      notes: (text) => `Le mod\xE8le signale : ${text}`,
      proteinSynced: "Les prot\xE9ines de ce repas sont compt\xE9es dans le total du jour.",
      dayTitle: "Calories du jour",
      dayOf: (current, target) => `${current} kcal sur ${target} kcal`,
      dayRemaining: (kcal) => `encore ${kcal} kcal`,
      dayOver: (kcal) => `${kcal} kcal au-dessus`,
      targetFromWeight: (maintenance, deficit) => deficit === 0 ? `Maintien estim\xE9 : ${maintenance} kcal` : `Maintien estim\xE9 ${maintenance} kcal, moins ${deficit} %`,
      profileTitle: "Ton corps",
      profileHint: "Taille, \xE2ge et sexe servent uniquement au calcul de la d\xE9pense au repos. Ils ne sortent pas de l\u2019appareil.",
      profileMissing: (fields) => `Estimation approximative, calcul\xE9e sur le poids seul. Il manque : ${fields.join(", ")}.`,
      missing: { height: "la taille", birthYear: "l\u2019ann\xE9e de naissance", sex: "le sexe" },
      profileComplete: "Calcul\xE9 avec ta d\xE9pense au repos (Mifflin-St Jeor).",
      heightLabel: "Taille (cm)",
      // « ex. » so a placeholder cannot be mistaken for a value already entered.
      heightPlaceholder: "ex. 178",
      birthYearLabel: "Ann\xE9e de naissance",
      birthYearPlaceholder: "ex. 1990",
      sexLabel: "Sexe",
      sex: { male: "Homme", female: "Femme" },
      sexHint: "La formule de d\xE9pense au repos en d\xE9pend. Aucun autre usage dans l\u2019app.",
      sexUnset: "Non renseign\xE9",
      activityLabel: "Activit\xE9",
      activity: { sedentary: "Bureau", light: "Bureau + micro-s\xE9ances", moderate: "Actif" },
      activityHint: "Ce que fait ta journ\xE9e, pas ce que tu voudrais qu\u2019elle fasse.",
      targetManual: "Cible ajust\xE9e \xE0 la main",
      targetProvisional: "Cible provisoire \u2014 ajoute ton poids pour l\u2019estimer",
      targetHint: "\xC0 ajuster apr\xE8s trois semaines, en regardant ce que fait ta courbe de poids. Aucune formule ne conna\xEEt ta taille ni ton activit\xE9.",
      deficitLabel: "D\xE9ficit",
      deficitValue: (percent) => percent === 0 ? "Maintien" : `\u2212${percent} %`,
      deficitHint: "Un d\xE9ficit l\xE9ger prot\xE8ge le muscle pendant que le gras part, et se tient un mauvais jour. Au-del\xE0 de 15 %, tu perds du muscle avec.",
      targetTitle: "Cible calorique",
      retention: "Garder les photos",
      retentionValue: (days) => days === 0 ? "Aucune" : `${days} jours`,
      retentionHint: "Pass\xE9 ce d\xE9lai, les chiffres restent et les photos sont effac\xE9es.",
      calorieAutoValue: (kcal) => `Le calcul donnerait ${kcal} kcal`,
      calorieBackToAuto: "Revenir au calcul automatique",
      calorieStep: (kcal) => `${kcal > 0 ? "+" : "\u2212"}${Math.abs(kcal)} kcal`
    },
    vision: {
      title: "Analyse photo des repas",
      hint: "Ta cl\xE9 reste sur cet appareil. Elle n\u2019est ni dans le code, ni envoy\xE9e ailleurs qu\u2019au service que tu choisis.",
      providerLabel: "Service",
      keyLabel: "Cl\xE9 API",
      keyPlaceholder: "gsk_\u2026",
      modelLabel: "Mod\xE8le",
      modelHint: (fallback) => `Vide = ${fallback}`,
      modelRequired: "\xC0 renseigner pour ce service.",
      baseUrlLabel: "Endpoint",
      baseUrlPlaceholder: "https://mon-endpoint/v1",
      getKey: "Obtenir une cl\xE9",
      test: "Tester la cl\xE9",
      testing: "Test en cours\u2026",
      testOk: (model) => `OK \u2014 ${model} r\xE9pond`,
      testFailed: (reason) => `\xC9chec : ${reason}`,
      remove: "Retirer cette cl\xE9",
      removed: "Cl\xE9 retir\xE9e",
      enabled: "Actif",
      enabledHint: "Les services actifs sont essay\xE9s dans l\u2019ordre, le premier qui r\xE9pond gagne.",
      noProvider: "Ajoute une cl\xE9 pour analyser tes repas en photo.",
      errorKind: {
        auth: "cl\xE9 refus\xE9e",
        rate_limit: "quota atteint",
        network: "pas de r\xE9ponse (r\xE9seau ou CORS)",
        server: "erreur du service",
        bad_response: "r\xE9ponse illisible",
        model: "mod\xE8le introuvable chez ce service",
        too_large: "photo trop lourde pour ce service"
      },
      corsHelp: "Si le test \xE9choue en \xAB pas de r\xE9ponse \xBB alors que la cl\xE9 est bonne, c\u2019est que le service refuse les appels directs depuis le navigateur. Il faudra passer par un petit relais."
    },
    onboarding: {
      skip: "Passer",
      next: "Suivant",
      start: "Commencer",
      back: "Retour",
      step: (current, total) => `${current} / ${total}`,
      welcome: {
        title: "Pas de deadline. Pas de s\xE9rie \xE0 ne pas casser.",
        body: "Une semaine rat\xE9e ne remet rien \xE0 z\xE9ro. L'app mesure un pourcentage glissant, pas une performance."
      },
      weight: {
        title: "Ton poids",
        body: "Il sert \xE0 calculer ta cible de prot\xE9ines, et rien d'autre. L'app suit la tendance, jamais le chiffre du jour."
      },
      protein: {
        title: "Ta cible de prot\xE9ines",
        body: "Modifiable \xE0 tout moment dans les r\xE9glages.",
        unit: "g par jour"
      },
      floor: {
        title: "Ton plancher quotidien",
        body: "Garde-le assez petit pour \xEAtre fait un mauvais jour. C'est tout l'int\xE9r\xEAt."
      }
    },
    settings: {
      title: "R\xE9glages",
      proteinTarget: "Cible de prot\xE9ines",
      proteinAuto: "Calcul\xE9e sur ton poids",
      proteinManual: "Ajust\xE9e \xE0 la main",
      proteinAutoValue: (grams) => `Le calcul donnerait ${grams} g`,
      proteinBackToAuto: "Revenir au calcul automatique",
      proteinEditHint: "Modifier la cible la fige : une nouvelle pes\xE9e ne la changera plus.",
      weight: "Poids",
      habits: "Habitudes",
      habitsCount: (floor, stack) => `${floor} au plancher, ${stack} empil\xE9e${stack > 1 ? "s" : ""}`,
      manageHabits: "G\xE9rer mes habitudes",
      restTimer: "Timer de repos par d\xE9faut",
      restTimerCustom: "Autre",
      restTimerCustomTitle: "Dur\xE9e de repos",
      restTimerRange: (min, max) => `Entre ${min} et ${max} secondes.`,
      haptics: "Retour haptique",
      sound: "Sons",
      storage: "Stockage",
      storageUsage: (used, quota) => `${used} utilis\xE9s sur ${quota}`,
      storageUnknown: "Non communiqu\xE9 par le navigateur",
      storagePersisted: "Stockage persistant accord\xE9",
      storageBestEffort: "Stockage non garanti \u2014 pense \xE0 exporter",
      export: "Exporter mes donn\xE9es",
      import: "Importer une sauvegarde",
      about: "\xC0 propos",
      version: "Version",
      installedOn: "Install\xE9e le",
      dataNotice: "Tout reste sur cet appareil. Aucun compte, aucun serveur, aucune donn\xE9e envoy\xE9e nulle part."
    },
    pwa: {
      updateAvailable: "Nouvelle version disponible",
      reload: "Recharger",
      dismiss: "Plus tard",
      offlineReady: "Pr\xEAte \xE0 fonctionner hors ligne"
    },
    common: {
      save: "Enregistrer",
      cancel: "Annuler",
      undo: "Annuler",
      done: "Termin\xE9",
      loading: "Chargement\u2026"
    }
  };
  var t = fr;

  // src/components/shared/BottomNav.tsx
  var import_jsx_runtime2 = __toESM(require_react_shim(), 1);
  var TABS = [
    { to: "/", label: t.nav.today, Icon: House, end: true },
    { to: "/workouts", label: t.nav.workouts, Icon: Dumbbell, end: false },
    { to: "/nutrition", label: t.nav.nutrition, Icon: Salad, end: false },
    { to: "/trends", label: t.nav.trends, Icon: TrendingUp, end: false }
  ];
  function BottomNav() {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "nav",
      {
        "aria-label": "Navigation principale",
        className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur",
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ul", { className: "mx-auto flex max-w-md", children: TABS.map(({ to, label, Icon: Icon2, end }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { className: "flex-1", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          NavLink,
          {
            to,
            end,
            className: ({ isActive }) => cn(
              "flex min-h-touch flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            ),
            children: ({ isActive }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Icon2, { size: 22, strokeWidth: isActive ? 2.4 : 1.8, "aria-hidden": true }),
              label
            ] })
          }
        ) }, to)) })
      }
    );
  }

  // src/components/shared/QuickActionFab.tsx
  init_define_import_meta_env();
  var import_react13 = __toESM(require_react_shim(), 1);

  // src/components/ui/button.tsx
  init_define_import_meta_env();
  var import_react5 = __toESM(require_react_shim(), 1);

  // src/components/ui/button-variants.ts
  init_define_import_meta_env();

  // node_modules/class-variance-authority/dist/index.mjs
  init_define_import_meta_env();
  var falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
  var cx = clsx;
  var cva = (base2, config) => (props) => {
    var _config_compoundVariants;
    if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base2, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
    const { variants, defaultVariants } = config;
    const getVariantClassNames = Object.keys(variants).map((variant) => {
      const variantProp = props === null || props === void 0 ? void 0 : props[variant];
      const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
      if (variantProp === null) return null;
      const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
      return variants[variant][variantKey];
    });
    const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
      let [key, value] = param;
      if (value === void 0) {
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});
    const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
      let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
      return Object.entries(compoundVariantOptions).every((param2) => {
        let [key, value] = param2;
        return Array.isArray(value) ? value.includes({
          ...defaultVariants,
          ...propsWithoutUndefined
        }[key]) : {
          ...defaultVariants,
          ...propsWithoutUndefined
        }[key] === value;
      }) ? [
        ...acc,
        cvClass,
        cvClassName
      ] : acc;
    }, []);
    return cx(base2, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  };

  // src/components/ui/button-variants.ts
  var buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-[transform,background-color,opacity] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    {
      variants: {
        variant: {
          primary: "bg-primary text-primary-foreground hover:bg-primary/90",
          secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          outline: "border border-border bg-transparent hover:bg-accent",
          ghost: "bg-transparent hover:bg-accent",
          destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        },
        size: {
          // 48px is the PRD's minimum touch target; nothing tappable goes below it.
          default: "min-h-touch px-4 py-3",
          lg: "min-h-[56px] px-5 text-base",
          icon: "h-touch w-touch"
        },
        block: { true: "w-full", false: "" }
      },
      defaultVariants: { variant: "primary", size: "default", block: false }
    }
  );

  // src/components/ui/button.tsx
  var import_jsx_runtime3 = __toESM(require_react_shim(), 1);
  var Button = (0, import_react5.forwardRef)(
    ({ className, variant, size, block, type = "button", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "button",
      {
        ref,
        type,
        className: cn(buttonVariants({ variant, size, block }), className),
        ...props
      }
    )
  );
  Button.displayName = "Button";

  // src/components/ui/sheet.tsx
  init_define_import_meta_env();
  var import_react6 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime4 = __toESM(require_react_shim(), 1);
  function Sheet({ open, onClose, title, children, className }) {
    (0, import_react6.useEffect)(() => {
      if (!open) return;
      const onKey = (event) => {
        if (event.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = previousOverflow;
      };
    }, [open, onClose]);
    if (!open) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-end",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": title,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "button",
            {
              type: "button",
              "aria-label": "Fermer",
              className: "absolute inset-0 bg-black/60 backdrop-blur-[2px]",
              onClick: onClose
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            "div",
            {
              className: cn(
                "relative w-full animate-slide-up rounded-t-2xl border-t border-border bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]",
                className
              ),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "mx-auto mb-3 h-1 w-10 rounded-full bg-muted" }),
                title ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { className: "mb-3 text-base font-semibold", children: title }) : null,
                children
              ]
            }
          )
        ]
      }
    );
  }

  // src/features/floor/useFloor.ts
  init_define_import_meta_env();
  var import_react10 = __toESM(require_react_shim());

  // node_modules/dexie-react-hooks/dist/dexie-react-hooks.mjs
  init_define_import_meta_env();

  // node_modules/dexie/import-wrapper.mjs
  init_define_import_meta_env();
  var import_dexie = __toESM(require_dexie(), 1);
  var DexieSymbol = /* @__PURE__ */ Symbol.for("Dexie");
  var Dexie = globalThis[DexieSymbol] || (globalThis[DexieSymbol] = import_dexie.default);
  if (import_dexie.default.semVer !== Dexie.semVer) {
    throw new Error(`Two different versions of Dexie loaded in the same app: ${import_dexie.default.semVer} and ${Dexie.semVer}`);
  }
  var {
    liveQuery,
    mergeRanges,
    rangesOverlap,
    RangeSet,
    cmp,
    Entity,
    PropModification,
    replacePrefix,
    add,
    remove,
    DexieYProvider
  } = Dexie;
  var import_wrapper_default = Dexie;

  // node_modules/dexie-react-hooks/dist/dexie-react-hooks.mjs
  var import_react7 = __toESM(require_react_shim(), 1);
  function useObservable(observableFactory, arg2, arg3) {
    var deps;
    var defaultResult;
    if (typeof observableFactory === "function") {
      deps = arg2 || [];
      defaultResult = arg3;
    } else {
      deps = [];
      defaultResult = arg2;
    }
    var monitor = import_react7.default.useRef({
      hasResult: false,
      result: defaultResult,
      error: null
    });
    var _a = import_react7.default.useReducer(function(x) {
      return x + 1;
    }, 0);
    _a[0];
    var triggerUpdate = _a[1];
    var observable = import_react7.default.useMemo(function() {
      var observable2 = typeof observableFactory === "function" ? observableFactory() : observableFactory;
      if (!observable2 || typeof observable2.subscribe !== "function") {
        if (observableFactory === observable2) {
          throw new TypeError("Given argument to useObservable() was neither a valid observable nor a function.");
        } else {
          throw new TypeError("Observable factory given to useObservable() did not return a valid observable.");
        }
      }
      if (!monitor.current.hasResult && typeof window !== "undefined") {
        if (typeof observable2.hasValue !== "function" || observable2.hasValue()) {
          if (typeof observable2.getValue === "function") {
            monitor.current.result = observable2.getValue();
            monitor.current.hasResult = true;
          } else {
            var subscription = observable2.subscribe(function(val) {
              monitor.current.result = val;
              monitor.current.hasResult = true;
            });
            if (typeof subscription === "function") {
              subscription();
            } else {
              subscription.unsubscribe();
            }
          }
        }
      }
      return observable2;
    }, deps);
    import_react7.default.useDebugValue(monitor.current.result);
    import_react7.default.useEffect(function() {
      var subscription = observable.subscribe(function(val) {
        var current = monitor.current;
        if (current.error !== null || current.result !== val) {
          current.error = null;
          current.result = val;
          current.hasResult = true;
          triggerUpdate();
        }
      }, function(err) {
        var current = monitor.current;
        if (current.error !== err) {
          current.error = err;
          triggerUpdate();
        }
      });
      return typeof subscription === "function" ? subscription : subscription.unsubscribe.bind(subscription);
    }, deps);
    if (monitor.current.error)
      throw monitor.current.error;
    return monitor.current.result;
  }
  function useLiveQuery(querier, deps, defaultResult) {
    return useObservable(function() {
      return liveQuery(querier);
    }, deps || [], defaultResult);
  }

  // src/db/dexie.ts
  init_define_import_meta_env();

  // src/db/seed.ts
  init_define_import_meta_env();
  var DEFAULT_HABITS = [
    {
      title: "5 pompes",
      targetRepsOrAction: "5 pompes",
      category: "workout",
      kind: "floor",
      completionMode: "toggle",
      order: 0
    },
    {
      // A real food portion rather than a shaker: the floor should move the protein
      // total, and picking the source logs its grams (PRD §6.3).
      title: "1 portion de prot\xE9ines z\xE9ro-cuisson",
      targetRepsOrAction: "au choix dans le catalogue",
      category: "nutrition",
      kind: "floor",
      completionMode: "protein_portion",
      order: 1
    },
    {
      title: "10 squats \xE0 vide",
      triggerAnchor: "Pendant que le caf\xE9 coule",
      targetRepsOrAction: "10 squats",
      category: "workout",
      kind: "stack",
      completionMode: "toggle",
      order: 2
    },
    {
      title: "1 s\xE9rie de pompes max",
      triggerAnchor: "Avant d'ouvrir le laptop",
      targetRepsOrAction: "pompes max",
      category: "workout",
      kind: "stack",
      completionMode: "toggle",
      order: 3
    },
    {
      title: "2 min de gainage",
      triggerAnchor: "Douche du soir",
      targetRepsOrAction: "2 min",
      category: "mobility",
      kind: "stack",
      completionMode: "toggle",
      order: 4
    }
  ];
  var FALLBACK_PROTEIN_TARGET_GRAMS = 150;

  // src/db/dexie.ts
  var RecompDb = class extends import_wrapper_default {
    constructor(name = "recompos") {
      super(name);
      __publicField(this, "dailyLogs");
      __publicField(this, "habitCompletions");
      __publicField(this, "proteinLogs");
      __publicField(this, "sessions");
      __publicField(this, "sets");
      __publicField(this, "exercises");
      __publicField(this, "measurements");
      __publicField(this, "photos");
      __publicField(this, "takeoutOptions");
      __publicField(this, "zeroCookItems");
      __publicField(this, "meals");
      __publicField(this, "mealPhotos");
      this.version(1).stores({
        dailyLogs: "date",
        // [habitId+date] is unique per day: it makes a toggle an upsert, not a scan.
        habitCompletions: "id, date, habitId, [habitId+date]",
        proteinLogs: "id, date, timestamp",
        sessions: "id, date, type",
        sets: "id, date, exerciseId, sessionId, [exerciseId+timestamp]",
        exercises: "id, pattern",
        measurements: "id, date",
        photos: "id, date, angle",
        takeoutOptions: "id, cuisine",
        zeroCookItems: "id"
      });
      this.version(2).stores({
        // `status` is indexed because the retry queue asks for pending rows on
        // every launch and on every return of the network.
        meals: "id, date, status, timestamp",
        mealPhotos: "id, mealId, date"
      });
    }
  };
  var db = new RecompDb();

  // src/db/repositories/habitRepository.ts
  init_define_import_meta_env();

  // src/lib/date.ts
  init_define_import_meta_env();
  var DAY_ROLLOVER_HOUR = 4;
  function pad(n) {
    return n < 10 ? `0${n}` : String(n);
  }
  function formatIsoDate(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
  function toLogicalDate(instant = /* @__PURE__ */ new Date()) {
    const shifted = new Date(instant.getTime());
    if (shifted.getHours() < DAY_ROLLOVER_HOUR) {
      shifted.setDate(shifted.getDate() - 1);
    }
    return formatIsoDate(shifted);
  }
  function parseIsoDate(date) {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  function daysBetween(from, to) {
    const a = parseIsoDate(from);
    const b = parseIsoDate(to);
    a.setHours(12, 0, 0, 0);
    b.setHours(12, 0, 0, 0);
    return Math.round((b.getTime() - a.getTime()) / 864e5);
  }
  function lastDays(count, end = toLogicalDate()) {
    const base2 = parseIsoDate(end);
    const days = [];
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(base2.getTime());
      d.setDate(d.getDate() - i);
      days.push(formatIsoDate(d));
    }
    return days;
  }

  // src/db/repositories/habitRepository.ts
  async function completionsForDate(date, database = db) {
    return database.habitCompletions.where("date").equals(date).toArray();
  }
  async function completedHabitIds(date, database = db) {
    const rows = await completionsForDate(date, database);
    return new Set(rows.map((row) => row.habitId));
  }
  async function completeHabit(habitId, date, proteinLogId, database = db) {
    const existing = await database.habitCompletions.where({ habitId, date }).first();
    if (existing) return existing;
    const completion = {
      id: createId(),
      habitId,
      date,
      completedAt: (/* @__PURE__ */ new Date()).toISOString(),
      proteinLogId
    };
    await database.habitCompletions.add(completion);
    return completion;
  }
  async function uncompleteHabit(habitId, date, database = db) {
    const existing = await database.habitCompletions.where({ habitId, date }).first();
    if (!existing) return null;
    await database.habitCompletions.delete(existing.id);
    return existing;
  }
  async function refreshDailyLog(date, floorHabitIds, proteinTargetGrams, database = db) {
    const done = await completedHabitIds(date, database);
    const floorCompleted = floorHabitIds.length > 0 && floorHabitIds.every((id) => done.has(id));
    const existing = await database.dailyLogs.get(date);
    const log = {
      date,
      floorCompleted,
      totalProteinGrams: existing?.totalProteinGrams ?? 0,
      // The target is frozen on first write so changing it later cannot rewrite history.
      proteinTargetGrams: existing?.proteinTargetGrams ?? proteinTargetGrams,
      notes: existing?.notes
    };
    await database.dailyLogs.put(log);
    return log;
  }

  // src/db/repositories/proteinRepository.ts
  init_define_import_meta_env();
  async function logsForDate(date, database = db) {
    const rows = await database.proteinLogs.where("date").equals(date).toArray();
    return rows.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }
  async function totalProteinForDate(date, database = db) {
    const rows = await logsForDate(date, database);
    return rows.reduce((total, row) => total + row.grams, 0);
  }
  async function refreshProteinTotal(date, fallbackTargetGrams, database = db) {
    const total = await totalProteinForDate(date, database);
    const existing = await database.dailyLogs.get(date);
    await database.dailyLogs.put({
      date,
      floorCompleted: existing?.floorCompleted ?? false,
      totalProteinGrams: total,
      // Frozen on first write: raising the target later must not rewrite history.
      proteinTargetGrams: existing?.proteinTargetGrams ?? fallbackTargetGrams,
      notes: existing?.notes
    });
    return total;
  }
  async function addProteinLog(grams, sourceType, targetGrams, options = {}, database = db) {
    const date = options.date ?? toLogicalDate();
    const log = {
      id: createId(),
      date,
      timestamp: nowIso(),
      grams: Math.max(0, Math.round(grams)),
      sourceType,
      note: options.note
    };
    await database.proteinLogs.add(log);
    await refreshProteinTotal(date, targetGrams, database);
    return log;
  }
  async function updateProteinLogSource(id, sourceType, database = db) {
    await database.proteinLogs.update(id, { sourceType });
  }
  async function removeProteinLog(id, targetGrams, database = db) {
    const log = await database.proteinLogs.get(id);
    if (!log) return;
    await database.proteinLogs.delete(id);
    await refreshProteinTotal(log.date, targetGrams, database);
  }

  // src/features/nutrition/useProteinTarget.ts
  init_define_import_meta_env();
  var import_react9 = __toESM(require_react_shim());

  // src/stores/settingsStore.ts
  init_define_import_meta_env();

  // node_modules/zustand/esm/middleware.mjs
  init_define_import_meta_env();
  function createJSONStorage(getStorage, options) {
    let storage;
    try {
      storage = getStorage();
    } catch (_e) {
      return;
    }
    const persistStorage = {
      getItem: (name) => {
        var _a;
        const parse = (str2) => {
          if (str2 === null) {
            return null;
          }
          return JSON.parse(str2, options == null ? void 0 : options.reviver);
        };
        const str = (_a = storage.getItem(name)) != null ? _a : null;
        if (str instanceof Promise) {
          return str.then(parse);
        }
        return parse(str);
      },
      setItem: (name, newValue) => storage.setItem(
        name,
        JSON.stringify(newValue, options == null ? void 0 : options.replacer)
      ),
      removeItem: (name) => storage.removeItem(name)
    };
    return persistStorage;
  }
  var toThenable = (fn) => (input) => {
    try {
      const result = fn(input);
      if (result instanceof Promise) {
        return result;
      }
      return {
        then(onFulfilled) {
          return toThenable(onFulfilled)(result);
        },
        catch(_onRejected) {
          return this;
        }
      };
    } catch (e) {
      return {
        then(_onFulfilled) {
          return this;
        },
        catch(onRejected) {
          return toThenable(onRejected)(e);
        }
      };
    }
  };
  var oldImpl = (config, baseOptions) => (set, get, api) => {
    let options = {
      getStorage: () => localStorage,
      serialize: JSON.stringify,
      deserialize: JSON.parse,
      partialize: (state) => state,
      version: 0,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState
      }),
      ...baseOptions
    };
    let hasHydrated = false;
    const hydrationListeners = /* @__PURE__ */ new Set();
    const finishHydrationListeners = /* @__PURE__ */ new Set();
    let storage;
    try {
      storage = options.getStorage();
    } catch (_e) {
    }
    if (!storage) {
      return config(
        (...args) => {
          console.warn(
            `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
          );
          set(...args);
        },
        get,
        api
      );
    }
    const thenableSerialize = toThenable(options.serialize);
    const setItem = () => {
      const state = options.partialize({ ...get() });
      let errorInSync;
      const thenable = thenableSerialize({ state, version: options.version }).then(
        (serializedValue) => storage.setItem(options.name, serializedValue)
      ).catch((e) => {
        errorInSync = e;
      });
      if (errorInSync) {
        throw errorInSync;
      }
      return thenable;
    };
    const savedSetState = api.setState;
    api.setState = (state, replace2) => {
      savedSetState(state, replace2);
      void setItem();
    };
    const configResult = config(
      (...args) => {
        set(...args);
        void setItem();
      },
      get,
      api
    );
    let stateFromStorage;
    const hydrate = () => {
      var _a;
      if (!storage) return;
      hasHydrated = false;
      hydrationListeners.forEach((cb) => cb(get()));
      const postRehydrationCallback = ((_a = options.onRehydrateStorage) == null ? void 0 : _a.call(options, get())) || void 0;
      return toThenable(storage.getItem.bind(storage))(options.name).then((storageValue) => {
        if (storageValue) {
          return options.deserialize(storageValue);
        }
      }).then((deserializedStorageValue) => {
        if (deserializedStorageValue) {
          if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
            if (options.migrate) {
              return options.migrate(
                deserializedStorageValue.state,
                deserializedStorageValue.version
              );
            }
            console.error(
              `State loaded from storage couldn't be migrated since no migrate function was provided`
            );
          } else {
            return deserializedStorageValue.state;
          }
        }
      }).then((migratedState) => {
        var _a2;
        stateFromStorage = options.merge(
          migratedState,
          (_a2 = get()) != null ? _a2 : configResult
        );
        set(stateFromStorage, true);
        return setItem();
      }).then(() => {
        postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
        hasHydrated = true;
        finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
      }).catch((e) => {
        postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
      });
    };
    api.persist = {
      setOptions: (newOptions) => {
        options = {
          ...options,
          ...newOptions
        };
        if (newOptions.getStorage) {
          storage = newOptions.getStorage();
        }
      },
      clearStorage: () => {
        storage == null ? void 0 : storage.removeItem(options.name);
      },
      getOptions: () => options,
      rehydrate: () => hydrate(),
      hasHydrated: () => hasHydrated,
      onHydrate: (cb) => {
        hydrationListeners.add(cb);
        return () => {
          hydrationListeners.delete(cb);
        };
      },
      onFinishHydration: (cb) => {
        finishHydrationListeners.add(cb);
        return () => {
          finishHydrationListeners.delete(cb);
        };
      }
    };
    hydrate();
    return stateFromStorage || configResult;
  };
  var newImpl = (config, baseOptions) => (set, get, api) => {
    let options = {
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => state,
      version: 0,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState
      }),
      ...baseOptions
    };
    let hasHydrated = false;
    const hydrationListeners = /* @__PURE__ */ new Set();
    const finishHydrationListeners = /* @__PURE__ */ new Set();
    let storage = options.storage;
    if (!storage) {
      return config(
        (...args) => {
          console.warn(
            `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
          );
          set(...args);
        },
        get,
        api
      );
    }
    const setItem = () => {
      const state = options.partialize({ ...get() });
      return storage.setItem(options.name, {
        state,
        version: options.version
      });
    };
    const savedSetState = api.setState;
    api.setState = (state, replace2) => {
      savedSetState(state, replace2);
      void setItem();
    };
    const configResult = config(
      (...args) => {
        set(...args);
        void setItem();
      },
      get,
      api
    );
    api.getInitialState = () => configResult;
    let stateFromStorage;
    const hydrate = () => {
      var _a, _b;
      if (!storage) return;
      hasHydrated = false;
      hydrationListeners.forEach((cb) => {
        var _a2;
        return cb((_a2 = get()) != null ? _a2 : configResult);
      });
      const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
      return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
        if (deserializedStorageValue) {
          if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
            if (options.migrate) {
              return [
                true,
                options.migrate(
                  deserializedStorageValue.state,
                  deserializedStorageValue.version
                )
              ];
            }
            console.error(
              `State loaded from storage couldn't be migrated since no migrate function was provided`
            );
          } else {
            return [false, deserializedStorageValue.state];
          }
        }
        return [false, void 0];
      }).then((migrationResult) => {
        var _a2;
        const [migrated, migratedState] = migrationResult;
        stateFromStorage = options.merge(
          migratedState,
          (_a2 = get()) != null ? _a2 : configResult
        );
        set(stateFromStorage, true);
        if (migrated) {
          return setItem();
        }
      }).then(() => {
        postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
        stateFromStorage = get();
        hasHydrated = true;
        finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
      }).catch((e) => {
        postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
      });
    };
    api.persist = {
      setOptions: (newOptions) => {
        options = {
          ...options,
          ...newOptions
        };
        if (newOptions.storage) {
          storage = newOptions.storage;
        }
      },
      clearStorage: () => {
        storage == null ? void 0 : storage.removeItem(options.name);
      },
      getOptions: () => options,
      rehydrate: () => hydrate(),
      hasHydrated: () => hasHydrated,
      onHydrate: (cb) => {
        hydrationListeners.add(cb);
        return () => {
          hydrationListeners.delete(cb);
        };
      },
      onFinishHydration: (cb) => {
        finishHydrationListeners.add(cb);
        return () => {
          finishHydrationListeners.delete(cb);
        };
      }
    };
    if (!options.skipHydration) {
      hydrate();
    }
    return stateFromStorage || configResult;
  };
  var persistImpl = (config, baseOptions) => {
    if ("getStorage" in baseOptions || "serialize" in baseOptions || "deserialize" in baseOptions) {
      if ((define_import_meta_env_default ? define_import_meta_env_default.MODE : void 0) !== "production") {
        console.warn(
          "[DEPRECATED] `getStorage`, `serialize` and `deserialize` options are deprecated. Use `storage` option instead."
        );
      }
      return oldImpl(config, baseOptions);
    }
    return newImpl(config, baseOptions);
  };
  var persist = persistImpl;

  // src/lib/nutrition.ts
  init_define_import_meta_env();
  var PROTEIN_GRAMS_PER_KG = 1.8;
  var MIN_PROTEIN_TARGET_GRAMS = 80;
  var MAX_PROTEIN_TARGET_GRAMS = 250;
  var DEFAULT_ACTIVITY_LEVEL = "light";
  function clampHeightCm(cm) {
    if (!Number.isFinite(cm)) return 0;
    return Math.min(250, Math.max(120, Math.round(cm)));
  }
  function clampAgeYears(years) {
    if (!Number.isFinite(years)) return 0;
    return Math.min(100, Math.max(14, Math.round(years)));
  }
  var DEFAULT_DEFICIT_PERCENT = 10;
  function clampDeficitPercent(percent) {
    if (!Number.isFinite(percent)) return DEFAULT_DEFICIT_PERCENT;
    return Math.min(30, Math.max(0, Math.round(percent)));
  }
  var MIN_CALORIE_TARGET_KCAL = 1200;
  var MAX_CALORIE_TARGET_KCAL = 5e3;
  var DEFAULT_MEAL_PHOTO_RETENTION_DAYS = 30;
  function clampCalorieTargetKcal(kcal) {
    if (!Number.isFinite(kcal)) return MIN_CALORIE_TARGET_KCAL;
    return Math.min(MAX_CALORIE_TARGET_KCAL, Math.max(MIN_CALORIE_TARGET_KCAL, Math.round(kcal)));
  }
  var MIN_WEIGHT_KG = 35;
  var MAX_WEIGHT_KG = 250;
  var WEIGHT_SMOOTHING_POINTS = 4;
  var WEIGH_IN_INTERVAL_DAYS = 7;
  function computeProteinTargetGrams(weightKg) {
    const raw = weightKg * PROTEIN_GRAMS_PER_KG;
    const rounded = Math.round(raw / 5) * 5;
    return Math.min(MAX_PROTEIN_TARGET_GRAMS, Math.max(MIN_PROTEIN_TARGET_GRAMS, rounded));
  }
  function smoothedWeightKg(weightsNewestFirst, points = WEIGHT_SMOOTHING_POINTS) {
    const sample = weightsNewestFirst.slice(0, points);
    if (sample.length === 0) return null;
    const sum = sample.reduce((total, kg) => total + kg, 0);
    return Math.round(sum / sample.length * 10) / 10;
  }
  function clampWeightKg(kg) {
    return Math.min(MAX_WEIGHT_KG, Math.max(MIN_WEIGHT_KG, Math.round(kg * 10) / 10));
  }
  function clampProteinTargetGrams(grams) {
    return Math.min(MAX_PROTEIN_TARGET_GRAMS, Math.max(MIN_PROTEIN_TARGET_GRAMS, Math.round(grams)));
  }

  // src/lib/timer.ts
  init_define_import_meta_env();
  var REST_PRESETS = [60, 90];
  var MIN_REST_SECONDS = 15;
  var MAX_REST_SECONDS = 600;
  function clampRestSeconds(seconds) {
    if (!Number.isFinite(seconds)) return REST_PRESETS[0];
    return Math.min(MAX_REST_SECONDS, Math.max(MIN_REST_SECONDS, Math.round(seconds)));
  }

  // src/types/models.ts
  init_define_import_meta_env();
  var SCHEMA_VERSION = 3;

  // src/stores/settingsStore.ts
  var STORAGE_KEY = "recompos:settings";
  function seedHabits() {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    return DEFAULT_HABITS.map((habit) => ({
      ...habit,
      id: createId(),
      createdAt: now,
      updatedAt: now
    }));
  }
  function initialSettings() {
    return {
      schemaVersion: SCHEMA_VERSION,
      installedAt: (/* @__PURE__ */ new Date()).toISOString(),
      proteinTargetMode: "auto",
      locale: "fr",
      restTimerDefaultSeconds: 60,
      hapticsEnabled: true,
      soundEnabled: true,
      calorieTargetMode: "auto",
      calorieDeficitPercent: DEFAULT_DEFICIT_PERCENT,
      activityLevel: DEFAULT_ACTIVITY_LEVEL,
      mealPhotoRetentionDays: DEFAULT_MEAL_PHOTO_RETENTION_DAYS
    };
  }
  var useSettingsStore = create()(
    persist(
      (set, get) => ({
        settings: initialSettings(),
        habits: seedHabits(),
        setManualProteinTarget: (grams) => set((state) => ({
          settings: {
            ...state.settings,
            proteinTargetMode: "manual",
            manualProteinTargetGrams: clampProteinTargetGrams(grams)
          }
        })),
        resetProteinTargetToAuto: () => set((state) => ({
          settings: {
            ...state.settings,
            proteinTargetMode: "auto",
            manualProteinTargetGrams: void 0
          }
        })),
        setRestTimerSeconds: (seconds) => set((state) => ({
          settings: { ...state.settings, restTimerDefaultSeconds: clampRestSeconds(seconds) }
        })),
        setManualCalorieTarget: (kcal) => set((state) => ({
          settings: {
            ...state.settings,
            calorieTargetMode: "manual",
            manualCalorieTargetKcal: clampCalorieTargetKcal(kcal)
          }
        })),
        resetCalorieTargetToAuto: () => set((state) => {
          const { manualCalorieTargetKcal: _dropped, ...settings } = state.settings;
          return { settings: { ...settings, calorieTargetMode: "auto" } };
        }),
        setCalorieDeficitPercent: (percent) => set((state) => ({
          settings: {
            ...state.settings,
            calorieDeficitPercent: clampDeficitPercent(percent),
            // Changing the deficit is a request for the calculation to apply, so
            // it hands the target back to auto rather than sitting inert behind
            // a frozen manual number.
            calorieTargetMode: "auto"
          }
        })),
        setBodyProfile: (patch) => set((state) => {
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
          return {
            settings: {
              ...state.settings,
              ...patch,
              ...patch.heightCm !== void 0 ? { heightCm: patch.heightCm ? clampHeightCm(patch.heightCm) : void 0 } : {},
              ...patch.birthYear !== void 0 ? {
                birthYear: patch.birthYear ? currentYear - clampAgeYears(currentYear - patch.birthYear) : void 0
              } : {}
            }
          };
        }),
        setMealPhotoRetentionDays: (days) => set((state) => ({
          settings: {
            ...state.settings,
            mealPhotoRetentionDays: Math.max(0, Math.min(365, Math.round(days)))
          }
        })),
        setVisionProvider: (id, patch) => set((state) => {
          const current = state.settings.visionProviders?.[id];
          return {
            settings: {
              ...state.settings,
              visionProviders: {
                ...state.settings.visionProviders,
                [id]: { apiKey: "", enabled: true, ...current, ...patch }
              }
            }
          };
        }),
        clearVisionProvider: (id) => set((state) => {
          const providers = { ...state.settings.visionProviders };
          delete providers[id];
          return { settings: { ...state.settings, visionProviders: providers } };
        }),
        toggleHaptics: (enabled) => set((state) => ({ settings: { ...state.settings, hapticsEnabled: enabled } })),
        toggleSound: (enabled) => set((state) => ({ settings: { ...state.settings, soundEnabled: enabled } })),
        completeOnboarding: () => set((state) => ({
          settings: { ...state.settings, onboardingCompletedAt: (/* @__PURE__ */ new Date()).toISOString() }
        })),
        markCatalogsSeeded: () => set(
          (state) => state.settings.catalogsSeededAt ? state : { settings: { ...state.settings, catalogsSeededAt: (/* @__PURE__ */ new Date()).toISOString() } }
        ),
        addHabit: (habit) => set((state) => {
          const now = (/* @__PURE__ */ new Date()).toISOString();
          const order = state.habits.reduce((max, h) => Math.max(max, h.order), -1) + 1;
          return {
            habits: [
              ...state.habits,
              { ...habit, id: createId(), order, createdAt: now, updatedAt: now }
            ]
          };
        }),
        updateHabit: (id, patch) => set((state) => ({
          habits: state.habits.map(
            (habit) => habit.id === id ? { ...habit, ...patch, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } : habit
          )
        })),
        // Archive rather than delete: a deleted habit would punch a hole in the
        // completions history and silently change past consistency scores.
        archiveHabit: (id) => set((state) => ({
          habits: state.habits.map(
            (habit) => habit.id === id ? {
              ...habit,
              archivedAt: (/* @__PURE__ */ new Date()).toISOString(),
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            } : habit
          )
        })),
        restoreHabit: (id) => set((state) => {
          const now = (/* @__PURE__ */ new Date()).toISOString();
          const order = state.habits.reduce((max, h) => Math.max(max, h.order), -1) + 1;
          return {
            habits: state.habits.map(
              (habit) => habit.id === id ? { ...habit, archivedAt: void 0, order, updatedAt: now } : habit
            )
          };
        }),
        // Order is a single sequence across both kinds, so moving within a kind is
        // a swap with the previous or next *active habit of that kind*, never with
        // the numerically adjacent one — which may belong to the other list.
        moveHabit: (id, direction) => set((state) => {
          const habit = state.habits.find((h) => h.id === id);
          if (!habit) return {};
          const siblings = selectHabits(state.habits, habit.kind);
          const index = siblings.findIndex((h) => h.id === id);
          const target = siblings[index + direction];
          if (!target) return {};
          const now = (/* @__PURE__ */ new Date()).toISOString();
          return {
            habits: state.habits.map((h) => {
              if (h.id === habit.id) return { ...h, order: target.order, updatedAt: now };
              if (h.id === target.id) return { ...h, order: habit.order, updatedAt: now };
              return h;
            })
          };
        }),
        installedOnDate: () => toLogicalDate(new Date(get().settings.installedAt))
      }),
      {
        name: STORAGE_KEY,
        version: SCHEMA_VERSION,
        migrate: (persisted, fromVersion) => migrateSettings(persisted, fromVersion)
      }
    )
  );
  function migrateSettings(persisted, fromVersion) {
    const state = persisted;
    if (fromVersion >= SCHEMA_VERSION) return state;
    const { proteinTargetGrams, ...settings } = state.settings;
    return {
      settings: {
        ...settings,
        schemaVersion: SCHEMA_VERSION,
        // v2 → v3 added the calorie target and the meal photo retention. Both get
        // their defaults rather than being left undefined, so nothing downstream
        // has to guard for a settings object that predates the meal module.
        calorieTargetMode: settings.calorieTargetMode ?? "auto",
        calorieDeficitPercent: settings.calorieDeficitPercent ?? DEFAULT_DEFICIT_PERCENT,
        activityLevel: settings.activityLevel ?? DEFAULT_ACTIVITY_LEVEL,
        mealPhotoRetentionDays: settings.mealPhotoRetentionDays ?? DEFAULT_MEAL_PHOTO_RETENTION_DAYS,
        proteinTargetMode: proteinTargetGrams ? "manual" : "auto",
        ...proteinTargetGrams ? { manualProteinTargetGrams: clampProteinTargetGrams(proteinTargetGrams) } : {}
      },
      habits: state.habits.map((habit) => {
        const isLegacyShake = habit.category === "nutrition" && /shaker/i.test(habit.title) && habit.kind === "floor";
        if (isLegacyShake) {
          return {
            ...habit,
            title: "1 portion de prot\xE9ines z\xE9ro-cuisson",
            targetRepsOrAction: "au choix dans le catalogue",
            completionMode: "protein_portion",
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
        return { ...habit, completionMode: habit.completionMode ?? "toggle" };
      })
    };
  }
  function selectHabits(habits, kind) {
    return habits.filter((habit) => !habit.archivedAt && habit.kind === kind).sort((a, b) => a.order - b.order);
  }

  // src/features/weight/useWeight.ts
  init_define_import_meta_env();
  var import_react8 = __toESM(require_react_shim());

  // src/db/repositories/measurementRepository.ts
  init_define_import_meta_env();
  async function logWeight(weightKg, date = toLogicalDate(), database = db) {
    const existing = await database.measurements.where("date").equals(date).first();
    const measurement = {
      id: existing?.id ?? createId(),
      date,
      weightKg: clampWeightKg(weightKg),
      waistCm: existing?.waistCm,
      createdAt: existing?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()
    };
    await database.measurements.put(measurement);
    return measurement;
  }
  async function recentWeights(limit = 12, database = db) {
    const rows = await database.measurements.orderBy("date").reverse().toArray();
    return rows.filter((row) => typeof row.weightKg === "number").slice(0, limit);
  }
  function isWeighInDue(lastDate, intervalDays, today = toLogicalDate()) {
    if (!lastDate) return true;
    return daysBetween(lastDate, today) >= intervalDays;
  }

  // src/features/weight/useWeight.ts
  function useWeight() {
    const entries = useLiveQuery(() => recentWeights(24), [], []) ?? [];
    const values = entries.map((entry) => entry.weightKg);
    const smoothedKg = smoothedWeightKg(values);
    const previousSmoothed = values.length > 1 ? smoothedWeightKg(values.slice(1)) : null;
    const trendKg = smoothedKg !== null && previousSmoothed !== null ? Math.round((smoothedKg - previousSmoothed) * 10) / 10 : null;
    const log = (0, import_react8.useCallback)(async (weightKg) => {
      await logWeight(weightKg, toLogicalDate());
      haptic();
    }, []);
    return {
      entries,
      latest: entries[0] ?? null,
      smoothedKg,
      trendKg,
      isDue: isWeighInDue(entries[0]?.date ?? null, WEIGH_IN_INTERVAL_DAYS),
      hasWeight: entries.length > 0,
      log
    };
  }

  // src/features/nutrition/useProteinTarget.ts
  function useProteinTarget() {
    const mode = useSettingsStore((state) => state.settings.proteinTargetMode);
    const manualGrams = useSettingsStore((state) => state.settings.manualProteinTargetGrams);
    const setManualProteinTarget = useSettingsStore((state) => state.setManualProteinTarget);
    const resetProteinTargetToAuto = useSettingsStore((state) => state.resetProteinTargetToAuto);
    const { smoothedKg } = useWeight();
    const computedGrams = smoothedKg === null ? null : computeProteinTargetGrams(smoothedKg);
    const targetGrams = mode === "manual" && typeof manualGrams === "number" ? manualGrams : computedGrams ?? FALLBACK_PROTEIN_TARGET_GRAMS;
    const setManual = (0, import_react9.useCallback)(
      (grams) => setManualProteinTarget(grams),
      [setManualProteinTarget]
    );
    const useAuto = (0, import_react9.useCallback)(() => resetProteinTargetToAuto(), [resetProteinTargetToAuto]);
    return {
      targetGrams,
      mode,
      computedGrams,
      smoothedWeightKg: smoothedKg,
      gramsPerKg: PROTEIN_GRAMS_PER_KG,
      isFallback: mode === "auto" && computedGrams === null,
      setManual,
      useAuto
    };
  }

  // src/lib/consistency.ts
  init_define_import_meta_env();
  function bandFor(percent) {
    if (percent >= 80) return "solid";
    if (percent >= 50) return "onTrack";
    return "restart";
  }
  function consistencyScore(windowDays, completedDates, installedOn, today = toLogicalDate()) {
    const completedSet = completedDates instanceof Set ? completedDates : new Set(completedDates);
    const daysSinceInstall = daysBetween(installedOn, today) + 1;
    const eligible = Math.max(1, Math.min(windowDays, daysSinceInstall));
    const window2 = lastDays(eligible, today);
    const completed = window2.reduce((n, day) => completedSet.has(day) ? n + 1 : n, 0);
    const percent = Math.round(completed / eligible * 100);
    return { percent, completed, eligible, band: bandFor(percent) };
  }
  function dayNumber(installedOn, today = toLogicalDate()) {
    return Math.max(1, daysBetween(installedOn, today) + 1);
  }

  // src/lib/heatmap.ts
  init_define_import_meta_env();
  var HEATMAP_WEEKS = 12;
  var DAYS_PER_WEEK = 7;

  // src/features/floor/useFloor.ts
  function useFloor() {
    const today = toLogicalDate();
    const habits = useSettingsStore((state) => state.habits);
    const installedAt = useSettingsStore((state) => state.settings.installedAt);
    const { targetGrams } = useProteinTarget();
    const installedOn = (0, import_react10.useMemo)(() => toLogicalDate(new Date(installedAt)), [installedAt]);
    const floorHabits = (0, import_react10.useMemo)(() => selectHabits(habits, "floor"), [habits]);
    const stackHabits = (0, import_react10.useMemo)(() => selectHabits(habits, "stack"), [habits]);
    const completedIdsQuery = useLiveQuery(() => completedHabitIds(today), [today], /* @__PURE__ */ new Set());
    const completedIds = (0, import_react10.useMemo)(() => completedIdsQuery ?? /* @__PURE__ */ new Set(), [completedIdsQuery]);
    const historyWindow = (0, import_react10.useMemo)(() => lastDays(HEATMAP_WEEKS * DAYS_PER_WEEK, today), [today]);
    const dailyLogs = useLiveQuery(
      () => db.dailyLogs.where("date").between(historyWindow[0], today, true, true).toArray(),
      [historyWindow, today],
      []
    );
    const completedDates = (0, import_react10.useMemo)(
      () => new Set((dailyLogs ?? []).filter((log) => log.floorCompleted).map((log) => log.date)),
      [dailyLogs]
    );
    const floorCompleted = floorHabits.length > 0 && floorHabits.every((habit) => completedIds.has(habit.id));
    const sync = (0, import_react10.useCallback)(
      () => refreshDailyLog(
        today,
        floorHabits.map((habit) => habit.id),
        targetGrams
      ),
      [today, floorHabits, targetGrams]
    );
    const toggle = (0, import_react10.useCallback)(
      async (habit) => {
        const removed = await uncompleteHabit(habit.id, today);
        if (removed) {
          if (removed.proteinLogId) await removeProteinLog(removed.proteinLogId, targetGrams);
          await sync();
          return "uncompleted";
        }
        if (habit.completionMode === "protein_portion") return "needs_portion";
        await completeHabit(habit.id, today);
        await sync();
        haptic();
        return "completed";
      },
      [today, sync, targetGrams]
    );
    const completeWithPortion = (0, import_react10.useCallback)(
      async (habit, item) => {
        const log = await addProteinLog(item.proteinPerServingGrams, "zero_cook", targetGrams, {
          note: item.name,
          date: today
        });
        await completeHabit(habit.id, today, log.id);
        await sync();
        haptic();
      },
      [today, sync, targetGrams]
    );
    const completeFloor = (0, import_react10.useCallback)(async () => {
      const pending = [];
      for (const habit of floorHabits) {
        if (completedIds.has(habit.id)) continue;
        if (habit.completionMode === "protein_portion") {
          pending.push(habit);
          continue;
        }
        await completeHabit(habit.id, today);
      }
      await sync();
      if (pending.length === 0) haptic(40);
      return pending;
    }, [floorHabits, completedIds, today, sync]);
    return {
      today,
      installedOn,
      dayNumber: dayNumber(installedOn, today),
      floorHabits,
      stackHabits,
      completedIds,
      completedDates,
      floorCompleted,
      score7: consistencyScore(7, completedDates, installedOn, today),
      score30: consistencyScore(30, completedDates, installedOn, today),
      toggle,
      completeWithPortion,
      completeFloor
    };
  }

  // src/features/nutrition/useProtein.ts
  init_define_import_meta_env();
  var import_react11 = __toESM(require_react_shim());
  function useProtein() {
    const today = toLogicalDate();
    const { targetGrams } = useProteinTarget();
    const logs = useLiveQuery(() => logsForDate(today), [today], []) ?? [];
    const totalGrams = logs.reduce((total, log) => total + log.grams, 0);
    const add2 = (0, import_react11.useCallback)(
      async (grams, sourceType, note) => {
        const log = await addProteinLog(grams, sourceType, targetGrams, { note, date: today });
        haptic();
        return log;
      },
      [targetGrams, today]
    );
    const remove2 = (0, import_react11.useCallback)(
      async (id) => {
        await removeProteinLog(id, targetGrams);
      },
      [targetGrams]
    );
    const setSource = (0, import_react11.useCallback)(
      (id, sourceType) => updateProteinLogSource(id, sourceType),
      []
    );
    return {
      today,
      logs,
      totalGrams,
      targetGrams,
      remainingGrams: Math.max(0, targetGrams - totalGrams),
      percent: targetGrams === 0 ? 0 : Math.round(totalGrams / targetGrams * 100),
      add: add2,
      remove: remove2,
      setSource
    };
  }

  // src/features/weight/WeightSheet.tsx
  init_define_import_meta_env();
  var import_react12 = __toESM(require_react_shim());
  function WeightSheet({ open, initialKg, onClose, onSubmit }) {
    const [value, setValue] = (0, import_react12.useState)("");
    (0, import_react12.useEffect)(() => {
      if (open) setValue(initialKg ? String(initialKg) : "");
    }, [open, initialKg]);
    const parsed = Number(value.replace(",", "."));
    const isValid = Number.isFinite(parsed) && parsed >= MIN_WEIGHT_KG && parsed <= MAX_WEIGHT_KG;
    return /* @__PURE__ */ React.createElement(Sheet, { open, onClose, title: t.weight.logTitle }, /* @__PURE__ */ React.createElement("p", { className: "mb-3 text-sm text-muted-foreground" }, t.weight.logHint), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        inputMode: "decimal",
        autoFocus: true,
        "aria-label": t.weight.logTitle,
        value,
        onChange: (event) => setValue(event.target.value),
        placeholder: "80,5",
        className: "tnum min-h-[56px] flex-1 rounded-lg border border-border bg-background px-4 text-2xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "text-lg text-muted-foreground" }, "kg")), /* @__PURE__ */ React.createElement(
      Button,
      {
        size: "lg",
        block: true,
        className: "mt-3",
        disabled: !isValid,
        onClick: () => {
          if (isValid) onSubmit(parsed);
        }
      },
      t.common.save
    ));
  }

  // src/components/shared/QuickActionFab.tsx
  var import_jsx_runtime5 = __toESM(require_react_shim(), 1);
  function QuickActionFab() {
    const open = useUiStore((state) => state.quickActionOpen);
    const setOpen = useUiStore((state) => state.setQuickActionOpen);
    const showToast = useUiStore((state) => state.showToast);
    const requestMicroSet = useUiStore((state) => state.requestMicroSet);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { completeFloor, floorCompleted } = useFloor();
    const protein = useProtein();
    const weight = useWeight();
    const [weighInOpen, setWeighInOpen] = (0, import_react13.useState)(false);
    const QUICK_PROTEIN_GRAMS = 30;
    const onValidateFloor = async () => {
      const pending = await completeFloor();
      setOpen(false);
      if (pending.length > 0) {
        navigate("/");
        showToast(t.nutrition.pickPortion);
        return;
      }
      showToast(t.today.floorDone);
    };
    const onAddProtein = async () => {
      const log = await protein.add(QUICK_PROTEIN_GRAMS, "meal");
      setOpen(false);
      showToast(t.nutrition.addedGrams(QUICK_PROTEIN_GRAMS), {
        label: t.nutrition.undo,
        run: () => protein.remove(log.id)
      });
    };
    const onAddSet = () => {
      requestMicroSet();
      navigate("/workouts");
    };
    const onLogWeight = async (kg) => {
      await weight.log(kg);
      setWeighInOpen(false);
      showToast(t.weight.saved(kg));
    };
    if (pathname.startsWith("/settings")) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "button",
        {
          type: "button",
          "aria-label": t.quickAction.open,
          onClick: () => setOpen(true),
          className: "fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95",
          children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Plus, { size: 26, "aria-hidden": true })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Sheet, { open, onClose: () => setOpen(false), title: t.quickAction.title, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          Button,
          {
            size: "lg",
            block: true,
            onClick: onValidateFloor,
            disabled: floorCompleted,
            className: "justify-start",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Check, { size: 20, "aria-hidden": true }),
              floorCompleted ? t.today.floorDone : t.quickAction.validateFloor
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          Button,
          {
            size: "lg",
            block: true,
            variant: "secondary",
            className: "justify-start",
            onClick: onAddProtein,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CirclePlus, { size: 20, "aria-hidden": true }),
              t.quickAction.addProtein
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(Button, { size: "lg", block: true, variant: "secondary", className: "justify-start", onClick: onAddSet, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Dumbbell, { size: 20, "aria-hidden": true }),
          t.quickAction.addSet
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          Button,
          {
            size: "lg",
            block: true,
            variant: "secondary",
            className: "justify-start",
            onClick: () => {
              setOpen(false);
              setWeighInOpen(true);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Scale, { size: 20, "aria-hidden": true }),
              t.quickAction.logWeight
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        WeightSheet,
        {
          open: weighInOpen,
          initialKg: weight.latest?.weightKg ?? null,
          onClose: () => setWeighInOpen(false),
          onSubmit: onLogWeight
        }
      )
    ] });
  }

  // src/components/shared/ScreenHeader.tsx
  init_define_import_meta_env();
  var import_jsx_runtime6 = __toESM(require_react_shim(), 1);
  function ScreenHeader({ title, subtitle, showSettings = false }) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("header", { className: "flex items-start justify-between gap-4 px-4 pb-2 pt-[calc(1rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h1", { className: "text-2xl font-semibold tracking-tight", children: title }),
        subtitle ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "mt-0.5 text-sm text-muted-foreground", children: subtitle }) : null
      ] }),
      showSettings ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        Link,
        {
          to: "/settings",
          "aria-label": t.nav.settings,
          className: "h-touch w-touch flex shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
          children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Settings, { size: 22, "aria-hidden": true })
        }
      ) : null
    ] });
  }

  // src/components/shared/Toast.tsx
  init_define_import_meta_env();
  var import_react14 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime7 = __toESM(require_react_shim(), 1);
  function Toast() {
    const toast = useUiStore((state) => state.toast);
    const dismiss = useUiStore((state) => state.dismissToast);
    (0, import_react14.useEffect)(() => {
      if (!toast) return;
      const timer = window.setTimeout(dismiss, toast.durationMs);
      return () => window.clearTimeout(timer);
    }, [toast, dismiss]);
    if (!toast) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: "fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4",
        children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex animate-slide-up items-center gap-3 rounded-full border border-border bg-card py-2 pl-4 pr-2 shadow-lg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-sm", children: toast.message }),
          toast.action ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "button",
            {
              type: "button",
              onClick: async () => {
                await toast.action?.run();
                dismiss();
              },
              className: "min-h-[36px] rounded-full px-3 text-sm font-semibold text-primary transition-colors active:bg-accent",
              children: toast.action.label
            }
          ) : null
        ] })
      }
    );
  }

  // src/components/shared/UpdatePrompt.tsx
  init_define_import_meta_env();

  // .design-sync/shims/pwa-register.ts
  init_define_import_meta_env();
  var import_react15 = __toESM(require_react_shim());
  function useRegisterSW() {
    const needRefresh = (0, import_react15.useState)(
      typeof window !== "undefined" && window.__DS_PWA_NEED_REFRESH__ === true
    );
    const offlineReady = (0, import_react15.useState)(false);
    return {
      needRefresh,
      offlineReady,
      updateServiceWorker: async () => {
      }
    };
  }

  // src/components/shared/UpdatePrompt.tsx
  var import_jsx_runtime8 = __toESM(require_react_shim(), 1);
  function UpdatePrompt() {
    const {
      needRefresh: [needRefresh, setNeedRefresh],
      updateServiceWorker
    } = useRegisterSW();
    if (!needRefresh) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))]", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("p", { className: "text-sm", children: t.pwa.updateAvailable }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "flex shrink-0 gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { variant: "ghost", onClick: () => setNeedRefresh(false), children: t.pwa.dismiss }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { onClick: () => void updateServiceWorker(true), children: t.pwa.reload })
      ] })
    ] });
  }

  // src/components/ui/card.tsx
  init_define_import_meta_env();
  var import_jsx_runtime9 = __toESM(require_react_shim(), 1);
  function Card({ className, ...props }) {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "div",
      {
        className: cn("rounded-lg border border-border bg-card text-card-foreground", className),
        ...props
      }
    );
  }
  function CardHeader({ className, ...props }) {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: cn("flex flex-col gap-1 p-4 pb-2", className), ...props });
  }
  function CardTitle({ className, ...props }) {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h2", { className: cn("text-base font-semibold leading-tight", className), ...props });
  }
  function CardDescription({
    className,
    ...props
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: cn("text-sm text-muted-foreground", className), ...props });
  }
  function CardContent({ className, ...props }) {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: cn("p-4 pt-2", className), ...props });
  }

  // src/components/ui/field.tsx
  init_define_import_meta_env();
  var import_react17 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime10 = __toESM(require_react_shim(), 1);
  function Field({ label, hint, className, children }) {
    const id = (0, import_react17.useId)();
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: cn("flex flex-col gap-1.5", className), children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("label", { htmlFor: id, className: "text-sm font-medium", children: label }),
      children(id),
      hint ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-xs text-muted-foreground", children: hint }) : null
    ] });
  }

  // src/components/ui/input.tsx
  init_define_import_meta_env();
  var import_react18 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime11 = __toESM(require_react_shim(), 1);
  var base = "min-h-touch w-full rounded-lg border border-border bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";
  var Input = (0, import_react18.forwardRef)(
    ({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("input", { ref, className: cn(base, className), ...props })
  );
  Input.displayName = "Input";
  var Textarea = (0, import_react18.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("textarea", { ref, className: cn(base, "min-h-[80px] resize-y", className), ...props }));
  Textarea.displayName = "Textarea";

  // src/components/ui/progress.tsx
  init_define_import_meta_env();
  var import_jsx_runtime12 = __toESM(require_react_shim(), 1);
  function Progress({ value, max = 100, label, className, ...props }) {
    const percent = max === 0 ? 0 : Math.min(100, Math.max(0, value / max * 100));
    return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "div",
      {
        role: "progressbar",
        "aria-valuenow": Math.round(percent),
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-label": label,
        className: cn("h-2 w-full overflow-hidden rounded-full bg-muted", className),
        ...props,
        children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          "div",
          {
            className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-out",
            style: { width: `${percent}%` }
          }
        )
      }
    );
  }

  // src/components/ui/segmented.tsx
  init_define_import_meta_env();
  var import_jsx_runtime13 = __toESM(require_react_shim(), 1);
  function Segmented({
    label,
    value,
    options,
    onChange,
    className
  }) {
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      "div",
      {
        role: "radiogroup",
        "aria-label": label,
        className: cn("flex gap-1 rounded-lg bg-muted p-1", className),
        children: options.map((option) => {
          const selected = option.value === value;
          return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "button",
            {
              type: "button",
              role: "radio",
              "aria-checked": selected,
              onClick: () => onChange(option.value),
              className: cn(
                "min-h-touch flex-1 rounded-md px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              ),
              children: option.label
            },
            option.value
          );
        })
      }
    );
  }

  // src/components/ui/toggle-row.tsx
  init_define_import_meta_env();
  var import_jsx_runtime14 = __toESM(require_react_shim(), 1);
  function ToggleRow({ label, checked, onChange, description, className }) {
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
      "label",
      {
        className: cn(
          "flex min-h-touch cursor-pointer items-center justify-between gap-4 py-2",
          className
        ),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: "flex flex-col", children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "text-sm font-medium", children: label }),
            description ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "text-xs text-muted-foreground", children: description }) : null
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            "input",
            {
              type: "checkbox",
              className: "peer sr-only",
              checked,
              onChange: (event) => onChange(event.target.checked)
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            "span",
            {
              "aria-hidden": true,
              className: "relative h-6 w-11 shrink-0 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-checked:[&>span]:translate-x-5",
              children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform" })
            }
          )
        ]
      }
    );
  }
  return __toCommonJS(bundle_entry_exports);
})();
/*! Bundled license information:

use-sync-external-store/cjs/use-sync-external-store-shim.development.js:
  (**
   * @license React
   * use-sync-external-store-shim.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js:
  (**
   * @license React
   * use-sync-external-store-shim/with-selector.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

@remix-run/router/dist/router.js:
  (**
   * @remix-run/router v1.23.4
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

react-router/dist/index.js:
  (**
   * React Router v6.30.6
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

react-router-dom/dist/index.js:
  (**
   * React Router DOM v6.30.6
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

lucide-react/dist/esm/shared/src/utils.js:
lucide-react/dist/esm/defaultAttributes.js:
lucide-react/dist/esm/Icon.js:
lucide-react/dist/esm/createLucideIcon.js:
lucide-react/dist/esm/icons/check.js:
lucide-react/dist/esm/icons/circle-plus.js:
lucide-react/dist/esm/icons/dumbbell.js:
lucide-react/dist/esm/icons/house.js:
lucide-react/dist/esm/icons/plus.js:
lucide-react/dist/esm/icons/salad.js:
lucide-react/dist/esm/icons/scale.js:
lucide-react/dist/esm/icons/settings.js:
lucide-react/dist/esm/icons/trending-up.js:
lucide-react/dist/esm/lucide-react.js:
  (**
   * @license lucide-react v0.446.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
window.RecompOS=RecompOS.__dsMainNs?Object.assign({},RecompOS,RecompOS.__dsMainNs,{__dsMainNs:undefined}):RecompOS;
