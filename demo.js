const StateHook = require('./statehook');

const hook = StateHook.createHook({ name: 'hello' });

console.log(hook.getState())

const off = hook.on('hello', (eventType, args) => {
  console.log(eventType, args, 'event 1');
})
hook.on('hello', (eventType, args) => {
  console.log(eventType, args, 'event 2');
})
hook.emit('hello', {
  args1: '1',
});

hook.emit('hello', {
  args1: '2',
});


hook.emit('hello', {
  args1: '3',
});

off();
