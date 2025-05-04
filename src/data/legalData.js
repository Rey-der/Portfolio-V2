/**
 * Legal Notice (Impressum) and Privacy Policy data organized to support multiple languages
 * Structure allows for easy expansion to additional languages
 * while maintaining backward compatibility
 */

// Current language setting (can be connected to a language context/state later)
const DEFAULT_LANG = 'en';

// Multi-language legal text data
const legalTextMultiLang = {
  en: {
    // --- Privacy Policy ---
    privacyPolicyTitle: "Privacy Policy",
    responsibleTitle: "Responsible for data processing on this website:",
    responsibleName: "[Your First Name] [Your Last Name]",
    responsibleStreet: "[Street Address]",
    responsibleCity: "[Postal Code] [City]",
    responsibleEmail: "Email: [your@email.com]",
    responsiblePhone: "Phone: [Optional Phone]",

    generalInfoTitle: "1. General Information",
    generalInfoText: "The protection of your personal data is important to me. Personal data is any data with which you could be personally identified. This privacy policy explains what information I collect and what I use it for.",

    hostingTitle: "2. Hosting",
    hostingText: "This website is hosted by an external service provider (hoster). Personal data collected on this website is processed on the hoster's servers. This may include, in particular, IP addresses, meta and communication data, contract data, contact details, names, website access, and other data generated via a contact form. The hoster used is [Hoster Name and Address].", // Add Hoster Info

    dataCollectionTitle: "3. Collection and Processing of Personal Data",
    contactFormTitle: "a) Contact Forms",
    contactFormText: "If you send me inquiries via the contact form, your details from the form, including the contact details you provided there, will be stored by me for the purpose of processing the request and in case of follow-up questions. I do not pass on this data without your consent.",
    contactFormLegalBasis: "Legal basis: Art. 6 para. 1 lit. b GDPR (processing for the performance of a contract or pre-contractual measures)",

    guestbookTitle: "b) Guestbook",
    guestbookText: "If you write an entry in my guestbook, your entries, as well as the time and, if applicable, IP address, are stored to prevent misuse. The data is stored in an SQL database and is not passed on to third parties.",
    guestbookLegalBasis: "Legal basis: Art. 6 para. 1 lit. a GDPR (consent) and Art. 6 para. 1 lit. f GDPR (legitimate interest in a functioning website and protection against misuse)",

    googleFontsTitle: "4. Use of Google Fonts",
    googleFontsText: "This website uses so-called Google Fonts, provided by Google, for the uniform display of fonts. The fonts are loaded externally from Google servers, whereby your IP address is transmitted to Google (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland).",
    googleFontsLegalBasis: "Legal basis: Art. 6 para. 1 lit. f GDPR (legitimate interest in an appealing presentation)",
    googleFontsNote: "Note: To be GDPR compliant, it is recommended to host Google Fonts locally. Alternatively, you must inform users about this and, if necessary, obtain consent via a cookie banner.",

    yourRightsTitle: "5. Your Rights",
    yourRightsText: "You have the right at any time to:",
    rightInfo: "Information about your stored data (Art. 15 GDPR),",
    rightCorrection: "Correction of incorrect data (Art. 16 GDPR),",
    rightDeletion: "Deletion (Art. 17 GDPR),",
    rightRestriction: "Restriction of processing (Art. 18 GDPR),",
    rightPortability: "Data portability (Art. 20 GDPR),",
    rightObjection: "Objection to processing (Art. 21 GDPR).",
    rightsContact: "Please contact the address mentioned above for this purpose.",

    rightToComplainTitle: "6. Right to Lodge a Complaint",
    rightToComplainText: "If you believe that the processing of your personal data violates the GDPR, you have the right to lodge a complaint with a supervisory authority.",

    sslTitle: "7. SSL/TLS Encryption",
    sslText: "This site uses SSL or TLS encryption for security reasons. You can recognize an encrypted connection by the fact that the address line of the browser changes from “http://” to “https://”.",

    privacyLastUpdated: "Last updated: [Date]", // Add Date

    // --- Legal Notice (Impressum) ---
    legalNoticeTitle: "Legal Notice",
    legalInfoAccordingTo: "Information according to § 5 TMG (German Telemedia Act)",

    legalName: "[Your First Name] [Your Last Name]",
    legalStreet: "[Street Address]",
    legalCity: "[Postal Code] [City]",
    legalCountry: "Germany", // Adjust if needed

    legalContactTitle: "Contact:",
    legalPhone: "Phone: [Optional Phone]",
    legalEmail: "Email: [your@email.de]",
    legalWebsite: "Website: [www.yourwebsite.com]", // Adjust if needed

    responsibleContentTitle: "Responsible for the content according to § 55 Abs. 2 RStV (German Interstate Broadcasting Treaty):",
    responsibleContentName: "[Your First Name] [Your Last Name]",
    responsibleContentStreet: "[Street Address]",
    responsibleContentCity: "[Postal Code] [City]",
    responsibleContentSameAddress: "(Address same as above, if applicable)",

    liabilityContentTitle: "Liability for Content",
    liabilityContentText1: "As a service provider, I am responsible for my own content on these pages according to general laws pursuant to § 7 Abs.1 TMG. According to §§ 8 to 10 TMG, however, I as a service provider am not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.",
    liabilityContentText2: "Obligations to remove or block the use of information under general laws remain unaffected. However, liability in this regard is only possible from the time of knowledge of a specific infringement. Upon notification of corresponding infringements, I will remove this content immediately.",

    liabilityLinksTitle: "Liability for Links",
    liabilityLinksText1: "My offer contains links to external websites of third parties, over whose content I have no influence. Therefore, I cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.",
    liabilityLinksText2: "However, permanent content control of the linked pages is not reasonable without concrete evidence of an infringement. Upon notification of infringements, I will remove such links immediately.",

    copyrightTitle: "Copyright",
    copyrightText1: "The content and works created by the site operator on these pages are subject to German copyright law. Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator.",
    copyrightText2: "Downloads and copies of this site are only permitted for private, non-commercial use. Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is identified as such.",
    copyrightText3: "Should you nevertheless become aware of a copyright infringement, please inform me accordingly. Upon notification of infringements, I will remove such content immediately.",

    legalLastUpdated: "Last updated: [Date]" // Add Date
  },
  de: {
    // --- Datenschutzerklärung ---
    privacyPolicyTitle: "Datenschutzerklärung",
    responsibleTitle: "Verantwortlich für die Datenverarbeitung auf dieser Website ist:",
    responsibleName: "[Ihr Vorname] [Ihr Nachname]",
    responsibleStreet: "[Straße Hausnummer]",
    responsibleCity: "[PLZ] [Ort]",
    responsibleEmail: "E-Mail: [beispiel@email.de]",
    responsiblePhone: "Telefon: [optional]",

    generalInfoTitle: "1. Allgemeine Hinweise",
    generalInfoText: "Der Schutz Ihrer persönlichen Daten ist mir wichtig. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Diese Datenschutzerklärung erläutert, welche Daten ich erhebe und wofür ich sie nutze.",

    hostingTitle: "2. Hosting",
    hostingText: "Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Personenbezogene Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters verarbeitet. Dies kann insbesondere IP-Adressen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten umfassen, die über ein Kontaktformular generiert werden. Der eingesetzte Hoster ist [Name und Adresse des Hosters].", // Hoster Info hinzufügen

    dataCollectionTitle: "3. Erhebung und Verarbeitung personenbezogener Daten",
    contactFormTitle: "a) Kontaktformulare",
    contactFormText: "Wenn Sie mir per Formular Anfragen zukommen lassen, werden Ihre Angaben aus dem Formular inklusive der von Ihnen angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei mir gespeichert. Diese Daten gebe ich nicht ohne Ihre Einwilligung weiter.",
    contactFormLegalBasis: "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Verarbeitung zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen)",

    guestbookTitle: "b) Gästebuch",
    guestbookText: "Wenn Sie einen Eintrag in mein Gästebuch schreiben, werden Ihre Eingaben sowie Zeitpunkt und ggf. IP-Adresse gespeichert, um Missbrauch vorzubeugen. Die Daten werden in einer SQL-Datenbank gespeichert und nicht an Dritte weitergegeben.",
    guestbookLegalBasis: "Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer funktionierenden Website und Schutz vor Missbrauch)",

    googleFontsTitle: "4. Verwendung von Google Fonts",
    googleFontsText: "Diese Website verwendet zur einheitlichen Darstellung von Schriftarten sogenannte Google Fonts, die von Google bereitgestellt werden. Die Schriftarten werden extern von Google-Servern geladen, wodurch Ihre IP-Adresse an Google (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) übertragen wird.",
    googleFontsLegalBasis: "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer ansprechenden Darstellung)",
    googleFontsNote: "Hinweis: Um DSGVO-konform zu sein, empfiehlt es sich, Google Fonts lokal einzubinden. Alternativ müssen Sie darüber informieren und ggf. die Einwilligung über ein Cookie-Banner einholen.",

    yourRightsTitle: "5. Ihre Rechte",
    yourRightsText: "Sie haben jederzeit das Recht auf:",
    rightInfo: "Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO),",
    rightCorrection: "Berichtigung unrichtiger Daten (Art. 16 DSGVO),",
    rightDeletion: "Löschung (Art. 17 DSGVO),",
    rightRestriction: "Einschränkung der Verarbeitung (Art. 18 DSGVO),",
    rightPortability: "Datenübertragbarkeit (Art. 20 DSGVO),",
    rightObjection: "Widerspruch gegen die Verarbeitung (Art. 21 DSGVO).",
    rightsContact: "Bitte wenden Sie sich dazu an die oben genannte Kontaktadresse.",

    rightToComplainTitle: "6. Beschwerderecht",
    rightToComplainText: "Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt, haben Sie das Recht, sich bei einer Aufsichtsbehörde zu beschweren.",

    sslTitle: "7. SSL- bzw. TLS-Verschlüsselung",
    sslText: "Diese Website nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie an „https://“ in der Adresszeile Ihres Browsers.",

    privacyLastUpdated: "Letzte Aktualisierung: [Datum]", // Datum hinzufügen

    // --- Impressum ---
    legalNoticeTitle: "Impressum",
    legalInfoAccordingTo: "Angaben gemäß § 5 TMG (Telemediengesetz)",

    legalName: "[Ihr Vorname] [Ihr Nachname]",
    legalStreet: "[Straße Hausnummer]",
    legalCity: "[PLZ] [Ort]",
    legalCountry: "Deutschland",

    legalContactTitle: "Kontakt:",
    legalPhone: "Telefon: [01234 / 567890 (optional)]",
    legalEmail: "E-Mail: [deine@email.de]",
    legalWebsite: "Website: [www.deineseite.de]",

    responsibleContentTitle: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:",
    responsibleContentName: "[Ihr Vorname] [Ihr Nachname]",
    responsibleContentStreet: "[Straße Hausnummer]",
    responsibleContentCity: "[PLZ] [Ort]",
    responsibleContentSameAddress: "(ggf. gleiche Adresse wie oben)",

    liabilityContentTitle: "Haftung für Inhalte",
    liabilityContentText1: "Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
    liabilityContentText2: "Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen werde ich diese Inhalte umgehend entfernen.",

    liabilityLinksTitle: "Haftung für Links",
    liabilityLinksText1: "Mein Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
    liabilityLinksText2: "Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werde ich derartige Links umgehend entfernen.",

    copyrightTitle: "Urheberrecht",
    copyrightText1: "Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.",
    copyrightText2: "Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet.",
    copyrightText3: "Solltest du trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitte ich um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werde ich derartige Inhalte umgehend entfernen.",

    legalLastUpdated: "Letzte Aktualisierung: [Datum]" // Datum hinzufügen
  },
  // Add more languages as needed
};

/**
 * Helper functions to get data based on current language
 */
export const getLegalText = (lang = DEFAULT_LANG) => {
  return legalTextMultiLang[lang] || legalTextMultiLang[DEFAULT_LANG];
};

// For potential backward compatibility or direct use
export const legalText = legalTextMultiLang[DEFAULT_LANG];

// IMPORTANT: Remember to replace the placeholders like [Your Name], [your@email.com], [Hoster Name and Address], and [Date] with your actual information in both languages.
// Disclaimer: This is a template and may not cover all legal requirements for your specific situation or jurisdiction. Consult with a legal professional for advice tailored to your needs.