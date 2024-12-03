<script>
  import { onDestroy } from 'svelte';
  import 'aframe';
  import 'aframe-svelte';

  /**
   * hand tracking
   * @see https://aframe.io/docs/1.6.0/components/hand-tracking-controls.html
   * @see https://github.com/aframevr/aframe/blob/master/docs/components/hand-tracking-controls.md
   */

  onDestroy(() => {
    window.location.reload();
  });
</script>

<main class="app">
  <!-- x is right, y is up, z is toward camera -->
  <!-- <a-scene xrweb="arMode: true"> -->
  <a-scene
    xrweb="mode: immersive-ar; optionalFeatures: dom-overlay; overlayElement: #overlay"
    xr-mode-ui="enabled: true; enterAREnabled: true; XRMode: ar;"
    renderer="colorManagement: true; antialias: true; foveationLevel: 1; highRefreshRate: true"
  >
    <!-- controllers -->
    <a-entity oculus-touch-controls="hand: left" modelOpacity="0.5"></a-entity>
    <a-entity oculus-touch-controls="hand: right" modelOpacity="0.5"></a-entity>
    <!-- hand tracking -->
    <a-entity id="leftHand" hand-tracking-controls="hand: left;"></a-entity>
    <a-entity id="rightHand" hand-tracking-controls="hand: right;"></a-entity>
    <!-- text for debugging -->
    <!-- <a-entity
			text="value: {debugMsg}; color: #666; width: 5"
			position="-2 1 -3"
			scale=".25 .25 .25"
		></a-entity> -->
    <!-- visualization container -->
    <a-box
      position="-1 .5 -3"
      rotation="0 0 0"
      scale=".1 .1 .1"
      visible="true"
      opacity="1"
      color="red"
      pressable
    >
    </a-box>
  </a-scene>
</main>
