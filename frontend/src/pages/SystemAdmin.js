import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

function SystemAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("drEmail") === null) navigate("/drlog");
  }, [navigate]);
  const [users, setUsers] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [resettingEmail, setResettingEmail] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const email = localStorage.getItem("drEmail");
    const role = localStorage.getItem("drRole");
    setUserEmail(email);
    setUserRole(role);

    // Fetch users
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/admin/users-overview`)
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // Reset password function - sets password to email
  const handleResetPassword = async (email, userType, userName) => {
    if (
      !window.confirm(
        `Reset password for ${email}?\n\nThe password will be set to their email address.`,
      )
    ) {
      return;
    }

    setResettingEmail(email);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/reset-password`,
        { email, userType, userName },
      );

      if (response.status === 200) {
        alert(
          `✅ Password reset successful!\n\nPassword for ${email} has been set to: ${email}\n\nPlease inform the user to login with their email as password.`,
        );
      }
    } catch (error) {
      console.error("Reset password error:", error);
      alert("❌ Failed to reset password. Please try again.");
    } finally {
      setResettingEmail(null);
    }
  };

  // Delete staff only (not couples)
  const handleDeleteStaff = (email, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete staff member: ${name || email}?\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingId(email);

    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/api/admin/delete-staff/${email}`,
      )
      .then(() => {
        setUsers(users.filter((u) => u.Email !== email));
        alert("✅ Staff member deleted successfully");
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("❌ Failed to delete staff member");
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  const staff = users.filter((u) => u.type?.toLowerCase().includes("doctor"));
  const couples = users.filter((u) => u.type?.toLowerCase().includes("couple"));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="System Administration"
        subtitle="Manage staff, reset passwords, and monitor system access"
        userEmail={userEmail}
        userRole={userRole}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm uppercase font-bold">
                  Total Staff
                </p>
                <p className="text-4xl font-bold mt-2">{staff.length}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm uppercase font-bold">
                  Registered Couples
                </p>
                <p className="text-4xl font-bold mt-2">{couples.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Section - Can Delete */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Medical Staff
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage staff accounts - reset passwords or remove access
              </p>
            </div>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              {staff.length} Total
            </span>
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {staff.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No staff members found.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {staff.map((u, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {u.Name?.charAt(0) || u.Email.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {u.Name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">{u.Email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {u.Role || "Staff"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Reset Password Button for Staff */}
                      <button
                        onClick={() =>
                          handleResetPassword(u.Email, "staff", u.Name)
                        }
                        disabled={resettingEmail === u.Email}
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resettingEmail === u.Email ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Resetting...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                              />
                            </svg>
                            <span>Reset Password</span>
                          </>
                        )}
                      </button>

                      {/* Delete Staff Button */}
                      <button
                        onClick={() => handleDeleteStaff(u.Email, u.Name)}
                        disabled={deletingId === u.Email}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === u.Email ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Couples Section - Only Reset Password (sets password to email) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Registered Couples
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Reset couple passwords - password will be set to their email
                address
              </p>
            </div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              {couples.length} Total
            </span>
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {couples.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No couples registered yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {couples.map((u, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {u.Email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.Email}</p>
                        <p className="text-sm text-gray-500">Registered User</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs">
                          Couple Account
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Only Reset Password Button for Couples - sets password to their email */}
                      <button
                        onClick={() =>
                          handleResetPassword(u.Email, "couple", null)
                        }
                        disabled={resettingEmail === u.Email}
                        className="bg-orange-50 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resettingEmail === u.Email ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                            <span>Resetting...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                              />
                            </svg>
                            <span>Reset Password</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="text-blue-600 text-xl">ℹ️</div>
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Admin Permissions
              </p>
              <p className="text-xs text-blue-600 mt-1">
                • You can delete staff members only (doctors, researchers,
                consultants)
                <br />
                • Password reset for couples sets their password to their email
                address
                <br />
                • Password reset for staff generates a random temporary password
                <br />• Couple accounts cannot be deleted from the admin panel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemAdmin;
