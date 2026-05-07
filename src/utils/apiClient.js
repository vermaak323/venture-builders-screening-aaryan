/**
 * A resilient fetch wrapper that handles rate limiting (429) with exponential backoff.
 */
export async function resilientFetch(url, options = {}, retries = 3, backoff = 1000) {
  try {
    const response = await fetch(url, options);

    if (response.status === 429) {
      if (retries > 0) {
        // Look for Retry-After header or use backoff
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : backoff;
        
        console.warn(`Rate limited (429). Retrying in ${delay}ms... (${retries} retries left)`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return resilientFetch(url, options, retries - 1, backoff * 2);
      }
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    
    // If it's a network error and we have retries, try again
    if (retries > 0 && (error.message.includes('NetworkError') || error.message.includes('fetch'))) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return resilientFetch(url, options, retries - 1, backoff * 2);
    }
    
    throw error;
  }
}
