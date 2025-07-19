export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  // Discord OAuth configuration
  const CLIENT_ID = '1090917458346524734';
  const CLIENT_SECRET = 'XwYXibeL-Tw0fltwkNwGjzkllq8AeeI3';
  const BOT_TOKEN = 'MTA5MDkxNzQ1ODM0NjUyNDczNA.GqWI7f.dH57xXqu4khyx2skKrw_GWNAtY90Mx-xNY63rk';
  const GUILD_ID = '1388084142075547680';
  const REDIRECT_URI = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173';

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
        error: 'Token exchange failed',
        details: errorData.error_description || 'Unknown error'
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
        error: 'Failed to fetch user data',
        details: errorData.message || 'Unknown error'
      });
    }

    const user = await userResponse.json();

    // 3. Add user to Discord server using bot token
    let joinResult = {
      success: false,
      message: 'Server join not attempted',
      alreadyMember: false
    };

    try {
      const joinResponse = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bot ${BOT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          access_token: accessToken 
        })
      });

      if (joinResponse.ok || joinResponse.status === 204) {
        console.log(`✅ User ${user.username} (${user.id}) successfully joined server ${GUILD_ID}`);
        joinResult = {
          success: true,
          message: 'Successfully joined Discord server',
          alreadyMember: false
        };
      } else if (joinResponse.status === 204) {
        // User was already in the server
        console.log(`✅ User ${user.username} (${user.id}) was already in server ${GUILD_ID}`);
        joinResult = {
          success: true,
          message: 'User was already in the server',
          alreadyMember: true
        };
      } else {
        const errorData = await joinResponse.json().catch(() => ({}));
        console.warn('⚠️ Server join failed:', errorData);
        
        // Handle specific Discord API errors
        if (errorData.code === 30007) {
          joinResult = {
            success: false,
            message: 'Server is full. Please contact support.',
            alreadyMember: false
          };
        } else if (errorData.code === 10007) {
          console.log('User is already in the server');
          joinResult = {
            success: true,
            message: 'User was already in the server',
            alreadyMember: true
          };
        } else {
          joinResult = {
            success: false,
            message: 'Failed to join server automatically',
            alreadyMember: false
          };
        }
      }
    } catch (joinError) {
      console.error('Server join error:', joinError);
      joinResult = {
        success: false,
        message: 'Error occurred while joining server',
        alreadyMember: false
      };
    }

    // 4. Return success response with user data and join status
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        global_name: user.global_name,
        avatar: user.avatar,
        email: user.email,
        verified: user.verified
      },
      accessToken: accessToken,
      serverJoin: joinResult
    });

  } catch (error) {
    console.error('Discord OAuth error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}