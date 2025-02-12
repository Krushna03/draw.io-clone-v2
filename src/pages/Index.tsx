
import { useCallback, useState } from 'react';
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
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Square, Circle, Type, ArrowRight, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let nodeId = 1;

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNode = (type: 'rectangle' | 'square' | 'circle' | 'text' ) => {
    const id = `node-${nodeId++}`;
    let nodeData = {
      label: type === 'text' ? 'Double click to edit' : 'New Table',
      // fields: type === 'table' ? [
      //   { name: 'id', type: 'uuid', isPrimary: true },
      //   { name: 'created_at', type: 'timestamp' }
      // ] : undefined
    };

    const newNode: Node = {
      id,
      type: 'default',
      position: { x: 100, y: 100 },
      data: nodeData,
      style: {
        background: '#fff',
        border: '1px solid #ddd',
        padding: '10px',
        ...(type === 'rectangle' && { width: 150, height: 80 }),
        ...(type === 'square' && { width: 80, height: 80 }),
        ...(type === 'circle' && {
          width: 80,
          height: 80,
          borderRadius: '50%',
        }),
        ...(type === 'text' && {
          background: 'transparent',
          border: 'none',
          width: 150,
        }),
        // ...(type === 'table' && {
        //   width: 250,
        //   minHeight: 120,
        //   display: 'flex',
        //   flexDirection: 'column',
        //   padding: 0,
        //   borderRadius: '4px',
        //   backgroundColor: '#f8f9fa',
        //   boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        // }),
      },
    };

    // if (type === 'table') {
    //   newNode.data = {
    //     ...nodeData,
    //     render: () => (
    //       <div className="w-full h-full">
    //         <div className="bg-gray-100 p-3 border-b border-gray-200 font-semibold text-gray-700 rounded-t-md">
    //           {nodeData.label}
    //         </div>
    //         <div className="p-2 bg-white rounded-b-md">
    //           {nodeData.fields?.map((field, index) => (
    //             <div 
    //               key={index} 
    //               className="flex justify-between items-center py-2 px-1 text-sm border-b border-gray-100 last:border-0"
    //             >
    //               <div className="flex items-center gap-2">
    //                 {field.isPrimary && (
    //                   <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">PK</span>
    //                 )}
    //                 <span className="text-gray-800">{field.name}</span>
    //               </div>
    //               <span className="text-gray-500 text-xs font-mono">{field.type}</span>
    //             </div>
    //           ))}
    //           <div className="flex gap-2 mt-3">
    //             <button 
    //               onClick={() => addFieldToTable(id)}
    //               className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
    //             >
    //               + Add Field
    //             </button>
    //             <button 
    //               onClick={() => editTableName(id)}
    //               className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
    //             >
    //               Edit Table
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     ),
    //   };
    // }

    setNodes((nds) => [...nds, newNode]);
  };

  // const addFieldToTable = (nodeId: string) => {
  //   const fieldName = prompt('Enter field name:');
  //   const fieldType = prompt('Enter field type (e.g., varchar, int4, uuid, timestamp, money):');
  //   const isPrimary = confirm('Is this a primary key?');
    
  //   if (fieldName && fieldType) {
  //     setNodes((nds) =>
  //       nds.map((node) => {
  //         if (node.id === nodeId) {
  //           const currentFields = node.data.fields || [];
  //           return {
  //             ...node,
  //             data: {
  //               ...node.data,
  //               fields: [...currentFields, { name: fieldName, type: fieldType, isPrimary }],
  //             },
  //           };
  //         }
  //         return node;
  //       }),
  //     );
  //   }
  // };

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

  const onNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    if (node.data.fields) {
      editTableName(node.id);
    } else {
      const newLabel = prompt('Enter new text:', node.data.label);
      if (newLabel !== null) {
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                data: { ...n.data, label: newLabel },
              };
            }
            return n;
          }),
        );
      }
    }
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
            onClick={() => addNode('rectangle')}
            title="Add Rectangle"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => addNode('square')}
            title="Add Square"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => addNode('circle')}
            title="Add Circle"
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => addNode('text')}
            title="Add Text"
          >
            <Type className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="outline"
            size="icon"
            onClick={() => addNode('table')}
            title="Add Database Table"
          >
            <Database className="h-4 w-4" />
          </Button> */}
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default Index;
