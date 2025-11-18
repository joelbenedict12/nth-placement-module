import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, Eye, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { documentAPI, Document } from "@/services/api";
import { toast } from "sonner";

const Documents = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploadingFiles, setUploadingFiles] = useState<{[key: string]: number}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: documentAPI.getDocuments,
  });

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: ({ file, documentType }: { file: File; documentType: string }) =>
      documentAPI.uploadDocument(file, documentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    },
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: (id: string) => documentAPI.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete document');
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate upload progress
      const fileId = Date.now().toString();
      setUploadingFiles(prev => ({ ...prev, [fileId]: 0 }));
      
      // Simulate progress
      const interval = setInterval(() => {
        setUploadingFiles(prev => {
          const newProgress = (prev[fileId] || 0) + 10;
          if (newProgress >= 90) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [fileId]: newProgress };
        });
      }, 200);

      uploadDocumentMutation.mutate(
        { file, documentType },
        {
          onSuccess: () => {
            setUploadingFiles(prev => ({ ...prev, [fileId]: 100 }));
            setTimeout(() => {
              setUploadingFiles(prev => {
                const newState = { ...prev };
                delete newState[fileId];
                return newState;
              });
            }, 1000);
          },
          onSettled: () => {
            clearInterval(interval);
          },
        }
      );
    }
  };

  const handleViewDocument = async (document: Document) => {
    try {
      const response = await fetch(document.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      toast.error('Failed to view document');
    }
  };

  const getDocumentIcon = (documentType: string) => {
    switch (documentType) {
      case 'tenth_marksheet':
        return '📊';
      case 'twelfth_marksheet':
        return '📈';
      case 'resume':
        return '📄';
      default:
        return '📎';
    }
  };

  const getDocumentTitle = (documentType: string) => {
    switch (documentType) {
      case 'tenth_marksheet':
        return '10th Marksheet';
      case 'twelfth_marksheet':
        return '12th Marksheet';
      case 'resume':
        return 'Resume';
      default:
        return 'Document';
    }
  };

  const documentSections = [
    {
      type: 'tenth_marksheet',
      title: '10th Grade Marksheet',
      description: 'Upload your 10th grade marksheet for verification',
      required: true,
    },
    {
      type: 'twelfth_marksheet',
      title: '12th Grade Marksheet',
      description: 'Upload your 12th grade marksheet for verification',
      required: true,
    },
    {
      type: 'resume',
      title: 'Resume',
      description: 'Your latest resume document',
      required: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-100 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-100">Documents & Certificates</h1>
              <p className="mt-2 text-sm text-slate-400">
                Upload and manage your academic documents and certificates
              </p>
            </div>
            <Button 
              onClick={() => navigate('/student')}
              variant="outline"
              className="border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {documentSections.map((section) => {
            const sectionDocuments = documents?.filter(doc => doc.documentType === section.type) || [];
            const hasDocument = sectionDocuments.length > 0;
            const isUploading = Object.values(uploadingFiles).some(progress => progress > 0 && progress < 100);

            return (
              <Card key={section.type} className="border-slate-800 bg-slate-900/60">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-slate-100">
                        {getDocumentIcon(section.type)} {section.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {section.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {section.required && (
                        <Badge 
                          variant={hasDocument ? "secondary" : "destructive"}
                          className={hasDocument ? "bg-green-500/20 text-green-300" : ""}
                        >
                          {hasDocument ? (
                            <><CheckCircle className="h-3 w-3 mr-1" />Required</>
                          ) : (
                            <><AlertCircle className="h-3 w-3 mr-1" />Required</>
                          )}
                        </Badge>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, section.type)}
                        className="hidden"
                        id={`upload-${section.type}`}
                      />
                      <Button
                        onClick={() => document.getElementById(`upload-${section.type}`)?.click()}
                        disabled={hasDocument || isUploading || uploadDocumentMutation.isPending}
                        className="bg-gradient-to-r from-accent-cyan to-accent-purple"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isUploading && Object.entries(uploadingFiles).map(([fileId, progress]) => (
                    <div key={fileId} className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">Uploading...</span>
                        <span className="text-sm text-slate-400">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2 bg-slate-800" />
                    </div>
                  ))}

                  {sectionDocuments.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-700 rounded-lg">
                      <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 mb-2">No documents uploaded</p>
                      <p className="text-xs text-slate-500">
                        {section.required ? "This document is required for your profile" : "Upload a document to complete your profile"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sectionDocuments.map((document) => (
                        <div key={document.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-950/70">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-slate-400" />
                            <div>
                              <p className="text-sm font-medium text-slate-100">{document.fileName}</p>
                              <p className="text-xs text-slate-400">
                                Uploaded {new Date(document.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {document.verified && (
                              <Badge className="bg-green-500/20 text-green-300 border-0">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDocument(document)}
                              className="h-7 px-2 text-slate-400 hover:text-slate-200"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteDocumentMutation.mutate(document.id)}
                              disabled={deleteDocumentMutation.isPending}
                              className="h-7 px-2 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="border-slate-800 bg-slate-900/60 mt-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Document Status</CardTitle>
            <CardDescription className="text-slate-400">
              Track your document submission progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Required Documents</span>
                <span className="text-sm font-medium text-slate-100">
                  {documentSections.filter(s => s.required).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Uploaded Documents</span>
                <span className="text-sm font-medium text-green-400">
                  {documents?.filter(doc => 
                    documentSections.filter(s => s.required).some(s => s.type === doc.documentType)
                  ).length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Verified Documents</span>
                <span className="text-sm font-medium text-accent-cyan">
                  {documents?.filter(doc => doc.verified).length || 0}
                </span>
              </div>
              <Progress 
                value={((documents?.filter(doc => 
                  documentSections.filter(s => s.required).some(s => s.type === doc.documentType)
                ).length || 0) / documentSections.filter(s => s.required).length) * 100}
                className="h-2 bg-slate-800"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;