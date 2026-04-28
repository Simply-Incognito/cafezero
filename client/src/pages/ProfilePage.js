import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Loader from "../components/common/Loader";

const ProfilePage = () => {
  const { user: authUser, logout, updateMe } = useAuth();
  const { showToast } = useToast();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  // Edit Profile States
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  
  // Password States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/profile");
      const userData = res.data.data.user;
      setProfile(userData);
      setFirstname(userData.firstname);
      setLastname(userData.lastname);
      setEmail(userData.email);
      setGender(userData.gender || "");
      // Format date for input[type="date"]
      if (userData.dateOfBirth) {
        setDateOfBirth(new Date(userData.dateOfBirth).toISOString().split('T')[0]);
      }
    } catch (err) {
      showToast(err || "Failed to load profile details.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch("/user/profile/update", { firstname, lastname, email, gender, dateOfBirth });
      showToast("Profile updated successfully!");
      setEditing(false);
      
      // Update global auth state so Navbar initials etc. update immediately
      if (res.data.data.user) {
        updateMe(res.data.data.user);
      }
      
      fetchProfile();
    } catch (err) {
      console.error("Update failed:", err);
      showToast(err || "Failed to update profile.", "error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      return showToast("New passwords do not match!", "error");
    }
    try {
      await api.patch("/user/update-password", { 
        currentPassword, 
        password: newPassword, 
        confirmPassword: confirmNewPassword 
      });
      showToast("Password updated successfully!");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      showToast(err || "Failed to update password.", "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      try {
        await api.delete("/user/profile/delete");
        showToast("Your account has been deleted.");
        logout();
      } catch (err) {
        showToast(err || "Failed to delete account.", "error");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile?.firstname?.charAt(0)}{profile?.lastname?.charAt(0)}
          </div>
          <div className="profile-intro">
            <h1>{profile?.firstname} {profile?.lastname}</h1>
            <p className="role-badge">{profile?.role || 'Customer'}</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-header-flex">
              <h3>Personal Information</h3>
              {!editing && <button className="edit-btn-small" onClick={() => setEditing(true)}>Edit</button>}
            </div>

            {editing ? (
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="info-grid">
                  <div className="input-wrapper">
                    <label>First Name</label>
                    <input value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                  </div>
                  <div className="input-wrapper">
                    <label>Last Name</label>
                    <input value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                  </div>
                  <div className="input-wrapper">
                    <label>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="input-wrapper">
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="input-wrapper">
                    <label>Date of Birth</label>
                    <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="primary-btn-small">Save Changes</button>
                  <button type="button" className="cancel-btn-small" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="info-grid">
                <div className="info-item">
                  <label>First Name</label>
                  <p>{profile?.firstname}</p>
                </div>
                <div className="info-item">
                  <label>Last Name</label>
                  <p>{profile?.lastname}</p>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <p>{profile?.email}</p>
                </div>
                <div className="info-item">
                  <label>Gender</label>
                  <p>{profile?.gender || "Not specified"}</p>
                </div>
                <div className="info-item">
                  <label>Date of Birth</label>
                  <p>{profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not specified"}</p>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <p>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="profile-section">
            <h3>Account Security & Danger Zone</h3>
            <div className="action-buttons-list">
              <div className="action-card">
                <div className="action-info">
                  <h4>Change Password</h4>
                  <p>Update your account password regularly to stay secure.</p>
                </div>
                <button className="secondary-btn-small" onClick={() => setShowPasswordModal(true)}>Update Password</button>
              </div>

              <div className="action-card danger">
                <div className="action-info">
                  <h4>Delete Account</h4>
                  <p>Permanently remove your account and all associated data.</p>
                </div>
                <button className="danger-btn-small" onClick={handleDeleteAccount}>Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword} className="modal-form">
              <div className="input-wrapper">
                <label>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div className="input-wrapper">
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="input-wrapper">
                <label>Confirm New Password</label>
                <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn">Update Password</button>
                <button type="button" className="cancel-btn" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
