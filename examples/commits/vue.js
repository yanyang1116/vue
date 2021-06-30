/* eslint-disable */
/*!
 * Vue.js v2.0.0
 * (c) 2014-2016 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : (global.Vue = factory());
})(this, function () {
  "use strict";

  /*  */

  /**
   * Convert a value to a string that is actually rendered.
   */
  function _toString(val) {
    return val == null
      ? ""
      : typeof val === "object"
      ? JSON.stringify(val, null, 2)
      : String(val);
  }

  /**
   * Convert a input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber(val) {
    var n = parseFloat(val, 10);
    return n || n === 0 ? n : val;
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   * 这个函数是用闭包打缓存的一个很好的例子
   * 它和 cache 的运行逻辑不一样，所以不能混用，但是最终的实现原理是一样的
   * 值得学习
   */
  function makeMap(str, expectsLowerCase) {
    var map = Object.create(null);
    var list = str.split(",");
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? function (val) {
          return map[val.toLowerCase()];
        }
      : function (val) {
          return map[val];
        };
  }

  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap("slot,component", true);

  /**
   * Remove an item from an array
   */
  function remove$1(arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1);
      }
    }
  }

  /**
   * Check whether the object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }

  /**
   * Check if value is primitive
   */
  function isPrimitive(value) {
    return typeof value === "string" || typeof value === "number";
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached(fn) {
    /**
     * 这是啥？缓存一个方法并返回？
     * 返回后的方法，接受 key 命中之前的缓存结果，否则执行并缓存执行结果
     * 比如，decodeHTMLCached 的 html 节点操作中被用到 (innerHTML)，减少 DOM 操作
     * 这个方法应该是很实用的，处理唯一 key 映射的情况
     */
    var cache = Object.create(null); // 只储存
    return function cachedFn(str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  }

  /**
   * Camelize a hyphen-delmited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) {
      return c ? c.toUpperCase() : "";
    });
  });

  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /([^-])([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str
      .replace(hyphenateRE, "$1-$2")
      .replace(hyphenateRE, "$1-$2")
      .toLowerCase();
  });

  /**
   * Simple bind, faster than native
   */
  function bind$1(fn, ctx) {
    function boundFn(a) {
      var l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx);
    }
    // record original fn length
    boundFn._length = fn.length;
    return boundFn;
  }

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret;
  }

  /**
   * Mix properties into target object.
   * 就是 assgin
   */
  function extend(to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to;
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject(obj) {
    return obj !== null && typeof obj === "object";
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  var toString = Object.prototype.toString;
  var OBJECT_STRING = "[object Object]";
  function isPlainObject(obj) {
    return toString.call(obj) === OBJECT_STRING;
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject(arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res;
  }

  /**
   * Perform no operation.
   */
  function noop() {}

  /**
   * Always return false.
   */
  var no = function () {
    return false;
  };

  /**
   * Generate a static keys string from compiler modules.
   */
  function genStaticKeys(modules) {
    return modules
      .reduce(function (keys, m) {
        return keys.concat(m.staticKeys || []);
      }, [])
      .join(",");
  }

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual(a, b) {
    /* eslint-disable eqeqeq */
    return (
      a == b ||
      (isObject(a) && isObject(b)
        ? JSON.stringify(a) === JSON.stringify(b)
        : false)
    );
    /* eslint-enable eqeqeq */
  }

  function looseIndexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) {
        return i;
      }
    }
    return -1;
  }

  /*  */

  var config = {
    /**
     * Option merge strategies (used in core/util/options)
     */
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Whether to enable devtools
     */
    devtools: "development" !== "production",

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: null,

    /**
     * Custom user key aliases for v-on
     */
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * List of asset types that a component can own.
     */
    _assetTypes: ["component", "directive", "filter"],

    /**
     * List of lifecycle hooks.
     */
    _lifecycleHooks: [
      "beforeCreate",
      "created",
      "beforeMount",
      "mounted",
      "beforeUpdate",
      "updated",
      "beforeDestroy",
      "destroyed",
      "activated",
      "deactivated",
    ],

    /**
     * Max circular updates allowed in a scheduler flush cycle.
     */
    _maxUpdateCount: 100,

    /**
     * Server rendering?
     */
    _isServer: "client" === "server",
  };

  /*  */

  /**
   * Check if a string starts with $ or _
   */
  function isReserved(str) {
    var c = (str + "").charCodeAt(0);
    return c === 0x24 || c === 0x5f;
  }

  /**
   * Define a property.
   */
  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true,
    });
  }

  /**
   * Parse simple path.
   */
  var bailRE = /[^\w\.\$]/;
  function parsePath(path) {
    if (bailRE.test(path)) {
      return;
    } else {
      var segments = path.split(".");
      return function (obj) {
        for (var i = 0; i < segments.length; i++) {
          if (!obj) {
            return;
          }
          obj = obj[segments[i]];
        }
        return obj;
      };
    }
  }

  /*  */
  /* globals MutationObserver */

  // can we use __proto__?
  var hasProto = "__proto__" in {};

  // Browser environment sniffing
  var inBrowser =
    typeof window !== "undefined" &&
    Object.prototype.toString.call(window) !== "[object Object]";

  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf("msie 9.0") > 0;
  var isEdge = UA && UA.indexOf("edge/") > 0;
  var isAndroid = UA && UA.indexOf("android") > 0;
  var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative(Ctor) {
    return /native code/.test(Ctor.toString());
  }

  /**
   * Defer a task to execute it asynchronously.
   */
  var nextTick = (function () {
    var callbacks = [];
    var pending = false;
    var timerFunc;

    function nextTickHandler() {
      pending = false;
      var copies = callbacks.slice(0);
      callbacks.length = 0;
      for (var i = 0; i < copies.length; i++) {
        copies[i]();
      }
    }

    // the nextTick behavior leverages the microtask queue, which can be accessed
    // via either native Promise.then or MutationObserver.
    // MutationObserver has wider support, however it is seriously bugged in
    // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
    // completely stops working after triggering a few times... so, if native
    // Promise is available, we will use it:
    /* istanbul ignore if */
    // 在支持 Promise 的原生情况下
    if (typeof Promise !== "undefined" && isNative(Promise)) {
      var p = Promise.resolve();
      timerFunc = function () {
        p.then(nextTickHandler);
        // in problematic UIWebViews, Promise.then doesn't completely break, but
        // it can get stuck in a weird state where callbacks are pushed into the
        // microtask queue but the queue isn't being flushed, until the browser
        // needs to do some other work, e.g. handle a timer. Therefore we can
        // "force" the microtask queue to be flushed by adding an empty timer.
        if (isIOS) {
          setTimeout(noop);
        }
      };
    } else if (
      typeof MutationObserver !== "undefined" &&
      (isNative(MutationObserver) ||
        // PhantomJS and iOS 7.x
        MutationObserver.toString() === "[object MutationObserverConstructor]")
    ) {
      // use MutationObserver where native Promise is not available,
      // e.g. PhantomJS IE11, iOS7, Android 4.4
      var counter = 1;
      var observer = new MutationObserver(nextTickHandler);
      var textNode = document.createTextNode(String(counter));
      observer.observe(textNode, {
        characterData: true,
      });
      timerFunc = function () {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
      };
    } else {
      // fallback to setTimeout
      /* istanbul ignore next */
      timerFunc = setTimeout;
    }

    return function queueNextTick(cb, ctx) {
      var func = ctx
        ? function () {
            cb.call(ctx);
          }
        : cb;
      callbacks.push(func);
      if (!pending) {
        pending = true;
        timerFunc(nextTickHandler, 0);
      }
    };
  })();

  var _Set;
  /* istanbul ignore if */
  if (typeof Set !== "undefined" && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = (function () {
      function Set() {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has(key) {
        return this.set[key] !== undefined;
      };
      Set.prototype.add = function add(key) {
        this.set[key] = 1;
      };
      Set.prototype.clear = function clear() {
        this.set = Object.create(null);
      };

      return Set;
    })();
  }

  /* not type checking this file because flow doesn't play well with Proxy */

  var hasProxy;
  var proxyHandlers;
  var initProxy;

  {
    var allowedGlobals = makeMap(
      "Infinity,undefined,NaN,isFinite,isNaN," +
        "parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent," +
        "Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl," +
        "require" // for Webpack/Browserify
    );

    hasProxy =
      typeof Proxy !== "undefined" && Proxy.toString().match(/native code/);

    proxyHandlers = {
      has: function has(target, key) {
        var has = key in target;
        var isAllowed = allowedGlobals(key) || key.charAt(0) === "_";
        if (!has && !isAllowed) {
          warn(
            'Property or method "' +
              key +
              '" is not defined on the instance but ' +
              "referenced during render. Make sure to declare reactive data " +
              "properties in the data option.",
            target
          );
        }
        return has || !isAllowed;
      },
    };

    initProxy = function initProxy(vm) {
      if (hasProxy) {
        vm._renderProxy = new Proxy(vm, proxyHandlers);
      } else {
        vm._renderProxy = vm;
      }
    };
  }

  /*  */

  var uid$2 = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep() {
    this.id = uid$2++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub(sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub(sub) {
    remove$1(this.subs, sub);
  };

  Dep.prototype.depend = function depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify() {
    // stablize the subscriber list first
    var subs = this.subs.slice();
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // the current target watcher being evaluated.
  // this is globally unique because there could be only one
  // watcher being evaluated at any time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget(_target) {
    if (Dep.target) {
      targetStack.push(Dep.target);
    }
    Dep.target = _target;
  }

  function popTarget() {
    Dep.target = targetStack.pop();
  }

  /*  */

  var queue = [];
  var has$1 = {};
  var circular = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState() {
    queue.length = 0;
    has$1 = {};
    {
      circular = {};
    }
    waiting = flushing = false;
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue() {
    flushing = true;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) {
      return a.id - b.id;
    });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      var watcher = queue[index];
      var id = watcher.id;
      has$1[id] = null;
      watcher.run();
      // in dev build, check and stop circular updates.
      if ("development" !== "production" && has$1[id] != null) {
        circular[id] = (circular[id] || 0) + 1;
        if (circular[id] > config._maxUpdateCount) {
          warn(
            "You may have an infinite update loop " +
              (watcher.user
                ? 'in watcher with expression "' + watcher.expression + '"'
                : "in a component render function."),
            watcher.vm
          );
          break;
        }
      }
    }

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit("flush");
    }

    resetSchedulerState();
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher(watcher) {
    var id = watcher.id;
    if (has$1[id] == null) {
      has$1[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i >= 0 && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(Math.max(i, index) + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */

  var uid$1 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher(vm, expOrFn, cb, options) {
    if (options === void 0) options = {};

    this.vm = vm;
    vm._watchers.push(this);
    // options
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.expression = expOrFn.toString();
    this.cb = cb;
    this.id = ++uid$1; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    // parse expression for getter
    if (typeof expOrFn === "function") {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = function () {};
        "development" !== "production" &&
          warn(
            'Failed watching path: "' +
              expOrFn +
              '" ' +
              "Watcher only accepts simple dot-delimited paths. " +
              "For full control, use a function instead.",
            vm
          );
      }
    }
    this.value = this.lazy ? undefined : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get() {
    pushTarget(this);
    var value = this.getter.call(this.vm, this.vm);
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
    return value;
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep(dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps() {
    var this$1 = this;

    var i = this.deps.length;
    while (i--) {
      var dep = this$1.deps[i];
      if (!this$1.newDepIds.has(dep.id)) {
        dep.removeSub(this$1);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update() {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run() {
    if (this.active) {
      var value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            "development" !== "production" &&
              warn('Error in watcher "' + this.expression + '"', this.vm);
            /* istanbul ignore else */
            if (config.errorHandler) {
              config.errorHandler.call(null, e, this.vm);
            } else {
              throw e;
            }
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate() {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend() {
    var this$1 = this;

    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subcriber list.
   */
  Watcher.prototype.teardown = function teardown() {
    var this$1 = this;

    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed or is performing a v-for
      // re-render (the watcher list is then filtered by v-for).
      if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
        remove$1(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this$1.deps[i].removeSub(this$1);
      }
      this.active = false;
    }
  };

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  var seenObjects = new _Set();
  function traverse(val, seen) {
    var i, keys;
    if (!seen) {
      seen = seenObjects;
      seen.clear();
    }
    var isA = Array.isArray(val);
    var isO = isObject(val);
    if ((isA || isO) && Object.isExtensible(val)) {
      if (val.__ob__) {
        var depId = val.__ob__.dep.id;
        if (seen.has(depId)) {
          return;
        } else {
          seen.add(depId);
        }
      }
      if (isA) {
        i = val.length;
        while (i--) {
          traverse(val[i], seen);
        }
      } else if (isO) {
        keys = Object.keys(val);
        i = keys.length;
        while (i--) {
          traverse(val[keys[i]], seen);
        }
      }
    }
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);
  ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(
    function (method) {
      // cache original method
      var original = arrayProto[method];
      def(arrayMethods, method, function mutator() {
        var arguments$1 = arguments;

        // avoid leaking arguments:
        // http://jsperf.com/closure-with-arguments
        var i = arguments.length;
        var args = new Array(i);
        while (i--) {
          args[i] = arguments$1[i];
        }
        var result = original.apply(this, args);
        var ob = this.__ob__;
        var inserted;
        switch (method) {
          case "push":
            inserted = args;
            break;
          case "unshift":
            inserted = args;
            break;
          case "splice":
            inserted = args.slice(2);
            break;
        }
        if (inserted) {
          ob.observeArray(inserted);
        }
        // notify change
        ob.dep.notify();
        return result;
      });
    }
  );

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * By default, when a reactive property is set, the new value is
   * also converted to become reactive. However when passing down props,
   * we don't want to force conversion because the value may be a nested value
   * under a frozen data structure. Converting it would defeat the optimization.
   */
  var observerState = {
    shouldConvert: true,
    isSettingProps: false,
  };

  /**
   * Observer class that are attached to each observed
   * object. Once attached, the observer converts target
   * object's property keys into getter/setters that
   * collect dependencies and dispatches updates.
   */
  var Observer = function Observer(value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      var augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk(obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i], obj[keys[i]]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray(items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment an target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment(target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment an target Object or Array by defining
   * hidden properties.
   *
   * istanbul ignore next
   */
  function copyAugment(target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe(value) {
    if (!isObject(value)) {
      return;
    }
    var ob;
    if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      observerState.shouldConvert &&
      !config._isServer &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    return ob;
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1(obj, key, val, customSetter) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return;
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;

    var childOb = observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
          }
          if (Array.isArray(value)) {
            for (var e = void 0, i = 0, l = value.length; i < l; i++) {
              e = value[i];
              e && e.__ob__ && e.__ob__.dep.depend();
            }
          }
        }
        return value;
      },
      set: function reactiveSetter(newVal) {
        var value = getter ? getter.call(obj) : val;
        if (newVal === value) {
          return;
        }
        if ("development" !== "production" && customSetter) {
          customSetter();
        }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = observe(newVal);
        dep.notify();
      },
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set(obj, key, val) {
    if (Array.isArray(obj)) {
      obj.splice(key, 1, val);
      return val;
    }
    if (hasOwn(obj, key)) {
      obj[key] = val;
      return;
    }
    var ob = obj.__ob__;
    if (obj._isVue || (ob && ob.vmCount)) {
      "development" !== "production" &&
        warn(
          "Avoid adding reactive properties to a Vue instance or its root $data " +
            "at runtime - declare it upfront in the data option."
        );
      return;
    }
    if (!ob) {
      obj[key] = val;
      return;
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val;
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del(obj, key) {
    var ob = obj.__ob__;
    if (obj._isVue || (ob && ob.vmCount)) {
      "development" !== "production" &&
        warn(
          "Avoid deleting properties on a Vue instance or its root $data " +
            "- just set it to null."
        );
      return;
    }
    if (!hasOwn(obj, key)) {
      return;
    }
    delete obj[key];
    if (!ob) {
      return;
    }
    ob.dep.notify();
  }

  /*  */

  function initState(vm) {
    vm._watchers = [];
    initProps(vm);
    initData(vm);
    initComputed(vm);
    initMethods(vm);
    initWatch(vm);
  }

  function initProps(vm) {
    var props = vm.$options.props;
    if (props) {
      var propsData = vm.$options.propsData || {};
      var keys = (vm.$options._propKeys = Object.keys(props));
      var isRoot = !vm.$parent;
      // root instance props should be converted
      observerState.shouldConvert = isRoot;
      var loop = function (i) {
        var key = keys[i];
        /* istanbul ignore else */
        {
          defineReactive$$1(
            vm,
            key,
            validateProp(key, props, propsData, vm),
            function () {
              if (vm.$parent && !observerState.isSettingProps) {
                warn(
                  "Avoid mutating a prop directly since the value will be " +
                    "overwritten whenever the parent component re-renders. " +
                    "Instead, use a data or computed property based on the prop's " +
                    'value. Prop being mutated: "' +
                    key +
                    '"',
                  vm
                );
              }
            }
          );
        }
      };

      for (var i = 0; i < keys.length; i++) loop(i);
      observerState.shouldConvert = true;
    }
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === "function" ? data.call(vm) : data || {};
    if (!isPlainObject(data)) {
      data = {};
      "development" !== "production" &&
        warn("data functions should return an object.", vm);
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var i = keys.length;
    while (i--) {
      if (props && hasOwn(props, keys[i])) {
        "development" !== "production" &&
          warn(
            'The data property "' +
              keys[i] +
              '" is already declared as a prop. ' +
              "Use prop default value instead.",
            vm
          );
      } else {
        proxy(vm, keys[i]);
      }
    }
    // observe data
    observe(data);
    data.__ob__ && data.__ob__.vmCount++;
  }

  var computedSharedDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop,
  };

  function initComputed(vm) {
    var computed = vm.$options.computed;
    if (computed) {
      for (var key in computed) {
        var userDef = computed[key];
        if (typeof userDef === "function") {
          computedSharedDefinition.get = makeComputedGetter(userDef, vm);
          computedSharedDefinition.set = noop;
        } else {
          computedSharedDefinition.get = userDef.get
            ? userDef.cache !== false
              ? makeComputedGetter(userDef.get, vm)
              : bind$1(userDef.get, vm)
            : noop;
          computedSharedDefinition.set = userDef.set
            ? bind$1(userDef.set, vm)
            : noop;
        }
        Object.defineProperty(vm, key, computedSharedDefinition);
      }
    }
  }

  function makeComputedGetter(getter, owner) {
    var watcher = new Watcher(owner, getter, noop, {
      lazy: true,
    });
    return function computedGetter() {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    };
  }

  function initMethods(vm) {
    var methods = vm.$options.methods;
    if (methods) {
      for (var key in methods) {
        if (methods[key] != null) {
          vm[key] = bind$1(methods[key], vm);
        } else {
          warn('Method "' + key + '" is undefined in options.', vm);
        }
      }
    }
  }

  function initWatch(vm) {
    var watch = vm.$options.watch;
    if (watch) {
      for (var key in watch) {
        var handler = watch[key];
        if (Array.isArray(handler)) {
          for (var i = 0; i < handler.length; i++) {
            createWatcher(vm, key, handler[i]);
          }
        } else {
          createWatcher(vm, key, handler);
        }
      }
    }
  }

  function createWatcher(vm, key, handler) {
    var options;
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === "string") {
      handler = vm[handler];
    }
    vm.$watch(key, handler, options);
  }

  function stateMixin(Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () {
      return this._data;
    };
    {
      dataDef.set = function (newData) {
        warn(
          "Avoid replacing instance root $data. " +
            "Use nested data properties instead.",
          this
        );
      };
    }
    Object.defineProperty(Vue.prototype, "$data", dataDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (expOrFn, cb, options) {
      var vm = this;
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        cb.call(vm, watcher.value);
      }
      return function unwatchFn() {
        watcher.teardown();
      };
    };
  }

  function proxy(vm, key) {
    if (!isReserved(key)) {
      Object.defineProperty(vm, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter() {
          return vm._data[key];
        },
        set: function proxySetter(val) {
          vm._data[key] = val;
        },
      });
    }
  }

  /*  */

  var VNode = function VNode(
    tag,
    data,
    children,
    text,
    elm,
    ns,
    context,
    componentOptions
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = ns;
    this.context = context;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.child = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
  };

  var emptyVNode = function () {
    var node = new VNode();
    node.text = "";
    node.isComment = true;
    return node;
  };

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode(vnode) {
    var cloned = new VNode(
      vnode.tag,
      vnode.data,
      vnode.children,
      vnode.text,
      vnode.elm,
      vnode.ns,
      vnode.context,
      vnode.componentOptions
    );
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isCloned = true;
    return cloned;
  }

  function cloneVNodes(vnodes) {
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneVNode(vnodes[i]);
    }
    return res;
  }

  /*  */

  function normalizeChildren(children, ns, nestedIndex) {
    if (isPrimitive(children)) {
      return [createTextVNode(children)];
    }
    if (Array.isArray(children)) {
      var res = [];
      for (var i = 0, l = children.length; i < l; i++) {
        var c = children[i];
        var last = res[res.length - 1];
        //  nested
        if (Array.isArray(c)) {
          res.push.apply(res, normalizeChildren(c, ns, i));
        } else if (isPrimitive(c)) {
          if (last && last.text) {
            last.text += String(c);
          } else if (c !== "") {
            // convert primitive to vnode
            res.push(createTextVNode(c));
          }
        } else if (c instanceof VNode) {
          if (c.text && last && last.text) {
            last.text += c.text;
          } else {
            // inherit parent namespace
            if (ns) {
              applyNS(c, ns);
            }
            // default key for nested array children (likely generated by v-for)
            if (c.tag && c.key == null && nestedIndex != null) {
              c.key = "__vlist_" + nestedIndex + "_" + i + "__";
            }
            res.push(c);
          }
        }
      }
      return res;
    }
  }

  function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val));
  }

  function applyNS(vnode, ns) {
    if (vnode.tag && !vnode.ns) {
      vnode.ns = ns;
      if (vnode.children) {
        for (var i = 0, l = vnode.children.length; i < l; i++) {
          applyNS(vnode.children[i], ns);
        }
      }
    }
  }

  function getFirstComponentChild(children) {
    return (
      children &&
      children.filter(function (c) {
        return c && c.componentOptions;
      })[0]
    );
  }

  function mergeVNodeHook(def$$1, key, hook) {
    var oldHook = def$$1[key];
    if (oldHook) {
      var injectedHash = def$$1.__injected || (def$$1.__injected = {});
      if (!injectedHash[key]) {
        injectedHash[key] = true;
        def$$1[key] = function () {
          oldHook.apply(this, arguments);
          hook.apply(this, arguments);
        };
      }
    } else {
      def$$1[key] = hook;
    }
  }

  function updateListeners(on, oldOn, add, remove$$1) {
    var name, cur, old, fn, event, capture;
    for (name in on) {
      cur = on[name];
      old = oldOn[name];
      if (!cur) {
        "development" !== "production" &&
          warn('Handler for event "' + name + '" is undefined.');
      } else if (!old) {
        capture = name.charAt(0) === "!";
        event = capture ? name.slice(1) : name;
        if (Array.isArray(cur)) {
          add(event, (cur.invoker = arrInvoker(cur)), capture);
        } else {
          if (!cur.invoker) {
            fn = cur;
            cur = on[name] = {};
            cur.fn = fn;
            cur.invoker = fnInvoker(cur);
          }
          add(event, cur.invoker, capture);
        }
      } else if (cur !== old) {
        if (Array.isArray(old)) {
          old.length = cur.length;
          for (var i = 0; i < old.length; i++) {
            old[i] = cur[i];
          }
          on[name] = old;
        } else {
          old.fn = cur;
          on[name] = old;
        }
      }
    }
    for (name in oldOn) {
      if (!on[name]) {
        event = name.charAt(0) === "!" ? name.slice(1) : name;
        remove$$1(event, oldOn[name].invoker);
      }
    }
  }

  function arrInvoker(arr) {
    return function (ev) {
      var arguments$1 = arguments;

      var single = arguments.length === 1;
      for (var i = 0; i < arr.length; i++) {
        single ? arr[i](ev) : arr[i].apply(null, arguments$1);
      }
    };
  }

  function fnInvoker(o) {
    return function (ev) {
      var single = arguments.length === 1;
      single ? o.fn(ev) : o.fn.apply(null, arguments);
    };
  }

  /*  */

  var activeInstance = null;

  function initLifecycle(vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._mount = function (el, hydrating) {
      var vm = this;
      vm.$el = el;
      if (!vm.$options.render) {
        vm.$options.render = emptyVNode;
        {
          /* istanbul ignore if */
          if (vm.$options.template) {
            warn(
              "You are using the runtime-only build of Vue where the template " +
                "option is not available. Either pre-compile the templates into " +
                "render functions, or use the compiler-included build.",
              vm
            );
          } else {
            warn(
              "Failed to mount component: template or render function not defined.",
              vm
            );
          }
        }
      }
      callHook(vm, "beforeMount");
      vm._watcher = new Watcher(
        vm,
        function () {
          vm._update(vm._render(), hydrating);
        },
        noop
      );
      hydrating = false;
      // root instance, call mounted on self
      // mounted is called for child components in its inserted hook
      if (vm.$root === vm) {
        vm._isMounted = true;
        callHook(vm, "mounted");
      }
      return vm;
    };

    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      if (vm._isMounted) {
        callHook(vm, "beforeUpdate");
      }
      var prevEl = vm.$el;
      var prevActiveInstance = activeInstance;
      activeInstance = vm;
      var prevVnode = vm._vnode;
      vm._vnode = vnode;
      if (!prevVnode) {
        // Vue.prototype.__patch__ is injected in entry points
        // based on the rendering backend used.
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating);
      } else {
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      activeInstance = prevActiveInstance;
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      if (vm._isMounted) {
        callHook(vm, "updated");
      }
    };

    Vue.prototype._updateFromParent = function (
      propsData,
      listeners,
      parentVnode,
      renderChildren
    ) {
      var vm = this;
      var hasChildren = !!(vm.$options._renderChildren || renderChildren);
      vm.$options._parentVnode = parentVnode;
      vm.$options._renderChildren = renderChildren;
      // update props
      if (propsData && vm.$options.props) {
        observerState.shouldConvert = false;
        {
          observerState.isSettingProps = true;
        }
        var propKeys = vm.$options._propKeys || [];
        for (var i = 0; i < propKeys.length; i++) {
          var key = propKeys[i];
          vm[key] = validateProp(key, vm.$options.props, propsData, vm);
        }
        observerState.shouldConvert = true;
        {
          observerState.isSettingProps = false;
        }
      }
      // update listeners
      if (listeners) {
        var oldListeners = vm.$options._parentListeners;
        vm.$options._parentListeners = listeners;
        vm._updateListeners(listeners, oldListeners);
      }
      // resolve slots + force update if has children
      if (hasChildren) {
        vm.$slots = resolveSlots(renderChildren, vm._renderContext);
        vm.$forceUpdate();
      }
    };

    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      var vm = this;
      if (vm._isBeingDestroyed) {
        return;
      }
      callHook(vm, "beforeDestroy");
      vm._isBeingDestroyed = true;
      // remove self from parent
      var parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove$1(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      var i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      callHook(vm, "destroyed");
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
    };
  }

  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        handlers[i].call(vm);
      }
    }
    vm.$emit("hook:" + hook);
  }

  /*  */

  var hooks = {
    init: init,
    prepatch: prepatch,
    insert: insert,
    destroy: destroy$1,
  };
  var hooksToMerge = Object.keys(hooks);

  function createComponent(Ctor, data, context, children, tag) {
    if (!Ctor) {
      return;
    }

    if (isObject(Ctor)) {
      Ctor = Vue$3.extend(Ctor);
    }

    if (typeof Ctor !== "function") {
      {
        warn("Invalid Component definition: " + String(Ctor), context);
      }
      return;
    }

    // async component
    if (!Ctor.cid) {
      if (Ctor.resolved) {
        Ctor = Ctor.resolved;
      } else {
        Ctor = resolveAsyncComponent(Ctor, function () {
          // it's ok to queue this on every render because
          // $forceUpdate is buffered by the scheduler.
          context.$forceUpdate();
        });
        if (!Ctor) {
          // return nothing if this is indeed an async component
          // wait for the callback to trigger parent update.
          return;
        }
      }
    }

    data = data || {};

    // extract props
    var propsData = extractProps(data, Ctor);

    // functional component
    if (Ctor.options.functional) {
      return createFunctionalComponent(
        Ctor,
        propsData,
        data,
        context,
        children
      );
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    data.on = data.nativeOn;

    if (Ctor.options.abstract) {
      // abstract components do not keep anything
      // other than props & listeners
      data = {};
    }

    // merge component management hooks onto the placeholder node
    mergeHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      "vue-component-" + Ctor.cid + (name ? "-" + name : ""),
      data,
      undefined,
      undefined,
      undefined,
      undefined,
      context,
      {
        Ctor: Ctor,
        propsData: propsData,
        listeners: listeners,
        tag: tag,
        children: children,
      }
    );
    return vnode;
  }

  function createFunctionalComponent(Ctor, propsData, data, context, children) {
    var props = {};
    var propOptions = Ctor.options.props;
    if (propOptions) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData);
      }
    }
    return Ctor.options.render.call(
      null,
      // ensure the createElement function in functional components
      // gets a unique context - this is necessary for correct named slot check
      bind$1(createElement, { _self: Object.create(context) }),
      {
        props: props,
        data: data,
        parent: context,
        children: normalizeChildren(children),
        slots: function () {
          return resolveSlots(children, context);
        },
      }
    );
  }

  function createComponentInstanceForVnode(
    vnode, // we know it's MountedComponentVNode but flow doesn't
    parent // activeInstance in lifecycle state
  ) {
    var vnodeComponentOptions = vnode.componentOptions;
    var options = {
      _isComponent: true,
      parent: parent,
      propsData: vnodeComponentOptions.propsData,
      _componentTag: vnodeComponentOptions.tag,
      _parentVnode: vnode,
      _parentListeners: vnodeComponentOptions.listeners,
      _renderChildren: vnodeComponentOptions.children,
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (inlineTemplate) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnodeComponentOptions.Ctor(options);
  }

  // 似乎不会执行，全文都没有
  function init(vnode, hydrating) {
    if (!vnode.child || vnode.child._isDestroyed) {
      var child = (vnode.child = createComponentInstanceForVnode(
        vnode,
        activeInstance
      ));
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  }

  function prepatch(oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = (vnode.child = oldVnode.child);
    child._updateFromParent(
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  }

  function insert(vnode) {
    if (!vnode.child._isMounted) {
      vnode.child._isMounted = true;
      callHook(vnode.child, "mounted");
    }
    if (vnode.data.keepAlive) {
      vnode.child._inactive = false;
      callHook(vnode.child, "activated");
    }
  }

  function destroy$1(vnode) {
    if (!vnode.child._isDestroyed) {
      if (!vnode.data.keepAlive) {
        vnode.child.$destroy();
      } else {
        vnode.child._inactive = true;
        callHook(vnode.child, "deactivated");
      }
    }
  }

  function resolveAsyncComponent(factory, cb) {
    if (factory.requested) {
      // pool callbacks
      factory.pendingCallbacks.push(cb);
    } else {
      factory.requested = true;
      var cbs = (factory.pendingCallbacks = [cb]);
      var sync = true;

      var resolve = function (res) {
        if (isObject(res)) {
          res = Vue$3.extend(res);
        }
        // cache resolved
        factory.resolved = res;
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          for (var i = 0, l = cbs.length; i < l; i++) {
            cbs[i](res);
          }
        }
      };

      var reject = function (reason) {
        "development" !== "production" &&
          warn(
            "Failed to resolve async component: " +
              String(factory) +
              (reason ? "\nReason: " + reason : "")
          );
      };

      var res = factory(resolve, reject);

      // handle promise
      if (res && typeof res.then === "function" && !factory.resolved) {
        res.then(resolve, reject);
      }

      sync = false;
      // return in case resolved synchronously
      return factory.resolved;
    }
  }

  function extractProps(data, Ctor) {
    // we are only extrating raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (!propOptions) {
      return;
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    var domProps = data.domProps;
    if (attrs || props || domProps) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey) ||
          checkProp(res, domProps, key, altKey);
      }
    }
    return res;
  }

  function checkProp(res, hash, key, altKey, preserve) {
    if (hash) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true;
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true;
      }
    }
    return false;
  }

  function mergeHooks(data) {
    if (!data.hook) {
      data.hook = {};
    }
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      var fromParent = data.hook[key];
      var ours = hooks[key];
      data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
    }
  }

  function mergeHook$1(a, b) {
    // since all hooks have at most two args, use fixed args
    // to avoid having to use fn.apply().
    return function (_, __) {
      a(_, __);
      b(_, __);
    };
  }

  /*  */

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement(tag, data, children) {
    if (data && (Array.isArray(data) || typeof data !== "object")) {
      children = data;
      data = undefined;
    }
    // make sure to use real instance instead of proxy as context
    return _createElement(this._self, tag, data, children);
  }

  function _createElement(context, tag, data, children) {
    if (data && data.__ob__) {
      "development" !== "production" &&
        warn(
          "Avoid using observed data object as vnode data: " +
            JSON.stringify(data) +
            "\n" +
            "Always create fresh vnode data objects in each render!",
          context
        );
      return;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return emptyVNode();
    }
    if (typeof tag === "string") {
      var Ctor;
      var ns = config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        return new VNode(
          tag,
          data,
          normalizeChildren(children, ns),
          undefined,
          undefined,
          ns,
          context
        );
      } else if ((Ctor = resolveAsset(context.$options, "components", tag))) {
        // component
        return createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        return new VNode(
          tag,
          data,
          normalizeChildren(children, ns),
          undefined,
          undefined,
          ns,
          context
        );
      }
    } else {
      // direct component options / constructor
      return createComponent(tag, data, context, children);
    }
  }

  /*  */

  function initRender(vm) {
    vm.$vnode = null; // the placeholder node in parent tree
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null;
    vm._renderContext =
      vm.$options._parentVnode && vm.$options._parentVnode.context;
    vm.$slots = resolveSlots(vm.$options._renderChildren, vm._renderContext);
    // bind the public createElement fn to this instance
    // so that we get proper render context inside it.
    vm.$createElement = bind$1(createElement, vm);
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }

  function renderMixin(Vue) {
    Vue.prototype.$nextTick = function (fn) {
      nextTick(fn, this);
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      var _parentVnode = ref._parentVnode;

      if (vm._isMounted) {
        // clone slot nodes on re-renders
        for (var key in vm.$slots) {
          vm.$slots[key] = cloneVNodes(vm.$slots[key]);
        }
      }

      if (staticRenderFns && !vm._staticTrees) {
        vm._staticTrees = [];
      }
      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        {
          warn("Error when rendering " + formatComponentName(vm) + ":");
        }
        /* istanbul ignore else */
        if (config.errorHandler) {
          config.errorHandler.call(null, e, vm);
        } else {
          if (config._isServer) {
            throw e;
          } else {
            setTimeout(function () {
              throw e;
            }, 0);
          }
        }
        // return previous vnode to prevent render error causing blank component
        vnode = vm._vnode;
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        if ("development" !== "production" && Array.isArray(vnode)) {
          warn(
            "Multiple root nodes returned from render function. Render function " +
              "should return a single root node.",
            vm
          );
        }
        vnode = emptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode;
    };

    // shorthands used in render functions
    Vue.prototype._h = createElement;
    // toString for mustaches
    Vue.prototype._s = _toString;
    // number conversion
    Vue.prototype._n = toNumber;
    // empty vnode
    Vue.prototype._e = emptyVNode;
    // loose equal
    Vue.prototype._q = looseEqual;
    // loose indexOf
    Vue.prototype._i = looseIndexOf;

    // render static tree by index
    Vue.prototype._m = function renderStatic(index, isInFor) {
      var tree = this._staticTrees[index];
      // if has already-rendered static tree and not inside v-for,
      // we can reuse the same tree by doing a shallow clone.
      if (tree && !isInFor) {
        return Array.isArray(tree) ? cloneVNodes(tree) : cloneVNode(tree);
      }
      // otherwise, render a fresh tree.
      tree = this._staticTrees[index] = this.$options.staticRenderFns[
        index
      ].call(this._renderProxy);
      if (Array.isArray(tree)) {
        for (var i = 0; i < tree.length; i++) {
          tree[i].isStatic = true;
          tree[i].key = "__static__" + index + "_" + i;
        }
      } else {
        tree.isStatic = true;
        tree.key = "__static__" + index;
      }
      return tree;
    };

    // filter resolution helper
    var identity = function (_) {
      return _;
    };
    Vue.prototype._f = function resolveFilter(id) {
      return resolveAsset(this.$options, "filters", id, true) || identity;
    };

    // render v-for
    Vue.prototype._l = function renderList(val, render) {
      var ret, i, l, keys, key;
      if (Array.isArray(val)) {
        ret = new Array(val.length);
        for (i = 0, l = val.length; i < l; i++) {
          ret[i] = render(val[i], i);
        }
      } else if (typeof val === "number") {
        ret = new Array(val);
        for (i = 0; i < val; i++) {
          ret[i] = render(i + 1, i);
        }
      } else if (isObject(val)) {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
      return ret;
    };

    // renderSlot
    Vue.prototype._t = function (name, fallback) {
      var slotNodes = this.$slots[name];
      // warn duplicate slot usage
      if (slotNodes && "development" !== "production") {
        slotNodes._rendered &&
          warn(
            'Duplicate presence of slot "' +
              name +
              '" found in the same render tree ' +
              "- this will likely cause render errors.",
            this
          );
        slotNodes._rendered = true;
      }
      return slotNodes || fallback;
    };

    // apply v-bind object
    Vue.prototype._b = function bindProps(data, value, asProp) {
      if (value) {
        if (!isObject(value)) {
          "development" !== "production" &&
            warn(
              "v-bind without argument expects an Object or Array value",
              this
            );
        } else {
          if (Array.isArray(value)) {
            value = toObject(value);
          }
          for (var key in value) {
            if (key === "class" || key === "style") {
              data[key] = value[key];
            } else {
              var hash =
                asProp || config.mustUseProp(key)
                  ? data.domProps || (data.domProps = {})
                  : data.attrs || (data.attrs = {});
              hash[key] = value[key];
            }
          }
        }
      }
      return data;
    };

    // expose v-on keyCodes
    Vue.prototype._k = function getKeyCodes(key) {
      return config.keyCodes[key];
    };
  }

  function resolveSlots(renderChildren, context) {
    var slots = {};
    if (!renderChildren) {
      return slots;
    }
    var children = normalizeChildren(renderChildren) || [];
    var defaultSlot = [];
    var name, child;
    for (var i = 0, l = children.length; i < l; i++) {
      child = children[i];
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if (child.context === context && child.data && (name = child.data.slot)) {
        var slot = slots[name] || (slots[name] = []);
        if (child.tag === "template") {
          slot.push.apply(slot, child.children);
        } else {
          slot.push(child);
        }
      } else {
        defaultSlot.push(child);
      }
    }
    // ignore single whitespace
    if (
      defaultSlot.length &&
      !(
        defaultSlot.length === 1 &&
        (defaultSlot[0].text === " " || defaultSlot[0].isComment)
      )
    ) {
      slots.default = defaultSlot;
    }
    return slots;
  }

  /*  */

  function initEvents(vm) {
    vm._events = Object.create(null);
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    var on = bind$1(vm.$on, vm);
    var off = bind$1(vm.$off, vm);
    vm._updateListeners = function (listeners, oldListeners) {
      updateListeners(listeners, oldListeners || {}, on, off);
    };
    if (listeners) {
      vm._updateListeners(listeners);
    }
  }

  function eventsMixin(Vue) {
    Vue.prototype.$on = function (event, fn) {
      var vm = this;
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      return vm;
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on() {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm;
    };

    Vue.prototype.$off = function (event, fn) {
      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm;
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm;
      }
      if (arguments.length === 1) {
        vm._events[event] = null;
        return vm;
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break;
        }
      }
      return vm;
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i].apply(vm, args);
        }
      }
      return vm;
    };
  }

  /*  */

  var uid = 0;

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid++;
      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm),
          options || {},
          vm
        );
      }
      /* istanbul ignore else */
      {
        initProxy(vm);
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      callHook(vm, "beforeCreate");
      initState(vm);
      callHook(vm, "created");
      initRender(vm);
    };

    function initInternalComponent(vm, options) {
      var opts = (vm.$options = Object.create(resolveConstructorOptions(vm)));
      // doing this because it's faster than dynamic enumeration.
      opts.parent = options.parent;
      opts.propsData = options.propsData;
      opts._parentVnode = options._parentVnode;
      opts._parentListeners = options._parentListeners;
      opts._renderChildren = options._renderChildren;
      opts._componentTag = options._componentTag;
      if (options.render) {
        opts.render = options.render;
        opts.staticRenderFns = options.staticRenderFns;
      }
    }

    function resolveConstructorOptions(vm) {
      var Ctor = vm.constructor;
      var options = Ctor.options;
      if (Ctor.super) {
        var superOptions = Ctor.super.options;
        var cachedSuperOptions = Ctor.superOptions;
        if (superOptions !== cachedSuperOptions) {
          // super option changed
          Ctor.superOptions = superOptions;
          options = Ctor.options = mergeOptions(
            superOptions,
            Ctor.extendOptions
          );
          if (options.name) {
            options.components[options.name] = Ctor;
          }
        }
      }
      return options;
    }
  }

  function Vue$3(options) {
    if ("development" !== "production" && !(this instanceof Vue$3)) {
      warn("Vue is a constructor and should be called with the `new` keyword");
    }
    this._init(options);
  }

  initMixin(Vue$3);
  stateMixin(Vue$3);
  eventsMixin(Vue$3);
  lifecycleMixin(Vue$3);
  renderMixin(Vue$3);

  var warn = noop;
  var formatComponentName;

  {
    var hasConsole = typeof console !== "undefined";

    warn = function (msg, vm) {
      if (hasConsole && !config.silent) {
        console.error(
          "[Vue warn]: " +
            msg +
            " " +
            (vm ? formatLocation(formatComponentName(vm)) : "")
        );
      }
    };

    formatComponentName = function (vm) {
      if (vm.$root === vm) {
        return "root instance";
      }
      var name = vm._isVue
        ? vm.$options.name || vm.$options._componentTag
        : vm.name;
      return name ? "component <" + name + ">" : "anonymous component";
    };

    var formatLocation = function (str) {
      if (str === "anonymous component") {
        str += ' - use the "name" option for better debugging messages.';
      }
      return "(found in " + str + ")";
    };
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;

  /**
   * Options with restrictions
   */
  {
    strats.el = strats.propsData = function (parent, child, vm, key) {
      if (!vm) {
        warn(
          'option "' +
            key +
            '" can only be used during instance ' +
            "creation with the `new` keyword."
        );
      }
      return defaultStrat(parent, child);
    };

    strats.name = function (parent, child, vm) {
      if (vm && child) {
        warn(
          'options "name" can only be used as a component definition option, ' +
            "not during instance creation."
        );
      }
      return defaultStrat(parent, child);
    };
  }

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData(to, from) {
    var key, toVal, fromVal;
    for (key in from) {
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (isObject(toVal) && isObject(fromVal)) {
        mergeData(toVal, fromVal);
      }
    }
    return to;
  }

  /**
   * Data
   */
  strats.data = function (parentVal, childVal, vm) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal;
      }
      if (typeof childVal !== "function") {
        "development" !== "production" &&
          warn(
            'The "data" option should be a function ' +
              "that returns a per-instance value in component " +
              "definitions.",
            vm
          );
        return parentVal;
      }
      if (!parentVal) {
        return childVal;
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn() {
        return mergeData(childVal.call(this), parentVal.call(this));
      };
    } else if (parentVal || childVal) {
      return function mergedInstanceDataFn() {
        // instance merge
        var instanceData =
          typeof childVal === "function" ? childVal.call(vm) : childVal;
        var defaultData =
          typeof parentVal === "function" ? parentVal.call(vm) : undefined;
        if (instanceData) {
          return mergeData(instanceData, defaultData);
        } else {
          return defaultData;
        }
      };
    }
  };

  /**
   * Hooks and param attributes are merged as arrays.
   */
  function mergeHook(parentVal, childVal) {
    return childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
        ? childVal
        : [childVal]
      : parentVal;
  }

  config._lifecycleHooks.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal || null);
    return childVal ? extend(res, childVal) : res;
  }

  config._assetTypes.forEach(function (type) {
    strats[type + "s"] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (parentVal, childVal) {
    /* istanbul ignore if */
    if (!childVal) {
      return parentVal;
    }
    if (!parentVal) {
      return childVal;
    }
    var ret = {};
    extend(ret, parentVal);
    for (var key in childVal) {
      var parent = ret[key];
      var child = childVal[key];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key] = parent ? parent.concat(child) : [child];
    }
    return ret;
  };

  /**
   * Other object hashes.
   */
  strats.props =
    strats.methods =
    strats.computed =
      function (parentVal, childVal) {
        if (!childVal) {
          return parentVal;
        }
        if (!parentVal) {
          return childVal;
        }
        var ret = Object.create(null);
        extend(ret, parentVal);
        extend(ret, childVal);
        return ret;
      };

  /**
   * Default strategy.
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
  };

  /**
   * Make sure component options get converted to actual
   * constructors.
   */
  function normalizeComponents(options) {
    if (options.components) {
      var components = options.components;
      var def;
      for (var key in components) {
        var lower = key.toLowerCase();
        if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
          "development" !== "production" &&
            warn(
              "Do not use built-in or reserved HTML elements as component " +
                "id: " +
                key
            );
          continue;
        }
        def = components[key];
        if (isPlainObject(def)) {
          components[key] = Vue$3.extend(def);
        }
      }
    }
  }

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps(options) {
    var props = options.props;
    if (!props) {
      return;
    }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === "string") {
          name = camelize(val);
          res[name] = { type: null };
        } else {
          warn("props must be strings when using array syntax.");
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val) ? val : { type: val };
      }
    }
    options.props = res;
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives(options) {
    var dirs = options.directives;
    if (dirs) {
      for (var key in dirs) {
        var def = dirs[key];
        if (typeof def === "function") {
          dirs[key] = { bind: def, update: def };
        }
      }
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions(parent, child, vm) {
    normalizeComponents(child);
    normalizeProps(child);
    normalizeDirectives(child);
    var extendsFrom = child.extends;
    if (extendsFrom) {
      parent =
        typeof extendsFrom === "function"
          ? mergeOptions(parent, extendsFrom.options, vm)
          : mergeOptions(parent, extendsFrom, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        var mixin = child.mixins[i];
        if (mixin.prototype instanceof Vue$3) {
          mixin = mixin.options;
        }
        parent = mergeOptions(parent, mixin, vm);
      }
    }
    var options = {};
    var key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField(key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options;
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset(options, type, id, warnMissing) {
    /* istanbul ignore if */
    if (typeof id !== "string") {
      return;
    }
    var assets = options[type];
    var res =
      assets[id] ||
      // camelCase ID
      assets[camelize(id)] ||
      // Pascal Case ID
      assets[capitalize(camelize(id))];
    if ("development" !== "production" && warnMissing && !res) {
      warn("Failed to resolve " + type.slice(0, -1) + ": " + id, options);
    }
    return res;
  }

  /*  */

  function validateProp(key, propOptions, propsData, vm) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // handle boolean props
    if (getType(prop.type) === "Boolean") {
      if (absent && !hasOwn(prop, "default")) {
        value = false;
      } else if (value === "" || value === hyphenate(key)) {
        value = true;
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldConvert = observerState.shouldConvert;
      observerState.shouldConvert = true;
      observe(value);
      observerState.shouldConvert = prevShouldConvert;
    }
    {
      assertProp(prop, key, value, vm, absent);
    }
    return value;
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue(vm, prop, name) {
    // no default, return undefined
    if (!hasOwn(prop, "default")) {
      return undefined;
    }
    var def = prop.default;
    // warn against non-factory defaults for Object & Array
    if (isObject(def)) {
      "development" !== "production" &&
        warn(
          'Invalid default value for prop "' +
            name +
            '": ' +
            "Props with type Object/Array must use a factory function " +
            "to return the default value.",
          vm
        );
    }
    // call factory function for non-Function types
    return typeof def === "function" && prop.type !== Function
      ? def.call(vm)
      : def;
  }

  /**
   * Assert whether a prop is valid.
   */
  function assertProp(prop, name, value, vm, absent) {
    if (prop.required && absent) {
      warn('Missing required prop: "' + name + '"', vm);
      return;
    }
    if (value == null && !prop.required) {
      return;
    }
    var type = prop.type;
    var valid = !type || type === true;
    var expectedTypes = [];
    if (type) {
      if (!Array.isArray(type)) {
        type = [type];
      }
      for (var i = 0; i < type.length && !valid; i++) {
        var assertedType = assertType(value, type[i]);
        expectedTypes.push(assertedType.expectedType);
        valid = assertedType.valid;
      }
    }
    if (!valid) {
      warn(
        'Invalid prop: type check failed for prop "' +
          name +
          '".' +
          " Expected " +
          expectedTypes.map(capitalize).join(", ") +
          ", got " +
          Object.prototype.toString.call(value).slice(8, -1) +
          ".",
        vm
      );
      return;
    }
    var validator = prop.validator;
    if (validator) {
      if (!validator(value)) {
        warn(
          'Invalid prop: custom validator check failed for prop "' +
            name +
            '".',
          vm
        );
      }
    }
  }

  /**
   * Assert the type of a value
   */
  function assertType(value, type) {
    var valid;
    var expectedType = getType(type);
    if (expectedType === "String") {
      valid = typeof value === (expectedType = "string");
    } else if (expectedType === "Number") {
      valid = typeof value === (expectedType = "number");
    } else if (expectedType === "Boolean") {
      valid = typeof value === (expectedType = "boolean");
    } else if (expectedType === "Function") {
      valid = typeof value === (expectedType = "function");
    } else if (expectedType === "Object") {
      valid = isPlainObject(value);
    } else if (expectedType === "Array") {
      valid = Array.isArray(value);
    } else {
      valid = value instanceof type;
    }
    return {
      valid: valid,
      expectedType: expectedType,
    };
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType(fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match && match[1];
  }

  var util = Object.freeze({
    defineReactive: defineReactive$$1,
    _toString: _toString,
    toNumber: toNumber,
    makeMap: makeMap,
    isBuiltInTag: isBuiltInTag,
    remove: remove$1,
    hasOwn: hasOwn,
    isPrimitive: isPrimitive,
    cached: cached,
    camelize: camelize,
    capitalize: capitalize,
    hyphenate: hyphenate,
    bind: bind$1,
    toArray: toArray,
    extend: extend,
    isObject: isObject,
    isPlainObject: isPlainObject,
    toObject: toObject,
    noop: noop,
    no: no,
    genStaticKeys: genStaticKeys,
    looseEqual: looseEqual,
    looseIndexOf: looseIndexOf,
    isReserved: isReserved,
    def: def,
    parsePath: parsePath,
    hasProto: hasProto,
    inBrowser: inBrowser,
    UA: UA,
    isIE: isIE,
    isIE9: isIE9,
    isEdge: isEdge,
    isAndroid: isAndroid,
    isIOS: isIOS,
    devtools: devtools,
    nextTick: nextTick,
    get _Set() {
      return _Set;
    },
    mergeOptions: mergeOptions,
    resolveAsset: resolveAsset,
    get warn() {
      return warn;
    },
    get formatComponentName() {
      return formatComponentName;
    },
    validateProp: validateProp,
  });

  /*  */

  function initUse(Vue) {
    Vue.use = function (plugin) {
      /* istanbul ignore if */
      if (plugin.installed) {
        return;
      }
      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === "function") {
        plugin.install.apply(plugin, args);
      } else {
        plugin.apply(null, args);
      }
      plugin.installed = true;
      return this;
    };
  }

  /*  */

  function initMixin$1(Vue) {
    Vue.mixin = function (mixin) {
      Vue.options = mergeOptions(Vue.options, mixin);
    };
  }

  /*  */

  function initExtend(Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var isFirstExtend = Super.cid === 0;
      if (isFirstExtend && extendOptions._Ctor) {
        return extendOptions._Ctor;
      }
      var name = extendOptions.name || Super.options.name;
      {
        if (!/^[a-zA-Z][\w-]*$/.test(name)) {
          warn(
            'Invalid component name: "' +
              name +
              '". Component names ' +
              "can only contain alphanumeric characaters and the hyphen."
          );
          name = null;
        }
      }
      var Sub = function VueComponent(options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(Super.options, extendOptions);
      Sub["super"] = Super;
      // allow further extension
      Sub.extend = Super.extend;
      // create asset registers, so extended classes
      // can have their private assets too.
      config._assetTypes.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }
      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      // cache constructor
      if (isFirstExtend) {
        extendOptions._Ctor = Sub;
      }
      return Sub;
    };
  }

  /*  */

  function initAssetRegisters(Vue) {
    /**
     * Create asset registration methods.
     */
    config._assetTypes.forEach(function (type) {
      Vue[type] = function (id, definition) {
        if (!definition) {
          return this.options[type + "s"][id];
        } else {
          /* istanbul ignore if */
          {
            if (type === "component" && config.isReservedTag(id)) {
              warn(
                "Do not use built-in or reserved HTML elements as component " +
                  "id: " +
                  id
              );
            }
          }
          if (type === "component" && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = Vue.extend(definition);
          }
          if (type === "directive" && typeof definition === "function") {
            definition = { bind: definition, update: definition };
          }
          this.options[type + "s"][id] = definition;
          return definition;
        }
      };
    });
  }

  var KeepAlive = {
    name: "keep-alive",
    abstract: true,
    created: function created() {
      this.cache = Object.create(null);
    },
    render: function render() {
      var vnode = getFirstComponentChild(this.$slots.default);
      if (vnode && vnode.componentOptions) {
        var opts = vnode.componentOptions;
        var key =
          vnode.key == null
            ? // same constructor may get registered as different local components
              // so cid alone is not enough (#3269)
              opts.Ctor.cid + "::" + opts.tag
            : vnode.key;
        if (this.cache[key]) {
          vnode.child = this.cache[key].child;
        } else {
          this.cache[key] = vnode;
        }
        vnode.data.keepAlive = true;
      }
      return vnode;
    },
    destroyed: function destroyed() {
      var this$1 = this;

      for (var key in this.cache) {
        var vnode = this$1.cache[key];
        callHook(vnode.child, "deactivated");
        vnode.child.$destroy();
      }
    },
  };

  var builtInComponents = {
    KeepAlive: KeepAlive,
  };

  /*  */

  function initGlobalAPI(Vue) {
    // config
    var configDef = {};
    configDef.get = function () {
      return config;
    };
    {
      configDef.set = function () {
        warn(
          "Do not replace the Vue.config object, set individual fields instead."
        );
      };
    }
    Object.defineProperty(Vue, "config", configDef);
    Vue.util = util;
    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    Vue.options = Object.create(null);
    config._assetTypes.forEach(function (type) {
      Vue.options[type + "s"] = Object.create(null);
    });

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue$3);

  Object.defineProperty(Vue$3.prototype, "$isServer", {
    get: function () {
      return config._isServer;
    },
  });

  Vue$3.version = "2.0.0";

  /*  */

  // attributes that should be using props for binding
  var mustUseProp = makeMap("value,selected,checked,muted");

  var isEnumeratedAttr = makeMap("contenteditable,draggable,spellcheck");

  var isBooleanAttr = makeMap(
    "allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare," +
      "default,defaultchecked,defaultmuted,defaultselected,defer,disabled," +
      "enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple," +
      "muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly," +
      "required,reversed,scoped,seamless,selected,sortable,translate," +
      "truespeed,typemustmatch,visible"
  );

  var isAttr = makeMap(
    "accept,accept-charset,accesskey,action,align,alt,async,autocomplete," +
      "autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset," +
      "checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv," +
      "name,contenteditable,contextmenu,controls,coords,data,datetime,default," +
      "defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for," +
      "form,formaction,headers,<th>,height,hidden,high,href,hreflang,http-equiv," +
      "icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low," +
      "manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file," +
      "muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster," +
      "preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox," +
      "scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span," +
      "spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex," +
      "target,title,type,usemap,value,width,wrap"
  );

  var xlinkNS = "http://www.w3.org/1999/xlink";

  var isXlink = function (name) {
    return name.charAt(5) === ":" && name.slice(0, 5) === "xlink";
  };

  var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : "";
  };

  var isFalsyAttrValue = function (val) {
    return val == null || val === false;
  };

  /*  */

  function genClassForVnode(vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (childNode.child) {
      childNode = childNode.child._vnode;
      if (childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while ((parentNode = parentNode.parent)) {
      if (parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return genClassFromData(data);
  }

  function mergeClassData(child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: child.class ? [child.class, parent.class] : parent.class,
    };
  }

  function genClassFromData(data) {
    var dynamicClass = data.class;
    var staticClass = data.staticClass;
    if (staticClass || dynamicClass) {
      return concat(staticClass, stringifyClass(dynamicClass));
    }
    /* istanbul ignore next */
    return "";
  }

  function concat(a, b) {
    return a ? (b ? a + " " + b : a) : b || "";
  }

  function stringifyClass(value) {
    var res = "";
    if (!value) {
      return res;
    }
    if (typeof value === "string") {
      return value;
    }
    if (Array.isArray(value)) {
      var stringified;
      for (var i = 0, l = value.length; i < l; i++) {
        if (value[i]) {
          if ((stringified = stringifyClass(value[i]))) {
            res += stringified + " ";
          }
        }
      }
      return res.slice(0, -1);
    }
    if (isObject(value)) {
      for (var key in value) {
        if (value[key]) {
          res += key + " ";
        }
      }
      return res.slice(0, -1);
    }
    /* istanbul ignore next */
    return res;
  }

  /*  */

  var namespaceMap = {
    svg: "http://www.w3.org/2000/svg",
    math: "http://www.w3.org/1998/Math/MathML",
  };

  var isHTMLTag = makeMap(
    "html,body,base,head,link,meta,style,title," +
      "address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section," +
      "div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul," +
      "a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby," +
      "s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video," +
      "embed,object,param,source,canvas,script,noscript,del,ins," +
      "caption,col,colgroup,table,thead,tbody,td,th,tr," +
      "button,datalist,fieldset,form,input,label,legend,meter,optgroup,option," +
      "output,progress,select,textarea," +
      "details,dialog,menu,menuitem,summary," +
      "content,element,shadow,template"
  );

  // 这写标签应该是，对照内写了内容，都没卵用的标签
  var isUnaryTag = makeMap(
    "area,base,br,col,embed,frame,hr,img,input,isindex,keygen," +
      "link,meta,param,source,track,wbr",
    true
  );

  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  // 这些标签说的是，可以故意不关闭某些标签，它也能正常显示
  // https://www.tempertemper.net/blog/optional-closing-tags-in-html
  // https://meiert.com/en/blog/optional-html/
  //   <ul>
  //     <li>Red
  //     <li>Green
  //     <li>Blue
  //   </ul>
  // 但是我在 mac 上不能调试，mac 上的浏览器总会最大程度的补全
  var canBeLeftOpenTag = makeMap(
    "colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source",
    true
  );

  // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
  // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
  // https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Content_categories
  // 说的是一些语义化标签，这些标签被 p 标签包裹的时候标签会脱离 p 标签
  var isNonPhrasingTag = makeMap(
    "address,article,aside,base,blockquote,body,caption,col,colgroup,dd," +
      "details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form," +
      "h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta," +
      "optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead," +
      "title,tr,track",
    true
  );

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap(
    "svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font," +
      "font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern," +
      "polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",
    true
  );

  var isPreTag = function (tag) {
    return tag === "pre";
  };

  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag);
  };

  function getTagNamespace(tag) {
    if (isSVG(tag)) {
      return "svg";
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === "math") {
      return "math";
    }
  }

  var unknownElementCache = Object.create(null);
  function isUnknownElement(tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true;
    }
    if (isReservedTag(tag)) {
      return false;
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag];
    }
    var el = document.createElement(tag);
    if (tag.indexOf("-") > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return (unknownElementCache[tag] =
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement);
    } else {
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(
        el.toString()
      ));
    }
  }

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query(el) {
    if (typeof el === "string") {
      var selector = el;
      el = document.querySelector(el);
      if (!el) {
        "development" !== "production" &&
          warn("Cannot find element: " + selector);
        return document.createElement("div");
      }
    }
    return el;
  }

  /*  */

  function createElement$1(tagName) {
    return document.createElement(tagName);
  }

  function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName);
  }

  function createTextNode(text) {
    return document.createTextNode(text);
  }

  function createComment(text) {
    return document.createComment(text);
  }

  function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild(node, child) {
    node.removeChild(child);
  }

  function appendChild(node, child) {
    node.appendChild(child);
  }

  function parentNode(node) {
    return node.parentNode;
  }

  function nextSibling(node) {
    return node.nextSibling;
  }

  function tagName(node) {
    return node.tagName;
  }

  function setTextContent(node, text) {
    node.textContent = text;
  }

  function childNodes(node) {
    return node.childNodes;
  }

  function setAttribute(node, key, val) {
    node.setAttribute(key, val);
  }

  var nodeOps = Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    childNodes: childNodes,
    setAttribute: setAttribute,
  });

  /*  */

  var ref = {
    create: function create(_, vnode) {
      registerRef(vnode);
    },
    update: function update(oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy(vnode) {
      registerRef(vnode, true);
    },
  };

  function registerRef(vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!key) {
      return;
    }

    var vm = vnode.context;
    var ref = vnode.child || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove$1(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (Array.isArray(refs[key])) {
          refs[key].push(ref);
        } else {
          refs[key] = [ref];
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

  var emptyData = {};
  var emptyNode = new VNode("", emptyData, []);
  var hooks$1 = ["create", "update", "postpatch", "remove", "destroy"];

  function isUndef(s) {
    return s == null;
  }

  function isDef(s) {
    return s != null;
  }

  function sameVnode(vnode1, vnode2) {
    return (
      vnode1.key === vnode2.key &&
      vnode1.tag === vnode2.tag &&
      vnode1.isComment === vnode2.isComment &&
      !vnode1.data === !vnode2.data
    );
  }

  function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) {
        map[key] = i;
      }
    }
    return map;
  }

  function createPatchFunction(backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks$1.length; ++i) {
      cbs[hooks$1[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (modules[j][hooks$1[i]] !== undefined) {
          cbs[hooks$1[i]].push(modules[j][hooks$1[i]]);
        }
      }
    }

    function emptyNodeAt(elm) {
      return new VNode(
        nodeOps.tagName(elm).toLowerCase(),
        {},
        [],
        undefined,
        elm
      );
    }

    function createRmCb(childElm, listeners) {
      function remove$$1() {
        if (--remove$$1.listeners === 0) {
          removeElement(childElm);
        }
      }
      remove$$1.listeners = listeners;
      return remove$$1;
    }

    function removeElement(el) {
      var parent = nodeOps.parentNode(el);
      nodeOps.removeChild(parent, el);
    }

    function createElm(vnode, insertedVnodeQueue, nested) {
      var i;
      var data = vnode.data;
      vnode.isRootInsert = !nested;
      if (isDef(data)) {
        if (isDef((i = data.hook)) && isDef((i = i.init))) {
          i(vnode);
        }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef((i = vnode.child))) {
          initComponent(vnode, insertedVnodeQueue);
          return vnode.elm;
        }
      }
      var children = vnode.children;
      var tag = vnode.tag;
      if (isDef(tag)) {
        {
          if (
            !vnode.ns &&
            !(
              config.ignoredElements && config.ignoredElements.indexOf(tag) > -1
            ) &&
            config.isUnknownElement(tag)
          ) {
            warn(
              "Unknown custom element: <" +
                tag +
                "> - did you " +
                "register the component correctly? For recursive components, " +
                'make sure to provide the "name" option.',
              vnode.context
            );
          }
        }
        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag);
        setScope(vnode);
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
      } else if (vnode.isComment) {
        vnode.elm = nodeOps.createComment(vnode.text);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
      }
      return vnode.elm;
    }

    function createChildren(vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; ++i) {
          nodeOps.appendChild(
            vnode.elm,
            createElm(children[i], insertedVnodeQueue, true)
          );
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
      }
    }

    function isPatchable(vnode) {
      while (vnode.child) {
        vnode = vnode.child._vnode;
      }
      return isDef(vnode.tag);
    }

    function invokeCreateHooks(vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (i.create) {
          i.create(emptyNode, vnode);
        }
        if (i.insert) {
          insertedVnodeQueue.push(vnode);
        }
      }
    }

    function initComponent(vnode, insertedVnodeQueue) {
      if (vnode.data.pendingInsert) {
        insertedVnodeQueue.push.apply(
          insertedVnodeQueue,
          vnode.data.pendingInsert
        );
      }
      vnode.elm = vnode.child.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope(vnode) {
      var i;
      if (isDef((i = vnode.context)) && isDef((i = i.$options._scopeId))) {
        nodeOps.setAttribute(vnode.elm, i, "");
      }
      if (
        isDef((i = activeInstance)) &&
        i !== vnode.context &&
        isDef((i = i.$options._scopeId))
      ) {
        nodeOps.setAttribute(vnode.elm, i, "");
      }
    }

    function addVnodes(
      parentElm,
      before,
      vnodes,
      startIdx,
      endIdx,
      insertedVnodeQueue
    ) {
      for (; startIdx <= endIdx; ++startIdx) {
        nodeOps.insertBefore(
          parentElm,
          createElm(vnodes[startIdx], insertedVnodeQueue),
          before
        );
      }
    }

    function invokeDestroyHook(vnode) {
      var i, j;
      var data = vnode.data;
      if (isDef(data)) {
        if (isDef((i = data.hook)) && isDef((i = i.destroy))) {
          i(vnode);
        }
        for (i = 0; i < cbs.destroy.length; ++i) {
          cbs.destroy[i](vnode);
        }
      }
      if (isDef((i = vnode.child)) && !data.keepAlive) {
        invokeDestroyHook(i._vnode);
      }
      if (isDef((i = vnode.children))) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else {
            // Text node
            nodeOps.removeChild(parentElm, ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook(vnode, rm) {
      if (rm || isDef(vnode.data)) {
        var listeners = cbs.remove.length + 1;
        if (!rm) {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        } else {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        }
        // recursively invoke hooks on child component root node
        if (
          isDef((i = vnode.child)) &&
          isDef((i = i._vnode)) &&
          isDef(i.data)
        ) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef((i = vnode.data.hook)) && isDef((i = i.remove))) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeElement(vnode.elm);
      }
    }

    function updateChildren(
      parentElm,
      oldCh,
      newCh,
      insertedVnodeQueue,
      removeOnly
    ) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, elmToMove, before;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
          // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
          canMove &&
            nodeOps.insertBefore(
              parentElm,
              oldStartVnode.elm,
              nodeOps.nextSibling(oldEndVnode.elm)
            );
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
          // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
          canMove &&
            nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) {
            oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
          }
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : null;
          if (isUndef(idxInOld)) {
            // New element
            nodeOps.insertBefore(
              parentElm,
              createElm(newStartVnode, insertedVnodeQueue),
              oldStartVnode.elm
            );
            newStartVnode = newCh[++newStartIdx];
          } else {
            elmToMove = oldCh[idxInOld];
            /* istanbul ignore if */
            if ("development" !== "production" && !elmToMove) {
              warn(
                "It seems there are duplicate keys that is causing an update error. " +
                  "Make sure each v-for item has a unique key."
              );
            }
            if (elmToMove.tag !== newStartVnode.tag) {
              // same key but different element. treat as new element
              nodeOps.insertBefore(
                parentElm,
                createElm(newStartVnode, insertedVnodeQueue),
                oldStartVnode.elm
              );
              newStartVnode = newCh[++newStartIdx];
            } else {
              patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
              oldCh[idxInOld] = undefined;
              canMove &&
                nodeOps.insertBefore(
                  parentElm,
                  newStartVnode.elm,
                  oldStartVnode.elm
                );
              newStartVnode = newCh[++newStartIdx];
            }
          }
        }
      }
      if (oldStartIdx > oldEndIdx) {
        before = isUndef(newCh[newEndIdx + 1])
          ? null
          : newCh[newEndIdx + 1].elm;
        addVnodes(
          parentElm,
          before,
          newCh,
          newStartIdx,
          newEndIdx,
          insertedVnodeQueue
        );
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
      if (oldVnode === vnode) {
        return;
      }
      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (
        vnode.isStatic &&
        oldVnode.isStatic &&
        vnode.key === oldVnode.key &&
        vnode.isCloned
      ) {
        vnode.elm = oldVnode.elm;
        return;
      }
      var i, hook;
      var hasData = isDef((i = vnode.data));
      if (hasData && isDef((hook = i.hook)) && isDef((i = hook.prepatch))) {
        i(oldVnode, vnode);
      }
      var elm = (vnode.elm = oldVnode.elm);
      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (hasData && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) {
          cbs.update[i](oldVnode, vnode);
        }
        if (isDef(hook) && isDef((i = hook.update))) {
          i(oldVnode, vnode);
        }
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) {
            updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
          }
        } else if (isDef(ch)) {
          if (isDef(oldVnode.text)) {
            nodeOps.setTextContent(elm, "");
          }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, "");
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (hasData) {
        for (i = 0; i < cbs.postpatch.length; ++i) {
          cbs.postpatch[i](oldVnode, vnode);
        }
        if (isDef(hook) && isDef((i = hook.postpatch))) {
          i(oldVnode, vnode);
        }
      }
    }

    function invokeInsertHook(vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (initial && vnode.parent) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }

    var bailed = false;
    function hydrate(elm, vnode, insertedVnodeQueue) {
      {
        if (!assertNodeMatch(elm, vnode)) {
          return false;
        }
      }
      vnode.elm = elm;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      if (isDef(data)) {
        if (isDef((i = data.hook)) && isDef((i = i.init))) {
          i(vnode, true /* hydrating */);
        }
        if (isDef((i = vnode.child))) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true;
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          var childNodes = nodeOps.childNodes(elm);
          // empty element, allow client to pick up and populate children
          if (!childNodes.length) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            var childrenMatch = true;
            if (childNodes.length !== children.length) {
              childrenMatch = false;
            } else {
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (
                  !hydrate(childNodes[i$1], children[i$1], insertedVnodeQueue)
                ) {
                  childrenMatch = false;
                  break;
                }
              }
            }
            if (!childrenMatch) {
              if (
                "development" !== "production" &&
                typeof console !== "undefined" &&
                !bailed
              ) {
                bailed = true;
                console.warn("Parent: ", elm);
                console.warn(
                  "Mismatching childNodes vs. VNodes: ",
                  childNodes,
                  children
                );
              }
              return false;
            }
          }
        }
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
      }
      return true;
    }

    function assertNodeMatch(node, vnode) {
      if (vnode.tag) {
        return (
          vnode.tag.indexOf("vue-component") === 0 ||
          vnode.tag === nodeOps.tagName(node).toLowerCase()
        );
      } else {
        return _toString(vnode.text) === node.data;
      }
    }

    return function patch(oldVnode, vnode, hydrating, removeOnly) {
      var elm, parent;
      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (!oldVnode) {
        // empty mount, create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue);
      } else {
        var isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (
              oldVnode.nodeType === 1 &&
              oldVnode.hasAttribute("server-rendered")
            ) {
              oldVnode.removeAttribute("server-rendered");
              hydrating = true;
            }
            if (hydrating) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode;
              } else {
                warn(
                  "The client-side rendered virtual DOM tree is not matching " +
                    "server-rendered content. This is likely caused by incorrect " +
                    "HTML markup, for example nesting block-level elements inside " +
                    "<p>, or missing <tbody>. Bailing hydration and performing " +
                    "full client-side render."
                );
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }
          elm = oldVnode.elm;
          parent = nodeOps.parentNode(elm);

          createElm(vnode, insertedVnodeQueue);

          // component root element replaced.
          // update parent placeholder node element.
          if (vnode.parent) {
            vnode.parent.elm = vnode.elm;
            if (isPatchable(vnode)) {
              for (var i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, vnode.parent);
              }
            }
          }

          if (parent !== null) {
            nodeOps.insertBefore(parent, vnode.elm, nodeOps.nextSibling(elm));
            removeVnodes(parent, [oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm;
    };
  }

  /*  */

  var directives = {
    create: function bindDirectives(oldVnode, vnode) {
      var hasInsert = false;
      forEachDirective(oldVnode, vnode, function (def, dir) {
        callHook$1(def, dir, "bind", vnode, oldVnode);
        if (def.inserted) {
          hasInsert = true;
        }
      });
      if (hasInsert) {
        mergeVNodeHook(
          vnode.data.hook || (vnode.data.hook = {}),
          "insert",
          function () {
            applyDirectives(oldVnode, vnode, "inserted");
          }
        );
      }
    },
    update: function updateDirectives(oldVnode, vnode) {
      applyDirectives(oldVnode, vnode, "update");
      // if old vnode has directives but new vnode doesn't
      // we need to teardown the directives on the old one.
      if (oldVnode.data.directives && !vnode.data.directives) {
        applyDirectives(oldVnode, oldVnode, "unbind");
      }
    },
    postpatch: function postupdateDirectives(oldVnode, vnode) {
      applyDirectives(oldVnode, vnode, "componentUpdated");
    },
    destroy: function unbindDirectives(vnode) {
      applyDirectives(vnode, vnode, "unbind");
    },
  };

  var emptyModifiers = Object.create(null);

  function forEachDirective(oldVnode, vnode, fn) {
    var dirs = vnode.data.directives;
    if (dirs) {
      for (var i = 0; i < dirs.length; i++) {
        var dir = dirs[i];
        var def = resolveAsset(
          vnode.context.$options,
          "directives",
          dir.name,
          true
        );
        if (def) {
          var oldDirs = oldVnode && oldVnode.data.directives;
          if (oldDirs) {
            dir.oldValue = oldDirs[i].value;
          }
          if (!dir.modifiers) {
            dir.modifiers = emptyModifiers;
          }
          fn(def, dir);
        }
      }
    }
  }

  function applyDirectives(oldVnode, vnode, hook) {
    forEachDirective(oldVnode, vnode, function (def, dir) {
      callHook$1(def, dir, hook, vnode, oldVnode);
    });
  }

  function callHook$1(def, dir, hook, vnode, oldVnode) {
    var fn = def && def[hook];
    if (fn) {
      fn(vnode.elm, dir, vnode, oldVnode);
    }
  }

  var baseModules = [ref, directives];

  /*  */

  function updateAttrs(oldVnode, vnode) {
    if (!oldVnode.data.attrs && !vnode.data.attrs) {
      return;
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (attrs.__ob__) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    for (key in oldAttrs) {
      if (attrs[key] == null) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr(el, key, value) {
    if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, key);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(
        key,
        isFalsyAttrValue(value) || value === "false" ? "false" : "true"
      );
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs,
  };

  /*  */

  function updateClass(oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (
      !data.staticClass &&
      !data.class &&
      (!oldData || (!oldData.staticClass && !oldData.class))
    ) {
      return;
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (transitionClass) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute("class", cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass,
  };

  // skip type checking this file because we need to attach private properties
  // to elements

  function updateDOMListeners(oldVnode, vnode) {
    if (!oldVnode.data.on && !vnode.data.on) {
      return;
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    var add =
      vnode.elm._v_add ||
      (vnode.elm._v_add = function (event, handler, capture) {
        vnode.elm.addEventListener(event, handler, capture);
      });
    var remove =
      vnode.elm._v_remove ||
      (vnode.elm._v_remove = function (event, handler) {
        vnode.elm.removeEventListener(event, handler);
      });
    updateListeners(on, oldOn, add, remove);
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners,
  };

  /*  */

  function updateDOMProps(oldVnode, vnode) {
    if (!oldVnode.data.domProps && !vnode.data.domProps) {
      return;
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (props.__ob__) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (props[key] == null) {
        elm[key] = undefined;
      }
    }
    for (key in props) {
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if ((key === "textContent" || key === "innerHTML") && vnode.children) {
        vnode.children.length = 0;
      }
      cur = props[key];
      if (key === "value") {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = cur == null ? "" : String(cur);
        if (elm.value !== strCur) {
          elm.value = strCur;
        }
      } else {
        elm[key] = cur;
      }
    }
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps,
  };

  /*  */

  var prefixes = ["Webkit", "Moz", "ms"];

  var testEl;
  var normalize = cached(function (prop) {
    testEl = testEl || document.createElement("div");
    prop = camelize(prop);
    if (prop !== "filter" && prop in testEl.style) {
      return prop;
    }
    var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < prefixes.length; i++) {
      var prefixed = prefixes[i] + upper;
      if (prefixed in testEl.style) {
        return prefixed;
      }
    }
  });

  function updateStyle(oldVnode, vnode) {
    if ((!oldVnode.data || !oldVnode.data.style) && !vnode.data.style) {
      return;
    }
    var cur, name;
    var el = vnode.elm;
    var oldStyle = oldVnode.data.style || {};
    var style = vnode.data.style || {};

    // handle string
    if (typeof style === "string") {
      el.style.cssText = style;
      return;
    }

    var needClone = style.__ob__;

    // handle array syntax
    if (Array.isArray(style)) {
      style = vnode.data.style = toObject(style);
    }

    // clone the style for future updates,
    // in case the user mutates the style object in-place.
    if (needClone) {
      style = vnode.data.style = extend({}, style);
    }

    for (name in oldStyle) {
      if (!style[name]) {
        el.style[normalize(name)] = "";
      }
    }
    for (name in style) {
      cur = style[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        el.style[normalize(name)] = cur == null ? "" : cur;
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle,
  };

  /*  */

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass(el, cls) {
    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(" ") > -1) {
        cls.split(/\s+/).forEach(function (c) {
          return el.classList.add(c);
        });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = " " + el.getAttribute("class") + " ";
      if (cur.indexOf(" " + cls + " ") < 0) {
        el.setAttribute("class", (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass(el, cls) {
    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(" ") > -1) {
        cls.split(/\s+/).forEach(function (c) {
          return el.classList.remove(c);
        });
      } else {
        el.classList.remove(cls);
      }
    } else {
      var cur = " " + el.getAttribute("class") + " ";
      var tar = " " + cls + " ";
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, " ");
      }
      el.setAttribute("class", cur.trim());
    }
  }

  /*  */

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = "transition";
  var ANIMATION = "animation";

  // Transition property/event sniffing
  var transitionProp = "transition";
  var transitionEndEvent = "transitionend";
  var animationProp = "animation";
  var animationEndEvent = "animationend";
  if (hasTransition) {
    /* istanbul ignore if */
    if (
      window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = "WebkitTransition";
      transitionEndEvent = "webkitTransitionEnd";
    }
    if (
      window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = "WebkitAnimation";
      animationEndEvent = "webkitAnimationEnd";
    }
  }

  var raf = (inBrowser && window.requestAnimationFrame) || setTimeout;
  function nextFrame(fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass(el, cls) {
    (el._transitionClasses || (el._transitionClasses = [])).push(cls);
    addClass(el, cls);
  }

  function removeTransitionClass(el, cls) {
    if (el._transitionClasses) {
      remove$1(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds(el, expectedType, cb) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) {
      return cb();
    }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function (e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo(el, expectedType) {
    var styles = window.getComputedStyle(el);
    var transitioneDelays = styles[transitionProp + "Delay"].split(", ");
    var transitionDurations = styles[transitionProp + "Duration"].split(", ");
    var transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
    var animationDelays = styles[animationProp + "Delay"].split(", ");
    var animationDurations = styles[animationProp + "Duration"].split(", ");
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type =
        timeout > 0
          ? transitionTimeout > animationTimeout
            ? TRANSITION
            : ANIMATION
          : null;
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }
    var hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + "Property"]);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform,
    };
  }

  function getTimeout(delays, durations) {
    return Math.max.apply(
      null,
      durations.map(function (d, i) {
        return toMs(d) + toMs(delays[i]);
      })
    );
  }

  function toMs(s) {
    return Number(s.slice(0, -1)) * 1000;
  }

  /*  */

  function enter(vnode) {
    var el = vnode.elm;

    // call leave callback now
    if (el._leaveCb) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (!data) {
      return;
    }

    /* istanbul ignore if */
    if (el._enterCb || el.nodeType !== 1) {
      return;
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var transitionNode = activeInstance.$vnode;
    var context =
      transitionNode && transitionNode.parent
        ? transitionNode.parent.context
        : activeInstance;

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== "") {
      return;
    }

    var startClass = isAppear ? appearClass : enterClass;
    var activeClass = isAppear ? appearActiveClass : enterActiveClass;
    var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
    var enterHook = isAppear
      ? typeof appear === "function"
        ? appear
        : enter
      : enter;
    var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
    var enterCancelledHook = isAppear
      ? appearCancelled || enterCancelled
      : enterCancelled;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl =
      enterHook &&
      // enterHook may be a bound method which exposes
      // the length of original fn as _length
      (enterHook._length || enterHook.length) > 1;

    var cb = (el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    }));

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(
        vnode.data.hook || (vnode.data.hook = {}),
        "insert",
        function () {
          var parent = el.parentNode;
          var pendingNode =
            parent && parent._pending && parent._pending[vnode.key];
          if (
            pendingNode &&
            pendingNode.tag === vnode.tag &&
            pendingNode.elm._leaveCb
          ) {
            pendingNode.elm._leaveCb();
          }
          enterHook && enterHook(el, cb);
        }
      );
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled && !userWantsControl) {
          whenTransitionEnds(el, type, cb);
        }
      });
    }

    if (vnode.data.show) {
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave(vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (el._enterCb) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (!data) {
      return rm();
    }

    /* istanbul ignore if */
    if (el._leaveCb || el.nodeType !== 1) {
      return;
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl =
      leave &&
      // leave hook may be a bound method which exposes
      // the length of original fn as _length
      (leave._length || leave.length) > 1;

    var cb = (el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    }));

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave() {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return;
      }
      // record leaving element
      if (!vnode.data.show) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] =
          vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled && !userWantsControl) {
            whenTransitionEnds(el, type, cb);
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  function resolveTransition(def$$1) {
    if (!def$$1) {
      return;
    }
    /* istanbul ignore else */
    if (typeof def$$1 === "object") {
      var res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || "v"));
      }
      extend(res, def$$1);
      return res;
    } else if (typeof def$$1 === "string") {
      return autoCssTransition(def$$1);
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: name + "-enter",
      leaveClass: name + "-leave",
      appearClass: name + "-enter",
      enterActiveClass: name + "-enter-active",
      leaveActiveClass: name + "-leave-active",
      appearActiveClass: name + "-enter-active",
    };
  });

  function once(fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn();
      }
    };
  }

  var transition = inBrowser
    ? {
        create: function create(_, vnode) {
          if (!vnode.data.show) {
            enter(vnode);
          }
        },
        remove: function remove(vnode, rm) {
          /* istanbul ignore else */
          if (!vnode.data.show) {
            leave(vnode, rm);
          } else {
            rm();
          }
        },
      }
    : {};

  var platformModules = [attrs, klass, events, domProps, style, transition];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch$1 = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  var modelableTagRE =
    /^input|select|textarea|vue-component-[0-9]+(-[0-9a-zA-Z_\-]*)?$/;

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener("selectionchange", function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, "input");
      }
    });
  }

  var model = {
    bind: function bind(el, binding, vnode) {
      {
        if (!modelableTagRE.test(vnode.tag)) {
          warn(
            "v-model is not supported on element type: <" +
              vnode.tag +
              ">. " +
              "If you are working with contenteditable, it's recommended to " +
              "wrap a library dedicated for that purpose inside a custom component.",
            vnode.context
          );
        }
      }
      if (vnode.tag === "select") {
        setSelected(el, binding, vnode.context);
        /* istanbul ignore if */
        if (isIE || isEdge) {
          var cb = function () {
            setSelected(el, binding, vnode.context);
          };
          nextTick(cb);
          setTimeout(cb, 0);
        }
      } else if (vnode.tag === "textarea" || el.type === "text") {
        if (!isAndroid) {
          el.addEventListener("compositionstart", onCompositionStart);
          el.addEventListener("compositionend", onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    },
    componentUpdated: function componentUpdated(el, binding, vnode) {
      if (vnode.tag === "select") {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matchig
        // option in the DOM.
        var needReset = el.multiple
          ? binding.value.some(function (v) {
              return hasNoMatchingOption(v, el.options);
            })
          : hasNoMatchingOption(binding.value, el.options);
        if (needReset) {
          trigger(el, "change");
        }
      }
    },
  };

  function setSelected(el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
      "development" !== "production" &&
        warn(
          '<select multiple v-model="' +
            binding.expression +
            '"> ' +
            "expects an Array value for its binding, but got " +
            Object.prototype.toString.call(value).slice(8, -1),
          vm
        );
      return;
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return;
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption(value, options) {
    for (var i = 0, l = options.length; i < l; i++) {
      if (looseEqual(getValue(options[i]), value)) {
        return false;
      }
    }
    return true;
  }

  function getValue(option) {
    return "_value" in option ? option._value : option.value;
  }

  function onCompositionStart(e) {
    e.target.composing = true;
  }

  function onCompositionEnd(e) {
    e.target.composing = false;
    trigger(e.target, "input");
  }

  function trigger(el, type) {
    var e = document.createEvent("HTMLEvents");
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode(vnode) {
    return vnode.child && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.child._vnode)
      : vnode;
  }

  var show = {
    bind: function bind(el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition = vnode.data && vnode.data.transition;
      if (value && transition && !isIE9) {
        enter(vnode);
      }
      var originalDisplay = el.style.display === "none" ? "" : el.style.display;
      el.style.display = value ? originalDisplay : "none";
      el.__vOriginalDisplay = originalDisplay;
    },
    update: function update(el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (value === oldValue) {
        return;
      }
      vnode = locateNode(vnode);
      var transition = vnode.data && vnode.data.transition;
      if (transition && !isIE9) {
        if (value) {
          enter(vnode);
          el.style.display = el.__vOriginalDisplay;
        } else {
          leave(vnode, function () {
            el.style.display = "none";
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : "none";
      }
    },
  };

  var platformDirectives = {
    model: model,
    show: show,
  };

  /*  */

  // Provides transition support for a single element/component.
  // supports transition mode (out-in / in-out)

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recrusively retrieve the real component to be rendered
  function getRealChild(vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children));
    } else {
      return vnode;
    }
  }

  function extractTransitionData(comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1].fn;
    }
    return data;
  }

  function placeholder(h, rawChild) {
    return /\d-keep-alive$/.test(rawChild.tag) ? h("keep-alive") : null;
  }

  function hasParentTransition(vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true;
      }
    }
  }

  var Transition = {
    name: "transition",
    props: transitionProps,
    abstract: true,
    render: function render(h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return;
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(function (c) {
        return c.tag;
      });
      /* istanbul ignore if */
      if (!children.length) {
        return;
      }

      // warn multiple elements
      if ("development" !== "production" && children.length > 1) {
        warn(
          "<transition> can only be used on a single element. Use " +
            "<transition-group> for lists.",
          this.$parent
        );
      }

      var mode = this.mode;

      // warn invalid mode
      if (
        "development" !== "production" &&
        mode &&
        mode !== "in-out" &&
        mode !== "out-in"
      ) {
        warn("invalid <transition> mode: " + mode, this.$parent);
      }

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild;
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild;
      }

      if (this._leaving) {
        return placeholder(h, rawChild);
      }

      child.key =
        child.key == null || child.isStatic
          ? "__v" + (child.tag + this._uid) + "__"
          : child.key;
      var data = ((child.data || (child.data = {})).transition =
        extractTransitionData(this));
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (
        child.data.directives &&
        child.data.directives.some(function (d) {
          return d.name === "show";
        })
      ) {
        child.data.show = true;
      }

      if (oldChild && oldChild.data && oldChild.key !== child.key) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = (oldChild.data.transition = extend({}, data));

        // handle transition mode
        if (mode === "out-in") {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, "afterLeave", function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild);
        } else if (mode === "in-out") {
          var delayedLeave;
          var performLeave = function () {
            delayedLeave();
          };
          mergeVNodeHook(data, "afterEnter", performLeave);
          mergeVNodeHook(data, "enterCancelled", performLeave);
          mergeVNodeHook(oldData, "delayLeave", function (leave) {
            delayedLeave = leave;
          });
        }
      }

      return rawChild;
    },
  };

  /*  */

  // Provides transition support for list items.
  // supports move transitions using the FLIP technique.

  // Because the vdom's children update algorithm is "unstable" - i.e.
  // it doesn't guarantee the relative positioning of removed elements,
  // we force transition-group to update its children into two passes:
  // in the first pass, we remove all nodes that need to be removed,
  // triggering their leaving transition; in the second pass, we insert/move
  // into the final disired state. This way in the second pass removed
  // nodes will remain where they should be.

  var props = extend(
    {
      tag: String,
      moveClass: String,
    },
    transitionProps
  );

  delete props.mode;

  var TransitionGroup = {
    props: props,

    render: function render(h) {
      var tag = this.tag || this.$vnode.data.tag || "span";
      var map = Object.create(null);
      var prevChildren = (this.prevChildren = this.children);
      var rawChildren = this.$slots.default || [];
      var children = (this.children = []);
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf("__vlist") !== 0) {
            children.push(c);
            map[c.key] = c;
            (c.data || (c.data = {})).transition = transitionData;
          } else {
            var opts = c.componentOptions;
            var name = opts ? opts.Ctor.options.name || opts.tag : c.tag;
            warn("<transition-group> children must be keyed: <" + name + ">");
          }
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children);
    },

    beforeUpdate: function beforeUpdate() {
      // force removing pass
      this.__patch__(
        this._vnode,
        this.kept,
        false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
      );
      this._vnode = this.kept;
    },

    updated: function updated() {
      var children = this.prevChildren;
      var moveClass = this.moveClass || this.name + "-move";
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return;
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      var f = document.body.offsetHeight; // eslint-disable-line

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = "";
          el.addEventListener(
            transitionEndEvent,
            (el._moveCb = function cb(e) {
              if (!e || /transform$/.test(e.propertyName)) {
                el.removeEventListener(transitionEndEvent, cb);
                el._moveCb = null;
                removeTransitionClass(el, moveClass);
              }
            })
          );
        }
      });
    },

    methods: {
      hasMove: function hasMove(el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false;
        }
        if (this._hasMove != null) {
          return this._hasMove;
        }
        addTransitionClass(el, moveClass);
        var info = getTransitionInfo(el);
        removeTransitionClass(el, moveClass);
        return (this._hasMove = info.hasTransform);
      },
    },
  };

  function callPendingCbs(c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition(c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation(c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = "0s";
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup,
  };

  /*  */

  // install platform specific utils
  Vue$3.config.isUnknownElement = isUnknownElement;
  Vue$3.config.isReservedTag = isReservedTag;
  Vue$3.config.getTagNamespace = getTagNamespace;
  Vue$3.config.mustUseProp = mustUseProp;

  // install platform runtime directives & components
  extend(Vue$3.options.directives, platformDirectives);
  extend(Vue$3.options.components, platformComponents);

  // install platform patch function
  Vue$3.prototype.__patch__ = config._isServer ? noop : patch$1;

  // wrap mount
  Vue$3.prototype.$mount = function (el, hydrating) {
    el = el && !config._isServer ? query(el) : undefined;
    return this._mount(el, hydrating);
  };

  // devtools global hook
  /* istanbul ignore next */
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit("init", Vue$3);
      } else if (
        "development" !== "production" &&
        inBrowser &&
        /Chrome\/\d+/.test(window.navigator.userAgent)
      ) {
        console.log(
          "Download the Vue Devtools for a better development experience:\n" +
            "https://github.com/vuejs/vue-devtools"
        );
      }
    }
  }, 0);

  /*  */

  // check whether current browser encodes a char inside attribute values
  function shouldDecode(content, encoded) {
    var div = document.createElement("div");
    div.innerHTML = '<div a="' + content + '">';
    return div.innerHTML.indexOf(encoded) > 0;
  }

  // According to
  // https://w3c.github.io/DOM-Parsing/#dfn-serializing-an-attribute-value
  // when serializing innerHTML, <, >, ", & should be encoded as entities.
  // However, only some browsers, e.g. PhantomJS, encodes < and >.
  // this causes problems with the in-browser parser.
  var shouldDecodeTags = inBrowser ? shouldDecode(">", "&gt;") : false;

  // #3663
  // IE encodes newlines inside attribute values while other browsers don't
  var shouldDecodeNewlines = inBrowser ? shouldDecode("\n", "&#10;") : false;

  /*  */

  var decoder = document.createElement("div");

  function decodeHTML(html) {
    decoder.innerHTML = html;
    return decoder.textContent;
  }

  /**
   * Not type-checking this file because it's mostly vendor code.
   */

  /*!
   * HTML Parser By John Resig (ejohn.org)
   * Modified by Juriy "kangax" Zaytsev
   * Original code by Erik Arvidsson, Mozilla Public License
   * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
   */

  // Regular Expressions for parsing tags and attributes
  var singleAttrIdentifier = /([^\s"'<>\/=]+)/;
  var singleAttrAssign = /(?:=)/;
  var singleAttrValues = [
    // attr value double quotes
    /"([^"]*)"+/.source,
    // attr value, single quotes
    /'([^']*)'+/.source,
    // attr value, no quotes
    /([^\s"'=<>`]+)/.source,
  ];
  var attribute = new RegExp(
    "^\\s*" +
      singleAttrIdentifier.source +
      "(?:\\s*(" +
      singleAttrAssign.source +
      ")" +
      "\\s*(?:" +
      singleAttrValues.join("|") +
      "))?"
  );

  // could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
  // but for Vue templates we can enforce a simple charset
  var ncname = "[a-zA-Z_][\\w\\-\\.]*";
  var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
  var startTagOpen = new RegExp("^<" + qnameCapture);
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>");
  var doctype = /^<!DOCTYPE [^>]+>/i;

  var IS_REGEX_CAPTURING_BROKEN = false;
  "x".replace(/x(.)?/g, function (m, g) {
    IS_REGEX_CAPTURING_BROKEN = g === "";
  });

  // Special Elements (can contain anything)
  var isSpecialTag = makeMap("script,style", true);

  var reCache = {};

  var ltRE = /&lt;/g;
  var gtRE = /&gt;/g;
  var nlRE = /&#10;/g;
  var ampRE = /&amp;/g;
  var quoteRE = /&quot;/g;

  function decodeAttr(value, shouldDecodeTags, shouldDecodeNewlines) {
    if (shouldDecodeTags) {
      value = value.replace(ltRE, "<").replace(gtRE, ">");
    }
    if (shouldDecodeNewlines) {
      value = value.replace(nlRE, "\n");
    }
    return value.replace(ampRE, "&").replace(quoteRE, '"');
  }

  /**
   * 这个方法用一个 while 循环来对传入的 template 做处理
   * 用正则来匹配标签类型，然后往 ast tree 中推
   * 推完，template 删掉标记节点
   * 直到 template 为 '' 停止循环，最终输出 ast tree
   */
  function parseHTML(html, options) {
    /**
     * 这个 stack 也很重要，是内部的 stack，用来组织数据
     * 和调用他的 parse 中的 stack 是有区别的
     * 
     * 它记录的只是一个平行关系，类似这样（开始标签是这样的，结束的时候不知会不会增加属性）：
     * 0: {tag: "div", attrs: Array(0)}
     * 1: {tag: "span", attrs: Array(0)}
     */ 
    var stack = [];
    var expectHTML = options.expectHTML; // 都是 true
    var isUnaryTag$$1 = options.isUnaryTag || no; // 这个主要是定义类似这种：<br>对照内写内容都没有什么卵用的标签</br>
    var isFromDOM = options.isFromDOM;
    var index = 0;
    var last, lastTag; // 这个要搞清楚
    /**
     * 为什么一定要有一个根节点，我觉得最大的原因是：
     * 最终是为了输出 ast 结构，这种以一个点展开的 DOM 描述本身就必须要求有一个根节点
     */
    while (html) {
      last = html;
      /**
       * Make sure we're not in a script or style element
       * isSpecialTag 是检测 style 和 script 的，这个场景其实不多吧
       */
      if (!lastTag || !isSpecialTag(lastTag)) {
        var textEnd = html.indexOf("<");
        // 这个判断是处理标签节点的情况（不管是结束还是开始，都是 < 开头）
        if (textEnd === 0) {
          // Comment:
          if (/^<!--/.test(html)) {
            /**
             * 如果只有 <!-- 评论 --> 这种情况
             * 这里直接找到第一个 --> 从文本中删掉
             */
            var commentEnd = html.indexOf("-->");
            if (commentEnd >= 0) {
              advance(commentEnd + 3);
              continue;
            }
          }
          /**
           * 此处是为了处理别的评论的情况，主要是 IE <![if !IE]>
           * http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
           * VUE 只兼容到 IE9 所以降级方法是没用的，处理方法和 Comment 一样
           */
          if (/^<!\[/.test(html)) {
            var conditionalEnd = html.indexOf("]>");
            if (conditionalEnd >= 0) {
              advance(conditionalEnd + 2);
              continue;
            }
          }

          /**
           * 处理方法和上文一样，直接删除
           * Doctype:
           */
          var doctypeMatch = html.match(doctype);
          if (doctypeMatch) {
            advance(doctypeMatch[0].length);
            continue;
          }

          // 先看下 startTag 的处理
          // End tag:
          /**
           * 看下这个正则 new RegExp("^<\\/" + qnameCapture + "[^>]*>")
           * 好像很简单，以 "</" 开头(^) 中间是标签名，又以 ">" 结尾，后面有或者没有字符(* 重复零次或更多次)
           *
           * 看下 html.match(endTag) 匹配的结果，第二个参数是 match 匹配到的
           * ["</p>", "p", index: 0, input: "</p></div>", groups: undefined]
           */
          var endTagMatch = html.match(endTag);
          // ↓↓↓ ["</p>", "p", index: 0, input: "</p></div>", groups: undefined]
          if (endTagMatch) {
            /**
             * 这个 index 是说，目前的结束标签 < 节点，在整个 template 中的位置
             * 其实更本质说，是在记录目前 while 循环在 template string 中的位置
             * 是在 advance、chars 方法中具体操作的
             */
            var curIndex = index;
            /**
             * 经过 advance 方法后，curIndex 和 index 不相同了，差值是 endTagMatch[0].length
             * ↓↓↓ 匹配到了，先删了结束标签
             */
            advance(endTagMatch[0].length);
            parseEndTag(endTagMatch[0], endTagMatch[1], curIndex, index);
            continue;
          }

          // Start tag:
          var startTagMatch = parseStartTag();
          /**
           * 返回的是一个开始标签的表述，类似这样：
           * {
           *     tagName: start[1],
           *     attrs: [],
           *     start: index,
           *     index
           *     end
           *     unarySlash
           *     ...
           * }
           */
          // 一般都会进
          if (startTagMatch) {
            handleStartTag(startTagMatch);
            continue;
          }
        }

        /**
         * 能到这里，基本就是 <> 两个标签之间的内容了 </>
         * 在上文的 startTag、endTag 正则中都没有命中
         */ 
        var text = void 0;
        if (textEnd >= 0) { // 说明有确实有内容，然后才衔接到了,下一个开始或者结束标签的 < 符号
          // 提取到下个 < 符号衔接前的内容 -> 两个标签之间的内容
          text = html.substring(0, textEnd);
          advance(textEnd); // html 里去掉 下个 < 之前的内容
        } else {
          // 仔细想想 -> 到这里，这说明这个模板的定义是有问题的，要抛出错误了
          // 不怎么需要关心
          text = html;
          html = ""; // 就是遇到没有根节点，结束 while
        }

        if (options.chars) { // 一定进
          /**
           * 这个 chars 方法，是对文本节点的处理，也包括了 ' 字符或者空格 {{ }}' 语法的处理
           * 说到底，就是对 '<> 两个标签之间的内容 </>' 进行处理
           */
          options.chars(text);
        }
      }

      // 下面这个判断是处理特殊节点（非标签、文本），这段暂时也先不看了吧
      else {
        var stackedTag = lastTag.toLowerCase();
        var reStackedTag =
          reCache[stackedTag] ||
          (reCache[stackedTag] = new RegExp(
            "([\\s\\S]*?)(</" + stackedTag + "[^>]*>)",
            "i"
          ));
        var endTagLength = 0;
        var rest = html.replace(reStackedTag, function (all, text, endTag) {
          endTagLength = endTag.length;
          if (
            stackedTag !== "script" &&
            stackedTag !== "style" &&
            stackedTag !== "noscript"
          ) {
            text = text
              .replace(/<!--([\s\S]*?)-->/g, "$1")
              .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
          }
          if (options.chars) {
            options.chars(text);
          }
          return "";
        });
        index += html.length - rest.length;
        html = rest;
        parseEndTag(
          "</" + stackedTag + ">",
          stackedTag,
          index - endTagLength,
          index
        );
      }

      if (html === last) {
        throw new Error("Error parsing template:\n\n" + html);
      }
    }

    // Clean up any remaining tags
    parseEndTag();

    function advance(n) {
      index += n;
      html = html.substring(n);
    }

    function parseStartTag() {
      /**
       * 这个函数作用值匹配开始标签，组织一个该开始标签对照的 AST 描述并且返回
       * startTagOpen 是一个标签开始对照的正则表达式
       * // 返回的是这么一个 array:
       * // 0: "<div"
       * // 1: "div"
       * // groups: undefined
       * // index: 0
       * // input: "<div><span>测试</span></div>"
       * // length: 2
       */
      var start = html.match(startTagOpen);
      
      // 一定会有
      if (start) {
        var match = {
          tagName: start[1],
          attrs: [],
          start: index,
        };
        // 从 html 中删除匹配到的开始标签对照的开始部分，处理后的结果类似于: " class="test" value="what">demo</div>"
        advance(start[0].length);
        var end, attr;
        while (
          /**
           * 这个 while 用的很有技巧，Evan You 看来很喜欢用 while 来做循环
           * end match 的这个正则，是为了拿到 " class="test" value="what">demo</div>" 这个开口情况下开口位置到 ">" 的情况：
           * // 0: ">"
           * // 1: ""
           * // groups: undefined
           * // index: 0
           * // input: ">测试</span></div>"
           * // length: 2
           * 
           * attr 的正则结果大概长这样：
           * // 0: " class=\"tt\""
           * // 1: "class"
           * // 2: "="
           * // 3: "tt"
           * // 4: undefined
           * // 5: undefined
           * // groups: undefined
           * // index: 0
           * 
           * 这个 while 的进入条件是【没匹配】到【开始标签的闭合标签】而且【匹配到了属性】
           * 进入后，把 match 到的 attr 推到当前对象的 attr 属性里，等待处理
           * 然后 html 里删了这个 attr，再做循环
           */
          !(end = html.match(startTagClose)) && // /^\s*(\/?)>/ 正则是这样的
          (attr = html.match(attribute))
        ) {
          advance(attr[0].length); // 删除 html 中的这个属性，以便于下次循环
          // 符合判断，往 attrs 数组中推，是 match 到的数组，下文处理 attr 的相关模块会处理
          match.attrs.push(attr);
        }
        // 肯定会进
        if (end) {
          match.unarySlash = end[1]; // 类似单标签 <div /> 情况的处理，unarySlash 是为了标记，方便下文处理
          advance(end[0].length); // 继续删除 html
          match.end = index; // index 是 advance 修改过的全局变量，end 字段也是一个标记为，方便以后的组织
          // 到了这里，这个 start 标签就是处理完了，开始标签会被完全裁掉
          return match; 
          /**
           * 返回的是一个开始标签的表述，类似这样：
           * {
           *     tagName: start[1],
           *     attrs: [],
           *     start: index,
           *     index
           *     end
           *     unarySlash
           *     ...
           * }
           */
        }
      }
    }

    function handleStartTag(match) {
      /**
       * 入参长这个样子：
       * {
       *     tagName: start[1],
       *     attrs: [],
       *     start: index,
       *     index
       *     end
       *     unarySlash
       *     ...
       * }
       */
      var tagName = match.tagName;
      var unarySlash = match.unarySlash;

      // 肯定进，这个判断里的两种情况，可以先不考虑，很少见会这么写的
      if (expectHTML) {
        /**
         * 被 p 标签包裹的，isNonPhrasingTag 的标签会脱离 p 的包裹
         * 这个不考虑了吧
         * isNonPhrasingTag 可以戳开了解一下
         */ 
        if (lastTag === "p" && isNonPhrasingTag(tagName)) {
          parseEndTag("", lastTag);
        }
        /**
         * 这个不考虑了吧
         * 这个是特殊情况，具体可以戳开 canBeLeftOpenTag 看一下
         * 不同系统的行为好像也不一样
         * 可以戳开看下 canBeLeftOpenTag
         */
        if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
          parseEndTag("", tagName);
        }
      }

      var unary =
        isUnaryTag$$1(tagName) || // 对照里写内容没卵用的标签
        (tagName === "html" && lastTag === "head") || // 是在 head 里写 html
        !!unarySlash; // 是个闭合单标签 <div /> (基本上都是 '/' )

      var l = match.attrs.length;
      var attrs = new Array(l);
      // 这里是对一个开合标签中的 attr 进行处理的逻辑
      for (var i = 0; i < l; i++) {
        var args = match.attrs[i];
        /**
         * hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
         * FF 2006年的正则 bug , 2014年 closed，可怕。 Evan You 写这个的时候，应该这个 bug 还没关闭
         * 可以不用管了
         */
        if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
          if (args[3] === "") {
            delete args[3];
          }
          if (args[4] === "") {
            delete args[4];
          }
          if (args[5] === "") {
            delete args[5];
          }
        }
        // 取值，取具体属性的值，理论上是取第4条 agrs[3]，没想到 4 和 5 的情况，可能是有上文 FF bug 的情况，不需要关注
        var value = args[3] || args[4] || args[5] || "";
        // 之前 attr 是数组里 match 的数组，这里组织成数组里 name -> value 的形式
        attrs[i] = {
          name: args[1],
          value: isFromDOM // 不用过多关注这种情况，因为拿的是 innerHTML 所以需要 decode
            ? decodeAttr(
                value,
                options.shouldDecodeTags,
                options.shouldDecodeNewlines
              )
            : value,
        };
      }
      if (!unary) {  // 这里是说，正常情况的开口标签
        // 往上文的 stack 中推入
        stack.push({ tag: tagName, attrs: attrs });
        lastTag = tagName; // 上层环境中的变量，是表示最近的开口标签是什么，记录关系
        unarySlash = ""; // 如果是闭合标签的情况下，清空上文这个标记位？？？清一下问题也不大
      }
      /**
       * 一定会走到这个方法，这个 start 方法也是比较重要的
       * 这个方法三个参数：tagName, attrs, unary
       * 其他两个是多余的
       */
      if (options.start) {
        options.start(tagName, attrs, unary, match.start, match.end);
      }
    }

    function parseEndTag(tag, tagName, start, end) {
      var pos; // 这个是说，上一个对照的起始位置，这个位置是在 stack 数组中的位置
      /**
       * 有个疑问？原来用来 while 的 html 其实都删掉了，要位置有啥用
       * 下文的 end 方法可以解释这个。为了触发一个标签闭合的操作
       */
      // 下面两行的意思是，如果不传，则 start 和 end 都赋值成这个标签结束的长度
      if (start == null) {
        start = index;
      }
      if (end == null) {
        end = index;
      }

      /**
       * Find the closest opened tag of the same type
       * 这个很容易想到
       * 1. 因为 stack 的数据结构，就直接找最近的就是对照了
       * 2. 自闭合和其他类型是在开始标签里处理的，是上文不会推到 stack 里
       */
      if (tagName) {
        var needle = tagName.toLowerCase();
        for (pos = stack.length - 1; pos >= 0; pos--) {
          if (stack[pos].tag.toLowerCase() === needle) {
            break;
          }
        }
      } else {
        /**
         * If no tag name is provided, clean shop
         * 这种是什么情况？没抓到标签？匹配到了 endTag 没抓到标签？
         * 是为了 JSX 的 '<> </>' 这种类型的吗
         */
        pos = 0;
      }
      if (pos >= 0) {
        // 在内部 stack 中，对照开始的位置
        /**
         * Close all the open elements, up the stack
         */
        for (var i = stack.length - 1; i >= pos; i--) {
          if (options.end) {
            // 这里，其实开始 close end 的循环了，end 函数里要 指定好 currentParent、inPre 这些标记位置
            options.end(stack[i].tag, start, end);
          }
        }

        // Remove the open elements from the stack
        // 处理完，删除
        stack.length = pos;
        lastTag = pos && stack[pos - 1].tag;
      } else if (tagName.toLowerCase() === "br") {
        // 处理 <br />
        if (options.start) {
          options.start(tagName, [], true, start, end);
        }
      } else if (tagName.toLowerCase() === "p") {
        // ？？？ 应该不用过多考虑，这写是处理边界情况
        if (options.start) {
          options.start(tagName, [], false, start, end);
        }
        if (options.end) {
          options.end(tagName, start, end);
        }
      }
    }
  }

  /**
   * 这个函数对输入的字符串进行 for loop
   * 遇到 | 则认为是 filter
   */

  function parseFilters(exp) {
    var inSingle = false;
    var inDouble = false;
    var curly = 0;
    var square = 0;
    var paren = 0;
    var lastFilterIndex = 0;
    var c, prev, i, expression, filters;

    for (i = 0; i < exp.length; i++) {
      prev = c; // 缓存前一个字符
      c = exp.charCodeAt(i); // 返回字符串中指定位置字符的 Unicode 编码
      if (inSingle) {
        /**
         * 0x27: '
         * 0x5c: /
         * check single quote
         * 当前字符是 '，而且不被 / 转义，跳出 '，认为不在 inSingle 里了
         */
        if (c === 0x27 && prev !== 0x5c) {
          inSingle = !inSingle;
        }
      } else if (inDouble) {
        /**
         * check double quote
         * 和 inSingle 的处理一样
         */
        if (c === 0x22 && prev !== 0x5c) {
          inDouble = !inDouble;
        }
      } else if (
        c === 0x7c && // pipe 竖线: | ，确定过滤器
        exp.charCodeAt(i + 1) !== 0x7c &&
        exp.charCodeAt(i - 1) !== 0x7c &&
        // 未被放在任何 () [] {} 中
        !curly &&
        !square &&
        !paren
      ) {
        if (expression === undefined) {
          // first filter, end of expression
          lastFilterIndex = i + 1; // 最新过滤器函数的起始位置
          expression = exp.slice(0, i).trim(); // 'test'.slice(0, 4) -> test 赋值要被过滤器过滤的字段
        } else {
          pushFilter();
        }
      } else {
        // 对涉及到可能运算的关键字进行记录
        switch (c) {
          case 0x22:
            inDouble = true;
            break; // "
          case 0x27:
            inSingle = true;
            break; // '
          case 0x28:
            paren++;
            break; // (
          case 0x29:
            paren--;
            break; // )
          case 0x5b:
            square++;
            break; // [
          case 0x5d:
            square--;
            break; // ]
          case 0x7b:
            curly++;
            break; // {
          case 0x7d:
            curly--;
            break; // }
        }
      }
    }

    if (expression === undefined) {
      // 没接触到 | 的过滤器指令前，expression 继续赋值成最新的状态
      expression = exp.slice(0, i).trim();
    } else if (lastFilterIndex !== 0) {
      // 有了 | 过滤器指令
      pushFilter();
    }

    function pushFilter() {
      (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
      lastFilterIndex = i + 1;
    }

    if (filters) {
      for (i = 0; i < filters.length; i++) {
        expression = wrapFilter(expression, filters[i]);
      }
    }

    return expression;
  }

  function wrapFilter(exp, filter) {
    var i = filter.indexOf("(");
    if (i < 0) {
      // _f: resolveFilter
      return '_f("' + filter + '")(' + exp + ")";
    } else {
      var name = filter.slice(0, i);
      var args = filter.slice(i + 1);
      return '_f("' + name + '")(' + exp + "," + args;
    }
  }

  /*  */

  var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

  var buildRegex = cached(function (delimiters) {
    var open = delimiters[0].replace(regexEscapeRE, "\\$&");
    var close = delimiters[1].replace(regexEscapeRE, "\\$&");
    return new RegExp(open + "((?:.|\\n)+?)" + close, "g");
  });

  function parseText(text, delimiters) {
    /**
     * 这个方法
     * 1. 是对 '{{ }}' 语法的处理
     * 2. bind 的属性值的处理 <Cp1 :value="a">，过滤器处理 <Cp :testValue="a | filterFn"> 等
     * 3. 输入的 ' {{ }}' 和 bind value 可能是有空格的
     */
    var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
    if (!tagRE.test(text)) {
      // 如果不是 '{{ }} [] ()' 这种计算的，直接返回 undefined 作为普通文本看
      return;
    }
    var tokens = [];

    /**
     * tagRE 的 lastIndex 是 '  {{ 'asdfsafd' }}  ' 是这个输入串的长度，包含空格
     * 每次都变成 0 ？？？
     */

    var lastIndex = (tagRE.lastIndex = 0);
    var match, index;
    /**
     * 匹配到的 match 类似于 ['{{ 'asdfsafd' }}', " 'asdfsafd' "]，match.index = 0
     * match 是出去 {} 两边空格的情况，index 是被除去的空格
     */
    while ((match = tagRE.exec(text))) {
      index = match.index; // 如果 { 前面没空格的情况，那就是 0
      // push text token
      if (index > lastIndex) {
        // 没空格，不会到这里，感觉 token 是存 {{ 前面的值，包括空格
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      /**
       * tag token
       * 走过过滤器方法，返回的是这样的：
       * "_f("a")(branches.join())"
       */
      var exp = parseFilters(match[1].trim());

      tokens.push("_s(" + exp + ")");
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      // 试了很多次，一般这个判断不走，边界情况是？？？
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    // 一般会返回这么一个东西: '_s(branches.join())'、'"_s(_f("a")(branches.join()))"'
    return tokens.join("+");
  }

  /*  */

  function baseWarn(msg) {
    console.error("[Vue parser]: " + msg);
  }
  
  /**
   * 目前入参： 
   * modules：[klass$1, style$1]
   * key：有 transformNode、preTransformNode、postTransformNode 这几个情况
   * modules 默认入参 [klass$1, style$1]
   * 目前看下来，这个函数默认情况下都是默认返回空数组
   */
  function pluckModuleFunction(modules, key) {
    return modules
      ? modules
          .map(function (m) {
            return m[key];
          })
          .filter(function (_) {
            return _;
          })
      : [];
  }

  function addProp(el, name, value) {
    // 挺骚的，新建并推入
    (el.props || (el.props = [])).push({ name: name, value: value });
  }

  function addAttr(el, name, value) {
    (el.attrs || (el.attrs = [])).push({ name: name, value: value });
  }

  function addDirective(el, name, value, arg, modifiers) {
    (el.directives || (el.directives = [])).push({
      name: name,
      value: value,
      arg: arg,
      modifiers: modifiers,
    });
  }

  function addHandler(el, name, value, modifiers, important) {
    /** 
     * 捕获模式
     * 再常规事件处理顺序上，会优先处理增加了这个修饰符的事件
     * 换句话说，可以调整一个嵌套结构中，事件的执行顺序
     */ 
    if (modifiers && modifiers.capture) {
      // 做一个标记吧，方便下文处理
      delete modifiers.capture;
      // ! 应该是个标记，等事件处理模块执行的时候，他会单独来处理这层关系
      name = "!" + name; // mark the event as captured
    }
    var events;
    /**
     * 先初始化一个原生事件列表或者，普通事件列表
     * 这个列表挂在整个 el ast 上的，会伴随整个周期
     */
    if (modifiers && modifiers.native) {
      delete modifiers.native;
      /**
       * 可以 console 敲一下，个人觉得这种写法还是挺难理解的：
       * events 会尝试赋值成 el.nativeEvents 或者 el.events
       * 如果 el 上没有这两个属性，会创建，并且 events 被初始化成 {}
       * 【同时，这个 events 会指向 el 的 events 引用】
       */ 
      events = el.nativeEvents || (el.nativeEvents = {});
    } else {
      events = el.events || (el.events = {});
    }

    // 修饰符和执行函数组成的对象
    var newHandler = { value: value, modifiers: modifiers };

    var handlers = events[name];

    /**
     * 这里重点看下 【important】参数
     * 实际上，是为了 input、radio 这种受控组件，v-model 这种双向绑定
     * 在做自己的事件的时候，还要去做一个 data 绑定的操作
     * 所以，这里的事件时有个顺序的
     */
    /* istanbul ignore if */
    if (Array.isArray(handlers)) {
      important ? handlers.unshift(newHandler) : handlers.push(newHandler);
    } else if (handlers) {
      events[name] = important
        ? [newHandler, handlers]
        : [handlers, newHandler];
    } else {
      // 第一个初始化会到这里来，会改 el 上的引用！！！
      events[name] = newHandler;
    }
  }

  function getBindingAttr(el, name, getStatic) {
    /**
     * 这个方法比 getAndRemoveAttr 多了一层 v-bind 和 : 的判断
     * 还有一个获取静态值的参数，应该不用关心
     */ 
    var dynamicValue =
      getAndRemoveAttr(el, ":" + name) ||
      getAndRemoveAttr(el, "v-bind:" + name);
    if (dynamicValue != null) {
      return dynamicValue;
    } else if (getStatic !== false) {
      var staticValue = getAndRemoveAttr(el, name);
      if (staticValue != null) {
        return JSON.stringify(staticValue);
      }
    }
  }

  function getAndRemoveAttr(el, name) {
    // 判断是否有，拿到并且返回，然后从 arrtsList 中删除
    var val;
    if ((val = el.attrsMap[name]) != null) {
      var list = el.attrsList;
      for (var i = 0, l = list.length; i < l; i++) {
        if (list[i].name === name) {
          list.splice(i, 1);
          break;
        }
      }
    }
    return val;
  }

  /*  */

  var dirRE = /^v-|^@|^:/;
  var forAliasRE = /(.*)\s+(?:in|of)\s+(.*)/;
  var forIteratorRE = /\(([^,]*),([^,]*)(?:,([^,]*))?\)/;
  var bindRE = /^:|^v-bind:/;
  var onRE = /^@|^v-on:/;
  var argRE = /:(.*)$/;
  var modifierRE = /\.[^\.]+/g;

  /**
   * cached 是为了减少 dom 操作
   * 减少 decodeHTML 中的 innerHTML 赋值
   * 无副作用函数，唯一输入，吐出唯一结果，所以整个 VUE 实例中用的都是一个闭包引用
   */
  var decodeHTMLCached = cached(decodeHTML);

  // configurable state
  var warn$1;
  var platformGetTagNamespace;
  var platformMustUseProp;
  var platformIsPreTag;
  var preTransforms;
  var transforms;
  var postTransforms;
  var delimiters; // https://vuejs.org/v2/api/#delimiters 自定义分隔符

  /**
   * Convert HTML string to AST.
   */
  function parse(template, options) {
    warn$1 = options.warn || baseWarn;
    platformGetTagNamespace = options.getTagNamespace || no; // 命名空间感觉没啥用，不用关注
    platformMustUseProp = options.mustUseProp || no; // "value, selected, checked, muted"
    platformIsPreTag = options.isPreTag || no; // 一般都是 false
    preTransforms = pluckModuleFunction(options.modules, "preTransformNode"); // 默认 []，不需要关心
    transforms = pluckModuleFunction(options.modules, "transformNode"); // 默认 []，不需要关心
    postTransforms = pluckModuleFunction(options.modules, "postTransformNode"); // 默认 []，不需要关心
    delimiters = options.delimiters;

    var stack = []; // 这个是一个缓存栈，是编译方法中最外层的缓存栈，非常重要
    var preserveWhitespace = options.preserveWhitespace !== false;
    var root;
    var currentParent;
    var inVPre = false; // 判断是否是在 v-pre 指令中的文本内容
    var inPre = false;
    var warned = false;
    // parseHTML 编译模块的核心代码，parseHTML 中，会大量用到 parse 函数中的上文
    parseHTML(template, {
      expectHTML: options.expectHTML, // 都是 true
      isUnaryTag: options.isUnaryTag, // 这个主要是定义那些，<br>对照内写内容都没有什么卵用的标签</br>
      isFromDOM: options.isFromDOM, // 是否是取的节点，基本不会有这种情况
      shouldDecodeTags: options.shouldDecodeTags, // 浏览器解码一些特殊标签，这个是默认配置，具体戳开这个方法看
      shouldDecodeNewlines: options.shouldDecodeNewlines,
      start: function start(tag, attrs, unary) {
        // check namespace.
        // inherit parent ns if there is one
        // 拿命名空间，大部分情况下应该都是默认值，不用关心
        var ns =
          (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

        // handle IE svg bug
        /* istanbul ignore if */
        // IE 处理 SVG 的 bug，这个已经可以不考虑了
        if (options.isIE && ns === "svg") {
          attrs = guardIESVGBug(attrs);
        }
        /**
         * 看一下 attrs：
         * 0: {name: ":data-a", value: "sdfasdf"}
         * 1: {name: "v-on:class", value: "tt"}
         * 2: {name: "value", value: "999"}
         */
        var element = {
          type: 1, // 类型一定是这个
          tag: tag,
          attrsList: attrs,
          /**
           * 对象形式的 attrs，可能是为了方便之后处理
           * attrsList 才是真正的记录关系用的
           * 
           * attrsMap 最终结果：
           * :data-a: "sdfasdf"
           * v-on:class: "tt"
           * value: "999"
           */
          attrsMap: makeAttrsMap(attrs),
          parent: currentParent, // 上文的父节点，会在迭代中不停的赋值
          children: [],
        };

        if (ns) {
          element.ns = ns;
        }
        // 理论上 isForbiddenTag 永远为 false，因为上文已经分流了这个情况
        if ("client" !== "server" && isForbiddenTag(element)) {
          element.forbidden = true;
          "development" !== "production" &&
            warn$1(
              "Templates should only be responsible for mapping the state to the " +
                "UI. Avoid placing tags with side-effects in your templates, such as " +
                "<" +
                tag +
                ">."
            );
        }

        // apply pre-transforms
        // 默认 []，不需要关心
        for (var i = 0; i < preTransforms.length; i++) {
          preTransforms[i](element, options);
        }
        
        // inVPre 是上文的变量，用来判断是否在 v-pre 指令里
        if (!inVPre) {
          /**
           * processPre 会尝试获取并删除 attrList 中的 v-pre
           * 然后为 element 尝试添加 pre 属性
           * 这个 end 里会有时机重置为 false
           */
          processPre(element); 
          if (element.pre) {
            inVPre = true;
          }
        }

        if (platformIsPreTag(element.tag)) {
          // 是否在 pre 标签中，在 end 里，会重置成 false
          inPre = true;
        }

        if (inVPre) {
          // 如果 v-pre 设置 attr，不做任何指令、动态内容的翻译
          processRawAttrs(element);
        } else {
          /**
           * 处理指令和 attr 动态内容，不会具体求值
           * 下面几个函数，然后取 attrsList 中特定的值，然后挂在 element.for="data" 这样的形式挂载
           * 然后从 attrsList 中删除
           */ 
          processFor(element); // element 会挂上 for、alias、iterator1、iterator2
          processIf(element); // element 会挂上 if、else，(v-else-if 是 2.1.0 之后新增的)
          processOnce(element); // element 会挂上 once
          processKey(element); // element 会挂上 key

          /**
           * determine whether this is a plain element after
           * removing structural attributes
           * 没有 key 和 没有 attrs length 设置成 plain
           * plain 的意思是 `<div>sdf</div>` 这种干净的标签
           * 这里判断了 key，是否下文有某种方式会增加这个 key，不然就不用关心了
           */
          element.plain = !element.key && !attrs.length;

          processRef(element); // element 会挂上 ref、refInFor
          // slot 已经被废弃了 v2.6.0
          processSlot(element); // element 会挂上 slotName、slotTarget 

          /**
           * is api
           * https://vue3js.cn/docs/zh/api/special-attributes.html#is
           * component 对应的是 is api
           * inlineTemplate 这个看 vue3 已经移除了，不需要多关心了
           */
          processComponent(element); // element 会挂上 component、inlineTemplate

          // 默认 [] 不需要关心
          for (var i$1 = 0; i$1 < transforms.length; i$1++) {
            transforms[i$1](element, options);
          }
          processAttrs(element);
        }

        // slot、template、v-for 是不符合作为 root 节点的情况的
        function checkRootConstraints(el) {
          {
            if (el.tag === "slot" || el.tag === "template") {
              warn$1(
                "Cannot use <" +
                  el.tag +
                  "> as component root element because it may " +
                  "contain multiple nodes:\n" +
                  template
              );
            }
            if (el.attrsMap.hasOwnProperty("v-for")) {
              warn$1(
                "Cannot use v-for on stateful component root element because " +
                  "it renders multiple elements:\n" +
                  template
              );
            }
          }
        }

        /**
         * tree management
         */
        if (!root) {
          // 第一次才会进到这里
          root = element;
          checkRootConstraints(root); // 检查节点是否能做根节点
        } else if ("development" !== "production" && !stack.length && !warned) {
          /**
           * 开发环境才会进这里，不用太多关注，这段就不看了吧
           */ 
          if (
            root.attrsMap.hasOwnProperty("v-if") &&
            element.attrsMap.hasOwnProperty("v-else")
          ) {
            checkRootConstraints(element);
          } else {
            warned = true;
            warn$1(
              "Component template should contain exactly one root element:\n\n" +
                template
            );
          }
        }

        // root 节点不会进这里，之后的节点处理才会，forbidden 不需要关心
        if (currentParent && !element.forbidden) {
          if (element.else) {
            /**
             * 处理 else 强烈建议戳开看下
             * 往平级 if 元素，前一项上挂这个 elseBlock 属性，让处理 if 的模块处理
             */ 
            processElse(element, currentParent);
          } else {
            // 把当前节点往 parent 的 children 里推
            currentParent.children.push(element);
            // 确认当前节点的父子关系
            element.parent = currentParent;
          }
        }
        
        /**
         * 这里要看明白、想清楚：
         * 1. 因为这个方法是在处理 start 标签
         * 2. 处理完它，极有可能要去处理它下面的子元素，所以这里要赋值
         * 3. stack 目前看起来是一个【平行】的【数组】接口，记录元素节点，他们之前的逻辑关系是 element 上自己的信息记录的
         */ 
        if (!unary) {
          currentParent = element;
          stack.push(element);
        }
        // apply post-transforms
        // 默认 []， 不需要关心
        for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
          postTransforms[i$2](element, options);
        }
      },

      end: function end() {
        // 这个函数会 trailing whitespace，然后指定好 currentParent、inVPre、pre 给下个 while 用
        // remove trailing whitespace
        var element = stack[stack.length - 1];
        /**
         * 这里可以想一下，这个 stack
         * 首先它是按照顺序入栈的，第一个节点记录了全量节点，最后一个记录的是最小的节点
         * 所以这里取的是 lastNode
         */
        var lastNode = element.children[element.children.length - 1];
        /**
         * vue 后期版本里改成了：lastNode && lastNode.type === 3 && lastNode.text === " " && !inPre
         */
        if (lastNode && lastNode.type === 3 && lastNode.text === " ") {
          element.children.pop();
          /**
           * 如果是空字符串，从最后一个节点的 children 删了，我理解整个 stack 是引用的关系，会全删除
           */
        }

        /**
         * pop stack
         */
        stack.length -= 1;
        currentParent = stack[stack.length - 1];
        // check pre state
        if (element.pre) {
          inVPre = false;
        }
        // inPre
        if (platformIsPreTag(element.tag)) {
          inPre = false;
        }
      },

      // 处理文本类型，包括 {{  }} 表达式的情况
      chars: function chars(text) {
        if (!currentParent) {
          // 其实是 start 里的逻辑 currentParent，这个抛错正常，很容易理解
          if ("development" !== "production" && !warned) {
            warned = true;
            warn$1(
              "Component template should contain exactly one root element:\n\n" +
                template
            );
          }
          return;
        }

        text =
          /**
           * 使用 decodeHTML 方法中的 innerHTML = html; 然后 decoder.textContent 取值出来：
           * 主要是为了处理文本节点，转义问题: "&lt;b&gt;asdfasdf &lt;&#47;b&gt;" -> "<b>asdfasdf </b>"
           */
          inPre || text.trim() // 这个判断，除非传入的是 '    '、' '这种情况，其他都会走
            ? decodeHTMLCached(text) // decodeHTMLCached 底层是全文的缓存方法
            : /**
             * only preserve whitespace if its not right after a starting tag
             * 展开说一下，能走到这里说明：
             * 1. 一定是多个空白符被 trim
             * 2. html 中单个空白符是有排版意义的，所以 preserveWhitespace 默认是 true
             * 3. 最左边没有兄弟节点的空白符没有意义
             * 不得不说，这个 while 循环（我的意思是 currentParent 在上文 push 了 children）很厉害，最左边兄弟节点的情况很自然就考虑进去了
             */
            preserveWhitespace && currentParent.children.length
            ? " "
            : "";

        if (text) {
          // 如果是 '' 就不添加子节点
          var expression;
          // inVPre 是 v-pre 指令，不用编译，直接显示文本
          if (
            !inVPre &&
            text !== " " &&
            /**
             * 这个判断，是处理 ' 空格或者文本  {{  }}' 表达式用的
             * type 应该暂定为 2，赋值 expression，之后具体处理的时候会变成文本节点
             */
            (expression = parseText(text, delimiters))
          ) {
            currentParent.children.push({
              type: 2,
              expression: expression,
              text: text,
            });
          } else {
            // 大部分情况会走到这里，确认这个文本节点的推入
            currentParent.children.push({
              type: 3,
              text: text,
            });
          }
        }
      },
    });
    /**
     * 这个是在 parseHTML 中修改，并返回的，这个回头 TODO 一下
     * 摘录出数据结构
     */
    return root;
  }

  function processPre(el) {
    /**
     * v-pre，主要是为了这个指令，跳过 {{ }}、指令的翻译，直接渲染
     * https://v3.vuejs.org/api/directives.html#v-pre
     */
    // 这个里面删除 attr，设置 pre 都是在改 el 的引用
    if (getAndRemoveAttr(el, "v-pre") != null) {
      el.pre = true;
    }
  }

  function processRawAttrs(el) {
    var l = el.attrsList.length;
    if (l) {
      /**
       * 直接改原引用的 attr，而且不会做任何属性值的翻译
       * 主要场景用在 v-pre 中
       */
      var attrs = (el.attrs = new Array(l));
      for (var i = 0; i < l; i++) {
        // 直接给 element 的 attrs 进行赋值了
        attrs[i] = {
          name: el.attrsList[i].name,
          value: JSON.stringify(el.attrsList[i].value),
        };
      }
    } else if (!el.pre) { // el.pre 是判断是否在 v-pre 指令里面
      /**
       * non root node in pre blocks with no attributes
       */
      el.plain = true; // 这个感觉不会到这里来？？？应该也不用怎么关心
    }
  }

  function processKey(el) {
    // 获取并且删除 attrsList 中的值 bind 的值
    var exp = getBindingAttr(el, "key");
    if (exp) {
      if ("development" !== "production" && el.tag === "template") {
        warn$1(
          "<template> cannot be keyed. Place the key on real elements instead."
        );
      }
      el.key = exp;
    }
  }

  function processRef(el) {
    var ref = getBindingAttr(el, "ref");
    if (ref) {
      el.ref = ref;
      // 布尔值，字面意思，具体戳进去看
      el.refInFor = checkInFor(el);
    }
  }

  function processFor(el) {
    var exp;
    if ((exp = getAndRemoveAttr(el, "v-for"))) {
      //  /(.*)\s+(?:in|of)\s+(.*)/ 是判断 in of
      var inMatch = exp.match(forAliasRE);
      /**
       * inMatch大概长这样：
       * 0: "item in [1]"
       * 1: "item"
       * 2: "[1]"
       */
      if (!inMatch) { // 没匹配到就是无效表达式
        "development" !== "production" &&
          warn$1("Invalid v-for expression: " + exp);
        return;
      }
      el.for = inMatch[2].trim(); // 迭代的对象是谁
      var alias = inMatch[1].trim(); // in/of 迭代中的形参是什么

      /**
       * 大概匹配到的长这样：
       * /\(([^,]*),([^,]*)(?:,([^,]*))?\)/
       * 最后的输出是：
       * 0: "(item, index)"
       * 1: "item"
       * 2: " index"
       * 主要是针对有 item, index 的情况下重新定一下两个形参
       */
      var iteratorMatch = alias.match(forIteratorRE);
      
      if (iteratorMatch) {
        el.alias = iteratorMatch[1].trim();
        el.iterator1 = iteratorMatch[2].trim(); // 下标
        if (iteratorMatch[3]) {
          // 这个的意思是，其实这个 v-for 是想组成一个 (item, index, list) 的形式，第三个参数表示 list
          // 只是用的比较少
          el.iterator2 = iteratorMatch[3].trim();
        }
      } else {
        el.alias = alias;
      }
    }
    // 最终 element 会挂上 for、alias、iterator1、iterator2
  }

  function processIf(el) {
    // v-else-if 是 2.1.0 添加的
    var exp = getAndRemoveAttr(el, "v-if");
    if (exp) {
      el.if = exp;
    }
    if (getAndRemoveAttr(el, "v-else") != null) {
      el.else = true;
    }
  }

  function processElse(el, parent) {
    /**
     * findPrevElement 找当前 parent 的 children 了 length - 1 项
     * 解释了为什么 v-if 和 v-else 要放在一起，而且是仅仅相连的
     */
    var prev = findPrevElement(parent.children);
    if (prev && prev.if) { // 往前一项上挂这个 elseBlock 属性，让处理 if 的模块处理
      prev.elseBlock = el;
    } else {
      warn$1(
        "v-else used on element <" + el.tag + "> without corresponding v-if."
      );
    }
  }

  function processOnce(el) {
    var once = getAndRemoveAttr(el, "v-once");
    if (once != null) {
      el.once = true;
    }
  }

  function processSlot(el) {
    if (el.tag === "slot") {
      el.slotName = getBindingAttr(el, "name");
    } else {
      var slotTarget = getBindingAttr(el, "slot");
      if (slotTarget) {
        el.slotTarget = slotTarget;
      }
    }
  }

  function processComponent(el) {
    var binding;
    if ((binding = getBindingAttr(el, "is"))) {
      el.component = binding;
    }
    if (getAndRemoveAttr(el, "inline-template") != null) {
      el.inlineTemplate = true;
    }
  }

  /**
   * 除了下列这些属性：
   * for、alias、iterator1、iterator2、if、else、once、key、plain、ref、refInFor、slotName、slotTarget
   * 其他属性会进这个函数来绑定
   */
  function processAttrs(el) {
    var list = el.attrsList;
    var i, l, name, value, arg, modifiers, isProp;
    for (i = 0, l = list.length; i < l; i++) {
      name = list[i].name;
      value = list[i].value;
      /**
       * /^v-|^@|^:/;
       * 这里是说，是否是动态的属性值
       * v- 自定义指令
       * @事件 自定义指令
       * : 绑定简写
       */
      if (dirRE.test(name)) {
        /**
         * mark element as dynamic
         * 整个元素有除了 for、alias、iterator1、iterator2、if、else、once、key、plain、ref、refInFor、slotName、slotTarget 之外的动态绑定值
         */ 
        el.hasBindings = true; 
        /**
         * modifiers
         * /\.[^\.]+/g;
         * 大部分情况是为了【事件处理装饰符】
         * 比较重要的属性装饰器 sync 装饰符是 v2.3.0 新增的
         * 重新调整名称，并且缓存下装饰符，具体可以看下 parseModifiers
         * 建议看下装饰器，还是有蛮多的：https://cn.vuejs.org/v2/api/#v-bind
         */
        modifiers = parseModifiers(name); // { stop: true } 返回的是这样的结果，如果是属性，则会返回 { stop: true, prop: true }
        if (modifiers) {
          name = name.replace(modifierRE, ""); // 调整名字为：v-on:click
        }
        if (bindRE.test(name)) {
          /**
           * v-bind 和 : 的情况
           * v-bind:nameDemo="value" 处理这种情况，重新定义 name 为 nameDemo
           */ 
          name = name.replace(bindRE, "");
          // 2.0.0 基本上没什么属性的 modifiers，都是事件，找到这几个 .prop、.camel、.sync、.lazy 有些是 v2.0.0 之后版本加的
          // 例子：<input type="text" v-model.lazy="value">
          if (modifiers && modifiers.prop) {
            isProp = true;
            name = camelize(name);
            // 这个我找遍所有文档，都没找到这个修饰符，应该不要关注
            if (name === "innerHtml") {
              name = "innerHTML";
            }
          }
          /**
           * 绑定的值是属性或者是 "value, selected, checked, muted" 其中之一
           * 往 props 和 attr 里推是不一样的
           */ 
          if (isProp || platformMustUseProp(name)) {
            // 往 el的 props 里推
            addProp(el, name, value);
          } else {
            // 往 el 的 attrs 属性里推
            addAttr(el, name, value);
          }
        } else if (onRE.test(name)) {
          // v-on 和 @ 的情况，建议戳到 addHandler 看一下，很多细节处理
          name = name.replace(onRE, "");
          addHandler(el, name, value, modifiers);
        } else {
          /**
           * normal directives，处理 v- 指令的情况
           * v-html、v-model、v-show 等等
           */ 
          name = name.replace(dirRE, "");
          // parse arg
          var argMatch = name.match(argRE);
          if (argMatch && (arg = argMatch[1])) {
            name = name.slice(0, -(arg.length + 1));
          }
          /**
           * 此处往 el 上继续挂 directives
           * 处理指令的模块会做后续处理
           * 可以戳看看一下这个指令，是个数组，一个 el 可以挂多个指令
           */
          addDirective(el, name, value, arg, modifiers);
        }
      } else {
        // literal attribute
        // 不符合标准的属性，直接跑错，不需要关注
        {
          var expression = parseText(value, delimiters);
          if (expression) {
            warn$1(
              name +
                '="' +
                value +
                '": ' +
                "Interpolation inside attributes has been deprecated. " +
                "Use v-bind or the colon shorthand instead."
            );
          }
        }
        addAttr(el, name, JSON.stringify(value));
      }
    }
  }

  /**
   * 应该是找遍全节点？？？
   * 看有没有被 for 循环？？？
   * 应该不是这样的 el parent 的设置应该是有 scope 的
   */ 
  function checkInFor(el) {
    var parent = el;
    while (parent) {
      if (parent.for !== undefined) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  function parseModifiers(name) {
    var match = name.match(modifierRE);
    if (match) {
      var ret = {};
      match.forEach(function (m) {
        ret[m.slice(1)] = true;
      });
      return ret;
    }
  }

  function makeAttrsMap(attrs) {
    /**
     * 入参
     * 0: {name: ":data-a", value: "sdfasdf"}
     * 1: {name: "v-on:class", value: "tt"}
     * 2: {name: "value", value: "999"}
     */
    var map = {};
    for (var i = 0, l = attrs.length; i < l; i++) {
      if ("development" !== "production" && map[attrs[i].name]) {
        warn$1("duplicate attribute: " + attrs[i].name);
      }
      map[attrs[i].name] = attrs[i].value;
    }
    /**
     * 出参
     * :data-a: "sdfasdf"
     * v-on:class: "tt"
     * value: "999"
     */
    return map;
  }

  function findPrevElement(children) {
    var i = children.length;
    while (i--) {
      if (children[i].tag) {
        return children[i];
      }
    }
  }

  function isForbiddenTag(el) {
    return (
      el.tag === "style" ||
      (el.tag === "script" &&
        (!el.attrsMap.type || el.attrsMap.type === "text/javascript"))
    );
  }

  var ieNSBug = /^xmlns:NS\d+/;
  var ieNSPrefix = /^NS\d+:/;

  /* istanbul ignore next */
  function guardIESVGBug(attrs) {
    var res = [];
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (!ieNSBug.test(attr.name)) {
        attr.name = attr.name.replace(ieNSPrefix, "");
        res.push(attr);
      }
    }
    return res;
  }

  /*  */

  var isStaticKey;
  var isPlatformReservedTag;

  var genStaticKeysCached = cached(genStaticKeys$1);

  /**
   * Goal of the optimizier: walk the generated template AST tree
   * and detect sub-trees that are purely static, i.e. parts of
   * the DOM that never needs to change.
   *
   * Once we detect these sub-trees, we can:
   *
   * 1. Hoist them into constants, so that we no longer need to
   *    create fresh nodes for them on each re-render;
   * 2. Completely skip them in the patching process.
   */
  function optimize(root, options) {
    if (!root) {
      return;
    }
    isStaticKey = genStaticKeysCached(options.staticKeys || "");
    isPlatformReservedTag =
      options.isReservedTag ||
      function () {
        return false;
      };
    // first pass: mark all non-static nodes.
    markStatic(root);
    // second pass: mark static roots.
    markStaticRoots(root, false);
  }

  function genStaticKeys$1(keys) {
    return makeMap(
      "type,tag,attrsList,attrsMap,plain,parent,children,attrs" +
        (keys ? "," + keys : "")
    );
  }

  function markStatic(node) {
    node.static = isStatic(node);
    if (node.type === 1) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        var child = node.children[i];
        markStatic(child);
        if (!child.static) {
          node.static = false;
        }
      }
    }
  }

  function markStaticRoots(node, isInFor) {
    if (node.type === 1) {
      if (node.once || node.static) {
        node.staticRoot = true;
        node.staticInFor = isInFor;
        return;
      }
      if (node.children) {
        for (var i = 0, l = node.children.length; i < l; i++) {
          markStaticRoots(node.children[i], !!node.for);
        }
      }
    }
  }

  function isStatic(node) {
    if (node.type === 2) {
      // expression
      return false;
    }
    if (node.type === 3) {
      // text
      return true;
    }
    return !!(
      node.pre ||
      (!node.hasBindings && // no dynamic bindings
        !node.if &&
        !node.for && // not v-if or v-for or v-else
        !isBuiltInTag(node.tag) && // not a built-in
        isPlatformReservedTag(node.tag) && // not a component
        Object.keys(node).every(isStaticKey))
    );
  }

  /*  */

  var simplePathRE =
    /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;

  // keyCode aliases
  var keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    delete: [8, 46],
  };

  var modifierCode = {
    stop: "$event.stopPropagation();",
    prevent: "$event.preventDefault();",
    self: "if($event.target !== $event.currentTarget)return;",
  };

  function genHandlers(events, native) {
    var res = native ? "nativeOn:{" : "on:{";
    for (var name in events) {
      res += '"' + name + '":' + genHandler(events[name]) + ",";
    }
    return res.slice(0, -1) + "}";
  }

  function genHandler(handler) {
    if (!handler) {
      return "function(){}";
    } else if (Array.isArray(handler)) {
      return "[" + handler.map(genHandler).join(",") + "]";
    } else if (!handler.modifiers) {
      return simplePathRE.test(handler.value)
        ? handler.value
        : "function($event){" + handler.value + "}";
    } else {
      var code = "";
      var keys = [];
      for (var key in handler.modifiers) {
        if (modifierCode[key]) {
          code += modifierCode[key];
        } else {
          keys.push(key);
        }
      }
      if (keys.length) {
        code = genKeyFilter(keys) + code;
      }
      var handlerCode = simplePathRE.test(handler.value)
        ? handler.value + "($event)"
        : handler.value;
      return "function($event){" + code + handlerCode + "}";
    }
  }

  function genKeyFilter(keys) {
    var code =
      keys.length === 1
        ? normalizeKeyCode(keys[0])
        : Array.prototype.concat.apply([], keys.map(normalizeKeyCode));
    if (Array.isArray(code)) {
      return (
        "if(" +
        code
          .map(function (c) {
            return "$event.keyCode!==" + c;
          })
          .join("&&") +
        ")return;"
      );
    } else {
      return "if($event.keyCode!==" + code + ")return;";
    }
  }

  function normalizeKeyCode(key) {
    return (
      parseInt(key, 10) || // number keyCode
      keyCodes[key] || // built-in alias
      "_k(" + JSON.stringify(key) + ")" // custom alias
    );
  }

  /*  */

  function bind$2(el, dir) {
    el.wrapData = function (code) {
      return (
        "_b(" +
        code +
        "," +
        dir.value +
        (dir.modifiers && dir.modifiers.prop ? ",true" : "") +
        ")"
      );
    };
  }

  var baseDirectives = {
    bind: bind$2,
    cloak: noop,
  };

  /*  */

  // configurable state
  var warn$2;
  var transforms$1;
  var dataGenFns;
  var platformDirectives$1;
  var staticRenderFns;
  var currentOptions;

  function generate(ast, options) {
    // save previous staticRenderFns so generate calls can be nested
    var prevStaticRenderFns = staticRenderFns;
    var currentStaticRenderFns = (staticRenderFns = []);
    currentOptions = options;
    warn$2 = options.warn || baseWarn;
    transforms$1 = pluckModuleFunction(options.modules, "transformCode");
    dataGenFns = pluckModuleFunction(options.modules, "genData");
    platformDirectives$1 = options.directives || {};
    var code = ast ? genElement(ast) : '_h("div")';
    staticRenderFns = prevStaticRenderFns;
    return {
      render: "with(this){return " + code + "}",
      staticRenderFns: currentStaticRenderFns,
    };
  }

  function genElement(el) {
    if (el.staticRoot && !el.staticProcessed) {
      // hoist static sub-trees out
      el.staticProcessed = true;
      staticRenderFns.push("with(this){return " + genElement(el) + "}");
      return (
        "_m(" +
        (staticRenderFns.length - 1) +
        (el.staticInFor ? ",true" : "") +
        ")"
      );
    } else if (el.for && !el.forProcessed) {
      return genFor(el);
    } else if (el.if && !el.ifProcessed) {
      return genIf(el);
    } else if (el.tag === "template" && !el.slotTarget) {
      return genChildren(el) || "void 0";
    } else if (el.tag === "slot") {
      return genSlot(el);
    } else {
      // component or element
      var code;
      if (el.component) {
        code = genComponent(el);
      } else {
        var data = genData(el);
        var children = el.inlineTemplate ? null : genChildren(el);
        code =
          "_h('" +
          el.tag +
          "'" +
          (data ? "," + data : "") +
          (children ? "," + children : "") +
          ")";
      }
      // module transforms
      for (var i = 0; i < transforms$1.length; i++) {
        code = transforms$1[i](el, code);
      }
      return code;
    }
  }

  function genIf(el) {
    var exp = el.if;
    el.ifProcessed = true; // avoid recursion
    return "(" + exp + ")?" + genElement(el) + ":" + genElse(el);
  }

  function genElse(el) {
    return el.elseBlock ? genElement(el.elseBlock) : "_e()";
  }

  function genFor(el) {
    var exp = el.for;
    var alias = el.alias;
    var iterator1 = el.iterator1 ? "," + el.iterator1 : "";
    var iterator2 = el.iterator2 ? "," + el.iterator2 : "";
    el.forProcessed = true; // avoid recursion
    return (
      "_l((" +
      exp +
      ")," +
      "function(" +
      alias +
      iterator1 +
      iterator2 +
      "){" +
      "return " +
      genElement(el) +
      "})"
    );
  }

  function genData(el) {
    if (el.plain) {
      return;
    }

    var data = "{";

    // directives first.
    // directives may mutate the el's other properties before they are generated.
    var dirs = genDirectives(el);
    if (dirs) {
      data += dirs + ",";
    }

    // key
    if (el.key) {
      data += "key:" + el.key + ",";
    }
    // ref
    if (el.ref) {
      data += "ref:" + el.ref + ",";
    }
    if (el.refInFor) {
      data += "refInFor:true,";
    }
    // record original tag name for components using "is" attribute
    if (el.component) {
      data += 'tag:"' + el.tag + '",';
    }
    // slot target
    if (el.slotTarget) {
      data += "slot:" + el.slotTarget + ",";
    }
    // module data generation functions
    for (var i = 0; i < dataGenFns.length; i++) {
      data += dataGenFns[i](el);
    }
    // attributes
    if (el.attrs) {
      data += "attrs:{" + genProps(el.attrs) + "},";
    }
    // DOM props
    if (el.props) {
      data += "domProps:{" + genProps(el.props) + "},";
    }
    // event handlers
    if (el.events) {
      data += genHandlers(el.events) + ",";
    }
    if (el.nativeEvents) {
      data += genHandlers(el.nativeEvents, true) + ",";
    }
    // inline-template
    if (el.inlineTemplate) {
      var ast = el.children[0];
      if (
        "development" !== "production" &&
        (el.children.length > 1 || ast.type !== 1)
      ) {
        warn$2(
          "Inline-template components must have exactly one child element."
        );
      }
      if (ast.type === 1) {
        var inlineRenderFns = generate(ast, currentOptions);
        data +=
          "inlineTemplate:{render:function(){" +
          inlineRenderFns.render +
          "},staticRenderFns:[" +
          inlineRenderFns.staticRenderFns
            .map(function (code) {
              return "function(){" + code + "}";
            })
            .join(",") +
          "]}";
      }
    }
    data = data.replace(/,$/, "") + "}";
    // v-bind data wrap
    if (el.wrapData) {
      data = el.wrapData(data);
    }
    return data;
  }

  function genDirectives(el) {
    var dirs = el.directives;
    if (!dirs) {
      return;
    }
    var res = "directives:[";
    var hasRuntime = false;
    var i, l, dir, needRuntime;
    for (i = 0, l = dirs.length; i < l; i++) {
      dir = dirs[i];
      needRuntime = true;
      var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
      if (gen) {
        // compile-time directive that manipulates AST.
        // returns true if it also needs a runtime counterpart.
        needRuntime = !!gen(el, dir, warn$2);
      }
      if (needRuntime) {
        hasRuntime = true;
        res +=
          '{name:"' +
          dir.name +
          '"' +
          (dir.value
            ? ",value:(" +
              dir.value +
              "),expression:" +
              JSON.stringify(dir.value)
            : "") +
          (dir.arg ? ',arg:"' + dir.arg + '"' : "") +
          (dir.modifiers ? ",modifiers:" + JSON.stringify(dir.modifiers) : "") +
          "},";
      }
    }
    if (hasRuntime) {
      return res.slice(0, -1) + "]";
    }
  }

  function genChildren(el) {
    if (el.children.length) {
      return "[" + el.children.map(genNode).join(",") + "]";
    }
  }

  function genNode(node) {
    if (node.type === 1) {
      return genElement(node);
    } else {
      return genText(node);
    }
  }

  function genText(text) {
    return text.type === 2
      ? text.expression // no need for () because already wrapped in _s()
      : JSON.stringify(text.text);
  }

  function genSlot(el) {
    var slotName = el.slotName || '"default"';
    var children = genChildren(el);
    return children
      ? "_t(" + slotName + "," + children + ")"
      : "_t(" + slotName + ")";
  }

  function genComponent(el) {
    var children = genChildren(el);
    return (
      "_h(" +
      el.component +
      "," +
      genData(el) +
      (children ? "," + children : "") +
      ")"
    );
  }

  function genProps(props) {
    var res = "";
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      res += '"' + prop.name + '":' + prop.value + ",";
    }
    return res.slice(0, -1);
  }

  /*  */

  /**
   * Compile a template.
   */
  function compile$1(template, options) {
    var ast = parse(template.trim(), options); // parse 方法中的 parseHTML 是非常重要的方法
    optimize(ast, options);
    var code = generate(ast, options);
    return {
      ast: ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns,
    };
  }

  /*  */

  // operators like typeof, instanceof and in are allowed
  var prohibitedKeywordRE = new RegExp(
    "\\b" +
      (
        "do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const," +
        "super,throw,while,yield,delete,export,import,return,switch,default," +
        "extends,finally,continue,debugger,function,arguments"
      )
        .split(",")
        .join("\\b|\\b") +
      "\\b"
  );
  // check valid identifier for v-for
  var identRE = /[A-Za-z_$][\w$]*/;
  // strip strings in expressions
  var stripStringRE =
    /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

  // detect problematic expressions in a template
  function detectErrors(ast) {
    var errors = [];
    if (ast) {
      checkNode(ast, errors);
    }
    return errors;
  }

  function checkNode(node, errors) {
    if (node.type === 1) {
      for (var name in node.attrsMap) {
        if (dirRE.test(name)) {
          var value = node.attrsMap[name];
          if (value) {
            if (name === "v-for") {
              checkFor(node, 'v-for="' + value + '"', errors);
            } else {
              checkExpression(value, name + '="' + value + '"', errors);
            }
          }
        }
      }
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          checkNode(node.children[i], errors);
        }
      }
    } else if (node.type === 2) {
      checkExpression(node.expression, node.text, errors);
    }
  }

  function checkFor(node, text, errors) {
    checkExpression(node.for || "", text, errors);
    checkIdentifier(node.alias, "v-for alias", text, errors);
    checkIdentifier(node.iterator1, "v-for iterator", text, errors);
    checkIdentifier(node.iterator2, "v-for iterator", text, errors);
  }

  function checkIdentifier(ident, type, text, errors) {
    if (typeof ident === "string" && !identRE.test(ident)) {
      errors.push(
        "- invalid " + type + ' "' + ident + '" in expression: ' + text
      );
    }
  }

  function checkExpression(exp, text, errors) {
    try {
      new Function("return " + exp);
    } catch (e) {
      var keywordMatch = exp
        .replace(stripStringRE, "")
        .match(prohibitedKeywordRE);
      if (keywordMatch) {
        errors.push(
          "- avoid using JavaScript keyword as property name: " +
            '"' +
            keywordMatch[0] +
            '" in expression ' +
            text
        );
      } else {
        errors.push("- invalid expression: " + text);
      }
    }
  }

  /*  */

  function transformNode(el, options) {
    var warn = options.warn || baseWarn;
    /**
     * 尝试处理 class，给 el 挂上 staticClass、classBinding
     * 1. class 这种就认为是 static，直接赋值
     * 2. :class、v-on:class 这种用下文的动态绑定方法绑定
     */
    var staticClass = getAndRemoveAttr(el, "class");
    if ("development" !== "production" && staticClass) {
      var expression = parseText(staticClass, options.delimiters);
      if (expression) {
        warn(
          'class="' +
            staticClass +
            '": ' +
            "Interpolation inside attributes has been deprecated. " +
            "Use v-bind or the colon shorthand instead."
        );
      }
    }
    if (staticClass) {
      el.staticClass = JSON.stringify(staticClass);
    }
    var classBinding = getBindingAttr(el, "class", false /* getStatic */);
    if (classBinding) {
      el.classBinding = classBinding;
    }
  }

  function genData$1(el) {
    // 去处理后的 class 的值
    var data = "";
    if (el.staticClass) {
      data += "staticClass:" + el.staticClass + ",";
    }
    if (el.classBinding) {
      data += "class:" + el.classBinding + ",";
    }
    return data;
  }

  var klass$1 = {
    staticKeys: ["staticClass"],
    transformNode: transformNode,
    genData: genData$1,
  };

  /*  */

  function transformNode$1(el) {
    // 尝试给 el 挂上 styleBinding
    var styleBinding = getBindingAttr(el, "style", false /* getStatic */);
    if (styleBinding) {
      el.styleBinding = styleBinding;
    }
  }

  function genData$2(el) {
    // 尝试拿 el.styleBinding 并且返回特殊的 value 格式：'style("value"),'
    return el.styleBinding ? "style:(" + el.styleBinding + ")," : "";
  }

  var style$1 = {
    transformNode: transformNode$1,
    genData: genData$2,
  };

  var modules$1 = [klass$1, style$1];

  /*  */

  var warn$3;

  function model$1(el, dir, _warn) {
    warn$3 = _warn;
    var value = dir.value;
    var modifiers = dir.modifiers;
    var tag = el.tag;
    var type = el.attrsMap.type;
    if (tag === "select") {
      return genSelect(el, value);
    } else if (tag === "input" && type === "checkbox") {
      genCheckboxModel(el, value);
    } else if (tag === "input" && type === "radio") {
      genRadioModel(el, value);
    } else {
      return genDefaultModel(el, value, modifiers);
    }
  }

  function genCheckboxModel(el, value) {
    if ("development" !== "production" && el.attrsMap.checked != null) {
      warn$3(
        "<" +
          el.tag +
          ' v-model="' +
          value +
          '" checked>:\n' +
          "inline checked attributes will be ignored when using v-model. " +
          "Declare initial values in the component's data option instead."
      );
    }
    var valueBinding = getBindingAttr(el, "value") || "null";
    var trueValueBinding = getBindingAttr(el, "true-value") || "true";
    var falseValueBinding = getBindingAttr(el, "false-value") || "false";
    addProp(
      el,
      "checked",
      "Array.isArray(" +
        value +
        ")" +
        "?_i(" +
        value +
        "," +
        valueBinding +
        ")>-1" +
        ":_q(" +
        value +
        "," +
        trueValueBinding +
        ")"
    );
    addHandler(
      el,
      "change",
      "var $$a=" +
        value +
        "," +
        "$$el=$event.target," +
        "$$c=$$el.checked?(" +
        trueValueBinding +
        "):(" +
        falseValueBinding +
        ");" +
        "if(Array.isArray($$a)){" +
        "var $$v=" +
        valueBinding +
        "," +
        "$$i=_i($$a,$$v);" +
        "if($$c){$$i<0&&(" +
        value +
        "=$$a.concat($$v))}" +
        "else{$$i>-1&&(" +
        value +
        "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
        "}else{" +
        value +
        "=$$c}",
      null,
      true
    );
  }

  function genRadioModel(el, value) {
    if ("development" !== "production" && el.attrsMap.checked != null) {
      warn$3(
        "<" +
          el.tag +
          ' v-model="' +
          value +
          '" checked>:\n' +
          "inline checked attributes will be ignored when using v-model. " +
          "Declare initial values in the component's data option instead."
      );
    }
    var valueBinding = getBindingAttr(el, "value") || "null";
    addProp(el, "checked", "_q(" + value + "," + valueBinding + ")");
    addHandler(el, "change", value + "=" + valueBinding, null, true);
  }

  function genDefaultModel(el, value, modifiers) {
    {
      if (el.tag === "input" && el.attrsMap.value) {
        warn$3(
          "<" +
            el.tag +
            ' v-model="' +
            value +
            '" value="' +
            el.attrsMap.value +
            '">:\n' +
            "inline value attributes will be ignored when using v-model. " +
            "Declare initial values in the component's data option instead."
        );
      }
      if (el.tag === "textarea" && el.children.length) {
        warn$3(
          '<textarea v-model="' +
            value +
            '">:\n' +
            "inline content inside <textarea> will be ignored when using v-model. " +
            "Declare initial values in the component's data option instead."
        );
      }
    }

    var type = el.attrsMap.type;
    var ref = modifiers || {};
    var lazy = ref.lazy;
    var number = ref.number;
    var trim = ref.trim;
    var event = lazy || (isIE && type === "range") ? "change" : "input";
    var needCompositionGuard = !lazy && type !== "range";
    var isNative = el.tag === "input" || el.tag === "textarea";

    var valueExpression = isNative
      ? "$event.target.value" + (trim ? ".trim()" : "")
      : "$event";
    var code =
      number || type === "number"
        ? value + "=_n(" + valueExpression + ")"
        : value + "=" + valueExpression;
    if (isNative && needCompositionGuard) {
      code = "if($event.target.composing)return;" + code;
    }
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if ("development" !== "production" && type === "file") {
      warn$3(
        "<" +
          el.tag +
          ' v-model="' +
          value +
          '" type="file">:\n' +
          "File inputs are read only. Use a v-on:change listener instead."
      );
    }
    addProp(el, "value", isNative ? "_s(" + value + ")" : "(" + value + ")");
    addHandler(el, event, code, null, true);
    if (needCompositionGuard) {
      // need runtime directive code to help with composition events
      return true;
    }
  }

  function genSelect(el, value) {
    {
      el.children.some(checkOptionWarning);
    }
    var code =
      value +
      "=Array.prototype.filter" +
      ".call($event.target.options,function(o){return o.selected})" +
      '.map(function(o){return "_value" in o ? o._value : o.value})' +
      (el.attrsMap.multiple == null ? "[0]" : "");
    addHandler(el, "change", code, null, true);
    // need runtime to help with possible dynamically generated options
    return true;
  }

  function checkOptionWarning(option) {
    if (
      option.type === 1 &&
      option.tag === "option" &&
      option.attrsMap.selected != null
    ) {
      warn$3(
        '<select v-model="' +
          option.parent.attrsMap["v-model"] +
          '">:\n' +
          "inline selected attributes on <option> will be ignored when using v-model. " +
          "Declare initial values in the component's data option instead."
      );
      return true;
    }
    return false;
  }

  /*  */

  function text(el, dir) {
    if (dir.value) {
      addProp(el, "textContent", "_s(" + dir.value + ")");
    }
  }

  /*  */

  function html(el, dir) {
    if (dir.value) {
      addProp(el, "innerHTML", "_s(" + dir.value + ")");
    }
  }

  var directives$1 = {
    model: model$1,
    text: text,
    html: html,
  };

  /*  */

  var cache = Object.create(null);

  var baseOptions = {
    isIE: isIE,
    expectHTML: true,
    modules: modules$1,
    staticKeys: genStaticKeys(modules$1),
    directives: directives$1,
    isReservedTag: isReservedTag,
    isUnaryTag: isUnaryTag,
    mustUseProp: mustUseProp,
    getTagNamespace: getTagNamespace,
    isPreTag: isPreTag,
  };

  function compile$$1(template, options) {
    // extend 就是 assgin
    options = options ? extend(extend({}, baseOptions), options) : baseOptions;
    return compile$1(template, options);
  }

  function compileToFunctions(template, options, vm) {
    var _warn = (options && options.warn) || warn;
    // detect possible CSP restriction
    /* istanbul ignore if */
    {
      /**
       * // https://cn.vuejs.org/v2/guide/installation.html#CSP-%E7%8E%AF%E5%A2%83
       * 有些环境，如 Google Chrome Apps，会强制应用内容安全策略 (CSP)，不能使用 new Function() 对表达式求值
       * 不需要考虑
       */
      try {
        new Function("return 1");
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          _warn(
            "It seems you are using the standalone build of Vue.js in an " +
              "environment with Content Security Policy that prohibits unsafe-eval. " +
              "The template compiler cannot work in this environment. Consider " +
              "relaxing the policy to allow unsafe-eval or pre-compiling your " +
              "templates into render functions."
          );
        }
      }
    }

    var key =
      options && options.delimiters // options.delimiters 大多数情况下都是没有的，不用考虑，可能是为了制定 {{}} 的符号
        ? String(options.delimiters) + template
        : template;

    if (cache[key]) {
      // 如果缓存中有完整的匹配，自己返回结果，cache 换 key -> value 的闭包缓存方法
      // 直接返回编译结果
      return cache[key];
    }
    var res = {};
    var compiled = compile$$1(template, options); // compile$$1 是最核心的编译方法，有大量的内容

    // 下文关于输出结果先不看，直接看 compile$$1
    res.render = makeFunction(compiled.render);
    var l = compiled.staticRenderFns.length;
    res.staticRenderFns = new Array(l);
    for (var i = 0; i < l; i++) {
      res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i]);
    }
    {
      if (
        res.render === noop ||
        res.staticRenderFns.some(function (fn) {
          return fn === noop;
        })
      ) {
        _warn(
          "failed to compile template:\n\n" +
            template +
            "\n\n" +
            detectErrors(compiled.ast).join("\n") +
            "\n\n",
          vm
        );
      }
    }
    // 缓存并返回一个这么一个近似的对象: { render: Function, staticRenderFns: [Function] }
    return (cache[key] = res);
  }

  function makeFunction(code) {
    try {
      return new Function(code);
    } catch (e) {
      return noop;
    }
  }

  // 查询 dom id 中的 innerHTML 并缓存
  var idToTemplate = cached(function (id) {
    var el = query(id);
    return el && el.innerHTML;
  });

  var mount = Vue$3.prototype.$mount;
  // 此处定义 $mount 生命钩子
  Vue$3.prototype.$mount = function (el, hydrating) {
    el = el && query(el); // 挂载的 el string

    /* istanbul ignore if */
    if (el === document.body || el === document.documentElement) {
      "development" !== "production" &&
        warn(
          "Do not mount Vue to <html> or <body> - mount to normal elements instead."
        );
      return this;
    }

    var options = this.$options;
    // resolve template/el and convert to render function
    // 没有 render 函数，对 template 做处理 ↓↓↓
    if (!options.render) {
      var template = options.template;
      var isFromDOM = false;
      if (template) {
        if (typeof template === "string") {
          // template 字段支持直接传 id
          if (template.charAt(0) === "#") {
            isFromDOM = true;
            template = idToTemplate(template);
          }
        } else if (template.nodeType) {
          // 支持传 dom 引用给 template
          isFromDOM = true;
          template = template.innerHTML;
        } else {
          {
            warn("invalid template option:" + template, this);
          }
          return this;
        }
      } else if (el) {
        /**
         * 什么意思啊？没有 template，自动使用挂在点里的内容？试了一下确实如此
         * getOuterHTML 没有关注的必要，这个判断本身也没价值，没有实际场景，只是一个补完
         **/
        isFromDOM = true;
        template = getOuterHTML(el);
      }
      if (template) {
        // compileToFunctions > compile$$1 > compile$1 > parse 方法是核心方法
        var ref = compileToFunctions(
          template,
          {
            warn: warn,
            isFromDOM: isFromDOM,
            shouldDecodeTags: shouldDecodeTags,
            shouldDecodeNewlines: shouldDecodeNewlines,
            delimiters: options.delimiters,
          },
          this
        );
        // ref 是核心方法的运算结果值
        var render = ref.render;
        var staticRenderFns = ref.staticRenderFns;
        // 挂到 opt 上准备干吗？？？
        options.render = render;
        options.staticRenderFns = staticRenderFns;
      }
    }
    // template 编译完之后，走 mounted 方法
    return mount.call(this, el, hydrating);
  };

  /**
   * Get outerHTML of elements, taking care
   * of SVG elements in IE as well.
   * 这个是说，当 vue template 选项没写的时候，用 el 挂在点内的内容去填充
   * outerHTML 没有，是有些浏览器的一些节点可能没有？ IE SVG？
   * 所以去 hack 一下，这个方法没有关注的必要
   */
  function getOuterHTML(el) {
    if (el.outerHTML) {
      return el.outerHTML;
    } else {
      var container = document.createElement("div");
      container.appendChild(el.cloneNode(true));
      return container.innerHTML;
    }
  }

  Vue$3.compile = compileToFunctions;

  return Vue$3;
});
