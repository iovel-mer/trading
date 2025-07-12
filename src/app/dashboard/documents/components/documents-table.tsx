"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw } from "lucide-react";
import {
  type DocumentsResponse,
  type DocumentsTableProps,
  getDocumentsAction,
} from "@/app/api/documents/postDocument";

export function DocumentsTable({ refreshTrigger }: DocumentsTableProps) {
  const [documents, setDocuments] = useState<DocumentsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError("");

    const result = await getDocumentsAction();

    if (result.success && result.data) {
      setDocuments(result.data as any);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const getFileIcon = (contentType: string) => {
    return <FileText className="h-5 w-5 text-muted-foreground" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            Your uploaded documents will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading documents...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            Your uploaded documents will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchDocuments} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documents ({documents.length})</CardTitle>
          <CardDescription>
            Your uploaded documents and their details.
          </CardDescription>
        </div>
        <Button onClick={fetchDocuments} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {getFileIcon(document.contentType)}
                  <div>
                    <p className="font-medium">{document.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      File ID: {document.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {document.fileExtension.replace(".", "").toUpperCase() ||
                      "Unknown"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
