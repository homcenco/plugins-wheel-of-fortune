# Wheel Of Fortune

A `Wheel Of Fortune` spinner plugin for users traffic arbitrage. Beautiful, interactive, clean javascript!

<div style="text-align: center;"><img src="https://raw.githubusercontent.com/homcenco/plugins-wheel-of-fortune/main/docs/big-wheel.gif" width="300px" alt=""> <img src="https://raw.githubusercontent.com/homcenco/plugins-wheel-of-fortune/main/docs/small-wheel.gif" width="300px" alt=""></div>

## Install:

– Install wheel easily in your website or page:

```html
<!-- Insert plugin style -->
<link rel="stylesheet" href="./src/wheel.plugin.css"/>

<!-- Insert plugin script -->
<script src="./src/wheel.plugin.js"></script>

<!-- Insert plugin container -->
<div id="wheel-plugin" class="wheel-plugin"></div>

<!-- Insert plugin initialization -->
<script>
  const wheel = new WheelPlugin();
  wheel.showBigSpinner()
</script>
```

## Examples:

– Initialize absolute/centered/right small button wheel:

```js
const wheel = new WheelPlugin({
  wheelPluginPosition: true
});
wheel.showSmallSpinner()
```

– Initialize absolute/centered/right big wheel:

```js
const wheel = new WheelPlugin({
  wheelPluginPosition: true
});
wheel.showBigSpinner()
```

– Initialize inside container big wheel:

```js
const wheel = new WheelPlugin();
wheel.showBigSpinner()
```

– Initialize content big wheel with autoRotate:

```js
const wheel = new WheelPlugin({
  wheelAutoRotate: true
});
wheel.showBigSpinner()
```

– Initialize your after win function

```js
const wheel = new WheelPlugin({
  initAfterWin: () => {
    alert('After Win Function')
  }
});
wheel.showBigSpinner()
```

– Change theme and other options

```js
const wheel = new WheelPlugin({
  colorStyle: 'pink',
  winRotationDurationMs: 1000,
});
wheel.showBigSpinner()
```

## Options:

- `colorStyle`: [`null`|`string`] purple|pink|blue|green|orange|turquoise|grey|red|lgbtq
- `winRotationDurationMs`: [`null`|`integer`] set how long to rotate on spin click
- `winEnlargeDurationMs`: [`null`|`integer`] set how long to enlarge win sector after win
- `winSectors`: [`array`] set from 6 to 15 win sectors names array to rotate
- `winSectorNumber`: [`integer`] set sector win number to stop after rotate
- `winSectorTextReplace`: [`null`|`string`] set text to replace in stopped sector after rotate
- `wheelAutoRotate`: [`bull`|`boolean`] set hover text in mini wheel button
- `wheelCenterText`: [`null`|`string`] set rotate text in wheel center button
- `wheelMiniText`: [`null`|`string`] set hover text in mini wheel button
- `wheelPluginPosition`: [`null`|`boolean`] set wheel with sticky position
- `wheelShowTimeoutMs`: [`null`|`integer`] set wheel small button onload show effect
- `wheelMaxHeight`: [`null`|`string`] set wheel max-height
- `wheelMaxWidth`: [`null`|`string`] set wheel max-width
- `initAfterWin`: [`function`] set your function after win

## Defaults:

- `colorStyle`: `purple`
- `winRotationDurationMs`: `8000`
- `winEnlargeDurationMs`: `1000`
- `winSectors`: `['0%', '30%', 'SPIN IT', '10%', '25%', '40%', '0%', '50%']`
- `winSectorNumber`: `8`
- `winSectorTextReplace`: `50% WIN`
- `wheelAutoRotate`: `false`
- `wheelCenterText`: `SPIN`
- `wheelMiniText`: `Click to win`
- `wheelPluginPosition`: `false`
- `wheelShowTimeoutMs`: `null`
- `wheelMaxHeight`: `500`
- `wheelMaxWidth`: `500`
- `initAfterWin`: `() => {}`
