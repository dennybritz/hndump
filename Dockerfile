from node:0.12

COPY ./ /app
WORKDIR /app

RUN rm -rf node_modules && \
  npm install

VOLUME /app/log

CMD ["/bin/bash", "-c", "node app.js >> /app/log/hn-data.jsonlines"]
