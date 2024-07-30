import React, { useState ,useEffect } from 'react';
import { onDeleteAccount, onDeleteExpense, onDeleteIncome, onAddItem } from '../api/export';
import { calculateTotalBalance } from './dashboard';
import '../public/D.css';

const ModalPrompt = ({ isVisible, onClose, onSubmit, title, hasAmount }) => {
  const [inputValue, setInputValue] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isVisible) {
      setInputValue('');
      setAmount('');
    }
  }, [isVisible]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputValue, hasAmount ? parseFloat(amount) : null);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
          </label>
          {hasAmount && (
            <label>
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </label>
          )}
          <div className="modal-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Overview = ({ protectedData }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [itemType, setItemType] = useState('');
  const [hasAmount, setHasAmount] = useState(false);

  const handleAccountClick = (accountName) => {
    setSelectedAccount(accountName === selectedAccount ? null : accountName);
  };

  const handleDeleteAccount = async (accountName) => {
    try {
      const accountId = protectedData.accounts[accountName].account_id;
      const userId = protectedData.accounts[accountName].user_id;
      console.log("Deleting account with ID:", accountId);
      const response = await onDeleteAccount(accountId, userId);
      location.reload();
      console.log("Account deletion response:", response);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleDeleteExpense = async (accountName, expenseId) => {
    try {
      const accountId = protectedData.accounts[accountName].account_id;
      console.log("Deleting expense with ID:", expenseId, "from account ID:", accountId);
      const response = await onDeleteExpense(expenseId);
      location.reload();
      console.log("Expense deletion response:", response);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleDeleteIncome = async (accountName, incomeId) => {
    try {
      const accountId = protectedData.accounts[accountName].account_id;
      console.log("Deleting income with ID:", incomeId, "from account ID:", accountId);
      const response = await onDeleteIncome(incomeId);
      location.reload();
      console.log("Income deletion response:", response);
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  };

  const handleAddItemClick = (type, accountName = null) => {
    setItemType(type);
    setModalTitle(`Enter ${type === 'account' ? 'Account Name' : 'Item Name'}`);
    if (type === 'account') {
      setHasAmount(false);
    } else {
      setHasAmount(true);
    }
    setSelectedAccount(accountName);
    setModalVisible(true);
  };

  const handleAddItem = async (itemName, amount) => {
    try {
      const userId = protectedData.user_id;
      const accountId = itemType !== 'account' ? protectedData.accounts[selectedAccount].account_id : null;
      const response = await onAddItem(itemType, accountId, userId, itemName, amount);
      location.reload();
      console.log(`${itemType} addition response:`, response);
    } catch (error) {
      console.error(`Error adding ${itemType}:`, error);
    }
  };

  return (
    <div className="Dpage">
      <section className='tex'>
        <h1>Accounts</h1>
        <p>This page displays a list of accounts associated with your profile. 
        You can add new accounts, manage existing ones, and track your financial transactions here.</p>
      </section>
      <section className='D-container'>
        <div className='balance'>
          <h3 style={{ display: "inline-block", marginRight: 15 }}>
          Total balance: {calculateTotalBalance(protectedData)} RON</h3>
          <button className="addButton" onClick={() => handleAddItemClick('account')}>Add Account</button>
        </div>

        <ul>
          {(() => {
            const listItems = [];
            for (const accountName in protectedData.accounts) {
              if (protectedData.accounts.hasOwnProperty(accountName)) {
                const accountInfo = protectedData.accounts[accountName];
                let totalExpenses = 0;
                for (const expense of accountInfo.expenses) {
                  totalExpenses += Number(expense.amount);
                }
                let totalIncomes = 0;
                for (const income of accountInfo.incomes) {
                  totalIncomes += Number(income.amount);
                }

                listItems.push(
                  <li key={accountName} onClick={() => handleAccountClick(accountName)}>
                    <h3 style={{ display: 'inline-block', marginRight: 22 }}> {accountName} {totalIncomes - totalExpenses} RON</h3>
                    <button className='deleteButton' onClick={() => handleDeleteAccount(accountName)}>Delete Account</button>
                    <button className='addButton' onClick={() => handleAddItemClick('income', accountName)}>Add Income</button>
                    <button className='addButton' onClick={() => handleAddItemClick('expense', accountName)}>Add Expense</button>
                    {selectedAccount === accountName && (
                      <div style={{ marginTop: 15 }}>
                        <h4>Expenses: {totalExpenses}</h4>
                        <ul>
                          {(() => {
                            const expenseItems = [];
                            for (let i = 0; i < accountInfo.expenses.length; i++) {
                              const expense = accountInfo.expenses[i];
                              expenseItems.push(
                                <li key={i}>
                                  <p className='Dp'>
                                    {expense.name} - Amount: {expense.amount}, 
                                    Date: {new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </p>
                                  <button className='deleteButton' onClick={() => handleDeleteExpense(accountName, expense.expense_id)}>Delete</button>
                                </li>
                              );
                            }
                            return expenseItems;
                          })()}
                        </ul>
                        <h4>Incomes: {totalIncomes}</h4>
                        <ul>
                          {(() => {
                            const incomeItems = [];
                            for (let i = 0; i < accountInfo.incomes.length; i++) {
                              const income = accountInfo.incomes[i];
                              incomeItems.push(
                                <li key={i}>
                                  <p className='Dp'>
                                    {income.name} - Amount: {income.amount}, 
                                    Date: {new Date(income.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </p>
                                  <button className='deleteButton' onClick={() => handleDeleteIncome(accountName, income.income_id)}>Delete</button>
                                </li>
                              );
                            }
                            return incomeItems;
                          })()}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              }
            }
            return listItems;
          })()}
        </ul>
      </section>
      <ModalPrompt
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddItem}
        title={modalTitle}
        hasAmount={hasAmount}
      />
    </div>
  );
};

export default Overview;
