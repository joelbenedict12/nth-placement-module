import express from 'express';
import { supabase, upload } from '../server.js';

const router = express.Router();

// Upload 10th marksheet
router.post('/10th-marksheet', upload.single('document'), async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Store document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        student_id: profile.id,
        document_type: '10th_marksheet',
        original_filename: file.originalname,
        file_data: file.buffer,
        file_mimetype: file.mimetype,
        file_size: file.size,
        status: 'pending_verification',
        uploaded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (docError) {
      throw docError;
    }

    // Update student profile to mark document as uploaded
    await supabase
      .from('student_profiles')
      .update({ 
        tenth_marksheet_uploaded: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id);

    res.json({
      message: '10th marksheet uploaded successfully',
      document: {
        id: document.id,
        status: document.status,
        uploaded_at: document.uploaded_at
      }
    });
  } catch (error) {
    console.error('Upload 10th marksheet error:', error);
    res.status(500).json({ error: 'Failed to upload 10th marksheet' });
  }
});

// Upload 12th marksheet
router.post('/12th-marksheet', upload.single('document'), async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Store document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        student_id: profile.id,
        document_type: '12th_marksheet',
        original_filename: file.originalname,
        file_data: file.buffer,
        file_mimetype: file.mimetype,
        file_size: file.size,
        status: 'pending_verification',
        uploaded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (docError) {
      throw docError;
    }

    // Update student profile to mark document as uploaded
    await supabase
      .from('student_profiles')
      .update({ 
        twelfth_marksheet_uploaded: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id);

    res.json({
      message: '12th marksheet uploaded successfully',
      document: {
        id: document.id,
        status: document.status,
        uploaded_at: document.uploaded_at
      }
    });
  } catch (error) {
    console.error('Upload 12th marksheet error:', error);
    res.status(500).json({ error: 'Failed to upload 12th marksheet' });
  }
});

// Upload other documents (resume, certificates, etc.)
router.post('/other', upload.single('document'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { document_type, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!document_type) {
      return res.status(400).json({ error: 'Document type is required' });
    }

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Store document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        student_id: profile.id,
        document_type: document_type,
        description: description || '',
        original_filename: file.originalname,
        file_data: file.buffer,
        file_mimetype: file.mimetype,
        file_size: file.size,
        status: 'active',
        uploaded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (docError) {
      throw docError;
    }

    res.json({
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        document_type: document.document_type,
        status: document.status,
        uploaded_at: document.uploaded_at
      }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Get student's documents
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const { data: documents, error } = await supabase
      .from('documents')
      .select('id, document_type, original_filename, status, uploaded_at, description')
      .eq('student_id', profile.id)
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ documents: documents || [] });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Get specific document
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const documentId = req.params.id;

    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('student_id', profile.id)
      .single();

    if (error || !document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Set appropriate headers for file download
    res.setHeader('Content-Type', document.file_mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${document.original_filename}"`);
    res.setHeader('Content-Length', document.file_size);

    res.send(document.file_data);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const documentId = req.params.id;

    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('student_id', profile.id);

    if (error) {
      throw error;
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;