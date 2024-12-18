<script>
  export let label = 'button';
  export let checked = true;
  export let position = '0 0 0';
  export let width = 0.04;
  export let height = 0.01;

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
    position="{width / 2} 0 0"
    animation__enter="property: color; from: #333; to: #888; dur: 200; startEvents: mouseenter;"
    animation__out="property: color; from: #888; to: #333; dur: 200; startEvents: mouseleave;"
    sound="src: url(mouse-click.mp3); on: click touchstart; poolSize: 30;"
    onclick={toggle}
    ontouchstart={toggle}
    data-raycastable
  >
    <!-- label -->
    <a-text
      value="{label}: {checked ? 'on' : 'off'}"
      color="white"
      width="5"
      position="{-0.6 * height} 0 0.001"
      scale=".015 .015 .015"
      align="center"
      anchor="center"
      baseline="center"
    ></a-text>
    <!-- toggle switch -->
    <!-- <a-circle
      position="{width / 2 - 0.6 * height} 0 0.001"
      color={checked ? 'steelblue' : '#aaa'}
      radius={height * 0.3}
      segments="4"
    >
    </a-circle>-->
  </a-plane>
</a-entity>
