# Wheel Of Fortune

A `Wheel Of Fortune` spinner plugin for users traffic arbitrage. Beautiful, interactive, clean javascript!

<div style="text-align: center;">
  <img src="https://raw.githubusercontent.com/homcenco/plugins-wheel-of-fortune/main/docs/wheel-big.png" width="200px" alt="">
  <img src="https://raw.githubusercontent.com/homcenco/plugins-wheel-of-fortune/main/docs/wheel-absolute-big.png" width="200px" alt="">
  <img src="https://raw.githubusercontent.com/homcenco/plugins-wheel-of-fortune/main/docs/wheel-absolute-small.png" width="200px" alt="">
</div>

## Install:

– Install wheel easily in your website or page:

```html
<!-- Initialize wheel style -->
<link rel="stylesheet" href="./src/wheel.plugin.css"/>

<!-- Initialize wheel script -->
<script src="./src/wheel.plugin.js"></script>

<!-- Initialize wheel container -->
<div id="wheel-plugin" class="wheel-plugin"></div>

<!-- Initialize wheel default options -->
<script>
  new WheelPlugin();
</script>
```

## Examples:

– Absolute/centered/right wheel:

```js
new WheelPlugin({
  wheelAbsolutePosition: true,
});
```

<br>
– Absolute/centered/right small wheel:

```js
new WheelPlugin({
  wheelAbsolutePosition: true,
  wheelSizeBig: false,
});
```

<br>
– Auto rotate on load:

```js
new WheelPlugin({
  wheelAutoRotate: true,
});
```

<br>
– Wheel color and spin duration:

```js
new WheelPlugin({
  wheelColor: 'pink',
  wheelSpinDurationMs: 1000,
});
```

<br>
– Localize wheel (arabic):

```js
new WheelPlugin({
  wheelCenterText: 'تدور',
  wheelCenterTextLeftPosition: -9,
  wheelCenterTextStyle: 'font-size:12px',
  wheelMiniText: 'انقر للفوز',

  wheelSectors: ['30٪', '0٪', 'تدور', '50٪', '5٪', '10٪', '33٪', '20٪', '40٪', '0٪', '33٪', '20٪', '50٪', '10٪', '0٪'],

  winSectorTextReplace: 'اربح ٪50',
});
```

<br>
– Initialize your after win function:

```js
new WheelPlugin({
  initAfterWin: () => {
    alert('After Win Function')
  },
});
```

## Options default:

```js
defaultOptions = {
  wheelAbsolutePosition: false,
  wheelAutoRotate: false,
  wheelCenterText: 'SPIN',
  wheelCenterTextFillColor: 'black',
  wheelCenterTextLeftPosition: -11,
  wheelCenterTextStyle: 'font-size:10px',
  wheelColor: 'red',
  wheelMiniText: 'Click to win',
  wheelSectors: ['30%', '0%', 'SPIN IT', '50%', '5%', '10%', '33%', '20%', '40%', '0%', '33%', '20%', '50%', '10%', '0%'],
  wheelSizeBig: true,
  wheelSpinDurationMs: 7000,
  wheelShowPauseMs: null,
  wheelMaxHeight: 500,
  wheelMaxWidth: 500,
  winEnlargePauseMs: null,
  winEnlargedMinifyPauseMs: 1500,
  winSectorNumber: 4,
  winSectorTextReplace: '50% WIN',
  initAfterWin: () => {
  },
  initAfterWinPauseMs: 2500,
}
```

## Options description:

- `wheelAbsolutePosition`: [`null`,`boolean`] – set wheel with absolute/right/centered position
- `wheelAutoRotate`: [`null`,`boolean`] – set wheel auto rotate on load
- `wheelCenterText`: [`null`,`string`] – set wheel center button text
- `wheelCenterTextFillColor` [`null`,`string`] – set wheel center button text fill color
- `wheelCenterTextLeftPosition` [`null`,`integer`] – set wheel center button text position number from left
- `wheelCenterTextStyle` [`null`,`string`] – set wheel center button text style value
- `wheelColor`: [`null`,`string`] – set wheel color: purple, pink, blue, green, orange, turquoise, grey, red, lgbtq
- `wheelMiniText`: [`null`,`string`] – set wheel small button hover text
- `wheelSectors`: [`array`] – set wheel sectors array from 6 to 15
- `wheelSizeBig`: [`null`,`boolean`] – set wheel size big or else small button
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
