
import { useEffect, useMemo, useState } from "react";
import {
  Bookmark, BookmarkCheck, LayoutDashboard, Star, Search, Plus,
  Trash2, ExternalLink, Globe, Folder, Heart, Sparkles, Link2,
  LoaderCircle
} from "lucide-react";

import {
  getBookmarks,
  createBookmark,
  toggleFavorite,
  deleteBookmark
} from "./services/api";

import "./App.css";

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tag, setTag] = useState("general");
  const [selectedTag, setSelectedTag] = useState("all");
  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch bookmarks
  const fetchBookmarks = async (filterTag = "") => {
    try {
      const result = await getBookmarks(filterTag);
      setBookmarks(result.data || []);
      setError("");
    } catch {
      setError("Unable to load bookmarks. Check your backend server.");
    } finally {
      setLoading(false);
    }
  };

  // Initial loading
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getBookmarks();
        setBookmarks(result.data || []);
        setError("");
      } catch {
        setError("Unable to load bookmarks. Check your backend server.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter bookmarks from API
  const handleTagChange = async (newTag) => {
    setSelectedTag(newTag);
    setFavoritesOnly(false);
    setLoading(true);
    await fetchBookmarks(newTag === "all" ? "" : newTag);
  };

  // Create bookmark
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      setError("Please enter both title and URL.");
      return;
    }

    if (!/^https?:\/\/.+/i.test(url.trim())) {
      setError("URL must start with http:// or https://");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createBookmark({
        title: title.trim(),
        url: url.trim(),
        tag: tag.trim() || "general"
      });

      setTitle("");
      setUrl("");
      setTag("general");
      setSelectedTag("all");
      setFavoritesOnly(false);

      await fetchBookmarks("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save bookmark.");
    } finally {
      setSaving(false);
    }
  };

  // Favorite toggle
  const handleFavorite = async (id) => {
    try {
      const result = await toggleFavorite(id);

      setBookmarks((previous) =>
        previous.map((item) =>
          item._id === id ? result.data : item
        )
      );
    } catch {
      setError("Could not update favorite.");
    }
  };

  // Delete bookmark
  const handleDelete = async (id) => {
    try {
      await deleteBookmark(id);

      setBookmarks((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch {
      setError("Could not delete bookmark.");
    }
  };

  // Search and favorites
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFavorite = favoritesOnly
        ? item.isFavorite
        : true;

      return matchesSearch && matchesFavorite;
    });
  }, [bookmarks, search, favoritesOnly]);

  const favoriteCount = bookmarks.filter(
    (item) => item.isFavorite
  ).length;

  const tags = [
    "all",
    ...new Set(bookmarks.map((item) => item.tag || "general"))
  ];

  return (
    <div className="app-container">

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <BookmarkCheck size={25} />
          </div>
          <div>
            <h2>Linkora<span>.</span></h2>
            <small>YOUR LINK LIBRARY</small>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <button
          className={`nav-item ${!favoritesOnly ? "active" : ""}`}
          onClick={() => {
            setFavoritesOnly(false);
            handleTagChange("all");
          }}
        >
          <LayoutDashboard size={19} />
          Dashboard
        </button>

        <button
          className={`nav-item ${favoritesOnly ? "active" : ""}`}
          onClick={() => setFavoritesOnly(!favoritesOnly)}
        >
          <Star size={19} />
          Favorites
          <span className="nav-count">{favoriteCount}</span>
        </button>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <Sparkles size={21} />
            <h4>Stay Organized!</h4>
            <p>Keep your favorite websites just one click away.</p>
          </div>

          <div className="profile">
            <div className="profile-avatar">A</div>
            <div>
              <strong>My Workspace</strong>
              <small>Personal Library</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <span className="breadcrumb">Workspace / Dashboard</span>
          <div className="topbar-right">
            <span className="online-status">
              <span className="status-dot"></span>
              All systems active
            </span>
            <div className="top-avatar">A</div>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <span className="welcome-tag">
              <Sparkles size={14} /> YOUR DIGITAL SPACE
            </span>
            <h1>Your links, <span>beautifully</span> organized.</h1>
            <p>
              Save your favorite websites and keep everything
              you love in one place.
            </p>
          </div>
          <div className="welcome-decoration">
            <Bookmark size={75} strokeWidth={1} />
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple"><Bookmark size={22} /></div>
            <div><span>Total Bookmarks</span><h2>{bookmarks.length}</h2></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Star size={22} /></div>
            <div><span>Favorites</span><h2>{favoriteCount}</h2></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><Folder size={22} /></div>
            <div>
              <span>Categories</span>
              <h2>{new Set(bookmarks.map((b) => b.tag)).size}</h2>
            </div>
          </div>
        </section>

        <section className="add-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">BUILD YOUR COLLECTION</span>
              <h2>Add a new bookmark</h2>
            </div>
            <div className="add-heading-icon"><Plus size={23} /></div>
          </div>

          <form onSubmit={handleSubmit} className="bookmark-form">
            <div className="form-field">
              <label>Bookmark Title</label>
              <input
                type="text"
                placeholder="e.g. React Documentation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Website URL</label>
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Category / Tag</label>
              <input
                type="text"
                placeholder="e.g. React"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>

            <button className="add-button" type="submit" disabled={saving}>
              {saving ? <LoaderCircle className="spin" size={18} /> : <Plus size={19} />}
              {saving ? "Saving..." : "Save Bookmark"}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
        </section>

        <section className="collection-section">
          <div className="collection-heading">
            <div>
              <span className="section-eyebrow">YOUR COLLECTION</span>
              <h2>{favoritesOnly ? "Your Favorites" : "Saved Bookmarks"}</h2>
            </div>

            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-row">
            {tags.map((item) => (
              <button
                key={item}
                className={`filter-btn ${selectedTag === item ? "selected" : ""}`}
                onClick={() => handleTagChange(item)}
              >
                {item === "all" ? "All Bookmarks" : item}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-state">
              <LoaderCircle className="spin" size={32} />
              <p>Loading your bookmarks...</p>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Bookmark size={38} /></div>
              <h3>No bookmarks yet</h3>
              <p>Your collection is waiting! Add your first bookmark using the form above.</p>
            </div>
          ) : (
            <div className="bookmark-grid">
              {filteredBookmarks.map((item) => (
                <article className="bookmark-card" key={item._id}>
                  <div className="card-top">
                    <div className="website-icon"><Globe size={23} /></div>
                    <div className="card-actions">
                      <button
                        className={`icon-button favorite-btn ${item.isFavorite ? "favorited" : ""}`}
                        onClick={() => handleFavorite(item._id)}
                        title="Toggle Favorite"
                      >
                        <Star size={19} fill={item.isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button
                        className="icon-button delete-btn"
                        onClick={() => handleDelete(item._id)}
                        title="Delete Bookmark"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <span className="tag-badge">{item.tag || "general"}</span>
                  <h3>{item.title}</h3>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bookmark-link"
                  >
                    <Link2 size={15} />
                    {item.url}
                    <ExternalLink size={14} />
                  </a>

                  <div className="card-footer">
                    <span><Heart size={14} />{item.isFavorite ? "Favorite" : "Saved"}</span>
                    <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          <span>Linkora © 2026</span>
          <span>Made for your digital world <Heart size={13} /></span>
        </footer>

      </main>
    </div>
  );
}

export default App;
