<script>
    import * as d3 from 'd3';
    import { Midi } from 'musicvis-lib';

    export let notes = [];
    export let filteredNotes = [];
    export let position = '0 0 0';
    export let width = 0.5;
    export let height = 0.1;

    export let colorMap = (note) => 'white';

    $: timeMin = d3.min(notes, (d) => d.time);
    $: timeMax = d3.max(notes, (d) => d.time + d.duration);
    $: scaleTime = d3
        .scaleLinear()
        .domain([timeMin, timeMax])
        .range([0, width]);
    $: pitchExtent = d3.extent(notes, (d) => d.number);
    $: scalePitch = d3
        .scaleLinear()
        .domain([pitchExtent[0] - 1, pitchExtent[1] + 1])
        .range([0, height]);
    $: noteHeight = 0.9 * Math.abs(scalePitch(1) - scalePitch(0));
</script>

<a-entity {position}>
    <!-- background -->
    <a-plane
        {width}
        {height}
        color="#333"
        opacity="0.5"
        position="{width / 2} {height / 2} 0"
    >
    </a-plane>
    <!-- notes -->
    {#each notes as note (note.time)}
        <a-plane
            position="{scaleTime(note.time + note.duration / 2)} {scalePitch(
                note.number,
            )} 0.002"
            width={scaleTime(note.duration)}
            height={noteHeight}
            color={colorMap(note)}
        >
        </a-plane>
    {/each}
    <!--  Y axis -->
    {#each d3.range(pitchExtent[0], pitchExtent[1] + 1) as pitch}
        <a-text
            value="{Midi.NOTE_NAMES[pitch % 12]}{pitch % 12 === 0
                ? Math.floor(pitch / 12)
                : ''}"
            color="#aaa"
            width="5"
            position="-0.005 {scalePitch(pitch)} 0"
            scale=".015 .015 .015"
            align="right"
            anchor="right"
        ></a-text>
        <!-- sharps background stripes -->
        {#if Midi.SHARPS.has(pitch % 12)}
            <a-plane
                position="{width / 2} {scalePitch(pitch)} 0.001"
                {width}
                height={noteHeight}
                color="#000"
                opacity="0.5"
            >
            </a-plane>
        {/if}
    {/each}
    <!--  X axis -->
    {#each d3.ticks(timeMin, timeMax, 10) as tick}
        <a-text
            value={tick}
            color="#aaa"
            width="5"
            position="{scaleTime(tick)} -0.005 0"
            scale=".015 .015 .015"
            align="center"
            anchor="center"
            baseline="top"
        ></a-text>
    {/each}
</a-entity>
