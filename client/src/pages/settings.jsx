import React, { useState } from 'react';
import { onDeleteUser, onLogout, onChangePassword, exportAccounts } from '../api/export'; 
import '../public/A.css'; 

const Settings = ({ protectedData }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [exportError, setExportError] = useState('');

  const handleDeleteClick = () => {
    setShowWarning(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await onDeleteUser(protectedData.user_id);
      await onLogout();
      localStorage.removeItem('isAuth');
      setShowWarning(false);
      window.location.reload();
    } catch (error) {
      alert(`Error deleting user: ${error}`);
    }
  };

  const handleCancelDelete = () => {
    setShowWarning(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      if (newPassword.length < 6 || newPassword.length > 15) {
        setChangePasswordError('Password has to be between 6 and 15 characters.');
        setChangePasswordSuccess(false);
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setChangePasswordError('New passwords do not match');
        setChangePasswordSuccess(false);
        return;
      }

      await onChangePassword(protectedData.user_id, oldPassword, newPassword);
      setChangePasswordSuccess(true);
      setChangePasswordError('');
      window.location.reload(); 
    } catch (error) {
      if (error === 'Old password is incorrect') {
        setChangePasswordError('Old password is incorrect');
      } else {
        setChangePasswordError(error);
      }
      setChangePasswordSuccess(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await exportAccounts();
      const blob = new Blob([JSON.stringify(response.data.accounts)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'accounts_data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setExportError('');
    } catch (error) {
      setExportError('Failed to export data');
    }
  };

  return (
    <div className="Acontainer">
      <h1>Account Settings</h1>
      <div className="section">
        <h2>Delete User</h2>
        <div className="delete-section">
          <p>If you delete your account, all your data will be lost permanently. Please proceed with caution.</p>
          <button className="delete-button" onClick={handleDeleteClick}>Delete User</button>
        </div>
        {showWarning && (
          <div className="warning">
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            <button className="confirm-button" onClick={handleConfirmDelete}>Yes, Delete</button>
            <button className="cancel-button" onClick={handleCancelDelete}>Cancel</button>
          </div>
        )}
      </div>
      <div className="section">
        <h2>Change Password</h2>
        <p>To ensure the security of your account, choose a strong password that you don't use elsewhere.</p>
        <form onSubmit={handleChangePassword}>
          {changePasswordSuccess && <p className="success-message">Password changed successfully</p>}
          {changePasswordError && <p className="error-message">{changePasswordError}</p>}
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            autoComplete="current-password" 
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password" 
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            autoComplete="new-password" 
          />
          <button type="submit" className="change-password-button">Change Password</button>
        </form>
      </div>
      <div className="section">
        <h2>Export Accounts Data</h2>
        <button className="export-button" onClick={handleExportData}>Export Data</button>
        {exportError && <p className="error-message">{exportError}</p>}
      </div>
    </div>
  );
};

export default Settings;
