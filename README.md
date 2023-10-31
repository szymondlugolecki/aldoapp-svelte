# twoje aldo

Fully featured e-commerce platform built with SvelteKit & TailwindCSS.

## Features
🤖 Automated notification system (email, push)
🔐 Self-built passwordless authentication system
📱 PWA
💬 Push Messages
👨‍💼 Feature rich Admin Panel
🛒 Server-based cart
👨 User profiles
⚡ Built for the edge
🥅 Caching & Rate Limiting


## Tech stack

```bash
# core
sveltekit
typescript
drizzle-orm + planetscale serverless driver
meltui

# styling
tailwindcss
shadcn-svelte
lucide-svelte

# other
sveltekit-superforms
zod
@upstash/redis
xstate

```

# TODO
Server-side tables:
-    [  ] Sorting
-    [  ] Filtering
-    [  ] Full text search
-    [  ] Pagination

[  ] Product images

[  ] Hover cards for users

[  ] ToS & Privacy pages

[  ] Date for each change in order status

[  ] Switch auth system to boron-auth

[  ] Page transitions with new Chrome API

[  ] Analytics

[  ] Automatic background removing in product images

<!-- [ ] Add a secure and httpOnly (with restriced path: '/zaloguj/weryfikacja')
cookie that would prevent logging in with someone else's verification code. > User wants to login > Enters their email > It's written into the cookie & verification email is sent > Under the verification API route it is checked whether the account email is the same as in the cookie -->

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
