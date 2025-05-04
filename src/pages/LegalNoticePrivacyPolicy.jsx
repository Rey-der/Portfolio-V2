import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getLegalText } from '../data/legalData';
import { useScroll } from '../context/ScrollContext'; // Keep for back-to-top

const LegalNoticePrivacyPolicy = () => {
  const sectionRef = useRef(null); // Use a simple ref if needed for the section tag

  // Get language context and data
  const { currentLanguage } = useLanguage();
  const legalContent = getLegalText(currentLanguage);

  // Scroll context for back-to-top (only needed for the button handler)
  // const { scrollToSection } = useScroll(); // Not needed if just scrolling window

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Back to top handler
  const handleScrollToTop = () => {
    // Directly scroll window to top for standalone pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    // Apply simpler layout classes like min-h-screen and standard padding
    <section
      ref={sectionRef}
      id="legal"
      // Use min-h-screen and consistent padding (e.g., py-16 like Contact)
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 relative"
      // Removed inline style for minHeight
      style={{ paddingBottom: '100px' }} // Keep bottom padding for button space
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12" // Add spacing between sections
        >
          {/* Legal Notice (Impressum) Section */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 border-b pb-3 dark:border-slate-700">
              {legalContent.legalNoticeTitle}
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p className="font-semibold">{legalContent.legalInfoAccordingTo}</p>
              <p>
                {legalContent.legalName}<br />
                {legalContent.legalStreet}<br />
                {legalContent.legalCity}<br />
                {legalContent.legalCountry}
              </p>
              <h3 className="font-semibold pt-2">{legalContent.legalContactTitle}</h3>
              <p>
                {legalContent.legalPhone && <>{legalContent.legalPhone}<br /></>}
                {legalContent.legalEmail}<br />
                {legalContent.legalWebsite && <>{legalContent.legalWebsite}</>}
              </p>
              <h3 className="font-semibold pt-2">{legalContent.responsibleContentTitle}</h3>
              <p>
                {legalContent.responsibleContentName}<br />
                {legalContent.responsibleContentStreet}<br />
                {legalContent.responsibleContentCity}<br />
                {legalContent.responsibleContentSameAddress}
              </p>

              <h3 className="text-xl font-semibold pt-4 mt-4 border-t dark:border-slate-700">{legalContent.liabilityContentTitle}</h3>
              <p>{legalContent.liabilityContentText1}</p>
              <p>{legalContent.liabilityContentText2}</p>

              <h3 className="text-xl font-semibold pt-4">{legalContent.liabilityLinksTitle}</h3>
              <p>{legalContent.liabilityLinksText1}</p>
              <p>{legalContent.liabilityLinksText2}</p>

              <h3 className="text-xl font-semibold pt-4">{legalContent.copyrightTitle}</h3>
              <p>{legalContent.copyrightText1}</p>
              <p>{legalContent.copyrightText2}</p>
              <p>{legalContent.copyrightText3}</p>

              <p className="text-sm text-slate-500 dark:text-slate-400 pt-4 border-t dark:border-slate-700 mt-6">
                {legalContent.legalLastUpdated}
              </p>
            </div>
          </motion.div>

          {/* Privacy Policy Section */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 border-b pb-3 dark:border-slate-700">
              {legalContent.privacyPolicyTitle}
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p className="font-semibold">{legalContent.responsibleTitle}</p>
              <p>
                {legalContent.responsibleName}<br />
                {legalContent.responsibleStreet}<br />
                {legalContent.responsibleCity}<br />
                {legalContent.responsibleEmail}<br />
                {legalContent.responsiblePhone}
              </p>

              <h3 className="text-xl font-semibold pt-4 mt-4 border-t dark:border-slate-700">{legalContent.generalInfoTitle}</h3>
              <p>{legalContent.generalInfoText}</p>

              <h3 className="text-xl font-semibold pt-4">{legalContent.hostingTitle}</h3>
              <p>{legalContent.hostingText}</p>

              <h3 className="text-xl font-semibold pt-4">{legalContent.dataCollectionTitle}</h3>
              <h4 className="text-lg font-semibold pt-2">{legalContent.contactFormTitle}</h4>
              <p>{legalContent.contactFormText}</p>
              <p className="text-sm italic">{legalContent.contactFormLegalBasis}</p>

              <h4 className="text-lg font-semibold pt-2">{legalContent.guestbookTitle}</h4>
              <p>{legalContent.guestbookText}</p>
              <p className="text-sm italic">{legalContent.guestbookLegalBasis}</p>

              <h3 className="text-xl font-semibold pt-4">{legalContent.googleFontsTitle}</h3>
              <p>{legalContent.googleFontsText}</p>
              <p className="text-sm italic">{legalContent.googleFontsLegalBasis}</p>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">{legalContent.googleFontsNote}</p>

              <h3 className="text-xl font-semibold pt-4">{legalContent.yourRightsTitle}</h3>
              <p>{legalContent.yourRightsText}</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>{legalContent.rightInfo}</li>
                <li>{legalContent.rightCorrection}</li>
                <li>{legalContent.rightDeletion}</li>
                <li>{legalContent.rightRestriction}</li>
                <li>{legalContent.rightPortability}</li>
                <li>{legalContent.rightObjection}</li>
              </ul>
              <p>{legalContent.rightsContact}</p>

              <h3 className="text-xl font-semibold pt-4">{legalContent.rightToComplainTitle}</h3>
              <p>{legalContent.rightToComplainText}</p>

              <h3 className="text-xl font-semibold pt-4">{legalContent.sslTitle}</h3>
              <p>{legalContent.sslText}</p>

              <p className="text-sm text-slate-500 dark:text-slate-400 pt-4 border-t dark:border-slate-700 mt-6">
                {legalContent.privacyLastUpdated}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Back to top button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleScrollToTop}
            className="rounded-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-6
                      transition-colors duration-300 inline-flex items-center gap-2"
            // Use text from legalData if available, otherwise fallback
            aria-label={legalContent.backToTop || "Back to top"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6"/>
            </svg>
            {/* Use text from legalData if available, otherwise fallback */}
            {legalContent.backToTop || "Back to Top"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default LegalNoticePrivacyPolicy;