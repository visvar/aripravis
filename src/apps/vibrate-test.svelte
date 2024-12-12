<script>
  import 'aframe';
  import 'aframe-svelte';
  import Button from '../input-elements/button.svelte';
</script>

<a-scene
  xrweb="mode: immersive-ar;"
  xr-mode-ui="enabled: true; enterAREnabled: true; XRMode: ar;"
  renderer="colorManagement: true; antialias: true; foveationLevel: 1; highRefreshRate: true;"
>
  <!-- camera -->
  <a-entity
    camera
    look-controls
    wasd-controls="acceleration:10; fly: true"
    position="0 1.6 0"
  >
    <a-cursor position="0 0 -0.1" scale="0.1 0.1 0.1"></a-cursor>
  </a-entity>
  <a-entity position="0.07 1.62 -0.25">
    <Button
      label="vibrate once"
      onClick={() => {
        navigator.vibrate(200);
      }}
      position="0 0.007 0"
    />
    <Button
      label="vibrate sos"
      onClick={() => {
        navigator.vibrate([
          100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100,
          30, 100,
        ]);
      }}
      position="0.03 0.007 0"
    />
  </a-entity>
</a-scene>
