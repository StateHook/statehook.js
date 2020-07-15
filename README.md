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
### hook.<strong>set(value)</strong>
### hook.<strong>get()</strong>
### hook.<strong>getChild(childPathArray)</strong>
### hook.<strong>emit(eventType, actionFunction)</strong>
### hook.<strong>observe(observer)</strong>
### hook.<strong>observe(eventType, observer)</strong>
### hook.<strong>discard()</strong>
