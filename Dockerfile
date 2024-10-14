FROM node
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 4898
CMD ["node","index.js"]