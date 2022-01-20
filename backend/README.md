# Create docker mysql instance
docker run --name mysql --env-file .env -p 3306:3306 -d mysql:8.0