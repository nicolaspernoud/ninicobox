FROM          node:8

ENV           APP_PATH=/usr/src/app

WORKDIR       ${APP_PATH}

COPY          . ${APP_PATH}/

RUN           npm run setup && npm run build

EXPOSE        3000

CMD           ["npm start"]