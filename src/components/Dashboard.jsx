import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
  faChartBar,
  faTicketAlt,
  faTasks,
  faBolt,
  faArrowTrendUp,
  faCircle,
  faUser,
  faCalendarAlt,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import ReactECharts from "echarts-for-react";

const summaryCards = [
  {
    label: "Total Processes",
    value: "1,234",
    icon: faChartBar,
    change: "+10%",
    changeColor: "text-green-400",
    border: "border-blue-700",
    ring: "ring-blue-700",
  },
  {
    label: "Active Tickets",
    value: "567",
    icon: faTicketAlt,
    change: "-5%",
    changeColor: "text-red-400",
    border: "border-blue-700",
    ring: "ring-blue-700",
  },
  {
    label: "Completed Processes",
    value: "890",
    icon: faCheckCircle,
    change: "+15%",
    changeColor: "text-green-400",
    border: "border-green-700",
    ring: "ring-green-700",
  },
  {
    label: "Failed Tasks",
    value: "123",
    icon: faTasks,
    change: "+2%",
    changeColor: "text-red-400",
    border: "border-red-700",
    ring: "ring-red-700",
  },
  {
    label: "SLA Breaches",
    value: "45",
    icon: faExclamationTriangle,
    change: "-8%",
    changeColor: "text-yellow-400",
    border: "border-yellow-700",
    ring: "ring-yellow-700",
  },
];

// Chart options (mock data)
const heatmapOption = {
  grid: { left: 0, right: 0, top: 30, bottom: 20, containLabel: true },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    axisLabel: { color: "#a3aed6" },
    axisLine: { lineStyle: { color: "#334155" } },
  },
  yAxis: { show: false },
  series: [
    {
      data: [400, 200, 200, 300, 100, 50, 20],
      type: "bar",
      itemStyle: { color: "#6366f1", borderRadius: [6, 6, 0, 0] },
      barWidth: 24,
    },
  ],
};

const lineOptionBlue = {
  grid: { left: 0, right: 0, top: 30, bottom: 20, containLabel: true },
  xAxis: {
    type: "category",
    data: ["Process A", "Process B", "Process C", "Process D"],
    axisLabel: { color: "#a3aed6" },
    axisLine: { lineStyle: { color: "#334155" } },
  },
  yAxis: { show: false },
  series: [
    {
      data: [2, 2.5, 2, 3],
      type: "line",
      smooth: true,
      lineStyle: { color: "#6366f1", width: 3 },
      areaStyle: { color: "rgba(99,102,241,0.15)" },
      symbol: "none",
    },
  ],
};

const lineOptionYellow = {
  grid: { left: 0, right: 0, top: 30, bottom: 20, containLabel: true },
  xAxis: {
    type: "category",
    data: ["Week 1", "Week 2", "Week 3", "Week 4"],
    axisLabel: { color: "#fde68a" },
    axisLine: { lineStyle: { color: "#fde68a" } },
  },
  yAxis: { show: false },
  series: [
    {
      data: [10, 20, 15, 25],
      type: "line",
      smooth: true,
      lineStyle: { color: "#fbbf24", width: 3 },
      areaStyle: { color: "rgba(251,191,36,0.15)" },
      symbol: "none",
    },
  ],
};

const leaderboard = [
  { name: "Process C", steps: 18 },
  { name: "Process E", steps: 12 },
  { name: "Process A", steps: 10 },
  { name: "Process D", steps: 10 },
  { name: "Process B", steps: 6 },
];

const rootCauses = [
  { label: "Integration Failure", value: 7, percent: 47, color: "bg-red-500" },
  { label: "System Error", value: 4, percent: 27, color: "bg-orange-400" },
  { label: "User Input Error", value: 2, percent: 13, color: "bg-yellow-400" },
  { label: "Timeout", value: 1, percent: 7, color: "bg-blue-400" },
  { label: "Other", value: 1, percent: 7, color: "bg-gray-400" },
];

const activityFeed = [
  { time: "10:00 AM", text: "Process A started", color: "border-blue-400", icon: faBolt },
  { time: "10:15 AM", text: "Ticket 123 created", color: "border-yellow-400", icon: faTicketAlt },
  { time: "10:30 AM", text: "Process B completed", color: "border-green-400", icon: faCheckCircle },
  { time: "10:45 AM", text: "Task X failed", color: "border-red-400", icon: faTasks },
  { time: "11:00 AM", text: "SLA breached on Ticket 456", color: "border-yellow-400", icon: faExclamationTriangle },
];

