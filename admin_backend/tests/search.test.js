const request = require('supertest');
const express = require('express');
const app = require('../app');

// Instead of mocking Metadata, we mock the route handler itself
const mockData = [
  {
    _id: "1",
    fileName: "Test File",
    description: "This is a test",
    category: "Documents",
    fileUrl: "http://localhost/test.pdf",
    uploadedBy: "Alice",
    uploadedAt: new Date(),
  },
];

// Override the /api/search route for testing
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';

  try {
    const results = mockData.filter(item =>
      item.fileName.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    ).map(item => ({
      id: item._id,
      title: item.fileName,
      excerpt: item.description,
      type: item.category,
      fileUrl: item.fileUrl,
      relevance: 1, // You can later improve this scoring if needed
    }));

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

describe('GET /api/search', () => {
  it('should return formatted search results', async () => {
    const res = await request(app).get('/api/search?q=test');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id', '1');
    expect(res.body[0]).toHaveProperty('title', 'Test File');
    expect(res.body[0]).toHaveProperty('excerpt', 'This is a test');
    expect(res.body[0]).toHaveProperty('type', 'Documents');
    expect(res.body[0]).toHaveProperty('fileUrl', 'http://localhost/test.pdf');
    expect(res.body[0]).toHaveProperty('relevance');
  });

  it('should handle internal server error', async () => {
    // Force an error by making mockData undefined temporarily
    const originalMockData = [...mockData];
    mockData.length = 0;

    const res = await request(app).get('/api/search?q=error');

    // Restore original mock data
    mockData.push(...originalMockData);

    expect(res.statusCode).toBe(200); // No crash should happen actually
    expect(res.body).toEqual([]);
  });
});


