import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import api from "../api/client";
import StatCard from "../components/StatCard";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get("/analytics").then((res) => setAnalytics(res.data));
  }, []);

  if (!analytics) return <p className="text-slate-300">Loading analytics...</p>;

  const topicsChart = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [analytics.topicsProgress.completed, analytics.topicsProgress.total - analytics.topicsProgress.completed],
        backgroundColor: ["#10b981", "#334155"]
      }
    ]
  };

  const studyChart = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Study Minutes",
        data: analytics.study.weeklyData,
        borderColor: "#34d399",
        backgroundColor: "rgba(52,211,153,0.2)",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Notes Uploaded" value={analytics.notesCount} />
        <StatCard title="Topics Progress" value={`${analytics.topicsProgress.percentage}%`} subtitle={`${analytics.topicsProgress.completed}/${analytics.topicsProgress.total} done`} />
        <StatCard title="Study Time" value={`${analytics.study.totalMinutes} mins`} />
        <StatCard title="DSA" value={`${analytics.placement.dsaSolved}/${analytics.placement.dsaTarget}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-3 font-semibold">Exam Topics Completion</h3>
          <Doughnut data={topicsChart} />
        </div>
        <div className="card">
          <h3 className="mb-3 font-semibold">Weekly Study Trend</h3>
          <Line data={studyChart} />
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold">Monthly Performance</h3>
        <p className="mt-2 text-sm text-slate-300">Tasks completed: {analytics.monthlyPerformance.tasksCompleted}</p>
        <p className="text-sm text-slate-300">Study minutes: {analytics.monthlyPerformance.studyMinutes}</p>
      </div>
    </div>
  );
};

export default DashboardPage;
