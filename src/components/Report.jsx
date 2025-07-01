import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faCalendarAlt,
  faListAlt,
  faUser,
  faFileExport,
  faFileCsv,
  faFileExcel,
  faFilePdf,
  faChartLine,
  faTicketAlt,
  faClock,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const TABS = [
  { key: "process", label: "Process Reports", icon: faChartLine },
  { key: "ticket", label: "Ticket Reports", icon: faTicketAlt },
];

const TIME_PERIODS = [
  { key: "30d", label: "Last 30 Days" },
  { key: "7d", label: "Last 7 Days" },
  { key: "1d", label: "Yesterday" },
];

const TABLE_DATA = [
  { key: "30d", range: "Last 30 Days", total: 150, active: 30, completed: 100, failed: 20, avg: 5 },
  { key: "30d", range: "2024-06-01 to 2024-06-15", total: 80, active: 15, completed: 60, failed: 5, avg: 4.9 },
  { key: "30d", range: "2024-05-16 to 2024-05-31", total: 70, active: 15, completed: 40, failed: 15, avg: 5.1 },
  { key: "7d", range: "Last 7 Days", total: 45, active: 10, completed: 30, failed: 5, avg: 4.8 },
  { key: "7d", range: "2024-06-10 to 2024-06-16", total: 25, active: 5, completed: 18, failed: 2, avg: 4.7 },
  { key: "7d", range: "2024-06-03 to 2024-06-09", total: 20, active: 5, completed: 12, failed: 3, avg: 4.9 },
  { key: "1d", range: "Yesterday", total: 8, active: 2, completed: 5, failed: 1, avg: 5.2 },
  { key: "1d", range: "2024-06-16", total: 4, active: 1, completed: 2, failed: 1, avg: 5.0 },
  { key: "1d", range: "2024-06-15", total: 4, active: 1, completed: 3, failed: 0, avg: 5.4 },
];

// Ticket Reports mock data
const TICKET_TABLE_DATA = [
  { key: "30d", range: "Last 30 Days", total: 320, open: 40, inprogress: 60, completed: 200, failed: 20, avg: 3.2 },
  { key: "30d", range: "2024-06-01 to 2024-06-15", total: 170, open: 20, inprogress: 30, completed: 110, failed: 10, avg: 3.1 },
  { key: "30d", range: "2024-05-16 to 2024-05-31", total: 150, open: 20, inprogress: 30, completed: 90, failed: 10, avg: 3.3 },
  { key: "7d", range: "Last 7 Days", total: 80, open: 10, inprogress: 15, completed: 50, failed: 5, avg: 2.8 },
  { key: "7d", range: "2024-06-10 to 2024-06-16", total: 45, open: 5, inprogress: 8, completed: 30, failed: 2, avg: 2.7 },
  { key: "7d", range: "2024-06-03 to 2024-06-09", total: 35, open: 5, inprogress: 7, completed: 20, failed: 3, avg: 2.9 },
  { key: "1d", range: "Yesterday", total: 12, open: 2, inprogress: 3, completed: 6, failed: 1, avg: 2.5 },
  { key: "1d", range: "2024-06-16", total: 6, open: 1, inprogress: 2, completed: 2, failed: 1, avg: 2.4 },
  { key: "1d", range: "2024-06-15", total: 6, open: 1, inprogress: 1, completed: 4, failed: 0, avg: 2.6 },
];

export default function Report() {
  const [activeTab, setActiveTab] = useState("process");
  const [exportOpen, setExportOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  const [periodOpen, setPeriodOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(TIME_PERIODS[0].key);

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Export functionality (mock)
  const handleExport = (type) => {
    setExportOpen(false);
    alert(`Exporting as ${type.toUpperCase()}... (mock)`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-0 md:px-8 py-6 transition-colors duration-300 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 px-6 md:px-0">
        <FontAwesomeIcon icon={faChartBar} className="text-3xl text-blue-500 bg-blue-100 dark:bg-blue-900 p-2 rounded-lg shadow" />
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      </div>
      {/* Filters and Export */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 px-6 md:px-0">
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold text-sm shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => setPeriodOpen((v) => !v)}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
            {TIME_PERIODS.find((p) => p.key === selectedPeriod)?.label || 'Time Period'}
            <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-xs" />
          </button>
          {periodOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
              {TIME_PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => { setSelectedPeriod(p.key); setPeriodOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedPeriod === p.key ? 'font-bold bg-gray-100 dark:bg-gray-900' : ''}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow transition"
            onClick={() => setExportOpen((v) => !v)}
          >
            <FontAwesomeIcon icon={faFileExport} /> Export <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-xs" />
          </button>
          {exportOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700">
              <button onClick={() => handleExport('csv')} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <FontAwesomeIcon icon={faFileCsv} /> Export as CSV
              </button>
              <button onClick={() => handleExport('excel')} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <FontAwesomeIcon icon={faFileExcel} /> Export as Excel
              </button>
              <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <FontAwesomeIcon icon={faFilePdf} /> Export as PDF
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-2 px-6 md:px-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all duration-150 ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-300 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <FontAwesomeIcon icon={tab.icon} /> {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="flex-1 w-full mt-6">
        {activeTab === "process" && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-300 uppercase bg-gray-200 dark:bg-gray-900">
                  <th className="px-6 py-3">Date Range</th>
                  <th className="px-6 py-3">Total Processes</th>
                  <th className="px-6 py-3">Active</th>
                  <th className="px-6 py-3">Completed</th>
                  <th className="px-6 py-3">Failed</th>
                  <th className="px-6 py-3">Average Steps</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_DATA.filter(row => row.key === selectedPeriod).map((row, idx) => (
                  <tr key={row.range} className={`text-sm ${idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"}`}>
                    <td className="px-6 py-3 font-semibold">{row.range}</td>
                    <td className="px-6 py-3">{row.total}</td>
                    <td className="px-6 py-3">{row.active}</td>
                    <td className="px-6 py-3">{row.completed}</td>
                    <td className="px-6 py-3">{row.failed}</td>
                    <td className="px-6 py-3">{row.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "ticket" && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-300 uppercase bg-gray-200 dark:bg-gray-900">
                  <th className="px-6 py-3">Date Range</th>
                  <th className="px-6 py-3">Total Tickets</th>
                  <th className="px-6 py-3">Open</th>
                  <th className="px-6 py-3">In Progress</th>
                  <th className="px-6 py-3">Completed</th>
                  <th className="px-6 py-3">Failed</th>
                  <th className="px-6 py-3">Avg. Resolution Time (hrs)</th>
                </tr>
              </thead>
              <tbody>
                {TICKET_TABLE_DATA.filter(row => row.key === selectedPeriod).map((row, idx) => (
                  <tr key={row.range} className={`text-sm ${idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"}`}>
                    <td className="px-6 py-3 font-semibold">{row.range}</td>
                    <td className="px-6 py-3">{row.total}</td>
                    <td className="px-6 py-3">{row.open}</td>
                    <td className="px-6 py-3">{row.inprogress}</td>
                    <td className="px-6 py-3">{row.completed}</td>
                    <td className="px-6 py-3">{row.failed}</td>
                    <td className="px-6 py-3">{row.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-gray-400 dark:text-gray-600 py-4">
        © 2024 FlowMaster. All rights reserved.
      </footer>
    </div>
  );
} 