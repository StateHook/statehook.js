# statehook.js
An event-driven state hook.

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
### hook.<strong>setState(value)</strong> => void
### hook.<strong>getState()</strong> => any
### hook.<strong>on(eventType, args)</strong> => void
### hook.<strong>emit(eventType, listenerFunction)</strong> => void
### hook.<strong>discard()</strong> => void
