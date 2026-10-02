Backend for CRUD_project

Quick start:

1. Install dependencies:

```
cd Backend
npm install
```

2. Start server in development:

```
npm run dev
```

API routes:
- `POST /api/auth/register` { username, password }
- `POST /api/auth/login` { username, password } -> { token }
- Authenticated routes: set `Authorization: Bearer <token>` header
- `GET /api/products`
- `POST /api/products` { name, price, qrcode }
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
