<script>
  import * as AFRAME from 'aframe';
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { Note } from 'tonal';

  export let notes = [];
  export let position = '0 0 0';
  export let filteredNotes = [];
  export let stringCount = 6;
  export let colorMap = (note) => d3.interpolateSpectral((note.fret % 12) / 12);
  export let canvasId = '#guitartab-canvas';

  /**
   * should be power of two
   */
  const width = 2048;
  /**
   * should be power of two
   */
  const height = 512;
  const marginLeft = 50;
  const marginRight = 10;
  const marginTop = 10;
  const marginBottom = 50;
  const fontSize = 20;

  // E standard tuning, strings start at high E
  let tuningPitches = [64, 59, 55, 50, 45, 40];
  const tuningNotes = tuningPitches.map(Note.fromMidiSharps);
  // const stringColors = tuningNotes.map(()=>'#aaa')
  const stringColors = d3.schemeObservable10;

  $: timeMin = notes.at(0)?.time ?? 0;
  $: timeMax =
    notes.length === 0 ? 1 : notes.at(-1).time + notes.at(-1).duration;
  $: scaleTime = d3
    .scaleLinear()
    .domain([timeMin, timeMax])
    .range([marginLeft, width - marginRight]);
  $: scaleString = d3
    .scaleLinear()
    .domain([stringCount, 0])
    .range([height - marginBottom, marginTop]);
  $: lineHeight = Math.abs(scaleString(1) - scaleString(2));
  $: noteHeight = 0.9 * lineHeight;
  $: stringHeight = 0.2 * lineHeight;
  $: stringCenterOffset = 0.5 * lineHeight;

  // only update when notes changes
  let needsUpdate = false;
  $: {
    notes;
    needsUpdate = true;
  }

  if (AFRAME.components['draw-guitartab']) {
    AFRAME.components['draw-guitartab'] = undefined;
  }
  AFRAME.registerComponent('draw-guitartab', {
    // dependencies: ['geometry', 'material'],
    init: function () {
      // this.canvas = document.querySelector(canvasId);
      this.canvas = document.querySelector(canvasId);
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

      this.ctx.textAlign = 'center';
      // y axis
      for (let string = 0; string < stringCount; string++) {
        const y = scaleString(string) + stringCenterOffset;
        // string note
        this.ctx.fillStyle = '#aaa';
        this.ctx.fillText(tuningNotes[string], marginLeft / 2, y);
        // string
        this.ctx.fillStyle = stringColors[string];
        this.ctx.fillRect(
          marginLeft,
          y - stringHeight / 2,
          width - marginLeft - marginRight,
          stringHeight,
        );
      }

      this.ctx.fillStyle = '#aaa';
      // X axis
      for (const tick of d3.ticks(timeMin, timeMax, 10)) {
        this.ctx.fillText(tick, scaleTime(tick), height - marginBottom / 2);
      }

      // notes
      this.ctx.textAlign = 'left';
      for (const note of notes) {
        this.ctx.fillStyle = colorMap(note);
        const y = scaleString(note.string);
        this.ctx.fillRect(
          scaleTime(note.time),
          y,
          scaleTime(note.duration),
          noteHeight,
        );
        // fret numbers
        this.ctx.fillStyle = '#666';
        this.ctx.fillText(
          note.fret,
          scaleTime(note.time),
          y + stringCenterOffset,
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
    draw-guitartab
    {position}
  >
  </a-plane>
{/if}
