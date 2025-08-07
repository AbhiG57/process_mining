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
import { EChartsOption } from 'echarts';

interface SummaryCard {
  label: string;
  value: string;
  icon: any;
  change: string;
  changeColor: string;
  border: string;
  ring: string;
}

const summaryCards: SummaryCard[] = [
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
const heatmapOption: EChartsOption = {
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

const lineOptionBlue: EChartsOption = {
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
      itemStyle: { color: "#3b82f6" },
      lineStyle: { color: "#3b82f6", width: 3 },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
            { offset: 1, color: "rgba(59, 130, 246, 0.05)" },
          ],
        },
      },
    },
  ],
};

const lineOptionGreen: EChartsOption = {
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
      data: [1.5, 2, 1.8, 2.2],
      type: "line",
      smooth: true,
      itemStyle: { color: "#10b981" },
      lineStyle: { color: "#10b981", width: 3 },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(16, 185, 129, 0.3)" },
            { offset: 1, color: "rgba(16, 185, 129, 0.05)" },
          ],
        },
      },
    },
  ],
};

export default function Dashboard(): JSX.Element {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening with your processes.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-2">
              <FontAwesomeIcon icon={faUser} className="text-gray-400" />
              <span className="text-sm font-medium">John Doe</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
              <span className="text-sm">Today</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 border ${card.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.ring} ring-2 ring-opacity-20`}>
                  <FontAwesomeIcon icon={card.icon} className="text-2xl text-gray-600 dark:text-gray-300" />
                </div>
                <span className={`text-sm font-medium ${card.changeColor}`}>
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-bold mb-1">{card.value}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
            <ReactECharts option={heatmapOption} style={{ height: '200px' }} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Process Performance</h3>
            <ReactECharts option={lineOptionBlue} style={{ height: '200px' }} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { icon: faCheckCircle, text: "Process 'Data Entry Automation' completed successfully", time: "2 minutes ago", color: "text-green-500" },
              { icon: faExclamationTriangle, text: "SLA breach detected in 'Customer Onboarding' process", time: "15 minutes ago", color: "text-yellow-500" },
              { icon: faBolt, text: "New process 'Invoice Processing' started", time: "1 hour ago", color: "text-blue-500" },
              { icon: faTasks, text: "Task 'Validate Email' failed in 'User Registration'", time: "2 hours ago", color: "text-red-500" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <FontAwesomeIcon icon={activity.icon} className={`${activity.color} text-sm`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 