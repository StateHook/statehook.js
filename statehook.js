/* eslint-disable */
'use strict';
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      define('statehook', factory);
      define('StateHook', factory);
  } else if (typeof exports === 'object') {
      module.exports = factory();
  } else {
      root.statehook = factory();
      root.StateHook = root.statehook;
  }
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  /**
   * the _getUndefined() function is used to avoid
   * the programmer I make any mistake cause the
   * undefined variable to be overridden
   */
  function _getUndefined() {}
  /**
   * the undefined variable is used to avoid the programmer I 
   * to use the undefined variable directly
   */
  var undefined = _getUndefined();

  var _prototypeHasOwnProperty = Object.prototype.hasOwnProperty;
  var _prototypeToString = Object.prototype.toString;

  function _mergeObject(target) {
    if (target === null || target === undefined) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    var to = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];
      if (nextSource !== null && nextSource !== undefined) {
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (_prototypeHasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
  var ARRAY_TYPE_STRINGIFY = _prototypeToString.call([]);
  function _isArray(v) {
    return _prototypeToString.call(v) === ARRAY_TYPE_STRINGIFY;
  }

  function createHook(defaultValue, setupFunc) {
    /* initialise */
    if ('function' !== typeof setupFunc) setupFunc = function (v) { return v; };
    
    /* global variable */
    var gIsDiscarded = false;
    var gHook = {};
    var gObservers = {};
    var gAllEventObservers = {};
    var gKeyCounter = 0;
    var gEventIdCounter = 0;
    var gVar = defaultValue;

    function _getGHook() {
      return _mergeObject({}, gHook);
    }

    gHook.discard = function discard() {
      gIsDiscarded = true;
      gHook = {};
      gObservers = {};
      gAllEventObservers = {};
      gVar = undefined;
    };

    gHook.get = function get() {
      return gVar;
    };

    gHook.getChild = function getChild(keyParameter) {
      var currentVal = gHook.get();
      if ('object' !== typeof currentVal) return undefined;
      var keyParameterType = typeof keyParameter;
      if (keyParameterType === 'string' || keyParameterType === 'number') {
        keyParameter = [keyParameter];
      }
      if (_isArray(keyParameter)) {
        for (var _keyIdx in keyParameter) {
          if ('object' === typeof currentVal) {
            var key = keyParameter[_keyIdx];
            currentVal = currentVal[key];
          } else {
            currentVal = undefined;
            break;
          }
        }
      }
      return currentVal;
    };

    gHook.set = function set(newVar) {
      if (gIsDiscarded) throw new Error('The hook which has this function you call has been discarded!')
      gVar = newVar;
      return gVar;
    };

    gHook.emit = function emit(eventType, emiter) {
      if (gIsDiscarded) throw new Error('The hook which has this function you call has been discarded!')
      var occurTime = Date.now();
      var typeofArgEmiter = typeof emiter;
      var eventData;
      if ('function' === typeofArgEmiter) { // (String, Function)
        eventData = emiter(gHook);
      } else {
        throw new Error('The second parameter to be expected a function but got a ' + typeofArgEmiter);
      }
      gEventIdCounter += 1;
      var eventInfo = { eventType: eventType, occurTime: occurTime, eventId: gEventIdCounter };
      // allevent observer
      for (var _key in gAllEventObservers) {
        var obser = gAllEventObservers[_key];
        obser(_mergeObject(
            {},
            eventData,
            eventInfo,
          ), _getGHook());
      }
      // event observer
      var observersThisEvent = gObservers[eventType] || null;
      if (!!observersThisEvent) {
        for (var obserCount in observersThisEvent) {
          var obser = observersThisEvent[obserCount];
          obser(_mergeObject(
            {},
            eventData,
            eventInfo,
          ), _getGHook());
        }
      }
    };

    gHook.observe = function observe(eventType, observer) {
      if (gIsDiscarded) throw new Error('The hook which has this function you call has been discarded!')
      var typeofArgEventType = typeof eventType;
      var typeofArgObserver = typeof observer;
      gKeyCounter += 1;
      var thisCount = gKeyCounter;
      if ('function' === typeofArgEventType) { // (Function)
        observer = eventType;
        gAllEventObservers[thisCount] = observer;
        return function () {
          delete gAllEventObservers[thisCount];
        };
      } else if ('function' === typeofArgObserver) { // (String, Function)
        gObservers[eventType] = gObservers[eventType] || {};
        gObservers[eventType][thisCount] = observer;
        return function () {
          if (gObservers[eventType]) {
            delete gObservers[eventType][thisCount];
          }
        };
      } else {
        throw new Error('There are 2 overloads expected for this function, (String, Function) or (Function)');
      }
    };
    var hookToReturn = _getGHook();
    return setupFunc(hookToReturn) || hookToReturn;
  };
  return {
    createHook: createHook,
  };
});
