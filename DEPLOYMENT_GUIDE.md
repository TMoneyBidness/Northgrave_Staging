# NorthGrave Deployment Guide

## Part 1: AWS S3 + CloudFront Setup

### Step 1: Create S3 Bucket
1. Go to AWS S3 Console: https://s3.console.aws.amazon.com/
2. Click "Create bucket"
3. Bucket name: `northgrave.com`
4. Region: Choose closest to your audience (e.g., us-east-1)
5. Uncheck "Block all public access"
6. Click "Create bucket"

### Step 2: Configure S3 for Static Website Hosting
1. Click on your `northgrave.com` bucket
2. Go to "Properties" tab
3. Scroll to "Static website hosting" → Click "Edit"
4. Enable static website hosting
5. Index document: `index.html`
6. Click "Save changes"

### Step 3: Set Bucket Policy
1. Go to "Permissions" tab
2. Scroll to "Bucket policy" → Click "Edit"
3. Paste this policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::northgrave.com/*"
        }
    ]
}
```

4. Click "Save changes"

### Step 4: Upload Website Files
1. Go to "Objects" tab
2. Click "Upload"
3. Add these files:
   - index.html
   - styles.css
   - background.gif
4. Click "Upload"

### Step 5: Create CloudFront Distribution
1. Go to CloudFront Console: https://console.aws.amazon.com/cloudfront/
2. Click "Create distribution"
3. **Origin domain**: Select your S3 bucket `northgrave.com.s3.amazonaws.com`
4. **Origin access**: Select "Origin access control settings (recommended)"
5. Click "Create control setting" → Click "Create"
6. **Viewer protocol policy**: Redirect HTTP to HTTPS
7. **Alternate domain names (CNAMEs)**: Add:
   - `northgrave.com`
   - `www.northgrave.com`
8. **Custom SSL certificate**: Click "Request certificate" (opens ACM)
   - Request a certificate for `northgrave.com` and `*.northgrave.com`
   - Use DNS validation
   - Add the CNAME records to Cloudflare
   - Wait for validation (5-10 minutes)
   - Return to CloudFront and select your certificate
9. **Default root object**: `index.html`
10. Click "Create distribution"

### Step 6: Update S3 Bucket Policy for CloudFront
After creating the distribution, AWS will show a banner to update the S3 bucket policy. Click "Copy policy" and update your bucket policy to allow CloudFront access.

### Step 7: Get CloudFront Distribution URL
1. Wait for distribution status to change from "Deploying" to "Enabled" (5-15 minutes)
2. Copy the "Distribution domain name" (e.g., `d1234abcd.cloudfront.net`)

---

## Part 2: Cloudflare Email Routing Setup

### Step 1: Access Cloudflare Email Routing
1. Log in to Cloudflare: https://dash.cloudflare.com/
2. Select your domain: `northgrave.com`
3. Go to "Email" → "Email Routing" in the left sidebar

### Step 2: Enable Email Routing
1. Click "Get started" or "Enable Email Routing"
2. Cloudflare will automatically add required DNS records:
   - MX records
   - TXT records for SPF
3. Click "Enable"

### Step 3: Create Destination Addresses
1. Click "Destination addresses" tab
2. Click "Add destination address"
3. Enter your personal email (e.g., your.email@gmail.com)
4. Verify the email by clicking the link sent to your inbox
5. Repeat for a second email if needed

### Step 4: Create Routing Rules
1. Go to "Routing rules" tab
2. Click "Create address"

**For Cheryl:**
- Custom address: `cheryl`
- Action: Send to → Select your verified destination email
- Click "Save"

**For Justin:**
- Click "Create address" again
- Custom address: `justin`
- Action: Send to → Select your verified destination email (or different one)
- Click "Save"

### Step 5: Test Email Routing
Send test emails to:
- cheryl@northgrave.com
- justin@northgrave.com

They should forward to your destination email(s).

---

## Part 3: Point Cloudflare DNS to CloudFront

### Step 1: Add DNS Records in Cloudflare
1. Go to "DNS" → "Records" in Cloudflare
2. Delete any existing A/CNAME records for `@` and `www`

**Add these records:**

**Record 1:**
- Type: `CNAME`
- Name: `@` (or `northgrave.com`)
- Target: Your CloudFront distribution domain (e.g., `d1234abcd.cloudfront.net`)
- Proxy status: Proxied (orange cloud)
- TTL: Auto

**Record 2:**
- Type: `CNAME`
- Name: `www`
- Target: Your CloudFront distribution domain (e.g., `d1234abcd.cloudfront.net`)
- Proxy status: Proxied (orange cloud)
- TTL: Auto

### Step 2: SSL/TLS Settings
1. Go to "SSL/TLS" in Cloudflare
2. Set encryption mode to "Full (strict)"

### Step 3: Test Your Website
Wait 5-10 minutes for DNS propagation, then visit:
- https://northgrave.com
- https://www.northgrave.com

---

## Cost Estimate

- **S3**: ~$0.50/month (for storage + requests)
- **CloudFront**: Free tier: 1TB transfer/month, then ~$0.085/GB
- **Cloudflare Email Routing**: FREE
- **Total**: ~$1-3/month for typical small website traffic

---

## Future Updates

To update your website:
1. Make changes to your local files
2. Go to S3 Console → `northgrave.com` bucket
3. Upload the modified files (will overwrite)
4. Go to CloudFront → Your distribution → "Invalidations"
5. Create invalidation for `/*` to clear cache
6. Changes will be live in 5-10 minutes
