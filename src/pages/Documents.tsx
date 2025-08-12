import React, { useState, useEffect } from "react";
import { ComplianceDocument } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, FileText, Download, Eye, Calendar, AlertTriangle } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    const data = await ComplianceDocument.list('-created_date');
    setDocuments(data);
    setIsLoading(false);
  };

  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case 'certificate': return '📜';
      case 'policy': return '📋';
      case 'procedure': return '📝';
      case 'audit_report': return '📊';
      case 'training_record': return '🎓';
      case 'risk_assessment': return '⚠️';
      default: return '📄';
    }
  };

  const getStatusColor = (status, expirationDate) => {
    if (expirationDate) {
      const daysUntilExpiry = differenceInDays(new Date(expirationDate), new Date());
      if (daysUntilExpiry < 0) return 'bg-red-100 text-red-800 border-red-200';
      if (daysUntilExpiry <= 30) return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    
    switch (status) {
      case 'current': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending_renewal': return 'bg-amber-100 text-amber-800 border-amber-200';
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || doc.document_type === typeFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Document Vault</h1>
            <p className="text-slate-600 mt-2">Secure storage for compliance documents and certificates</p>
          </div>
          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="audit_report">Audit Report</SelectItem>
                  <SelectItem value="training_record">Training Record</SelectItem>
                  <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending_renewal">Pending Renewal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => {
            const expirationStatus = getExpirationStatus(document.expiration_date);
            
            return (
              <Card key={document.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                {expirationStatus?.urgent && (
                  <div className={`absolute top-0 right-0 w-0 h-0 border-l-[40px] border-b-[40px] border-l-transparent ${
                    expirationStatus.status === 'expired' ? 'border-b-red-500' : 'border-b-amber-500'
                  }`}>
                    <AlertTriangle className="absolute -top-6 -right-6 w-3 h-3 text-white transform rotate-45" />
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-2xl">{getDocumentTypeIcon(document.document_type)}</div>
                    <Badge variant="outline" className={`${getStatusColor(document.status, document.expiration_date)} border text-xs`}>
                      {document.status?.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{document.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {document.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">{document.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Type:</span>
                      <span className="text-slate-900 font-medium">{document.document_type?.replace('_', ' ')}</span>
                    </div>
                    
                    {document.regulation_type && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Regulation:</span>
                        <span className="text-slate-900 font-medium">{document.regulation_type.toUpperCase()}</span>
                      </div>
                    )}
                    
                    {expirationStatus && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Expiration:</span>
                        <span className={`font-medium ${expirationStatus.urgent ? (expirationStatus.status === 'expired' ? 'text-red-600' : 'text-amber-600') : 'text-slate-900'}`}>
                          {expirationStatus.text}
                        </span>
                      </div>
                    )}
                    
                    {document.tags && document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {document.file_url && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredDocuments.length === 0 && !isLoading && (
            <div className="col-span-full">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Documents Found</h3>
                  <p className="text-slate-600 mb-6">Upload your first compliance document to get started</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload First Document
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}