export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);

    if (!body.feedbackType || !body.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Missing required fields' })
      };
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      console.error('GOOGLE_APPS_SCRIPT_URL environment variable is missing');
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: 'Server configuration error' })
      };
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Google Apps Script response:', responseText);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: 'Invalid response from backend' })
      };
    }

    if (parsedResponse && parsedResponse.success === true) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    } else {
      console.error('Google Apps Script returned unsuccessful response:', parsedResponse);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: 'Failed to save feedback' })
      };
    }

  } catch (error) {
    console.error('Error processing feedback:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Internal Server Error' })
    };
  }
}
