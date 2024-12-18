<script>
  import * as d3 from 'd3';
  export let colorScale;
  export let position = '0 0 0';
  export let title = 'title';
  export let minValue = 0;
  export let maxValue = 1;

  const step = 0.1;
</script>

<a-entity {position}>
  <a-text
    value={title}
    color="#aaa"
    width="5"
    position="0 0.06 0"
    scale=".02 .02 .02"
    align="left"
    anchor="left"
    material="side: double"
  ></a-text>
  {#each d3.range(0, 1 + step, step) as value, index}
    <a-plane
      position="{(index * step) / 10} 0.05 0"
      color={colorScale(value)}
      width={step / 10}
      height="0.005"
      material="side: double"
    >
    </a-plane>
  {/each}
  <a-text
    value={minValue}
    color="#aaa"
    width="5"
    position="0 0.045 0"
    scale=".015 .015 .015"
    align="center"
    anchor="center"
    material="side: double"
  ></a-text>
  <a-text
    value={maxValue}
    color="#aaa"
    width="5"
    position="0.1 0.045 0"
    scale=".015 .015 .015"
    align="center"
    anchor="center"
    material="side: double"
  ></a-text>
</a-entity>
