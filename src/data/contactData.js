/**
 * Contact page data organized to support multiple languages
 * Structure allows for easy expansion to additional languages
 * while maintaining backward compatibility
 */

// Current language setting (can be connected to a language context/state later)
const DEFAULT_LANG = 'en';

// Multi-language contact page text data
const contactTextMultiLang = {
  en: {
    // Contact section
    letsConnect: "Let's Connect",
    haveAQuestion: "Have a question or want to work together? Drop me a message!",
    
    // Contact Info component
    contactInfoTitle: "Contact Information",
    emailLabel: "Email",
    email: "developer@example.com",
    githubLabel: "GitHub",
    github: "github.com/username",
    linkedinLabel: "LinkedIn",
    linkedin: "linkedin.com/in/username",
    twitterLabel: "Twitter",
    twitter: "@username",
    
    // Contact Form component
    contactFormTitle: "Send me a message",
    nameLabel: "Your Name",
    emailFormLabel: "Your Email",
    messageLabel: "Message",
    sendButton: "Send Message",
    sending: "Sending...",
    successMessage: "Message sent successfully!",
    errorMessage: "Failed to send message. Please try again later."
  },
  de: {
    // Contact section
    letsConnect: "Lass uns in Kontakt treten",
    haveAQuestion: "Haben Sie eine Frage oder möchten Sie zusammenarbeiten? Schreiben Sie mir eine Nachricht!",
    
    // Contact Info component
    contactInfoTitle: "Kontaktinformationen",
    emailLabel: "E-Mail",
    email: "entwickler@beispiel.com",
    githubLabel: "GitHub",
    github: "github.com/benutzername",
    linkedinLabel: "LinkedIn",
    linkedin: "linkedin.com/in/benutzername",
    twitterLabel: "Twitter",
    twitter: "@benutzername",
    
    // Contact Form component
    contactFormTitle: "Senden Sie mir eine Nachricht",
    nameLabel: "Ihr Name",
    emailFormLabel: "Ihre E-Mail",
    messageLabel: "Nachricht",
    sendButton: "Nachricht senden",
    sending: "Senden...",
    successMessage: "Nachricht erfolgreich gesendet!",
    errorMessage: "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später noch einmal."
  },
  // Add more languages as needed
};

/**
 * Helper functions to get data based on current language
 */
export const getContactText = (lang = DEFAULT_LANG) => {
  return contactTextMultiLang[lang] || contactTextMultiLang[DEFAULT_LANG];
};

// For backward compatibility with the current implementation
export const contactText = contactTextMultiLang[DEFAULT_LANG];