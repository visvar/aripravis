<script>
  import * as d3 from 'd3';
  import { roundToStep } from '../lib/lib';
  import { fretPositionsMeter } from '../lib/guitar-fret-spacing.js';

  let stringCount = 6;
  const stringPositions = d3.range(stringCount).map((d) => d * 0.007);
  // const stringColors = tuningNotes.map(()=>'#aaa')
  const stringColors = d3.schemeObservable10;
  // settings
  let timeFactor = 1;
  let pastSeconds = 60;
  // data
  $: lastTimeSeconds = notes.at(-1)?.time ?? 60;
  $: firstTimeSeconds = lastTimeSeconds - pastSeconds;
  $: scaleTime = d3
    .scaleLinear()
    .domain([lastTimeSeconds, firstTimeSeconds])
    .range([0, timeFactor * 0.2]);
  /**
   * @type {object[]}
   */
  export let notes = [];

  $: lastNotes = notes.filter((d) => d.time > lastTimeSeconds - pastSeconds);
</script>

{#each d3.range(roundToStep(firstTimeSeconds, 5), lastTimeSeconds, 5) as time}
  <!-- time axis -->
  <a-plane
    position={`${fretPositionsMeter.at(-1) / 2} ${scaleTime(time)} 0`}
    height="0.0004"
    width={fretPositionsMeter.at(-1)}
    color="#ccc"
  >
  </a-plane>
  <a-text
    value="{time.toFixed()}s"
    color="#666"
    position={`-0.01 ${scaleTime(time)} 0 `}
    scale="0.02 0.02 0.02"
    align="right"
  ></a-text>
{/each}
<!-- notes -->
{#each lastNotes as note (note.time)}
  <a-box
    position={`
          ${(fretPositionsMeter[note.fret] + fretPositionsMeter[note.fret - 1]) / 2}

          ${scaleTime(note.time)}

          ${stringPositions[note.string]}`}
    color={stringColors[stringCount - note.string - 1]}
    opacity="0.5"
    width="0.004"
    height="0.004"
    depth="0.004"
  >
  </a-box>
{/each}
