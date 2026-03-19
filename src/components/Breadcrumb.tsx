/**
 * Breadcrumb
 * Props:
 *   crumbs – array of { label, id? }
 *            last item has no id (current page, not clickable)
 *   navigate – fn(id) for clickable crumbs
 *
 * Usage:
 *   <Breadcrumb
 *     crumbs={[
 *       { label: "Dashboard", id: "dashboard" },
 *       { label: "Workouts" },
 *       { label: "Start Workout" },
 *     ]}
 *     navigate={navigate}
 *   />
 */
interface Crumb {
  label: string;
  id?: string;
}
interface BreadcrumbProps {
  crumbs?: Crumb[];
  navigate: (id: string) => void;
}
export default function Breadcrumb({ crumbs = [], navigate }: BreadcrumbProps) {
  if (!crumbs.length) return null;

  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {i > 0 && <span className="crumb-sep">›</span>}
          {crumb.id ? (
            <span
              className="crumb-link"
              onClick={() => crumb.id && navigate(crumb.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === "Enter" && crumb.id && navigate(crumb.id)}
            >
              {crumb.label}
            </span>
          ) : (
            <span className="crumb-active">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
