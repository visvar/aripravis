<script>
    import * as d3 from 'd3';
    import { Note } from 'tonal';

    export let notes = [];
    export let filteredNotes = [];
    export let position = '0 0 0';
    export let width = 0.5;
    export let height = 0.06;
    export let stringCount = 6;

    export let colorMap = (note) => 'white';

    // E standard tuning, strings start at high E
    let tuningPitches = [64, 59, 55, 50, 45, 40];
    const tuningNotes = tuningPitches.map(Note.fromMidiSharps);
    // const stringColors = tuningNotes.map(()=>'#aaa')
    const stringColors = d3.schemeObservable10;

    $: timeMin = d3.min(notes, (d) => d.time);
    $: timeMax = d3.max(notes, (d) => d.time + d.duration);
    $: scaleTime = d3
        .scaleLinear()
        .domain([timeMin, timeMax])
        .range([0, width]);
    $: scaleString = d3
        .scaleLinear()
        .domain([stringCount - 1, 0])
        .range([0, height]);
    $: noteHeight = 0.9 * Math.abs(scaleString(1) - scaleString(2));
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
    <!-- string background stripes -->
    {#each d3.range(stringCount) as string}
        <a-plane
            position="{width / 2} {scaleString(string)} 0.001"
            {width}
            height={noteHeight / 8}
            color={stringColors[string]}
        >
        </a-plane>
    {/each}
    <!-- notes -->
    {#each notes as note}
        <a-plane
            position="{scaleTime(note.time + note.duration / 2)} {scaleString(
                note.string,
            )} 0.004"
            width={scaleTime(note.duration)}
            height={noteHeight}
            color={colorMap(note)}
        >
        </a-plane>
        <a-text
            position="{scaleTime(note.time) + 0.001} {scaleString(
                note.string,
            )} 0.004"
            width={5}
            value={note.fret}
            color="#333"
            scale=".015 .015 .015"
            align="left"
            anchor="left"
        >
        </a-text>
    {/each}
    <!--  Y axis -->
    {#each d3.range(stringCount) as string}
        <a-text
            value={tuningNotes[string]}
            color="#aaa"
            width="5"
            position="-0.005 {scaleString(string)} 0"
            scale=".015 .015 .015"
            align="right"
            anchor="right"
        ></a-text>
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
