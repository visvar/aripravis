# TODO

1. [TODO](#todo)
   1. [Done](#done)
   2. [Urgent](#urgent)
   3. [Next](#next)
   4. [Later](#later)
   5. [Maybe](#maybe)
   6. [Resources](#resources)


## Done

- [x] passthrough

## Urgent

- [ ] fix performance
  - [x] use plane, circle instead of cylinder and reduce cylinder triangles
  - [ ] turn off antialiasing
  - https://github.com/aframevr/aframe/blob/master/docs/introduction/best-practices.md
  - [x] https://aframe.io/docs/1.6.0/components/renderer.html#multiviewstereo
  - webworkers? https://infinitejs.com/posts/aframe-vr-dev-performance-issues/
  - [ ] test with PCVR


- [ ] hand tracking
- [ ] settings
  - [x] buttons
  - [x] toggle button
  - [x] make work with touch on phone
  - [x] allow to change view (heatmap, barchart, ..., off)
  - [x] allow to change timeline (paino roll, guitar tab, off)
  - [ ] make work with hand tracking
- [ ] attach vis to controller
  - [x] scale fretbord according to instrument
  - [x] scale keyboard according to instrument
  - [ ] controller input
  - [ ] get controller position
  - [ ] for now, hard-coded position and rotation
- [ ] visualizations
  - [x] guitar heatmap
  - [x] guitar bar chart
  - [x] guitar 3D scatterplot
  - [x] piano heatmap
  - [ ] piano roll on top of piano
  - [ ] ...
- [x] scale select
  - [x] color vis by scale (in/outside)
  - [ ] color vis by scale degrees (e.g., 1 4 7)
- [ ] legends
  - [x] color legend continuous
  - [x] color legend swatches
- [ ] timeline
  - [x] piano roll
  - [x] tab
  - [x] performance improvement with canvas texture https://github.com/stemkoski/A-Frame-Examples/blob/master/canvas-texture.html
- [ ] midi streaming from PC to HMD via websockets
  - see https://github.com/fheyen/synced-guitar-tabs
  - [x] server takes midi input
  - [x] server pushes midi messages
  - [x] client connects to server
  - [x] test server with random midi
  - [ ] test with HMD

## Next

- [ ] data storage and loading
- [ ] direct interaction, e.g., pitch and drag to scale time
- [ ] facetting/small multiples
- [ ] MIDI control, toggled with hand button, then used to change values quickly
  - [ ] select scale root
  - [ ] select scale degrees to color
- [ ] record hand tracking
  - https://www.npmjs.com/package/aframe-motion-capture-components
  - [ ] match notes to hand and fingers
- [ ] timeline
  - [ ] brushing & linking to filter time

## Later

- [ ] help texts that tell user what to do and how
- [ ] show chords
  - [ ] color per chord
  - [ ] put them into bbox?
- [ ] haptic feedback?
  - https://github.com/supermedium/superframe/tree/master/components/haptics/
  - [ ] metronome
  - [ ] input/state events, e.g., slider moving

## Maybe

- [ ] other instruments
  - [ ] kalimba
  - [ ] drum kit
  - [ ] kajon
  - [ ] saxophone
- [ ] record audio through quest mic and play back with https://www.youtube.com/watch?v=JBtBQQ_mKw4&list=PLP3KjR1TMw7ekqC4o5gy0rR4odw7Jga84&index=15





## Resources

- a-frame tutorial
  - https://www.youtube.com/playlist?list=PLP3KjR1TMw7ekqC4o5gy0rR4odw7Jga84
- a-frame components
  - npm search https://www.npmjs.com/search?q=keywords:aframe&page=1&ranking=optimal
  - collection https://github.com/supermedium/superframe#readme
  - draw texture like an HTML canvas
    - https://aframe.io/docs/1.6.0/components/material.html#canvas-textures
- world and object coordinates
  - https://aframe.io/docs/1.6.0/introduction/developing-with-threejs.html
- hand tracking and buttons
  - https://glitch.com/edit/#!/aframe-hand-tracking?path=button.js%3A9%3A21
  - demo https://aframe-gesture-recognition.glitch.me/
- more complex examples without aframe
  - https://immersive-web.github.io/webxr-samples/
- controllers
  - https://aframe.io/docs/1.6.0/introduction/interactions-and-controllers.html

- audio anlyzer https://github.com/supermedium/superframe/tree/master/components/audioanalyser/
