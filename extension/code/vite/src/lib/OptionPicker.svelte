<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Card from "./Card.svelte";

    interface ProvidedOption {
        id: string;
        text: string;
        selected?: boolean;
    }
    export let providedOptions: ProvidedOption[];
    let dispatch = createEventDispatcher();
    let container: HTMLElement;
    /**
     * Change the button color, and trigger the selection changed event
     * @param e the Click event
     * @param id the ID of the resource clicked
     */
    function buttonChange(e: Event, id: string) {
        container.querySelector(".selected")?.classList?.remove("selected");
        (e.target as HTMLElement).classList.add("selected");
        dispatch("changeSection", id);
    }
</script>

<Card>
    <div>
        <div
            class="flex hcenter autoGap"
            bind:this={container}
            style="flex-wrap: wrap;"
        >
            {#each providedOptions as option (option.id)}
                <div
                    class={`chipItem${option.selected ? " selected" : ""}`}
                    on:click={(e) => buttonChange(e, option.id)}
                >
                    {option.text}
                </div>
            {/each}
        </div>
    </div>
</Card>

<style>
    .chipItem {
        border-radius: 12px;
        background-color: var(--input);
        line-height: 20px;
        height: 20px;
        transition: 0.2s ease-in-out;
        transition-property: background-color filter;
        padding: 5px 10px;
    }
</style>
