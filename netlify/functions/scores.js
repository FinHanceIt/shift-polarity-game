const LEADERBOARD_URL = 'https://extendsclass.com/api/json-storage/bin/aadcecb';

exports.handler = async function (event, context) {
  // CORS Headers for safety
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // GET: Fetch scores
    if (event.httpMethod === 'GET') {
      const response = await fetch(LEADERBOARD_URL);
      if (response.status === 404) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify([])
        };
      }
      const data = await response.json();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }

    // POST: Submit a new score
    if (event.httpMethod === 'POST') {
      const { name, score } = JSON.parse(event.body);
      if (!name || typeof score !== 'number') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid name or score' })
        };
      }

      // Fetch current list on server side
      const getRes = await fetch(LEADERBOARD_URL);
      let currentList = [];
      if (getRes.ok) {
        currentList = await getRes.json();
      }
      if (!Array.isArray(currentList)) {
        currentList = [];
      }

      // Add the new score entry
      currentList.push({ name: name.toUpperCase().slice(0, 7), score: score, date: new Date().toISOString() });
      
      // Sort and slice top 10
      currentList.sort((a, b) => b.score - a.score);
      const topScores = currentList.slice(0, 10);

      // Save back to ExtendsClass using PUT
      const putRes = await fetch(LEADERBOARD_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(topScores)
      });

      if (!putRes.ok) {
        throw new Error('Failed to update ExtendsClass bin: ' + putRes.statusText);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(topScores)
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  } catch (e) {
    console.error('Error in scores serverless function:', e);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: e.message })
    };
  }
};
