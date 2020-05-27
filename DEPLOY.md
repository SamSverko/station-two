# deploy

Notes on deployment process.

---

## Front end

1) **AWS Route 53** - Domain registration and DNS configuration.
2) **AWS S3 bucket** - Hosting `/build` directory as a static website.
3) **AWS CloudFront & Certificate Manager:** - SSL-enabled distribution.
4) **AWS IAM & GitHub Action:** - Automatically deploy `/build` directory to S3 and invalidate CloudFront distribution on push to master.

---

### AWS Route 53 setup

- **Register domain:**
  - Navigate to **AWS Route 53** service.
  - Search and purchase your domain: `stationtwo.ca` (replace `stationtwo.ca` with whatever domain you register).
  - Wait for status to update to **Domain registration successful** (you can proceed with the **AWS S3 bucket setup** in the meantime).

---

### AWS S3 bucket setup

- **Create bucket:**
  - Navigate to **AWS S3** service.
  - **Name and region:**
    - **Bucket name:** `stationtwo.ca`.
    - **Region:** select US EAST (N. Virginia).
  - **Configure options:**
    - All default.
  - **Set permissions:**
    - **Block all public access:** uncheck.
    - **I acknowledge that the current settings may result in this bucket and the objects within becoming public:** check.
- **Add build directory to bucket (this will be automated by GitHub action setup later):**
  - Perform a React build, inside project `/client` directory, run `npm run build`.
  - Upload all contents of `/build` folder S3 bucket.
- **Enable S3 bucket for static website hosting:**
  - Enter bucket details and select the **Properties** tab.
  - Enable the **Static website hosting** option.
  - Select the option **Use this bucket to host a website**.
  - **Index document:** `index.html`.
  - Select **Save**.
- **Update S3 bucket policy:**
  - Enter bucket details and select the **Permissions** tab.
  - Select the **Bucket Policy** tab.
  - **Enter the following policy:**
    ```
    {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Sid": "AllowPublicReadAccess",
              "Effect": "Allow",
              "Principal": "*",
              "Action": "s3:GetObject",
              "Resource": "arn:aws:s3:::stationtwo.ca/*"
          }
      ]
    }
    ```
  - Select **Save**.

---

### AWS CloudFront & Certificate Manager setup

- **Create distribution:**
  - Navigate to **AWS CloudFront** service.
  - Select **Create Distribution**.
  - Select **Web**.
  - **Origin Domain Name:** select the AWS S3 bucket created earlier (it should appear in the field dropdown).
  - **Origin ID:** `S3-stationtwo.ca`.
  - Leave remaining configuration as default.
  - **Distribution settings:**
    - **Alternate Domain Names (CNAMEs)**: `stationtwo.ca` and `www.stationtwo.ca`
    - **SSL Certificate**: select **Request or Import a Certificate with ACM** (this will direct you to the **AWS Certificate Manager** service).
    - **Request a certificate:**
      - **Add domain names:** `*.stationtwo.ca` and select **Next**.
      - **Select validation method:** select **DNS validation** and select **Next**.
      - Follow remaining steps.
  - Once distribution is created, wait for **Status** to change to **Deloyed**.
  - Take note of the distribution ID (will be used later in the **GitHub Action setup**).
- **Add CloudFront distribution to Route 53 DNS:**
  - Navigate to **Route 53** service.
  - **Create or edit A record:**
    - Select existing record set or select **Create Record Set**.
    - **Name:** `stationtwo.ca`.
    - **Type:** select A - IPv4 address.
    - **Alias:** select Yes.
    - **Alias Target:** select CloudFront distribution recently created.
    - **Routing Policy:** select Simple.
  - **Create or edit CNAME (www) record:**
    - Select existing record set or select **Create Record Set**.
    - **Name:** `www.stationtwo.ca`.
    - **Type:** select A - IPv4 address.
    - **Alias:** select Yes.
    - **Alias Target:** select CloudFront distribution recently created.
    - **Routing Policy:** select Simple.

Now visit either `stationtwo.ca` or `www.stationtwo.ca` and it should display your React site!

---

### AWS IAM & GitHub Action

Follow these steps to automate the deployment process of your build directory to your AWS S3 bucket on push to master.

