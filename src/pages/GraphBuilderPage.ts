import m from 'mithril';
import './GraphBuilderPage.css';
import Button from '../components/Button';
import MenuBar from '../components/MenuBar';
import Select from '../components/Select';

interface Port {
  id: string;
  name: string;
  type: 'input' | 'output';
  dataType: 'table' | 'column' | 'value' | 'condition';
}

interface GraphNode {
  id: string;
  type: 'table' | 'select' | 'filter' | 'join' | 'aggregate' | 'output';
  label: string;
  x: number;
  y: number;
  ports: Port[];
  config?: Record<string, unknown>;
}

interface Connection {
  id: string;
  fromNode: string;
  fromPort: string;
  toNode: string;
  toPort: string;
}

interface DragState {
  type: 'node' | 'connection' | null;
  nodeId?: string;
  startX?: number;
  startY?: number;
  offsetX?: number;
  offsetY?: number;
  fromNode?: string;
  fromPort?: string;
  mouseX?: number;
  mouseY?: number;
}

const nodeTemplates: Record<string, Omit<GraphNode, 'id' | 'x' | 'y'>> = {
  table: {
    type: 'table',
    label: 'Table',
    ports: [
      { id: 'out', name: 'Data', type: 'output', dataType: 'table' },
    ],
    config: { tableName: 'users' },
  },
  select: {
    type: 'select',
    label: 'Select',
    ports: [
      { id: 'in', name: 'Input', type: 'input', dataType: 'table' },
      { id: 'out', name: 'Output', type: 'output', dataType: 'table' },
    ],
    config: { columns: ['*'] },
  },
  filter: {
    type: 'filter',
    label: 'Filter',
    ports: [
      { id: 'in', name: 'Input', type: 'input', dataType: 'table' },
      { id: 'out', name: 'Output', type: 'output', dataType: 'table' },
    ],
    config: { condition: "status = 'active'" },
  },
  join: {
    type: 'join',
    label: 'Join',
    ports: [
      { id: 'left', name: 'Left', type: 'input', dataType: 'table' },
      { id: 'right', name: 'Right', type: 'input', dataType: 'table' },
      { id: 'out', name: 'Output', type: 'output', dataType: 'table' },
    ],
    config: { joinType: 'INNER', on: 'id' },
  },
  aggregate: {
    type: 'aggregate',
    label: 'Aggregate',
    ports: [
      { id: 'in', name: 'Input', type: 'input', dataType: 'table' },
      { id: 'out', name: 'Output', type: 'output', dataType: 'table' },
    ],
    config: { groupBy: '', functions: ['COUNT(*)'] },
  },
  output: {
    type: 'output',
    label: 'Output',
    ports: [
      { id: 'in', name: 'Result', type: 'input', dataType: 'table' },
    ],
  },
};

// Page state
const state = {
  nodes: [
    { id: 'node1', type: 'table', label: 'users', x: 50, y: 100, ports: nodeTemplates.table.ports, config: { tableName: 'users' } },
    { id: 'node2', type: 'table', label: 'orders', x: 50, y: 280, ports: nodeTemplates.table.ports, config: { tableName: 'orders' } },
    { id: 'node3', type: 'join', label: 'Join', x: 280, y: 180, ports: nodeTemplates.join.ports, config: { joinType: 'INNER', on: 'user_id' } },
    { id: 'node4', type: 'filter', label: 'Filter', x: 500, y: 180, ports: nodeTemplates.filter.ports, config: { condition: "status = 'active'" } },
    { id: 'node5', type: 'select', label: 'Select', x: 720, y: 180, ports: nodeTemplates.select.ports, config: { columns: ['name', 'email', 'total'] } },
    { id: 'node6', type: 'output', label: 'Output', x: 940, y: 180, ports: nodeTemplates.output.ports },
  ] as GraphNode[],
  connections: [
    { id: 'conn1', fromNode: 'node1', fromPort: 'out', toNode: 'node3', toPort: 'left' },
    { id: 'conn2', fromNode: 'node2', fromPort: 'out', toNode: 'node3', toPort: 'right' },
    { id: 'conn3', fromNode: 'node3', fromPort: 'out', toNode: 'node4', toPort: 'in' },
    { id: 'conn4', fromNode: 'node4', fromPort: 'out', toNode: 'node5', toPort: 'in' },
    { id: 'conn5', fromNode: 'node5', fromPort: 'out', toNode: 'node6', toPort: 'in' },
  ] as Connection[],
  drag: { type: null } as DragState,
  selectedNode: null as string | null,
  canvasOffset: { x: 0, y: 0 },
  zoom: 1,
  nextNodeId: 7,
  nextConnId: 6,
};

