#!/bin/bash

echo "Starting Redis..."
redis-server &

echo "Starting Node app with PM2..."
pm2-runtime Server.js