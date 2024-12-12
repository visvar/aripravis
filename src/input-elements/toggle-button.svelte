<script>
  import 'aframe';
  import 'aframe-svelte';

  export let label = 'button';
  export let checked = true;
  export let position = '0 0 0';
  export let width = 0.04;
  export let height = 0.01;

  $: switchHeight = height * 0.8;
  $: switchWidth = switchHeight * 2;
  $: margin = height * 0.1;

  const toggle = () => {
    checked = !checked;
  };
</script>

<a-entity {position}>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <a-plane
    color="#333"
    {width}
    {height}
    animation__down="property: position; from: 0 0 0; to: 0 0 0.0025; dur: 200; startEvents: mousedown, touchstart;"
    animation__enter="property: color; from: #333; to: #888; dur: 200; startEvents: mouseenter;"
    animation__out="property: color; from: #888; to: #333; dur: 200; startEvents: mouseleave;"
    sound="src: url(mouse-click.mp3); on: click touchstart; poolSize: 30;"
    onclick={toggle}
    ontouchstart={toggle}
    data-raycastable
  >
    <!-- label -->
    <a-text
      value={label}
      color="white"
      width="5"
      position="-{width / 2 - margin} 0 0.001"
      scale=".015 .015 .015"
      align="left"
      anchor="left"
      baseline="center"
    ></a-text>
    <!-- toggle switch -->
    <a-plane
      position="{width / 4} 0 0.001"
      width={switchWidth}
      height={switchHeight}
      color="#666"
    >
      <a-circle
        position="{checked ? -switchWidth / 4 : switchWidth / 4} 0 0.001"
        color="steelblue"
        radius={height * 0.3}
      >
      </a-circle>
    </a-plane>
  </a-plane>
</a-entity>
