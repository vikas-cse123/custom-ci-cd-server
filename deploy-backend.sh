ssh cloudbox 'bash' << EOF
set -e
cd /home/ubuntu/cloudbox-backend
git pull
npm ci --no-audit --no-fund
pm2 reload vikas-app
echo "deploy backend done"

EOF