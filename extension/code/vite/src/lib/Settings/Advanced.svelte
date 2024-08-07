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
                    bind:checked={$Settings.advanced
                        .get_video_container_from_e2e}
                />
                Use the [data-e2e] attributes for getting the video container, instead
                of the normal CSS class. Enable this if the extraction fails
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
                /> Get the array at the end, instead of getting it after each scroll
            </label><br />
            {#if !$Settings.advanced.get_array_after_scroll}
                <label
                    class="flex hcenter autoGap"
                    in:slide={{ duration: 200 }}
                    out:slide={{ duration: 200 }}
                >
                    <input
                        type="checkbox"
                        bind:checked={$Settings.advanced.delete_from_dom}
                    />
                    Automatically delete items from the DOM, so that page performances
                    can be improved. [Experimental: enable this only if you need
                    to]
                </label>
            {/if}
        </Card>
    </Card>
</div>
