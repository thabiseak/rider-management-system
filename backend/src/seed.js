const mongoose = require('mongoose');
const Rider = require('./models/Rider');

mongoose.connect('mongodb://localhost:27017/riderdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const riders = [
  {
    name: 'Admin User',
    email: 'admin@rider.com',
    position: 'Administrator',
    nric: 'S1234567A',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    status: 'active'
  },
  {
    name: 'Jane Doe',
    email: 'jane@rider.com',
    position: 'Lead Rider',
    nric: 'S7654321B',
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
    status: 'active'
  },
  {
    name: 'John Smith',
    email: 'john@rider.com',
    position: 'Rider',
    nric: 'S2345678C',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    status: 'inactive'
  }
];

async function seed() {
  await Rider.deleteMany({});
  await Rider.insertMany(riders);
  console.log('Database seeded!');
  mongoose.disconnect();
}

seed();
