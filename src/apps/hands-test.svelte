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
    // window.location.reload();
  });
</script>

<a-scene
  xrweb="mode: immersive-ar;"
  xr-mode-ui="enabled: true; enterAREnabled: true; XRMode: ar;"
  renderer="colorManagement: true; antialias: true; foveationLevel: 1; highRefreshRate: true;"
>
  <!-- camera -->
  <a-camera wasd-controls="acceleration:10; fly: true">
    <a-cursor position="0 0 -0.1" scale="0.1 0.1 0.1"></a-cursor>
  </a-camera>
  <!-- controllers -->
  <a-entity oculus-touch-controls="hand: left" modelOpacity="0.5">
    <a-box color="yellow" scale="0.1 0.1 0.1"></a-box>
  </a-entity>
  <a-entity oculus-touch-controls="hand: right" modelOpacity="0.5">
    <a-box color="red" scale="0.1 0.1 0.1"></a-box>
  </a-entity>
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
