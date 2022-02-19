import Vue from 'vue';

var runtime = {exports: {}};

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(function (module) {
  var runtime = function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.

    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }

    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function (obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.

      generator._invoke = makeInvokeMethod(innerFn, self, context);
      return generator;
    }

    exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.

    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.

    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.


    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });
    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = GeneratorFunctionPrototype;
    define(Gp, "constructor", GeneratorFunctionPrototype);
    define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
    GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    exports.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }

      genFun.prototype = Object.create(Gp);
      return genFun;
    }; // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.


    exports.awrap = function (arg) {
      return {
        __await: arg
      };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;

          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      } // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).


      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    });
    exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.

    exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          } // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);

          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted; // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.

            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    } // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.


    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];

      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.

        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      } // The delegate iterator is finished, so forget it and continue with
      // the outer generator.


      context.delegate = null;
      return ContinueSentinel;
    } // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.


    defineIteratorMethods(Gp);
    define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.

    define(Gp, iteratorSymbol, function () {
      return this;
    });
    define(Gp, "toString", function () {
      return "[object Generator]";
    });

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{
        tryLoc: "root"
      }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function (object) {
      var keys = [];

      for (var key in object) {
        keys.push(key);
      }

      keys.reverse(); // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.

      return function next() {
        while (keys.length) {
          var key = keys.pop();

          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        } // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.


        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];

        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;
            return next;
          };

          return next.next = next;
        }
      } // Return an iterator with no values.


      return {
        next: doneResult
      };
    }

    exports.values = values;

    function doneResult() {
      return {
        value: undefined$1,
        done: true
      };
    }

    Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        this.prev = 0;
        this.next = 0; // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.

        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined$1;
        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },
      stop: function () {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;

        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;

        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },
      complete: function (record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;

            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }

            return thrown;
          }
        } // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.


        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    }; // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.

    return exports;
  }( // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  module.exports );

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, in modern engines
    // we can explicitly access globalThis. In older engines we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    if (typeof globalThis === "object") {
      globalThis.regeneratorRuntime = runtime;
    } else {
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  }
})(runtime);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function applyAuthRestrictionForNavigationComponents(components, context) {
  if (typeof context.auth === 'undefined' && typeof context.loggedIn === 'undefined') {
    return components;
  }

  return components.filter(component => {
    if (typeof context.loggedIn !== 'undefined') {
      if (component.hasOwnProperty(context.layoutKey.requiredLoggedIn) && component[context.layoutKey.requiredLoggedIn] && !context.loggedIn) {
        return false;
      }

      if (component.hasOwnProperty(context.layoutKey.requiredLoggedOut) && component[context.layoutKey.requiredLoggedOut] && context.loggedIn) {
        return false;
      }
    }

    if (typeof context.auth !== 'undefined') {
      const keys = [context.layoutKey.requiredPermissions, context.layoutKey.requiredAbilities];

      for (let i = 0; i < keys.length; i++) {
        if (!component.hasOwnProperty(keys[i])) {
          continue;
        } // @ts-ignore


        const required = component[keys[i]].filter(item => !!item);

        if (Array.isArray(required) && required.length > 0) {
          if (context.layoutKey.requiredPermissions === keys[i]) {
            // @ts-ignore
            return required.some(permission => context.auth.hasPermission(permission));
          } // @ts-ignore


          return required.some(ability => context.auth.hasAbility(ability));
        }

        if (typeof required === 'function') {
          return required(context.auth);
        }
      }
    }

    return true;
  });
}

