import m from 'mithril';
import './Table.css';

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
}

export interface TableAttrs<T = Record<string, unknown>> {
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Row data array */
  data: T[];
  /** Key function to get unique row identifier */
  rowKey?: (row: T, index: number) => string | number;
  /** Currently selected row key(s) */
  selectedKey?: string | number | (string | number)[];
  /** Row click handler */
  onRowClick?: (row: T, index: number, e: Event) => void;
  /** Row double-click handler */
  onRowDblClick?: (row: T, index: number, e: Event) => void;
  /** Additional class names */
  class?: string;
  /** Whether rows are selectable (adds hover styles) */
  selectable?: boolean;
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
      selectedKey,
      onRowClick,
      onRowDblClick,
      class: className,
      selectable = true,
      borderless = false,
      emptyContent = 'No data',
    } = vnode.attrs;

    const selectedKeys = Array.isArray(selectedKey)
      ? selectedKey
      : selectedKey !== undefined
        ? [selectedKey]
        : [];

    const tableClasses = ['bl-table'];
    if (selectable) tableClasses.push('bl-table-selectable');
    if (borderless) tableClasses.push('bl-table-borderless');
    if (className) tableClasses.push(className);

    return m('table', { class: tableClasses.join(' ') }, [
      m(
        'thead',
        m(
          'tr',
          columns.map((col) =>
            m(
              'th',
              {
                class: col.headerClass,
                style: col.width ? { width: col.width } : undefined,
              },
              col.header
            )
          )
        )
      ),
      m('tbody', [
        data.length === 0
          ? m('tr.bl-table-empty', m('td', { colspan: columns.length }, emptyContent))
          : data.map((row, rowIndex) => {
              const key = rowKey(row, rowIndex);
              const isSelected = selectedKeys.includes(key);

              return m(
                'tr',
                {
                  key,
                  class: isSelected ? 'selected' : undefined,
                  onclick: onRowClick ? (e: Event) => onRowClick(row, rowIndex, e) : undefined,
                  ondblclick: onRowDblClick
                    ? (e: Event) => onRowDblClick(row, rowIndex, e)
                    : undefined,
                },
                columns.map((col) =>
                  m(
                    'td',
                    { class: col.cellClass },
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
