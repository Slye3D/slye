#!/bin/bash
HASH=$(git rev-parse HEAD | cut -c-6)
./tools/build.js
cd dist
git init
git remote add origin git@github.com:Slye3D/slye.github.io.git
rm -rf assets
cp -r ../assets .
echo "" >> index.html
echo "<!-- Slye, Version: $HASH -->" >> index.html
git add .
git commit -m ":rocket: Deploy $HASH"
git push -u origin master --force
