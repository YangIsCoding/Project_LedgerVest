#!/bin/sh
echo "Waiting for database..."
DB_HOST=$(echo $DATABASE_URL | awk -F[@:/] '{print $6}')
DB_PORT=$(echo $DATABASE_URL | awk -F[@:/] '{print $7}')
echo "Attempting to connect to Host: [$DB_HOST] Port: [$DB_PORT]"
while ! nc -z $DB_HOST $DB_PORT; do
  echo "Database at [$DB_HOST:$DB_PORT] not ready yet, sleeping..." 
  sleep 1 
done
echo "Database started"
echo "Running database migrations..."
npx prisma migrate deploy
echo "Seeding database..."
node dist-scripts/seed-admins.js
echo "Starting application..."
npm start
