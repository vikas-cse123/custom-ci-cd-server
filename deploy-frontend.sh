
set -e

PROJECT_DIR="/Users/akash/Downloads/development/code files/42_integrating-razorpay-in-storageApp-client-final"

cd "$PROJECT_DIR"
git pull

echo "Installing client dependencies (npm ci)..."
npm ci --no-audit --no-fund

npm run test
npm run build
echo "Uploading build files to S3 bucket"

aws s3 sync "$PROJECT_DIR/dist" s3://cloudbox-app-frontend --delete
aws cloudfront create-invalidation --distribution-id E1NGGETDV6VGZP --paths "/index.html"

echo "Frontend Deployed Successfully..."