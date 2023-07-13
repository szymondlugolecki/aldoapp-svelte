<script lang="ts">
	import { flyAndScale } from '$lib/client/functions';
	import { createDialog } from '@melt-ui/svelte';
	import { X, Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { createCombobox } from '@melt-ui/svelte';

	interface Book {
		author: string;
		title: string;
		disabled: boolean;
	}

	let books: Book[] = [
		{
			author: 'Harper Lee',
			title: 'To Kill a Mockingbird',
			disabled: false
		},
		{
			author: 'Lev Tolstoy',
			title: 'War and Peace',
			disabled: false
		},
		{
			author: 'Fyodor Dostoyevsy',
			title: 'The Idiot',
			disabled: true
		},
		{
			author: 'Oscar Wilde',
			title: 'A Picture of Dorian Gray',
			disabled: false
		},
		{
			author: 'George Orwell',
			title: '1984',
			disabled: false
		},
		{
			author: 'Jane Austen',
			title: 'Pride and Prejudice',
			disabled: false
		},
		{
			author: 'Marcus Aurelius',
			title: 'Meditations',
			disabled: false
		},
		{
			author: 'Fyodor Dostoevsky',
			title: 'The Brothers Karamazov',
			disabled: false
		},
		{
			author: 'Lev Tolstoy',
			title: 'Anna Karenina',
			disabled: false
		},
		{
			author: 'Fyodor Dostoevsky',
			title: 'Crime and Punishment',
			disabled: false
		}
	];

	const { trigger, portal, overlay, content, title, description, close, open } = createDialog();

	const {
		open: comboBoxOpen,
		input,
		menu,
		item,
		inputValue,
		isSelected,
		filteredItems
	} = createCombobox({
		filterFunction: (item, inputValue) => {
			// Example string normalization function. Replace as needed.
			const normalize = (str: string) => str.normalize().toLowerCase();
			const normalizedInput = normalize(inputValue);
			return (
				normalizedInput === '' ||
				normalize(item.title).includes(normalizedInput) ||
				normalize(item.author).includes(normalizedInput)
			);
		},
		items: books,
		itemToString: (item) => item.title
	});
</script>

<button
	{...$trigger}
	use:trigger
	class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
      font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75"
>
	Open Dialog
</button>
<div use:portal>
	{#if $open}
		<div {...$overlay} class="fixed inset-0 z-40 bg-black/50" />
		<div
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px]
              translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-[25px]
              shadow-lg"
			transition:flyAndScale={{
				duration: 150,
				y: 8,
				start: 0.96
			}}
			{...$content}
			use:content
		>
			<h2 {...$title} class="m-0 text-lg font-medium text-black">Edit profile</h2>
			<p {...$description} class="mb-5 mt-[10px] leading-normal text-zinc-600">
				Make changes to your profile here. Click save when you're done.
			</p>

			<label class="cursor-pointer">
				<span class="block pb-1 capitalize">Choose your favorite book:</span>
				<div class="relative">
					<input
						{...$input}
						class="flex h-10 items-center justify-between rounded-md bg-white
                          px-3 pr-12 text-magnum-700"
						placeholder="Best book ever"
						use:input
						value={$inputValue}
					/>
					<div class="absolute right-1 top-1/2 z-10 -translate-y-1/2 text-magnum-700">
						{#if $open}
							<ChevronUp />
						{:else}
							<ChevronDown />
						{/if}
					</div>
				</div>
			</label>

			<div class="z-50 flex max-h-[300px] flex-col overflow-hidden rounded-md" {...$menu} use:menu>
				<ul class="flex max-h-full flex-col gap-2 overflow-y-auto bg-white px-2 py-2">
					{#if $open}
						{#if $filteredItems.length !== 0}
							{#each $filteredItems as book, index (index)}
								<li
									{...$item({
										index,
										item: book,
										disabled: book.disabled
									})}
									use:item
									class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800
                                      data-[highlighted]:bg-magnum-100 data-[highlighted]:text-magnum-700
                                      data-[disabled]:opacity-50"
								>
									{#if $isSelected(book)}
										<div class="check">
											<Check />
										</div>
									{/if}
									<div>
										<span>{book.title}</span>
										<span class="block text-sm opacity-70">{book.author}</span>
									</div>
								</li>
							{/each}
						{:else}
							<li
								class="relative cursor-pointer rounded-md py-1 pl-8 pr-4
                                  text-neutral-800 data-[highlighted]:bg-magnum-100
                                  data-[highlighted]:text-magnum-700"
							>
								No results found
							</li>
						{/if}
					{/if}
				</ul>
			</div>

			<div class="mt-[25px] flex justify-end gap-4">
				<button
					{...$close}
					use:close
					class="inline-flex h-[35px] items-center justify-center rounded-[4px]
                      bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
				>
					Cancel
				</button>
				<button
					{...$close}
					use:close
					class="inline-flex h-[35px] items-center justify-center rounded-[4px]
                      bg-magnum-100 px-4 font-medium leading-none text-magnum-900"
				>
					Save changes
				</button>
			</div>

			<button
				{...$close}
				use:close
				class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px]
                  appearance-none items-center justify-center rounded-full text-magnum-800
                  hover:bg-magnum-100 focus:shadow-magnum-400"
			>
				<X />
			</button>
		</div>
	{/if}
</div>

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-red-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
