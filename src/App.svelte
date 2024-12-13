<script>
  import { onDestroy } from 'svelte';
  import HandsTest from './apps/hands-test.svelte';
  import TimelineTest from './apps/timeline-test.svelte';
  import ControllerTest from './apps/controller-test.svelte';
  import PcKeyboardInput from './input-handlers/pc-keyboard-input.svelte';
  import PianoHeatmap from './apps/piano-heatmap.svelte';
  import { version } from '../package.json';
  import VibrateTest from './apps/vibrate-test.svelte';
  import Guitar from './apps/guitar.svelte';
  import TestCanvas from './tests/test-canvas2.svelte';

  const pw = 'ari';
  let spw = localStorage.getItem('pw') ?? '';
  $: localStorage.setItem('pw', spw);

  let wsUrl = localStorage.getItem('wsUrl') ?? 'ws://localhost:8080';
  let ws;
  let connected = false;
  $: initWebSocket(wsUrl);

  const initWebSocket = (wsUrl) => {
    try {
      ws?.close();
      ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        console.log('ws connected');
        connected = true;
        localStorage.setItem('wsUrl', wsUrl);
      };
      ws.onmessage = async (msg) => {
        console.log('got message');
        console.log(JSON.parse(msg.data));
      };
      ws.onclose = () => {
        console.warn('connection closed');
        connected = false;
      };
    } catch (e) {
      console.log(e);
    }
  };

  const apps = [
    {
      title: 'Guitar',
      component: Guitar,
    },
    {
      title: 'Piano Heatmap',
      component: PianoHeatmap,
    },
    {
      title: 'Timeline Test',
      component: TimelineTest,
    },
    {
      title: 'Hands Test',
      component: HandsTest,
    },
    {
      title: 'Controller Test',
      component: ControllerTest,
    },
  ];

  let currentApp = null;

  onDestroy(() => {
    ws?.close();
  });
</script>

<PcKeyboardInput
  key="Escape"
  keyDown={() => {
    currentApp = null;
  }}
/>

<main>
  {#if spw !== pw}
    <input type="password" bind:value={spw} placeholder="password" />
  {:else if !currentApp}
    <h1>ARIPraVis</h1>

    {#each apps as app}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="card" on:click={() => (currentApp = app)}>
        <h2>
          {app.title}
        </h2>
        <div class="description">
          {app.description}
        </div>
      </div>
    {/each}

    <div>
      <h3>Connect to a separate MIDI PC (optional)</h3>
      <input type="text" placeholder="WebSocket URL" bind:value={wsUrl} />
      <div>
        {connected ? 'connected' : 'not found'}
      </div>
    </div>

    <footer>
      version {version} |
      <a href="https://github.com/visvar/aripravis" target="_blank">GitHub</a>
    </footer>
  {:else}
    <!-- show app by importing dynamically -->
    <svelte:component this={currentApp.component} bind:currentApp />
  {/if}
</main>

<style>
  .card {
    margin: 10px;
    padding: 10px;
    cursor: pointer;
  }

  .card h2 {
    margin: 0;
  }

  .card h2:hover {
    text-shadow: steelblue 0 0 30px;
  }

  footer {
    margin-top: 40px;
  }
</style>
