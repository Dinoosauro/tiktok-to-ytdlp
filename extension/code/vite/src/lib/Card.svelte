<script lang="ts">
    export let type = 0;
</script>

<div
    class="card"
    style={type === 1
        ? "background-color: var(--input)"
        : type === 2
          ? "background-color: darkred"
          : undefined}
>
    <slot></slot>
</div>

<style>
    .card {
        padding: 10px;
        border-radius: 8px;
        background-color: var(--card);
    }
</style>
