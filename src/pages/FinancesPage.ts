import m from 'mithril';
import cx from 'classnames';
import './FinancesPage.css';
import { State } from '../state';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import { SegmentedButtonGroup, SegmentedButton } from '../components/SegmentedButton';
import Input from '../components/Input';
import Select from '../components/Select';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import MenuBar from '../components/MenuBar';
import Table from '../components/Table';
import NumberInput from '../components/NumberInput';
import { SplitPanel } from '../components/SplitPanel';

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  account: string;
}

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  icon: string;
}

interface Budget {
  category: string;
  allocated: number;
  spent: number;
  icon: string;
}

// Initialize state
State.finances = State.finances || {
  view: 'transactions',
  selectedAccount: 'all',
  collapsedGroups: {} as Record<string, boolean>,
  pivotGroupBy: 'category',
  accounts: [
    {
      id: 'checking',
      name: 'Main Checking',
      type: 'checking',
      balance: 4250.0,
      icon: 'account_balance',
    },
    { id: 'savings', name: 'Savings', type: 'savings', balance: 12500.0, icon: 'savings' },
    { id: 'credit', name: 'Credit Card', type: 'credit', balance: -1820.5, icon: 'credit_card' },
    {
      id: 'investment',
      name: 'Investment',
      type: 'investment',
      balance: 45200.0,
      icon: 'trending_up',
    },
  ] as Account[],
  transactions: [
    {
      id: 1,
      date: '2024-12-20',
      description: 'Salary Deposit',
      category: 'Income',
      amount: 5200,
      type: 'income',
      account: 'checking',
    },
    {
      id: 2,
      date: '2024-12-19',
      description: 'Grocery Store',
      category: 'Groceries',
      amount: -127.43,
      type: 'expense',
      account: 'credit',
    },
    {
      id: 3,
      date: '2024-12-18',
      description: 'Electric Bill',
      category: 'Utilities',
      amount: -142.0,
      type: 'expense',
      account: 'checking',
    },
    {
      id: 4,
      date: '2024-12-17',
      description: 'Coffee Shop',
      category: 'Dining',
      amount: -8.5,
      type: 'expense',
      account: 'credit',
    },
    {
      id: 5,
      date: '2024-12-16',
      description: 'Gas Station',
      category: 'Transport',
      amount: -52.0,
      type: 'expense',
      account: 'credit',
    },
    {
      id: 6,
      date: '2024-12-15',
      description: 'Freelance Payment',
      category: 'Income',
      amount: 850,
      type: 'income',
      account: 'checking',
    },
    {
      id: 7,
      date: '2024-12-14',
      description: 'Netflix',
      category: 'Entertainment',
      amount: -15.99,
      type: 'expense',
      account: 'credit',
    },
    {
      id: 8,
      date: '2024-12-13',
      description: 'Restaurant',
      category: 'Dining',
      amount: -64.0,
      type: 'expense',
      account: 'credit',
    },
    {
      id: 9,
      date: '2024-12-12',
      description: 'Transfer to Savings',
      category: 'Transfer',
      amount: -500,
      type: 'expense',
      account: 'checking',
    },
    {
      id: 10,
      date: '2024-12-12',
      description: 'Transfer from Checking',
      category: 'Transfer',
      amount: 500,
      type: 'income',
      account: 'savings',
    },
  ] as Transaction[],
  budgets: [
    { category: 'Groceries', allocated: 600, spent: 423, icon: 'shopping_cart' },
    { category: 'Dining', allocated: 300, spent: 285, icon: 'restaurant' },
    { category: 'Transport', allocated: 400, spent: 312, icon: 'directions_car' },
    { category: 'Utilities', allocated: 250, spent: 142, icon: 'bolt' },
    { category: 'Entertainment', allocated: 150, spent: 89, icon: 'movie' },
    { category: 'Shopping', allocated: 200, spent: 167, icon: 'shopping_bag' },
  ] as Budget[],
  newTransaction: {
    description: '',
    amount: 0,
    category: 'Groceries',
    type: 'expense',
    account: 'checking',
  },
};

