import { useEffect, useState } from "react";
import api from "../api/client";

const PlacementPage = () => {
  const [placement, setPlacement] = useState(null);
  const [dsa, setDsa] = useState({ dsaSolved: 0, dsaTarget: 300 });
  const [company, setCompany] = useState({ company: "", status: "planned", notes: "" });
  const [interview, setInterview] = useState({ title: "", scheduledAt: "", link: "" });

  const fetchPlacement = async () => {
    const { data } = await api.get("/placement");
    setPlacement(data);
    setDsa({ dsaSolved: data.dsaSolved || 0, dsaTarget: data.dsaTarget || 300 });
  };

  useEffect(() => {
    fetchPlacement();
  }, []);

  const saveDsa = async () => {
    await api.patch("/placement/dsa", dsa);
    fetchPlacement();
  };

  const addCompany = async (e) => {
    e.preventDefault();
    await api.post("/placement/companies", company);
    setCompany({ company: "", status: "planned", notes: "" });
    fetchPlacement();
  };

  const addInterview = async (e) => {
    e.preventDefault();
    await api.post("/placement/interviews", interview);
    setInterview({ title: "", scheduledAt: "", link: "" });
    fetchPlacement();
  };

  const uploadResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    await api.post("/placement/resume", fd);
    fetchPlacement();
  };

  if (!placement) return <p className="text-slate-300">Loading placement dashboard...</p>;

  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <h3 className="font-semibold">DSA Tracker</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="input" type="number" value={dsa.dsaSolved} onChange={(e) => setDsa({ ...dsa, dsaSolved: Number(e.target.value) })} />
          <input className="input" type="number" value={dsa.dsaTarget} onChange={(e) => setDsa({ ...dsa, dsaTarget: Number(e.target.value) })} />
        </div>
        <div className="h-2 rounded bg-slate-700">
          <div className="h-2 rounded bg-brand-500" style={{ width: `${Math.min(100, Math.round((dsa.dsaSolved / Math.max(dsa.dsaTarget, 1)) * 100))}%` }} />
        </div>
        <button className="btn" onClick={saveDsa}>Update DSA Progress</button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <form className="card space-y-2" onSubmit={addCompany}>
          <h4 className="font-semibold">Company-Wise Preparation</h4>
          <input className="input" placeholder="Company" value={company.company} onChange={(e) => setCompany({ ...company, company: e.target.value })} required />
          <select className="input" value={company.status} onChange={(e) => setCompany({ ...company, status: e.target.value })}>
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="ready">Ready</option>
          </select>
          <input className="input" placeholder="Notes" value={company.notes} onChange={(e) => setCompany({ ...company, notes: e.target.value })} />
          <button className="btn w-full" type="submit">Add Company</button>
        </form>

        <form className="card space-y-2" onSubmit={addInterview}>
          <h4 className="font-semibold">Mock Interview Scheduler</h4>
          <input className="input" placeholder="Interview title" value={interview.title} onChange={(e) => setInterview({ ...interview, title: e.target.value })} required />
          <input className="input" type="datetime-local" value={interview.scheduledAt} onChange={(e) => setInterview({ ...interview, scheduledAt: e.target.value })} required />
          <input className="input" placeholder="Meeting link" value={interview.link} onChange={(e) => setInterview({ ...interview, link: e.target.value })} />
          <button className="btn w-full" type="submit">Schedule Interview</button>
        </form>
      </div>

      <div className="card space-y-3">
        <h4 className="font-semibold">Resume Upload & Tips</h4>
        <input className="input" type="file" accept=".pdf,.doc,.docx" onChange={uploadResume} />
        <ul className="list-disc pl-5 text-sm text-slate-300">
          {(placement.resumeTips || []).map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h4 className="mb-2 font-semibold">Tracked Companies</h4>
        <ul className="space-y-1 text-sm text-slate-300">
          {placement.companies.map((item, idx) => (
            <li key={idx}>{item.company} - {item.status} {item.notes ? `| ${item.notes}` : ""}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h4 className="mb-2 font-semibold">Upcoming Mock Interviews</h4>
        <ul className="space-y-1 text-sm text-slate-300">
          {placement.interviews.map((item, idx) => (
            <li key={idx}>
              {item.title} on {new Date(item.scheduledAt).toLocaleString()} {item.link ? `| ${item.link}` : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlacementPage;
