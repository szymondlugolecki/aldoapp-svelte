<script lang="ts">
	import { Button, Container, Head, Hr, Html, Img, Preview, Section, Text } from 'svelte-email';

	export let code: string;
	export let firstName: string;
	export let device: string;
	export let ip: string;
	// export let location: string;
	export let time: string;

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
		<title>Weryfikacja logowania</title>
		<meta name="description" content="Kod weryfikacyjny wymagany do zalogowania się" />
	</Head>
	<Preview preview="Kod logowania: {code}" />
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
			<Text style={paragraph}>Twój kod logowania:</Text>
			<Text style={codeParagraph}>{code}</Text>
			<Text style={smallParagraph}>Kod pozostanie aktywny przez 12 godzin</Text>
			<Hr style={hr} />
			<Text style={{ ...paragraph, fontWeight: 600 }}>Informacje o próbie logowania</Text>
			<Text style={smallParagraph}>Adres IP: {ip}</Text>
			<Text style={smallParagraph}>Urządzenie: {device}</Text>
			<!-- <Text style={smallParagraph}>Lokalizacja: {location}</Text> -->
			<Text style={smallParagraph}>Czas: {time}</Text>
			<Hr style={hr} />
			<Text style={paragraph}
				>Jeżeli to nie Ty próbowałeś się zalogować, możesz bezpiecznie zignorować ten email.</Text
			>
			<Hr style={hr} />
			<Text style={footer}>Twoje ALDO</Text>
		</Container>
	</Section>
</Html>
