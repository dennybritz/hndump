from node:0.12

COPY ./ /app
WORKDIR /app

RUN rm -rf node_modules && \
  npm install

VOLUME /app/log

CMD ["npm", "start"]
