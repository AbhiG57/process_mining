import { BaseEdge, getBezierPath } from '@xyflow/react';

export default function AnimatedDottedEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <g>
      <path
        id={id}
        d={edgePath}
        style={{
          fill: 'none',
          stroke: style.stroke || '#38bdf8',
          strokeWidth: 4,
          strokeDasharray: '6, 8',
          strokeDashoffset: 0,
          animation: 'dotted-flow 1.2s linear infinite',
          ...style,
        }}
        markerEnd={markerEnd}
      />
      <style>{`
        @keyframes dotted-flow {
          to { stroke-dashoffset: -28; }
        }
      `}</style>
    </g>
  );
} 