/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
function isNavigationComponentMatch(one, two) {
  let strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!(one && two) || !one || !two) {
    return false;
  } // check when true


  if (one.id && two.id && one.id === two.id) {
    return true;
  }

  if (!strict && one.name && two.name && one.name === two.name) {
    return true;
  }

  if (one.url && two.url) {
    if (one.url === two.url) {
      return true;
    }

    if (!strict && !one.rootLink && !two.rootLink) {
      if (one.url.startsWith(two.url) || two.url.startsWith(one.url)) {
        return true;
      }
    }
  }

  if (one.components && two.components) {
    let allMatched = true;

    for (let i = 0; i < one.components.length; i++) {
      if (!isNavigationComponentMatch(one.components[i], two.components[i])) {
        allMatched = false;
        break;
      }
    }

    for (let i = 0; i < two.components.length; i++) {
      if (!isNavigationComponentMatch(one.components[i], two.components[i])) {
        allMatched = false;
        break;
      }
    }

    if (allMatched) {
      return true;
    }
  }

  return false;
}
function initComponents(components) {
  let show = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return components.map(component => {
    component.display = show;
    component.displayChildren = false;

    if (!component.type) {
      component.type = 'link';
    }

    if (component.components) {
      component.components = initComponents(component.components, false);
    }

    return component;
  });
}

/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

function toggleNavigationComponentTree(components, context) {
  let componentFound = false;
  context.rootLevel = typeof context.rootLevel === 'undefined' ? true : context.rootLevel;

  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    const isMatch = isNavigationComponentMatch(context.component, component);

    if (isMatch) {
      componentFound = true;
    }

    if (component.components && component.components.length > 0) {
      const child = toggleNavigationComponentTree(component.components, Object.assign(Object.assign({}, context), {
        display: context.display || isMatch,
        rootLevel: false
      }));
      component.components = child.components;

      if (child.componentFound) {
        componentFound = true;
      }

      component.displayChildren = context.enable && (isMatch || child.componentFound);
    }

    component.display = context.enable && context.display;
    components[i] = component;
  }

  components = components.map(component => {
    component.display = context.rootLevel || component.display || componentFound;
    return component;
  });
  return {
    components,
    componentFound
  };
}

/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
function layoutMiddleware(_ref) {
  let {
    store,
    route,
    metaKey
  } = _ref;
  return __awaiter(this, void 0, void 0, function* () {
    let navigationId;

    if (route.meta) {
      for (let i = 0; i < route.meta.length; i++) {
        if (metaKey in route.meta[i] && route.meta[i][metaKey]) {
          navigationId = route.meta[i][metaKey];
        }
      }
    }

    if (typeof navigationId === 'undefined') {
      for (let i = 0; i < route.matched.length; i++) {
        if (metaKey in route.matched[i]) {
          // @ts-ignore
          navigationId = route.matched[i][metaKey];
        }
      }
    }

    let components = [];

    if (typeof navigationId === 'string') {
      components.push({
        id: navigationId
      });
    }

    if (Array.isArray(navigationId)) {
      components = navigationId.map(id => ({
        id
      }));
    }

    let rootLink = false;
    if (route.path === '/') rootLink = true;
    components.push({
      url: route.path,
      rootLink
    });
    yield store.dispatch('layout/initNavigation', {
      components
    });
  });
}

