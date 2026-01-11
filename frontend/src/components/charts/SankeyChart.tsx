"use client";

import {
  Sankey,
  Tooltip,
  ResponsiveContainer,
  Layer,
  Rectangle,
} from "recharts";

interface SankeyChartProps {
  data: {
    nodes: { name: string }[];
    links: { source: number; target: number; value: number }[];
  };
}

export default function SankeyChart({ data }: SankeyChartProps) {
  // Custom Node Content to render labels properly
  const renderNode = (props: any) => {
    const { x, y, width, height, index, payload, containerWidth } = props;
    const isOut = x + width + 6 > containerWidth;
    
    return (
      <Layer key={`CustomNode${index}`}>
        <Rectangle
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#5192ca"
          fillOpacity="1"
        />
        <text
          textAnchor={isOut ? 'end' : 'start'}
          x={isOut ? x - 6 : x + width + 6}
          y={y + height / 2}
          fontSize="12"
          fill="#333"
          stroke="none"
          dominantBaseline="middle" // Vertical alignment
        >
          {payload.name}
        </text>
        <text
          textAnchor={isOut ? 'end' : 'start'}
          x={isOut ? x - 6 : x + width + 6}
          y={y + height / 2 + 16}
          fontSize="10"
          fill="#888"
          stroke="none"
          dominantBaseline="middle"
        >
          {payload.value?.toFixed(2)}
        </text>
      </Layer>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Sankey
        data={data}
        node={renderNode}
        nodePadding={50}
        margin={{
          left: 10,
          right: 150, // More space for labels on the right
          top: 10,
          bottom: 10,
        }}
        link={{ stroke: '#77c878', fill: 'none' }}
      >
        <Tooltip />
      </Sankey>
    </ResponsiveContainer>
  );
}
