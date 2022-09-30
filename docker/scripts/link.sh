#!/usr/bin/env sh

npm link

cd /usr/local/lib/node_modules/n8n/
npm link n8n-nodes-ics-parser

n8n start