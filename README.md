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

This is a whitelist access based application. Only invited users can login and order.

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


## Images:
![image](https://github.com/user-attachments/assets/82d5973a-4b0e-493f-83ae-546b07603ad6)
![image](https://github.com/user-attachments/assets/81a9f240-b60a-41d2-bb8f-b1d1b14e8595)
![image](https://github.com/user-attachments/assets/6d60c85e-0dc1-40e3-950d-2983494e544e)
![image](https://github.com/user-attachments/assets/0a672b30-730a-4cb6-8f0a-1aa524be74e8)
![image](https://github.com/user-attachments/assets/fee3041c-44df-47ba-9c3d-9841430cadea)

### Admin Panel:
Users:
![image](https://github.com/user-attachments/assets/925e887b-5fe5-4d96-8fb3-f46441a84ebf)
![image](https://github.com/user-attachments/assets/feb4bca1-d993-455e-a3e4-0f932d836b0f)

Orders:
![image](https://github.com/user-attachments/assets/1c2ecaa5-1aaf-42a1-a5d8-506e8aefe761)
![image](https://github.com/user-attachments/assets/f5a8f257-5099-4723-82fe-6ad65ef72fad)

Products:
![image](https://github.com/user-attachments/assets/0990d454-58dc-4013-b931-7c395641c0d6)
![image](https://github.com/user-attachments/assets/13c7a01b-6e7a-4a79-b0eb-9514824c15d3)

![image](https://github.com/user-attachments/assets/cecdc843-dd51-492a-aae7-43b888aa82e8)
![image](https://github.com/user-attachments/assets/49a0b7b4-9028-4421-abf8-ced58ca08de0)

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
