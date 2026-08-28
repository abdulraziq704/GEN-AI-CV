import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  FileText,
  Filter,
  Search,
  Trash,
  Trash2,
} from "lucide-react";
import { getallCvs, deleteCv } from "../api/cv.api";

const STATUS_STYLES = {
  completed: "bg-success",
  processing: "bg-warning",
  uploaded: "bg-warning",
  failed: "bg-destructive",
};

const ITEMS_PER_PAGE = 5;
const STATUS_FILTERS = ["All", "uploaded", "processing", "completed", "failed"];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Mycv() {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleted, setdeleted] = useState(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState({ key: "createdAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getallCvs();
        setCvs(response?.cv ?? []); // backend key is "cv" (singular), not "cvs"
      } catch (err) {
        console.error("Failed to load CVs:", err);
        setError("Couldn't load your CVs. Please try again.");
        setCvs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleSort = (key) => {
    setPage(1);
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (cvs ?? []).filter((cv) => {
      const matchesQuery = !q || cv.originalName.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" || cv.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [cvs, query, statusFilter]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      if (sort.key === "fileName")
        cmp = a.originalName.localeCompare(b.originalName);
      if (sort.key === "createdAt")
        cmp = new Date(a.createdAt) - new Date(b.createdAt);
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = sorted.slice(start, start + ITEMS_PER_PAGE);

  const handleDelete = async (id) => {
    if (!window.confirm(" Delete Cv will delete all thier question Set too."))
      return;
    setdeleted(id);
    try {
      await deleteCv(id);
      setCvs((prev) => prev.filter((cv) => cv._id != id));
    } catch (error) {
      console.error("Failed to delete CV:", err);
      alert("Couldn't delete this CV. Please try again.");
    } finally {
      setdeleted(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {/* header */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-px w-6 bg-primary" />
              Document Repository
            </div>
            <h1 className="relative inline-block text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              My CVs
              <span className="absolute -bottom-1 left-0 -z-10 h-2 w-24 rounded-full bg-success/40" />
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Manage your uploaded profiles and review targeted interview
              questions tailored to each role.
            </p>
          </div>

          {/* controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                type="text"
                placeholder="Search by file name..."
                className="w-64 rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                <Filter size={16} />
                Filter
              </button>
              {filterOpen && (
                <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border border-border bg-surface p-1 shadow-card">
                  {STATUS_FILTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatusFilter(s);
                        setPage(1);
                        setFilterOpen(false);
                      }}
                      className={`block w-full rounded-md px-3 py-2 text-left text-sm capitalize ${
                        statusFilter === s
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/tool"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Upload New
            </Link>
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center text-muted-foreground shadow-card">
            Loading your CVs…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center text-destructive shadow-card">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* table header */}
            <div className="mb-4 hidden grid-cols-[2.5fr_1.2fr_auto] items-center gap-4 rounded-xl bg-accent/60 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
              <button
                onClick={() => toggleSort("fileName")}
                className="flex items-center gap-1 text-left hover:text-foreground"
              >
                File Name <ChevronDown size={14} />
              </button>
              <button
                onClick={() => toggleSort("createdAt")}
                className="flex items-center gap-1 text-left hover:text-foreground"
              >
                Upload Date <ChevronDown size={14} />
              </button>
              <span className="text-right">Actions</span>
            </div>

            {/* rows */}
            <div className="space-y-4">
              {pageItems.length === 0 && (
                <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center text-muted-foreground shadow-card">
                  No CVs found. Upload your first one to get started.
                </div>
              )}

              {pageItems.map((cv) => (
                <div
                  key={cv._id}
                  className="grid grid-cols-1 items-center gap-4 rounded-2xl border border-border bg-surface px-6 py-4 shadow-card md:grid-cols-[2.5fr_1.2fr_auto]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                      <FileText size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {cv.originalName}
                      </p>
                      <p className="flex items-center gap-1.5 text-sm capitalize text-muted-foreground">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            STATUS_STYLES[cv.status] ?? "bg-muted"
                          }`}
                        />
                        {cv.status}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium text-foreground">
                      {formatDate(cv.createdAt)}
                    </p>
                    <p className="text-muted-foreground">
                      {formatTime(cv.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-self-start gap-2 md:justify-self-end">
                    <Link
                      to={`/cv/${cv._id}`}
                      target="_blank"
                      prefetch="intent"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-accent"
                    >
                      View Questions
                      <ArrowUpRight size={14} />
                    </Link>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setMenuOpenId((prev) =>
                            prev === cv._id ? null : cv._id,
                          )
                        }
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {menuOpenId === cv._id && (
                        <div className="absolute right-0 z-10 mt-2 w-36 rounded-lg border border-border bg-surface p-1 shadow-card">
                          <button
                            type="button"
                            disabled={deleted === cv._id}
                            onClick={() => {
                              setMenuOpenId(null);
                              handleDelete(cv._id);
                            }}
                            className="block w-full rounded-md cursor-pointer px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-accent disabled:opacity-50"
                          >
                            {deleted === cv._id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* pagination */}
            {sorted.length > 0 && (
              <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                  Showing {start + 1} to{" "}
                  {Math.min(start + ITEMS_PER_PAGE, sorted.length)} of{" "}
                  {sorted.length} CVs
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${
                          n === currentPage
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-surface text-foreground hover:bg-accent"
                        }`}
                      >
                        {n}
                      </button>
                    ),
                  )}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
