'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ExpenseData {
  category: string;
  amount: number;
  color: string;
}

interface DonutChartProps {
  data: ExpenseData[];
  width?: number;
  height?: number;
}

export default function DonutChart({ 
  data, 
  width = 300, 
  height = 300 
}: DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.5;

    // Create the pie generator
    const pie = d3.pie<ExpenseData>()
      .value(d => d.amount)
      .sort(null);

    // Create the arc generator
    const arc = d3.arc<d3.PieArcDatum<ExpenseData>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 1);

    // Create label arc (for positioning labels)
    const labelArc = d3.arc<d3.PieArcDatum<ExpenseData>>()
      .innerRadius(radius * 0.8)
      .outerRadius(radius * 0.8);

    // Create the main group and center it
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create the pie slices
    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Add the paths (slices)
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        const hoverArc = d3.arc<d3.PieArcDatum<ExpenseData>>()
          .innerRadius(innerRadius)
          .outerRadius(radius + 10);
        
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', hoverArc(d) || '');
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc(d) || '');
      });

    // Add labels
    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.7)')
      .text(d => {
        const percentage = ((d.data.amount / d3.sum(data, d => d.amount)) * 100).toFixed(1);
        return `${percentage}%`;
      });

    // Add center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '28px')
      .style('font-weight', 'bold')
      .style('fill', '#000000')
      .text('Total');

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('fill', '#059669')
      .text(`$${d3.sum(data, d => d.amount).toLocaleString()}`);

  }, [data, width, height]);

  return (
    <div className="flex flex-col items-center">
      <svg ref={svgRef}></svg>
    </div>
  );
}