const MainSplit = SplitPanel();
const TransactionTable = Table<Transaction>();

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function AccountsSidebar(): m.Component {
  return {
    view() {
      const accounts = State.finances.accounts;
      const totalBalance = accounts.reduce((sum: number, acc: Account) => sum + acc.balance, 0);

      return m('.accounts-sidebar', [
        m('.net-worth', [
          m('.net-worth-label', 'Net Worth'),
          m('.net-worth-value', formatCurrency(totalBalance)),
        ]),
        m('.accounts-list', [
          m(
            '.account-item',
            {
              class: cx({ selected: State.finances.selectedAccount === 'all' }),
              onclick: () => (State.finances.selectedAccount = 'all'),
            },
            [
              m('span.material-symbols-outlined', 'account_balance_wallet'),
              m('.account-info', [m('.account-name', 'All Accounts')]),
            ]
          ),
          ...accounts.map((acc: Account) =>
            m(
              '.account-item',
              {
                class: cx({ selected: State.finances.selectedAccount === acc.id }),
                onclick: () => (State.finances.selectedAccount = acc.id),
              },
              [
                m('span.material-symbols-outlined', acc.icon),
                m('.account-info', [
                  m('.account-name', acc.name),
                  m(
                    '.account-balance',
                    { class: cx({ negative: acc.balance < 0 }) },
                    formatCurrency(acc.balance)
                  ),
                ]),
              ]
            )
          ),
        ]),
      ]);
    },
  };
}

function TransactionsView(): m.Component {
  return {
    view() {
      const selectedAccount = State.finances.selectedAccount;
      const transactions = State.finances.transactions.filter(
        (t: Transaction) => selectedAccount === 'all' || t.account === selectedAccount
      );

      return m('.transactions-view', [
        m('.transactions-header', [
          m('.transactions-title', 'Transactions'),
          m('.transactions-actions', [
            m(Input, { icon: 'search', placeholder: 'Search...' }),
            m(Button, { icon: 'filter_list' }, 'Filter'),
            m(Button, { icon: 'add', variant: 'primary' }, 'Add'),
          ]),
        ]),
        m('.transactions-table', [
          m(TransactionTable, {
            columns: [
              { header: 'Date', key: 'date', width: '100px' },
              { header: 'Description', key: 'description' },
              {
                header: 'Category',
                render: (row) =>
                  m('.category-badge', [
                    m('span.material-symbols-outlined', getCategoryIcon(row.category)),
                    row.category,
                  ]),
              },
              {
                header: 'Amount',
                width: '120px',
                render: (row) =>
                  m(
                    'span.amount',
                    { class: cx({ income: row.amount > 0, expense: row.amount < 0 }) },
                    formatCurrency(row.amount)
                  ),
              },
            ],
            data: transactions,
            rowKey: (row) => row.id,
          }),
        ]),
      ]);
    },
  };
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Income: 'payments',
    Groceries: 'shopping_cart',
    Dining: 'restaurant',
    Transport: 'directions_car',
    Utilities: 'bolt',
    Entertainment: 'movie',
    Shopping: 'shopping_bag',
    Transfer: 'swap_horiz',
  };
  return icons[category] || 'receipt';
}

function BudgetsView(): m.Component {
  return {
    view() {
      const budgets = State.finances.budgets;
      const totalAllocated = budgets.reduce((sum: number, b: Budget) => sum + b.allocated, 0);
      const totalSpent = budgets.reduce((sum: number, b: Budget) => sum + b.spent, 0);

      return m('.budgets-view', [
        m('.budgets-header', [
          m('.budgets-title', 'Monthly Budget'),
          m('.budgets-summary', [
            m('span', `${formatCurrency(totalSpent)} of ${formatCurrency(totalAllocated)} spent`),
            m(
              Badge,
              { variant: totalSpent / totalAllocated > 0.9 ? 'warning' : 'success' },
              `${Math.round((totalSpent / totalAllocated) * 100)}%`
            ),
          ]),
        ]),
        m('.budgets-grid', [
          ...budgets.map((budget: Budget) => {
            const percent = (budget.spent / budget.allocated) * 100;
            const variant = percent > 100 ? 'error' : percent > 80 ? 'warning' : undefined;
            const remaining = budget.allocated - budget.spent;

            return m('.budget-card', [
              m('.budget-header', [
                m('.budget-icon', m('span.material-symbols-outlined', budget.icon)),
                m('.budget-info', [
                  m('.budget-category', budget.category),
                  m('.budget-amounts', [
                    m('span.spent', formatCurrency(budget.spent)),
                    m('span.separator', '/'),
                    m('span.allocated', formatCurrency(budget.allocated)),
                  ]),
                ]),
              ]),
              m(ProgressBar, { value: Math.min(percent, 100), variant }),
              m(
                '.budget-remaining',
                { class: cx({ over: remaining < 0 }) },
                remaining >= 0
                  ? `${formatCurrency(remaining)} left`
                  : `${formatCurrency(-remaining)} over`
              ),
            ]);
          }),
        ]),
      ]);
    },
  };
}

