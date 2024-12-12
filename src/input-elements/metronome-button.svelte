<script>
  import { onDestroy } from 'svelte';
  import Metronome from '../lib/Metronome.js';
  import Button from './button.svelte';
  import NumberInput from './number-input.svelte';

  export let tempo = 120;
  export let accent = 4;
  export let beepCount = 0;
  export let volume = 1;
  export let showVolumeInput = true;
  export let disabled = false;
  export let isBeeping = false;
  export let position = '0 0 0';

  const width = 0.03;
  const metro = new Metronome();
  let button;
  let evenBeep = false;

  const toggle = () => {
    metro.toggle(tempo, accent, beepCount > 0 ? beepCount : Infinity);
    isBeeping = metro.isPlaying;
    // animate button to show toggle
    button.style = 'background: var(--accent)';
    setTimeout(() => (button.style = ''), 500);
    evenBeep = !evenBeep;
  };

  onDestroy(() => {
    // turn off metronome
    metro.stop();
    evenBeep = false;
  });

  const indicateBeep = () => {
    evenBeep = !evenBeep;
  };
  metro.onClick(indicateBeep);

  // if metronome is running while being diabled, stop it
  $: {
    if (disabled) {
      metro.stop();
    }
  }

  $: metro.setVolume(volume);
</script>

<a-entity {position}>
  <Button
    onClick={toggle}
    label="metronome"
    {width}
    position="{width / 2} 0 0"
  />
  <NumberInput
    label="tempo"
    bind:value={tempo}
    min={60}
    max={240}
    step={5}
    showValue
    position="{width / 2 + 0.025} 0 0"
  />
  {#if showVolumeInput}
    <NumberInput
      label="volume"
      bind:value={volume}
      min={0}
      max={3}
      step={0.1}
      showValue
      position="{width / 2 + 0.1} 0 0"
      formatValue={(d) => d.toFixed(1)}
    />
  {/if}
</a-entity>
