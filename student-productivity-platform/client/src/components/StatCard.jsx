const StatCard = ({ title, value, subtitle }) => (
  <div className="card">
    <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
    <h3 className="mt-2 text-2xl font-bold text-brand-100">{value}</h3>
    {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
  </div>
);

export default StatCard;