- **Create IAM role with proper permissions:**
  - Create new group for role:
    - Navigate to **AWS IAM** service.
    - Select **Groups**.
    - Select **Create New Group**.
    - Group Name: `DeployToS3` and select **Next Step**.
    - Select **Next Step** and select **Create Group**.
    - Select newly created **DeployToS3** group.
    - Select the **Permissions** tab.
    - Under **Inline Policies**, select **Create Group Policy**.
    - Select **Custom Policy** and select **Select**.
    - **Name:** `policy-DeployToS3`.
    - **Policy Document:** paste in:
      ```
      {
        "Version": "2012-10-17",
        "Statement": [
          {
              "Effect": "Allow",
              "Action": [
                  "s3:ListBucket"
              ],
              "Resource": [
                  "arn:aws:s3:::stationtwo.ca"
              ]
          },
          {
              "Effect": "Allow",
              "Action": [
                  "s3:PutObject",
                  "s3:GetObject",
                  "s3:DeleteObject"
              ],
              "Resource": [
                  "arn:aws:s3:::stationtwo.ca/*"
              ]
          },
          {
              "Effect": "Allow",
              "Action": [
                  "cloudfront:CreateInvalidation"
              ],
              "Resource": "*"
          }
        ]
      }
      ```
    - Select **Validate Policy** to ensure syntax is ok. Fix as needed.
    - Once that passes, select **Apply Policy**.
  - **Create role that will authorize the GitHub action:**
    - Select **Users**.
    - Select **Add user**.
    - User name: `deploy-stationtwo-s3 `.
    - **Access type:** select Programmatic access and select **Next: Permissions**.
    - Select **DeployToS3** group and select **Next: Tags**, and select **Next: Review**, and select **Create user**.
    - Take note of the **Access key ID** and **Secret access key** values.
  - Save GitHub secrets for Action:
    - Navigate to repo **Settings**.
    - Select **Secrets**.
    - Add required Secrets:
      - Select **New Secret**.
      - **Name:** `AWS_ACCESS_KEY_ID`.
      - **Value:** `[AWS IAM role access key ID]`.
      - Select **New Secret**.
      - **Name:** `AWS_SECRET_ACCESS_KEY`.
      - **Value:** `[AWS IAM role secret access key]`.
      - Select **New Secret**.
      - **Name:** `STATION_TWO_CLOUDFRONT_DID`.
      - **Value:** `[AWS CloudFront Distribution ID]`.
  - **Create GitHub action:**
    - Navigate to **GitHub Action** of your repo.
    - Select **New workflow**.
    - Select **set up a workflow yourself**.
    - Rename workflow to: `deploy-production.yml`.
    - **Paste in the following workflow:**
      ```
      name: Deploy to production

      on:
        push:
          branches: [ master ]

      jobs:
        build:
          runs-on: ubuntu-latest
          steps:
          - uses: actions/checkout@v2
      
          - name: Configure AWS Credentials
            uses: aws-actions/configure-aws-credentials@v1
            with:
              aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
              aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
              aws-region: us-east-1

          - name: Setup Node.js environment
            uses: actions/setup-node@v1.4.2

          - name: Install Node modules
            run: npm i
            working-directory: ./client
    
          - name: Build front end
            run: npm run build
            working-directory: ./client

          - name: Deploy to S3
            run: aws s3 sync ./client/build/ s3://stationtwo.ca --delete
      
          - name: Clear Cloudfront cache
            uses: awact/cloudfront-action@master
            env:
            AWS_REGION: 'us-east-1'
            AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
            AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
            DISTRIBUTION_ID: ${{ secrets.STATION_TWO_CLOUDFRONT_DID }}
      ```
    - Select **Start commit** and commit file to master. This will trigger the action to perform.
    - The GitHub action will perform the following:
      1) Authorize AWS actions on S3 bucket.
      2) In `/client` directory, update node modules.
      3) In `/client` directory, perform a React build.
      4) Upload `/build` files to S3 bucket replacing old files with current ones.
      5) Authorize AWS actions on CloudFront.
      6) Invalidate CloudFront configuation to clear caches so next visit to app pulls the latest files.