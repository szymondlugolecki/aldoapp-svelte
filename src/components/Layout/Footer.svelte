<script>
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
</script>

<Footer>
	<FooterCopyright href="/" by="ALDO" year={2023} copyrightMessage="Wszelkie prawa zastrzeżone" />
	<FooterLinkGroup
		ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
	>
		<FooterLink href="/">O nas</FooterLink>
		<FooterLink href="/">Polityka prywatności</FooterLink>
		<FooterLink href="/">Zasady użytkowania</FooterLink>
		<FooterLink href="/">Kontakt</FooterLink>
	</FooterLinkGroup>
</Footer>
