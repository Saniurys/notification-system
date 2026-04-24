# ETAPA 1: Construcción (Build)
FROM node:24.13.1-alpine3.23 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ETAPA 2: Ejecución (Producción)
FROM node:24.13.1-alpine3.23
WORKDIR /app

# Copiamos solo lo necesario desde la etapa 'builder'
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/test ./test
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.spec.json ./tsconfig.spec.json

# Seguridad: No correr como root
USER node

EXPOSE 3000

# El comando de inicio se suele definir aquí, aunque tu docker-compose lo sobreescriba
CMD ["npm", "run", "start:prod"]
