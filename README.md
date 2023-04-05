# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

# TODO

[✅] Add toasts (also fix toasts stopped showing when logging in)

[✅] Add animations for smoother and nicer user experience (SvelteKit has many built-in)

[✅] Make the filters work on Użytkownicy, Produkty & Zamówienia pages

[✅] Make the user panel more readable (wider)

[] Add backend check to make sure product quantity is not above 127

[ ] Add a secure and httpOnly (with restriced path: '/login/weryfikacja')
cookie that would prevent logging in with someone else's verification code. > User wants to login > Enters their email > It's written into the cookie & verification email is sent > Under the verification API route it is checked whether the account email is the same as in the cookie

[✅] Add store page with all the products

[✅] Implement cart & checkout with svelte store

[✅] Add products page in admin panel

[✅] Implement auth system

[✅] Add promo codes

[ ] Implement user profile

[ ] Implement user orders history

[ ] Make a cool home page (with carousels mb)

[ ] Add PWA

[✅] Add push notifications

[✅] Add light/dark mode switch

[ ] Write & run tests

- - - [ ] Test the permissions on forms

[ ] Handle permissions (admin panel access, etc)

[ ] Add support for offline mode

[ ] Add custom error pages

[ ] A11y, SEO

[ ] Add possibility to send a request to a service

[ ] Page transition with new Chrome API (for the shop page)

[ ] Deploy on Vercel

Under consideration:

[ ] Add chatbot for easy user interactions (bot asks what the user wants => user can choose: buy sth, get a phone number for a service of choice, live chat with the staff)

[✅] Add user settings (possibility to add permanent address for future deliveries?, ?, ?)

[ ] Train chatgpt for indefinite interactions with users
