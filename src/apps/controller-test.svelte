<script>
  import { onDestroy, onMount } from 'svelte';
  import 'aframe';
  import 'aframe-svelte';
  import * as AFRAME from 'aframe';
  import Button from '../input-elements/button.svelte';
  import FretboardBasis from '../components/fretboard-basis.svelte';

  export let currentApp;

  /**
   * - allow interaction to reset notes and scale time
   *  - https://aframe.io/docs/1.6.0/guides/building-a-basic-scene.html#event-listener-component-intermediate
   *  - support VR controllers?
   *      - https://aframe.io/docs/1.6.0/introduction/interactions-and-controllers.html
   * 	- https://github.com/aframevr/aframe/blob/master/docs/components/meta-touch-controls.md
   */

  let debugMsg = '';
  const component = 'controller-test';

  onMount(() => {
    // console.log(AFRAME);
    if (AFRAME.components[component]) {
      AFRAME.components[component] = undefined;
    }
    // https://aframe.io/docs/1.6.0/introduction/writing-a-component.html
    AFRAME.registerComponent(component, {
      init: function () {
        this.el.addEventListener('thumbstickmoved', this.thumbstickMoved);
        this.el.addEventListener('abuttondown', this.aButtonDown);
        this.el.addEventListener('bbuttondown', this.bButtonDown);
        this.el.addEventListener('xbuttondown', this.xButtonDown);
        this.el.addEventListener('ybuttondown', this.yButtonDown);
      },
      remove: function () {
        this.el.removeEventListener('thumbstickmoved', this.thumbstickMoved);
        this.el.removeEventListener('abuttondown', this.aButtonDown);
        this.el.removeEventListener('bbuttondown', this.bButtonDown);
        this.el.removeEventListener('xbuttondown', this.xButtonDown);
        this.el.removeEventListener('ybuttondown', this.yButtonDown);
      },
      multiple: true,
      // functions
      thumbstickMoved: function (evt) {
        let direction = '';
        if (evt.detail.y > 0.95) {
          direction = 'DOWN';
        }
        if (evt.detail.y < -0.95) {
          direction = 'UP';
        }
        if (evt.detail.x < -0.95) {
          direction = 'LEFT';
        }
        if (evt.detail.x > 0.95) {
          direction = 'RIGHT';
        }
        debugMsg = `x ${evt.detail.x} y ${evt.detail.y} dir ${direction}`;
      },
      aButtonDown: function (evt) {
        console.log(evt);
        debugMsg = `a button ${this.el.position}`;
        navigator.vibrate(200);
      },
      bButtonDown: function (evt) {
        debugMsg = `b button`;
        navigator.vibrate(200);
      },
      xButtonDown: function (evt) {
        debugMsg = `x button`;
        navigator.vibrate(200);
      },
      yButtonDown: function (evt) {
        debugMsg = `y button`;
        navigator.vibrate(200);
      },
    });
  });

  // workaorund to make it work...
  let show = false;
  onMount(() => {
    show = true;
  });
</script>

<a-scene
  stats
  xrweb="mode: immersive-ar;"
  xr-mode-ui="enabled: true; enterAREnabled: true; XRMode: ar;"
  renderer="colorManagement: true; antialias: true; foveationLevel: 1; highRefreshRate: true;"
  obb-collider="showColliders: false"
>
  <!-- camera -->
  <a-camera wasd-controls="acceleration:10; fly: true">
    <a-cursor position="0 0 -0.1" scale="0.1 0.1 0.1"></a-cursor>
  </a-camera>
  <!-- controllers -->
  {#if show}
    <a-entity
      meta-touch-controls="hand: left; model: true"
      thumbstick-logging
      triggerdown={() => (debugMsg = 'left trigger down!')}
    >
      <FretboardBasis />
    </a-entity>
    <a-entity
      meta-touch-controls="hand: right; model: true"
      thumbstick-logging
      on:triggerdown={() => (debugMsg = 'right trigger down!')}
    >
      <a-box color="red" scale="0.1 0.1 0.1"></a-box>
    </a-entity>
  {/if}
  <!-- text for debugging -->
  <a-text
    value="DEBUG:\n\n{debugMsg}"
    color="white"
    width="5"
    position="0 1.4 -0.6"
    scale=".25 .25 .25"
    material="side: double"
  ></a-text>
  <!-- home button -->
  <Button
    label="quit"
    onClick={() => {
      debugMsg = 'button clicked';
    }}
    position="0 1.6 -0.4"
  />
</a-scene>
