"use client";

import { useEffect, useState } from "react";
import ReactFlow, {
  type Node,
  type Edge,
  type Connection,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

// =====================
// 型
// =====================
type Form = {
  id: string; // ★ID統一（string）
  title: string;
  description: string;
};

type GetFormsResponse = {
  status: string;
  forms: Form[];
};

type FormNodeData = {
  id: string; // ★追加（UI側でもID保持）
  label: string;
  description: string;
};

type FormNode = Node<FormNodeData>;

const nodeTypes = {};
const edgeTypes = {};

export default function GraphPage() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<FormNodeData>([]);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState<Edge>([]);

  const [selectedNode, setSelectedNode] =
    useState<FormNode | null>(null);

  const onConnect = (connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  };

  const onNodeClick = (
    _: React.MouseEvent,
    node: FormNode
  ) => {
    setSelectedNode(node);
  };

  // =====================
  // タイトル変更
  // =====================
  const handleTitleChange = (value: string) => {
    if (!selectedNode) return;

    const updatedNode: FormNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        label: value,
      },
    };

    setSelectedNode(updatedNode);

    setNodes((prev) =>
      prev.map((node) =>
        node.id === updatedNode.id ? updatedNode : node
      )
    );
  };

  // =====================
  // 説明変更
  // =====================
  const handleDescriptionChange = (value: string) => {
    if (!selectedNode) return;

    const updatedNode: FormNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        description: value,
      },
    };

    setSelectedNode(updatedNode);

    setNodes((prev) =>
      prev.map((node) =>
        node.id === updatedNode.id ? updatedNode : node
      )
    );
  };

  // =====================
  // fetch
  // =====================
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch(
          "http://localhost/no-code-api/backend/get_forms.php"
        );

        const data: GetFormsResponse =
          await res.json();

        if (data.status !== "success") return;

        const mappedNodes: FormNode[] =
          data.forms.map((form, index) => ({
            id: form.id, // ★そのままID使用（重要）
            type: "default",
            position: {
              x: 200 + index * 250,
              y: 100,
            },
            data: {
              id: form.id, // ★dataにもID保持
              label: form.title,
              description: form.description,
            },
          }));

        setNodes(mappedNodes);
      } catch (err) {
        console.error("フォーム取得エラー", err);
      }
    };

    fetchForms();
  }, [setNodes]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes as any}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        panOnDrag={false}
      />

      {selectedNode && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "#fff",
            padding: 16,
            width: 260,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          <h3>選択中フォーム</h3>

          <p>
            <strong>ID:</strong> {selectedNode.id}
          </p>

          <p>
            <strong>タイトル編集</strong>
          </p>

          <input
            value={selectedNode.data.label}
            onChange={(e) =>
              handleTitleChange(e.target.value)
            }
          />

          <p style={{ marginTop: 12 }}>
            <strong>説明編集</strong>
          </p>

          <textarea
            value={selectedNode.data.description}
            onChange={(e) =>
              handleDescriptionChange(e.target.value)
            }
          />
        </div>
      )}
    </div>
  );
}