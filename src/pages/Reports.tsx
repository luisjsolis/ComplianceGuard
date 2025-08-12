import React, { useState, useEffect } from "react";
import { ComplianceRequirement, ComplianceTask, ComplianceDocument, StaffTraining } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { Download, TrendingUp, AlertTriangle, FileText, Calendar } from "lucide-react";
import { format, subDays, subMonths } from "date-fns";

export default function Reports() {
  const [requirements, setRequirements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [timeRange, setTimeRange] = useState("30");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reqData, taskData, docData, trainingData] = await Promise.all([
        ComplianceRequirement.list(),
        ComplianceTask.list(),
        ComplianceDocument.list(),
        StaffTraining.list()
      ]);
      setRequirements(reqData);
      setTasks(taskData);
      setDocuments(docData);
      setTrainings(trainingData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  // Compliance Status Distribution
  const complianceData = [
    { name: 'Compliant', value: requirements.filter(r => r.status === 'compliant').length, color: '#10b981' },
    { name: 'In Progress', value: requirements.filter(r => r.status === 'in_progress').length, color: '#3b82f6' },
    { name: 'Non-Compliant', value: requirements.filter(r => r.status === 'non_compliant').length, color: '#ef4444' },
    { name: 'Needs Review', value: requirements.filter(r => r.status === 'needs_review').length, color: '#f59e0b' }
  ];

  // Task Status by Priority
  const tasksByPriority = [
    { 
      priority: 'Critical', 
      pending: tasks.filter(t => t.priority === 'critical' && t.status === 'pending').length,
      in_progress: tasks.filter(t => t.priority === 'critical' && t.status === 'in_progress').length,
      completed: tasks.filter(t => t.priority === 'critical' && t.status === 'completed').length
    },
    { 
      priority: 'High', 
      pending: tasks.filter(t => t.priority === 'high' && t.status === 'pending').length,
      in_progress: tasks.filter(t => t.priority === 'high' && t.status === 'in_progress').length,
      completed: tasks.filter(t => t.priority === 'high' && t.status === 'completed').length
    },
    { 
      priority: 'Medium', 
      pending: tasks.filter(t => t.priority === 'medium' && t.status === 'pending').length,
      in_progress: tasks.filter(t => t.priority === 'medium' && t.status === 'in_progress').length,
      completed: tasks.filter(t => t.priority === 'medium' && t.status === 'completed').length
    },
    { 
      priority: 'Low', 
      pending: tasks.filter(t => t.priority === 'low' && t.status === 'pending').length,
      in_progress: tasks.filter(t => t.priority === 'low' && t.status === 'in_progress').length,
      completed: tasks.filter(t => t.priority === 'low' && t.status === 'completed').length
    }
  ];

  // Regulation Type Distribution
  const regulationTypes = [
    { name: 'HIPAA', value: requirements.filter(r => r.regulation_type === 'hipaa').length, color: '#3b82f6' },
    { name: 'State Board', value: requirements.filter(r => r.regulation_type === 'state_board').length, color: '#8b5cf6' },
    { name: 'OSHA', value: requirements.filter(r => r.regulation_type === 'osha').length, color: '#f59e0b' },
    { name: 'ADA', value: requirements.filter(r => r.regulation_type === 'ada').length, color: '#10b981' },
    { name: 'Other', value: requirements.filter(r => r.regulation_type === 'other').length, color: '#6b7280' }
  ].filter(item => item.value > 0);

  const exportReport = async () => {
    const reportData = {
      summary: {
        totalRequirements: requirements.length,
        compliantRequirements: requirements.filter(r => r.status === 'compliant').length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        totalDocuments: documents.length,
        expiredDocuments: documents.filter(d => d.status === 'expired').length,
        totalTrainings: trainings.length,
        expiredTrainings: trainings.filter(t => t.status === 'expired').length
      },
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compliance-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Compliance Reports</h1>
            <p className="text-slate-600 mt-2">Comprehensive analytics and compliance insights</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 3 Months</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReport} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Compliance Rate</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {requirements.length > 0 ? Math.round((requirements.filter(r => r.status === 'compliant').length / requirements.length) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Critical Issues</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {requirements.filter(r => r.priority === 'critical' && r.status !== 'compliant').length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Task Completion</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Document Health</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {documents.length > 0 ? Math.round(((documents.length - documents.filter(d => d.status === 'expired').length) / documents.length) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Compliance Status Distribution */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complianceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Regulation Types */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">Requirements by Regulation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regulationTypes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Status by Priority */}
        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Tasks by Priority & Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tasksByPriority}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="priority" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
                  <Bar dataKey="in_progress" stackId="a" fill="#3b82f6" name="In Progress" />
                  <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Report */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{requirements.length}</p>
                <p className="text-sm text-slate-600">Total Requirements</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
                <p className="text-sm text-slate-600">Total Tasks</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
                <p className="text-sm text-slate-600">Documents Stored</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{trainings.length}</p>
                <p className="text-sm text-slate-600">Training Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}