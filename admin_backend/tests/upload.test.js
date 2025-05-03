const request = require('supertest');
const express = require('express');
const app = require('../app');
const path = require('path');

// Mock storage for uploaded files
const uploadedFiles = [];
const uploadedMetadata = [];

// Override the /api/upload route for testing
app.post('/api/upload', (req, res) => {
  // Simulate receiving a file
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const fileUrls = req.files.map(file => ({
    originalname: file.originalname,
    url: `http://localhost/uploads/${file.originalname}`
  }));

  uploadedFiles.push(...fileUrls);

  res.status(200).json({
    message: 'Files uploaded successfully',
    files: req.files,
    fileUrls: fileUrls.map(f => f.url),
  });
});

// Override the /api/upload/metadata route for testing
app.post('/api/upload/metadata', express.json(), (req, res) => {
  const { fileName, description, category, uploadedBy, tags, fileUrl } = req.body;

  if (!fileName || !fileUrl) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const newMetadata = {
    id: (uploadedMetadata.length + 1).toString(),
    fileName,
    description,
    category,
    uploadedBy,
    tags,
    fileUrl,
    uploadedAt: new Date(),
  };

  uploadedMetadata.push(newMetadata);

  res.status(201).json({ message: 'Metadata saved', metadata: newMetadata });
});

describe('POST /api/upload', () => {
  it('should successfully upload a file', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('files', Buffer.from('dummy file content'), 'testfile.txt');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Files uploaded successfully');
    expect(Array.isArray(res.body.fileUrls)).toBe(true);
  });

  it('should successfully upload metadata', async () => {
    const metadata = {
      fileName: 'testfile.txt',
      description: 'This is a test file',
      category: 'Documents',
      uploadedBy: 'Test User',
      tags: ['test', 'file'],
      fileUrl: 'http://localhost/uploads/testfile.txt',
    };

    const res = await request(app)
      .post('/api/upload/metadata')
      .send(metadata)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Metadata saved');
    expect(res.body.metadata).toHaveProperty('fileName', 'testfile.txt');
    expect(res.body.metadata).toHaveProperty('fileUrl', 'http://localhost/uploads/testfile.txt');
  });

  it('should handle missing file upload', async () => {
    const res = await request(app)
      .post('/api/upload');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'No files uploaded');
  });

  it('should handle missing metadata fields', async () => {
    const res = await request(app)
      .post('/api/upload/metadata')
      .send({})
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Missing fields');
  });
});



