export interface KPI {
  kpiTitle: string;
  selfRating: number; 
  managerRating?: number; 
  feedback?: string;
}

export interface KRA {
  kraTitle: string;
  weightage: number;
  kpis: KPI[];
}

export type AppraisalStatus = "draft" | "submitted" | "reviewed" | "approved";

export interface Appraisal {
  _id: string;
  employeeId?: { _id: string; name: string; email: string };
  managerId?: { _id: string; name: string; email: string };
  cycle: string;
  status: AppraisalStatus;
  items: KRA[];
  finalScoreEmployee: number;
  finalScoreManager: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDraftRequest {
  cycle: string;
}

export interface CreateDraftResponse {
  success: boolean;
  appraisal: Appraisal;
}

export interface SaveDraftRequest {
  items: KRA[];
}

export interface SaveDraftResponse {
  success: boolean;
  message: string;
  appraisal: Appraisal;
}

export interface SubmitResponse {
  success: boolean;
  message: string;
  appraisal: Appraisal;
}

export interface ManagerSubmissionsResponse {
  success: boolean;
  submissions: Appraisal[];
}

export interface GetAppraisalResponse {
  success: boolean;
  appraisal: Appraisal;
}
