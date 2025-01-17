import {
  authFromCode,
  getFetchWithOauth,
  getLoggedInData,
} from '../utils';

/**
 * Create handler for getting a fresh token
 * Injects the provided fetch function as a dependency
 * @param {Function} fetch Fetch implementation
 * @param {Object} data Required data
 * @returns Handler that uses the provided dependencies to render the authenticated view
 */
export const getNewTokenWithDependencies = (fetch, {
  clientId,
  clientSecret,
  guildId,
  port
}) => {
  // Handler to get a new token to render authenticated
  return async (request, response, _next) => {
    request.log.debug('get new token');
    const { code } = request.query;
    const oauthResult = await authFromCode(fetch, { code, clientId, clientSecret, port });
    const oauthFinal = await oauthResult.json();
    const nowInSeconds = Date.now()/1000;

    request.session.oauth = oauthFinal;
    request.session.oauthExpires = nowInSeconds + oauthFinal.expires_in;

    const fetchWithOauth = getFetchWithOauth(fetch, oauthFinal);
    const data = await getLoggedInData(fetchWithOauth, { guildId });
    response.render('authenticated', { ...data, newSession: true });
  };
};
