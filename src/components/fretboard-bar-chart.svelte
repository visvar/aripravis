<script>
  import * as d3 from 'd3';
  import { Scale } from 'tonal';
  import { fretPositionsMeter } from '../lib/guitar-fret-spacing';
  import ColorSwatches from './color-swatches.svelte';
  import PcKeyboardInput from '../input-handlers/pc-keyboard-input.svelte';
  import NumberInput from '../input-elements/number-input.svelte';
  import ScaleSelect from '../input-elements/scale-select.svelte';
  import { NOTE_TO_CHROMA_MAP } from '../lib/music.js';
  import MetronomeButton from '../input-elements/metronome-button.svelte';

  let stringCount = 6;
  const stringPositions = d3.range(stringCount).map((d) => d * 0.007);
  let fretCount = fretPositionsMeter.length;
  // E standard tuning, strings start at high E
  let tuningPitches = [64, 59, 55, 50, 45, 40];
  /**
   * @type {object[]}
   */
  export let notes = [];
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
<MetronomeButton bind:tempo position="0.07 0.03 0" />
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
      segments-height="1"
      segments-radial="6"
    ></a-cylinder>
  {/each}
{/each}