function OverviewView(): m.Component {
  return {
    view() {
      const accounts = State.finances.accounts;
      const transactions = State.finances.transactions;

      const thisMonthIncome = transactions
        .filter((t: Transaction) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      const thisMonthExpenses = transactions
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0);

      return m('.overview-view', [
        m('.overview-cards', [
          m('.overview-card.income', [
            m('.card-icon', m('span.material-symbols-outlined', 'arrow_downward')),
            m('.card-content', [
              m('.card-label', 'Income'),
              m('.card-value', formatCurrency(thisMonthIncome)),
            ]),
          ]),
          m('.overview-card.expenses', [
            m('.card-icon', m('span.material-symbols-outlined', 'arrow_upward')),
            m('.card-content', [
              m('.card-label', 'Expenses'),
              m('.card-value', formatCurrency(thisMonthExpenses)),
            ]),
          ]),
          m('.overview-card.savings', [
            m('.card-icon', m('span.material-symbols-outlined', 'savings')),
            m('.card-content', [
              m('.card-label', 'Saved'),
              m('.card-value', formatCurrency(thisMonthIncome - thisMonthExpenses)),
            ]),
          ]),
        ]),
        m('.overview-sections', [
          m('.overview-section', [
            m('.section-header', 'Recent Transactions'),
            m('.recent-list', [
              ...transactions
                .slice(0, 5)
                .map((t: Transaction) =>
                  m('.recent-item', [
                    m('.recent-icon', m('span.material-symbols-outlined', getCategoryIcon(t.category))),
                    m('.recent-info', [
                      m('.recent-desc', t.description),
                      m('.recent-date', t.date),
                    ]),
                    m(
                      '.recent-amount',
                      { class: cx({ income: t.amount > 0, expense: t.amount < 0 }) },
                      formatCurrency(t.amount)
                    ),
                  ])
                ),
            ]),
          ]),
          m('.overview-section', [
            m('.section-header', 'Spending by Category'),
            m('.spending-bars', [
              ...State.finances.budgets
                .slice(0, 4)
                .map((b: Budget) =>
                  m('.spending-item', [
                    m('.spending-label', [m('span.material-symbols-outlined', b.icon), m('span', b.category)]),
                    m('.spending-bar-container', [
                      m('.spending-bar', { style: { width: `${(b.spent / b.allocated) * 100}%` } }),
                    ]),
                    m('.spending-value', formatCurrency(b.spent)),
                  ])
                ),
            ]),
          ]),
        ]),
      ]);
    },
  };
}

interface GroupedData {
  category: string;
  transactions: Transaction[];
  total: number;
  count: number;
}

function PivotView(): m.Component {
  function toggleGroup(category: string): void {
    State.finances.collapsedGroups[category] = !State.finances.collapsedGroups[category];
  }

  function expandAll(): void {
    State.finances.collapsedGroups = {};
  }

  function collapseAll(): void {
    const groups = getGroupedTransactions();
    groups.forEach((g) => {
      State.finances.collapsedGroups[g.category] = true;
    });
  }

  function getGroupedTransactions(): GroupedData[] {
    const selectedAccount = State.finances.selectedAccount;
    const transactions = State.finances.transactions.filter(
      (t: Transaction) => selectedAccount === 'all' || t.account === selectedAccount
    );

    // Group by category
    const grouped: Record<string, Transaction[]> = {};
    transactions.forEach((t: Transaction) => {
      if (!grouped[t.category]) {
        grouped[t.category] = [];
      }
      grouped[t.category].push(t);
    });

    // Convert to array with totals
    return Object.entries(grouped)
      .map(([category, txns]) => ({
        category,
        transactions: txns,
        total: txns.reduce((sum, t) => sum + t.amount, 0),
        count: txns.length,
      }))
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
  }

  return {
    view() {
      const groups = getGroupedTransactions();
      const grandTotal = groups.reduce((sum, g) => sum + g.total, 0);

      return m('.pivot-view', [
        m('.pivot-header', [
          m('.pivot-title', 'Transaction Analysis'),
          m('.pivot-actions', [
            m(Select, {
              value: State.finances.pivotGroupBy,
              options: [
                { value: 'category', label: 'Group by Category' },
                { value: 'account', label: 'Group by Account' },
                { value: 'type', label: 'Group by Type' },
              ],
              onchange: (v: string) => (State.finances.pivotGroupBy = v),
            }),
            m(Button, { icon: 'unfold_more', onclick: expandAll, tooltip: 'Expand All' }),
            m(Button, { icon: 'unfold_less', onclick: collapseAll, tooltip: 'Collapse All' }),
          ]),
        ]),
        m('.pivot-table', [
          m('.pivot-table-header', [
            m('.pivot-cell.expand-cell'),
            m('.pivot-cell.category-cell', 'Category'),
            m('.pivot-cell.count-cell', 'Count'),
            m('.pivot-cell.amount-cell', 'Amount'),
          ]),
          m('.pivot-table-body', [
            ...groups.map((group) => {
              const isCollapsed = State.finances.collapsedGroups[group.category];
              return [
                m(
                  '.pivot-group-row',
                  {
                    class: cx({ collapsed: isCollapsed }),
                    onclick: () => toggleGroup(group.category),
                  },
                  [
                    m('.pivot-cell.expand-cell', [
                      m('span.pivot-toggle.material-symbols-outlined', 'chevron_right'),
                    ]),
                    m('.pivot-cell.category-cell', [
                      m('span.material-symbols-outlined.category-icon', getCategoryIcon(group.category)),
                      m('span.category-name', group.category),
                    ]),
                    m('.pivot-cell.count-cell', m(Badge, group.count.toString())),
                    m(
                      '.pivot-cell.amount-cell',
                      { class: cx({ income: group.total > 0, expense: group.total < 0 }) },
                      formatCurrency(group.total)
                    ),
                  ]
                ),
                !isCollapsed &&
                  m('.pivot-group-children', [
                    ...group.transactions.map((t) =>
                      m('.pivot-child-row', [
                        m('.pivot-cell.expand-cell'),
                        m('.pivot-cell.category-cell.child-cell', [
                          m('.child-date', t.date),
                          m('.child-desc', t.description),
                        ]),
                        m('.pivot-cell.count-cell'),
                        m(
                          '.pivot-cell.amount-cell',
                          { class: cx({ income: t.amount > 0, expense: t.amount < 0 }) },
                          formatCurrency(t.amount)
                        ),
                      ])
                    ),
                  ]),
              ];
            }),
          ]),
          m('.pivot-table-footer', [
            m('.pivot-cell.expand-cell'),
            m('.pivot-cell.category-cell', m('strong', 'Grand Total')),
            m(
              '.pivot-cell.count-cell',
              m(Badge, groups.reduce((sum, g) => sum + g.count, 0).toString())
            ),
            m(
              '.pivot-cell.amount-cell',
              { class: cx({ income: grandTotal > 0, expense: grandTotal < 0 }) },
              m('strong', formatCurrency(grandTotal))
            ),
          ]),
        ]),
      ]);
    },
  };
}

