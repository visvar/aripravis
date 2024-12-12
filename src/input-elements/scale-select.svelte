<script>
  import 'aframe';
  import 'aframe-svelte';
  import Button from './button.svelte';
  import { Midi } from 'musicvis-lib';

  export let root = 'C';
  export let scale = 'major';
  export let position = '0 0 0';
  export let width = 0.02;
  export let height = 0.01;

  const reset = () => {
    root = 'C';
    scale = 'major';
  };
</script>

<a-entity {position}>
  <a-plane color="#333" {width} {height} position="{width / 2} 0.015 0.001">
    <a-text
      value="root"
      color="white"
      width="5"
      position="0 0 0.001"
      scale=".015 .015 .015"
      align="center"
      anchor="center"
      baseline="center"
    ></a-text>
  </a-plane>
  {#each Midi.NOTE_NAMES as note, index}
    <Button
      label={note}
      onClick={() => {
        root = note;
      }}
      position="{width + 0.012 * index + 0.01} 0.015 0"
      width={0.01}
    />
    {#if note === root}
      <a-plane
        color="steelblue"
        width="0.01"
        height="0.001"
        position="{width + 0.012 * index + 0.01} {height - 0.0005} 0.002"
      ></a-plane>
    {/if}
  {/each}
  <a-plane color="#333" {width} {height} position="{width / 2} 0 0.001">
    <a-text
      value="scale"
      color="white"
      width="5"
      position="0 0 0.001"
      scale=".015 .015 .015"
      align="center"
      anchor="center"
      baseline="center"
    ></a-text>
  </a-plane>
  {#each ['major', 'minor', 'major pentatonic', 'minor pentatonic'] as scaleName, index}
    <Button
      label={scaleName}
      onClick={() => {
        scale = scaleName;
      }}
      position="{width + 0.032 * index + 0.02} 0 0"
      width={0.03}
    />
    {#if scaleName === scale}
      <a-plane
        color="steelblue"
        width="0.03"
        height="0.001"
        position="{width + 0.032 * index + 0.02} -0.0055 0.002"
      ></a-plane>
    {/if}
  {/each}
</a-entity>
