# this dockerfile is for installing and building the application only, use docker-compose from ./server to start the app after buiding
# start with docker build -v .:/home/node/app --rm -t docker-ninicobox-builder:latest .
FROM          node:8 as builder
ENV           NODE_ENV=production
WORKDIR       /home/node/app
RUN           npm run setup && npm run build && cd server && npm prune --production