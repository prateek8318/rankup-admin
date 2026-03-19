# CSS Organization Structure

This directory contains all CSS files organized by their purpose and location in the application.

## Directory Structure

### `/styles/auth/`
- `ForgotPasswordPage.module.css` - Styles for forgot password page
- `LoginPage.module.css` - Styles for login page  
- `TwoStepVerificationPage.module.css` - Styles for two-step verification page

### `/styles/components/`
- `Dashboard.module.css` - Styles for dashboard component
- `LoginForm.module.css` - Styles for login form component

### `/styles/features/`
- `CMS.module.css` - Styles for CMS feature
- `LanguagesContent.module.css` - Styles for languages content feature
- `Subscriptions.module.css` - Styles for subscriptions feature
- `Users.module.css` - Styles for users feature

### `/styles/pages/`
- `Exams.module.css` - Styles for exams page
- `Qualifications.module.css` - Styles for qualifications page
- `States.module.css` - Styles for states page
- `Streams.module.css` - Styles for streams page

### Root Level Files
- `index.css` - Main entry point CSS file
- `globals.css` - Global styles and utility classes
- `designSystem.css` - Design system tokens and base styles
- `commonStyles.ts` - Common style constants and configurations
- `dashboardCardStyles.ts` - Dashboard card specific styles

## Import Convention

All CSS imports should use the `@/styles/` prefix:

```typescript
// For feature-specific styles
import styles from '@/styles/features/ModuleName.module.css';

// For page-specific styles  
import styles from '@/styles/pages/PageName.module.css';

// For component-specific styles
import styles from '@/styles/components/ComponentName.module.css';

// For auth-related styles
import styles from '@/styles/auth/AuthComponent.module.css';
```

## Benefits of This Structure

1. **Scalable**: Easy to add new styles in appropriate directories
2. **Maintainable**: Clear organization makes finding styles intuitive
3. **Consistent**: Standardized import paths across the application
4. **Modular**: Each feature/page/component has its own scoped styles
5. **Reusable**: Common styles are centralized and easily accessible
