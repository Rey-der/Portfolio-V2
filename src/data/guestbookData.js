/**
 * Guestbook data organized to support multiple languages
 * Structure allows for easy expansion to additional languages
 * while maintaining backward compatibility
 */

// Current language setting (can be connected to a language context/state later)
const DEFAULT_LANG = 'en';

// Multi-language guestbook text data
const guestbookTextMultiLang = {
  en: {
    guestbookTitle: "Guestbook",
    guestbookSubtitle: "Leave a message, feedback, or just say hello!",
    signGuestbook: "Sign the Guestbook",
    nameLabel: "Name",
    messageLabel: "Message",
    submitButton: "Sign Guestbook",
    submittingButton: "Submitting...",
    successMessage: "Thank you for signing the guestbook!",
    errorMessage: "Failed to submit your message. Please try again.",
    recentMessages: "Recent Messages",
    noMessages: "No messages yet. Be the first to sign the guestbook!"
  },
  de: {
    guestbookTitle: "Gästebuch",
    guestbookSubtitle: "Hinterlassen Sie eine Nachricht, Feedback oder einfach nur ein Hallo!",
    signGuestbook: "Gästebuch unterschreiben",
    nameLabel: "Name",
    messageLabel: "Nachricht",
    submitButton: "Gästebuch unterschreiben",
    submittingButton: "Wird gesendet...",
    successMessage: "Vielen Dank für Ihren Eintrag im Gästebuch!",
    errorMessage: "Das Senden Ihrer Nachricht ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
    recentMessages: "Neueste Nachrichten",
    noMessages: "Noch keine Nachrichten. Seien Sie der Erste, der das Gästebuch unterschreibt!"
  },
  // Add more languages as needed
};

/**
 * Helper functions to get data based on current language
 */
export const getGuestbookText = (lang = DEFAULT_LANG) => {
  return guestbookTextMultiLang[lang] || guestbookTextMultiLang[DEFAULT_LANG];
};

// For backward compatibility with the current implementation
export const guestbookText = guestbookTextMultiLang[DEFAULT_LANG];