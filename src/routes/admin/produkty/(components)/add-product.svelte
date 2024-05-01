<script lang="ts">
	import * as Dialog from '$shadcn/dialog';
	import * as Form from '$shadcn/form';

	import { buttonVariants } from '$components/ui/button';
	import { products$ } from '$lib/client/schemas';
	import type { AddProductForm } from '$lib/client/schemas/products';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import RequiredAsterisk from '$components/custom/Util/RequiredAsterisk.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import SelectCategories from './select-categories-add.svelte';
	import { Input } from '$components/ui/input';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	// export let enhance: ReturnType<typeof superForm>['enhance'];
	export let superform: SuperValidated<Infer<AddProductForm>>;

	let open = false;

	const form = superForm(superform, {
		validators: zodClient(products$.addForm),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				open = false;
				console.log(f, f.message, f.posted, f.errors);
				// toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
				toast.success(`Sukces`);
			} else {
				toast.error('Błąd');
			}
		}
	});
	const { form: formData, enhance, delayed, submitting } = form;
</script>

<Dialog.Root bind:open closeOnOutsideClick={false}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Dodaj produkt</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Dodaj produkt</Dialog.Title>
			<Dialog.Description>Kliknij przycisk poniżej, aby zapisać zmiany</Dialog.Description>
		</Dialog.Header>

		<!-- <div class="overflow-y-auto h-52"><SuperDebug data={form} /></div> -->

		<!-- <Form.Root
			method="POST"
			action="?/add"
			{form}
			schema={products$.addForm}
			let:config
			class="flex flex-col gap-y-2"
			options={{
				onResult: ({ result }) => {
					console.log('result', result);
					if (result.type === 'success') {
						open = false;
					}
				}
			}}
		> -->

		<form method="POST" class="flex flex-col gap-y-2" action="?/edit" use:enhance>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Nazwa<RequiredAsterisk required /></Form.Label>
					<Input {...attrs} bind:value={$formData.name} required spellcheck="false" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="symbol">
				<Form.Control let:attrs>
					<Form.Label>Kod produktu<RequiredAsterisk required /></Form.Label>
					<Input
						{...attrs}
						bind:value={$formData.symbol}
						required
						placeholder="ABCD-1234"
						spellcheck="false"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="price">
				<Form.Control let:attrs>
					<Form.Label>Cena<RequiredAsterisk /></Form.Label>
					<Input
						{...attrs}
						bind:value={$formData.price}
						type="number"
						placeholder="50"
						required
						step="0.01"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="weight">
				<Form.Control let:attrs>
					<Form.Label>Waga (kg)<RequiredAsterisk /></Form.Label>
					<Input
						{...attrs}
						bind:value={$formData.weight}
						type="number"
						placeholder="25"
						required
						step="0.01"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<SelectCategories {form} />

			<div class="flex justify-end">
				<Form.Button class="w-20" disabled={$submitting}>
					{#if $delayed}
						<Spinner />
					{:else}
						Zapisz
					{/if}
				</Form.Button>
			</div>
		</form>
		<!-- </Form.Root> -->

		<!-- <form method="post" action="?/add" use:enhance>
			<div class="flex flex-col gap-y-2">
				<DialogInput name="name" label="Nazwa" required />
				<DialogInput name="symbol" label="Kod produktu" required placeholder="0123-4567" />

				<SelectProducent bind:combobox={producentCombobox} required />
				<SelectCategories bind:combobox={categoryCombobox} bind:subcategoryCombobox required />

				<DialogInput
					name="price"
					label="Cena"
					type="number"
					step="0.01"
					required
					placeholder="50"
				/>
				<DialogInput name="weight" label="Waga (kg)" type="number" placeholder="25" required />

				<div class="flex justify-end">
					<Form.Button class="w-20">Dodaj</Form.Button>
				</div>
			</div>
		</form> -->
	</Dialog.Content>
</Dialog.Root>
