# NorthGrave Website

## Local Development

1. Add your background GIF file as `background.gif` in this directory
2. Run: `npm start`
3. The site will open at http://localhost:3000

## AWS Hosting Options

### Option 1: Amazon S3 + CloudFront (Recommended for static sites)
- **Cost**: ~$1-5/month for small traffic
- **Steps**:
  1. Create S3 bucket named `northgrave.com`
  2. Enable static website hosting
  3. Upload index.html, styles.css, and background.gif
  4. Create CloudFront distribution
  5. Point Cloudflare DNS to CloudFront distribution

### Option 2: AWS Amplify
- **Cost**: Free tier available, then ~$0.15/GB
- **Steps**:
  1. Push code to GitHub
  2. Connect AWS Amplify to repository
  3. Amplify auto-deploys on commits
  4. Point Cloudflare DNS to Amplify URL

### Option 3: EC2 with Nginx
- **Cost**: ~$3.50/month (t2.micro)
- More complex, overkill for a simple landing page

## Email Setup (cheryl@northgrave.com)

### Option 1: Amazon WorkMail
- **Cost**: $4/user/month
- **Steps**:
  1. Go to AWS WorkMail console
  2. Create organization
  3. Add domain: northgrave.com
  4. Add verification TXT records to Cloudflare DNS
  5. Add MX records to Cloudflare DNS
  6. Create user: cheryl@northgrave.com

### Option 2: Amazon SES + Third-party Email Client
- **Cost**: $0 for receiving, minimal for sending
- **Steps**:
  1. Verify domain in SES
  2. Add TXT/MX records to Cloudflare
  3. Set up email receiving rules
  4. Forward to existing email or use with Lambda

### Option 3: Keep Email with Cloudflare
- Cloudflare offers Email Routing (free) to forward emails
- Can forward cheryl@northgrave.com to your existing email

## Cloudflare DNS Configuration

Once you choose hosting, add these records in Cloudflare:
- **A Record**: Point to AWS IP (S3/CloudFront/EC2)
- **CNAME**: www.northgrave.com → northgrave.com
- **MX Records**: For email service (from chosen email provider)
