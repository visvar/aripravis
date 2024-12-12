<script>
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
  export let formatValue = (d) => d;

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
  <Button {label} onClick={reset} {width} />
  <Button
    label="-"
    onClick={decrease}
    position="{width + 0.005} 0 0"
    width={0.01}
  />
  <Button
    label="+"
    onClick={increase}
    position="{width + 0.0175} 0 0"
    width={0.01}
  />
  {#if showValue}
    <a-plane
      color="#333"
      width="0.015"
      {height}
      position="{width + 0.0375} 0 0"
    >
      <a-text
        value={formatValue(value)}
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
