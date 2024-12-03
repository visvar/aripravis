<script>
    export let colorMap = new Map();
    export let position = '0 0 0';
    export let title = 'title';
</script>

<a-entity {position}>
    <a-text
        value={title}
        color="#aaa"
        width="5"
        position="0 0.06 0"
        scale=".02 .02 .02"
        align="left"
        anchor="left"
    ></a-text>
    {#each [...colorMap.entries()] as [value, color], index}
        <a-plane
            position="0.0025 {0.05 - index * 0.007} 0"
            {color}
            width={0.005}
            height="0.005"
        >
        </a-plane>
        <a-text
            {value}
            color="#aaa"
            width="5"
            position="0.0075 {0.05 - index * 0.007} 0"
            scale=".015 .015 .015"
            align="left"
            anchor="left"
        ></a-text>
    {/each}
</a-entity>
