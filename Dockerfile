# Building the server

FROM          node:8 as server-builder

ENV           BUILD_FOLDER=/usr/src/app

WORKDIR       ${BUILD_FOLDER}

COPY          . ${BUILD_FOLDER}/
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
RUN           node patchsw
RUN           cd client && npm run ngsw-config

# Putting all together

FROM          node:8

ENV           NODE_ENV=production
ENV           APP_PATH=/usr/src/app

WORKDIR       ${APP_PATH}

COPY          --from=server-builder /usr/src/app/server/ ${APP_PATH}/server/
COPY          --from=client-builder /usr/src/app/client/dist/ ${APP_PATH}/client/dist/
COPY          --from=client-builder /usr/src/app/client/package.json ${APP_PATH}/client/package.json

CMD           cd server && npm start