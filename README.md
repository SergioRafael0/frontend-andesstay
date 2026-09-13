# 🏔️ AndesStay — Frontend Angular + MSAL

Caso 5 de la EP1 — DSY1107 Cloud Native I.

Frontend SPA en **Angular 17** con autenticación mediante **Microsoft Authentication Library (MSAL)** contra **Microsoft Entra ID**.

## 📋 Pantallas

| Ruta          | Roles permitidos                  | Componente            |
|---------------|-----------------------------------|------------------------|
| `/login`      | Público                           | `LoginComponent`       |
| `/dashboard`  | Admin, Recepcionista, Huésped     | `DashboardComponent`   |
| `/reservations` | Admin, Recepcionista, Huésped   | `ReservationsComponent`|
| `/catalog`    | Admin, Recepcionista              | `CatalogComponent`     |

## ⚙️ Configuración

Edita `src/environments/environment.ts` con los datos de tu tenant de Microsoft Entra ID:

```ts
msal: {
  clientId: 'TU_CLIENT_ID_FRONTEND',          // App Registration del frontend
  tenantId: 'TU_TENANT_ID',                   // Directory (tenant) ID
  authority: 'https://login.microsoftonline.com/TU_TENANT_ID',
  redirectUri: 'http://localhost:4200',
  apiScope: 'api://TU_CLIENT_ID_API/access_as_user'
},
apiGateway: {
  baseUrl: 'http://localhost:8080'            // URL de tu BFF o API Gateway en AWS
}
```

## 🚀 Comandos

```bash
npm install
npm start            # http://localhost:4200
npm run build        # genera dist/frontend-andesstay
```

## 🔐 Cómo funciona el flujo de autenticación

1. El usuario abre la app → ve `/login` con el botón único.
2. Al hacer click, **MSAL redirige a Microsoft Entra ID** (login.microsoftonline.com).
3. El usuario se autentica con su cuenta institucional.
4. Entra ID devuelve un **código de autorización** (Authorization Code + PKCE).
5. MSAL lo intercambia por un **Access Token** y un **ID Token**.
6. El **MsalInterceptor** adjunta automáticamente `Authorization: Bearer <access_token>` a todas las llamadas a `/api/*`.
7. Los **Guards** (`AuthGuard`, `RoleGuard`) protegen las rutas privadas.
8. El `UserService` lee los **roles** desde el claim `roles` del ID Token.

## 📁 Estructura

```
src/app/
├── app.component.ts          # Layout + nav
├── app.config.ts             # Bootstrap + providers MSAL
├── app.routes.ts             # Rutas con Guards
├── auth/
│   ├── auth.guard.ts         # Verifica sesión activa
│   ├── role.guard.ts         # Verifica rol
│   └── msal.config.ts        # Configuración MSAL
├── components/
│   ├── login/
│   ├── dashboard/
│   ├── reservations/
│   └── catalog/
├── interceptors/
│   └── msal.interceptor.ts   # Adjunta Bearer Token
├── services/
│   ├── user.service.ts       # Lee cuenta, roles, claims
│   ├── reservation.service.ts
│   └── catalog.service.ts
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

## 👥 Roles

| Rol            | App Role en Entra ID | Puede                                  |
|----------------|----------------------|----------------------------------------|
| `Admin`        | Admin                | Todo (catálogo + reservas + ver todo)  |
| `Recepcionista`| Recepcionista        | Catálogo + cambiar estados de reservas |
| `Huesped`      | Huesped              | Crear reserva + ver solo las propias   |
