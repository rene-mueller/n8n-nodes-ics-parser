FROM n8nio/n8n

WORKDIR /app

RUN apk add sudo
RUN echo 'node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

COPY scripts /scripts

CMD sudo /scripts/link.sh