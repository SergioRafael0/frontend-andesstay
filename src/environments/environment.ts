export const environment = {
  production: false,
  msal: {
    clientId: 'TU_CLIENT_ID_FRONTEND',
    tenantId: 'TU_TENANT_ID',
    authority: 'https://login.microsoftonline.com/TU_TENANT_ID',
    redirectUri: 'http://localhost:4200',
    apiScope: 'api://TU_CLIENT_ID_API/access_as_user'
  },
  apiGateway: {
    baseUrl: 'http://localhost:8080'
  }
};
