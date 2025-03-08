import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [formStatus, setFormStatus] = useState({
        submitted: false,
        submitting: false,
        error: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus({ submitted: false, submitting: true, error: null });

        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Form submitted:', formData);
            
            // Success! Reset form and show success message
            setFormStatus({ submitted: true, submitting: false, error: null });
            setFormData({ name: '', email: '', message: '' });
            
            // Reset success message after 5 seconds
            setTimeout(() => {
                setFormStatus(prev => ({ ...prev, submitted: false }));
            }, 5000);
        } catch (error) {
            console.error('Form submission error:', error);
            setFormStatus({ submitted: false, submitting: false, error: 'Failed to submit form. Please try again.' });
        }
    };

    return (
        <motion.form 
            onSubmit={handleSubmit} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="Your name"
                        required
                        disabled={formStatus.submitting}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="your.email@example.com"
                        required
                        disabled={formStatus.submitting}
                    />
                </div>
            </div>
            
            <div className="form-group">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="form-textarea w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Your message here..."
                    required
                    disabled={formStatus.submitting}
                />
            </div>
            
            {/* Form status messages */}
            {formStatus.error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 p-3 rounded">
                    {formStatus.error}
                </div>
            )}
            
            {formStatus.submitted && (
                <motion.div 
                    className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300 p-3 rounded flex items-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Message sent successfully! I'll get back to you soon.
                </motion.div>
            )}
            
            <motion.button 
                type="submit" 
                className="btn-primary w-full md:w-auto px-8 py-3 rounded-md font-medium flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={formStatus.submitting}
            >
                {formStatus.submitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                    </>
                ) : "Send Message"}
            </motion.button>
        </motion.form>
    );
};

export default ContactForm;