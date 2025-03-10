import React from 'react';
import { motion } from 'framer-motion';
import GuestbookEntry from './GuestbookEntry';

const GuestbookEntryList = ({ 
  entries, 
  loading, 
  error, 
  animationRef, 
  animationInView,
  containerVariants,
  itemVariants,
  isMobile,
  guestbookText 
}) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">{guestbookText.recentMessages}</h2>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : (
        <motion.div 
          className="space-y-4"
          ref={animationRef}
          variants={containerVariants}
          initial="hidden"
          animate={animationInView ? "visible" : "hidden"}
        >
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <GuestbookEntry
                key={entry.id || index}
                entry={entry}
                variants={itemVariants}
                index={index}
              />
            ))
          ) : (
            <p className="text-center py-8 text-gray-500">
              {guestbookText.noMessages}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default GuestbookEntryList;