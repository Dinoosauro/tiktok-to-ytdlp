<script>
    import { slide } from "svelte/transition";
    import Card from "../Card.svelte";
    import Settings from "./SettingsContainer";
</script>

<div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
    <Card>
        <h2>Output file settings:</h2>
        <Card type={1}>
            <h3>Content to fetch:</h3>
            <label class="flex hcenter autoGap">
                Download videos with at least
                <input type="number" bind:value={$Settings.min_views} /> views
            </label><br />
            <label class="flex hcenter autoGap">
                <input type="checkbox" bind:checked={$Settings.allow_images} /> Download
                also images
            </label>
        </Card><br />
        <Card type={1}>
            <h3>File name options:</h3>
            <p>Choose how the file should be named:</p>
            <Card>
                <select
                    bind:value={$Settings.output_name_type}
                    style="background-color: var(--input);"
                >
                    <option value={-1}>Custom file name</option>
                    <option value={0}>Get it from [data-] tags</option>
                    <option value={1}>Get it from window title</option>
                    <option value={2}>Get it from the first h1 element</option>
                </select>
                {#if $Settings.output_name_type === -1}
                    <br /><br />
                    <label
                        class="flex hcenter autoGap"
                        in:slide={{ duration: 200 }}
                        out:slide={{ duration: 200 }}
                    >
                        File name:
                        <input
                            type="text"
                            class="fullWidth"
                            style="background-color: var(--input);"
                            bind:value={$Settings.__extension.fileName}
                        />
                    </label>
                {/if}
            </Card><br />
            <label class="flex hcenter autoGap">
                <input
                    type="checkbox"
                    bind:checked={$Settings.adapt_text_output}
                />
                Disallow characters prohibited by Windows in the output file
            </label>
        </Card>
    </Card>
</div>
