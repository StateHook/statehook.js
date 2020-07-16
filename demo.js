const StateHook = require('./statehook');

const hook = StateHook.createHook();
hook.subscribe(undefined, function(event, _hook) {
  console.log(event, _hook.get())
});

hook.dispatch(function (source) {
  // console.log(theHook);
  // return 'hello';
  // source.type = 'HELLO_EVENT';
  source.state = Object.assign({}, source.state, {
    hello: 1,
  });
  source.zzzz=1;
  // return source
});
hook.dispatch(function (source) {
  // console.log(theHook);
  source.time = 1;
});
hook.dispatch({
  state: { hello: 2 },
});

