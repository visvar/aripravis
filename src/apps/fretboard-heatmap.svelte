<script>
  import { onDestroy, onMount } from 'svelte';
  import * as d3 from 'd3';
  import { Note } from 'tonal';
  import 'aframe';
  import 'aframe-svelte';
  import { Midi } from 'musicvis-lib';
  import { roundToStep } from '../lib/lib';
  import MidiInput from '../components/midi-input.svelte';
  import * as AFRAME from 'aframe';
  import {
    fretPositions,
    fretPositionsMeter,
  } from '../lib/guitar-fret-spacing';

  let stringCount = 6;
  const stringPositions = d3.range(stringCount).map((d) => d * 0.007);
  let fretCount = fretPositions.length;
  // E standard tuning, strings start at high E
  let tuningPitches = [64, 59, 55, 50, 45, 40];
  const tuningNotes = tuningPitches.map(Note.fromMidiSharps);
  // const stringColors = tuningNotes.map(()=>'#aaa')
  const stringColors = d3.schemeObservable10;
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

  onDestroy(() => {
    clearInterval(testInterval);
    // window.location.reload();
  });
</script>

<main class="app">
  <!-- x is right, y is up, z is toward camera -->
  <a-scene>
    <!-- controllers -->
    <a-entity oculus-touch-controls="hand: left"></a-entity>
    <a-entity oculus-touch-controls="hand: right"></a-entity>
    <!-- hand tracking -->
    <a-entity id="leftHand" hand-tracking-controls="hand: left;"></a-entity>
    <a-entity id="rightHand" hand-tracking-controls="hand: right;"></a-entity>
    <!-- skybox -->
    <!-- <a-sky color="white"></a-sky> -->
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
      <!-- fretboard origin at string 1, fret 0, 1cm size -->
      <!-- <a-box
        position="0 0 0"
        rotation="0 0 0"
        scale="0.01 0.01 0.01"
        color="red"
      >
      </a-box> -->
      <!-- text with explanation -->
      <a-entity
        text="value: Fretboard Heatmap; color: #888; width: 5"
        position="0 0.05 0"
        scale=".025 .025 .025"
      ></a-entity>
      <a-entity
        text="value: Connect a MIDI guitar and start playing. Notes are positioned based on their string (forward), fret (right), and time (up). They are colored by string and labelled with note name and fret number.\n\nRandom notes are shown until you play.\n\nGo back in your browser to return to the main page.; color: #aaa; width: 5"
        position="-0.037 0.03 0"
        scale=".01 .01 .01"
      ></a-entity>
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
          text="value: {tuningNotes[string]}; color: #666"
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
        <!-- fret numbers -->
        <a-entity
          text="value: {fret}; color: #666"
          position={`
            ${fretPositionsMeter[fret] + 0.05}
            0
            ${stringPositions.at(-1) + 0.01}`}
          scale="0.1 0.1 0.1"
          rotation="-45 0 0"
          material="side: double"
        ></a-entity>
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
    </a-box>
  </a-scene>
  <MidiInput {noteOn} />
</main>
