# statehook.js
A state hook.

## Installation

```bash
$ npm install statehook
```

## API

----------

### StateHook.<strong>createHook([defaultValue])</strong>

Create a hook

```JavaScript
var hook = StateHook.createHook();
// or
var hook = StateHook.createHook('default value');
```

----------
### hook.<strong>setState(newState)</strong> => newState
### hook.<strong>getState()</strong> => any
### hook.<strong>subscribe(subscriber)</strong> => unsubcribe()
### hook.<strong>dispatch(args1, arg2, ..., argN)</strong> => void
### hook.<strong>discard()</strong> => void
### hook.<strong>isDiscarded()</strong> =>Boolean
