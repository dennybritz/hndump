from node:0.12

# Install logrotate
RUN apt-get update && \
  apt-get install -y logrotate && \
  apt-get clean

COPY ./logrotate.conf /etc/logrotate.conf
COPY ./ /app
WORKDIR /app

RUN rm -rf node_modules && \
  npm install

RUN /etc/init.d/cron start && \
  chmod 0644 /etc/logrotate.conf

VOLUME /app/log

CMD ["/bin/bash", "-c", "node app.js > /app/log/hn-events.jsonlines"]
