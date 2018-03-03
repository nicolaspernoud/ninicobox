FROM          arm32v7/node:8 as builder

ENV           BUILD_FOLDER=/usr/src/app

WORKDIR       ${BUILD_FOLDER}

COPY          . ${BUILD_FOLDER}/
COPY          ./qemu-arm-static /usr/bin/qemu-arm-static
RUN           npm run setup
RUN           npm run build
RUN           cd server && npm run test
RUN           npm run translate

RUN           cd server && npm prune --production

#

FROM          arm32v7/node:8

ENV           NODE_ENV=production
ENV           APP_PATH=/usr/src/app

WORKDIR       ${APP_PATH}

COPY          ./qemu-arm-static /usr/bin/qemu-arm-static
COPY          --from=builder /usr/src/app/server/ ${APP_PATH}/server/
COPY          --from=builder /usr/src/app/client/dist/ ${APP_PATH}/client/dist/

EXPOSE        443

CMD           cd server && npm start