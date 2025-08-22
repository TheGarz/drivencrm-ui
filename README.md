# CRM V2 UI/UX Design System

This project contains the UI/UX design and prototyping for the next generation CRM V2 interface.

## 🚀 Quick Start for Dev Team

### Demo Login Credentials

**Demo Accounts Available:**

| Email | Password | Role | Access Level |
|-------|----------|------|--------------|
| `admin@driven.com` | `demo123` | Super Admin | Full system access |
| `owner@demo.com` | `demo123` | Company Owner | Company-wide analytics |
| `manager@demo.com` | `demo123` | Branch Manager | Branch-level metrics |
| `tech@demo.com` | `demo123` | Technician | Limited technician view |
| `demo@driven.com` | `demo123` | Demo User | General access |

**Two-Factor Authentication:**
- All accounts have 2FA enabled for testing
- Use any 6-digit code (e.g., `123456`) for demo purposes
- The system accepts any 6-digit combination during development

### Development Access

1. **Local Development URL**: [http://localhost:5174](http://localhost:5174)
2. **Default Port**: 5174 (Vite development server)
3. **Hot Reload**: Enabled - changes reflect immediately

## Project Structure

```
CRMV2-UI/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── LoginScreen.tsx          # Login interface
│   │   ├── RoleBasedDashboard.tsx   # Main dashboard
│   │   ├── TwoFactorScreen.tsx      # 2FA verification
│   │   ├── ForgotPasswordScreen.tsx # Password recovery
│   │   └── ...                      # Other components
│   ├── auth/               # Authentication context and logic
│   ├── theme/              # Theme system and styling
│   ├── pages/              # Page components and layouts
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets and brand logos
└── package.json            # Dependencies and scripts
```

## Development Environment Setup

### Prerequisites

⚠️ **IMPORTANT: Node.js Version Requirement**

This project requires **Node.js 20.19.0 or higher** (recommended: 22.12.0+) due to Vite 7 requirements.

**Check your current version:**
```bash
node --version
```

**If you need to upgrade:**

Using nvm (recommended):
```bash
# Install and use Node.js 22.12.0
nvm install 22.12.0
nvm use 22.12.0

# Or use the latest LTS
nvm install --lts
nvm use --lts
```

**Version compatibility:**
- ✅ **Node.js 22.12.0+** - Fully supported
- ✅ **Node.js 20.19.0+** - Supported  
- ❌ **Node.js 18.x** - **Will cause dev server errors**
- ❌ **Node.js 16.x or lower** - Not supported

### Getting Started

1. **Install dependencies:**
```bash
npm install --legacy-peer-deps
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open browser:** [http://localhost:5174](http://localhost:5174)

### Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎨 UI/UX Features & Components

### Current Implementation Status
- ✅ **Authentication Flow** - Complete login, 2FA, password recovery
- ✅ **Theme System** - Dark/Light themes with "Coastal Dawn" and "Deep Current"
- ✅ **Role-Based Dashboards** - Different views for Admin, Owner, Manager, Tech
- ✅ **Responsive Design** - Mobile-first approach with desktop optimization
- 🚧 **Dashboard Analytics** - In progress, basic charts implemented
- 🚧 **Integration Management** - UI components ready, data integration pending
- ⏳ **User Management** - Planned for next iteration

### Key UI Components

#### Authentication System
- **LoginScreen** (`src/components/LoginScreen.tsx`) - Modern login with branded design
- **TwoFactorScreen** - SMS/App-based 2FA verification
- **ForgotPasswordScreen** - Password recovery workflow
- **ResetPasswordScreen** - Secure password reset interface

#### Dashboard Components
- **RoleBasedDashboard** - Dynamic dashboard based on user permissions
- **DrivenPestControlDashboard** - Industry-specific analytics interface
- **CompanyAdminDashboard** - Administrative controls and company metrics

#### Theme & Design System
- **Custom Theme Engine** (`src/theme/`) - Centralized theming with CSS variables
- **Brand Guidelines** - Consistent Driven Software visual identity
- **Responsive Breakpoints** - Mobile, tablet, desktop optimizations
- **Animation Library** - Smooth transitions and micro-interactions

### Design Goals

This project focuses purely on UI/UX design and prototyping for CRM V2, without backend dependencies. The goal is to:

- 🎯 **Design modern, intuitive user interfaces** for CRM workflows
- 🧩 **Create reusable component libraries** for consistent design
- 🔄 **Prototype user workflows and interactions** before development
- 📋 **Establish design systems and guidelines** for the full application
- ✅ **Test UX concepts** with stakeholders and gather feedback

## 📊 Current Dashboard Features

### Multi-Role Analytics Interface
The dashboard adapts based on user role and permissions:

**Super Admin View:**
- Complete system analytics and user management
- Cross-company metrics and performance data
- System configuration and integration management

**Company Owner View:**
- Company-wide revenue and performance metrics
- Branch comparison analytics
- Integration status and health monitoring

**Branch Manager View:**
- Branch-specific performance data
- Team productivity metrics
- Local customer analytics

**Technician View:**
- Personal performance metrics
- Schedule and route optimization
- Customer service history

### Key Dashboard Sections

1. **📈 Analytics Hub** - Revenue trends, customer analytics, performance charts
2. **🔗 Integrations** - ServiceTitan, Google Reviews, Route4Me GPS, CallRail connections  
3. **📊 Metrics Views** - Owner/Branch/Technician level analytics
4. **👥 User Management** - Staff permissions and access control
5. **⭐ Review Analytics** - Google/Yelp review monitoring and response management
6. **⚙️ System Settings** - Configuration, preferences, and customization

## 🛠 Technology Stack

- **React 19** - Latest UI framework with concurrent features
- **TypeScript 5.8** - Full type safety and enhanced developer experience
- **Vite 7** - Lightning-fast build tool and development server
- **Lucide React** - Modern icon library with 1000+ scalable icons
- **Recharts** - Responsive chart library for data visualization
- **SCSS/CSS3** - Advanced styling with CSS modules and variables

## 🚨 Important Notes for Dev Team

### ⚠️ Critical Setup Requirements

**Node.js Version Issue:**
- Current environment is running Node.js 18.20.6
- **Development server WILL FAIL** with Node.js 18.x
- **Production build works** but development requires Node.js 20.19.0+
- Update Node.js before running `npm run dev`

**Build Status:**
- ✅ **Production build** - Works with Node.js 18.x+
- ❌ **Development server** - Requires Node.js 20.19.0+
- ✅ **TypeScript compilation** - No errors
- ⚠️ **ESLint warnings** - 98 style issues (non-blocking)

### ⚠️ Work In Progress
This UI/UX prototype is **actively under development** and will require regular updates as new features are implemented. The README will be updated accordingly.

### 🔄 Development Workflow
1. **Feature Design** - UI/UX components are designed and prototyped here first
2. **Stakeholder Review** - Designs are reviewed and approved before backend integration
3. **Component Export** - Finalized components will be extracted for the main application
4. **Integration** - Components will be integrated with the main AppServer backend

### 🤝 Team Collaboration
- **Designers**: Focus on `src/components/` and `src/theme/` directories
- **Frontend Developers**: Test responsive behavior and component interactions
- **Backend Developers**: Review component APIs for integration planning
- **Product Managers**: Use demo accounts to test user workflows

### 📝 Feedback & Issues
- Create issues for UI/UX improvements or bugs
- Test all demo accounts and different screen sizes
- Verify theme switching and responsive behavior
- Document any new components or features added

### 🔐 Security Notes
- Demo credentials are for development only
- No real data should be used in this prototype
- 2FA implementation is mocked for UI testing
- Authentication is simulated, not connected to real auth services

---

## 📞 Support

For questions about this UI prototype:
- **Development Issues**: Check with the frontend team lead
- **Design Questions**: Consult with the UI/UX designer
- **Integration Planning**: Coordinate with backend team

> **Remember**: This is a design prototype focused on UI/UX. All data and authentication are simulated for development purposes.