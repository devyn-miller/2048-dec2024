import React from 'react';
import { Github, Linkedin, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 mb-6">
          <a 
            href="https://github.com/devyn-miller" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
            aria-label="GitHub Profile"
          >
            <Github size={28} />
          </a>
          <a 
            href="https://linkedin.com/in/devyn-c-miller/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={28} />
          </a>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p> {currentYear} Devyn Miller. All Rights Reserved.</p>
          <p className="flex items-center justify-center gap-2">
            <Heart size={16} className="text-red-500" />
            Thank you for your support!
            <Heart size={16} className="text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
