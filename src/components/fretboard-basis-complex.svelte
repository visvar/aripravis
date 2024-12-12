<script>
  /**
   * This version uses cylinders and spheres and therefore needs a lot more triangles and impacts performance
   *
   */

  import * as d3 from 'd3';
  import { Note } from 'tonal';
  import 'aframe';
  import 'aframe-svelte';
  import { fretPositionsMeter } from '../lib/guitar-fret-spacing';

  let stringCount = 6;
  const stringPositions = d3.range(stringCount).map((d) => d * 0.007);
  let fretCount = fretPositionsMeter.length;
  // E standard tuning, strings start at high E
  let tuningPitches = [64, 59, 55, 50, 45, 40];
  const tuningNotes = tuningPitches.map(Note.fromMidiSharps);
  // const stringColors = tuningNotes.map(()=>'#aaa')
  const stringColors = d3.schemeObservable10;
</script>

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
    opacity="0.5"
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
    opacity="0.5"
  ></a-sphere>
  <a-sphere
    position={`
    ${(fretPositionsMeter[dot] + fretPositionsMeter[dot - 1]) / 2}
    0
    ${(stringPositions.at(3) + stringPositions.at(4)) / 2}`}
    color="silver"
    scale="0.002 0.0005 0.002"
    opacity="0.5"
  ></a-sphere>
{/each}
