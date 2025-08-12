const request = require('supertest');
const app = require('../index');

describe('Rider API', () => {
  it('should create a rider', async () => {
    const res = await request(app)
      .post('/api/riders')
      .send({
        name: 'Test Rider',
        email: 'test@rider.com',
        position: 'Rider',
        nric: 'S0000000T',
        image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        status: 'active'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe('Test Rider');
  });

  it('should get riders with pagination', async () => {
    const res = await request(app).get('/api/riders?page=1&limit=2');
    expect(res.statusCode).toEqual(200);
    expect(res.body.riders.length).toBeLessThanOrEqual(2);
  });

  it('should search riders by name', async () => {
    const res = await request(app).get('/api/riders?search=Test');
    expect(res.statusCode).toEqual(200);
    expect(res.body.riders[0].name).toContain('Test');
  });
});
