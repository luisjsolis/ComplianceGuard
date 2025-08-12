import React, { useState, useEffect } from "react";
import { StaffTraining } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Users, GraduationCap, Calendar, Award, AlertTriangle } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function Staff() {
  const [trainings, setTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    setIsLoading(true);
    const data = await StaffTraining.list('-completion_date');
    setTrainings(data);
    setIsLoading(false);
  };

  const getTrainingTypeColor = (type) => {
    switch (type) {
      case 'hipaa': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cybersecurity': return 'bg-red-100 text-red-800 border-red-200';
      case 'data_handling': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'emergency_procedures': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'equipment_safety': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getExpirationStatus = (expirationDate) => {
    if (!expirationDate) return null;
    
    const daysUntilExpiry = differenceInDays(new Date(expirationDate), new Date());
    if (daysUntilExpiry < 0) return { status: 'expired', text: 'Expired', urgent: true };
    if (daysUntilExpiry <= 30) return { status: 'expiring', text: `Expires in ${daysUntilExpiry} days`, urgent: true };
    return { status: 'current', text: `Expires ${format(new Date(expirationDate), 'MMM d, yyyy')}`, urgent: false };
  };

  const getStatusColor = (status, expirationDate) => {
    if (expirationDate) {
      const daysUntilExpiry = differenceInDays(new Date(expirationDate), new Date());
      if (daysUntilExpiry < 0) return 'bg-red-100 text-red-800 border-red-200';
      if (daysUntilExpiry <= 30) return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.staff_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.training_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || training.training_type === typeFilter;
    const matchesStatus = statusFilter === "all" || training.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Group trainings by staff member
  const groupedTrainings = filteredTrainings.reduce((acc, training) => {
    const key = training.staff_email;
    if (!acc[key]) {
      acc[key] = {
        staff_name: training.staff_name,
        staff_email: training.staff_email,
        trainings: []
      };
    }
    acc[key].trainings.push(training);
    return acc;
  }, {});

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Staff Training</h1>
            <p className="text-slate-600 mt-2">Track team member training and certifications</p>
          </div>
          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Training Record
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search staff or training..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Training Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hipaa">HIPAA</SelectItem>
                  <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="data_handling">Data Handling</SelectItem>
                  <SelectItem value="emergency_procedures">Emergency Procedures</SelectItem>
                  <SelectItem value="equipment_safety">Equipment Safety</SelectItem>
                  <SelectItem value="general_compliance">General Compliance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Staff Training Records */}
        <div className="space-y-6">
          {Object.values(groupedTrainings).map((staffMember, index) => (
            <Card key={staffMember.staff_email} className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{staffMember.staff_name}</CardTitle>
                      <p className="text-sm text-slate-600">{staffMember.staff_email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-slate-600">
                    {staffMember.trainings.length} training{staffMember.trainings.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staffMember.trainings.map((training) => {
                    const expirationStatus = getExpirationStatus(training.expiration_date);
                    
                    return (
                      <Card key={training.id} className="border border-slate-200 relative">
                        {expirationStatus?.urgent && (
                          <div className={`absolute top-0 right-0 w-0 h-0 border-l-[30px] border-b-[30px] border-l-transparent ${
                            expirationStatus.status === 'expired' ? 'border-b-red-500' : 'border-b-amber-500'
                          }`}>
                            <AlertTriangle className="absolute -top-5 -right-5 w-2.5 h-2.5 text-white transform rotate-45" />
                          </div>
                        )}
                        
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-slate-100 rounded-lg">
                              <GraduationCap className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 line-clamp-2">{training.training_title}</h4>
                              <Badge variant="outline" className={`${getTrainingTypeColor(training.training_type)} border text-xs mt-1`}>
                                {training.training_type?.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Completed:</span>
                              <span className="text-slate-900">
                                {format(new Date(training.completion_date), 'MMM d, yyyy')}
                              </span>
                            </div>
                            
                            {training.score && (
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Score:</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-900 font-medium">{training.score}%</span>
                                  {training.score >= 80 && <Award className="w-3 h-3 text-green-600" />}
                                </div>
                              </div>
                            )}
                            
                            {expirationStatus && (
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Status:</span>
                                <span className={`text-sm font-medium ${
                                  expirationStatus.urgent 
                                    ? (expirationStatus.status === 'expired' ? 'text-red-600' : 'text-amber-600')
                                    : 'text-slate-900'
                                }`}>
                                  {expirationStatus.text}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {training.certificate_url && (
                            <Button variant="outline" size="sm" className="w-full mt-3">
                              <Award className="w-3 h-3 mr-1" />
                              View Certificate
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          {Object.keys(groupedTrainings).length === 0 && !isLoading && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Training Records Found</h3>
                <p className="text-slate-600 mb-6">Add the first staff training record to get started</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Training Record
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}