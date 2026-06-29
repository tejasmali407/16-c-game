export async function submitFeedback(feedbackData) {
  try {
    const response = await fetch('/.netlify/functions/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    const result = await response.json();

    if (result.success === true) {
      return { success: true };
    } else {
      throw new Error(result.error || 'Failed to submit feedback');
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}
