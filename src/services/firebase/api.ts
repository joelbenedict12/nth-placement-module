import { resumeService } from './resumeService';
import type { Resume } from './resumeService';
import { auth } from '@/lib/firebase';

// Resume API interface that matches the existing API structure
export interface ResumeAPI {
  getResumes: () => Promise<Resume[]>;
  uploadResume: (file: File) => Promise<Resume>;
  deleteResume: (id: string) => Promise<void>;
  updateResume: (id: string, data: Partial<Resume>) => Promise<void>;
}

// Create a Firebase-based resume API that matches the existing interface
class FirebaseResumeAPI implements ResumeAPI {
  async getResumes(): Promise<Resume[]> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      return await resumeService.getResumes(user.uid);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      throw error;
    }
  }

  async uploadResume(file: File): Promise<Resume> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      return await resumeService.uploadResume({ file, userId: user.uid });
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }

  async deleteResume(id: string): Promise<void> {
    try {
      return await resumeService.deleteResume(id);
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }

  async updateResume(id: string, data: Partial<Resume>): Promise<void> {
    try {
      if (data.metadata) {
        await resumeService.updateResumeMetadata(id, data.metadata);
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      throw error;
    }
  }
}

// Create an instance of the Firebase resume API
export const firebaseResumeAPI = new FirebaseResumeAPI();

// Export the same interface as before, but now using Firebase
export const resumeAPI = firebaseResumeAPI;

// Export types
export type { Resume } from './firebase/resumeService';

// Export auth utilities for Firebase
export const getCurrentUser = () => auth.currentUser;
export const isAuthenticated = () => !!auth.currentUser;