const db = require('../db')
const { hash, compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query('select * from users')

    return res.status(200).json({
      success: true,
      users: rows,
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.register = async (req, res) => {
  const { email, password } = req.body
  try {
    const hashedPassword = await hash(password, 10)

    await db.query('insert into users(email,password) values ($1 , $2)', [
      email,
      hashedPassword,
    ])

    return res.status(201).json({
      success: true,
      message: 'The registration was successfull',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.login = async (req, res) => {
  let user = req.user
  let payload = {
    id: user.user_id,
    email: user.email,
  }

  try {
    const token = await sign(payload, SECRET)

    return res.status(200).cookie('token', token, { httpOnly: true }).json({
      success: true,
      message: 'Logged in successfully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.protected = async (req, res) => {
  let user = req.user;
  let id = user.id;

  try {
    const { rows: userData } = await db.query('SELECT * FROM users WHERE user_id = $1', [id]);

    const { user_id, created_at, email} = userData[0];

    const { rows: accountData } = await db.query('SELECT * FROM accounts WHERE user_id = $1', [id]);

    const accounts = {};
    for (const account of accountData) {
      accounts[account.account_name] = {
        account_id:account.account_id,
        user_id:account.user_id,
        expenses: [],
        incomes: []
      };
    }

    for (const account of accountData) {
      const { rows: expenseData } = await db.query('SELECT * FROM expenses WHERE account_id = $1 ORDER BY expense_date DESC', [account.account_id]);
      for (const expense of expenseData) {
        accounts[account.account_name].expenses.push({
          expense_id:expense.expense_id,
          name: expense.expense_name,
          amount: expense.amount,
          date: expense.expense_date
        });
      }
    }

    for (const account of accountData) {
      const { rows: incomeData } = await db.query('SELECT * FROM incomes WHERE account_id = $1 ORDER BY income_date DESC', [account.account_id]);
      for (const income of incomeData) {
        accounts[account.account_name].incomes.push({
          income_id:income.income_id,
          name: income.income_name,
          amount: income.amount,
          date: income.income_date
        });
      }
    }


    return res.status(200).json({
      user_id: user_id,
      created_at: created_at,
      email: email,
      accounts: accounts
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.deleteItem = async (req, res) => {
  const { itemType, itemId, userId } = req.body;
  console.log('Received delete request:', { itemType, itemId , userId }); 


  try {
    switch (itemType) {
      case 'account':
        await db.query('DELETE FROM incomes WHERE account_id IN (SELECT account_id FROM accounts WHERE account_id = $1 AND user_id = $2)', [itemId, userId]);
        await db.query('DELETE FROM expenses WHERE account_id IN (SELECT account_id FROM accounts WHERE account_id = $1 AND user_id = $2)', [itemId, userId]);
        await db.query('DELETE FROM accounts WHERE account_id = $1 AND user_id = $2', [itemId, userId]);
        return res.status(200).json({ success: true, message: 'Account and associated incomes/expenses deleted successfully' });
      case 'income':
        await db.query('DELETE FROM incomes WHERE income_id = $1', [itemId]);
        return res.status(200).json({ success: true, message: 'Income deleted successfully' });
      case 'expense':
        await db.query('DELETE FROM expenses WHERE expense_id = $1', [itemId]);
        return res.status(200).json({ success: true, message: 'Expense deleted successfully' });
      case 'user':
        await db.query('DELETE FROM incomes WHERE account_id IN (SELECT account_id FROM accounts WHERE user_id = $1)', [userId]);
        await db.query('DELETE FROM expenses WHERE account_id IN (SELECT account_id FROM accounts WHERE user_id = $1)', [userId]);
        await db.query('DELETE FROM accounts WHERE user_id = $1', [userId]);
        await db.query('DELETE FROM users WHERE user_id = $1', [userId]);
        return res.status(200).json({ success: true, message: 'User and all associated data deleted successfully' });
      default:
        return res.status(400).json({ error: 'Invalid item type' });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addItem = async (req, res) => {
  const { itemType, accountId, userId, itemId, amount } = req.body;
  console.log('Received add request:', { itemType, accountId, userId, itemId, amount }); 


  try {
    switch (itemType) {
      case 'expense':
        await db.query('INSERT INTO expenses (expense_name, amount, account_id) VALUES ($1, $2, $3)', [itemId, amount, accountId]);
        return res.status(200).json({ success: true, message: 'Expense added successfully' });
      case 'income':
        await db.query('INSERT INTO incomes (income_name, amount, account_id) VALUES ($1, $2, $3)', [itemId, amount, accountId]);
        return res.status(200).json({ success: true, message: 'Income added successfully' });
      case 'account':
        await db.query('INSERT INTO accounts (account_name, user_id) VALUES ($1, $2)', [itemId, userId]);
        return res.status(200).json({ success: true, message: 'Account added successfully' });
      default:
        return res.status(400).json({ error: 'Invalid item type' });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    const user = rows[0];

    const passwordMatch = await compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    const hashedNewPassword = await hash(newPassword, 10);
    await db.query('UPDATE users SET password = $1 WHERE user_id = $2', [hashedNewPassword, userId]);

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.exportAccounts = async (req, res) => {
  let user = req.user;
  let userId = user.id;

  try {
    const { rows: accountData } = await db.query('SELECT * FROM accounts WHERE user_id = $1', [userId]);

    const accounts = {};
    for (const account of accountData) {
      accounts[account.account_name] = {
        account_id: account.account_id,
        user_id: account.user_id,
        expenses: [],
        incomes: []
      };
    }

    for (const account of accountData) {
      const { rows: expenseData } = await db.query('SELECT * FROM expenses WHERE account_id = $1 ORDER BY expense_date DESC', [account.account_id]);
      for (const expense of expenseData) {
        accounts[account.account_name].expenses.push({
          expense_id: expense.expense_id,
          name: expense.expense_name,
          amount: expense.amount,
          date: expense.expense_date
        });
      }
    }

    for (const account of accountData) {
      const { rows: incomeData } = await db.query('SELECT * FROM incomes WHERE account_id = $1 ORDER BY income_date DESC', [account.account_id]);
      for (const income of incomeData) {
        accounts[account.account_name].incomes.push({
          income_id: income.income_id,
          name: income.income_name,
          amount: income.amount,
          date: income.income_date
        });
      }
    }

    return res.status(200).json({
      success: true,
      accounts: accounts
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie('token', { httpOnly: true }).json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}
