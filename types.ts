export enum Role {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  RADIOGRAPHER = 'RADIOGRAPHER'
}

export enum Language {
  MS = 'MS', // Bahasa Melayu
  EN = 'EN'  // English
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export interface User {
  username: string;
  password?: string; // Optional for listing, required for login
  role: Role;
  fullName: string;
}

export interface BodyPartOption {
  id: string;
  category: string;
  projection: string;
}

export interface DoseRecord {
  partId: string;
  doseAmount: string; // e.g., "2.5 mGy"
}

export interface XRayRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  icNumber: string;
  uitmId?: string;
  gender: 'Male' | 'Female';
  lmpDate?: string;
  history: string;
  parts: BodyPartOption[]; // Selected parts
  
  status: RequestStatus;
  createdAt: number;
  
  // Radiographer fields
  radiographerId?: string;
  radiographerName?: string;
  rejectedReason?: string;
  
  arrivalTimestamp?: number;
  examStartTimestamp?: number;
  examEndTimestamp?: number;
  
  doses?: DoseRecord[];
}

// For AI Service
export interface ClinicalAdviceResponse {
  advice: string;
}