# Times Buddy

A quiz app for learning times table. Built with jQuery

## What I Learned

### Snowpack

Snowpack is fast, but setting up Jest to work properly can be a pain.

## Unsolved Mysteries

### Jest with ESM

- ESM modules can access $ defined in global (loaded with CDN)
- When you're running ESM module via Jest, you get "$ is undefined".
- You get access to the global variable only within the functions inside modules.
- $ used outside function block becomes undefined (in test)
