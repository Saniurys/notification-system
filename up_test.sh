# Forzamos la recreación completa
# docker-compose -f docker-compose.test.yml up --build --force-recreate
docker-compose -p notification-test -f docker-compose.test.yml up --build --force-recreate
