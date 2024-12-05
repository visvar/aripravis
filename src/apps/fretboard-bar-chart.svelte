<script>
  import { onDestroy } from 'svelte';
  import * as d3 from 'd3';
  import { Note, Scale } from 'tonal';
  import 'aframe';
  import 'aframe-svelte';
  import { Midi } from 'musicvis-lib';
  import MidiInput from '../components/midi-input.svelte';
  import { fretPositionsMeter } from '../lib/guitar-fret-spacing';
  import ColorSwatches from '../components/color-swatches.svelte';
  import PcKeyboardInput from '../components/pc-keyboard-input.svelte';
  import Button from '../components/button.svelte';
  import NumberInput from '../components/number-input.svelte';
  import ScaleSelect from '../components/scale-select.svelte';
  import { NOTE_TO_CHROMA_MAP } from '../lib/music.js';

  let stringCount = 6;
  const stringPositions = d3.range(stringCount).map((d) => d * 0.007);
  let fretCount = fretPositionsMeter.length;
  // E standard tuning, strings start at high E
  let tuningPitches = [64, 59, 55, 50, 45, 40];
  const tuningNotes = tuningPitches.map(Note.fromMidiSharps);
  // const stringColors = tuningNotes.map(()=>'#aaa')
  const stringColors = d3.schemeObservable10;
  /**
   * @type {object[]}
   */
  let notes = [];
  let binnedNotes;
  let maxValue = 1;
  let maxHeightDefault = 0.02;
  let maxHeight = maxHeightDefault;
  let tempo = 120;
  let root = 'C';
  let scale = 'major';
  $: scaleInfo = Scale.get(`${root} ${scale}`);
  $: scaleChromaSet = new Set(
    scaleInfo ? scaleInfo.notes.map((d) => NOTE_TO_CHROMA_MAP.get(d)) : [],
  );
  const isInScale = (string, fret, tuningPitches, scaleInfo) => {
    if (!scaleInfo) {
      return false;
    }
    const chroma = (tuningPitches[string] + fret) % 12;
    return scaleChromaSet.has(chroma);
  };

  // create random data until MIDI input is received
  const randomNote = (time) => {
    const string = Math.round(Math.random() * 6);
    const fret = Math.round(Math.random() * 24);
    const velocity = Math.round(Math.random() * 127);
    const midiNr = tuningPitches[string] + fret;
    time = time ?? Math.round(Math.random() * 60);
    return {
      string,
      fret,
      time,
      number: midiNr,
      note: Midi.NOTE_NAMES[midiNr % 12],
      velocity,
    };
  };
  let testInterval = setInterval(
    () => (notes = [...notes, randomNote(performance.now() / 1000)]),
    250,
  );

  let debugMsg = '';

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

  const binNotes = (notes) => {
    binnedNotes = d3.groups(
      notes,
      (d) => d.string,
      (d) => d.fret,
    );
    maxValue = d3.max(binnedNotes, ([string, data]) =>
      d3.max(data, ([fret, notes]) => notes.length),
    );
  };

  $: binNotes(notes);

  $: heightMap = d3.scaleLinear().domain([0, maxValue]).range([0, maxHeight]);

  onDestroy(() => {
    clearInterval(testInterval);
    // window.location.reload();
  });

  const colorMap = new Map([
    ['in scale', 'steelblue'],
    ['outside scale', 'orange'],
  ]);
</script>

<PcKeyboardInput
  key="+"
  keyDown={() => {
    maxHeight += 0.005;
  }}
/>
<PcKeyboardInput
  key="-"
  keyDown={() => {
    maxHeight -= 0.005;
  }}
/>

<a-scene
  xrweb="mode: immersive-ar;"
  xr-mode-ui="enabled: true; enterAREnabled: true; XRMode: ar;"
  renderer="colorManagement: true; antialias: true; foveationLevel: 1; highRefreshRate: true;"
