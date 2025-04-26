
const request = require('supertest');
const app = require('../app'); 

describe('Upload API', () => {
  it('should upload files successfully', async () => {
    const res = await request(app)
      .post('/api/upload')
      .field('category', 'test')
      .attach('files', Buffer.from('dummy content'), 'testfile.txt');

    expect(res.statusCode).toBe(200); 
  });
});

