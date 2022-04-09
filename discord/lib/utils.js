/**
 * Get token with authorization code
 * @param {Function} fetch Fetch implementation
 * @param {Object} options Authorization code from Discord redirect
 * @returns Oauth result
 */
const authFromCode = async (fetch, { clientId, clientSecret, code, port }) => {
  return await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `http://localhost:${port}`,
      scope: 'identify',
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

/**
 * Batch custom fetch requests to several urls at once
 * @param {Function} fetch Fetch implementation
 * @param {string[]} urls Endpoints to fetch against
 * @returns List of request results
 */
const batchRequests = async (fetch, urls) => {
  const requests = await Promise.all(urls.map(url => fetch(url)));
  return await Promise.all(requests.map(r => r.json()));
};

/**
 * Curry fetch with authorization header
 * @param {Function} fetch Fetch implementation
 * @param {*} oauthData Oauth result
 * @returns Function wrapping fetch with authorization header
 */
const getFetchWithOauth = (fetch, { token_type: type, access_token: token }) => {
  return async url => await fetch(url, { headers: { authorization: `${type} ${token}` }});
};

/**
 * Get guild from list by id
 * @param {*} guilds List of guilds
 * @param {string} guildId Id of guild
 * @returns Guild if present, else undefined
 */
const getGuildById = (guilds, guildId) => guilds.find(({ id }) => id === guildId);

module.exports = {
  authFromCode,
  batchRequests,
  getFetchWithOauth,
  getGuildById,
};