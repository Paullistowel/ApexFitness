import { useState } from "react";
import { MOCK_EXERCISES, EXERCISE_CATEGORIES, EXERCISES_PER_PAGE } from "../../data/mockData";

import "./WorkoutLibrary.css";

/**
 * WorkoutLibrary page
 * Props:
 *   navigate – fn(screenId)
 */
interface WorkoutLibraryProps {
  navigate: (path: string) => void;
}
export default function WorkoutLibrary(_props: WorkoutLibraryProps) {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [page,     setPage]     = useState(1);

  /* ── Filtering & Pagination ── */
  const filtered = MOCK_EXERCISES.filter((ex: any) => {
    const matchCat    = category === "All" || ex.category === category;
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
                     || ex.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / EXERCISES_PER_PAGE));
  const paged      = filtered.slice((page - 1) * EXERCISES_PER_PAGE, page * EXERCISES_PER_PAGE);

  const handleCategoryChange = (cat: string) => { setCategory(cat); setPage(1); };
  const handleSearchChange   = (val: string) => { setSearch(val);   setPage(1); };

  /* ── Difficulty badge class ── */
  const difficultyBadge = (diff: string) => {
    if (diff === "Beginner")     return "badge badge-orange";
    if (diff === "Intermediate") return "badge badge-blue";
    return "badge badge-red"; // Advanced
  };

  return (
    <div className="lib-page screen-enter">
      <h1 className="page-title">Workout Library</h1>

      {/* ── Search bar ── */}
      <div className="lib-search-bar">
        <span className="lib-search-icon">🔍</span>
        <input
          placeholder="Search exercise...."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
        />
      </div>

      {/* ── Category tabs ── */}
      <div className="category-tabs" role="tablist">
        {EXERCISE_CATEGORIES.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={category === cat}
            className={`category-tab ${category === cat ? "active" : ""}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Exercise grid ── */}
      {paged.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <p>No exercises found. Try a different search or filter.</p>
        </div>
      ) : (
        <div className="exercises-grid">
          {paged.map(ex => (
            <article key={ex.id} className="exercise-card">
              <div className="exercise-card-img">
                <img
                  src={ex.image}
                  alt={ex.name}
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = "flex";
                    }
                  }}
                />
                <div className="exercise-card-img-ph" style={{ display: "none" }}>🏃</div>
              </div>
              <div className="exercise-card-body">
                <div className="exercise-card-top">
                  <h3 className="exercise-card-name">{ex.name}</h3>
                  <button className="bookmark-btn" aria-label="Bookmark">🔖</button>
                </div>
                <span className={difficultyBadge(ex.difficulty)}>{ex.difficulty}</span>
                <div className="exercise-card-meta">
                  <span>⏱ {ex.duration} min</span>
                  <span>·</span>
                  <span>{ex.type}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${page === i + 1 ? "active" : ""}`}
              onClick={() => setPage(i + 1)}
              aria-label={`Page ${i + 1}`}
              aria-current={page === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
