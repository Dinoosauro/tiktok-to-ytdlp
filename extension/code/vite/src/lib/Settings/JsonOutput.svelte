<script lang="ts">
    import { slide } from "svelte/transition";
    import Card from "../Card.svelte";
    import Settings from "./SettingsContainer";
    function changeJson(e: Event, str: string) {
        (e.target as HTMLInputElement).checked
            ? $Settings.exclude_from_json.push(str)
            : $Settings.exclude_from_json.splice(
                  $Settings.exclude_from_json.indexOf(str),
                  1,
              );
        $Settings.exclude_from_json = $Settings.exclude_from_json;
    }
</script>

<div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
    <Card>
        <h2>JSON output:</h2>
        <p>
            Choose which elements will be deleted from the JSON output. If you
            keep only one item, the output will be a string array.
        </p>
        <br />
        {#each ["url", "views", "caption"] as item}
            <label class="flex hcenter autoGap">
                <input
                    type="checkbox"
                    checked={$Settings.exclude_from_json.indexOf(item) !== -1}
                    on:change={(e) => changeJson(e, item)}
                />
                Exclude {item} from the output JSON
            </label><br />
        {/each}
    </Card>
</div>

<style>
    input {
        background-color: var(--input);
    }
</style>
