/**
 * @author Vasili Homcenco <homcenco@gmail.com>
 * @github https://github.com/homcenco/plugins-wheel-of-fortune
 * @example https://homcenco.github.io/plugins-wheel-of-fortune/
 */

function WheelPlugin(options) {
  //let _this = this;

  // --------------------------------
  // --- DEFAULT OPTIONS FALLBACK ---
  // --------------------------------

  let defaultOptions = {
    colorStyle: 'purple',
    wheelAutoRotate: false,
    wheelCenterText: 'SPIN',
    wheelCenterTextFillColor: 'black',
    wheelCenterTextLeftPosition: -11,
    wheelCenterTextStyle: 'font-size:10px',
    wheelMiniText: 'Click to win',
    wheelPluginPosition: false,
    wheelSectors: ['30%', '0%', 'SPIN IT', '50%', '5%', '10%', '33%', '20%', '40%', '0%', '33%', '20%', '50%', '10%', '0%'],
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

  options = {...defaultOptions, ...options};


  // -----------------------------
  // --- DEFAULT OPTIONS SETUP ---
  // -----------------------------

  // set wheel color: purple, pink, blue, green, orange, turquoise, grey, red, lgbtq
  const colorStyleArray = [
    'purple', 'pink', 'blue', 'green', 'orange', 'turquoise', 'grey', 'red', 'lgbtq'
  ]
  const colorStyle = colorStyleArray.includes(options.colorStyle) ?
    options.colorStyle : defaultOptions.colorStyle
  // set wheel auto rotate on load
  const wheelAutoRotate = options.wheelAutoRotate
  // set wheel center button text
  const wheelCenterText = options.wheelCenterText
  // set wheel center button text fill color
  const wheelCenterTextFillColor = options.wheelCenterTextFillColor
  // set wheel center button text position number from left
  const wheelCenterTextLeftPosition = options.wheelCenterTextLeftPosition
  // set wheel center button text style value
  const wheelCenterTextStyle = options.wheelCenterTextStyle
  // set wheel small button hover text
  const wheelMiniText = options.wheelMiniText
  // set wheel with absolute/right/centered position
  const wheelPluginPosition = options.wheelPluginPosition
  // set wheel sectors array from 6 to 15
  const wheelSectorsCount = options.wheelSectors.length
  const wheelSectors = wheelSectorsCount < 6 && wheelSectorsCount > 15 ?
    defaultOptions.wheelSectors : options.wheelSectors
  //  set wheel spin duration time in milliseconds
  const wheelSpinDurationMs = options.wheelSpinDurationMs
  // set wheel small button show after pause in milliseconds
  const wheelShowPauseMs = options.wheelShowPauseMs
  // set wheel max height number
  const wheelMaxHeight = options.wheelMaxHeight
  // set wheel max width number
  const wheelMaxWidth = options.wheelMaxWidth
  // set wheel win sector enlarge duration time in milliseconds
  const winEnlargePauseMs = options.winEnlargePauseMs

  // set wheel sector enlarged minify duration time in milliseconds
  const winEnlargedMinifyPauseMs = options.winEnlargedMinifyPauseMs
  // set win sector number to show
  const winSectorNumber = options.winSectorNumber - 1
  // set win sector text replace
  const winSectorTextReplace = options.winSectorTextReplace

  // set your after win function
  const initAfterWin = options.initAfterWin
  // set your after win function show after pause in milliseconds
  const initAfterWinPauseMs = options.initAfterWinPauseMs


  // --------------------------
  // --- SCRIPT BUG UPDATES ---
  // --------------------------

  // Fixes errors in some browsers
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }


  // -------------------
  // --- SCRIPT MATH ---
  // -------------------

  // These values are established by empiricism with tests
  // (tradeoff: performance VS precision)
  const NEWTON_ITERATIONS = 4;
  const NEWTON_MIN_SLOPE = 0.001;
  const SUBDIVISION_PRECISION = 0.0000001;
  const SUBDIVISION_MAX_ITERATIONS = 10;

  const kSplineTableSize = 11;
  const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  const float32ArraySupported = typeof Float32Array === 'function';

  function A(aA1, aA2) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1;
  }

  function B(aA1, aA2) {
    return 3.0 * aA2 - 6.0 * aA1;
  }

  function C(aA1) {
    return 3.0 * aA1;
  }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  function getSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    let currentX,
      currentT,
      i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
      const currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) {
        return aGuessT;
      }
      const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }

  function LinearEasing(x) {
    return x;
  }

  function bezier(mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      throw new Error('bezier x values must be in [0, 1] range');
    }

    if (mX1 === mY1 && mX2 === mY2) {
      return LinearEasing;
    }

    // Precompute samples table
    const sampleValues = float32ArraySupported
      ? new Float32Array(kSplineTableSize)
      : new Array(kSplineTableSize);
    for (let i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }

    function getTForX(aX) {
      let intervalStart = 0.0;
      let currentSample = 1;
      const lastSample = kSplineTableSize - 1;

      for (
        ;
        currentSample !== lastSample && sampleValues[currentSample] <= aX;
        ++currentSample
      ) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;

      // Interpolate to provide an initial guess for t
      const dist =
        (aX - sampleValues[currentSample]) /
        (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      const guessForT = intervalStart + dist * kSampleStepSize;

      const initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function BezierEasing(x) {
      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
      if (x === 0 || x === 1) {
        return x;
      }
      return calcBezier(getTForX(x), mY1, mY2);
    };
  }


  // ------------------
  // --- WHEEL HTML ---
  // ------------------

  // Add wheelPluginHtml to tag with id="wheel-plugin"
  document.querySelector('#wheel-plugin').innerHTML = '<div class="wheel-plugin-box">\n' +
    '  <svg style="display: none" xmlns="http://www.w3.org/2000/svg">\n' +
    '    <defs>\n' +
    '      <symbol id="wheel-plugin-logo" fill="none" viewBox="-50 -50 100 100">\n' +
    '        <circle r="49" stroke="#F7DC78" stroke-width="2"></circle>\n' +
    '        <circle id="wheel-plugin-logo-sectors1" r="45" fill="#F7DC78"></circle>\n' +
    '        <circle id="wheel-plugin-logo-sectors2" r="25" fill="transparent" stroke-width="40" stroke="#8300c0"\n' +
    '                stroke-dasharray="13.1 13.1"\n' +
    '                style="transform: rotate(0deg)"></circle>\n' +
    '        <circle id="wheel-plugin-logo-bulb" r="10" fill="#8300c0" stroke="#F7DC78" stroke-width="1.2"></circle>\n' +
    '        <circle r="6" fill="#F7DC78"></circle>\n' +
    '      </symbol>\n' +
    '      <symbol id="wheel-plugin-lgbtqLogo" fill="none" viewBox="-50 -50 100 100">\n' +
    '        <circle r="49" stroke="#F7DC78" stroke-width="2"></circle>\n' +
    '        <circle r="45" fill="#A010A2"></circle>\n' +
    '        <circle r="25" fill="transparent" stroke-width="40" stroke="#1963FF" stroke-dasharray="13.1 65.5"\n' +
    '                style="transform: rotate(45deg)"></circle>\n' +
    '        <circle r="25" fill="transparent" stroke-width="40" stroke="#00A832" stroke-dasharray="13.1 65.5"\n' +
    '                style="transform: rotate(15deg)"></circle>\n' +
    '        <circle r="25" fill="transparent" stroke-width="40" stroke="#FFED00" stroke-dasharray="13.1 65.5"\n' +
    '                style="transform: rotate(-15deg)"></circle>\n' +
    '        <circle r="25" fill="transparent" stroke-width="40" stroke="#FF9200" stroke-dasharray="13.1 65.5"\n' +
    '                style="transform: rotate(-45deg)"></circle>\n' +
    '        <circle r="25" fill="transparent" stroke-width="40" stroke="#F40B0C" stroke-dasharray="13.1 65.5"\n' +
    '                style="transform: rotate(-75deg)"></circle>\n' +
    '        <circle r="10" fill="#A010A2" stroke="#F7DC78" stroke-width="1.2"></circle>\n' +
    '        <circle r="6" fill="#F7DC78"></circle>\n' +
    '      </symbol>\n' +
    '\n' +
    '      <symbol id="close" viewBox="0 0 100 100">\n' +
    '        <path fill="currentColor"\n' +
    '              d="M95.497 82.93l-32.7-32.7 32.7-32.701a8.992 8.992 0 0 0 0-12.745 8.992 8.992 0 0 0-12.744 0l-32.701 32.7-32.701-32.7a8.992 8.992 0 0 0-12.745 0 8.992 8.992 0 0 0 0 12.745l32.7 32.7-32.7 32.702a8.992 8.992 0 0 0 0 12.744 8.992 8.992 0 0 0 12.745 0l32.7-32.7 32.702 32.7a8.992 8.992 0 0 0 12.744 0c3.506-3.53 3.506-9.239 0-12.744z"></path>\n' +
    '      </symbol>\n' +
    '    </defs>\n' +
    '  </svg>\n' +
    '  <div id="wheel-plugin-buttons" class="wheel-plugin-buttons">\n' +
    '    <button id="wheel-plugin-button-small" class="small" data-tooltip="Wheel of Fortune">\n' +
    '      <svg id="small-wheel" width="36" height="36" viewBox="0 0 37 37" xmlns="http://www.w3.org/2000/svg">\n' +
    '        <use xlink:href="#wheel-plugin-logo" x="0" y="0" width="37" height="37"></use>\n' +
    '      </svg>\n' +
    '    </button>\n' +
    '  </div>\n' +
    '  <div class="wheel-container">\n' +
    '    <svg viewBox="-205 -180 385 360" id="wheel" xmlns="http://www.w3.org/2000/svg">\n' +
    '      <defs>\n' +
    '        <radialGradient id="bulbGradient" cx="0" cy="31" r="56" gradientUnits="userSpaceOnUse">\n' +
    '          <stop offset="0" stop-color="#000"></stop>\n' +
    '          <stop offset="100%" stop-color="#000"></stop>\n' +
    '        </radialGradient>\n' +
    '\n' +
    '        <linearGradient id="lgbtqGradient" gradientTransform="rotate(90) translate(-0.25, 0) scale(1.2)">\n' +
    '          <stop stop-color="#FF0000" offset="20%"></stop>\n' +
    '          <stop stop-color="#FFDF00" offset="40%"></stop>\n' +
    '          <stop stop-color="#4EE837" offset="60%"></stop>\n' +
    '          <stop stop-color="#3872F4" offset="80%"></stop>\n' +
    '          <stop stop-color="#E229FF" offset="100%"></stop>\n' +
    '        </linearGradient>\n' +
    '\n' +
    '        <linearGradient id="goldGradient" gradientTransform="rotate(75)">\n' +
    '          <stop offset="0%" stop-color="#FEF8E7"></stop>\n' +
    '          <stop offset="10%" stop-color="#FDF8E9"></stop>\n' +
    '          <stop offset="60%" stop-color="#E6CA6E"></stop>\n' +
    '          <stop offset="100%" stop-color="#E2BD58"></stop>\n' +
    '        </linearGradient>\n' +
    '\n' +
    '        <linearGradient id="goldGradient2" gradientTransform="rotate(75)">\n' +
    '          <stop offset="0%" stop-color="#FDF6B6"></stop>\n' +
    '          <stop offset="60%" stop-color="#E6CA6E"></stop>\n' +
    '          <stop offset="100%" stop-color="#E2BD58"></stop>\n' +
    '        </linearGradient>\n' +
    '\n' +
    '        <filter id="shadow" width="150%" height="150%">\n' +
    '          <feDropShadow dx="2" dy="2.5" stdDeviation="5" flood-color="black" flood-opacity="0.5"></feDropShadow>\n' +
    '        </filter>\n' +
    '\n' +
    '        <filter id="shadow2" width="150%" height="150%">\n' +
    '          <feDropShadow dx="2" dy="2.5" stdDeviation="3" flood-color="black" flood-opacity="0.5"></feDropShadow>\n' +
    '        </filter>\n' +
    '\n' +
    '        <filter id="light" width="120%" height="120%">\n' +
    '          <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#ffffff" flood-opacity="1"></feDropShadow>\n' +
    '        </filter>\n' +
    '\n' +
    '        <filter id="shadow1">\n' +
    '          <feGaussianBlur in="SourceAlpha" stdDeviation="3"></feGaussianBlur>\n' +
    '          <!-- stdDeviation is how much to blur -->\n' +
    '          <feOffset dx="2" dy="2" result="offsetblur"></feOffset>\n' +
    '          <!-- how much to offset -->\n' +
    '          <feComponentTransfer>\n' +
    '            <feFuncA type="linear" slope="0.5"></feFuncA>\n' +
    '            <!-- slope is the opacity of the shadow -->\n' +
    '          </feComponentTransfer>\n' +
    '          <feMerge>\n' +
    '            <feMergeNode></feMergeNode>\n' +
    '            <!-- this contains the offset blurred image -->\n' +
    '            <feMergeNode in="SourceGraphic"></feMergeNode>\n' +
    '            <!-- this contains the element that the filter is applied to -->\n' +
    '          </feMerge>\n' +
    '        </filter>\n' +
    '        <linearGradient id="textGradient" gradientUnits="objectBoundingBox">\n' +
    '          <stop stop-color="white" offset="0%"></stop>\n' +
    '          <stop stop-color="white" offset="55%"></stop>\n' +
    '          <stop stop-color="black" offset="77%"></stop>\n' +
    '          <stop stop-color="black" offset="100%"></stop>\n' +
    '        </linearGradient>\n' +
    '\n' +
    '        <linearGradient id="spotlight" x1="-60%" x2="40%" gradientTransform="rotate(-20)">\n' +
    '          <stop offset="0%" stop-color="#fff" stop-opacity="0"></stop>\n' +
    '          <stop offset="20%" stop-color="#fff" stop-opacity="0.5"></stop>\n' +
    '          <stop offset="40%" stop-color="#fff" stop-opacity="0"></stop>\n' +
    '          <animate attributeName="x1" from="-60%" to="100%" repeatCount="1" begin="indefinite" dur="1s"\n' +
    '                   fill="freeze"></animate>\n' +
    '          <animate attributeName="x2" from="40%" to="200%" repeatCount="1" begin="indefinite" dur="1s"\n' +
    '                   fill="freeze"></animate>\n' +
    '        </linearGradient>\n' +
    '\n' +
    '        <mask id="gradientMask">\n' +
    '          <path\n' +
    '            d="M 0 0 L -135.96598839415688 -78.49999999999999 A 157 157 0 0 0 -135.96598839415688 78.49999999999999 Z"\n' +
    '            fill="url(#textGradient)"></path>\n' +
    '        </mask>\n' +
    '      </defs>\n' +
    '\n' +
    '      <g class="back">\n' +
    '        <circle cx="0" cy="0" r="178" fill="#101010" stroke-width="4" stroke="url(#goldGradient2)"></circle>\n' +
    '      </g>\n' +
    '\n' +
    '      <g class="lights">\n' +
    '        <circle cx="-144.05798382648987" cy="-82.4821028820603" r="4" fill="#ffffff"></circle>\n' +
    '        <circle cx="-117.75929029235634" cy="-116.99892969527778" r="4" fill="url(#goldGradient)"></circle>\n' +
    '        <circle cx="-83.41354405381018" cy="-143.52066286212263" r="4" fill="#ffffff"></circle>\n' +
    '        <circle cx="-43.36775339756742" cy="-160.23494614236864" r="4" fill="url(#goldGradient)"></circle>\n' +
    '        <circle cx="-0.35843777105876484" cy="-165.99961301871846" r="4" fill="#ffffff"></circle>\n' +
    '        <circle cx="42.67537161409774" cy="-160.4207363703292" r="4" fill="url(#goldGradient)"></circle>\n' +
    '        <circle cx="82.7929697711935" cy="-143.87954738761948" r="4" fill="#ffffff"></circle>\n' +
    '        <circle cx="117.25293030454344" cy="-117.50638423080628" r="4" fill="url(#goldGradient)"></circle>\n' +
    '        <circle cx="143.70044012113902" cy="-83.10345064430803" r="4" fill="#ffffff"></circle>\n' +
    '        <circle cx="160.32821501549418" cy="-43.021662798472384" r="4" fill="url(#goldGradient)"></circle>\n' +
    '        <circle cx="166" cy="-2.0329136865846063e-14" r="4" fill="#ffffff"></circle>\n' +
    '        <circle cx="160.3282150154942" cy="43.02166279847235" r="4" fill="url(#goldGradient)"></circle>\n' +
    '        <circle cx="143.700440121139" cy="83.10345064430807" r="4" fill="#ffffff"></circle>\n' +
    '        <circle cx="117.25293030454343" cy="117.50638423080629" r="4" fill="url(#goldGradient)"></circle>\n' +
    '        <circle cx="82.79296977119353" cy="143.87954738761948" r="4" fill="#ffffff"></circle>\n' +
    '        <circle cx="42.67537161409774" cy="160.4207363703292" r="4" fill="url(#goldGradient)"></circle>\n' +
    '        <circle cx="-0.3584377710588348" cy="165.99961301871846" r="4" fill="#ffffff"></circle>\n' +
    '        <circle cx="-43.36775339756756" cy="160.2349461423686" r="4" fill="url(#goldGradient)"></circle>\n' +
    '        <circle cx="-83.41354405381007" cy="143.52066286212272" r="4" fill="#ffffff"></circle>\n' +
    '        <circle cx="-117.7592902923563" cy="116.99892969527781" r="4" fill="url(#goldGradient)"></circle>\n' +
    '        <circle cx="-144.0579838264899" cy="82.48210288206027" r="4" fill="#ffffff"></circle>\n' +
    '      </g>\n' +
    '\n' +
    '      <g class="rotating">\n' +
    '        <g id="wheelSectors" class="sectors" style="display: initial"></g>\n' +
    '      </g>\n' +
    '\n' +
    '      <circle cx="0" cy="0" r="180" fill="#101010" class="darken"></circle>\n' +
    '\n' +
    '      <g class="chosen-sector"></g>\n' +
    '\n' +
    '      <g class="frame">\n' +
    '        <path d="M 0 0 L -135.96598839415688 -78.49999999999999 A 157 157 0 0 0 -135.96598839415688 78.49999999999999 Z"\n' +
    '              fill="transparent" class="lighten"></path>\n' +
    '        <path d="M 0 0 L -135.96598839415688 -78.49999999999999 A 157 157 0 0 0 -135.96598839415688 78.49999999999999 Z"\n' +
    '              fill="transparent" class="frame-stroke" stroke="url(#goldGradient2)" stroke-width="5"\n' +
    '              filter="url(#shadow)"></path>\n' +
    '        <path d="M 0 0 L -135.96598839415688 -78.49999999999999 A 157 157 0 0 0 -135.96598839415688 78.49999999999999 Z"\n' +
    '              fill="url(#spotlight)" stroke="url(#spotlight)" class="frame-spotlight" stroke-width="5"></path>\n' +
    '      </g>\n' +
    '\n' +
    '      <g class="arc">\n' +
    '        <path\n' +
    '          d="M -167.8189222090862 -65.09077775369316 A 180 180 0 0 0 -167.8189222090862 65.09077775369316 L -159.8811560562974 54.76327179873275 A 169 169 0 0 1 -159.8811560562974 -54.76327179873275 Z"\n' +
    '          fill="url(#goldGradient)"></path>\n' +
    '      </g>\n' +
    '\n' +
    '      <g class="bulb">\n' +
    '        <circle class="bulb-top" cx="0" cy="0" r="32" fill="url(#bulbGradient)" stroke-width="4"\n' +
    '                stroke="url(#goldGradient2)" filter="url(#shadow2)"></circle>\n' +
    '        <circle cx="0" cy="0" r="20" fill="url(#goldGradient)" filter="url(#shadow)"></circle>\n' +
    '        <text style="' + wheelCenterTextStyle + '" fill="' + wheelCenterTextFillColor + '" x="' + wheelCenterTextLeftPosition + '" y="4">' + wheelCenterText + '</text>\n' +
    '        <circle cx="0" cy="0" r="20" fill="url(#goldGradient)" filter="url(#shadow)"></circle>\n' +
    '      </g>\n' +
    '\n' +
    '      <g class="triangle">\n' +
    '        <path class="triangle-bottom"\n' +
    '              d="M -182 -19 A 3 3 0 0 0 -186 -17 V 17 A 3 3 0 0 0 -183 19 L -153 2 A 5 5 0 0 0 -153 -2 Z"\n' +
    '              stroke="url(#goldGradient)" fill="url(#goldGradient2)" stroke-width="4" filter="url(#shadow2)"></path>\n' +
    '        <circle cx="-173" cy="0" r="4" fill="#ffffff"></circle>\n' +
    '      </g>\n' +
    '    </svg>\n' +
    '\n' +
    '    <button class="close">\n' +
    '      <svg width="15" height="15" viewBox="0 0 100 100">\n' +
    '        <use xlink:href="#close"></use>\n' +
    '      </svg>\n' +
    '    </button>\n' +
    '    <div id="wheel-from-above-shadow"></div>\n' +
    '  </div>\n' +
    '</div>\n'


  // -----------------------
  // --- WHEEL VARIABLES ---
  // -----------------------

  // Query variables
  const wheelPlugin = document.querySelector('#wheel-plugin');
  const buttonsContainer = wheelPlugin.querySelector('#wheel-plugin-buttons');
  const buttonsSmallWheel = wheelPlugin.querySelector('#wheel-plugin-button-small');
  const buttonsSmallWheelUse = buttonsSmallWheel.querySelector('use');

  const logoSectors1El = wheelPlugin.querySelector('#wheel-plugin-logo-sectors1');
  const logoSectors2El = wheelPlugin.querySelector('#wheel-plugin-logo-sectors2');
  const logoBulbEl = wheelPlugin.querySelector('#wheel-plugin-logo-bulb');
  const wheelFromAboveShadowEl = wheelPlugin.querySelector('#wheel-from-above-shadow');

  const wheelContainer = wheelPlugin.querySelector('.wheel-container');
  const wheelSectorsContainer = wheelContainer.querySelector('#wheelSectors');
  const arcEl = wheelContainer.querySelector('.arc');
  const lightsContainer = wheelContainer.querySelector('.lights');
  const darkenEl = wheelContainer.querySelector('.darken');
  const chosenSectorEl = wheelContainer.querySelector('.chosen-sector');
  const frameEl = wheelContainer.querySelector('.frame');
  const triangle = wheelContainer.querySelector('.triangle');
  const wheelRotatingEl = wheelContainer.querySelector('.rotating');
  const bulbTopEl = wheelContainer.querySelector('.bulb-top');
  const triangleBottomEl = wheelContainer.querySelector('.triangle-bottom');
  const closeEl = wheelContainer.querySelector('.close');
  const spotlight = wheelContainer.querySelectorAll('#spotlight animate');

  const defsEl = wheelContainer.querySelector('defs');
  const bulbGradientEl = defsEl.querySelector('#bulbGradient');

  // Boolean variables
  let currentWheelAngleDeg = false
  let sectorTexts = false
  let showWheel = false
  let isSpinning = false
  let isSlowlyRotating = false

  // Math variables
  const b = bezier(0.1, 0, 0.1, 1)
  const frameSlugOuterAngle = 0.37;
  const frameSlugInnerAngle = 0.33;
  const frameSlugWidth = 11;
  const fullR = 180;
  const r = 157
  const sliceDeg = 360 / wheelSectorsCount;

  // Colors red
  const redColor1 = '#bf0000';
  const redColor2 = '#8b0203';
  const redColor3 = '#590101';
  const redColorGrad1 = '#a60300';
  const redColorGrad2 = '#f12008';
  const redColors = {
    6: [redColor1, redColor2, redColor3, redColor1, redColor2, redColor3],
    7: [redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor2],
    8: [redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2],
    9: [redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2, redColor3],
    10: [redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1],
    11: [redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2],
    12: [redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2, redColor3],
    13: [redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1],
    14: [redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2],
    15: [redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2, redColor3, redColor1, redColor2, redColor3]
  };

  // Colors purple
  const purpleColor1 = '#8300c0';
  const purpleColor2 = '#60028b';
  const purpleColor3 = '#3d0159';
  const purpleColorGrad1 = '#7100a6';
  const purpleColorGrad2 = '#a708f1';
  const purpleColors = {
    6: [purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3],
    7: [purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor2],
    8: [purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2],
    9: [purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3],
    10: [purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor2],
    11: [purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2],
    12: [purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3],
    13: [purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1],
    14: [purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2],
    15: [purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3, purpleColor1, purpleColor2, purpleColor3]
  };

  // Colors pink
  const pinkColor1 = '#C000A0';
  const pinkColor2 = '#8B0274';
  const pinkColor3 = '#59014B';
  const pinkColorGrad1 = '#A6008A';
  const pinkColorGrad2 = '#F108CA';
  const pinkColors = {
    6: [pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3],
    7: [pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor2],
    8: [pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2],
    9: [pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3],
    10: [pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor2],
    11: [pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2],
    12: [pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3],
    13: [pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1],
    14: [pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2],
    15: [pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3, pinkColor1, pinkColor2, pinkColor3]
  };

  // Colors blue
  const blueColor1 = '#0070C0';
  const blueColor2 = '#02528B';
  const blueColor3 = '#013559';
  const blueColorGrad1 = '#0061A6';
  const blueColorGrad2 = '#0890F1';
  const blueColors = {
    6: [blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3],
    7: [blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor2],
    8: [blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2],
    9: [blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3],
    10: [blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor2],
    11: [blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2],
    12: [blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3],
    13: [blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1],
    14: [blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2],
    15: [blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3, blueColor1, blueColor2, blueColor3]
  };

  // Colors green
  const greenColor1 = '#10c000';
  const greenColor2 = '#0d8b02';
  const greenColor3 = '#085901';
  const greenColorGrad1 = '#0ea600';
  const greenColorGrad2 = '#1bf108';
  const greenColors = {
    6: [greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3],
    7: [greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor2],
    8: [greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2],
    9: [greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3],
    10: [greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor2],
    11: [greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2],
    12: [greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3],
    13: [greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1],
    14: [greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2],
    15: [greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3, greenColor1, greenColor2, greenColor3]
  };

  // Colors orange
  const orangeColor1 = '#D27E00';
  const orangeColor2 = '#8B5902';
  const orangeColor3 = '#593901';
  const orangeColorGrad1 = '#A66900';
  const orangeColorGrad2 = '#F19C08';
  const orangeColors = {
    6: [orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3],
    7: [orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor2],
    8: [orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2],
    9: [orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3],
    10: [orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor2],
    11: [orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2],
    12: [orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3],
    13: [orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1],
    14: [orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2],
    15: [orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3, orangeColor1, orangeColor2, orangeColor3]
  };

  // Colors turquoise
  const turquoiseColor1 = '#00D2C4';
  const turquoiseColor2 = '#028B82';
  const turquoiseColor3 = '#015953';
  const turquoiseColorGrad1 = '#00A69B';
  const turquoiseColorGrad2 = '#08F1E2';
  const turquoiseColors = {
    6: [turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3],
    7: [turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor2],
    8: [turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2],
    9: [turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3],
    10: [turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor2],
    11: [turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2],
    12: [turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3],
    13: [turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1],
    14: [turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2],
    15: [turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColor1, turquoiseColor2, turquoiseColor3]
  };

  // Colors grey
  const greyColor1 = '#696969';
  const greyColor2 = '#474747';
  const greyColor3 = '#2D2D2D';
  const greyColorGrad1 = '#535353';
  const greyColorGrad2 = '#7D7D7D';
  const greyColors = {
    6: [greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3],
    7: [greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor2],
    8: [greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2],
    9: [greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3],
    10: [greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor2],
    11: [greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2],
    12: [greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3],
    13: [greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1],
    14: [greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2],
    15: [greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3, greyColor1, greyColor2, greyColor3]
  };

  // Colors lgbtq
  const lgbtqColor1 = '#A010A2';
  const lgbtqColor2 = '#1A63FF';
  const lgbtqColor3 = '#00A832';
  const lgbtqColor4 = '#FFED00';
  const lgbtqColor5 = '#FF9200';
  const lgbtqColor6 = '#F40B0C';
  const lgbtqTextColor = '#101010';
  const lgbtqColors = {
    6: [lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6],
    7: [lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6, lgbtqColor3],
    8: [lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6, lgbtqColor3, lgbtqColor4],
    9: [lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6, lgbtqColor2, lgbtqColor3, lgbtqColor4],
    10: [lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6, lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4],
    11: [lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6, lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5],
    12: [lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6, lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6],
    13: [lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6, lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6, lgbtqColor1],
    14: [lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6, lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6, lgbtqColor1, lgbtqColor2],
    15: [lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6, lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor4, lgbtqColor5, lgbtqColor6, lgbtqColor1, lgbtqColor2, lgbtqColor3]
  };


  // -------------------------
  // --- WHEEL GET HELPERS ---
  // -------------------------

  function getX(r, deg) {
    return Math.cos(deg) * r;
  }

  function getY(r, deg) {
    return Math.sin(deg) * r;
  }

  function getSlice(count) {
    return (2 * Math.PI) / count;
  }

  function getArcEnter(r, slice) {
    return -getX(r, slice / 2) + ' ' + -getY(r, slice / 2);
  }

  function getArcExit(r, slice) {
    return -getX(r, slice / 2) + ' ' + getY(r, slice / 2);
  }

  function getSlowlyRotateNewAngleDeg(timeSinceStart) {
    return (-timeSinceStart * 8) / 1000;
  }


  function getSector(arcEnter, arcExit, color, rotate, text, textColor) {
    return '<g '
      .concat('class="sector">\n')
      .concat('<path d="M 0 0 L ', arcEnter, ' A ', r, ' ', r, ' 0 0 0 ', arcExit, ' Z" ')
      .concat('fill="', color, '" ')
      .concat('style="transform: rotate(', rotate, 'rad);" />\n')
      .concat('<text x="', -r + 18, '" y="0" dy="0.32em" class="sector-text" ')
      .concat('style="transform: rotate(' + rotate + 'rad);" ')
      .concat('fill="' + (textColor ? textColor : 'white') + '" mask="url(#gradientMask)">\n')
      .concat(text, '</text>\n</g>');
  }


  // ------------------------
  // --- WHEEL GET COLORS ---
  // ------------------------

  function getColor(color, count, i) {
    switch (color) {
      case 'purple':
        return purpleColors[count][i % count];
      case 'pink':
        return pinkColors[count][i % count];
      case 'blue':
        return blueColors[count][i % count];
      case 'green':
        return greenColors[count][i % count];
      case 'orange':
        return orangeColors[count][i % count];
      case 'turquoise':
        return turquoiseColors[count][i % count];
      case 'grey':
        return greyColors[count][i % count];
      case 'lgbtq':
        return lgbtqColors[count][i % count];
      case 'red':
        return redColors[count][i % count];
      default:
        return purpleColors[count][i % count];
    }
  }

  function getStaticElementColorGrad(colorStyle) {
    switch (colorStyle) {
      case 'purple':
        return [purpleColorGrad1, purpleColorGrad2];
      case 'pink':
        return [pinkColorGrad1, pinkColorGrad2];
      case 'blue':
        return [blueColorGrad1, blueColorGrad2];
      case 'green':
        return [greenColorGrad1, greenColorGrad2];
      case 'orange':
        return [orangeColorGrad1, orangeColorGrad2];
      case 'turquoise':
        return [turquoiseColorGrad1, turquoiseColorGrad2];
      case 'grey':
        return [greyColorGrad1, greyColorGrad2];
      case 'red':
        return [redColorGrad1, redColorGrad2];
      default:
        return [purpleColorGrad1, purpleColorGrad2];
    }
  }

  function getLogoColors(colorStyle) {
    switch (colorStyle) {
      case 'purple':
        return [purpleColor1, purpleColor2, purpleColor3, purpleColorGrad1];
      case 'pink':
        return [pinkColor1, pinkColor2, pinkColor3, pinkColorGrad1];
      case 'blue':
        return [blueColor1, blueColor2, blueColor3, blueColorGrad1];
      case 'green':
        return [greenColor1, greenColor2, greenColor3, greenColorGrad1];
      case 'orange':
        return [orangeColor1, orangeColor2, orangeColor3, orangeColorGrad1];
      case 'turquoise':
        return [turquoiseColor1, turquoiseColor2, turquoiseColor3, turquoiseColorGrad1];
      case 'grey':
        return [greyColor1, greyColor2, greyColor3, greyColorGrad1];
      case 'lgbtq':
        return [lgbtqColor1, lgbtqColor2, lgbtqColor3, lgbtqColor1];
      case 'red':
        return [redColor1, redColor2, redColor3, redColorGrad1];
      default:
        return [purpleColor1, purpleColor2, purpleColor3, purpleColorGrad1];
    }
  }

  function getLightenColor(colorStyle, currentColor) {
    switch (colorStyle) {
      case 'purple':
        return purpleColor1;
      case 'pink':
        return pinkColor1;
      case 'blue':
        return blueColor1;
      case 'green':
        return greenColor1;
      case 'orange':
        return orangeColor1;
      case 'turquoise':
        return turquoiseColor1;
      case 'grey':
        return greyColor1;
      case 'lgbtq':
        return currentColor;
      case 'red':
        return redColor1;
      default:
        return purpleColor1;
    }
  }

  function getLightsColor(colorStyle) {
    switch (colorStyle) {
      case 'purple':
        return ["#ffffff", "#goldGradient"];
      case 'pink':
        return ["#ffffff", "#goldGradient"];
      case 'blue':
        return ["#ffffff", "#bulbGradient"];
      case 'green':
        return ["#ffffff", "#goldGradient"];
      case 'orange':
        return ["#ffffff", "#goldGradient"];
      case 'turquoise':
        return ["#ffffff", "#goldGradient"];
      case 'grey':
        return ["#ffffff", "#goldGradient"];
      case 'lgbtq':
        return ["#ffffff", "#lgbtqGradient"];
      case 'red':
        return ["#ffffff", "#goldGradient"];
      default:
        return ["#ffffff", "#goldGradient"];
    }
  }

  function getFrameColor(colorStyle) {
    switch (colorStyle) {
      case 'purple':
        return ["#goldGradient", "#goldGradient"];
      case 'pink':
        return ["#goldGradient", "#goldGradient"];
      case 'blue':
        return ["#goldGradient", "#bulbGradient"];
      case 'green':
        return ["#goldGradient", "#goldGradient"];
      case 'orange':
        return ["#goldGradient", "#goldGradient"];
      case 'turquoise':
        return ["#goldGradient", "#goldGradient"];
      case 'grey':
        return ["#goldGradient", "#goldGradient"];
      case 'lgbtq':
        return ["#goldGradient", "#goldGradient"];
      case 'red':
        return ["#goldGradient", "#goldGradient"];
      default:
        return ["#goldGradient", "#goldGradient"];
    }
  }


  // ----------------------
  // --- WHEEL UPDATERS ---
  // ----------------------

  function updateTexts(step, sectors, indexShift) {
    let count = 0;

    const sectorsCount = sectors.wheelSectors.length;

    while (count < sectorsCount) {
      const sectorTextIndex = (count + indexShift) % sectorsCount;
      const sectorsIndex = (count + step) % sectorsCount;
      sectorTexts[sectorTextIndex].innerHTML = sectors[sectorsIndex];
      count++;
    }
  }

  function updateTextsByAngleDeg(newAngleDeg, sectors) {
    const sectorsCount = sectors.length;
    const exceedsSectorsCount = sectorsCount > sectorsCount;

    if (exceedsSectorsCount) {
      const slicesCount = Math.floor(Math.abs(newAngleDeg) / sliceDeg);
      const step = slicesCount % sectorsCount;
      const bottomSectorIndexShift = Math.floor((Math.abs(newAngleDeg) % 360) / sliceDeg);
      updateTexts(step, sectors, bottomSectorIndexShift);
    }
  }

  function updateWheelRotationDeg(newAngleDeg) {
    currentWheelAngleDeg = newAngleDeg;
    wheelRotatingEl.style.transform = 'rotate(' + newAngleDeg + 'deg)';
  }


  // ---------------------
  // --- WHEEL ACTIONS ---
  // ---------------------

  function shouldEndSlowRotation() {
    if (!isSlowlyRotating) {
      return true;
    }
  }

  function stopSlowlyRotating() {
    isSlowlyRotating = false;
  }

  function rotateWheel(initialAngleDeg, newDeltaAngleDegFunc, endFunc, sectors) {
    let angleDegTextUpdate = initialAngleDeg;

    const startTime = performance.now();

    function animate(t) {
      const newDeltaAngleDeg = newDeltaAngleDegFunc(t - startTime);
      const newAngleDeg = initialAngleDeg + newDeltaAngleDeg;
      const moreThanSliceRotated = -newAngleDeg + angleDegTextUpdate >= sliceDeg;

      updateWheelRotationDeg(newAngleDeg);

      if (moreThanSliceRotated) {
        updateTextsByAngleDeg(newAngleDeg, sectors);
        angleDegTextUpdate = newAngleDeg;
      }

      if (endFunc(t - startTime)) {
        return;
      }

      requestAnimationFrame(animate);
    }

    animate(startTime);
  }

  function startSlowlyRotating() {
    if (isSpinning) {
      return;
    }

    isSlowlyRotating = true;

    rotateWheel(
      currentWheelAngleDeg,
      getSlowlyRotateNewAngleDeg,
      shouldEndSlowRotation,
      wheelSectors
    );
  }

  function changeStaticElementColorStyle(colorStyle) {
    if (colorStyle === 'lgbtq') {
      bulbTopEl.setAttribute('fill', 'url(#lgbtqGradient)');
      triangleBottomEl.setAttribute('fill', 'url(#lgbtqGradient)');
    } else {
      const colors = getStaticElementColorGrad(colorStyle);
      const color1 = colors[0];
      const color2 = colors[1];

      bulbGradientEl.innerHTML = '\n'
        .concat('<stop stop-color="' + color1 + '" />\n')
        .concat('<stop offset="100%" stop-color="' + color2 + '" />\n');
      bulbTopEl.setAttribute('fill', 'url(#bulbGradient)');
      triangleBottomEl.setAttribute('fill', 'url(#bulbGradient)');
    }
  }

  function changeWheelToRule() {
    showWheel = true

    setTimeout(function () {
      updateWheelRotationDeg(0);
      changeStaticElementColorStyle(colorStyle);

      if (showWheel) {
        setTimeout(function () {
          wheelContainer.classList.add('visible');
          (wheelAutoRotate) ? startSlowlyRotating() : true
        }, 50);
      }
    }, 300);
  }

  function spinWithAnimation() {
    stopSlowlyRotating();

    const initialAngleDeg = currentWheelAngleDeg;
    const allSectorsDeg = (wheelSectorsCount * 360) / wheelSectorsCount;
    const deltaToAllSectorsDeg = initialAngleDeg % allSectorsDeg;
    const firstSectorInBottomShiftDeg = -sliceDeg * 2;
    const fullAllSectorsRotations = allSectorsDeg * 6;
    const chosenSectorShift = -(
      Math.floor(winSectorNumber / wheelSectorsCount) * 360 +
      ((winSectorNumber % wheelSectorsCount) * 360) / wheelSectorsCount
    );
    const resultAngleDeg =
      initialAngleDeg -
      fullAllSectorsRotations -
      firstSectorInBottomShiftDeg -
      deltaToAllSectorsDeg +
      chosenSectorShift;
    const deltaAngleDeg = resultAngleDeg - initialAngleDeg;

    const slice = getSlice(wheelSectorsCount);
    const arcEnter = getArcEnter(r, slice);
    const arcExit = getArcExit(r, slice);
    const color = getColor(colorStyle, wheelSectorsCount, winSectorNumber);
    const text = wheelSectors[winSectorNumber];
    const sector = getSector(
      arcEnter,
      arcExit,
      color,
      0,
      winSectorTextReplace !== '' ? winSectorTextReplace : text,
      colorStyle === 'lgbtq' ? lgbtqTextColor : undefined
    );

    requestAnimationFrame(function () {
      wheelContainer.classList.add('active');
      chosenSectorEl.innerHTML = sector;
      if ('setProperty' in frameEl.style) {
        frameEl.style.setProperty('--lighten-color', getLightenColor(colorStyle, color));
      }
      wheelFromAboveShadowEl.classList.add('active');
    });

    setTimeout(function () {
      function shouldEndRotate(timeSinceStart) {
        if (timeSinceStart > wheelSpinDurationMs) {
          updateWheelRotationDeg(resultAngleDeg);
          updateTextsByAngleDeg(resultAngleDeg, wheelSectors);
          return true;
        }
      }

      function newDeltaAngleDeg(timeSinceStart) {
        const x = timeSinceStart / wheelSpinDurationMs;
        return deltaAngleDeg * b(x);
      }

      rotateWheel(initialAngleDeg, newDeltaAngleDeg, shouldEndRotate, wheelSectors);

      setTimeout(function () {
        setTimeout(function () {
          requestAnimationFrame(function () {
            triangle.classList.add('hidden');
            frameEl.classList.add('enlarged');
            arcEl.classList.add('hidden');
            chosenSectorEl.classList.add('enlarged');
            chosenSectorEl.classList.add('active');
            darkenEl.classList.add('active');

            spotlight.forEach(function (el) {
              if ('beginElementAt' in el) {
                el.beginElementAt(1);
              }
            });
          });

          setTimeout(function () {
            chosenSectorEl.classList.remove('enlarged');
            frameEl.classList.remove('enlarged');
            triangle.classList.remove('hidden');
            arcEl.classList.remove('hidden');
            wheelPluginPosition ? buttonsContainer.classList.add('active') : true
            wheelPluginPosition ? buttonsContainer.classList.add('visible') : true
            wheelPluginPosition ? wheelContainer.classList.remove('active') : true
            wheelPluginPosition ? wheelContainer.classList.remove('visible') : true
          }, winEnlargedMinifyPauseMs)
        }, winEnlargePauseMs)

        setTimeout(function () {
          initAfterWin()
        }, initAfterWinPauseMs);
      }, wheelSpinDurationMs);
    }, 300);
  }


  // --------------------------
  // --- WHEEL INITIALIZERS ---
  // --------------------------

  function initLogo(colorStyle) {
    if (colorStyle === 'lgbtq') {
      buttonsSmallWheelUse.setAttribute('xlink:href', '#lgbtqLogo');
    } else {
      const colors = getLogoColors(colorStyle);
      const color1 = colors[0];
      const color3 = colors[2];
      const colorBulb = colors[3];

      logoSectors1El.setAttribute('fill', color3);
      logoSectors2El.setAttribute('stroke', color1);
      logoBulbEl.setAttribute('fill', colorBulb);

      buttonsSmallWheelUse.setAttribute('xlink:href', '#wheel-plugin-logo');
    }
  }

  function initLights() {
    const lightsCount = 20;
    const startingAngle = frameSlugOuterAngle + 0.15;
    const lightRad = (2 * Math.PI - startingAngle * 2) / lightsCount;
    const lightsR = fullR - 14;
    const lightsColor = getLightsColor(colorStyle)

    let lightsContent = lightsContainer.innerHTML || '';

    for (let i = 0; i <= lightsCount; i++) {
      const x = -getX(lightsR, lightRad * i + startingAngle);
      const y = -getY(lightsR, lightRad * i + startingAngle);
      const color = i % 2 === 0 ? lightsColor[0] : 'url(' + lightsColor[1] + ')';

      lightsContent = lightsContent
        .concat('\n<circle cx="')
        .concat(x, '" cy="')
        .concat(y, '" r="4" fill="')
        .concat(color, '" />');
    }

    lightsContainer.innerHTML = lightsContent;
  }

  function initFrame(colorStyle) {
    const slice = getSlice(wheelSectorsCount);
    const arcEnter = getArcEnter(r, slice);
    const arcExit = getArcExit(r, slice);
    const color = getFrameColor(colorStyle)

    frameEl.innerHTML = ''
      .concat('\n<path d="M 0 0 L ')
      .concat(arcEnter, ' A ')
      .concat(r, ' ')
      .concat(r, ' 0 0 0 ')
      .concat(arcExit, ' Z" fill="transparent" class="lighten" />\n')
      .concat('<path d="M 0 0 L ', arcEnter, ' A ', r, ' ', r, ' 0 0 0 ', arcExit, ' Z" ')
      .concat(
        'fill="transparent" class="frame-stroke" stroke="url(' + color[0] + ')" stroke-width="5" filter="url(#shadow)" />\n'
      )
      .concat('<path d="M 0 0 L ', arcEnter, ' A ', r, ' ', r, ' 0 0 0 ', arcExit, ' Z" ')
      .concat('fill="url(#spotlight)" stroke="url(#spotlight)" ')
      .concat('class="frame-spotlight" stroke-width="5" />\n');

    arcEl.innerHTML = '<path d="M '
      .concat(-getX(fullR, frameSlugOuterAngle), ' ')
      .concat(-getY(fullR, frameSlugOuterAngle), ' A ')
      .concat(fullR, ' ')
      .concat(fullR, ' 0 0 0 ')
      .concat(-getX(fullR, frameSlugOuterAngle), ' ')
      .concat(getY(fullR, frameSlugOuterAngle), ' L ')
      .concat(-getX(fullR - frameSlugWidth, frameSlugInnerAngle), ' ')
      .concat(getY(fullR - frameSlugWidth, frameSlugInnerAngle), ' A ')
      .concat(fullR - frameSlugWidth, ' ')
      .concat(fullR - frameSlugWidth, ' 0 0 1 ')
      .concat(-getX(fullR - frameSlugWidth, frameSlugInnerAngle), ' ')
      .concat(
        -getY(fullR - frameSlugWidth, frameSlugInnerAngle),
        ' Z" fill="url(' + color[1] + ')" />\n'
      );
  }

  function initWheel() {
    let content = ''

    const count = wheelSectorsCount;
    const slice = getSlice(count);
    const arcEnter = getArcEnter(r, slice);
    const arcExit = getArcExit(r, slice);

    // if wheelPluginPosition is false add to wheelPlugin class --not-positioned
    !wheelPluginPosition ? wheelPlugin.classList.add('--not-positioned') : true
    !wheelPluginPosition && wheelMaxHeight ? wheelPlugin.style.maxHeight = wheelMaxHeight + 'px' : true
    !wheelPluginPosition && wheelMaxWidth ? wheelPlugin.style.maxWidth = wheelMaxWidth + 'px' : true

    wheelPluginPosition && wheelMiniText ? buttonsSmallWheel.dataset.tooltip = wheelMiniText : true
    wheelPluginPosition && wheelMaxHeight ? wheelContainer.style.maxHeight = wheelMaxHeight + 'px' : true
    wheelPluginPosition && wheelMaxWidth ? wheelContainer.style.maxWidth = wheelMaxWidth + 'px' : true

    // Initialize
    initFrame(colorStyle)
    initLights(colorStyle)
    initLogo(colorStyle);

    for (let i = 0; i < count; i++) {
      // -2 is to place first sector to the bottom, left of vertical center
      // actual for sectorsCount === 10
      // for fewer sectors we don't do virtual rendering, so it doesn't matter
      const rotate = slice * (i - 2);
      const color = getColor(colorStyle, count, i);
      const text = wheelSectors[i];

      content = content.concat(
        getSector(
          arcEnter,
          arcExit,
          color,
          rotate,
          text,
          colorStyle === 'lgbtq' ? lgbtqTextColor : undefined
        )
      );
    }
    wheelSectorsContainer.innerHTML = content;

    defsEl.innerHTML = ''
      .concat(defsEl.innerHTML)
      .concat('\n<mask id="gradientMask">\n<path d="M 0 0 L ')
      .concat(
        arcEnter,
        ' A ',
        r,
        ' ',
        r,
        ' 0 0 0 ',
        arcExit,
        ' Z" fill="url(#textGradient)" />\n</mask>'
      );
  }


  // --------------------------
  // --- WHEEL BUTTONS SHOW ---
  // --------------------------

  this.showSmallSpinner = function () {
    if (!wheelPluginPosition && wheelAutoRotate) {
      this.showBigSpinner()
      return
    }
    if (wheelShowPauseMs) {
      setTimeout(function () {
        buttonsContainer.classList.add('visible')
        buttonsContainer.classList.add('active')
        wheelContainer.classList.remove('visible')
      }, wheelShowPauseMs)
    } else {
      buttonsContainer.classList.add('visible')
      buttonsContainer.classList.add('active')
      wheelContainer.classList.remove('visible')
    }
  }

  this.showBigSpinner = function () {
    updateWheelRotationDeg(0)
    if (wheelShowPauseMs) {
      setTimeout(function () {
        buttonsContainer.classList.remove('visible')
        buttonsContainer.classList.remove('active')
        wheelContainer.classList.add('visible')
        changeWheelToRule()
      }, wheelShowPauseMs)
    } else {
      buttonsContainer.classList.remove('visible')
      buttonsContainer.classList.remove('active')
      wheelContainer.classList.add('visible')
      changeWheelToRule()
    }
  }


  // --------------------------
  // --- WHEEL EVENTS CLICK ---
  // --------------------------

  wheelContainer.addEventListener('click', function (event) {
    event.stopPropagation()
    if (isSpinning) {
      return;
    }

    isSpinning = true;

    spinWithAnimation()
  });

  buttonsSmallWheel.addEventListener('click', function (event) {
    event.stopPropagation()

    if (isSpinning) {
      initWheel()
    }

    updateWheelRotationDeg(0)

    buttonsContainer.classList.remove('active')
    buttonsContainer.classList.remove('visible')
    wheelContainer.classList.add('visible')
    changeWheelToRule()
  });

  closeEl.addEventListener('click', function (event) {
    event.stopPropagation()
    stopSlowlyRotating()
    updateWheelRotationDeg(0)

    buttonsContainer.classList.add('active')
    buttonsContainer.classList.add('visible')
    wheelContainer.classList.remove('visible')
  });


  // ------------------
  // --- WHEEL INIT ---
  // ------------------

  initWheel()
}