>
  <a-camera wasd-controls="acceleration:10; fly: true">
    <a-cursor position="0 0 -0.1" scale="0.1 0.1 0.1"></a-cursor>
  </a-camera>
  <!-- controllers -->
  <a-entity oculus-touch-controls="hand: left"></a-entity>
  <a-entity oculus-touch-controls="hand: right"></a-entity>
  <!-- hand tracking -->
  <a-entity id="leftHand" hand-tracking-controls="hand: left;"></a-entity>
  <a-entity id="rightHand" hand-tracking-controls="hand: right;"></a-entity>
  <!-- text for debugging -->
  <a-entity
    text="value: {debugMsg}; color: #666; width: 5"
    position="-0.2 0.1 -0.5"
    scale=".025 .025 .025"
  ></a-entity>
  <!-- visualization container -->
  <a-box
    position="-0.1 1.5 -0.25"
    rotation="0 0 0"
    scale="1 1 1"
    visible="true"
    opacity="0"
  >
    <!-- text with explanation -->
    <a-entity
      text="value: Fretboard Bar Chart; color: #888; width: 5"
      position="0 0.05 0"
      scale=".025 .025 .025"
    ></a-entity>
    <a-entity
      text="value: Connect a MIDI guitar and start playing. Notes are positioned based on their string (forward), fret (right); color: #aaa; width: 5"
      position="-0.037 0.03 0"
      scale=".01 .01 .01"
    ></a-entity>

    <!-- color legend -->
    <ColorSwatches {colorMap} title="Note type" />
    <!-- settings -->
    <Button
      label="reset"
      onClick={() => {
        notes = [];
      }}
      position="0.08 0.01 0"
    />
    <NumberInput
      label="tempo"
      bind:value={tempo}
      defaultValue={120}
      min={60}
      max={200}
      step={5}
      position="0.07 0.03 0"
      showValue
    />
    <NumberInput
      label="bar size"
      bind:value={maxHeight}
      defaultValue={maxHeightDefault}
      min={0}
      max={0.05}
      step={0.001}
      position="0.07 0.05 0"
    />
    <ScaleSelect bind:root bind:scale position="0.07 0.07 0" />
    <!-- fretboard -->
    {#each d3.range(stringCount) as string}
      <!-- strings -->
      <a-cylinder
        position={`
            ${fretPositionsMeter.at(-1) / 2}
            0
            ${stringPositions[string]}`}
        radius={0.0002 * (string / 6 + 1)}
        height={fretPositionsMeter.at(-1)}
        rotation="0 0 90"
        color={stringColors[stringCount - string - 1]}
      ></a-cylinder>
      <!-- string notes -->
      <a-entity
        text="value: {tuningNotes[string].slice(0, -1)}; color: #666"
        position={`
            0.04
            0
            ${stringPositions[string]}`}
        scale="0.1 0.1 0.1"
        rotation="-45 0 0"
        material="side: double"
      ></a-entity>
    {/each}
    {#each d3.range(fretCount + 1) as fret}
      <!-- frets -->
      <a-cylinder
        position={`
          ${fretPositionsMeter[fret]}
          0
          ${stringPositions.at(-1) / 2}`}
        radius={0.00025}
        height={stringPositions.at(-1)}
        rotation="90 0 0"
        color="#ddd"
      ></a-cylinder>
    {/each}
    <!-- fret numbers -->
    {#each [0, 1, 3, 5, 7, 9, 12, 15, 17, 19, 21, 24] as fret}
      <a-text
        value={fret}
        color="#666"
        position={`
            ${fretPositionsMeter[fret]}
            0
            ${stringPositions.at(-1) + 0.005}`}
        scale="0.02 0.02 0.02"
        rotation="-45 0 0"
        material="side: double"
        align="center"
        anchor="center"
        baseline="top"
      ></a-text>
    {/each}
    <!-- inlays -->
    {#each [3, 5, 7, 9, 15, 17, 19, 21] as dot}
      <a-sphere
        position={`
          ${(fretPositionsMeter[dot] + fretPositionsMeter[dot - 1]) / 2}
          0
          ${stringPositions.at(-1) / 2}`}
        color="silver"
        scale="0.002 0.0005 0.002"
      ></a-sphere>
    {/each}
    {#each [12, 24] as dot}
      <a-sphere
        position={`
          ${(fretPositionsMeter[dot] + fretPositionsMeter[dot - 1]) / 2}
           0
          ${(stringPositions.at(1) + stringPositions.at(2)) / 2}`}
        color="silver"
        scale="0.002 0.0005 0.002"
      ></a-sphere>
      <a-sphere
        position={`
          ${(fretPositionsMeter[dot] + fretPositionsMeter[dot - 1]) / 2}
           0
          ${(stringPositions.at(3) + stringPositions.at(4)) / 2}`}
        color="silver"
        scale="0.002 0.0005 0.002"
      ></a-sphere>
    {/each}
    <!-- notes -->
    {#each binnedNotes as [stringPos, stringNotes]}
      {#each stringNotes as [fretPos, notes]}
        <a-cylinder
          position={`
          ${(fretPositionsMeter[fretPos] + fretPositionsMeter[fretPos - 1]) / 2}

          ${heightMap(notes.length) / 2}

          ${stringPositions[stringPos]}`}
          color={colorMap.get(
            isInScale(stringPos, fretPos, tuningPitches, scaleInfo)
              ? 'in scale'
              : 'outside scale',
          )}
          radius="0.002"
          height={heightMap(notes.length)}
        ></a-cylinder>
      {/each}
    {/each}
  </a-box>
</a-scene>
<MidiInput {noteOn} />
