<script>
  import 'aframe';
  import 'aframe-svelte';
  import Button from './button.svelte';

  export let value = 0;
  export let defaultValue = 0;
  export let min = 0;
  export let max = 1;
  export let step = 0.1;
  export let label = 'button';
  export let position = '0 0 0';
  export let width = 0.02;
  export let height = 0.01;
  export let showValue = false;

  const increase = () => {
    value = Math.min(max, value + step);
  };
  const decrease = () => {
    value = Math.max(min, value - step);
  };
  const reset = () => {
    value = defaultValue;
  };
</script>

<a-entity {position}>
  <Button {label} onClick={reset} position="{width / 2} 0 0" {width} />
  <Button
    label="-"
    onClick={decrease}
    position="{width + 0.01} 0 0"
    width={0.01}
  />
  <Button
    label="+"
    onClick={increase}
    position="{width + 0.0225} 0 0"
    width={0.01}
  />
  {#if showValue}
    <a-plane color="#333" width="0.015" {height} position="{width + 0.04} 0 0">
      <a-text
        {value}
        color="white"
        width="5"
        position="0 0 0.001"
        scale=".015 .015 .015"
        align="center"
        anchor="center"
        baseline="center"
      ></a-text>
    </a-plane>
  {/if}
</a-entity>
