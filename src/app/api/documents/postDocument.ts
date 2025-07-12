"use server";

import { apiFetcher } from "../utils";
import { ApiResponse } from "../utils/api-fetcher";

export interface DocumentsResponse {
  id: string;
  bucketName: string;
  contentType: string;
  creationTime: string;
  description: string | null;
  fileExtension: string;
  fileName: string;
  fileSize: number;
  fileType: number;
  fileUrl: string;
  kycProcessId: string | null;
  reference: string | null;
  status: number;
  userId: string;
}

export interface DocumentsTableProps {
  refreshTrigger: number;
}

export async function uploadDocumentAction(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, error: "No file provided" };
  }

  const uploadFormData = new FormData();
  uploadFormData.append("file", file);

  const result = await apiFetcher("storage/api/files", {
    method: "POST",
    body: uploadFormData,
  });

  if (result.success) {
    return {
      success: true,
      document: result.data,
      message: result.message || "Document uploaded successfully",
    };
  } else {
    return {
      success: false,
      error: result.message || "Upload failed",
    };
  }
}

export async function getDocumentsAction(): Promise<
  ApiResponse<DocumentsResponse>
> {
  const response = await apiFetcher<DocumentsResponse>(
    "storage/api/files/user",
    {
      method: "GET",
    }
  );

  return response as any;
}
