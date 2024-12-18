<script>
  /**
   * button that reacts to clicks, controller point and click, and index finger collision
   */

  export let label = 'button';
  export let onClick = (evt) => console.log('clicked', evt);
  export let position = '0 0 0';
  export let width = 0.02;
  export let height = 0.01;

  // const component = 'button';
  // onMount(() => {
  //   // console.log(AFRAME);
  //   if (AFRAME.components[component]) {
  //     AFRAME.components[component] = undefined;
  //   }
  //   // https://aframe.io/docs/1.6.0/introduction/writing-a-component.html
  //   AFRAME.registerComponent(component, {
  //     init: function () {
  //       this.el.addEventListener('click', this.click);
  //       this.el.addEventListener('touchstart', this.click);
  //     },
  //     remove: function () {
  //       this.el.removeEventListener('click', this.click);
  //       this.el.removeEventListener('touchstart', this.click);
  //     },
  //     multiple: true,
  //     // functions
  //     click: function (evt) {
  //       onClick(evt);
  //     },
  //   });
  // });
</script>

<a-entity {position}>
  <a-entity
    position="{width / 2} 0 0"
    obb-collider="size: 0.02"
    obbcollisionstarted={onClick}
    minimumColliderDimension="0.01"
    {width}
    {height}
  >
  </a-entity>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <a-plane
    color="#333"
    {width}
    {height}
    position="{width / 2} 0 0"
    animation__enter="property: color; from: #333; to: #888; dur: 200; startEvents: mouseenter;"
    animation__out="property: color; from: #888; to: #333; dur: 200; startEvents: mouseleave;"
    sound="src: url(mouse-click.mp3); on: click; poolSize: 30;"
    onclick={onClick}
    ontouchstart={onClick}
    data-raycastable
  >
    <a-text
      value={label}
      color="white"
      width="5"
      position="0 0 0.001"
      scale=".015 .015 .015"
      align="center"
      anchor="center"
      baseline="center"
    ></a-text>
  </a-plane>
</a-entity>
