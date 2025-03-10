// Configuration for the guestbook API
const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';
const GUESTBOOK_ENDPOINT = `${API_URL}/guestbook`;

/**
 * Fetches all guestbook entries from the API
 * @returns {Promise<Array>} Array of guestbook entries sorted by date
 * @throws {Error} If the API request fails
 */
export const fetchGuestbookEntries = async () => {
  try {
    const response = await fetch(`${GUESTBOOK_ENDPOINT}/entries`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Sort entries by date (newest first)
    return Array.isArray(data) 
      ? data.sort((a, b) => new Date(b.date) - new Date(a.date))
      : [];
      
  } catch (error) {
    console.error('Error fetching guestbook entries:', error);
    throw error;
  }
};

/**
 * @param {Object} entry 
 * @returns {Promise<Object>}
 * @throws {Error} If the API request fails
 */
export const addGuestbookEntry = async ({ name, message }) => {
  try {
    // Validate input
    if (!name || !message) {
      throw new Error('Name and message are required');
    }
    
    const response = await fetch(`${GUESTBOOK_ENDPOINT}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        message,
        date: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Error adding guestbook entry:', error);
    throw error;
  }
};

/**
 * Deletes a guestbook entry (admin only)
 * @param {string} id - The ID of the entry to delete
 * @param {string} token - Admin authentication token
 * @returns {Promise<void>}
 * @throws {Error} If the API request fails
 */
export const deleteGuestbookEntry = async (id, token) => {
  try {
    const response = await fetch(`${GUESTBOOK_ENDPOINT}/entries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return true;
    
  } catch (error) {
    console.error('Error deleting guestbook entry:', error);
    throw error;
  }
};