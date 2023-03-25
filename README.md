# Wheel Of Fortune

A `Wheel Of Fortune` spinner plugin for users traffic arbitrage. Beautiful, interactive, clean javascript!

<div style="text-align: center;"><img src="https://raw.githubusercontent.com/homcenco/plugins-wheel-of-fortune/main/docs/big-wheel.gif" width="300px"> <img src="https://raw.githubusercontent.com/homcenco/plugins-wheel-of-fortune/main/docs/small-wheel.gif" width="300px"></div>

## Install:

– Install wheel easily in your website or page:

```html
<!-- Insert plugin style -->
<link rel="stylesheet" href="./src/wheel.plugin.css"/>

<!-- Insert plugin container -->
<div id="wheel-plugin" class="wheel-plugin"></div>

<!-- Insert plugin script -->
<script src="./src/wheel.plugin.js"></script>
<script>
  const wheel = new WheelPlugin();
  wheel.showBigSpinner()
</script>
```

– Initialize quickly with small button wheel or big wheel:

```js
const wheel = new WheelPlugin();
// Small button wheel 
wheel.showSmallSpinner()
// OR Big wheel 
wheel.showBigSpinner()
```

## Config:

– Array big wheel sectors (ex: `winSectors: [ '0%', '30%', 'SPIN IT', '10%', '25%', '40%', '0%', '50%']`)

– Autorotate big wheel on page load (ex: `wheelAutoRotate: true`)

– Autoscroll after win to tag with `id=` name (ex: `winSectorScrollToId: 'scrollTo'` - id name is scrollTo)

– Position theme: fixed right, relative - is false (ex: `wheelPluginPosition: false`)

– Replace win sector text and show it (ex: `winSectorTextReplace: '50% WIN'`)

– Preset win sector number that will always be shown/won (ex: `winSectorNumber: 8` - 50%)

– Set small button wheel info text (ex: `wheelMiniText: 'Click to win a prise!'`)

– Spin duration in milliseconds (ex: `winRotationDurationMs: 10000` - 10 seconds)

– Style theme: purple, pink, blue, green, orange, turquoise, grey, red, lgbtq (ex: `colorStyle: 'purple'`)

– Show small button wheel with a delay in milliseconds (ex: `wheelShowTimeoutMs: 300`)

– Set big wheel max-width and max-height in pixels (ex: `wheelMaxHeight: 500` `wheelMaxWidth: 500`)