function getPortPosition(node: GraphNode, port: Port): { x: number; y: number } {
  const portIndex = node.ports.filter(p => p.type === port.type).indexOf(port);
  const portsOfType = node.ports.filter(p => p.type === port.type).length;
  const nodeHeight = 60 + node.ports.length * 10;
  const yOffset = 30 + (portIndex + 1) * (nodeHeight - 40) / (portsOfType + 1);

  return {
    x: node.x + (port.type === 'input' ? 0 : 180),
    y: node.y + yOffset,
  };
}

function getNodeIcon(type: string): string {
  switch (type) {
    case 'table': return 'table_chart';
    case 'select': return 'checklist';
    case 'filter': return 'filter_alt';
    case 'join': return 'join_inner';
    case 'aggregate': return 'functions';
    case 'output': return 'output';
    default: return 'circle';
  }
}

function generateSQL(): string {
  const outputNode = state.nodes.find(n => n.type === 'output');
  if (!outputNode) return '-- No output node';

  const visited = new Set<string>();
  const parts: string[] = [];

  function traverse(nodeId: string): string | null {
    if (visited.has(nodeId)) return null;
    visited.add(nodeId);

    const node = state.nodes.find(n => n.id === nodeId);
    if (!node) return null;

    const incomingConns = state.connections.filter(c => c.toNode === nodeId);

    switch (node.type) {
      case 'table':
        return node.config?.tableName as string || 'unknown_table';

      case 'select': {
        const source = incomingConns[0] ? traverse(incomingConns[0].fromNode) : null;
        const columns = (node.config?.columns as string[])?.join(', ') || '*';
        if (source) {
          parts.push(`SELECT ${columns}`);
          return source;
        }
        return null;
      }

      case 'filter': {
        const source = incomingConns[0] ? traverse(incomingConns[0].fromNode) : null;
        const condition = node.config?.condition as string || 'true';
        parts.push(`WHERE ${condition}`);
        return source;
      }

      case 'join': {
        const leftConn = incomingConns.find(c => c.toPort === 'left');
        const rightConn = incomingConns.find(c => c.toPort === 'right');
        const leftTable = leftConn ? traverse(leftConn.fromNode) : null;
        const rightTable = rightConn ? traverse(rightConn.fromNode) : null;
        const joinType = node.config?.joinType as string || 'INNER';
        const onClause = node.config?.on as string || 'id';
        if (leftTable && rightTable) {
          return `${leftTable} ${joinType} JOIN ${rightTable} ON ${leftTable}.${onClause} = ${rightTable}.${onClause}`;
        }
        return leftTable || rightTable;
      }

      case 'aggregate': {
        const source = incomingConns[0] ? traverse(incomingConns[0].fromNode) : null;
        const groupBy = node.config?.groupBy as string;
        if (groupBy) {
          parts.push(`GROUP BY ${groupBy}`);
        }
        return source;
      }

      case 'output': {
        return incomingConns[0] ? traverse(incomingConns[0].fromNode) : null;
      }

      default:
        return null;
    }
  }

  const fromClause = traverse(outputNode.id);

  if (!parts.some(p => p.startsWith('SELECT'))) {
    parts.unshift('SELECT *');
  }

  if (fromClause) {
    const selectIdx = parts.findIndex(p => p.startsWith('SELECT'));
    parts.splice(selectIdx + 1, 0, `FROM ${fromClause}`);
  }

  return parts.join('\n') + ';';
}

function addNode(type: string): void {
  const template = nodeTemplates[type];
  if (!template) return;

  const newNode: GraphNode = {
    id: `node${state.nextNodeId++}`,
    type: template.type,
    label: template.label,
    x: 100 + Math.random() * 200,
    y: 100 + Math.random() * 200,
    ports: template.ports.map(p => ({ ...p })),
    config: template.config ? { ...template.config } : undefined,
  };

  state.nodes.push(newNode);
}

function deleteNode(nodeId: string): void {
  state.nodes = state.nodes.filter(n => n.id !== nodeId);
  state.connections = state.connections.filter(c => c.fromNode !== nodeId && c.toNode !== nodeId);
  if (state.selectedNode === nodeId) {
    state.selectedNode = null;
  }
}

function deleteConnection(connId: string): void {
  state.connections = state.connections.filter(c => c.id !== connId);
}

function handleCanvasMouseDown(e: MouseEvent): void {
  if ((e.target as HTMLElement).closest('.graph-node, .graph-port')) return;
  state.selectedNode = null;
}

function handleNodeMouseDown(e: MouseEvent, node: GraphNode): void {
  e.stopPropagation();
  state.selectedNode = node.id;
  state.drag = {
    type: 'node',
    nodeId: node.id,
    startX: node.x,
    startY: node.y,
    offsetX: e.clientX,
    offsetY: e.clientY,
  };
}

