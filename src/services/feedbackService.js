const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_FEEDBACK_API_URL;

export async function submitFeedback(feedbackData) {
  try {
    // We use mode: 'no-cors' as requested to bypass CORS issues with Google Apps Script redirects.
    // In 'no-cors' mode, browser won't throw CORS errors and will send the request,
    // but the response is opaque (status 0).
    await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(feedbackData),
    });

    // If fetch didn't throw a network error, we treat it as successful
    return { success: true };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}
