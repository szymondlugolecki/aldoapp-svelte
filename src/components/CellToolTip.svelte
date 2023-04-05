<script lang="ts">
	export let textData: string;
	export let tooltipData: string;
	export let position: 'left' | 'top' = 'top';
</script>

<div class="tooltip" class:tooltip-left={position === 'left'} data-tip={tooltipData}>
	<span>{textData}</span>
</div>
