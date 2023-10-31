<script lang="ts">
	import { Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from 'svelte-email';

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
</script>

<Html lang="pl-PL">
	<Head>
		<meta charset="UTF-8" />
		<title>Nowe zamówienie</title>
		<meta name="description" content="Potwierdzenie złożenia zamówienia #{orderId}" />
	</Head>
	<Preview preview="Sprawdzanie dostępności produktów" />
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
			<Text style={codeParagraph}>Sprawdzanie dostępności produktów</Text>
			<Text style={paragraph}
				>Po upewnieniu się, że produkty są dostępne, przejdziemy do realizacji zamówienia. O
				wszystkim będziemy Cię informować.</Text
			>
			<Link href="https://aldoapp-svelte.vercel.app/zamowienia/{orderId}"
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
			<Text style={footer}>Twoje ALDO</Text>
		</Container>
	</Section>
</Html>
