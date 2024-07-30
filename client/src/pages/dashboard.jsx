import React, { useEffect, useState } from 'react';
import { fetchProtectedInfo } from '../api/export';
import { Link, Navigate, Routes, Route } from 'react-router-dom';
import Settings from './settings';
import Overview from './overview';
import Analytics from './analytics';
import '../public/dashboard.css'

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState({});

  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo();
  
      const { user_id, email, accounts } = data; 
      console.log(data);
  
      setProtectedData({
        user_id,
        email,
        accounts
      });
      setLoading(false);
    } catch (error) {
      logout(); 
    }
    console.log(protectedData);
  };

  useEffect(() => {
    protectedInfo();
  }, []);

  return loading ? (
      <h1>Loading...</h1>
  ) : (
    <div>
        <div className="dashboard-container">
          <div className="sidebar">
            <ul>
              <li><Link to="/dashboard/overview">Overview</Link></li>
              <li><Link to="/dashboard/analytics">Analytics</Link></li>
              <li><Link to="/dashboard/settings">Settings</Link></li>
            </ul>
          </div>
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
              <Route path="/overview" element={<Overview protectedData={protectedData} />} /> 
              <Route path="/analytics" element={<Analytics protectedData={protectedData} />} />
              <Route path="/settings" element={<Settings protectedData={protectedData} />} />
            </Routes>
          </div>
        </div>
    </div>
  );
};

export const calculateTotalBalance = (protectedData) => {
  let totalBalance = 0;
  for (const accountName in protectedData.accounts) {
    console.log(accountName)
    const accountInfo = protectedData.accounts[accountName];

    let totalExpenses = 0;
    for (const expense of accountInfo.expenses) {
      totalExpenses += Number(expense.amount);
    }

    let totalIncomes = 0;
    for (const income of accountInfo.incomes) {
      totalIncomes += Number(income.amount);
    }

    const accountBalance = totalIncomes - totalExpenses;
    totalBalance += accountBalance;
  }

  return totalBalance;
};

export default Dashboard;