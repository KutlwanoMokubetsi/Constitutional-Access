const request = require('supertest');
const express = require('express');
const searchRoutes = require('../routes/search'); // adjust path if needed

// Mock the Metadata model
jest.mock('../models/Metadata', () => ({
  find: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue([
    {
      _id: '123',
      fileName: 'Test File',
      description: 'Test Description',
      category: 'Test Category',
      fileUrl: 'https://example.com/file.pdf',
      uploadedAt: new Date(),
    },
  ]),
}));

const Metadata = require('../models/Metadata');

const app = express();
app.use(express.json());
app.use('/api/search', searchRoutes);

describe('GET /api/search', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return search results when query is provided', async () => {
    const res = await request(app).get('/api/search?q=test');

    expect(res.statusCode).toBe(200);
    expect(Metadata.find).toHaveBeenCalledWith({
      $or: [
        { fileName: { $regex: 'test', $options: 'i' } },
        { description: { $regex: 'test', $options: 'i' } },
        { category: { $regex: 'test', $options: 'i' } },
        { uploadedBy: { $regex: 'test', $options: 'i' } },
      ],
    });
    expect(res.body[0]).toHaveProperty('title', 'Test File');
    expect(res.body[0]).toHaveProperty('excerpt', 'Test Description');
    expect(res.body[0]).toHaveProperty('type', 'Test Category');
  });

  it('should return search results when tags are provided', async () => {
    const res = await request(app).get('/api/search?tags=tag1,tag2');

    expect(res.statusCode).toBe(200);
    expect(Metadata.find).toHaveBeenCalledWith({
      tags: { $in: ['tag1', 'tag2'] },
    });
    expect(res.body[0]).toHaveProperty('title', 'Test File');
  });

  it('should handle server errors', async () => {
    Metadata.limit.mockRejectedValueOnce(new Error('DB Error'));

    const res = await request(app).get('/api/search?q=error');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
  });
});
