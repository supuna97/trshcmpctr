const path = require('path');

const cookieSession = require('cookie-session');
const express = require('express');

const { clientId, clientSecret, guildId, port, sessionSecret } = require('./config.json');
const { authFromCode, getFetchWithOauth, getGuildById } = require('./utils');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(cookieSession({
  // keys: [sessionSecret1, sessionSecret2],
  // maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week (how long tokens are valid)
  // maxAge: 24 * 60 * 60 * 1000 // 24 hours
  // maxAge: 10 * 60 * 1000 // 10 minutes
  maxAge: 60 * 1000, // 1 minute
  secret: sessionSecret,
}));

app.get('/', async (request, response) => {
  let avatar,
    id,
    username,
    discriminator;

  const { code } = request.query;
  if (code) {
    try {
      // Auth user
      const oauthResult = await authFromCode({ code, clientId, clientSecret, port });
      const fetchWithOauth = getFetchWithOauth(await oauthResult.json());

      // Get user details
      const userResult = await fetchWithOauth('https://discord.com/api/users/@me');
      ({ avatar, discriminator, id, username } = await userResult.json());

      // Get user guilds
      const guildsResult = await fetchWithOauth('https://discord.com/api/users/@me/guilds');
      const guilds = await guildsResult.json();

      const guild = getGuildById(guilds, guildId);
      if (guild) {
        console.log('in the guild!');
        // TODO: get user has a specific role in our guild?
      }

    } catch (error) {
      // NOTE: An unauthorized token will not throw an error;
      // it will return a 401 Unauthorized response in the try block above
      console.error(error);
    }
  }

  response.render('index', { avatar, clientId, discriminator, id, username }, (err, html) => {
    if (err) {
      console.error(err);
    }
    response.send(html);
  });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
