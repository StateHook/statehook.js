# statehook.js
An observable hook.

## Installation

```bash
$ npm install statehook
```

## API

----------

### StateHook.<strong>createHook([defaultValue, [setupFunction]])</strong>

Create a hook

```JavaScript
var hook = StateHook.createHook();
// or
var hook = StateHook.createHook(0);
// or
var hook = StateHook.createHook(0, function(newHook) {
  newHook.additionFunction = function() {
    return 'this is an addition function';
  }
});
```

----------
### hook.<strong>set(value)</strong> => void
### hook.<strong>get()</strong> => any
### hook.<strong>getChild(childPathArray)</strong> => any
### hook.<strong>dispatch(dispatcher: (eventSource: Object) => eventSource)</strong> => void
### hook.<strong>dispatch(eventSource: Object)</strong> => void
### hook.<strong>subscribe(observer: (event, hook))</strong> => unsubscribe() => {}
### hook.<strong>subscribe(eventType, observer: (event, hook))</strong> => unsubscribe() => {}
### hook.<strong>discard()</strong> => void
