<script>
    import { onDestroy } from 'svelte';
    import Metronome from '../lib/Metronome.js';

    export let tempo = 120;
    export let accent = 4;
    export let beepCount = 0;
    export let volume = 1;
    export let showBeepCountInput = false;
    export let showVolumeInput = false;
    export let disabled = false;
    export let isBeeping = false;

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

<a-entity>
    <!-- TODO: button for toggle, indicate beep with color change -->
    <!-- TODO: number for tempo -->
    <!-- TODO: button for toggle -->
</a-entity>
