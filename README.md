# NinicoBox
A home cloud providing file explorer with permissions and access control lists to share files with friends, and acting as a proxy for other services with content rewriting. Based on NodeJS, Express, JWT, Angular 5, Material Design, with TypeScript for both client and server.

## Installation

```bash
git clone https://github.com/nicolaspernoud/ninicobox.git
cd ninicobox
npm run setup
npm run build
```

## Start

```bash
npm start
```

## Debug

```bash
npm run debug
```

## Usage : http://localhost:3000

## TODO

### Server

- [x] Add tests to server api
- [x] Refactor server api
- [x] Add user api and models
- [x] Restrict file writing on read access control
- [x] Add tests on files acl system ; check that ".." is not allowed
- [x] Add get acl api
- [x] Add proxy api and models
- [x] Add basic logging
- [x] Add ip location logging
- [ ] Add helmet to protect server api
- [x] Rebase server api on typescript sdk for express
- [ ] Add environnement production conf to server api, randomize secret
- [x] Create separates route for admin[r, rw], family[r, rw], user[r, rw] file api
- [x] Add credentials to proxy routes
- [x] Remove unused librairies

### Client

- [x] Add login screen, auth service, isAuthed, role, directives
- [x] Add logout and stale JWT mecanisms
- [x] Add users components
- [x] Check if style is compliant to material guidelines
- [x] Add proxy services components
- [x] Improve explorer context menu
- [x] Add cut to explorer
- [x] Add copy to explorer
- [ ] Add tests
- [ ] Add basic service worker and manifest
- [ ] Add i18n
- [ ] Add filesACL management
- [ ] Add user add dialog
- [ ] Remove unused components from client and unused librairies
- [ ] Improve global error handling

### Deployment
- [ ] Put everything in docker containers