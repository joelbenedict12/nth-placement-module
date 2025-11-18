import { db, storage, auth } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  aiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    parsedContent?: string;
    skills?: string[];
    experience?: any[];
    education?: any[];
  };
}

export interface ResumeUploadData {
  file: File;
  userId?: string;
}

class ResumeService {
  private collectionName = 'resumes';

  // Get all resumes for the current user
  async getResumes(userId?: string): Promise<Resume[]> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser && !userId) {
        throw new Error('User not authenticated');
      }

      const targetUserId = userId || currentUser?.uid;
      if (!targetUserId) {
        throw new Error('User ID not provided');
      }

      const resumesQuery = query(
        collection(db, this.collectionName),
        where('userId', '==', targetUserId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(resumesQuery);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          fileName: data.fileName,
          fileUrl: data.fileUrl,
          fileSize: data.fileSize,
          fileType: data.fileType,
          aiGenerated: data.aiGenerated || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          metadata: data.metadata || {}
        } as Resume;
      });
    } catch (error) {
      console.error('Error getting resumes:', error);
      throw error;
    }
  }

  // Upload a new resume
  async uploadResume(data: ResumeUploadData): Promise<Resume> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser && !data.userId) {
        throw new Error('User not authenticated');
      }

      const targetUserId = data.userId || currentUser?.uid;
      if (!targetUserId) {
        throw new Error('User ID not provided');
      }

      const { file } = data;
      
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      // Upload file to Firebase Storage
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `resumes/${targetUserId}/${fileName}`);
      
      const uploadResult = await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(uploadResult.ref);

      // Create resume document in Firestore
      const resumeData = {
        userId: targetUserId,
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        fileType: file.type,
        aiGenerated: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        metadata: {}
      };

      const docRef = await addDoc(collection(db, this.collectionName), resumeData);
      
      // Get the created document to return
      const docSnap = await getDoc(docRef);
      const createdData = docSnap.data();
      
      return {
        id: docRef.id,
        userId: createdData?.userId || targetUserId,
        fileName: createdData?.fileName || file.name,
        fileUrl: createdData?.fileUrl || fileUrl,
        fileSize: createdData?.fileSize || file.size,
        fileType: createdData?.fileType || file.type,
        aiGenerated: createdData?.aiGenerated || false,
        createdAt: createdData?.createdAt?.toDate() || new Date(),
        updatedAt: createdData?.updatedAt?.toDate() || new Date(),
        metadata: createdData?.metadata || {}
      } as Resume;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }

  // Delete a resume
  async deleteResume(resumeId: string): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Get the resume to delete its storage file
      const resumeDoc = await getDoc(doc(db, this.collectionName, resumeId));
      if (!resumeDoc.exists()) {
        throw new Error('Resume not found');
      }

      const resumeData = resumeDoc.data();
      
      // Check if user owns this resume
      if (resumeData.userId !== currentUser.uid) {
        throw new Error('Unauthorized to delete this resume');
      }

      // Delete file from storage
      try {
        const fileRef = ref(storage, resumeData.fileUrl);
        await deleteObject(fileRef);
      } catch (storageError) {
        console.warn('Error deleting storage file:', storageError);
        // Continue with Firestore deletion even if storage deletion fails
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, this.collectionName, resumeId));
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }

  // Update resume metadata
  async updateResumeMetadata(resumeId: string, metadata: any): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Verify ownership
      const resumeDoc = await getDoc(doc(db, this.collectionName, resumeId));
      if (!resumeDoc.exists()) {
        throw new Error('Resume not found');
      }

      const resumeData = resumeDoc.data();
      if (resumeData.userId !== currentUser.uid) {
        throw new Error('Unauthorized to update this resume');
      }

      await updateDoc(doc(db, this.collectionName, resumeId), {
        metadata: {
          ...resumeData.metadata,
          ...metadata
        },
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating resume metadata:', error);
      throw error;
    }
  }

  // Get a single resume
  async getResume(resumeId: string): Promise<Resume | null> {
    try {
      const resumeDoc = await getDoc(doc(db, this.collectionName, resumeId));
      if (!resumeDoc.exists()) {
        return null;
      }

      const data = resumeDoc.data();
      return {
        id: resumeDoc.id,
        userId: data.userId,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        fileType: data.fileType,
        aiGenerated: data.aiGenerated || false,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        metadata: data.metadata || {}
      } as Resume;
    } catch (error) {
      console.error('Error getting resume:', error);
      throw error;
    }
  }
}

export const resumeService = new ResumeService();
export default resumeService;