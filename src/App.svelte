<script>
  import FretboardSpacetimeCube from './apps/fretboard-spacetime-cube.svelte';

  const apps = [
    {
      id: 'fretboard-spacetime-cube',
      title: 'Fretboard Spacetime Cube',
      // description: 'See how you play across different fretboard positions over time (in 3D)',
      // input: 'MIDI',
      // instruments: ['guitar/bass'],
      // data: ['onset/time', 'instrument'],
      // skills: ['instrument-layout'],
      // patterns: ['spacetime cube', 'instrument layout', 'time is linear', 'time encoded linearly', 'update on note'],
      // timeScale: ['a few bars'],
      // difficulty: ['intermediate', 'advanced'],
      component: FretboardSpacetimeCube,
    },
  ];

  let currentApp;

  const keyDown = (evt) {
    if (evt.key === '')
  }
</script>

<svelte:window onkeydown={keyDown}

<main>
  <h1>ARIPraVis</h1>

  {#each apps as app (app.id)}
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

  {#if currentApp}
    <!-- show app by importing dynamically -->
    <svelte:component this={currentApp.component} appInfo={currentApp} />
  {/if}
</main>

<style>
</style>
