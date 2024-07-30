CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE
);
CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    account_name VARCHAR(50)
);
CREATE TABLE incomes (
    income_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(account_id),
    income_name VARCHAR(100),
    amount NUMERIC,
    income_date DATE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(account_id),
    expense_name VARCHAR(100),
    amount NUMERIC,
    expense_date DATE DEFAULT CURRENT_TIMESTAMP
);