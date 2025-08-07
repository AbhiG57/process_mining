import { BaseEdge, getBezierPath, EdgeProps } from '@xyflow/react';

interface AnimatedDottedEdgeProps extends EdgeProps {
  style?: React.CSSProperties;
  markerEnd?: string;
}

export default function AnimatedDottedEdge({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  sourcePosition, 
  targetPosition, 
  style = {}, 
  markerEnd 
}: AnimatedDottedEdgeProps): JSX.Element {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <g>
      <path
        id={id}
        d={edgePath}
        style={{
          fill: 'none',
          stroke: (style as any).stroke || '#38bdf8',
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