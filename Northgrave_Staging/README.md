# Northgrave Pictures Website

A cinematic, brand-forward website built with Astro, featuring a password-protected Vault for partner/investor materials.

## Tech Stack

- **Framework**: Astro (static-first)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0 with custom design tokens
- **Animations**: Framer Motion
- **Hosting**: AWS S3 + CloudFront
- **Auth**: CloudFront signed cookies + Lambda
- **IaC**: AWS CDK

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   ├── sections/     # Hero, About, Team, Projects
│   │   ├── ui/           # FlipCard, Marquee, Button
│   │   └── vault/        # PasswordForm
│   ├── layouts/          # BaseLayout
│   ├── pages/
│   │   ├── index.astro   # Home page
│   │   └── vault/        # Vault pages
│   ├── styles/           # Global CSS, animations
│   └── lib/              # Utilities
├── content/              # JSON content files
├── public/               # Static assets
├── infrastructure/cdk/   # AWS CDK infrastructure
└── lambda/               # Auth Lambda function
```

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Content Updates

Content is stored in JSON files in the `/content` directory:

- `site.json` - Global copy, navigation, meta tags
- `team.json` - Team members
- `projects.json` - Project cards

## Deployment

### Staging (staging.northgrave.com)
Push to `main` branch → Auto-deploys via GitHub Actions.

### Production (northgrave.com)
1. Verify changes on staging.northgrave.com
2. Merge main into release:
   ```bash
   git checkout release
   git merge main
   git push origin release
   ```
3. GitHub Actions auto-deploys to production
4. Verify at northgrave.com

### Manual Deploy (emergency)
Use `workflow_dispatch` trigger in GitHub Actions UI:
1. Go to Actions tab → select workflow → Run workflow
2. Choose the target branch

### AWS Infrastructure
```bash
cd infrastructure/cdk
npm install
npm run deploy:staging    # Deploy staging infrastructure
npm run deploy:production # Deploy production infrastructure
npm run deploy:auth       # Deploy auth stack
```

## Environment Variables (GitHub Secrets)

- `AWS_DEPLOY_ROLE_ARN` - IAM role ARN for deployments
- `STAGING_CLOUDFRONT_DISTRIBUTION_ID` - Staging CloudFront ID
- `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` - Production CloudFront ID

## Vault Authentication

The Vault uses CloudFront signed cookies for access control:

1. User enters password on `/vault`
2. Password validated by Lambda function
3. Signed cookies returned (24hr TTL)
4. CloudFront allows access to `/vault/*` paths

## Design System

### Colors

```css
--night: #050509          /* Dark background */
--night-deep: #010103     /* Deeper variant */
--ember: #f26f25          /* Primary accent */
--ember-core: #ffbe6f     /* Light accent */
--text: rgba(238,228,206,0.88)  /* Body text */
--text-gold: rgba(244,214,144,0.92)  /* Headings */
```

### Typography

- **Display**: Cinzel (serif)
- **Body**: Poppins (sans-serif)
- **UI**: Inter (sans-serif)

## License

Proprietary - Northgrave Pictures
