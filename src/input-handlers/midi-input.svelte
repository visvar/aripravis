<script>
  /**
   * This component handles MIDI input and takes care of setting up and destroying event listeners
   */
  import { onDestroy, onMount } from 'svelte';
  import { WebMidi } from 'webmidi';

  export let midiMessage = (message) => {};
  export let noteOn = (message) => {};
  export let noteOff = (message) => {};
  export let controlChange = (message) => {};
  export let pitchBend = (message) => {};
  export let errorCallback = (err) => console.error(err);

  let midiDevices = [];
  let disabledDevices = new Set();
  let minVelocity = 0;
  let minIoi = 0;
  let lastNoteTime = 0;

  /**
   * Set all required MIDI listeners
   */
  const onMidiEnabled = () => {
    midiDevices = [];
    if (WebMidi.inputs.length < 1) {
      console.warn('No MIDI device detected');
    } else {
      WebMidi.inputs.forEach((device, index) => {
        device.removeListener();
        if (!disabledDevices.has(index)) {
          device.addListener('noteon', (evt) => {
            // apply noise filters
            if (
              evt.velocity >= minVelocity &&
              evt.timestamp - lastNoteTime > minIoi
            ) {
              lastNoteTime = evt.timestamp;
              noteOn(evt);
            }
          });
          device.addListener('noteoff', noteOff);
          device.addListener('controlchange', controlChange);
          device.addListener('pitchbend', pitchBend);
          device.addListener('midimessage', midiMessage);
        }
      });
      midiDevices = [...WebMidi.inputs];
    }
  };

  onMount(() => {
    // enable Web Midi
    WebMidi.enable()
      .then(onMidiEnabled)
      .catch((err) => {
        errorCallback(err);
      });
  });

  onDestroy(() => {
    // remove MIDI listeners to avoid duplicate calls and improve performance
    for (const input of WebMidi.inputs) {
      input.removeListener();
    }
  });
</script>
