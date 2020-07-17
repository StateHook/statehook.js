'use strict';
(function (root, factory) {
  if (typeof define === 'function' && define.amd) define('statehook', factory), define('StateHook', factory);
  if (typeof exports === 'object') module.exports = factory();
  if (!!root && typeof root === 'object') { root.statehook = root.StateHook = factory(); }
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  function createHook(state) {
    var listeners = {};
    function getState() { return state; }
    function setState(newState) { state = newState; }
    function on(eventType, listener) {
      if (!listeners) throw new Error('This hook has been discarded!');
      (listeners[eventType] = listeners[eventType] || []).push(listener);
      return function off() { if (listeners && listeners[eventType]) listeners[eventType].splice(listeners[eventType].indexOf(listener), 1); };
    }
    function emit(eventType, args) {
      if (!listeners) throw new Error('This hook has been discarded!');
      if (listeners[eventType]) for (var idx in listeners[eventType]) listeners[eventType][idx](eventType, args);
    }
    function discard() { state = undefined; listeners = undefined; }
    return { getState: getState, setState: setState, on: on, emit: emit, discard: discard };
  }
  return { createHook: createHook };
});