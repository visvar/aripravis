<script>
  import { onDestroy } from 'svelte';
  import * as d3 from 'd3';
  import { Note } from 'tonal';
  import 'aframe';
  import 'aframe-svelte';
  import { Midi } from 'musicvis-lib';
  import MidiInput from '../input-handlers/midi-input.svelte';
  import { fretPositionsMeter } from '../lib/guitar-fret-spacing';
  import ColorLegend from '../components/color-legend.svelte';
  import FretboardBasis from '../components/fretboard-basis.svelte';

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

  const colorScale = (d) => d3.interpolateYlGnBu(1 - d);
  $: colorMap = (value) => colorScale(value / maxValue);

  onDestroy(() => {
    clearInterval(testInterval);
    // window.location.reload();
  });
</script>

<a-scene
  stats
  xrweb="mode: immersive-ar;"
  xr-mode-ui="enabled: true; enterAREnabled: true; XRMode: ar;"
  renderer="colorManagement: true; antialias: true; foveationLevel: 1; highRefreshRate: true;"
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
      text="value: Fretboard Heatmap; color: #888; width: 5"
      position="0 0.05 0"
      scale=".025 .025 .025"
    ></a-entity>
    <a-entity
      text="value: Connect a MIDI guitar and start playing. Notes are positioned based on their string (forward), fret (right), and time (up). They are colored by string and labelled with note name and fret number.\n\nRandom notes are shown until you play.\n\nGo back in your browser to return to the main page.; color: #aaa; width: 5"
      position="-0.037 0.03 0"
      scale=".01 .01 .01"
    ></a-entity>

    <!-- color legend -->
    <ColorLegend {colorScale} title="Number of notes at position" {maxValue} />
    <!-- fretboard -->
    <FretboardBasis />
    <!-- notes -->
    {#each binnedNotes as [stringPos, stringNotes]}
      {#each stringNotes as [fretPos, notes]}
        <a-circle
          position={`
          ${(fretPositionsMeter[fretPos] + fretPositionsMeter[fretPos - 1]) / 2}
          0.003
          ${stringPositions[stringPos]}`}
          rotation="90 0 0"
          color={colorMap(notes.length)}
          radius="0.003"
          material="side: double"
        ></a-circle>
      {/each}
    {/each}
  </a-box>
</a-scene>
<MidiInput {noteOn} />
