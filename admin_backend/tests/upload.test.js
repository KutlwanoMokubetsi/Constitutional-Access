const request = require('supertest');
const app = require('../app');
const Metadata = require('../models/Metadata');
const multer = require('multer');

// Mock Azure Storage
jest.mock('../utils/azureStorage', () => ({
  azureStorage: {
    memoryStorage: jest.fn().mockReturnValue({
      _handleFile: jest.fn(),
      _removeFile: jest.fn(),
    }),
  },
}));

// Mock Metadata model
jest.mock('../models/Metadata', () => {
  return {
    find: jest.fn().mockResolvedValue([
      {
        _id: "1",
        fileName: "Test File",
        description: "This is a test",
        category: "Documents",
        fileUrl: "http://localhost/test.pdf",
        uploadedBy: "Alice",
        uploadedAt: new Date(),
      },
    ]),
    save: jest.fn().mockResolvedValue({
      _id: "1",
      fileName: "Test File",
      description: "This is a test",
      category: "Documents",
      fileUrl: "http://localhost/test.pdf",
      uploadedBy: "Alice",
      uploadedAt: new Date(),
    }),
  };
});

describe('POST /api/upload', () => {
  it('should successfully upload a file', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('files', Buffer.from('dummy file content'), 'testfile.txt');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Files uploaded successfully');
  });

  it('should successfully upload metadata', async () => {
    const metadata = {
      fileName: 'testfile.txt',
      description: 'This is a test file',
      category: 'Documents',
      uploadedBy: 'Test User',
      tags: ['test', 'file'],
      fileUrl: 'http://localhost/testfile.txt',
    };

    const res = await request(app)
      .post('/api/upload/metadata')
      .send(metadata)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Metadata saved');
    expect(res.body.metadata).toHaveProperty('fileName', 'testfile.txt');
    expect(res.body.metadata).toHaveProperty('fileUrl', 'http://localhost/testfile.txt');
  });
});


