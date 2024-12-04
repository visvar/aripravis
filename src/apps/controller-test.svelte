<script>
	import { onMount } from 'svelte';
	import 'aframe';
	import 'aframe-svelte';
	import * as AFRAME from 'aframe';

	/**
	 * - allow interaction to reset notes and scale time
	 *  - https://aframe.io/docs/1.5.0/guides/building-a-basic-scene.html#event-listener-component-intermediate
	 *  - support VR controllers?
	 *      - https://aframe.io/docs/1.5.0/introduction/interactions-and-controllers.html
	 * 	- https://github.com/aframevr/aframe/blob/master/docs/components/meta-touch-controls.md
	 */

	let debugMsg = '';

	onMount(() => {
		// console.log(AFRAME);
		AFRAME.registerComponent('thumbstick-logging', {
			init: function () {
				this.el.addEventListener('thumbstickmoved', this.logThumbstick);
			},
			logThumbstick: function (evt) {
				let direction = '';
				if (evt.detail.y > 0.95) {
					direction = 'DOWN';
				}
				if (evt.detail.y < -0.95) {
					direction = 'UP';
				}
				if (evt.detail.x < -0.95) {
					direction = 'LEFT';
				}
				if (evt.detail.x > 0.95) {
					direction = 'RIGHT';
				}
				debugMsg = `x ${evt.detail.x} y ${evt.detail.y} dir ${direction}`;
			},
		});
	});
</script>

<main class="app">
	<a-scene
		xrweb="mode: immersive-ar;"
		xr-mode-ui="enabled: true; enterAREnabled: true; XRMode: ar;"
		renderer="colorManagement: true; antialias: true; foveationLevel: 1; highRefreshRate: true;"
	>
		<!-- controllers -->
		<a-entity oculus-touch-controls="hand: left"></a-entity>
		<a-entity oculus-touch-controls="hand: right"></a-entity>
		<!-- text for debugging -->
		<a-entity
			text="value: {debugMsg}; color: #666; width: 5"
			position="-2 1 -3"
			scale=".25 .25 .25"
		></a-entity>
	</a-scene>
</main>
