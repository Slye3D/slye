set -e
node ./node_modules/.bin/tslint -p .
node ./node_modules/.bin/tsc --noEmit
./tools/test.ts
