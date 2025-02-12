import { useCallback } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Connection, 
  Edge, 
  Node,
  NodeProps,
  Panel,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the type for schema field
interface SchemaField {
  title: string;
  type: string;
}

// Define the type for node data
interface DatabaseSchemaData {
  label: string;
  schema: SchemaField[];
}

// Database Schema Node Component
const DatabaseSchemaNode = ({ data }: NodeProps<DatabaseSchemaData>) => {
  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm">
      <div className="bg-gray-50 p-3 border-b border-gray-200 font-medium text-gray-700 rounded-t-md">
        {data.label}
      </div>
      <div className="p-2">
        {data.schema.map((field, index) => (
          <div 
            key={index}
            className="flex items-center justify-between py-1 px-2 text-sm border-b last:border-b-0 border-gray-100"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-800">{field.title}</span>
            </div>
            <span className="text-gray-500 text-xs font-mono">{field.type}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={field.title}
              className="w-3 h-3 !bg-gray-400"
              style={{ visibility: field.type === 'uuid' ? 'visible' : 'hidden' }}
            />
            <Handle
              type="target"
              position={Position.Left}
              id={field.title}
              className="w-3 h-3 !bg-gray-400"
              style={{ visibility: field.type === 'uuid' ? 'visible' : 'hidden' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const defaultNodes: Node<DatabaseSchemaData>[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "databaseSchema",
    data: {
      label: "Products",
      schema: [
        { title: "id", type: "uuid" },
        { title: "name", type: "varchar" },
        { title: "description", type: "varchar" },
        { title: "warehouse_id", type: "uuid" },
        { title: "supplier_id", type: "uuid" },
        { title: "price", type: "money" },
        { title: "quantity", type: "int4" },
      ],
    },
  },
  {
    id: "2",
    position: { x: 350, y: -100 },
    type: "databaseSchema",
    data: {
      label: "Warehouses",
      schema: [
        { title: "id", type: "uuid" },
        { title: "name", type: "varchar" },
        { title: "address", type: "varchar" },
        { title: "capacity", type: "int4" },
      ],
    },
  },
  {
    id: "3",
    position: { x: 350, y: 200 },
    type: "databaseSchema",
    data: {
      label: "Suppliers",
      schema: [
        { title: "id", type: "uuid" },
        { title: "name", type: "varchar" },
        { title: "description", type: "varchar" },
        { title: "country", type: "varchar" },
      ],
    },
  },
];

const defaultEdges: Edge[] = [
  {
    id: "products-warehouses",
    source: "1",
    target: "2",
    sourceHandle: "warehouse_id",
    targetHandle: "id",
  },
  {
    id: "products-suppliers",
    source: "1",
    target: "3",
    sourceHandle: "supplier_id",
    targetHandle: "id",
  },
];

let nodeId = 4;

const nodeTypes = {
  databaseSchema: DatabaseSchemaNode
};

const DatabaseView = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNode = () => {
    const id = `node-${nodeId++}`;
    const newNode: Node<DatabaseSchemaData> = {
      id,
      type: 'databaseSchema',
      position: { x: 100, y: 100 },
      data: {
        label: 'New Table',
        schema: [
          { title: 'id', type: 'uuid' },
          { title: 'created_at', type: 'timestamp' }
        ]
      }
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const addFieldToTable = (nodeId: string) => {
    const fieldTitle = prompt('Enter field name:');
    const fieldType = prompt('Enter field type (e.g., varchar, int4, uuid, timestamp, money):');
    
    if (fieldTitle && fieldType) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                schema: [...node.data.schema, { title: fieldTitle, type: fieldType }],
              },
            };
          }
          return node;
        }),
      );
    }
  };

  const editTableName = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const newName = prompt('Enter table name:', node.data.label);
    if (newName) {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              data: { ...n.data, label: newName },
            };
          }
          return n;
        }),
      );
    }
  };

  const onNodeDoubleClick = (event: React.MouseEvent, node: Node<DatabaseSchemaData>) => {
    editTableName(node.id);
  };

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
      >
        <Controls />
        <MiniMap />
        <Background />
        <Panel position="top-left" className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => addNode()}
            title="Add Database Table"
          >
            <Database className="h-4 w-4" />
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default DatabaseView;