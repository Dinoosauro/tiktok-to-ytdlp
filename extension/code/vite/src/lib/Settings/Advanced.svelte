<script>
    import { slide } from "svelte/transition";
    import Card from "../Card.svelte";
    import Settings from "./SettingsContainer";
</script>

<div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
    <Card>
        <h2>Advanced options:</h2>
        <Card type={1}>
            <h3>Link options:</h3>
            <label class="flex hcenter autoGap">
                <input
                    type="checkbox"
                    bind:checked={$Settings.advanced.check_nullish_link}
                />
                Don't add nullish links to the output file
            </label><br />
            <label class="flex hcenter autoGap">
                <input
                    type="checkbox"
                    bind:checked={$Settings.advanced.get_link_by_filter}
                />
                Get the link by looking to the children of the video container, instead
                of relying on [data] attributes
            </label><br />
            <label class="flex hcenter autoGap">
                <input
                    type="checkbox"
                    bind:checked={$Settings.advanced.log_link_error}
                />
                Log errors occurred while getting the URL in the console
            </label>
        </Card><br />
        <Card type={1}>
            <h3>Maximum URLs:</h3>
            <p>
                Note that tiktok-to-ytdlp will stop scrolling when more than <i
                    >x</i
                >
                elements are found. If there are more elements in that page, more
                than <i>x</i> elements will be added in the script.<br />Put a
                negative number to download every video
            </p>
            <br />
            <input
                type="number"
                bind:value={$Settings.advanced.maximum_downloads}
            />
        </Card><br />
        <Card type={1}>
            <h3>Array options:</h3>
            <label class="flex hcenter autoGap">
                <input
                    type="checkbox"
                    bind:checked={$Settings.advanced.get_array_after_scroll}
                /> Get the array after each scroll, instead of getting it at the
                end
            </label>
        </Card>
    </Card>
</div>
