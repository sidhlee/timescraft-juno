# TimesCraft (for Ethan)

A multiplication quiz app for my son who loves Minecraft.

## What I Learned

### Snowpack

Snowpack is fast, but setting up Jest to work properly can be a pain.

## Unsolved Mysteries

### Jest with ESM

- ESM modules can access $ defined in global (loaded with CDN)
- When you're running ESM module via Jest, you get "$ is undefined".
- You get access to the global variable only within the functions inside modules.
- $ used outside function block becomes undefined (in test)

### Avoid setInterval

- It doesn't care whether the callback is still running, so they are not guaranteed to run in order! (callback executed earlier can finish later)
- It will keep running even with an error thrown in one of the callback

```js
// Suggested implementation
function interval(func, wait, times) {
  var interv = (function (w, t) {
    // returns a new function with wait and time bound to the context
    return function () {
      if (typeof t === 'undefined' || t-- > 0) {
        // t decrements after comparison
        setTimeout(interv, w);
        try {
          func.call(null); // default this(window) is automatically used if not in strict mode
        } catch (err) {
          t = 0; // stop on error (no need to manually clear timeout, no need to keep ids)
          throw err;
        }
      }
    };
  })(wait, times); // called immediately to return a new function dynamically bound with args

  setTimeout(interv, wait);
}

// Usage
interval(
  function () {
    // Code block goes here
  },
  1000,
  10
);
```

## jQuery Tips & Gotchas

### `.on()` vs `.one()`

jQuery allows multiple handlers on the same element.
Unless manually removed with `.off()`, all attached event handler will be called in the same order that they were added.
<br/>
In the follow example, additional `endCallback` will be registered to `animationend` event every time `showModal` is called. As a result, endCallback will run as many times as showModal has been called.

```js
function showModal() {
  $('.modal')
    .on('animationend', endCallback)
    .addClass('animate__animated animate__slideInLeft');
}
```

So typically, you would want to use `.one()` with `animationend`

```js
function showModal() {
  $('.modal')
    // endCallback will be .off() -ed after it gets invoked.
    .on('animationend', endCallback)
    .addClass('animate__animated animate__slideInLeft');
}
```

### Adding or removing multiple classes

```js
$('.modal').addClass('show').addClass('warning').addClass('slide-down');

// would be same as:

$('.modal').addClass('show warning slide-down');
```
