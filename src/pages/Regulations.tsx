import React, { useState, useEffect } from "react";
import { ComplianceRequirement } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function Regulations() {
  const [requirements, setRequirements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    setIsLoading(true);
    const data = await ComplianceRequirement.list('-created_date');
    setRequirements(data);
    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'non_compliant': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant': return CheckCircle;
      case 'non_compliant': return AlertTriangle;
      case 'in_progress': return Clock;
      default: return Shield;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesType = typeFilter === "all" || req.regulation_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Compliance Regulations</h1>
            <p className="text-slate-600 mt-2">Manage and track all compliance requirements</p>
          </div>
          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Requirement
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="needs_review">Needs Review</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hipaa">HIPAA</SelectItem>
                  <SelectItem value="state_board">State Board</SelectItem>
                  <SelectItem value="osha">OSHA</SelectItem>
                  <SelectItem value="ada">ADA</SelectItem>
                  <SelectItem value="hitech">HITECH</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requirements List */}
        <div className="space-y-4">
          {filteredRequirements.map((requirement) => {
            const StatusIcon = getStatusIcon(requirement.status);
            return (
              <Card key={requirement.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(requirement.priority)} mt-2`}></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{requirement.title}</h3>
                        <p className="text-slate-600 mb-3 line-clamp-2">{requirement.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="outline" className={`${getStatusColor(requirement.status)} border`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {requirement.status?.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-slate-600">
                            {requirement.regulation_type?.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-slate-600">
                            {requirement.priority} priority
                          </Badge>
                          {requirement.due_date && (
                            <span className="text-sm text-slate-500">
                              Due: {format(new Date(requirement.due_date), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>

                  {requirement.notes && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">{requirement.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {filteredRequirements.length === 0 && !isLoading && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Requirements Found</h3>
                <p className="text-slate-600 mb-6">Get started by adding your first compliance requirement</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Requirement
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}