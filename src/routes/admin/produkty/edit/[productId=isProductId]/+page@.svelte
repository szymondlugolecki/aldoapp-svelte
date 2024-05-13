<script lang="ts">
	import { Textarea } from '$shadcn/textarea';
	import { Input } from '$shadcn/input';

	import * as Form from '$shadcn/form';
	import SuperDebug from 'sveltekit-superforms';

	import { products$ } from '$lib/client/schemas';
	import { buttonVariants } from '$components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import type { EditProductForm } from '$lib/client/schemas/products';
	import Spinner from '$components/custom/Util/Spinner.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from '$components/ui/select';
	import SelectCategories from '../../(components)/select-categories-edit.svelte';
	import SelectProducent from '../../(components)/select-producent.svelte';
	import { toast } from 'svelte-sonner';

	import EditLayout from '$routes/admin/(components)/edit-layout.svelte';
	import EditPageNavigationButtons from '$routes/admin/(components)/edit-page-navigation-buttons.svelte';
	import Separator from '$components/ui/separator/separator.svelte';

	export let data;

	const form = superForm(data.form, {
		id: data.product.id.toString(),
		validators: zodClient(products$.editForm),
		onUpdated: ({ form: f }) => {
			console.log(f, f.message, f.posted, f.errors);
			if (f.valid) {
				toast.success(`Sukces`);
			} else {
				const errors = f.errors['_errors'];
				toast.error(errors ? errors[0] : 'Niespodziewany błąd');
			}
		},
		invalidateAll: true
	});

	const { form: formData, enhance, delayed, submitting, reset } = form;

	$: isHidden = $formData.hidden
		? {
				label: 'Ukryty',
				value: $formData.hidden
		  }
		: undefined;

	// const file = fileProxy(form, 'images');
</script>

<EditLayout>
	<h1 class="text-3xl font-extrabold tracking-tight scroll-m-20 lg:text-4xl">Edycja produktu</h1>

	<form
		method="POST"
		action="?/edit"
		use:enhance
		class="flex flex-col gap-y-2"
		enctype="multipart/form-data"
	>
		<Form.Field {form} name="id">
			<Form.Control let:attrs>
				<input hidden bind:value={$formData.id} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Nazwa</Form.Label>
				<Input {...attrs} bind:value={$formData.name} required spellcheck="false" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="symbol">
			<Form.Control let:attrs>
				<Form.Label>Kod produktu</Form.Label>
				<Input {...attrs} required bind:value={$formData.symbol} spellcheck="false" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Separator />

		<SelectCategories {form} />

		<Separator />

		<SelectProducent {form} />

		<Separator />

		<Form.Field {form} name="price">
			<Form.Control let:attrs>
				<Form.Label>Cena</Form.Label>
				<Input
					{...attrs}
					required
					bind:value={$formData.price}
					type="number"
					spellcheck="false"
					step="0.01"
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="weight">
			<Form.Control let:attrs>
				<Form.Label>Waga</Form.Label>
				<Input
					{...attrs}
					required
					bind:value={$formData.weight}
					type="number"
					spellcheck="false"
					step="0.01"
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Separator />

		<Form.Field {form} name="images">
			<Form.Control let:attrs>
				<Form.Label>Zdjęcie</Form.Label>
				<Input
					{...attrs}
					type="file"
					accept="image/png, image/jpg, image/jpeg, image/webp, image/avif"
					on:input={(e) => ($formData.images = e.currentTarget.files?.item(0) || undefined)}
				/>
			</Form.Control>
			<Form.Description>Wybierz zdjęcie produktu</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Separator />

		<Form.Field {form} name="description">
			<Form.Control let:attrs>
				<Form.Label>Opis</Form.Label>
				<Textarea
					{...attrs}
					placeholder="Tu wpisz opis produktu..."
					class="resize-none"
					bind:value={$formData.description}
					spellcheck="false"
				/>
				<Form.Description>Opis nie jest wymagany</Form.Description>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="hidden">
			<Form.Control let:attrs>
				<Form.Label>Ukryty</Form.Label>

				<Select.Root
					selected={isHidden}
					onSelectedChange={(v) => {
						v && ($formData.hidden = v.value);
					}}
				>
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="Wybierz czy ukryć przedmiot" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value={false} label="Nie" />
						<Select.Item value={true} label="Tak" />
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.hidden} name={attrs.name} />
			</Form.Control>
			<Form.Description>Ukryte produkty nie będą wyświetlane w sklepie.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<EditPageNavigationButtons delayed={$delayed} submitting={$submitting} {reset} />
		<!-- <SuperDebug data={$formData} /> -->
	</form>
</EditLayout>
