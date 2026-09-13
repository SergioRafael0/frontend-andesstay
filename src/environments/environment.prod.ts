export const environment = {
  production: true,
  msal: {
    clientId: 'TU_CLIENT_ID_FRONTEND',
    tenantId: 'TU_TENANT_ID',
    authority: 'https://login.microsoftonline.com/TU_TENANT_ID',
    redirectUri: 'https://tu-dominio-front.com',
    apiScope: 'api://TU_CLIENT_ID_API/access_as_user'
  },
  apiGateway: {
    baseUrl: 'https://tu-api-gateway-id.execute-api.us-east-1.amazonaws.com'
  }
};
