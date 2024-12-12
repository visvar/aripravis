<script>
  import 'aframe';
  import 'aframe-svelte';
  import Button from './button.svelte';

  export let value;
  export let values = [];
  export let label = 'label';
  export let position = '0 0 0';
  export let width = 0.02;
  export let height = 0.01;
</script>

<a-entity {position}>
  <a-plane color="#333" {width} {height} position="{width / 2} 0 0.001">
    <a-text
      value={label}
      color="white"
      width="5"
      position="0 0 0.001"
      scale=".015 .015 .015"
      align="center"
      anchor="center"
      baseline="center"
    ></a-text>
  </a-plane>
  {#each values as v, index}
    <Button
      label={v}
      onClick={() => {
        value = v;
      }}
      position="{width + 0.032 * index + 0.005} 0 0"
      width={0.03}
    />
    {#if v === value}
      <a-plane
        color="steelblue"
        width="0.03"
        height="0.001"
        position="{width + 0.532 * index + 0.02} -0.0055 0.001"
      ></a-plane>
    {/if}
  {/each}
</a-entity>
