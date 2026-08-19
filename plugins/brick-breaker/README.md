# Brick Breaker / 星光弹球工坊

An original, generic browser brick-breaker minigame. It uses only the shared idea of a paddle, ball and breakable blocks; its presentation, layout and UI are original to this project.

## Standalone preview

Serve the repository over HTTP and open:

```text
/plugins/brick-breaker/standalone/
```

The standalone page does not load the main game or `DANBO_PLUGIN_HOST`.

## Controls

- Keyboard: Left/Right or A/D
- Mouse/touch: guide the paddle directly
- Space/click/tap: launch the ball
- Escape/P: pause

## Runtime boundary

`brick-breaker-core.js` receives a mount, rules, storage and lifecycle callbacks. It does not read the main-world player, economy, scene or save globals.
