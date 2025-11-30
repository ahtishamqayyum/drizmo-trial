import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import "./Dashboard.css";

interface User {
  id: string;
  name?: string;
  email: string;
  tenantId: string;
  role?: string; // "admin" or "user"
  createdAt: string;
}

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user && user.tenantId) {
      loadUsers();
    } else if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const loadUsers = async () => {
    if (!user || !user.tenantId) {
      setError("User information not available. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const usersData = await userService.getAllUsers();
      setUsers(usersData || []);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to load users. Please check your connection and try again."
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>Drizmo</h1>
        </div>
        <div className="nav-user">
          <button
            onClick={() => navigate("/templates")}
            className="templates-link-button"
          >
            Templates
          </button>
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2>Welcome back, {user?.email?.split("@")[0]}!</h2>
          <p>Here's what's happening with your account today.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card card-primary">
            <div className="card-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3>User Profile</h3>
            <p className="card-value">{user?.email}</p>
            <p className="card-label">Email Address</p>
          </div>

          <div className="dashboard-card card-secondary">
            <div className="card-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3>Tenant ID</h3>
            <p className="card-value">
              {user?.tenantId === "tenant-a-id"
                ? "Tenant A"
                : user?.tenantId === "tenant-b-id"
                ? "Tenant B"
                : user?.tenantId || "N/A"}
            </p>
            <p className="card-label">Your Organization</p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#a0aec0",
                marginTop: "0.5rem",
              }}
            >
              ID: {user?.tenantId || "N/A"}
            </p>
          </div>

          <div className="dashboard-card card-accent">
            <div className="card-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3>Security</h3>
            <p className="card-value">Active</p>
            <p className="card-label">Account Status</p>
          </div>

          <div className="dashboard-card card-success">
            <div className="card-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3>Performance</h3>
            <p className="card-value">Excellent</p>
            <p className="card-label">System Health</p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h4
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.25rem",
                fontWeight: 600,
              }}
            >
              {user?.tenantId === "tenant-a-id"
                ? "Tenant A"
                : user?.tenantId === "tenant-b-id"
                ? "Tenant B"
                : user?.tenantId}{" "}
              Users List
            </h4>
            {authLoading || loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p>{authLoading ? "Loading..." : "Loading users..."}</p>
              </div>
            ) : error ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#e53e3e",
                }}
              >
                <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                  Error loading users
                </p>
                <p style={{ fontSize: "0.9rem" }}>{error}</p>
                <button
                  onClick={loadUsers}
                  style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    background: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="users-table-container">
                {users.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    <p
                      style={{
                        color: "#718096",
                        marginBottom: "1rem",
                        fontSize: "1rem",
                      }}
                    >
                      No users found in your tenant ({user?.tenantId})
                    </p>
                    <button
                      onClick={loadUsers}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Refresh
                    </button>
                  </div>
                ) : (
                  <>
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Tenant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td>{u.id.substring(0, 8)}...</td>
                            <td>
                              {u.name ||
                                u.email.split("@")[0].charAt(0).toUpperCase() +
                                  u.email.split("@")[0].slice(1)}
                            </td>
                            <td>
                              <a
                                href={`mailto:${u.email}`}
                                style={{
                                  color: "#667eea",
                                  textDecoration: "none",
                                }}
                              >
                                {u.email}
                              </a>
                            </td>
                            <td>
                              <span
                                style={{
                                  padding: "0.25rem 0.75rem",
                                  borderRadius: "12px",
                                  fontSize: "0.875rem",
                                  fontWeight: 600,
                                  backgroundColor:
                                    u.role === "admin" ? "#667eea" : "#e2e8f0",
                                  color:
                                    u.role === "admin" ? "#ffffff" : "#4a5568",
                                  textTransform: "uppercase",
                                }}
                              >
                                {u.role || "user"}
                              </span>
                            </td>
                            <td>
                              {u.tenantId === "tenant-a-id"
                                ? "Tenant A"
                                : u.tenantId === "tenant-b-id"
                                ? "Tenant B"
                                : u.tenantId}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div
                      style={{
                        marginTop: "1rem",
                        textAlign: "center",
                        color: "#718096",
                      }}
                    >
                      <p>Total Users: {users.length}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
