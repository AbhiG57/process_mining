import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const navLinks = [
  { name: 'Dashboard', to: '/' },
  { name: 'Processes', to: '/process' },
  { name: 'Orchestration', to: '/ticketlisting' },
  { name: 'Reports', to: '/reports' },
  { name: 'Settings', to: '/settings' },
];

function NavBar({ theme, toggleTheme }) {
  const location = useLocation();
  return (
    <nav className="w-full bg-white text-gray-900 dark:bg-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <span className="font-bold text-xl tracking-tight">FlowMaster</span>
        <div className="hidden md:flex gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1 rounded transition-colors duration-150 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white ${location.pathname === link.to ? 'bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-white' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button className="ml-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path></svg>
        </button>
        <button
          className="ml-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-yellow-500 dark:text-yellow-400"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} size="lg" />
        </button>
      </div>
    </nav>
  );
}

export default NavBar; 