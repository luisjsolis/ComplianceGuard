import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ComplianceOverview({ 
  totalRequirements = 0, 
  compliantCount = 0, 
  criticalCount = 0, 
  overdueCount = 0 
}) {
  const complianceRate = totalRequirements > 0 ? Math.round((compliantCount / totalRequirements) * 100) : 0;

  const stats = [
    {
      title: "Overall Compliance",
      value: `${complianceRate}%`,
      icon: Shield,
      color: complianceRate >= 90 ? "text-emerald-600" : complianceRate >= 70 ? "text-amber-600" : "text-red-600",
      bgColor: complianceRate >= 90 ? "bg-emerald-50" : complianceRate >= 70 ? "bg-amber-50" : "bg-red-50",
      trend: `${compliantCount}/${totalRequirements} requirements met`
    },
    {
      title: "Critical Issues",
      value: criticalCount,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: criticalCount > 0 ? "Immediate attention required" : "No critical issues"
    },
    {
      title: "Compliant Items",
      value: compliantCount,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: "Requirements up to date"
    },
    {
      title: "Overdue Tasks",
      value: overdueCount,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: overdueCount > 0 ? "Action needed" : "All tasks current"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
          <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} rounded-full opacity-20 transform translate-x-8 -translate-y-8`} />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${stat.color.replace('text-', 'text-').replace('-600', '-700')} border-current`}
              >
                {stat.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}