/*
 * Copyright (c) 2021-2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
const state = () => ({
  initialized: false,
  navigationComponents: {},
  navigationComponent: {}
});
const getters = {
  navigationComponents: state => tier => state.navigationComponents.hasOwnProperty(tier.toString()) ? state.navigationComponents[tier.toString()] : [],
  navigationComponent: state => tier => state.navigationComponent.hasOwnProperty(tier.toString()) ? state.navigationComponent[tier.toString()] : undefined,
  navigationComponentId: state => tier => {
    var _a;

    return state.navigationComponent.hasOwnProperty(tier.toString()) ? (_a = state.navigationComponent[tier.toString()]) === null || _a === void 0 ? void 0 : _a.id : undefined;
  }
};
const actions = {
  selectNavigation(_ref, context) {
    let {
      dispatch,
      commit,
      getters
    } = _ref;
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof context.component === 'undefined') {
        return;
      }

      const isMatch = isNavigationComponentMatch(getters.navigationComponent(context.tier), context.component);
      commit('setNavigationComponent', {
        tier: context.tier,
        component: context.component
      });
      let {
        tier
      } = context;

      while (getters.navigationComponents(tier).length > 0) {
        if (tier !== context.tier || !isMatch) {
          yield dispatch('updateNavigation', {
            tier
          });
        }

        tier++;
      }
    });
  },

  toggleNavigationExpansion(_ref2, context) {
    let {
      commit,
      getters
    } = _ref2;
    commit('setNavigationComponent', {
      tier: context.tier,
      component: context.component
    });
    const isMatch = isNavigationComponentMatch(getters.navigationComponent(context.tier), context.component, true);
    commit('setNavigationExpansion', Object.assign(Object.assign({}, context), {
      enable: !context.component.displayChildren || !isMatch
    }));
  },

  initNavigation(_ref3, context) {
    let {
      dispatch,
      commit
    } = _ref3;

    var _a, _b;

    return __awaiter(this, void 0, void 0, function* () {
      let buildContext = typeof context === 'undefined';
      context = Object.assign({
        components: []
      }, context || {});
      const currentHistory = (_b = (_a = this.$router) === null || _a === void 0 ? void 0 : _a.history) === null || _b === void 0 ? void 0 : _b.current;

      if (typeof currentHistory !== 'undefined' && (!context.components || Array.isArray(context.components) && context.components.length === 0)) {
        const url = currentHistory.fullPath;

        if (typeof url !== 'undefined' && this.$layoutNavigationProvider.getContextForUrl) {
          const urlContext = yield this.$layoutNavigationProvider.getContextForUrl(url);

          if (typeof urlContext !== 'undefined') {
            context.components = urlContext.components;
            buildContext = false;
          }
        }
      }

      const matches = [...context.components];
      let tier = 0;

      while (yield this.$layoutNavigationProvider.hasTier(tier)) {
        const items = [...(yield this.$layoutNavigationProvider.getComponents(tier, context))];

        if (items.length === 0) {
          tier++;
          continue;
        }

        let item;

        if (matches.length > 0) {
          const poppedItem = matches.shift();
          if (poppedItem) item = poppedItem;
        }

        if (typeof item === 'undefined') {
          item = items.filter(item => item.default || !item.components).shift();
        }

        if (typeof item === 'undefined') {
          tier++;
          continue;
        }

        commit('setNavigationComponent', {
          component: item,
          tier
        });
        yield dispatch('updateNavigation', {
          tier,
          components: context.components
        });
        tier++;

        if (buildContext) {
          context.components.push(item);
        }
      }
    });
  },

  updateNavigation(_ref4, context) {
    let {
      getters,
      commit,
      rootGetters
    } = _ref4;
    return __awaiter(this, void 0, void 0, function* () {
      const data = {
        tier: context.tier,
        loggedIn: rootGetters['auth/loggedIn'],
        components: []
      };
      const providerContext = Object.assign({}, context.components ? {
        components: context.components
      } : {
        components: []
      });

      if (typeof context.components === 'undefined') {
        let tier = 0;

        while (tier < context.tier && (yield this.$layoutNavigationProvider.hasTier(tier))) {
          providerContext.components.push(getters.navigationComponent(tier));
          tier++;
        }
      }

      data.components = [...(yield this.$layoutNavigationProvider.getComponents(context.tier, providerContext))];
      commit('setNavigationComponents', data);
      commit('setNavigationExpansion', {
        enable: true,
        tier: context.tier,
        component: getters.navigationComponent(context.tier)
      });
    });
  }

};
const mutations = {
  setInitialized(state, value) {
    state.initialized = value;
  },

  setNavigationExpansion(state, context) {
    const tierStr = context.tier.toString();
    const {
      components
    } = toggleNavigationComponentTree(state.navigationComponents[tierStr], {
      enable: context.enable,
      component: context.component
    });
    state.navigationComponents = Object.assign(Object.assign({}, state.navigationComponents), {
      [tierStr]: components
    });
  },

  setNavigationComponent(state, context) {
    const tierStr = context.tier.toString();
    state.navigationComponent = Object.assign(Object.assign({}, state.navigationComponent), {
      [tierStr]: context.component
    });
  },

  setNavigationComponents(state, context) {
    let components = [...context.components];
    components = initComponents(components);
    const tierStr = context.tier.toString();
    state.navigationComponents = Object.assign(Object.assign({}, state.navigationComponents), {
      [tierStr]: components
    });
  }

}; // --------------------------------------------------------------------

const storePlugin = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

/**
 * Returns true if either scoped or unscoped named slot exists
 *
 * @returns {Array|undefined} VNodes
 *
 * @param names
 * @param $scopedSlots
 * @param $slots
 */
