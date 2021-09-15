sleep 5
cd ..
git fetch
git pull --force
git submodule update
npm install
cd slowsniper
npm install
cd ..
cd sniperweb
npm install
cd ..
node .