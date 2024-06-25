<script>
    import { slide } from "svelte/transition";
    import Settings from "./SettingsContainer";
    import Card from "../Card.svelte";
</script>

<div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
    <Card>
        <h2>Scroll options:</h2>
        <label class="flex hcenter autoGap"
            >Minimum delay between scrolling: <input
                style="background-color: var(--input);"
                type="number"
                bind:value={$Settings.scrolling_min_time}
            /></label
        ><br />
        <label class="flex hcenter autoGap"
            >Maximum delay between scrolling: <input
                style="background-color: var(--input);"
                type="number"
                bind:value={$Settings.scrolling_max_time}
            /></label
        ><br />
    </Card>
</div>