function hasNormalizedSlot(names) {
  let $scopedSlots = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let $slots = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  names = Array.isArray(names) ? names : [names]; // Ensure names is an array

  names = names.filter(name => name); // Returns true if the either a $scopedSlot or $slot exists with the specified name

  return names.some(name => $scopedSlots[name] || $slots[name]);
}
/**
 * Returns VNodes for named slot either scoped or unscoped
 *
 * @param names
 * @param {String} scope
 * @param $scopedSlots
 * @param $slots
 *
 * @returns {Array|undefined} VNodes
 */

function normalizeSlot(names) {
  let scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let $scopedSlots = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let $slots = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  // Ensure names is an array
  names = Array.isArray(names) ? names : [names]; // Ensure names is an array

  names = names.filter(name => name);
  let slot;

  for (let i = 0; i < names.length && !slot; i++) {
    const name = names[i];
    slot = $scopedSlots[name] || $slots[name];
  } // Note: in Vue 2.6.x, all named slots are also scoped slots


  return typeof slot === 'function' ? slot(scope) : slot;
}

/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
var SlotName;

(function (SlotName) {
  SlotName["SEPARATOR"] = "separator";
  SlotName["LINK"] = "link";
  SlotName["SUB"] = "sub";
  SlotName["SUB_TITLE"] = "sub-title";
  SlotName["SUB_ITEMS"] = "sub-items";
})(SlotName || (SlotName = {}));

