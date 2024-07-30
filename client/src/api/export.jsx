import axios from 'axios'
axios.defaults.withCredentials = true

export async function onRegistration(registrationData) {
  return await axios.post(
    'http://localhost:8000/api/register',
    registrationData
  )
}

export async function onLogin(loginData) {
  return await axios.post('http://localhost:8000/api/login', loginData)
}

export async function onLogout() {
  return await axios.get('http://localhost:8000/api/logout')
}

export async function fetchProtectedInfo() {
  return await axios.get('http://localhost:8000/api/protected')
}
export async function onDeleteUser(user_id) {
  try {
    const response = await axios.delete(`http://localhost:8000/api/deleteItem`, {
      data: { itemType: 'user', userId: user_id }
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
}
export async function onDeleteAccount(account_id , user_id) {
  try {
    const response = await axios.delete(`http://localhost:8000/api/deleteItem`, {
      data: { itemType: 'account', itemId: account_id , userId: user_id }
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
}

export async function onDeleteIncome(income_id) {
  try {
    const response = await axios.delete(`http://localhost:8000/api/deleteItem`, {
      data: { itemType: 'income', itemId: income_id }
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
}

export async function onDeleteExpense(expense_id) {
  try {
    const response = await axios.delete(`http://localhost:8000/api/deleteItem`, {
      data: { itemType: 'expense', itemId: expense_id }
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
}
export async function onAddItem(itemType, accountId, userId, itemId, amount) {
  try {
    const response = await axios.post('http://localhost:8000/api/addItem', {
      itemType,
      accountId,
      userId,
      itemId,
      amount,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
}
export async function onChangePassword(userId, oldPassword, newPassword) {
  try {
    const response = await axios.post('http://localhost:8000/api/changePassword', {
      userId,
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
}
export async function exportAccounts() {
  return await axios.get('http://localhost:8000/api/export-accounts');
}