#!/bin/bash
git ls-files -m --error-unmatch . >/dev/null 2>&1; ec=$?
if test "$ec" = 0; then
  echo "Repository is dirty..."
  exit
fi
HASH=$(git rev-parse HEAD | cut -c-7)
./tools/build.js prod
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
