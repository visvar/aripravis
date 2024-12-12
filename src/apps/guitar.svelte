<script>
  import { onDestroy } from 'svelte';
  import * as d3 from 'd3';
  import 'aframe';
  import 'aframe-svelte';
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

  export let currentApp;

  let stringCount = 6;
  const stringPositions = d3.range(stringCount).map((d) => d * 0.007);
  let fretCount = fretPositionsMeter.length;
  // E standard tuning, strings start at high E
  let tuningPitches = [64, 59, 55, 50, 45, 40];

  // settings
  let encodings = ['bars', 'heatmap', 'spacetime'];
  let encoding = 'bars';
  let showBasis = true;

  // data
  /**
   * @type {object[]}
   */
  let notes = [];

  // create random data until MIDI input is received
  const randomNote = (time) => {
    const string = Math.floor(Math.random() * 6);
    const fret = Math.round(Math.random() * 24);
    const velocity = Math.round(Math.random() * 127);
    const midiNr = tuningPitches[string] + fret;
    time = time ?? Math.round(Math.random() * 60);
    return {
      string,
      fret,
      time,
      note: Midi.NOTE_NAMES[midiNr % 12],
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
    const string = e.message.channel - 1;
    const fret = e.note.number - tuningPitches[string];
    // filter noise
    if (fret < 0 || fret > fretCount) {
      return;
    }
    const note = {
      number: e.note.number,
      note: Midi.NOTE_NAMES[e.note.number % 12],
      velocity: e.rawVelocity,
      channel: e.message.channel,
      string,
      fret,
    };
    notes = [...notes, note];
  };

  onDestroy(() => {
    clearInterval(testInterval);
    // window.location.reload();
  });
</script>

<MidiInput {noteOn} />

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
  <a-entity position="-0.1 1.5 -0.25">
    <!-- settings menu -->
    <a-entity position="-0.15 0.15 0">
      <MultiButton
        label="encoding"
        values={encodings}
        bind:value={encoding}
        position="0 0 0"
      />
      <ToggleButton
        label="show basis"
        bind:checked={showBasis}
        position="0 -0.02 0"
      />
      <Button
        label="reset"
        onClick={() => {
          notes = [];
        }}
        position="0 -0.04 0"
      />
      <Button
        label="quit"
        onClick={() => {
          currentApp = null;
        }}
        position="0 -0.06 0"
      />
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
  </a-entity>
</a-scene>
