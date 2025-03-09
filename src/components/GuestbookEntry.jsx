import React from 'react';
import { motion } from 'framer-motion';

const GuestbookEntry = ({ entry, variants, index }) => {
  return (
    <motion.div 
      className="card bg-white dark:bg-gray-800"
      variants={variants}
    >
      <h3 className="font-medium text-xl">{entry.name}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{entry.message}</p>
      <p className="mt-2 text-sm text-gray-400">
        {new Date(entry.date).toLocaleDateString()}
      </p>
    </motion.div>
  );
};

export default GuestbookEntry;