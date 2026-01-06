import m from 'mithril';
import './QueryPage.css';
import Accordion from '../components/Accordion';
import Button from '../components/Button';
import Input from '../components/Input';
import MenuBar from '../components/MenuBar';
import { SplitPanel } from '../components/SplitPanel';
import Table from '../components/Table';
import Tag from '../components/Tag';
import Tabs from '../components/Tabs';

interface QueryResult {
  id: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
  amount: number;
}

interface QueryHistoryItem {
  id: number;
  query: string;
  timestamp: string;
  duration: string;
  rows: number;
  status: 'success' | 'error';
}

interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  key?: 'primary' | 'foreign';
}

interface DatabaseTable {
  name: string;
  rows: number;
  size: string;
  columns: TableColumn[];
}

const tables: DatabaseTable[] = [
  {
    name: 'users',
    rows: 15420,
    size: '2.4 MB',
    columns: [
      { name: 'id', type: 'INT', nullable: false, key: 'primary' },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'email', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'last_login', type: 'TIMESTAMP', nullable: true },
      { name: 'login_count', type: 'INT', nullable: false },
    ],
  },
  {
    name: 'orders',
    rows: 89234,
    size: '12.8 MB',
    columns: [
      { name: 'id', type: 'INT', nullable: false, key: 'primary' },
      { name: 'user_id', type: 'INT', nullable: false, key: 'foreign' },
      { name: 'total', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
    ],
  },
  {
    name: 'products',
    rows: 2341,
    size: '1.1 MB',
    columns: [
      { name: 'id', type: 'INT', nullable: false, key: 'primary' },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'category_id', type: 'INT', nullable: false, key: 'foreign' },
      { name: 'in_stock', type: 'BOOLEAN', nullable: false },
    ],
  },
  {
    name: 'categories',
    rows: 48,
    size: '12 KB',
    columns: [
      { name: 'id', type: 'INT', nullable: false, key: 'primary' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false },
      { name: 'parent_id', type: 'INT', nullable: true, key: 'foreign' },
    ],
  },
  {
    name: 'audit_logs',
    rows: 523891,
    size: '89.2 MB',
    columns: [
      { name: 'id', type: 'BIGINT', nullable: false, key: 'primary' },
      { name: 'table_name', type: 'VARCHAR(100)', nullable: false },
      { name: 'action', type: 'ENUM', nullable: false },
      { name: 'user_id', type: 'INT', nullable: true, key: 'foreign' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'data', type: 'JSON', nullable: true },
    ],
  },
];

// Page-local state
const state = {
  sidebarTab: 'history' as 'history' | 'tables',
  expandedTable: null as string | null,
  tableSearch: '',
  query: `SELECT
  id,
  name,
  email,
  status,
  created_at,
  amount
FROM users
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 100;`,
  isRunning: false,
  results: [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'active', created_at: '2024-01-15', amount: 1250.00 },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'active', created_at: '2024-01-14', amount: 890.50 },
    { id: 3, name: 'Carol White', email: 'carol@example.com', status: 'active', created_at: '2024-01-13', amount: 2100.00 },
    { id: 4, name: 'David Brown', email: 'david@example.com', status: 'active', created_at: '2024-01-12', amount: 450.75 },
    { id: 5, name: 'Eva Martinez', email: 'eva@example.com', status: 'active', created_at: '2024-01-11', amount: 3200.00 },
    { id: 6, name: 'Frank Lee', email: 'frank@example.com', status: 'active', created_at: '2024-01-10', amount: 175.25 },
    { id: 7, name: 'Grace Kim', email: 'grace@example.com', status: 'active', created_at: '2024-01-09', amount: 920.00 },
    { id: 8, name: 'Henry Chen', email: 'henry@example.com', status: 'active', created_at: '2024-01-08', amount: 1580.50 },
  ] as QueryResult[],
  history: [
    {
      id: 1,
      query: `SELECT id, name, email, status
FROM users
WHERE status = 'active'
ORDER BY created_at DESC`,
      timestamp: '10:42:15',
      duration: '0.23s',
      rows: 8,
      status: 'success',
    },
    {
      id: 2,
      query: `SELECT
  DATE(created_at) as date,
  COUNT(*) as order_count,
  SUM(total) as revenue
FROM orders
GROUP BY DATE(created_at)
ORDER BY date DESC`,
      timestamp: '10:38:22',
      duration: '0.34s',
      rows: 30,
      status: 'success',
    },
    {
      id: 3,
      query: `SELECT p.name, p.price, c.name as category
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.price > 100
  AND p.in_stock = true`,
      timestamp: '10:35:01',
      duration: '0.45s',
      rows: 156,
      status: 'success',
    },
    {
      id: 4,
      query: `UPDATE users
SET last_login = NOW(),
    login_count = login_count + 1
WHERE id = 42`,
      timestamp: '10:30:45',
      duration: '0.08s',
      rows: 1,
      status: 'success',
    },
    {
      id: 5,
      query: `SELECT * FROM audit_logs
WHERE table_name = 'users'
  AND action = 'DELETE'`,
      timestamp: '10:28:12',
      duration: '0.01s',
      rows: 0,
      status: 'error',
    },
    {
      id: 6,
      query: `SELECT
  u.name,
  COUNT(o.id) as total_orders,
  SUM(o.total) as lifetime_value
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
HAVING COUNT(o.id) > 5`,
      timestamp: '10:25:33',
      duration: '0.52s',
      rows: 89,
      status: 'success',
    },
  ] as QueryHistoryItem[],
  selectedHistory: null as number | null,
  lastQueryTime: '0.23s',
  lastRowCount: 8,
};

