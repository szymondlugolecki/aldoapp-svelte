# Twoje ALDO

Super fast & Fully featured e-commerce platform built with SvelteKit & TailwindCSS.

## Features
🤖 Automatic Notification System (via email)  
🔐 Passworldless login (Magic Link)  
👨‍💼 Admin Panel  
👨 User Profiles & Order History  
🛒 Server-based cart  
⚡ Built for the edge  
🥅 Caching  
📱 PWA  
🔑 Secure  
💻 Responsive Design  
♿ a18n optimized  


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
[  ] Add error pages  
[  ] Logging (Sentry)  
[  ] Product caching with Redis  
[  ] SMS notifications  
[  ] Hover cards for users  
[  ] Rate limitting  
[  ] Consider Page transitions with new Chrome API  
[  ] Analytics page  
[  ] Automatic background removal in product images  
[  ] Auto-redirect to previous page after login  
[  ] Make the design more appealing (/sklep)  
[  ] Fix inconsistencies with permissions  
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
