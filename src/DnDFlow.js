import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [];
const initialEdges = [];

let id = 0;
const getId = () => `node_${id++}`;

const DnDFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [contextMenu, setContextMenu] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = event.target.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: getId(),
        type: 'default',
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, node });
  };

  const closeContextMenu = () => setContextMenu(null);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlowProvider>
        <div style={{ display: 'flex', height: '100%' }}>
          {/* Sidebar with draggable blocks */}
          <div style={{ width: 120, padding: 10 }}>
            <div
              onDragStart={(e) => onDragStart(e, 'block A')}
              draggable
              style={{
                marginBottom: 10,
                background: '#A0D8B3',
                padding: 10,
                borderRadius: 4,
                cursor: 'grab',
              }}
            >
              block A
            </div>
            <div
              onDragStart={(e) => onDragStart(e, 'block B')}
              draggable
              style={{
                background: '#F6D776',
                padding: 10,
                borderRadius: 4,
                cursor: 'grab',
              }}
            >
              block B
            </div>
          </div>

          {/* Main canvas */}
          <div
            style={{ flexGrow: 1 }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={closeContextMenu}
          >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeContextMenu={(event, node) => onNodeContextMenu(event, node)} // ✅ Add this!
                fitView
            >
              <MiniMap />
              <Controls />
              <Background />
            </ReactFlow>

            {contextMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: contextMenu.y,
                  left: contextMenu.x,
                  backgroundColor: 'white',
                  border: '1px solid black',
                  padding: '5px 10px',
                  borderRadius: 4,
                  zIndex: 100,
                }}
              >
                Hello World
              </div>
            )}
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
