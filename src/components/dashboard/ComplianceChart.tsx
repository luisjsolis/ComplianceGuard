import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function ComplianceChart({ requirements = [] }) {
  // Calculate compliance status distribution
  const statusCounts = requirements.reduce((acc, req) => {
    const status = req.status || 'needs_review';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    { name: 'Compliant', value: statusCounts.compliant || 0, color: '#10b981' },
    { name: 'In Progress', value: statusCounts.in_progress || 0, color: '#3b82f6' },
    { name: 'Non-Compliant', value: statusCounts.non_compliant || 0, color: '#ef4444' },
    { name: 'Needs Review', value: statusCounts.needs_review || 0, color: '#f59e0b' }
  ].filter(item => item.value > 0);

  // Sample data if no requirements
  const sampleData = chartData.length === 0 ? [
    { name: 'Compliant', value: 15, color: '#10b981' },
    { name: 'In Progress', value: 8, color: '#3b82f6' },
    { name: 'Non-Compliant', value: 3, color: '#ef4444' },
    { name: 'Needs Review', value: 6, color: '#f59e0b' }
  ] : chartData;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">Compliance Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sampleData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {sampleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} items`, name]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}