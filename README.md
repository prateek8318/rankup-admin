# RankUp Admin Dashboard

A professional and modern admin dashboard built with React, TypeScript, and Vite for managing the RankUp platform.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript 5.9, Vite 7
- **UI Framework**: Material-UI (MUI) and Ant Design
- **Styling**: TailwindCSS with custom typography
- **Charts**: Recharts for data visualization
- **Routing**: React Router DOM v7
- **State Management**: Context API with hooks
- **Development**: Hot reload with Vite dev server
- **Build**: Optimized production builds

## 📁 Project Structure

```
src/
├── app/                 # App components and providers
├── components/          # Reusable UI components
│   ├── charts/         # Chart components
│   ├── common/         # Common UI elements
│   └── forms/          # Form components
├── features/           # Feature-based modules
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/teknikoglobal1326/RankUp-Admin-Panel.git
cd rankupadmin
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Update .env with your API configuration
```

4. Start development server:
```bash
npm run dev
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://your-api-server
```

## 🏗️ API Configuration

The application is configured to work with multiple microservices:

- **Authentication**: Port 56924
- **Dashboard**: Port 56924
- **Subscription Plans**: Port 56925
- **Users**: Port 5002
- **Exams & Categories**: Port 5009

## 📊 Key Features

- **User Management**: Manage platform users
- **Exam Management**: Create and manage exams
- **CMS Management**: Content management system
- **Dashboard**: Analytics and insights
- **Master Data**: Manage categories, subjects, languages, etc.
- **Subscription Plans**: Manage subscription tiers

## 🎨 UI Components

- **Material-UI**: Primary component library
- **Ant Design**: Additional UI components
- **TailwindCSS**: Utility-first styling
- **React Icons**: Icon library
- **Recharts**: Data visualization

## 🔒 Security Features

- Environment variable protection
- Secure API proxy configuration
- TypeScript strict mode
- ESLint for code quality



## 🚀 Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please contact the Tekniko Global Team.

---

Built with ❤️ by the Tekniko Gloabal Team
