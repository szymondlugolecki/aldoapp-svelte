<script>
	import {
		Button,
		Modal,
		Label,
		Input,
		Checkbox,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Search
	} from 'flowbite-svelte';

	import { PlusCircle } from 'lucide-svelte';

	let formModal = false;
</script>

<section class="w-full h-full p-2 space-y-3">
	<div class="flex space-x-5 items-center">
		<Search placeholder="Szukaj" />
		<button
			class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex justify-center items-center"
			on:click={() => (formModal = true)}><PlusCircle class="mr-2" />Nowy użytkownik</button
		>
	</div>
	<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
		<form class="flex flex-col space-y-6" action="#">
			<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Sign in to our platform</h3>
			<Label class="space-y-2">
				<span>Email</span>
				<Input type="email" name="email" placeholder="name@company.com" required />
			</Label>
			<Label class="space-y-2">
				<span>Your password</span>
				<Input type="password" name="password" placeholder="•••••" required />
			</Label>
			<div class="flex items-start">
				<Checkbox>Remember me</Checkbox>
				<a href="/" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
					>Lost password?</a
				>
			</div>
			<Button type="submit" class="w-full1">Login to your account</Button>
			<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
				Not registered? <a href="/" class="text-blue-700 hover:underline dark:text-blue-500"
					>Create account</a
				>
			</div>
		</form>
	</Modal>

	<Table>
		<TableHead>
			<TableHeadCell>Tożsamość</TableHeadCell>
			<TableHeadCell>Adres email</TableHeadCell>
			<TableHeadCell>Rola</TableHeadCell>
			<TableHeadCell>Profil</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			<TableBodyRow>
				<TableBodyCell>Szymon Długołęcki</TableBodyCell>
				<TableBodyCell>szymon.dlugolecki@aldo.agro.pl</TableBodyCell>
				<TableBodyCell>Admin</TableBodyCell>
				<TableBodyCell>
					<a class="hover:text-blue-700" target="_blank" href="/uzytkownik/userid">Sprawdź</a>
				</TableBodyCell>
			</TableBodyRow>
			<TableBodyRow>
				<TableBodyCell>Leszek Długołęcki</TableBodyCell>
				<TableBodyCell>leszek.dlugolecki@aldo.agro.pl</TableBodyCell>
				<TableBodyCell>Admin</TableBodyCell>
				<TableBodyCell>
					<a class="hover:text-blue-700" target="_blank" href="/uzytkownik/userid">Sprawdź</a>
				</TableBodyCell>
			</TableBodyRow>
			<TableBodyRow>
				<TableBodyCell>Andrzej Długołęcki</TableBodyCell>
				<TableBodyCell>andrzej.dlugolecki@aldo.agro.pl</TableBodyCell>
				<TableBodyCell>Admin</TableBodyCell>
				<TableBodyCell>
					<a class="hover:text-blue-700" target="_blank" href="/uzytkownik/userid">Sprawdź</a>
				</TableBodyCell>
			</TableBodyRow>
			<TableBodyRow>
				<TableBodyCell>Krystian Długołęcki</TableBodyCell>
				<TableBodyCell>krystian.dlugolecki@aldo.agro.pl</TableBodyCell>
				<TableBodyCell>Moderator</TableBodyCell>
				<TableBodyCell>
					<a class="hover:text-blue-700" target="_blank" href="/uzytkownik/userid">Sprawdź</a>
				</TableBodyCell>
			</TableBodyRow>
			<TableBodyRow>
				<TableBodyCell>Zbigniew Gąbka</TableBodyCell>
				<TableBodyCell>zbigniew.gabka@wp.pl</TableBodyCell>
				<TableBodyCell>Klient</TableBodyCell>
				<TableBodyCell>
					<a class="hover:text-blue-700" target="_blank" href="/uzytkownik/userid">Sprawdź</a>
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>
</section>
