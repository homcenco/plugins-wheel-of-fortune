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
  wheelSpinDurationMs: 1000,
});
wheel.showBigSpinner()
```

– Localize wheel (arabic)

```js
const wheel = new WheelPlugin({
  wheelCenterText: 'تدور',
  wheelCenterTextLeftPosition: -9,
  wheelCenterTextStyle: 'font-size:12px',

  wheelSectors: ['30٪', '0٪', 'تدور', '50٪', '5٪', '10٪', '33٪', '20٪', '40٪', '0٪', '33٪', '20٪', '50٪', '10٪', '0٪'],

  winSectorTextReplace: 'اربح ٪50',
});
wheel.showBigSpinner()
```

## Options:

- `colorStyle`: [`null`,`string`] – set wheel color: purple, pink, blue, green, orange, turquoise, grey, red, lgbtq
- `wheelAutoRotate`: [`bull`,`boolean`] – set wheel auto rotate on load
- `wheelCenterText`: [`null`,`string`] – set wheel center button text
- `wheelCenterTextFillColor` [`null`,`string`] – set wheel center button text fill color
- `wheelCenterTextLeftPosition` [`null`,`integer`] – set wheel center button text position number from left
- `wheelCenterTextStyle` [`null`,`string`] – set wheel center button text style value
- `wheelMiniText`: [`null`,`string`] – set wheel small button hover text
- `wheelPluginPosition`: [`null`,`boolean`] – set wheel with absolute/right/centered position
- `wheelSectors`: [`array`] – set wheel sectors array from 6 to 15
- `wheelSpinDurationMs`: [`null`,`integer`] – set wheel spin duration time in milliseconds
- `wheelShowPauseMs`: [`null`,`integer`] – set wheel small button show after pause in milliseconds
- `wheelMaxHeight`: [`null`,`string`] – set wheel max height number
- `wheelMaxWidth`: [`null`,`string`] – set wheel max width number

- `winEnlargePauseMs`: [`null`,`integer`] – set wheel win sector enlarge duration time in milliseconds
- `winEnlargedMinifyPauseMs` [`null`,`integer`] – set enlarged sector minify after pause in milliseconds
- `winSectorNumber`: [`integer`] – set win sector number to show
- `winSectorTextReplace`: [`null`,`string`] – set win sector text replace

- `initAfterWin`: [`function`] – set your after win function
- `initAfterWinPauseMs`: [`null`,`integer`] – set your after win function show after pause in milliseconds

## Defaults:

- `colorStyle`: `'purple'`
- `wheelAutoRotate`: `false`
- `wheelCenterText`: `'SPIN'`
- `wheelCenterTextFillColor`: `'black'`
- `wheelCenterTextLeftPosition`: `-11`
- `wheelCenterTextStyle`: `'font-size:10px'`
- `wheelMiniText`: `'Click to win'`
- `wheelPluginPosition`: `false`
- `wheelSectors`: `['30%', '0%', 'SPIN IT', '50%', '5%', '10%', '33%', '20%', '40%', '0%', '33%', '20%', '50%', '10%', '0%']`
- `wheelSpinDurationMs`: `7000`
- `wheelShowPauseMs`: `null`
- `wheelMaxHeight`: `500`
- `wheelMaxWidth`: `500`

- `winEnlargePauseMs`: `null`
- `winEnlargedMinifyPauseMs`: `1500`
- `winSectorNumber`: `4`
- `winSectorTextReplace`: `'50% WIN'`

- `initAfterWin`: `() => {}`
- `initAfterWinPauseMs`: `2500`
