# 🚗 Rider Management System

A modern, responsive web application for managing rider information, built with React.js frontend and Node.js backend.

## ✨ Features

- **User Management**: Add, edit, delete, and view rider profiles
- **Image Upload**: Profile picture management with compression
- **Search & Filter**: Find riders by name, email, ID, or status
- **Responsive Design**: Works perfectly on all devices
- **Real-time Updates**: Instant data synchronization
- **Modern UI/UX**: Beautiful, intuitive interface

## 🏗️ Architecture

```
rider/
├── frontend/          # React.js application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── config/       # Configuration files
│   │   └── App.js        # Main application
│   └── public/           # Static assets
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── index.js      # Server entry point
│   │   └── models/       # Data models
│   └── riders.json       # Data storage
└── deploy.sh          # Deployment automation script
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Local Development
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd rider
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   cd backend && npm install && cd ..
   
   # Install frontend dependencies
   cd frontend && npm install && cd ..
   ```

3. **Start the application:**
   ```bash
   # Terminal 1: Start backend
   cd backend && npm start
   
   # Terminal 2: Start frontend
   cd frontend && npm start
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

## 🌐 Deployment

### Option 1: Automated Deployment (Recommended)
```bash
# Run the deployment script
./deploy.sh
```

This script will:
- ✅ Check prerequisites
- 📦 Install dependencies
- 🔨 Build the frontend
- 🧪 Test the backend
- 📋 Provide deployment instructions

### Option 2: Manual Deployment

#### Frontend (Vercel - Free)
1. **Build the application:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `build`
   - Deploy!

#### Backend (Railway - $5/month)
1. **Go to [railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Set environment variables:**
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your frontend URL
4. **Deploy automatically**

### Environment Variables

#### Frontend (.env.production)
```bash
REACT_APP_API_URL=https://your-backend-url.railway.app
```

#### Backend (Railway Dashboard)
```bash
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## 🔧 Configuration

### CORS Settings
The backend automatically configures CORS based on the environment:
- **Development**: Allows localhost and network IPs
- **Production**: Only allows the specified frontend domain

### Image Handling
- **File Size Limit**: 5MB maximum
- **Compression**: Automatic resizing to 800x800px
- **Format**: JPEG with 70% quality
- **Storage**: Base64 encoded in JSON

## 📱 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/riders` | Get all riders (with pagination) |
| GET | `/api/riders/:id` | Get specific rider |
| POST | `/api/riders` | Create new rider |
| PUT | `/api/riders/:id` | Update existing rider |
| DELETE | `/api/riders/:id` | Delete rider |

### Query Parameters
- `search`: Search by name, email, or ID
- `page`: Page number for pagination
- `limit`: Items per page

## 🎨 UI Components

- **RiderCard**: Individual rider display
- **RiderForm**: Add/edit rider form
- **RiderProfile**: Detailed rider view
- **PremiumModal**: Enhanced features modal
- **PremiumLoader**: Loading animations

## 🛠️ Technologies Used

### Frontend
- **React.js**: UI framework
- **CSS3**: Styling and animations
- **Axios**: HTTP client
- **React Icons**: Icon library

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **File System**: JSON-based data storage

## 📊 Performance

- **Frontend Bundle**: ~66KB (gzipped)
- **CSS Bundle**: ~8.5KB (gzipped)
- **Image Compression**: Automatic optimization
- **Lazy Loading**: Component-based code splitting

## 🔒 Security Features

- **CORS Protection**: Domain-based access control
- **Input Validation**: Server-side data validation
- **File Type Validation**: Image upload restrictions
- **Size Limits**: Payload size restrictions

## 🧪 Testing

```bash
# Test backend
cd backend && npm test

# Test frontend build
cd frontend && npm run build
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS_ORIGIN environment variable
   - Verify frontend and backend URLs

2. **Image Upload Failures**
   - Ensure image is under 5MB
   - Check file format (JPG, PNG, GIF)

3. **Build Failures**
   - Verify Node.js version (16+)
   - Clear npm cache: `npm cache clean --force`

### Debug Commands
```bash
# Check backend logs
railway logs

# Test API endpoints
curl https://your-backend-url.com/api/riders

# Check frontend build
npm run build
```

## 📈 Monitoring

- **Backend Health**: `/api/riders` endpoint
- **Error Logging**: Console and Railway logs
- **Performance**: Bundle size analysis
- **Uptime**: Railway dashboard monitoring

## 🔄 Updates & Maintenance

### Regular Tasks
- [ ] Monitor Railway usage and costs
- [ ] Check for dependency updates
- [ ] Review error logs
- [ ] Test all CRUD operations

### Backup Strategy
- **Data**: JSON file backup
- **Code**: GitHub repository
- **Configuration**: Environment variables

## 💰 Cost Breakdown

- **Vercel**: Free tier
- **Railway**: $5/month (basic plan)
- **Total**: $5/month for production deployment

## 🎯 Roadmap

- [ ] User authentication system
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: See `DEPLOYMENT.md` for detailed deployment
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions

---

**Happy Riding! 🚗💨**

Built with ❤️ using React.js and Node.js