const FinancesPage: m.Component = {
  view() {
    return m('.page-finances', [
      m(MenuBar, [
        m(Button, { variant: 'ghost' }, 'File'),
        m(Button, { variant: 'ghost' }, 'Accounts'),
        m(Button, { variant: 'ghost' }, 'Reports'),
        m(Button, { variant: 'ghost' }, 'Settings'),
      ]),

      m('.finances-toolbar', [
        m(SegmentedButtonGroup, [
          m(
            SegmentedButton,
            {
              active: State.finances.view === 'overview',
              onclick: () => (State.finances.view = 'overview'),
              icon: 'dashboard',
            },
            'Overview'
          ),
          m(
            SegmentedButton,
            {
              active: State.finances.view === 'transactions',
              onclick: () => (State.finances.view = 'transactions'),
              icon: 'receipt_long',
            },
            'Transactions'
          ),
          m(
            SegmentedButton,
            {
              active: State.finances.view === 'budgets',
              onclick: () => (State.finances.view = 'budgets'),
              icon: 'pie_chart',
            },
            'Budgets'
          ),
          m(
            SegmentedButton,
            {
              active: State.finances.view === 'reports',
              onclick: () => (State.finances.view = 'reports'),
              icon: 'pivot_table_chart',
            },
            'Reports'
          ),
        ]),
        m('.toolbar-spacer'),
        m(Select, {
          value: 'dec2024',
          options: [
            { value: 'dec2024', label: 'December 2024' },
            { value: 'nov2024', label: 'November 2024' },
            { value: 'oct2024', label: 'October 2024' },
          ],
        }),
      ]),

      m('.finances-main', [
        m(MainSplit, {
          direction: 'horizontal',
          initialSplit: 22,
          minSize: 180,
          firstPanel: m(AccountsSidebar()),
          secondPanel: m('.content-panel', [
            State.finances.view === 'overview' && m(OverviewView()),
            State.finances.view === 'transactions' && m(TransactionsView()),
            State.finances.view === 'budgets' && m(BudgetsView()),
            State.finances.view === 'reports' && m(PivotView()),
          ]),
        }),
      ]),

      m('footer.bl-statusbar', [
        m('span.bl-statusbar-item', `Last sync: Just now`),
        m('span.bl-statusbar-item', `${State.finances.transactions.length} transactions`),
        m(
          'span.bl-statusbar-item',
          { style: { marginLeft: 'auto', borderRight: 'none' } },
          'Finance Tracker v1.0'
        ),
      ]),
    ]);
  },
};

export default FinancesPage;
