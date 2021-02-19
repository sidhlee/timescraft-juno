# TimesCraft (for Ethan)

A multiplication quiz app for my son who loves Minecraft.

## What I Learned

### Snowpack

Snowpack is fast, but setting up Jest to work properly can be a pain.

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

### Play Audio without user action

- Use [Howler](https://github.com/goldfire/howler.js#documentation)

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

## Questions

### OOP vs FP

Currently, I ended up with lots of functions placed in a module with no hierarchy.  
Here are some of the pros and cons of OOP and FP I can think of:

- OOP allows you to organize code in more clear way.
- FP is easier and simpler to unit-test.

What are your thoughts and opinions on choosing either style specifically for this project?

### jQuery vs React

I would normally work with React for any project that is more than simple brochure page, and this is one of the biggest project I've worked without using framework.

I've encountered with the following challenges working without using React:

- Markup, logics and data being separated into different modules make it harder to think in terms of "components". Having to go between multiple files doesn't feel as efficient (especially when refactoring).

- Without virtual DOM, users can see the rendering & updating as it happens on the screen. Maybe it's my lack of knowledge on how to solve this problem with jQuery.

- If I try to "mount" the component with `$('#root').append(component)`, user can see all the document reflow as the new element is being inserted into the placeholder. So I had to included as much markups as possible and only update the part that's actually changing. I think it's o.k. with the size of this project, but the size of initial markup the browser has to load will increase as the project gets bigger which will lead to the longer wait time.

- Hard to remember API interfaces as the number of functions grow larger which in turn, makes debugging a greater pain. This is something that can be improved with TypeScript (or jsDoc) but setting up TypeScript manually feels like a hassle you don't have to go through with create-react-app or Gatsby.

- Also, not being able to use CSS in JS (e.g. styled-components) is a minor inconvenience, but this can be mitigated with Sass live compiler and scss modules. As the project grow, managing all the css classes and specificity manually would become a big challenge.

So, can you give some example on what type of project would you go for jQuery instead of framework in real work environment (including freelancing)?