function handlePortMouseDown(e: MouseEvent, node: GraphNode, port: Port): void {
  e.stopPropagation();
  if (port.type === 'output') {
    const pos = getPortPosition(node, port);
    state.drag = {
      type: 'connection',
      fromNode: node.id,
      fromPort: port.id,
      mouseX: pos.x,
      mouseY: pos.y,
    };
  }
}

function handlePortMouseUp(e: MouseEvent, node: GraphNode, port: Port): void {
  e.stopPropagation();
  if (state.drag.type === 'connection' && port.type === 'input') {
    // Check if connection already exists
    const exists = state.connections.some(
      c => c.fromNode === state.drag.fromNode && c.fromPort === state.drag.fromPort &&
           c.toNode === node.id && c.toPort === port.id
    );

    // Check if port already has a connection (inputs can only have one)
    const portOccupied = state.connections.some(
      c => c.toNode === node.id && c.toPort === port.id
    );

    if (!exists && !portOccupied && state.drag.fromNode !== node.id) {
      state.connections.push({
        id: `conn${state.nextConnId++}`,
        fromNode: state.drag.fromNode!,
        fromPort: state.drag.fromPort!,
        toNode: node.id,
        toPort: port.id,
      });
    }
  }
  state.drag = { type: null };
}

function handleMouseMove(e: MouseEvent): void {
  if (state.drag.type === 'node' && state.drag.nodeId) {
    const node = state.nodes.find(n => n.id === state.drag.nodeId);
    if (node) {
      node.x = state.drag.startX! + (e.clientX - state.drag.offsetX!);
      node.y = state.drag.startY! + (e.clientY - state.drag.offsetY!);
      m.redraw();
    }
  } else if (state.drag.type === 'connection') {
    const canvas = document.querySelector('.graph-canvas');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      state.drag.mouseX = e.clientX - rect.left;
      state.drag.mouseY = e.clientY - rect.top;
      m.redraw();
    }
  }
}

function handleMouseUp(): void {
  state.drag = { type: null };
}

function renderConnection(conn: Connection): m.Vnode | null {
  const fromNode = state.nodes.find(n => n.id === conn.fromNode);
  const toNode = state.nodes.find(n => n.id === conn.toNode);
  if (!fromNode || !toNode) return null;

  const fromPort = fromNode.ports.find(p => p.id === conn.fromPort);
  const toPort = toNode.ports.find(p => p.id === conn.toPort);
  if (!fromPort || !toPort) return null;

  const from = getPortPosition(fromNode, fromPort);
  const to = getPortPosition(toNode, toPort);

  const dx = to.x - from.x;
  const controlOffset = Math.min(Math.abs(dx) * 0.5, 100);

  const path = `M ${from.x} ${from.y} C ${from.x + controlOffset} ${from.y}, ${to.x - controlOffset} ${to.y}, ${to.x} ${to.y}`;

  return m('g.graph-connection', { key: conn.id }, [
    m('path.connection-line', {
      d: path,
      onclick: (e: MouseEvent) => {
        e.stopPropagation();
        deleteConnection(conn.id);
      },
    }),
    m('path.connection-line-hit', {
      d: path,
      onclick: (e: MouseEvent) => {
        e.stopPropagation();
        deleteConnection(conn.id);
      },
    }),
  ]);
}

function renderDragConnection(): m.Vnode | null {
  if (state.drag.type !== 'connection' || !state.drag.fromNode) return null;

  const fromNode = state.nodes.find(n => n.id === state.drag.fromNode);
  if (!fromNode) return null;

  const fromPort = fromNode.ports.find(p => p.id === state.drag.fromPort);
  if (!fromPort) return null;

  const from = getPortPosition(fromNode, fromPort);
  const to = { x: state.drag.mouseX || from.x, y: state.drag.mouseY || from.y };

  const dx = to.x - from.x;
  const controlOffset = Math.min(Math.abs(dx) * 0.5, 100);

  const path = `M ${from.x} ${from.y} C ${from.x + controlOffset} ${from.y}, ${to.x - controlOffset} ${to.y}, ${to.x} ${to.y}`;

  return m('path.connection-line.dragging', { d: path });
}