const MainSplit = SplitPanel();
const EditorSplit = SplitPanel();
const ResultsTable = Table<QueryResult>();

function runQuery(): void {
  state.isRunning = true;
  // Simulate query execution
  setTimeout(() => {
    state.isRunning = false;
    state.lastQueryTime = `${(Math.random() * 0.5 + 0.1).toFixed(2)}s`;
    m.redraw();
  }, 500);
}

function loadHistoryItem(item: QueryHistoryItem): void {
  state.query = item.query;
  state.selectedHistory = item.id;
}

function QueryEditor(): m.Component {
  return {
    view() {
      return m('.query-editor-panel', [
        m('.editor-toolbar', [
          m(Button, {
            variant: 'primary',
            icon: state.isRunning ? 'hourglass_empty' : 'play_arrow',
            onclick: runQuery,
            disabled: state.isRunning,
          }, state.isRunning ? 'Running...' : 'Run'),
          m(Button, { icon: 'format_align_left', tooltip: 'Format SQL' }),
          m(Button, { icon: 'content_copy', tooltip: 'Copy' }),
          m(Button, { icon: 'history', tooltip: 'History' }),
          m('.toolbar-spacer'),
          m('.toolbar-info', [
            m('span.info-label', 'Database:'),
            m('span.info-value', 'production'),
          ]),
        ]),
        m('.editor-container', [
          m('textarea.query-textarea', {
            value: state.query,
            oninput: (e: Event) => {
              state.query = (e.target as HTMLTextAreaElement).value;
            },
            placeholder: 'Enter your SQL query...',
            spellcheck: false,
          }),
        ]),
      ]);
    },
  };
}

function QueryResults(): m.Component {
  return {
    view() {
      return m('.query-results-panel', [
        m('.results-toolbar', [
          m('.results-info', [
            m(Tag, { variant: 'success' }, `${state.lastRowCount} rows`),
            m('span.results-time', `${state.lastQueryTime}`),
          ]),
          m('.results-actions', [
            m(Button, { variant: 'ghost', icon: 'download', tooltip: 'Export CSV' }),
            m(Button, { variant: 'ghost', icon: 'table_chart', tooltip: 'Export JSON' }),
          ]),
        ]),
        m('.results-table-container', [
          m(ResultsTable, {
            columns: [
              { header: 'ID', key: 'id', width: '60px' },
              { header: 'Name', key: 'name' },
              { header: 'Email', key: 'email' },
              { header: 'Status', render: (row) => m(Tag, { variant: 'success' }, row.status) },
              { header: 'Created', key: 'created_at', width: '100px' },
              { header: 'Amount', render: (row) => `$${row.amount.toFixed(2)}`, width: '100px' },
            ],
            data: state.results,
            rowKey: (row) => row.id,
            borderless: true,
          }),
        ]),
      ]);
    },
  };
}

