<script>
  import * as AFRAME from 'aframe';
  import 'aframe-svelte';
  import { onMount } from 'svelte';

  console.log(AFRAME);

  AFRAME.registerComponent('draw-canvas', {
    // dependencies: ['geometry', 'material'],
    init: function () {
      this.canvas = document.querySelector('#mycanvas');
      this.context = this.canvas.getContext('2d');
      this.x = 200;
      this.y = 100;
      this.dx = 5;
      this.dy = 3;
    },

    tick: function (t) {
      this.x += this.dx;
      this.y += this.dy;

      if (this.x > 512 - 50 || this.x < 0) this.dx *= -1;
      if (this.y > 512 - 50 || this.y < 0) this.dy *= -1;

      // clear canvas
      this.context.fillStyle = '#8888FF';
      this.context.fillRect(0, 0, 512, 512);

      // draw rectangle
      this.context.fillStyle = '#FF0000';
      this.context.fillRect(this.x, this.y, 50, 50);

      // thanks to https://github.com/aframevr/aframe/issues/3936 for the update fix
      let material = this.el.getObject3D('mesh').material;
      if (!material.map) return;
      else material.map.needsUpdate = true;
    },
  });

  // workaorund to make it work...
  let show = false;
  onMount(() => {
    show = true;
  });
</script>

<a-scene>
  <a-assets timeout="10000">
    <!-- texture sizes should be powers of 2 -->
    <canvas id="mycanvas" width="512" height="512"></canvas>
  </a-assets>
  {#if show}
    <a-plane
      id="canvas-display"
      width="5"
      height="5"
      position="0 0 -10"
      material="shader: flat; src: #mycanvas;"
      draw-canvas
    >
    </a-plane>
  {/if}
</a-scene>
