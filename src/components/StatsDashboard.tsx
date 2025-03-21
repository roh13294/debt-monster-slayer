
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegendContent, ChartLegend } from '@/components/ui/chart';
import { 
  ChartPie, 
  TrendingUp, 
  Wallet, 
  ArrowDownRight,
  CircleDollarSign
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

const StatsDashboard: React.FC = () => {
  const { debts, cash, budget, totalDebt, monthsPassed } = useGameContext();

  // Calculate total monthly payments
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  // Calculate debt distribution for pie chart
  const debtDistribution = debts.map(debt => ({
    name: debt.name,
    value: debt.amount,
    color: getColorByMonsterType(debt.monsterType)
  }));

  // Calculate budget distribution for pie chart
  const budgetDistribution = [
    { name: 'Essentials', value: budget.essentials, color: '#10b981' },
    { name: 'Debt Payments', value: budget.debt, color: '#f43f5e' },
    { name: 'Savings', value: budget.savings, color: '#3b82f6' }
  ];

  // Generate payment projection data
  const paymentProjection = generatePaymentProjection(debts, budget.debt, 12);

  // Generate monthly income vs. debt ratio data
  const incomeDebtRatio = generateIncomeDebtRatio(monthsPassed);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full opacity-40"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-100 rounded-full opacity-40"></div>
      
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Financial Analytics Dashboard
        </h2>
        <p className="text-gray-600">
          Visual insights into your financial journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Debt Distribution Chart */}
        <Card className="overflow-hidden transition-all hover:shadow-md bg-white/80 backdrop-blur-sm border-blue-100">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ChartPie size={16} className="text-primary" />
              <CardTitle className="text-lg">Debt Distribution</CardTitle>
            </div>
            <CardDescription>How your debt is distributed</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  "Credit Card Debt": { color: "#f43f5e" },
                  "Student Loan": { color: "#3b82f6" },
                  "Car Loan": { color: "#10b981" },
                  "Mortgage": { color: "#8b5cf6" },
                  "Medical Debt": { color: "#f59e0b" },
                  "Personal Loan": { color: "#ec4899" },
                  "Payday Loan": { color: "#ef4444" },
                  "Business Loan": { color: "#6366f1" }
                }}
              >
                <PieChart width={400} height={300}>
                  <Pie
                    data={debtDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={renderCustomizedLabel}
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {debtDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Budget Allocation Chart */}
        <Card className="overflow-hidden transition-all hover:shadow-md bg-white/80 backdrop-blur-sm border-blue-100">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-primary" />
              <CardTitle className="text-lg">Budget Allocation</CardTitle>
            </div>
            <CardDescription>How your income is distributed</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  "Essentials": { color: "#10b981" },
                  "Debt Payments": { color: "#f43f5e" },
                  "Savings": { color: "#3b82f6" }
                }}
              >
                <PieChart width={400} height={300}>
                  <Pie
                    data={budgetDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={renderCustomizedLabel}
                    animationBegin={200}
                    animationDuration={1500}
                  >
                    {budgetDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Debt Projection Chart */}
        <Card className="col-span-1 md:col-span-2 overflow-hidden transition-all hover:shadow-md bg-white/80 backdrop-blur-sm border-blue-100">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <CardTitle className="text-lg">Debt Projection</CardTitle>
            </div>
            <CardDescription>Estimated debt over the next 12 months</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  "Total Debt": { color: "#f43f5e" }
                }}
              >
                <AreaChart
                  width={500}
                  height={300}
                  data={paymentProjection}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="totalDebt" 
                    stroke="#f43f5e" 
                    fill="#f43f5e" 
                    fillOpacity={0.3}
                    name="Total Debt"
                    animationBegin={400}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Income to Debt Ratio */}
        <Card className="col-span-1 md:col-span-2 overflow-hidden transition-all hover:shadow-md bg-white/80 backdrop-blur-sm border-blue-100">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CircleDollarSign size={16} className="text-primary" />
              <CardTitle className="text-lg">Income to Debt Ratio</CardTitle>
            </div>
            <CardDescription>How your debt compares to your income over time</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  "Debt Payment": { color: "#f43f5e" },
                  "Income": { color: "#10b981" }
                }}
              >
                <BarChart
                  width={500}
                  height={300}
                  data={incomeDebtRatio}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Bar 
                    dataKey="debtPayment" 
                    name="Debt Payment" 
                    fill="#f43f5e"
                    animationBegin={600}
                    animationDuration={1500}
                  />
                  <Bar 
                    dataKey="income" 
                    name="Income" 
                    fill="#10b981"
                    animationBegin={800}
                    animationDuration={1500}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper functions
const getColorByMonsterType = (type: string): string => {
  switch (type) {
    case 'red': return '#f43f5e';
    case 'blue': return '#3b82f6';
    case 'green': return '#10b981';
    case 'purple': return '#8b5cf6';
    case 'yellow': return '#f59e0b';
    default: return '#6b7280';
  }
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const generatePaymentProjection = (debts: any[], monthlyPayment: number, months: number) => {
  let remainingDebts = [...debts];
  let result = [];
  let totalDebtAmount = remainingDebts.reduce((sum, debt) => sum + debt.amount, 0);
  
  result.push({
    month: 'Current',
    totalDebt: totalDebtAmount,
  });

  for (let i = 1; i <= months; i++) {
    // Apply interest
    remainingDebts = remainingDebts.map(debt => ({
      ...debt,
      amount: debt.amount * (1 + debt.interest / 1200) // Monthly interest
    }));

    // Make payments
    let remainingPayment = monthlyPayment;
    
    // Sort by strategy (snowball - smallest first)
    remainingDebts.sort((a, b) => a.amount - b.amount);
    
    // Apply payments
    remainingDebts = remainingDebts.map(debt => {
      const payment = Math.min(debt.minimumPayment, debt.amount, remainingPayment);
      remainingPayment -= payment;
      
      return {
        ...debt,
        amount: Math.max(0, debt.amount - payment)
      };
    });
    
    // Apply extra payment to the first debt
    if (remainingPayment > 0 && remainingDebts.length > 0) {
      remainingDebts[0] = {
        ...remainingDebts[0],
        amount: Math.max(0, remainingDebts[0].amount - remainingPayment)
      };
    }
    
    // Remove paid off debts
    remainingDebts = remainingDebts.filter(debt => debt.amount > 0);
    
    // Calculate total debt
    totalDebtAmount = remainingDebts.reduce((sum, debt) => sum + debt.amount, 0);
    
    result.push({
      month: `Month ${i}`,
      totalDebt: totalDebtAmount,
    });
  }
  
  return result;
};

const generateIncomeDebtRatio = (monthsPassed: number) => {
  const result = [];
  const monthsToShow = 6;
  const startMonth = Math.max(0, monthsPassed - monthsToShow + 1);
  
  for (let i = 0; i < monthsToShow; i++) {
    const month = startMonth + i;
    
    // Simulated data - in a real app, this would come from historical data
    const baseIncome = 3500;
    const baseDebtPayment = 600;
    
    // Add some variation to make the chart more interesting
    const income = baseIncome * (1 + (month * 0.01)); // Small income increase each month
    const debtPayment = baseDebtPayment * (1 - (month * 0.02)); // Small debt payment decrease
    
    result.push({
      month: `Month ${month}`,
      income: income,
      debtPayment: debtPayment
    });
  }
  
  return result;
};

export default StatsDashboard;
