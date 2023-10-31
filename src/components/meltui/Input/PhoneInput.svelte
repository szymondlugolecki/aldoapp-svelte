<script lang="ts">
	import { Input } from '$shadcn/input';

	export let defaultRole: string | undefined = undefined;
</script>

<div class="flex items-center gap-2">
	<div class="text-sm">+48</div>
	<Input
		type="tel"
		class="max-w-xs"
		pattern="[0-9]{9}"
		value={defaultRole}
		placeholder="123456789"
	/>
</div>
