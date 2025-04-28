const request = require('supertest');
const app = require('../app');

// Mock azureStorage inside the test file
jest.mock('../utils/azureStorage', () => {
  const multer = require('multer');
  return {
    azureStorage: multer.memoryStorage(), // use in-memory storage
  };
});

describe('POST /api/upload', () => {
  it('should successfully upload a file', async () => {
    const res = await request(app)
      .post('/api/upload') // your backend route
      .attach('files', Buffer.from('dummy file content'), 'testfile.txt');

    expect(res.statusCode).toBe(200);
    // you can also check if your controller returns expected response
    expect(res.body).toHaveProperty('message'); // adjust depending on your controller
  });

  it('should successfully upload metadata', async () => {
    const metadata = {
      fileName: 'testfile.txt',
      description: 'This is a test file',
      category: 'Documents',
      uploadedBy: 'Test User',
    };

    const res = await request(app)
      .post('/api/upload/metadata') // your metadata upload route
      .send(metadata)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message'); // adjust if you send something else back
  });
});
