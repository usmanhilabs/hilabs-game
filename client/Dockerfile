FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Expose host so Vite is accessible outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
