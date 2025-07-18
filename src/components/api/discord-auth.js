import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { code, guildId } = req.body;
  
  // Environment variables - set these in your .env file
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        scope: 'identify email guilds.join'
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange error:', errorData);
      return res.status(400).json({ 
        message: `Token exchange failed: ${errorData.error_description || 'Unknown error'}` 
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Get user information
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error('User fetch error:', errorData);
      return res.status(400).json({ 
        message: `Failed to fetch user: ${errorData.message || 'Unknown error'}` 
      });
    }

    const user = await userResponse.json();

    // 3. Add user to Discord server
    let joinedServer = false;
    if (guildId && BOT_TOKEN) {
      try {
        const joinResponse = await fetch(`https://discord.com/api/guilds/${guildId}/members/${user.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bot ${BOT_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ access_token: accessToken })
        });

        if (joinResponse.ok) {
          console.log(`✅ User ${user.id} joined server ${guildId}`);
          joinedServer = true;
        } else {
          const errorData = await joinResponse.json();
          console.warn('⚠️ Server join failed:', errorData);
          
          // Special handling for common errors
          if (errorData.code === 30007) { // Maximum guild members reached
            return res.status(400).json({ 
              message: 'Server is full. Please contact support.' 
            });
          }
        }
      } catch (joinError) {
        console.error('Server join error:', joinError);
      }
    }

    // 4. Return data to frontend
    res.status(200).json({
      user,
      accessToken,
      joinedServer
    });

  } catch (error) {
    console.error('Authentication failed:', error);
    res.status(500).json({ 
      message: 'Internal server error during authentication' 
    });
  }
}
