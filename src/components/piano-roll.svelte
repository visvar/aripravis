<script>
    import * as d3 from 'd3';

    export let notes = [];
    export let filteredNotes = [];
    export let position = '0 0 0';
    export let width = 50;
    export let height = 10;

    export let colorMap = (note) => 'white';

    $: timeExtent = d3.extent(notes, (d) => d.time);
    $: scaleTime = d3.scaleLinear().domain(timeExtent).range([0, width]);
    $: pitchExtent = d3.extent(notes, (d) => d.number);
    $: scalePitch = d3.scaleLinear().domain(pitchExtent).range([0, height]);
    $: noteHeight = Math.abs(scalePitch(1) - scalePitch(0));
</script>

<a-entity {position}>
    <!-- background -->
    <a-plane {width} {height} color="#333" opacity="0.5" position="0 0 0">
    </a-plane>
    <!-- notes -->
    {#each notes as note}
        <a-plane
            position="{scaleTime(note.time)} {scalePitch(note.number)} 0.001"
            width={scaleTime(note.duration)}
            height={noteHeight}
            color={colorMap(note)}
        >
        </a-plane>
    {/each}
    <!-- TODO: Y axis -->
    {#each d3.range(...pitchExtent) as pitch}
        <a-text
            value={pitch}
            color="#aaa"
            width="5"
            position="0 {scalePitch(pitch)} 0"
            scale=".015 .015 .015"
            align="right"
            anchor="right"
        ></a-text>
    {/each}
    <!-- TODO: X axis -->
    {#each d3.nice(...pitchExtent, 10) as tick}
        <a-text
            value={tick}
            color="#aaa"
            width="5"
            position="{scaleTime(tick)} 0 0"
            scale=".015 .015 .015"
            align="right"
            anchor="right"
        ></a-text>
    {/each}
</a-entity>
