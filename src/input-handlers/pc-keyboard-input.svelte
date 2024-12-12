<script>
    /**
     * This component handles keyboard input and takes care of setting up and destroying event listeners
     */
    import { onDestroy, onMount } from 'svelte';

    export let key = ' ';
    export let keyDown = (evt) => {};
    export let keyUp = (evt) => {};
    export let ctrlKey = false;
    export let disabled = false;

    const keyDownFn = (evt) => {
        if (disabled) {
            return;
        }
        if (evt.key === key && (!ctrlKey || evt.ctrlKey)) {
            evt.preventDefault();
            keyDown(evt);
        }
    };

    const keyUpFn = (evt) => {
        if (disabled) {
            return;
        }
        if (evt.key === key) {
            evt.preventDefault();
            keyUp(evt);
        }
    };

    // onMount(() => {
    //     document.addEventListener('keydown', keyDownFn);
    //     document.addEventListener('keyup', keyUpFn);
    // });

    // onDestroy(() => {
    //     document.removeEventListener('keydown', keyDownFn);
    //     document.removeEventListener('keyup', keyUpFn);
    // });
</script>

<svelte:window on:keydown={keyDownFn} on:keyup={keyUpFn} />
