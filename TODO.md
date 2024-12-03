# TODO

- [ ] passthrough
- [ ] hand tracking
- [ ] controller input
- [ ] settings
  - [ ] buttons
  - [ ] slider
  - [ ] shortcuts, changing values with joystick etc
- [ ] attach vis to controller
  - [ ] scale according to instrument
- [ ] direct interaction, e.g., pitch and drag to scale time
- [ ] data storage and loading
- [ ] visualizations
  - [ ] heatmap
  - [ ] bar chart
  - [x] 3D scatterplot
  - [ ] ...
- midi streaming from PC to HMD via websockets
  - see https://github.com/fheyen/synced-guitar-tabs
  - [x] server takes midi input
  - [ ] client connects to server
  - [ ] server pushes midi messages




## Resources


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
