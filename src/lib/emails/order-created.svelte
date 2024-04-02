<script lang="ts">
	import type { OrderProduct } from '$types';
	import {
		Container,
		Head,
		Hr,
		Html,
		Img,
		Link,
		Preview,
		Section,
		Text,
		Column,
		styleToString
	} from 'svelte-email';

	export let products: (OrderProduct & { quantity: number; image: string | null })[];

	export let firstName: string;
	export let orderId: number | string;

	export let price: string | number;
	export let time: string;
	// Only pass cartOwner if an advisor made the order
	export let cartOwner: {
		fullName: string;
		email: string;
		phone: string;
	} | null;

	const fontFamily =
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

	const main = {
		backgroundColor: '#ffffff',
		color: 'black'
	};

	const container = {
		margin: '0 auto',
		padding: '20px 0 48px'
	};

	const logo = {
		margin: '0 auto'
	};

	const paragraph = {
		fontFamily,
		fontSize: '16px',
		lineHeight: '26px'
	};

	const smallParagraph = {
		fontFamily,
		fontSize: '16px',
		lineHeight: '26px',
		margin: '6px 0'
	};

	const codeParagraph = {
		fontFamily,
		fontSize: '32px',
		fontWeight: 'bold'
	};

	const hr = {
		borderColor: '#cccccc',
		margin: '20px 0'
	};

	const footer = {
		fontFamily,
		color: '#8898aa',
		fontSize: '12px'
	};

	const productPriceWrapper = {
		display: 'table-cell',
		padding: '0px 20px 0px 0px',
		width: '100px',
		verticalAlign: 'top'
	};

	const productDescriptionWrapper = {
		lineHeight: 'auto',
		margin: '0 20px',
		width: '100%'
	};

	const productDescription = {
		fontFamily,
		fontSize: '12px',
		color: 'rgb(102,102,102)'
	};

	const productTitle = { fontFamily, fontSize: '12px', fontWeight: '600' };

	const productPrice = {
		fontFamily,
		fontSize: '12px',
		fontWeight: '600',
		margin: '0'
	};

	const fakeProductUrl =
		'https://res.cloudinary.com/dzcuq1b2u/image/upload/v1680687127/products/Lacto%20Start%20IPC%20pasza%20rozdojeniowa%20De%20Heus%2025kg/DB4A2X00G-W00/0.webp';
</script>

<Html lang="pl-PL">
	<Head>
		<meta charset="UTF-8" />
		<title>Nowe zamówienie</title>
		<meta name="description" content="Potwierdzenie złożenia zamówienia #{orderId}" />
	</Head>
	<Preview preview="Weryfikowanie zamówienia" />
	<Section style={main}>
		<Container style={container}>
			<Img
				src="https://i.imgur.com/vJkqpjp.png"
				alt="Logo ALDO"
				style={logo}
				width="120"
				height="88"
			/>
			<Text style={{ ...paragraph, fontWeight: 600 }}>Witaj, {firstName}!</Text>
			<Text style={paragraph}>Nowe zamówienie</Text>
			<Text style={codeParagraph}>Weryfikowanie zamówienia</Text>
			<Text style={paragraph}
				>Zamówienie przyjęte do realizacji. Będziemy Cię na bieżąco informować o zmianie statusu.</Text
			>
			<Link href="https://twojealdo.pl/zamowienia/{orderId}"
				>Kliknij tutaj, aby sprawdzić szczegóły zamówienia</Link
			>
			<Hr style={hr} />
			<Text style={{ ...paragraph, fontWeight: 600 }}>Podstawowe informacje</Text>
			<Text style={smallParagraph}>Numer zamówienia: #{orderId}</Text>
			<Text style={smallParagraph}
				>Kwota: {isNaN(Number(price)) ? price : Number(price).toFixed(2)} zł</Text
			>
			<Text style={smallParagraph}>Data złożenia zamówienia: {time}</Text>
			<Hr style={hr} />
			{#if cartOwner}
				<Text style={{ ...paragraph, fontWeight: 600 }}>Zamówienie złożone przez</Text>
				<Text style={smallParagraph}>{cartOwner.fullName}</Text>
				<Text style={smallParagraph}>{cartOwner.email}</Text>
				<Text style={smallParagraph}>{cartOwner.phone}</Text>
				<Hr style={hr} />
			{/if}

			<Section>
				<Column>
					<Text style={{ ...paragraph, fontWeight: 600 }}>Produkty</Text>
				</Column>
			</Section>
			{#each products as product}
				<Section>
					<Column>
						<Img src={product.image || fakeProductUrl} width="64" height="96" alt={product.name} />
					</Column>
					<Column>
						<Text style={productDescriptionWrapper}>
							<span dir="auto" style={styleToString(productTitle)}>
								{product.name}
							</span>
							<br />
							<span style={styleToString(productDescription)}>{product.symbol}</span>
						</Text>
					</Column>

					<Column style={productPriceWrapper}>
						<span style={styleToString(productPrice)}>{product.quantity} szt.</span>
					</Column>

					<Column style={productPriceWrapper}>
						<span style={styleToString(productPrice)}
							>{Number(product.price) * product.quantity} zł</span
						>
					</Column>
				</Section>
			{/each}

			<Text style={footer}>Twoje ALDO</Text>
		</Container>
	</Section>
</Html>
