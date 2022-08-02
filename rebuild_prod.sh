cp ../html/assets/*.json ./
npm run build:prod
sleep 2
cp *.json ../html/assets
