# Incubation Platform

A comprehensive platform for managing incubation programs with role-based access control, supporting 8 distinct user roles: Admin, Director, Operations, Consultant, Funder, Government, Corporate, and Incubatee.

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Ant Design 5.x
- **Framework**: Refine.dev
- **Backend**: Firebase (Authentication, Firestore, Storage, Functions)
- **Deployment**: Vercel

## 🏗️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project

### 1. Clone the Repository

```bash
git clone https://github.com/thegreatgabuza/Incubation-Platform.git
cd Incubation-Platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with your Firebase configuration:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com  
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### How to get Firebase credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Select your web app or click "Add app" to create one
6. Copy the configuration values to your `.env` file

### 4. Firebase Setup

Ensure your Firebase project has the following services enabled:

- **Authentication**: Email/Password provider enabled
- **Firestore Database**: In production mode
- **Storage**: Default bucket created
- **Functions**: (Optional) For advanced features

### 5. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

### 7. Type Checking

```bash
npm run type-check
```

## 👥 Demo Accounts

The platform includes 8 demo accounts with Zulu names for testing:

| Role | Email | Password | Name |
|------|-------|----------|------|
| Admin | admin@demodbn.co.za | Demo@123 | Nomsa Mthembu |
| Director | director@demodbn.co.za | Demo@123 | Sipho Ndlovu |
| Operations | operations@demodbn.co.za | Demo@123 | Thandi Zulu |
| Consultant | consultant@demodbn.co.za | Demo@123 | Mandla Dlamini |
| Funder | funder@demodbn.co.za | Demo@123 | Zanele Nkomo |
| Government | government@demodbn.co.za | Demo@123 | Bongani Mkhize |
| Corporate | corporate@demodbn.co.za | Demo@123 | Lindiwe Buthelezi |
| Incubatee | incubatee@demodbn.co.za | Demo@123 | Sizani Mbeki |

### Seeding Demo Data

To create demo accounts in your Firebase project:

```bash
npm run seed:all
```

## 🔐 User Roles & Permissions

### Admin
- Complete system access and user management
- Form creation and management
- System configuration and settings

### Director  
- High-level oversight and reporting
- Strategic decision making
- Performance monitoring

### Operations
- Day-to-day platform management
- Participant management
- Compliance monitoring
- Resource allocation

### Consultant
- Mentorship assignments
- Participant guidance
- Progress tracking

### Funder
- Investment opportunities review
- Due diligence processes
- Portfolio management
- Analytics and reporting

### Government
- Participant directory access
- Program oversight
- Impact reporting
- Policy alignment

### Corporate
- Partnership opportunities
- Collaboration management
- Resource sharing

### Incubatee
- Application submission
- Progress tracking
- Resource access
- Mentorship interaction

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
├── routes/              # Page components organized by role
├── providers/           # Auth, data, and access control providers
├── config/              # Application configuration
├── types/               # TypeScript type definitions
├── utilities/           # Helper functions
├── scripts/             # Database seeding scripts
└── firebase.ts          # Firebase configuration
```

## 🛠️ Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run type-check` - Run TypeScript type checking
- `npm run seed:all` - Seed demo users to Firebase

## 🚀 Deployment

The application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Vercel

Add the same environment variables from your `.env` file to your Vercel project settings.

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration  
- `tsconfig.build.json` - Production build TypeScript config
- `vercel.json` - Vercel deployment configuration

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.