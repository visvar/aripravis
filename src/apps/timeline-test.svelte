<script>
  import { onDestroy } from 'svelte';
  import * as d3 from 'd3';
  import 'aframe';
  import 'aframe-svelte';
  import { Midi } from 'musicvis-lib';
  import MidiInput from '../components/midi-input.svelte';
  import PianoRoll from '../components/piano-roll.svelte';
  import PcKeyboardInput from '../components/pc-keyboard-input.svelte';
  import GuitarTab from '../components/guitar-tab.svelte';
  import 'aframe-fps-counter-component';
  import Button from '../components/button.svelte';

  export const minPitch = 21;
  export const maxPitch = 108;

  // E standard tuning, strings start at high E
  let tuningPitches = [64, 59, 55, 50, 45, 40];
  let fretCount = 24;
  let firstTimeStamp = 0;
  /**
   * @type {object[]}
   */
  let notes = [];
  let binnedNotes = new Map();
  let maxValue = 1;
  let openNoteMap = new Map();
  let showPianoRoll = true;
  let showGuitarTab = true;

  // create random data until MIDI input is received
  const randomNote = (time) => {
    if (notes.length === 0) {
      firstTimeStamp = performance.now();
    }
    const velocity = Math.round(Math.random() * 127);
    const number = Math.round(Math.random() * (maxPitch - minPitch) + minPitch);
    const string = Math.floor(Math.random() * 6);
    const fret = Math.round(Math.random() * 24);
    time = time ?? Math.round(Math.random() * 60);
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

  const noteOn = (e) => {
    if (testInterval) {
      clearInterval(testInterval);
      testInterval = null;
      notes = [];
    }
    if (notes.length === 0) {
      firstTimeStamp = e.timestamp;
    }
    const time = (e.timestamp - firstTimeStamp) / 1000;
    // const string = e.message.channel - 1;
    const string = Math.round(Math.random() * 5);
    const fret = e.note.number - tuningPitches[string];
    // // filter noise
    // if (fret < 0 || fret > fretCount) {
    //     return;
    // }
    const note = {
      time,
      number: e.note.number,
      note: Midi.NOTE_NAMES[e.note.number % 12],
      velocity: e.rawVelocity,
      channel: e.message.channel,
      duration: 0.001,
      string,
      fret,
    };
    // fix old note if its end was missed
    if (openNoteMap.has(e.note.number)) {
      const oldNote = openNoteMap.get(e.note.number);
      if (oldNote.end === undefined) {
        oldNote.end = time;
      }
    }
    notes = [...notes, note];
    openNoteMap.set(e.note.number, note);
  };

  const noteOff = (e) => {
    if (openNoteMap.has(e.note.number)) {
      const note = openNoteMap.get(e.note.number);
      const time = (e.timestamp - firstTimeStamp) / 1000;
      note.end = time;
      note.duration = note.end - note.time;
      notes = [...notes];
    }
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

<PcKeyboardInput
  key="r"
  keyDown={() => {
    notes = [];
  }}
/>
<!-- <a-scene> -->
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
  <!-- FPS -->
  <a-entity position="0.07 1.62 -0.25">
    <a-entity fps-counter scale="0.1 0.1 0.1"></a-entity>
    <a-text
      value="{notes.length} notes"
      scale="0.02 0.02 0.02"
      position="-0.03 0.007 0"
      align="center"
    ></a-text>
    <Button
      label="piano roll"
      onClick={() => {
        showPianoRoll = !showPianoRoll;
      }}
      position="0 0.007 0"
    />
    <Button
      label="guitar tab"
      onClick={() => {
        showGuitarTab = !showGuitarTab;
      }}
      position="0.03 0.007 0"
    />
  </a-entity>
  {#if showPianoRoll}
    <a-box
      position="-0.1 1.5 -0.25"
      rotation="0 0 0"
      scale="1 1 1"
      visible="true"
      opacity="0"
    >
      <PianoRoll {notes} />
    </a-box>
  {/if}
  {#if showGuitarTab}
    <a-box
      position="-0.1 1.65 -0.25"
      rotation="0 0 0"
      scale="1 1 1"
      visible="true"
      opacity="0"
    >
      <GuitarTab {notes} />
    </a-box>
  {/if}
  <MidiInput {noteOn} {noteOff} />
</a-scene>
