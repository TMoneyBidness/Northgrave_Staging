# Deploy NorthGrave.com - Quick Steps

## AWS Deployment (Do this now)

### 1. Create S3 Bucket (5 min)
https://s3.console.aws.amazon.com/

- Click "Create bucket"
- Name: `northgrave.com`
- Region: `us-east-1` (or your preferred)
- **UNCHECK** "Block all public access"
- Click "Create bucket"

### 2. Enable Static Website Hosting (2 min)
- Click your bucket → "Properties" tab
- Scroll down → "Static website hosting" → "Edit"
- Enable it
- Index document: `index.html`
- Save

### 3. Add Bucket Policy (2 min)
- "Permissions" tab → "Bucket policy" → "Edit"
- Paste this:

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

- Save

### 4. Upload Your Files (2 min)
- "Objects" tab → "Upload"
- Drag and drop:
  - index.html
  - styles.css
  - background.gif
- Click "Upload"

### 5. Request SSL Certificate (10 min)
https://console.aws.amazon.com/acm/home?region=us-east-1

- **IMPORTANT**: Must be in `us-east-1` region for CloudFront
- Click "Request certificate"
- Certificate type: Public
- Domain names:
  - `northgrave.com`
  - `*.northgrave.com`
- Validation: DNS validation
- Click "Request"
- Click on your certificate → "Create records in Route 53" OR copy CNAME records
- **If not using Route 53**: Add the CNAME records to Cloudflare DNS manually
- Wait until status = "Issued" (5-10 min)

### 6. Create CloudFront Distribution (5 min)
https://console.aws.amazon.com/cloudfront/

- Click "Create distribution"
- **Origin domain**: Select `northgrave.com.s3.amazonaws.com` from dropdown
- **Origin access**: "Origin access control settings"
  - Click "Create control setting" → "Create"
- **Viewer protocol policy**: "Redirect HTTP to HTTPS"
- **Alternate domain names (CNAMEs)**:
  - `northgrave.com`
  - `www.northgrave.com`
- **Custom SSL certificate**: Select your certificate from dropdown
- **Default root object**: `index.html`
- Click "Create distribution"

### 7. Update S3 Bucket Policy (1 min)
- You'll see a blue banner at top saying "Update S3 bucket policy"
- Click "Copy policy"
- Go back to S3 → your bucket → "Permissions" → "Bucket policy" → "Edit"
- Replace with the new policy
- Save

### 8. Get CloudFront URL (1 min)
- Wait for distribution status: "Deploying" → "Enabled" (10-15 min)
- Copy the "Distribution domain name" (looks like `d1234abcd.cloudfront.net`)
- **SAVE THIS URL** - you need it for Cloudflare

---

## Cloudflare DNS Setup (Do after AWS is done)

### 9. Add DNS Records
https://dash.cloudflare.com/

- Select `northgrave.com` → "DNS" → "Records"
- Delete any existing A/CNAME for `@` and `www`

**Add Record 1:**
- Type: `CNAME`
- Name: `@`
- Target: `[YOUR_CLOUDFRONT_URL]` (from step 8)
- Proxy: ON (orange cloud)
- Save

**Add Record 2:**
- Type: `CNAME`
- Name: `www`
- Target: `[YOUR_CLOUDFRONT_URL]` (from step 8)
- Proxy: ON (orange cloud)
- Save

### 10. SSL Settings
- "SSL/TLS" → Set to "Full (strict)"

---

## Done!

Wait 5-10 minutes, then visit:
- https://northgrave.com
- https://www.northgrave.com

Your site is live!
