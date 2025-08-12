import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { format } from "date-fns";

export default function RecentActivity({ activities = [] }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'completed': return CheckCircle;
      case 'overdue': return AlertTriangle;
      case 'document': return FileText;
      default: return Clock;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'completed': return 'text-emerald-600 bg-emerald-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      case 'document': return 'text-blue-600 bg-blue-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const sampleActivities = activities.length === 0 ? [
    { type: 'completed', message: 'HIPAA Privacy Policy updated', time: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { type: 'overdue', message: 'Staff cybersecurity training deadline passed', time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { type: 'document', message: 'New OSHA compliance certificate uploaded', time: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { type: 'pending', message: 'Risk assessment scheduled for next week', time: new Date(Date.now() - 6 * 60 * 60 * 1000) },
  ] : activities;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sampleActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {format(activity.time, 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}