import React, { useState, useEffect } from "react";
import { ComplianceRequirement, ComplianceTask } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import ComplianceOverview from "../components/dashboard/ComplianceOverview";
import RecentActivity from "../components/dashboard/RecentActivity";
import ComplianceChart from "../components/dashboard/ComplianceChart";

export default function Dashboard() {
  const [requirements, setRequirements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reqData, taskData] = await Promise.all([
        ComplianceRequirement.list('-created_date'),
        ComplianceTask.list('-created_date', 10)
      ]);
      setRequirements(reqData);
      setTasks(taskData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setIsLoading(false);
  };

  const getStats = () => {
    const total = requirements.length;
    const compliant = requirements.filter(r => r.status === 'compliant').length;
    const critical = requirements.filter(r => r.priority === 'critical' && r.status !== 'compliant').length;
    const overdue = tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      return new Date(t.due_date) < new Date();
    }).length;

    return { total, compliant, critical, overdue };
  };

  const stats = getStats();
  const upcomingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Compliance Dashboard</h1>
            <p className="text-slate-600 mt-2">Monitor your dental practice's security compliance status</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link to={createPageUrl("Tasks")} className="flex-1 md:flex-none">
              <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-100">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </Link>
            <Link to={createPageUrl("Regulations")} className="flex-1 md:flex-none">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                View All
              </Button>
            </Link>
          </div>
        </div>

        {/* Compliance Overview Stats */}
        <ComplianceOverview
          totalRequirements={stats.total}
          compliantCount={stats.compliant}
          criticalCount={stats.critical}
          overdueCount={stats.overdue}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Upcoming Tasks */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Upcoming Tasks
                  {upcomingTasks.length > 0 && (
                    <Badge variant="outline" className="text-slate-600">
                      {upcomingTasks.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{task.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge 
                              variant={task.priority === 'critical' ? 'destructive' : 'outline'}
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                            {task.due_date && (
                              <span className="text-xs text-slate-500">
                                Due: {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {task.priority === 'critical' && (
                          <AlertTriangle className="w-5 h-5 text-red-500 ml-4" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500">No pending tasks found</p>
                    <Link to={createPageUrl("Tasks")}>
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                        Create First Task
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Compliance Chart */}
          <div>
            <ComplianceChart requirements={requirements} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <RecentActivity />
          
          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link to={createPageUrl("Regulations")}>
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-medium">Add Regulation</span>
                  </Button>
                </Link>
                <Link to={createPageUrl("Documents")}>
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:bg-emerald-50 hover:border-emerald-300">
                    <Plus className="w-6 h-6 text-emerald-600" />
                    <span className="text-sm font-medium">Upload Document</span>
                  </Button>
                </Link>
                <Link to={createPageUrl("Staff")}>
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300">
                    <Plus className="w-6 h-6 text-purple-600" />
                    <span className="text-sm font-medium">Add Training</span>
                  </Button>
                </Link>
                <Link to={createPageUrl("Reports")}>
                  <Button variant="outline" className="w-full h-20 flex-col gap-2 hover:bg-amber-50 hover:border-amber-300">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                    <span className="text-sm font-medium">View Reports</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}