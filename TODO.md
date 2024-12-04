# TODO

- [x] passthrough
- [ ] hand tracking
- [ ] settings
  - [ ] buttons
  - [ ] slider
  - [ ] shortcuts, changing values with joystick etc
  - [ ] MIDI control, toggled with hand button, then used to change values quickly
    - [ ] select scale root
    - [ ] select scale degrees to color
- [ ] attach vis to controller
  - [x] scale fretbord according to instrument
  - [x] scale keyboard according to instrument
  - [ ] controller input
  - [ ] get controller position
  - [ ] calibration mode (mark two points wtih controller)
- [ ] visualizations
  - [x] guitar heatmap
  - [x] guitar bar chart
  - [x] guitar 3D scatterplot
  - [ ] piano heatmap
  - [ ] piano bar chart
  - [ ] piano 3D scatterplot
  - [ ] ...
- [ ] scale select
  - [ ] color vis by scale (in/outside)
  - [ ] color vis by scale degrees (e.g., 1 4 7)
- [ ] legends
  - [x] color legend continuous
    - [ ] d3 ticks for better look
  - [x] color legend swatches
- [ ] timeline
  - [ ] piano roll
  - [ ] tab
  - [ ] brushing & linking to filter time
- [ ] midi streaming from PC to HMD via websockets
  - see https://github.com/fheyen/synced-guitar-tabs
  - [x] server takes midi input
  - [x] server pushes midi messages
  - [x] client connects to server
  - [ ] test with phone and HMD

## Next

- [ ] data storage and loading
- [ ] direct interaction, e.g., pitch and drag to scale time
- [ ] facetting/small multiples

## Later

- [ ] show chords
  - [ ] color per chord
  - [ ] put them into bbox?
- [ ] haptic feedback?
  - [ ] metronome
  - [ ] input/state events, e.g., slider moving
- [ ] acoustic feedback? (tone.js? howler?) https://aframe.io/docs/1.6.0/components/sound.html#main
  - [ ] button interaction, saving, ...

## Maybe

- [ ] other instruments
  - [ ] kalimba
  - [ ] drum kit
  - [ ] kajon
  - [ ] saxophone


## Resources

- a-frame components
  - https://www.npmjs.com/search?q=keywords:aframe&page=1&ranking=optimal

- passthrough
  - according to this you have to do nothing https://timmykokke.com/blog/2023/2023-02-03-webxr-pass-through/
  - https://stackoverflow.com/questions/79068376/what-happened-to-ar-mode-in-aframe
- hand tracking and buttons
  - https://glitch.com/edit/#!/aframe-hand-tracking?path=button.js%3A9%3A21
  - demo https://aframe-gesture-recognition.glitch.me/
- more complex examples without aframe
  - https://immersive-web.github.io/webxr-samples/
- controllers
  - https://aframe.io/docs/1.6.0/introduction/interactions-and-controllers.html
- can we improve performance with this?
  - https://aframe.io/docs/1.6.0/components/renderer.html#multiviewstereo
