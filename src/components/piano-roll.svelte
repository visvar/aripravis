<script>
  import * as AFRAME from 'aframe';
  import { Midi } from 'musicvis-lib';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let notes = [];
  export let position = '0 0 0';
  export let canvasId = '#pianoroll-canvas';
  export let colorMap = (note) =>
    d3.interpolateRainbow((note.number % 12) / 12);

  /**
   * should be power of two
   */
  const width = 2048;
  /**
   * should be power of two
   */
  const height = 512;
  const marginLeft = 50;
  const marginTop = 10;
  const marginBottom = 50;
  const fontSize = 20;

  $: timeMin = d3.min(notes, (d) => d.time);
  $: timeMax = d3.max(notes, (d) => d.time + d.duration);
  $: scaleTime = d3
    .scaleLinear()
    .domain([timeMin, timeMax])
    .range([marginLeft, width]);
  $: pitchExtent = d3.extent(notes, (d) => d.number);
  $: scalePitch = d3
    .scaleLinear()
    .domain([pitchExtent[0] - 1, pitchExtent[1] + 1])
    .range([height - marginBottom, marginTop]);
  $: noteHeight = 0.9 * Math.abs(scalePitch(1) - scalePitch(0));

  // only update when notes changes
  let needsUpdate = false;
  $: {
    notes;
    scaleTime;
    needsUpdate = true;
  }

  if (AFRAME.components['draw-pianoroll']) {
    AFRAME.components['draw-pianoroll'] = undefined;
  }
  AFRAME.registerComponent('draw-pianoroll', {
    // dependencies: ['geometry', 'material'],
    init: function () {
      // this.canvas = document.querySelector(canvasId);
      this.canvas = document.querySelector(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.ctx.font = `bold ${fontSize}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
    },

    tick: function (t) {
      // only do something when notes have changed
      if (!needsUpdate) {
        return;
      }
      needsUpdate = false;
      // clear canvas
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(0, 0, width, height);

      // y axis
      this.ctx.fillStyle = '#aaa';
      for (let pitch = pitchExtent[0]; pitch <= pitchExtent[1]; pitch++) {
        const y = scalePitch(pitch);
        if (pitch % 12 === 0) {
          // labels only for C
          this.ctx.fillText(
            `${Midi.NOTE_NAMES[pitch % 12]} ${Math.floor(pitch / 12)}`,
            marginLeft / 2,
            y,
          );
        }
        if (Midi.SHARPS.has(pitch % 12)) {
          // sharps background stripes
          this.ctx.fillStyle = '#222';
          this.ctx.fillRect(marginLeft, y, width, noteHeight);
          this.ctx.fillStyle = '#aaa';
        }
      }

      // X axis
      for (const tick of d3.ticks(timeMin, timeMax, 10)) {
        this.ctx.fillText(tick, scaleTime(tick), height - marginBottom / 2);
      }

      // notes
      for (const note of notes) {
        this.ctx.fillStyle = colorMap(note);
        this.ctx.fillRect(
          scaleTime(note.time),
          scalePitch(note.number),
          scaleTime(note.duration),
          noteHeight,
        );
      }

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

{#if show}
  <a-plane
    id="canvas-display"
    width="0.5"
    height="0.125"
    material="shader: flat; src: {canvasId};"
    draw-pianoroll
    {position}
  >
  </a-plane>
{/if}
