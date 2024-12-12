<script>
  import { onDestroy } from 'svelte';
  import * as d3 from 'd3';
  import 'aframe';
  import 'aframe-svelte';
  import { Midi } from 'musicvis-lib';
  import MidiInput from '../input-handlers/midi-input.svelte';
  import ColorLegend from '../components/color-legend.svelte';
  import ToggleButton from '../input-elements/toggle-button.svelte';

  export const minPitch = 21;
  export const maxPitch = 108;
  // white
  const whiteKeyXScale = 0.02;
  const whiteKeyYScale = 0.01;
  const whiteKeyZScale = 0.09;
  const whiteKeyGap = 0.001;
  // black
  const blackKeyXScale = 0.01;
  const blackKeyYScale = 0.016;
  const blackKeyZScale = 0.055;
  const blackKeyZOffset = -0.033 / 2;
  const blackKeyXOffset = [
    0, -0.006, 0, -0.002, 0, 0, -0.006, 0, -0.005, 0, -0.002,
  ].map((d) => d - blackKeyXScale / 2);
  // keys
  const keys = [];
  let currentX = whiteKeyXScale / 2;
  for (let number = minPitch; number <= maxPitch; number++) {
    const isBlack = Midi.isSharp(number);
    const xOffset = isBlack ? blackKeyXOffset[number % 12] : 0;
    const zOffset = isBlack ? blackKeyZOffset : 0;
    keys.push({
      number,
      note: Midi.NOTE_NAMES[number % 12],
      isBlack,
      x: currentX + xOffset,
      y: isBlack ? blackKeyYScale / 2 : 0,
      z: -whiteKeyZScale / 2 + zOffset,
      xScale: isBlack ? blackKeyXScale : whiteKeyXScale,
      yScale: isBlack ? blackKeyYScale : whiteKeyYScale,
      zScale: isBlack ? blackKeyZScale : whiteKeyZScale,
    });
    if (!isBlack) {
      currentX += whiteKeyXScale + whiteKeyGap;
    }
  }

  /**
   * @type {object[]}
   */
  let notes = [];
  let binnedNotes = new Map();
  let maxValue = 1;
  let showNoteLabels = true;

  // create random data until MIDI input is received
  const randomNote = (time) => {
    const velocity = Math.round(Math.random() * 127);
    const number = Math.round(Math.random() * (maxPitch - minPitch) + minPitch);
    time = time ?? Math.round(Math.random() * 60);
    return {
      time,
      number,
      note: Midi.NOTE_NAMES[number % 12],
      velocity,
    };
  };
  let testInterval = setInterval(
    () => (notes = [...notes, randomNote(performance.now() / 1000)]),
    500,
  );

  const noteOn = (e) => {
    if (testInterval) {
      clearInterval(testInterval);
      testInterval = null;
      notes = [];
    }
    const note = {
      number: e.note.number,
      note: Midi.NOTE_NAMES[e.note.number % 12],
      velocity: e.rawVelocity,
      channel: e.message.channel,
    };
    notes = [...notes, note];
  };

  const binNotes = (notes) => {
    const binned = d3.groups(notes, (d) => d.number);
    maxValue = d3.max(binned, ([number, notes]) => notes.length);
    binnedNotes = new Map(binned);
  };

  $: binNotes(notes);

  const colorScale = (d) => d3.interpolateYlGnBu(1 - d);
  $: colorMap = (value) => colorScale(value / maxValue);

  onDestroy(() => {
    clearInterval(testInterval);
  });
</script>

<a-scene
  stats
  xrweb="mode: immersive-ar;"
  xr-mode-ui="enabled: true; enterAREnabled: true; XRMode: ar;"
  renderer="colorManagement: true; antialias: true; foveationLevel: 1; highRefreshRate: true;"
  raycaster="objects: [data-raycastable]; far:1;"
>
  <!-- camera -->
  <a-camera wasd-controls="acceleration:10; fly: true">
    <a-cursor position="0 0 -0.1" scale="0.1 0.1 0.1"></a-cursor>
  </a-camera>
  <!-- controllers -->
  <a-entity oculus-touch-controls="hand: left"></a-entity>
  <a-entity oculus-touch-controls="hand: right"></a-entity>
  <!-- hand tracking -->
  <a-entity id="leftHand" hand-tracking-controls="hand: left;"></a-entity>
  <a-entity id="rightHand" hand-tracking-controls="hand: right;"></a-entity>
  <!-- visualization container -->
  <a-box
    position="-0.1 1.5 -0.25"
    rotation="0 0 0"
    scale="1 1 1"
    visible="true"
    opacity="0"
  >
    <ToggleButton
      label="note labels"
      bind:checked={showNoteLabels}
      position="0.05 0.05 0"
    />
    <!-- text with explanation -->
    <a-entity
      text="value: Keyboard Heatmap; color: #888; width: 5"
      position="0 0.05 0"
      scale=".025 .025 .025"
    ></a-entity>
    <a-entity
      text="value: Connect a MIDI keyboard and start playing.; color: #aaa; width: 5"
      position="-0.037 0.03 0"
      scale=".01 .01 .01"
    ></a-entity>

    <!-- color legend -->
    <ColorLegend
      {colorScale}
      title="Number of notes at position"
      {maxValue}
      position="0 0 {-whiteKeyZScale}"
    />
    <!-- keyboard -->
    {#each keys as k (k.number)}
      <a-box
        position="{k.x} {k.y} {k.z}"
        scale="{k.xScale} {k.yScale} {k.zScale}"
        color={colorMap(binnedNotes.get(k.number)?.length ?? 0)}
      >
      </a-box>
      {#if showNoteLabels && !k.isBlack}
        <a-text
          value={k.number % 12 === 0
            ? `${k.note}\n${Math.floor(k.number / 12)}`
            : k.note}
          color="white"
          width="1"
          position="{k.x} {0} {0.01}"
          rotation="-45 0 0"
          scale=".15 .15 .15"
          align="center"
          anchor="center"
          baseline="top"
          material="side: double"
        ></a-text>
      {/if}
    {/each}
  </a-box>
</a-scene>
<MidiInput {noteOn} />
