import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { templateService } from "../services/templateService";
import "./AddTemplate.css";

const AddTemplate = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [items, setItems] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");

  const validateTitle = (value: string) => {
    if (!value.trim()) {
      return "Title is required";
    }
    return "";
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (titleError) {
      setTitleError(validateTitle(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const titleErr = validateTitle(title);
    setTitleError(titleErr);

    if (titleErr) {
      return;
    }

    setLoading(true);

    try {
      await templateService.createTemplate({
        title: title.trim(),
        items: items.trim() || undefined,
      });
      navigate("/templates");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create template. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="add-template-container">
      <nav className="add-template-nav">
        <div className="nav-brand">
          <h1>Drizmo</h1>
        </div>
        <div className="nav-links">
          <button
            onClick={() => navigate("/dashboard")}
            className="nav-link-button"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/templates")}
            className="nav-link-button"
          >
            Templates
          </button>
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <main className="add-template-main">
        <div className="add-template-header">
          <h2>Add Template</h2>
          <button
            onClick={() => navigate("/templates")}
            className="back-button"
          >
            ← Back to Templates
          </button>
        </div>

        <div className="add-template-form-container">
          {error && (
            <div className="error-message">
              <svg
                className="error-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="add-template-form">
            <div className="form-group">
              <label htmlFor="title">
                Title <span className="required-star">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={() => setTitleError(validateTitle(title))}
                placeholder="Enter template title"
                className={titleError ? "input-error" : ""}
                required
              />
              {titleError && <span className="field-error">{titleError}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="items">Items (Optional)</label>
              <textarea
                id="items"
                value={items}
                onChange={(e) => setItems(e.target.value)}
                placeholder="Enter template items"
                rows={6}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/templates")}
                className="cancel-button"
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Creating..." : "Create Template"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddTemplate;