function renderNode(node: GraphNode): m.Vnode {
  const isSelected = state.selectedNode === node.id;
  const inputPorts = node.ports.filter(p => p.type === 'input');
  const outputPorts = node.ports.filter(p => p.type === 'output');

  return m('.graph-node', {
    key: node.id,
    class: isSelected ? 'selected' : '',
    style: { left: `${node.x}px`, top: `${node.y}px` },
    onmousedown: (e: MouseEvent) => handleNodeMouseDown(e, node),
  }, [
    m('.node-header', [
      m('span.material-symbols-outlined.node-icon', getNodeIcon(node.type)),
      m('.node-title', node.label),
      isSelected && m('button.node-delete', {
        onclick: (e: MouseEvent) => {
          e.stopPropagation();
          deleteNode(node.id);
        },
      }, m('span.material-symbols-outlined', 'close')),
    ]),
    m('.node-body', [
      node.type === 'table' && m('.node-config', [
        m(Select, {
          value: node.config?.tableName as string,
          options: [
            { value: 'users', label: 'users' },
            { value: 'orders', label: 'orders' },
            { value: 'products', label: 'products' },
            { value: 'categories', label: 'categories' },
          ],
          onchange: (val: string) => {
            node.config = { ...node.config, tableName: val };
            node.label = val;
          },
        }),
      ]),
      node.type === 'join' && m('.node-config', [
        m(Select, {
          value: node.config?.joinType as string,
          options: [
            { value: 'INNER', label: 'INNER' },
            { value: 'LEFT', label: 'LEFT' },
            { value: 'RIGHT', label: 'RIGHT' },
            { value: 'FULL', label: 'FULL' },
          ],
          onchange: (val: string) => {
            node.config = { ...node.config, joinType: val };
          },
        }),
      ]),
    ]),
    m('.node-ports', [
      m('.ports-left', inputPorts.map(port =>
        m('.graph-port.port-input', {
          key: port.id,
          onmousedown: (e: MouseEvent) => handlePortMouseDown(e, node, port),
          onmouseup: (e: MouseEvent) => handlePortMouseUp(e, node, port),
        }, [
          m('.port-dot'),
          m('.port-label', port.name),
        ])
      )),
      m('.ports-right', outputPorts.map(port =>
        m('.graph-port.port-output', {
          key: port.id,
          onmousedown: (e: MouseEvent) => handlePortMouseDown(e, node, port),
          onmouseup: (e: MouseEvent) => handlePortMouseUp(e, node, port),
        }, [
          m('.port-label', port.name),
          m('.port-dot'),
        ])
      )),
    ]),
  ]);
}

const GraphBuilderPage: m.Component = {
  oncreate() {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  },

  onremove() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  },

  view() {
    const sql = generateSQL();

    return m('.page-graph-builder', [
      m(MenuBar, [
        m(Button, { variant: 'ghost' }, 'File'),
        m(Button, { variant: 'ghost' }, 'Edit'),
        m(Button, { variant: 'ghost' }, 'View'),
        m(Button, { variant: 'ghost' }, 'Help'),
      ]),

      m('.graph-toolbar', [
        m('.toolbar-group', [
          m(Button, { icon: 'table_chart', onclick: () => addNode('table') }, 'Table'),
          m(Button, { icon: 'checklist', onclick: () => addNode('select') }, 'Select'),
          m(Button, { icon: 'filter_alt', onclick: () => addNode('filter') }, 'Filter'),
          m(Button, { icon: 'join_inner', onclick: () => addNode('join') }, 'Join'),
          m(Button, { icon: 'functions', onclick: () => addNode('aggregate') }, 'Aggregate'),
          m(Button, { icon: 'output', onclick: () => addNode('output') }, 'Output'),
        ]),
        m('.toolbar-spacer'),
        m('.toolbar-group', [
          m(Button, { icon: 'play_arrow', variant: 'primary' }, 'Execute'),
        ]),
      ]),

      m('.graph-main', [
        m('.graph-canvas', {
          onmousedown: handleCanvasMouseDown,
        }, [
          m('svg.graph-connections', [
            state.connections.map(renderConnection),
            renderDragConnection(),
          ]),
          state.nodes.map(renderNode),
        ]),

        m('.graph-sidebar', [
          m('.sidebar-section', [
            m('.sidebar-title', 'Generated SQL'),
            m('pre.sql-preview', sql),
          ]),
          state.selectedNode && m('.sidebar-section', [
            m('.sidebar-title', 'Node Properties'),
            m('.node-properties', [
              (() => {
                const node = state.nodes.find(n => n.id === state.selectedNode);
                if (!node) return null;
                return [
                  m('.property-row', [
                    m('.property-label', 'Type'),
                    m('.property-value', node.type),
                  ]),
                  m('.property-row', [
                    m('.property-label', 'ID'),
                    m('.property-value', node.id),
                  ]),
                  node.config && Object.entries(node.config).map(([key, value]) =>
                    m('.property-row', { key }, [
                      m('.property-label', key),
                      m('.property-value', String(value)),
                    ])
                  ),
                ];
              })(),
            ]),
          ]),
        ]),
      ]),

      m('footer.bl-statusbar', [
        m('span.bl-statusbar-item', `Nodes: ${state.nodes.length}`),
        m('span.bl-statusbar-item', `Connections: ${state.connections.length}`),
        m('span.bl-statusbar-item', { style: { marginLeft: 'auto', borderRight: 'none' } }, 'Graph Builder v1.0'),
      ]),
    ]);
  },
};

export default GraphBuilderPage;
