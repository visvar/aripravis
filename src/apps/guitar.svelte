<script>
  import { onDestroy } from 'svelte';
  import * as d3 from 'd3';
  import 'aframe';
  import 'aframe-svelte';
  import 'aframe-fps-counter-component';
  import { Midi } from 'musicvis-lib';
  import MidiInput from '../input-handlers/midi-input.svelte';
  import { fretPositionsMeter } from '../lib/guitar-fret-spacing';
  import FretboardBasis from '../components/fretboard-basis.svelte';
  import FretboardHeatmap from '../components/fretboard-heatmap.svelte';
  import MultiButton from '../input-elements/multi-button.svelte';
  import FretboardBarChart from '../components/fretboard-bar-chart.svelte';
  import FretboardSpacetimeCube from '../components/fretboard-spacetime-cube.svelte';
  import ToggleButton from '../input-elements/toggle-button.svelte';
  import Button from '../input-elements/button.svelte';
  import GuitarTab from '../components/guitar-tab.svelte';
  import PianoRoll from '../components/piano-roll.svelte';
  import PcKeyboardInput from '../input-handlers/pc-keyboard-input.svelte';

  export let currentApp;

  let stringCount = 6;
  const stringPositions = d3.range(stringCount).map((d) => d * 0.007);
  let fretCount = fretPositionsMeter.length;
  // E standard tuning, strings start at high E
  let tuningPitches = [64, 59, 55, 50, 45, 40];

  // settings
  let encodings = ['bars', 'heatmap', 'spacetime'];
  let encoding = 'bars';
  let timelines = ['none', 'tab', 'pianoroll'];
  let timeline = 'none';
  let showBasis = true;
  let showBackground = false;

  const width = 2048;
  const height = 512;

  // data
  /**
   * @type {object[]}
   */
  let notes = [];
  let openNoteMap = new Map();
  let firstTimeStamp = 0;

  // create random data until MIDI input is received
  const randomNote = (time) => {
    if (notes.length === 0) {
      firstTimeStamp = time;
    }
    const seconds = (time - firstTimeStamp) / 1000;
    const string = Math.floor(Math.random() * 6);
    const fret = Math.round(Math.random() * 24);
    const velocity = Math.random();
    const midiNr = tuningPitches[string] + fret;
    time = time ?? Math.round(Math.random() * 60);
    return {
      time: seconds,
      number: midiNr,
      string,
      fret,
      note: Midi.NOTE_NAMES[midiNr % 12],
      velocity,
      duration: Math.random() + 0.01,
    };
  };
  let testInterval = setInterval(
    () => (notes = [...notes, randomNote(performance.now())]),
    500,
  );

  const noteOn = (e) => {
    if (testInterval) {
      clearInterval(testInterval);
      testInterval = null;
      notes = [];
    }
    if (notes.length === 0) {
      firstTimeStamp = performance.now();
    }
    const time = (e.timestamp - firstTimeStamp) / 1000;
    const string = e.message.channel - 1;
    const fret = e.note.number - tuningPitches[string];
    // filter noise
    if (fret < 0 || fret > fretCount) {
      return;
    }
    const note = {
      time,
      number: e.note.number,
      note: Midi.NOTE_NAMES[e.note.number % 12],
      velocity: e.velocity,
      channel: e.message.channel,
      string,
      fret,
      duration: 0.001,
    };
    // fix old note if its end was missed
    // if (openNoteMap.has(e.note.number)) {
    //   const oldNote = openNoteMap.get(e.note.number);
    //   if (oldNote.duration === undefined) {
    //     note.duration = time- note.time;
    //   }
    // }
    notes = [...notes, note];
    openNoteMap.set(e.note.number, note);
  };

  const noteOff = (e) => {
    if (openNoteMap.has(e.note.number)) {
      const note = openNoteMap.get(e.note.number);
      const time = (e.timestamp - firstTimeStamp) / 1000;
      note.duration = time - note.time;
      notes = [...notes];
    }
  };

  onDestroy(() => {
    clearInterval(testInterval);
  });
</script>

<MidiInput {noteOn} {noteOff} />

<PcKeyboardInput
  key="r"
  keyDown={() => {
    notes = [];
    firstTimeStamp = null;
  }}
/>

<!-- <a-scene
  stats
  xrweb="mode: immersive-ar;"
  xr-mode-ui="enabled: true; enterAREnabled: true; XRMode: ar;"
  renderer="colorManagement: true; multiviewStereo: true; antialias: true; foveationLevel: 1; highRefreshRate: true;"
  raycaster="objects: [data-raycastable]; far:1;"
> -->
<a-scene
  stats
  xrweb="mode: immersive-ar;"
  xr-mode-ui="enabled: true; enterAREnabled: true; XRMode: ar;"
  renderer="colorManagement: true; multiviewStereo: true;"
  raycaster="objects: [data-raycastable]; far:1;"
>
  <a-assets>
    <canvas id="pianoroll-canvas" {width} {height}></canvas>
    <canvas id="guitartab-canvas" {width} {height}></canvas>
  </a-assets>
  <!-- sky -->
  {#if showBackground}
    <a-sky color="#fff"></a-sky>
  {/if}
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
  <a-entity position="-0.1 1.5 -0.25">
    <!-- settings menu -->
    <a-entity position="-0.25 0.1 0" scale="1.5 1.5 1.5">
      <MultiButton
        label="encoding"
        values={encodings}
        bind:value={encoding}
        position="0 0 0"
      />
      <MultiButton
        label="timeline"
        values={timelines}
        bind:value={timeline}
        position="0 -0.02 0"
      />
      <ToggleButton
        label="show basis"
        bind:checked={showBasis}
        position="0 -0.04 0"
      />
      <ToggleButton
        label="show background"
        bind:checked={showBackground}
        position="0.05 -0.04 0"
        width={0.05}
      />
      <Button
        label="reset"
        onClick={() => {
          notes = [];
        }}
        position="0 -0.06 0"
      />
      <Button
        label="quit"
        onClick={() => {
          currentApp = null;
        }}
        position="0.025 -0.06 0"
      />
      <a-entity fps-counter scale="0.1 0.1 0.1" position="0 -0.1 0"></a-entity>
    </a-entity>
    <!-- fretboard -->
    {#if showBasis}
      <FretboardBasis />
    {/if}
    <!-- visualization -->
    {#if encoding === 'bars'}
      <FretboardBarChart {notes} />
    {:else if encoding === 'heatmap'}
      <FretboardHeatmap {notes} />
    {:else if encoding === 'spacetime'}
      <FretboardSpacetimeCube {notes} />
    {/if}
    <!-- timeline -->
    {#if timeline === 'tab'}
      <GuitarTab {notes} position="0 0.2 -0.2" />
    {:else if timeline === 'pianoroll'}
      <PianoRoll {notes} position="0 0.2 -0.2" />
    {/if}
  </a-entity>
</a-scene>
