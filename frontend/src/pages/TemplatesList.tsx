import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { templateService, Template } from "../services/templateService";
import "./TemplatesList.css";

const TemplatesList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await templateService.getAllTemplates();
      setTemplates(data || []);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load templates. Please try again."
      );
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      await templateService.deleteTemplate(id);
      setTemplates(templates.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete template."
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="templates-container">
      <nav className="templates-nav">
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
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <main className="templates-main">
        <div className="templates-header">
          <h2>Templates</h2>
          <button
            onClick={() => navigate("/templates/add")}
            className="add-button"
          >
            + Add Template
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading templates...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={loadTemplates} className="retry-button">
              Retry
            </button>
          </div>
        ) : templates.length === 0 ? (
          <div className="empty-container">
            <p>No templates found. Create your first template!</p>
            <button
              onClick={() => navigate("/templates/add")}
              className="add-button"
            >
              + Add Template
            </button>
          </div>
        ) : (
          <div className="templates-table-container">
            <table className="templates-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Items</th>
                  <th>Created By</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template.id}>
                    <td>{template.title}</td>
                    <td className="items-cell">
                      {template.items || "-"}
                    </td>
                    <td>{template.user?.email || "-"}</td>
                    <td>
                      {new Date(template.createdAt).toLocaleDateString()}
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => navigate(`/templates/edit/${template.id}`)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="templates-count">
              Total Templates: {templates.length}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TemplatesList;

