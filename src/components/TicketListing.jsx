import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faUser,
  faCalendarAlt,
  faEye,
  faEdit,
  faTrash,
  faCheckCircle,
  faExclamationCircle,
  faHourglassHalf,
  faCircle,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const STATUS_MAP = {
  completed: {
    label: "Completed",
    color: "green",
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-700 dark:text-green-300",
    bar: "bg-green-400",
    icon: faCheckCircle,
  },
  inprogress: {
    label: "In Progress",
    color: "blue",
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-700 dark:text-blue-300",
    bar: "bg-blue-400",
    icon: faHourglassHalf,
  },
  pending: {
    label: "Pending",
    color: "yellow",
    bg: "bg-yellow-100 dark:bg-yellow-900",
    text: "text-yellow-700 dark:text-yellow-300",
    bar: "bg-yellow-400",
    icon: faCircle,
  },
  error: {
    label: "Error",
    color: "red",
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-300",
    bar: "bg-red-400",
    icon: faExclamationCircle,
  },
  breached: {
    label: "Breached",
    color: "red",
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-300",
    bar: "bg-red-400",
    icon: faExclamationCircle,
  },
};

const TICKETS = [
  {
    id: "4321",
    title: "John Doe Orders",
    workflow: "Order Processing",
    assignee: "Sarah Chen",
    status: "inprogress",
    created: "2024-03-15T10:00:00",
    sla: { percent: 100, label: "2 days left" },
  },
  {
    id: "4322",
    title: "Jane Doe Offboarding",
    workflow: "Employee Offboarding",
    assignee: null,
    status: "breached",
    created: "2024-03-14T14:00:00",
    sla: { percent: 100, label: "Breached" },
  },
  {
    id: "4323",
    title: "Laptop Setup Request",
    workflow: "IT Support",
    assignee: "David Lee",
    status: "pending",
    created: "2024-03-13T09:00:00",
    sla: { percent: 80, label: "1 day left" },
  },
  {
    id: "4324",
    title: "Benefits Enrollment",
    workflow: "HR Services",
    assignee: "Emily Wong",
    status: "completed",
    created: "2024-03-12T16:00:00",
    sla: { percent: 100, label: "Completed" },
  },
];

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "inprogress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "error", label: "Error" },
];

export default function TicketListing() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("last7");
  const [page, setPage] = useState(1);

  // Filtered tickets
  const filtered = TICKETS.filter((t) => {
    if (status !== "all") {
      if (status === "open") {
        return ["inprogress", "pending"].includes(t.status);
      }
      if (status === "error") {
        return t.status === "breached" || t.status === "error";
      }
      return t.status === status;
    }
    return true;
  }).filter((t) => {
    if (!search) return true;
    return (
      t.id.includes(search) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.assignee && t.assignee.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-colors text-sm">
          <FontAwesomeIcon icon={faPlus} /> Fetch Ticket
        </button>
      </div>
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:gap-4 mb-6">
        <div className="flex-1 flex items-center gap-2 mb-3 md:mb-0">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-base" />
          <input
            className="w-full bg-transparent outline-none text-sm px-2 py-1 dark:text-gray-100"
            placeholder="Search by ticket ID, process name, or assignee"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Date Filter</span>
          <select
            className="rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-2 py-1 text-xs focus:outline-none"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="last7">Created At: Last 7 days</option>
            <option value="last30">Created At: Last 30 days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
      {/* Status Tabs */}
      <div className="flex gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition shadow-sm ${
              status === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => setStatus(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Ticket Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filtered.map((ticket) => {
          const statusObj = STATUS_MAP[ticket.status] || STATUS_MAP["inprogress"];
          return (
            <div
              key={ticket.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-3 relative"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow ${statusObj.bg} ${statusObj.text}`}
                >
                  <FontAwesomeIcon icon={statusObj.icon} className="mr-1" />
                  {statusObj.label}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">#{ticket.id}</span>
                <div className="text-base font-semibold mt-1 mb-0.5 text-gray-900 dark:text-gray-100">
                  {ticket.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Process : {ticket.workflow}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                Assigned To: {ticket.assignee ? (
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{ticket.assignee}</span>
                ) : (
                  <span className="italic text-gray-400">Unassigned</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                Created At: {new Date(ticket.created).toLocaleString()}
              </div>
              {/* SLA Bar */}
              <div className="mb-2">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-500 dark:text-gray-400">SLA / Duration</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{ticket.sla.label}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className={`${statusObj.bar} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${ticket.sla.percent}%` }}
                  />
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-6 mt-2">
                <button onClick={() => navigate(`/orchestration/${ticket.id}`)} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="View">
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button onClick={() => navigate(`/ticketflow`)} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="Edit">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="text-gray-400 hover:text-red-500 dark:hover:text-red-400" title="Delete">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 font-bold disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          &lt;
        </button>
        {[1, 2, 3, 10].map((p, idx) => (
          <button
            key={p}
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
              page === p
                ? "bg-blue-600 text-white"
                : "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900"
            }`}
            onClick={() => setPage(p)}
          >
            {p}
            {idx === 2 && <span className="mx-1">...</span>}
          </button>
        ))}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 font-bold"
          onClick={() => setPage((p) => p + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
} 