function HistoryList(): m.Component {
  return {
    view() {
      return m('.history-list', [
        ...state.history.map((item) =>
          m('.history-item', {
            class: state.selectedHistory === item.id ? 'selected' : '',
            onclick: () => loadHistoryItem(item),
          }, [
            m('.history-item-header', [
              m('span.history-time', item.timestamp),
              m(Tag, {
                variant: item.status === 'success' ? 'success' : 'error',
              }, item.status === 'success' ? `${item.rows} rows` : 'error'),
            ]),
            m('.history-query', item.query),
            m('.history-duration', item.duration),
          ])
        ),
      ]);
    },
  };
}

function TableExplorer(): m.Component {
  function insertTableQuery(table: DatabaseTable, e: Event): void {
    e.stopPropagation();
    state.query = `SELECT *\nFROM ${table.name}\nLIMIT 100;`;
  }

  return {
    view() {
      const searchTerm = state.tableSearch.toLowerCase();
      const filteredTables = searchTerm
        ? tables.filter((t) =>
            t.name.toLowerCase().includes(searchTerm) ||
            t.columns.some((c) => c.name.toLowerCase().includes(searchTerm))
          )
        : tables;

      return m('.table-explorer', [
        m('.table-search', [
          m(Input, {
            placeholder: 'Search tables...',
            value: state.tableSearch,
            oninput: (value: string) => state.tableSearch = value,
            icon: 'search',
          }),
        ]),
        m(Accordion, {
          expanded: state.expandedTable,
          onToggle: (id) => state.expandedTable = id,
          items: filteredTables.map((table) => ({
            id: table.name,
            header: [
              m('span.material-symbols-outlined.table-icon', 'table_chart'),
              m('.table-name', table.name),
              m('.table-meta', `${table.rows.toLocaleString()} rows`),
            ],
            content: m('.table-columns', [
              m('.table-info', [
                m('span.table-size', table.size),
                m(Button, {
                  variant: 'ghost',
                  icon: 'play_arrow',
                  tooltip: 'Select from table',
                  onclick: (e: Event) => insertTableQuery(table, e),
                }),
              ]),
              ...table.columns.map((col) =>
                m('.column-item', [
                  m('span.material-symbols-outlined.column-icon', {
                    class: col.key === 'primary' ? 'key-primary' : col.key === 'foreign' ? 'key-foreign' : '',
                  }, col.key ? 'key' : 'remove'),
                  m('.column-name', col.name),
                  m('.column-type', col.type),
                  col.nullable && m('.column-nullable', 'NULL'),
                ])
              ),
            ]),
          })),
        }),
      ]);
    },
  };
}

function QuerySidebar(): m.Component {
  return {
    view() {
      return m('.query-sidebar', [
        m(Tabs, {
          tabs: [
            { id: 'history', label: 'History', icon: 'history', content: m(HistoryList()) },
            { id: 'tables', label: 'Tables', icon: 'storage', content: m(TableExplorer()) },
          ],
          activeTab: state.sidebarTab,
          onTabChange: (id) => state.sidebarTab = id as 'history' | 'tables',
          variant: 'primary',
          className: 'sidebar-tabs',
        }),
      ]);
    },
  };
}

const QueryPage: m.Component = {
  view() {
    return m('.page-query', [
      m(MenuBar, [
        m(Button, { variant: 'ghost' }, 'File'),
        m(Button, { variant: 'ghost' }, 'Edit'),
        m(Button, { variant: 'ghost' }, 'Query'),
        m(Button, { variant: 'ghost' }, 'View'),
        m(Button, { variant: 'ghost' }, 'Help'),
      ]),

      m(MainSplit, {
        direction: 'horizontal',
        initialSplit: 80,
        minSize: 200,
        firstPanel: m(EditorSplit, {
          direction: 'vertical',
          initialSplit: 40,
          minSize: 100,
          firstPanel: m(QueryEditor()),
          secondPanel: m(QueryResults()),
        }),
        secondPanel: m(QuerySidebar()),
      }),

      m('footer.bl-statusbar', [
        m('span.bl-statusbar-item', 'Connected: production'),
        m('span.bl-statusbar-item', `Last query: ${state.lastQueryTime}`),
        m('span.bl-statusbar-item', { style: { marginLeft: 'auto', borderRight: 'none' } }, 'Query Editor v1.0'),
      ]),
    ]);
  },
};

export default QueryPage;
