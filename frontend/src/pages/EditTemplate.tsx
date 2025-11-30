import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { templateService } from "../services/templateService";
import "./EditTemplate.css";

const EditTemplate = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [items, setItems] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (id) {
      loadTemplate();
    }
  }, [id]);

  const loadTemplate = async () => {
    if (!id) return;

    setLoadingTemplate(true);
    setError("");

    try {
      const template = await templateService.getTemplateById(id);
      setTitle(template.title);
      setItems(template.items || "");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load template. Please try again."
      );
    } finally {
      setLoadingTemplate(false);
    }
  };

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

    if (!id) {
      setError("Template ID is missing");
      return;
    }

    const titleErr = validateTitle(title);
    setTitleError(titleErr);

    if (titleErr) {
      return;
    }

    setLoading(true);

    try {
      await templateService.updateTemplate(id, {
        title: title.trim(),
        items: items.trim() || undefined,
      });
      navigate("/templates");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update template. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loadingTemplate) {
    return (
      <div className="edit-template-container">
        <nav className="edit-template-nav">
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
        <main className="edit-template-main">
          <div className="loading-container">
            <p>Loading template...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="edit-template-container">
      <nav className="edit-template-nav">
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

      <main className="edit-template-main">
        <div className="edit-template-header">
          <h2>Edit Template</h2>
          <button
            onClick={() => navigate("/templates")}
            className="back-button"
          >
            ← Back to Templates
          </button>
        </div>

        <div className="edit-template-form-container">
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

          <form onSubmit={handleSubmit} className="edit-template-form">
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
                {loading ? "Updating..." : "Update Template"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditTemplate;

