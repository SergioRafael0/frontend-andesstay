export const environment = {
  production: false,
  msal: {
    clientId: '650660a5-bfbd-434f-8639-04a7272649dc',
    tenantId: '553a95a6-1759-4c84-9820-b03af15aa4ff',
    authority: 'https://login.microsoftonline.com/553a95a6-1759-4c84-9820-b03af15aa4ff',
    redirectUri: 'http://localhost:4200',
    apiScope: 'api://andesstay-api/access_as_user'
  },
  apiGateway: {
    baseUrl: 'https://9hul5y1xe0.execute-api.us-east-1.amazonaws.com'
  }
};