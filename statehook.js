'use strict';
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      define('statehook', factory);
      define('StateHook', factory);
  }
  if (typeof exports === 'object') {
      module.exports = factory();
  }
  if (!!root && typeof root === 'object') {
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
    var gEventObservers = {};
    var gGlobalObservers = {};
    var gObserverIdCounter = 0;
    var gEventIdCounter = 0;
    var gState = defaultValue;

    function _getGHook() {
      return _mergeObject({}, gHook);
    }

    gHook.discard = function discard() {
      gIsDiscarded = true;
      gHook = {};
      gEventObservers = {};
      gGlobalObservers = {};
      gState = undefined;
    };

    gHook.get = function get() {
      return gState;
    };

    gHook.getChild = function getChild(childPath) {
      if ('object' !== typeof gState) return undefined;
      if (!_isArray(childPath)) {
        childPath = [childPath];
      }
      var currentVal = gState;
      for (var _keyIdx in childPath) {
        if ('object' === typeof currentVal) {
          var key = childPath[_keyIdx];
          currentVal = currentVal[key];
        } else {
          currentVal = undefined;
          break;
        }
      }
      return currentVal;
    };

    gHook.set = function set(newState) {
      if (gIsDiscarded) throw new Error('The hook which has this function you call has been discarded!');
      gState = newState;
      return gState;
    };

    gHook.dispatch = function dispatch(dispatcher) {
      if (gIsDiscarded) throw new Error('The hook which has this function you call has been discarded!');
      var occurTime = Date.now();
      var eventData;
      if ('function' === typeof dispatcher) { // (String, Function)
        eventData = { state: gState };
        var dispatcherResult = dispatcher(eventData);
        if (dispatcherResult && 'object' === typeof dispatcherResult) {
          eventData = dispatcherResult;
        }
      } else {
        eventData = dispatcher;
      }
      var eventDataType = typeof eventData;
      if ('object' !== eventDataType) {
        throw new Error('The second parameter to be expected a function or object but got a ' + eventDataType);
      }

      gState = eventData.state;

      gEventIdCounter += 1;
      var eventId = gEventIdCounter;
      var eventInfo = _mergeObject({}, eventData, { type: eventData.type, time: occurTime, id: eventId });
      // allevent observer
      for (var obserId in gGlobalObservers) {
        var obser = gGlobalObservers[obserId];
        obser(_mergeObject({}, eventInfo), _getGHook());
      }
      // event observer
      var eventObservers = gEventObservers[eventData.type] || null;
      if (eventObservers) {
        for (var obserId in eventObservers) {
          var obser = eventObservers[obserId];
          obser(_mergeObject({}, eventInfo), _getGHook());
        }
      }
    };

    gHook.subscribe = function subscribe(eventType, observer) {
      if (gIsDiscarded) throw new Error('The hook which has this function you call has been discarded!');
      var eventTypeType = typeof eventType;
      var observerType = typeof observer;
      gObserverIdCounter += 1;
      var obserId = gObserverIdCounter;
      if ('function' === eventTypeType) { // (Function)
        observer = eventType;
        gGlobalObservers[obserId] = observer;
        return function () {
          delete gGlobalObservers[obserId];
        };
      } else if ('function' === observerType) { // (String, Function)
        eventType = '' + eventType;
        gEventObservers[eventType] = gEventObservers[eventType] || {};
        gEventObservers[eventType][obserId] = observer;

        return function () {
          if (gEventObservers[eventType]) {
            delete gEventObservers[eventType][obserId];
          }
        }
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
