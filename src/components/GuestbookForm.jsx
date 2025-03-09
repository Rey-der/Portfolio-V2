import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { addGuestbookEntry } from '../api/guestbook';

const GuestbookForm = ({ onEntryAdded, isMobile }) => {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    try {
      const newEntry = await addGuestbookEntry(formData);
      onEntryAdded(newEntry);
      setFormData({ name: '', message: '' });
      setSubmitStatus('success');

      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (err) {
      console.error('Failed to submit entry:', err);
      setSubmitStatus('error');
    }
  };

  return (
    <>
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: isMobile ? 0.4 : 0.5 }}
      >
        Guestbook
      </motion.h1>
      
      <motion.p 
        className="text-lg text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: isMobile ? 0.4 : 0.5 }}
      >
        Leave a message, feedback, or just say hello!
      </motion.p>

      <motion.div 
        className="card mb-12" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: isMobile ? 0.5 : 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Sign the Guestbook</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              required
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block mb-1 font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="form-input h-32"
              required
              placeholder="Your message..."
            />
          </div>
          
          <button
            type="submit"
            className={`btn-primary ${isMobile ? "w-full" : "w-full sm:w-auto"}`}
            disabled={submitStatus === 'submitting'}
          >
            {submitStatus === 'submitting' ? 'Submitting...' : 'Sign Guestbook'}
          </button>
          
          {submitStatus === 'success' && (
            <p className="text-green-600 dark:text-green-400 mt-2">
              Thank you for signing the guestbook!
            </p>
          )}
          
          {submitStatus === 'error' && (
            <p className="text-red-600 dark:text-red-400 mt-2">
              Failed to submit your message. Please try again.
            </p>
          )}
        </form>
      </motion.div>
    </>
  );
};

export default GuestbookForm;