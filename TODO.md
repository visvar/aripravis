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
  - https://github.com/aframevr/aframe/blob/master/docs/introduction/best-practices.md
  - https://aframe.io/docs/1.6.0/components/renderer.html#multiviewstereo
  - webworkers? https://infinitejs.com/posts/aframe-vr-dev-performance-issues/


- [ ] hand tracking
  - [ ] maybe use https://github.com/c-frame/aframe-super-hands-component
- [ ] settings
  - [x] buttons
  - [x] toggle button
  - [ ] make work with touch on phone
  - [ ] make work with hand tracking
  - [ ] allow to change view (heatmap, barchart, ..., off)
  - [x] allow to change timeline (paino roll, guitar tab, off)
- [ ] attach vis to controller
  - [x] scale fretbord according to instrument
  - [x] scale keyboard according to instrument
  - [ ] controller input
  - [ ] get controller position
  - [ ] calibration mode (mark two points wtih controller)
    - [ ] or superhand to just grab and drag there? https://www.youtube.com/watch?v=vQ85u3dzmZY&list=PLP3KjR1TMw7ekqC4o5gy0rR4odw7Jga84&index=13
- [ ] visualizations
  - [x] guitar heatmap
  - [x] guitar bar chart
  - [x] guitar 3D scatterplot
  - [x] piano heatmap
  - [ ] piano bar chart
  - [ ] piano 3D scatterplot
  - [ ] ...
- [x] scale select
  - [x] color vis by scale (in/outside)
  - [ ] color vis by scale degrees (e.g., 1 4 7)
- [ ] legends
  - [x] color legend continuous
    - [ ] d3 ticks for better look
  - [x] color legend swatches
- [ ] timeline
  - [x] piano roll
  - [x] tab
  - [ ] performance improvement with https://github.com/mayognaise/aframe-draw-shader
  - [ ] brushing & linking to filter time
- [ ] midi streaming from PC to HMD via websockets
  - see https://github.com/fheyen/synced-guitar-tabs
  - [x] server takes midi input
  - [x] server pushes midi messages
  - [x] client connects to server
  - [x] test server with random midi
  - [ ] test with phone and HMD

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
  - draw texture like an HTML canvas https://github.com/mayognaise/aframe-draw-shader
- world and object coordinates
  - https://aframe.io/docs/1.6.0/introduction/developing-with-threejs.html
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

- audio anlyzer https://github.com/supermedium/superframe/tree/master/components/audioanalyser/
