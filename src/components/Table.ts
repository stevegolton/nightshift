import m from 'mithril';
import './Table.css';
import RowActionsMenu, { RowActionItem } from './RowActionsMenu';

export interface TableColumn<T = Record<string, unknown>> {
  /** Column header text */
  header: string;
  /** Property key to access from row data */
  key?: keyof T | string;
  /** Custom render function for cell content */
  render?: (row: T, rowIndex: number) => m.Children;
  /** Column width (CSS value) */
  width?: string;
  /** Additional class for header cell */
  headerClass?: string;
  /** Additional class for body cells */
  cellClass?: string;
  /** Column header actions (shown on hover) */
  actions?: RowActionItem[];
  /** Sort direction indicator */
  sort?: 'asc' | 'desc' | null;
}

export interface TableAttrs<T = Record<string, unknown>> {
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Row data array */
  data: T[];
  /** Key function to get unique row identifier */
  rowKey?: (row: T, index: number) => string | number;
  /** Row click handler */
  onRowClick?: (row: T, index: number, e: Event) => void;
  /** Row double-click handler */
  onRowDblClick?: (row: T, index: number, e: Event) => void;
  /** Additional class names */
  className?: string;
  /** Remove outer border and radius (for embedding in containers) */
  borderless?: boolean;
  /** Empty state content when no data */
  emptyContent?: m.Children;
}

function getNestedValue<T>(obj: T, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

const Table = <T = Record<string, unknown>>(): m.Component<TableAttrs<T>> => ({
  view(vnode) {
    const {
      columns,
      data,
      rowKey = (_row: T, index: number) => index,
      onRowClick,
      onRowDblClick,
      className,
      borderless = false,
      emptyContent = 'No data',
    } = vnode.attrs;

    const tableClasses = ['bl-table'];
    if (borderless) tableClasses.push('bl-table-borderless');
    if (className) tableClasses.push(className);

    return m('table', { class: tableClasses.join(' ') }, [
      m(
        'thead',
        m(
          'tr',
          columns.map((col) => {
            const hasActions = col.actions && col.actions.length > 0;
            const hasSort = col.sort !== undefined;

            // Simple header without actions
            if (!hasActions && !hasSort) {
              return m(
                'th',
                {
                  class: col.headerClass,
                  style: col.width ? { width: col.width } : undefined,
                },
                col.header
              );
            }

            // Header with actions/sort
            return m(
              'th',
              {
                class: col.headerClass,
                style: col.width ? { width: col.width } : undefined,
              },
              m('.bl-table-header', [
                m('span.bl-table-header-label', [
                  col.header,
                  hasSort &&
                    col.sort &&
                    m(
                      'span.bl-table-sort.active',
                      m(
                        'span.material-symbols-outlined',
                        col.sort === 'asc' ? 'arrow_upward' : 'arrow_downward'
                      )
                    ),
                ]),
                hasActions &&
                  m(
                    '.bl-table-header-actions',
                    m(RowActionsMenu, { actions: col.actions!, menuLeft: true })
                  ),
              ])
            );
          })
        )
      ),
      m('tbody', [
        data.length === 0
          ? m('tr.bl-table-empty', m('td', { colspan: columns.length }, emptyContent))
          : data.map((row, rowIndex) => {
              const key = rowKey(row, rowIndex);

              return m(
                'tr',
                {
                  key,
                  onclick: onRowClick ? (e: Event) => onRowClick(row, rowIndex, e) : undefined,
                  ondblclick: onRowDblClick
                    ? (e: Event) => onRowDblClick(row, rowIndex, e)
                    : undefined,
                },
                columns.map((col) =>
                  m(
                    'td',
                    { className: col.cellClass },
                    col.render
                      ? col.render(row, rowIndex)
                      : col.key
                        ? String(getNestedValue(row, String(col.key)) ?? '')
                        : ''
                  )
                )
              );
            }),
      ]),
    ]);
  },
});

export default Table;
