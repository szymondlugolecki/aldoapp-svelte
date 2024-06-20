# Twoje ALDO

Fully featured e-commerce platform built with SvelteKit & TailwindCSS.

## Features
🤖 Automatic Notification System (via email)
🔐 Magic Link Auth
👨‍💼 Admin Panel
👨 User Profiles & Order History
🛒 Server-based cart
⚡ Built for the edge
🥅 Caching
📱 PWA
🔑 Secure



## Tech stack

```bash
# core
sveltekit
typescript
drizzle-orm + turso
meltui + shadcn

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

---

# TODO
[  ] Add product caching with Redis
[  ] Add SMS notifications
[  ] Hover cards for users
[  ] Rate limitting
[  ] Find & fix inconsistencies with permissions
[  ] Page transitions with new Chrome API
[  ] Analytics
[  ] Automatic background removal in product images
[  ] Auto-redirect to previous page after login
[  ] Make the design more appealing (particularly /sklep)
[  ] Add error pages
[  ] Fix inconsistencies in form responses/toast messages
[  ] Code cleanup


---

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
