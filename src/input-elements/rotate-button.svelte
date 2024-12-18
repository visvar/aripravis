<script>
  /**
   * Every click rotates through the values
   */

  import Button from './button.svelte';

  export let value;
  export let values = [];
  export let label = 'label';
  export let position = '0 0 0';
  export let width = 0.04;
  export let height = 0.01;

  $: valueIndex = values.indexOf(value);
</script>

<Button
  label="{label}: {value}"
  onClick={() => {
    let newIndex = valueIndex + 1;
    if (newIndex > values.length - 1 || newIndex < 0) {
      newIndex = 0;
    }
    value = values[newIndex];
  }}
  {position}
  {width}
  {height}
/>
