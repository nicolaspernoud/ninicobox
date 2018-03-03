# Building the server with arm emulation

FROM          arm32v7/node:8 as server-builder

ENV           BUILD_FOLDER=/usr/src/app

WORKDIR       ${BUILD_FOLDER}

COPY          . ${BUILD_FOLDER}/
COPY          ./qemu-arm-static /usr/bin/qemu-arm-static
RUN           cd client && npm install @angular/platform-browser
RUN           cd server && npm install
RUN           cd server && npm run test
RUN           cd server && npm run build
RUN           cd server && npm prune --production

# Building the client

FROM          node:8 as client-builder

ENV           BUILD_FOLDER=/usr/src/app

WORKDIR       ${BUILD_FOLDER}

COPY          . ${BUILD_FOLDER}/
RUN           cd client && npm install
RUN           cd client && npm run build
RUN           npm run translate

# Putting all together on arm container

FROM          arm32v7/node:8

ENV           NODE_ENV=production
ENV           APP_PATH=/usr/src/app

WORKDIR       ${APP_PATH}

COPY          ./qemu-arm-static /usr/bin/qemu-arm-static
COPY          --from=server-builder /usr/src/app/server/ ${APP_PATH}/server/
COPY          --from=client-builder /usr/src/app/client/dist/ ${APP_PATH}/client/dist/

EXPOSE        443

CMD           cd server && npm start