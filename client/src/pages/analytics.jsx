import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'; 
import '../public/C.css'; 

const Analytics = ({ protectedData }) => {
  const chartRef1 = useRef(null); 
  const chartRef2 = useRef(null); 
  const chartRef3 = useRef(null); 
  const chartRef4 = useRef(null); 

  const [hasAccounts, setHasAccounts] = useState(true);
  const [totals, setTotals] = useState({});

  useEffect(() => {
  
    const accountNames = Object.keys(protectedData.accounts);
    if (accountNames.length === 0) {
      setHasAccounts(false);
      return;
    }

    const generateColors = (numColors) => {
      const colors = [
        'rgb(25, 99, 132)',
        'rgb(5, 162, 235)',
        'rgb(208, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 250)',
        'rgb(19, 159, 64)',
      ];
    
      const result = [];
      
      for (let i = 0; i < numColors; i++) {
        const color = colors[i % colors.length];
        result.push(color);
      }
      
      return result;
    };

    const accountBalances = [];
    for (let i = 0; i < accountNames.length; i++) {
      const accountName = accountNames[i];
      const accountInfo = protectedData.accounts[accountName];
    
      let totalExpenses = 0;
      for (let j = 0; j < accountInfo.expenses.length; j++) {
        totalExpenses += Number(accountInfo.expenses[j].amount);
      }
    
      let totalIncomes = 0;
      for (let k = 0; k < accountInfo.incomes.length; k++) {
        totalIncomes += Number(accountInfo.incomes[k].amount);
      }
    
      const balance = totalIncomes - totalExpenses;
      accountBalances.push(balance);
    }
    
    let totalAccountBalance = 0;
    for (let i = 0; i < accountBalances.length; i++) {
      totalAccountBalance += accountBalances[i];
    }
    

    const data1 = {
      labels: accountNames,
      datasets: [
        {
          label: 'Account Balances',
          data: accountBalances,
          backgroundColor: generateColors(accountNames.length),
        },
      ],
    };

    const myChart1 = new Chart(chartRef1.current, {
      type: 'bar',
      data: data1,
    });

    const totalExpensesData = [];

    for (let i = 0; i < accountNames.length; i++) {
      const accountName = accountNames[i];
      const accountInfo = protectedData.accounts[accountName];
      let totalExpenses = 0;

      for (let j = 0; j < accountInfo.expenses.length; j++) {
        totalExpenses += Number(accountInfo.expenses[j].amount);
      }

      totalExpensesData.push(totalExpenses);
    }

    let totalExpensesAmount = 0;

    for (let i = 0; i < totalExpensesData.length; i++) {
      totalExpensesAmount += totalExpensesData[i];
    }

    const data2 = {
      labels: accountNames,
      datasets: [
        {
          label: 'Total Expenses',
          data: totalExpensesData,
          backgroundColor: generateColors(accountNames.length),
        },
      ],
    };

    const myChart2 = new Chart(chartRef2.current, {
      type: 'pie',
      data: data2,
    });

    const totalIncomesData = [];

    for (let i = 0; i < accountNames.length; i++) {
      const accountName = accountNames[i];
      const accountInfo = protectedData.accounts[accountName];
      let totalIncomes = 0;

      for (let j = 0; j < accountInfo.incomes.length; j++) {
        totalIncomes += Number(accountInfo.incomes[j].amount);
      }

      totalIncomesData.push(totalIncomes);
    }

    let totalIncomesAmount = 0;

    for (let i = 0; i < totalIncomesData.length; i++) {
      totalIncomesAmount += totalIncomesData[i];
    }

    const data3 = {
      labels: accountNames,
      datasets: [
        {
          label: 'Total Incomes',
          data: totalIncomesData,
          backgroundColor: generateColors(accountNames.length),
        },
      ],
    };

    const myChart3 = new Chart(chartRef3.current, {
      type: 'pie',
      data: data3,
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let totalExpensesThisMonth = 0;
    let totalIncomesThisMonth = 0;
    
    const expensesThisMonth = [];
    const incomesThisMonth = [];
    
    for (let i = 0; i < accountNames.length; i++) {
      const accountName = accountNames[i];
      const accountInfo = protectedData.accounts[accountName];
    
      let monthlyExpenses = 0;
      for (let j = 0; j < accountInfo.expenses.length; j++) {
        const expense = accountInfo.expenses[j];
        const date = new Date(expense.date);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          monthlyExpenses += Number(expense.amount);
        }
      }
      expensesThisMonth.push(monthlyExpenses);
      totalExpensesThisMonth += monthlyExpenses;
    
      let monthlyIncomes = 0;
      for (let k = 0; k < accountInfo.incomes.length; k++) {
        const income = accountInfo.incomes[k];
        const date = new Date(income.date);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          monthlyIncomes += Number(income.amount);
        }
      }
      incomesThisMonth.push(monthlyIncomes);
      totalIncomesThisMonth += monthlyIncomes;
    }

    const data4 = {
      labels: accountNames,
      datasets: [
        {
          label: 'Expenses This Month',
          data: expensesThisMonth,
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Incomes This Month',
          data: incomesThisMonth,
          backgroundColor: 'rgb(54, 162, 235)',
        },
      ],
    };

    const myChart4 = new Chart(chartRef4.current, {
      type: 'bar',
      data: data4,
      options: {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });

    setTotals({
      totalAccountBalance,
      totalExpensesAmount,
      totalIncomesAmount,
      totalExpensesThisMonth,
      totalIncomesThisMonth,
    });
    

    return () => {
      myChart1.destroy();
      myChart2.destroy();
      myChart3.destroy();
      myChart4.destroy();
    };
  }, [protectedData]);
  
  const renderIndividualAccountCharts = () => {
    const accountNames = Object.keys(protectedData.accounts);
    const chartElements = [];
  
    for (let i = 0; i < accountNames.length; i++) {
      const accountName = accountNames[i];
      const chartRef = useRef(null); 
      const accountInfo = protectedData.accounts[accountName];
  
      let totalExpenses = 0;
      for (let j = 0; j < accountInfo.expenses.length; j++) {
        totalExpenses += Number(accountInfo.expenses[j].amount);
      }
  
      let totalIncomes = 0;
      for (let k = 0; k < accountInfo.incomes.length; k++) {
        totalIncomes += Number(accountInfo.incomes[k].amount);
      }
  
      const totalBalance = totalIncomes - totalExpenses;
  
      useEffect(() => {
        const data = {
          labels: ['Incomes', 'Expenses'],
          datasets: [
            {
              label: accountName,
              data: [totalIncomes, totalExpenses],
              backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
            },
          ],
        };
  
        const myChart = new Chart(chartRef.current, {
          type: 'bar',
          data,
        });
  
        return () => {
          myChart.destroy();
        };
      }, [accountInfo]);
  
      chartElements.push(
        <div className="individual-chart-wrapper" key={i}>
          <h2>{accountName}</h2>
          <p>Account Balance: ${totalBalance.toFixed(2)}</p>
          <div className="individual-chart">
            <canvas ref={chartRef} />
          </div>
        </div>
      );
    }
  
    return chartElements;
  };
  
  
  if (!hasAccounts) {
    return (
      <div className="Cpage">
        <section className="tex">
          <h1>Budget Manager Analytics</h1>
          <p>No accounts available. Please add some accounts to view analytics.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="Cpage">
      <section className="tex">
        <h1>Budget Manager Analytics</h1>
        <p>View detailed analytics of your budget and finances.</p>
      </section>

      <div className="chart-container">
        <div className="chart-wrapper">
          <h2>Account Balances</h2>
          <p>Total Balance: ${totals.totalAccountBalance?.toFixed(2)}</p>
          <div className="chart">
            <canvas ref={chartRef1} /> 
          </div>
        </div>
        <div className="chart-wrapper">
          <h2>Total Expenses</h2>
          <p>Total Expenses: ${totals.totalExpensesAmount?.toFixed(2)}</p>
          <div className="chart">
            <canvas ref={chartRef2} /> 
          </div>
        </div>
        <div className="chart-wrapper">
          <h2>Total Incomes</h2>
          <p>Total Incomes: ${totals.totalIncomesAmount?.toFixed(2)}</p>
          <div className="chart">
            <canvas ref={chartRef3} /> 
          </div>
        </div>
        <div className="chart-wrapper">
          <h2>Expenses and Incomes This Month</h2>
          <p>Total Expenses This Month: ${totals.totalExpensesThisMonth?.toFixed(2)}</p>
          <p>Total Incomes This Month: ${totals.totalIncomesThisMonth?.toFixed(2)}</p>
          <div className="chart">
            <canvas ref={chartRef4} /> 
          </div>
        </div>
      </div>

      <div className="individual-charts-container">
        {renderIndividualAccountCharts()} 
      </div>
    </div>
  );
};

export default Analytics;
