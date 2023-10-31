<script lang="ts">
	import {
		Button,
		Container,
		Head,
		Hr,
		Html,
		Img,
		Link,
		Preview,
		Section,
		Text
	} from 'svelte-email';

	export let preview: string;
	export let firstName: string;
	export let orderId: number | string;
	export let description: string;

	export let price: string | number;
	export let time: string;
	// Only pass cartOwner if an advisor made the order
	export let cartOwner: {
		fullName: string;
		email: string;
		phone: string;
	} | null;
	export let driver: {
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
		<title>Zmiana statusu zamówienia</title>
		<meta name="description" content="Dokonano zmian w statusie zamówienia #{orderId}" />
	</Head>
	<Preview {preview} />
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
			<Text style={paragraph}>Doszło do zmiany w statusie Twojego zamówienia</Text>
			<Text style={codeParagraph}>{preview}</Text>

			<Text style={paragraph}>{description}</Text>
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
			{#if driver}
				<Text style={{ ...paragraph, fontWeight: 500 }}>Kierowca</Text>
				<Text style={smallParagraph}>{driver.fullName}</Text>
				<Text style={smallParagraph}>{driver.email}</Text>
				<Text style={smallParagraph}>{driver.phone}</Text>
				<Hr style={hr} />
			{/if}
			{#if cartOwner}
				<Text style={{ ...paragraph, fontWeight: 500 }}>Zamówienie złożone przez</Text>
				<Text style={smallParagraph}>{cartOwner.fullName}</Text>
				<Text style={smallParagraph}>{cartOwner.email}</Text>
				<Text style={smallParagraph}>{cartOwner.phone}</Text>
				<Hr style={hr} />
			{/if}
			<Text style={footer}>Twoje ALDO</Text>
		</Container>
	</Section>
</Html>
