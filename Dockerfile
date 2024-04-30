FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080
EXPOSE $PORT

# RUN npx prisma generate && npx prisma db push

CMD ["npm", "run", "prod"]