/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
const NavigationComponent = Vue.extend({
  name: 'NavigationComponent',
  props: {
    tier: {
      type: Number,
      default: 0
    },
    component: {
      type: Object,
      required: true,
      default: undefined
    }
  },
  computed: {
    isStrictMatch() {
      return isNavigationComponentMatch(this.$store.getters['layout/navigationComponent'](this.tier), this.component, true);
    },

    isMatch() {
      return isNavigationComponentMatch(this.$store.getters['layout/navigationComponent'](this.tier), this.component, false) || this.isChildrenMatch;
    },

    isChildrenMatch() {
      return !!(this.component.components && this.component.displayChildren);
    }

  },
  methods: {
    selectComponent(component) {
      return __awaiter(this, void 0, void 0, function* () {
        yield this.$store.dispatch('layout/selectNavigation', {
          tier: this.tier,
          component
        });

        if (component === null || component === void 0 ? void 0 : component.url) {
          if (this.$router.history.current.path === (component === null || component === void 0 ? void 0 : component.url)) {
            return;
          } // todo: check if it is absolute link :)


          yield this.$router.push({
            path: component === null || component === void 0 ? void 0 : component.url
          });
        }
      });
    },

    toggleComponentExpansion(component) {
      return __awaiter(this, void 0, void 0, function* () {
        yield this.$store.dispatch('layout/toggleNavigationExpansion', {
          tier: this.tier,
          component
        });
      });
    }

  },

  render(createElement) {
    const vm = this;
    const h = createElement;
    const $scopedSlots = vm.$scopedSlots || {};
    const $slots = vm.$slots || {};
    let item = h();

    switch (vm.component.type) {
      case 'separator':
        {
          const hasSlot = hasNormalizedSlot(SlotName.SEPARATOR, $scopedSlots, $slots);

          if (hasSlot) {
            item = normalizeSlot(SlotName.SEPARATOR, {
              component: vm.component
            }, $scopedSlots, $slots);
          } else {
            item = h('div', {
              staticClass: 'nav-separator'
            }, [vm.component.name]);
          }

          break;
        }

      default:
        {
          if (typeof vm.component.components === 'undefined') {
            const hasSlot = hasNormalizedSlot(SlotName.LINK, $scopedSlots, $slots);

            if (hasSlot) {
              item = normalizeSlot(SlotName.LINK, {
                component: vm.component,
                selectComponent: vm.selectComponent,
                isActive: vm.isMatch
              }, $scopedSlots, $slots);
            } else {
              item = h('a', {
                staticClass: 'nav-link',
                class: {
                  'router-link-active': vm.isMatch,
                  'router-link-exact-active': vm.isStrictMatch,
                  active: vm.isMatch,
                  'root-link': vm.component.rootLink
                },
                attrs: {
                  // eslint-disable-next-line no-script-url
                  href: 'javascript:void(0)'
                },
                on: {
                  click($event) {
                    $event.preventDefault();
                    vm.selectComponent.call(null);
                  }

                }
              }, [vm.component.icon ? h('i', {
                staticClass: vm.component.icon
              }) : h(), h('span', {
                staticClass: 'nav-link-text'
              }, [vm.component.name])]);
            }
          } else if (hasNormalizedSlot(SlotName.SUB, $scopedSlots, $slots)) {
            item = normalizeSlot(SlotName.SUB, {
              component: vm.component,
              selectComponent: vm.selectComponent,
              toggleComponentExpansion: vm.toggleComponentExpansion
            }, $scopedSlots, $slots);
          } else {
            let title = h();

            if (hasNormalizedSlot(SlotName.SUB_TITLE, $scopedSlots, $slots)) {
              title = normalizeSlot(SlotName.SUB_TITLE, {
                component: vm.component,
                selectComponent: vm.selectComponent,
                toggleComponentExpansion: vm.toggleComponentExpansion
              });
            } else {
              title = h('div', {
                staticClass: 'nav-sub-title',
                on: {
                  click($event) {
                    $event.preventDefault();
                    vm.toggleComponentExpansion.call(null, vm.component);
                  }

                }
              }, [vm.component.icon ? h('i', {
                staticClass: vm.component.icon
              }) : h(), h('span', {
                staticClass: 'nav-link-text'
              }, [vm.component.name])]);
            }

            let items = h();

            if (hasNormalizedSlot(SlotName.SUB_ITEMS, $scopedSlots, $slots)) {
              items = normalizeSlot(SlotName.SUB_ITEMS, {
                component: vm.component,
                selectComponent: vm.selectComponent,
                toggleComponentExpansion: vm.toggleComponentExpansion
              });
            } else if (vm.component.displayChildren) {
              items = h(NavigationComponents, {
                staticClass: 'list-unstyled nav-sub-items',
                props: {
                  tier: vm.tier,
                  entities: vm.component.components
                }
              });
            }

            item = [title, items];
          }

          break;
        }
    }

    return h('div', {
      staticClass: 'nav-item',
      class: {
        active: vm.isMatch
      }
    }, Array.isArray(item) ? item : [item]);
  }

});

/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
const NavigationComponents = Vue.extend({
  props: {
    tier: {
      type: Number,
      default: 0
    },
    entities: {
      type: Array,
      default: undefined
    }
  },
  computed: {
    items() {
      if (typeof this.entities !== 'undefined') {
        return this.entities;
      }

      return this.$store.getters['layout/navigationComponents'](this.tier);
    }

  },

  render(createElement) {
    const vm = this;
    const h = createElement;
    const entities = [];

    for (let i = 0; i < vm.entites.length; i++) {
      const entity = vm.entites[i];

      if (entity.display) {
        entities.push(h('li', {
          key: i
        }, [h(NavigationComponent, {
          props: {
            tier: vm.tier,
            component: entity
          }
        })]));
      }
    }

    return h('ul', {
      staticClass: 'nav-items'
    }, entities);
  }

});

/* eslint-disable import/prefer-default-export */

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  NavigationComponents: NavigationComponents,
  NavigationComponent: NavigationComponent
});

const install = function installVueLayoutNavigation(instance) {
  Object.entries(components).forEach(_ref => {
    let [componentName, component] = _ref;
    instance.component(componentName, component);
  });
}; // Create module definition for Vue.use()

export { NavigationComponent, NavigationComponents, actions, applyAuthRestrictionForNavigationComponents, install as default, getters, initComponents, isNavigationComponentMatch, layoutMiddleware, mutations, state, storePlugin, toggleNavigationComponentTree };
