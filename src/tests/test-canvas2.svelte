<script>
  import * as AFRAME from 'aframe';
  import 'aframe-svelte';
  import { Midi } from 'musicvis-lib';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let minPitch = 21;
  export let maxPitch = 108;

  const width = 4096;
  const height = 1024;
  const marginLeft = 50;
  const marginTop = 10;
  const marginBottom = 50;
  const fontSize = 20;

  let firstTimeStamp = 0;

  let notes = [];
  // create random data until MIDI input is received
  const randomNote = (time) => {
    if (notes.length === 0) {
      firstTimeStamp = performance.now();
    }
    const velocity = Math.round(Math.random() * 127);
    const number = Math.round(Math.random() * (maxPitch - minPitch) + minPitch);
    const string = Math.floor(Math.random() * 6);
    const fret = Math.round(Math.random() * 24);
    // time = time ?? Math.round(Math.random() * 60);
    return {
      time,
      number,
      note: Midi.NOTE_NAMES[number % 12],
      velocity,
      duration: Math.random() + 0.01,
      string,
      fret,
    };
  };
  let testInterval = setInterval(
    () =>
      (notes = [
        ...notes,
        randomNote((performance.now() - firstTimeStamp) / 1000),
      ]),
    100,
  );

  export let colorMap = (note) => 'white';

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
    .range([marginTop, height - marginBottom]);
  $: noteHeight = 0.9 * Math.abs(scalePitch(1) - scalePitch(0));

  let needsUpdate = false;
  $: {
    notes;
    needsUpdate = true;
  }

  if (AFRAME.components['draw-canvas']) {
    AFRAME.components['draw-canvas'] = undefined;
  }
  AFRAME.registerComponent('draw-canvas', {
    // dependencies: ['geometry', 'material'],
    init: function () {
      this.canvas = document.querySelector('#mycanvas');
      this.ctx = this.canvas.getContext('2d');
      this.ctx.font = `bold ${fontSize}px sans-serif`;
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

      // draw rectangle
      this.ctx.fillStyle = 'white';

      // y axis
      this.ctx.fillStyle = '#aaa';
      for (let pitch = pitchExtent[0]; pitch <= pitchExtent[1]; pitch++) {
        const y = scalePitch(pitch);
        if (pitch % 12 === 0) {
          // labels only for C
          this.ctx.fillText(
            `${Midi.NOTE_NAMES[pitch % 12]} ${Math.floor(pitch / 12)}`,
            0,
            y,
          );
        }
        if (Midi.SHARPS.has(pitch % 12)) {
          // sharps background stripes
          this.ctx.fillStyle = '#444';
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

<a-scene stats>
  <a-assets>
    <canvas id="mycanvas" {width} {height}></canvas>
  </a-assets>
  {#if show}
    <a-plane
      id="canvas-display"
      width="2"
      height="0.5"
      position="0 1.6 -3"
      material="shader: flat; src: #mycanvas;"
      draw-canvas
    >
    </a-plane>
  {/if}
</a-scene>
