#!/bin/bash

cd "$(dirname "$0")"

# Config
git add package.json tsconfig.json tsconfig.node.json vite.config.ts index.html
git commit -m "Add TypeScript configuration"

git add src/main.tsx src/App.tsx
git commit -m "Convert main and App to TypeScript"

git add src/contexts/AuthContext.tsx src/contexts/ExpensesContext.tsx
git commit -m "Convert contexts to TypeScript"

git add src/hooks/useAuth.ts src/hooks/useExpenses.ts
git commit -m "Convert hooks to TypeScript"

git add src/services/firebase/init.ts src/utils/constants.ts
git commit -m "Convert services and utils to TypeScript"

git add src/pages/LoginPage.tsx src/pages/RegisterPage.tsx
git commit -m "Convert auth pages to TypeScript"

git add src/pages/HomePage.tsx src/pages/ExpensesPage.tsx src/pages/CategoriesPage.tsx src/pages/ReportsPage.tsx
git commit -m "Convert app pages to TypeScript"

git add src/components/Expenses/ExpenseForm.tsx src/components/Expenses/ExpenseCard.tsx src/components/Expenses/ExpenseList.tsx
git commit -m "Convert expense components to TypeScript"

git add src/components/Charts/PieChart.tsx src/components/Charts/BarChart.tsx src/components/Charts/LineChart.tsx
git commit -m "Convert chart components to TypeScript"
