# Client Portal

A Vue.js application for client login and dashboard pages that will be embedded in WordPress.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Development:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deployment

1. Push to GitHub
2. Deploy to Vercel
3. Update WordPress pages with iframe:

Add this to your WordPress pages:

For login page (https://jaridatakhbarak.com/client-login/):
```html
<iframe 
  src="https://your-vercel-app.vercel.app/client-login" 
  style="width: 100%; height: 100vh; border: none;"
></iframe>
```

For dashboard page (https://jaridatakhbarak.com/client-dashboard/):
```html
<iframe 
  src="https://your-vercel-app.vercel.app/client-dashboard" 
  style="width: 100%; height: 100vh; border: none;"
></iframe>
```

## Managing Users

Edit the `users.json` file to add/modify client credentials. Format:
```json
{
  "users": [
    {
      "username": "client1",
      "password": "hashedPassword1",
      "name": "Client One",
      "role": "client"
    }
  ]
}
```
