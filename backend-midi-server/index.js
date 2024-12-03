import { WebMidi } from 'webmidi';


function main() {
    console.log('starting up, enabling MIDI');


    const midiMessage = (msg) => {
        console.log(msg.note.number)
        // TODO: send with websockets
    }

    /**
     * Set all required MIDI listeners
     */
    const onMidiEnabled = () => {
        if (WebMidi.inputs.length < 1) {
            console.warn('No MIDI device detected');
        } else {
            WebMidi.inputs.forEach((input, index) => {
                input.removeListener();
                // device.addListener('noteon', noteOn);
                // device.addListener('noteoff', noteOff);
                // device.addListener('controlchange', controlChange);
                // device.addListener('pitchbend', pitchBend);
                input.addListener('midimessage', midiMessage);
                console.log(`MIDI enabled for ${input.name}`);
            });
        }
    };


    // enable Web Midi
    WebMidi.enable()
        .then(onMidiEnabled)
        .catch((err) => {
            console.log(err);

            // errorCallback(err);
        });

    // onDestroy(() => {
    //     // remove MIDI listeners to avoid duplicate calls and improve performance
    //     for (const input of WebMidi.inputs) {
    //         input.removeListener();
    //     }
    // });
}

main()
