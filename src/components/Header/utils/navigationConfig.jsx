import React from 'react';

export const getNavigationLinks = (headerText) => [
  { sectionId: "home", path: "/", label: headerText.home },
  { sectionId: "projects", path: "/projects", label: headerText.projects },
  { sectionId: "about", path: "/about", label: headerText.about },
  { sectionId: "guestbook", path: "/guestbook", label: headerText.guestbook },
  { 
    sectionId: "contact", 
    path: "/contact", 
    label: "",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon-svg h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-label={headerText.contact}>
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    ),
    ariaLabel: headerText.contact
  }
];

export default getNavigationLinks;