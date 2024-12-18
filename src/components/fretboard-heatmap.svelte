<script>
  import * as d3 from 'd3';
  import { fretPositionsMeter } from '../lib/guitar-fret-spacing';
  import ColorLegend from './color-legend.svelte';

  let stringCount = 6;
  const stringPositions = d3.range(stringCount).map((d) => d * 0.007);
  /**
   * @type {object[]}
   */
  export let notes = [];
  let binnedNotes;
  let maxValue = 1;

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
</script>

<!-- color legend -->
<ColorLegend {colorScale} title="Number of notes at position" {maxValue} />
<!-- notes -->
{#each binnedNotes as [stringPos, stringNotes]}
  {#each stringNotes as [fretPos, notes]}
    <!-- <a-circle
      position={`
          ${(fretPositionsMeter[fretPos] + fretPositionsMeter[fretPos - 1]) / 2}
          0.003
          ${stringPositions[stringPos]}`}
      rotation="90 0 0"
      color={colorMap(notes.length)}
      radius="0.003"
      material="side: double"
    ></a-circle> -->
    <a-plane
      position={`
          ${(fretPositionsMeter[fretPos] + fretPositionsMeter[fretPos - 1]) / 2}
          0.003
          ${stringPositions[stringPos]}`}
      rotation="-90 0 0"
      color={colorMap(notes.length)}
      width="0.005"
      height="0.005"
    ></a-plane>
  {/each}
{/each}