// New: Process Execution Over Time (Line+Bar)
const processExecutionOption = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['Tickets', 'Avg. Duration'], textStyle: { color: '#a3aed6' } },
  grid: { left: 0, right: 0, top: 40, bottom: 20, containLabel: true },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLabel: { color: '#a3aed6' },
    axisLine: { lineStyle: { color: '#334155' } },
  },
  yAxis: [
    {
      type: 'value',
      name: 'Tickets',
      axisLabel: { color: '#a3aed6' },
      splitLine: { show: false },
    },
    {
      type: 'value',
      name: 'Avg. Duration (min)',
      axisLabel: { color: '#a3aed6' },
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: 'Tickets',
      type: 'bar',
      data: [120, 90, 80, 100, 60, 30, 20],
      itemStyle: { color: '#6366f1', borderRadius: [6, 6, 0, 0] },
      barWidth: 24,
      yAxisIndex: 0,
    },
    {
      name: 'Avg. Duration',
      type: 'line',
      data: [30, 28, 32, 29, 35, 40, 38],
      yAxisIndex: 1,
      smooth: true,
      lineStyle: { color: '#fbbf24', width: 3 },
      areaStyle: { color: 'rgba(251,191,36,0.10)' },
      symbol: 'circle',
      itemStyle: { color: '#fbbf24' },
    },
  ],
};

export default function Dashboard() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-6 transition-colors duration-300">
      {/* Top Bar and Summary */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <div className="text-gray-400 dark:text-gray-400 mb-6">Overview of process orchestration and operational metrics</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {summaryCards.map((card, idx) => (
            <div
              key={card.label}
              className={`rounded-xl border ${card.border} bg-gray-100 dark:bg-gray-800 shadow p-5 flex flex-col gap-2 relative ring-1 ${card.ring}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={card.icon} className="text-xl" />
                <span className="font-semibold text-lg">{card.value}</span>
              </div>
              <div className="text-xs text-gray-400 font-semibold mb-1">{card.label}</div>
              <div className={`text-xs font-bold ${card.changeColor}`}>{card.change}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Process Execution Over Time & Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center justify-center min-h-[180px]">
          <div className="text-gray-700 dark:text-gray-200 text-center text-lg font-semibold mb-2">Process Execution Over Time</div>
          <div className="w-full">
            <ReactECharts option={processExecutionOption} style={{ height: 180 }} theme={theme === 'dark' ? 'dark' : undefined} />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Bar: Ticket Count per Day &nbsp;|&nbsp; Line: Avg. Duration (min)</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="text-gray-700 dark:text-gray-200 text-lg font-semibold mb-2">Activity Feed</div>
          <ul className="space-y-4">
            {activityFeed.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full border-2 ${item.color} flex items-center justify-center`}></span>
                <FontAwesomeIcon icon={item.icon} className="text-base" />
                <span className="flex-1 text-sm">{item.text}</span>
                <span className="text-xs text-gray-500">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Advanced Insights */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Advanced Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Execution Heatmap */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col">
            <div className="text-gray-700 dark:text-gray-200 text-sm mb-2">Execution Heatmap (Last 7 Days)</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">1200 Executions</span>
              <span className="text-green-400 text-sm font-semibold">+10%</span>
            </div>
            <ReactECharts option={heatmapOption} style={{ height: 100 }} theme={theme === 'dark' ? 'dark' : undefined} />
          </div>
          {/* Avg Resolution Time by Workflow */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col">
            <div className="text-gray-700 dark:text-gray-200 text-sm mb-2">Avg Resolution Time by Process</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">2.5 days</span>
              <span className="text-red-400 text-sm font-semibold">-5%</span>
            </div>
            <ReactECharts option={lineOptionBlue} style={{ height: 100 }} theme={theme === 'dark' ? 'dark' : undefined} />
          </div>
          {/* Escalation Trend */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col">
            <div className="text-gray-700 dark:text-gray-200 text-sm mb-2">Escalation Trend (Last 30 Days)</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">50 Escalations</span>
              <span className="text-green-400 text-sm font-semibold">+5%</span>
            </div>
            <ReactECharts option={lineOptionYellow} style={{ height: 100 }} theme={theme === 'dark' ? 'dark' : undefined} />
          </div>
          {/* Workflow Leaderboard */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-700 dark:text-gray-200 text-sm">Process Leaderboard (Top 5)</span>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">10 Avg. Steps</span>
              <span className="text-pink-400 text-sm font-semibold">-2% Complexity</span>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {leaderboard.map((w, idx) => (
                <div key={w.name} className="flex items-center gap-2">
                  <span className="text-xs text-gray-300 w-24">{w.name}</span>
                  <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-2 rounded-full bg-fuchsia-500"
                      style={{ width: `${(w.steps / 18) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-300 w-12 text-right">{w.steps} Steps</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Failure Root Causes */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-6 mt-6">
        <div className="text-gray-700 dark:text-gray-200 text-sm mb-2">Failure Root Causes (Last 30 Days)</div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">15 Total Failures</span>
          <span className="text-green-400 text-sm font-semibold">+3%</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {rootCauses.map((rc) => (
            <div key={rc.label} className="flex items-center gap-2 bg-gray-200 dark:bg-gray-900 rounded-lg px-4 py-2">
              <span className={`w-2 h-2 rounded-full ${rc.color}`}></span>
              <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{rc.label}:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{rc.value} ({rc.percent}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 