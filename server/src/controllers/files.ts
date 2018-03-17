'use strict';

import { EventEmitter } from 'events';
import * as fs from 'fs-extra';
import { Response, Request, NextFunction } from 'express';
import { Router } from 'express';
import * as path from 'path';
import * as Busboy from 'busboy';
import * as mime from 'mime';
import { File } from '../../../common/interfaces';
import { log } from '../logger';
import { getShareToken } from '../security';

export const filesRouter = Router();

function accessFilter(req: Request, res: Response, next: NextFunction) {
    if (req.params.path.includes('..') || ((req.params.permissions !== 'rw') && (req.method !== 'GET'))) {
        res.status(403).send();
    }
    else {
        const aclString: string = fs.readFileSync('./config/filesacl.json', 'utf-8');
        const acl = JSON.parse(aclString);
        const basepath = req.params.basepath;
        const role = req.user.role;
        const permissions = req.params.permissions;
        let challengeOk = false;
        for (const aclitem of acl) {
            if ((aclitem.basepath === basepath && aclitem.roles.includes(role) && aclitem.permissions === permissions)) {
                challengeOk = true;
                break;
            }
        }
        if (challengeOk) {
            next();
        }
        else {
            res.status(403).send();
        }
    }
}

filesRouter.use('/:permissions/:basepath/:path?', accessFilter);

// Explore directory
filesRouter.get('/:permissions/:basepath/:path?/explore', function (req: Request, res: Response) {
    const explorer = new Explorer();
    const files: File[] = [];
    explorer.on('file', function (file: string, size: number, mtime: Date) {
        files.push({
            name: path.basename(file),
            path: file.substring(req.params.basepath.length),
            size: size,
            mtime: mtime,
            isDir: false
        });
    });

    explorer.on('dir', function (dir: string, size: number, mtime: Date) {
        files.push({
            name: path.basename(dir),
            path: dir.substring(req.params.basepath.length),
            size: size,
            mtime: mtime,
            isDir: true
        });
    });

    explorer.on('end', function () {
        // console.log("end", files);
        res.json(files);
    });

    explorer.on('error', function (err: NodeJS.ErrnoException) {
        console.log(err);
    });

    explorer.explore(path.join(decodeURIComponent(req.params.basepath), !!req.params.path ? decodeURIComponent(req.params.path) : ''));
});

// Create directory
filesRouter.post('/:permissions/:basepath/:path?/createdir', function (req: Request, res: Response) {
    createRootDir(req.params.basepath, function () {
        fs.mkdir(path.join(decodeURIComponent(req.params.basepath), req.params.path ? decodeURIComponent(req.params.path) : '', req.body.directoryname), function (err: NodeJS.ErrnoException) {
            if (err) {
                console.log(err);
            }
            log(`Directory created : ${req.body.directoryname}`, req);
            res.end();
        });
    });
});

// Rename file or directory
filesRouter.put('/:permissions/:basepath/:path?/rename', function (req: Request, res: Response) {
    const oldPath = path.join(decodeURIComponent(req.params.basepath), decodeURIComponent(req.params.path));
    const newPath = path.join(decodeURIComponent(req.params.basepath), req.body.newpath);
    fs.rename(oldPath, newPath, function (err: NodeJS.ErrnoException) {
        if (err) {
            console.log(err);
        }
        log(`File renamed or moved : ${oldPath} > ${newPath}`, req);
        res.end();
    });
});

// Copy file or directory
filesRouter.put('/:permissions/:basepath/:path?/copy', function (req: Request, res: Response) {
    const oldPath = path.join(decodeURIComponent(req.params.basepath), decodeURIComponent(req.params.path));
    const newPath = path.join(decodeURIComponent(req.params.basepath), req.body.newpath);
    fs.copy(oldPath, newPath, function (err: NodeJS.ErrnoException) {
        if (err) {
            console.log(err);
        }
        log(`File copied : ${oldPath} > ${newPath}`, req);
        res.end();
    });
});

// Upload
filesRouter.post('/:permissions/:basepath/:path?/upload', function (req: Request, res: Response) {
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) {
        // console.log("File [" + fieldname + "]: filename: " + filename + ", encoding: " + encoding + ", mimetype: " + mimetype);
        const stream = fs.createWriteStream(path.join(decodeURIComponent(req.params.basepath), req.params.path ? decodeURIComponent(req.params.path) : '', filename));
        file.pipe(stream);
        file.on('data', function (data: Buffer) {
            // console.log("File [" + fieldname + "] got " + data.length + " bytes");
        });

        file.on('end', function () {
            // console.log("File [" + fieldname + "] Finished");
            log(`File uploaded : ${filename}`, req);
        });
    });

    busboy.on('finish', function () {
        // console.log("Done parsing form!");
        res.end();
    });

    req.pipe(busboy);
});

// Get content
filesRouter.get('/:permissions/:basepath/:path/getcontent', function (req: Request, res: Response) {
    const filePath = path.join(decodeURIComponent(req.params.basepath), decodeURIComponent(req.params.path));
    log(`File opened : ${filePath}`, req);
    fs.readFile(filePath, 'utf-8', (err, data) => res.send(data));
});

// Set content
filesRouter.put('/:permissions/:basepath/:path/setcontent', function (req: Request, res: Response) {
    const filePath = path.join(decodeURIComponent(req.params.basepath), decodeURIComponent(req.params.path));
    fs.writeFile(filePath, req.body, (err) => {
        if (err) throw err;
        log(`File saved : ${filePath}`, req);
    });
});

// Get share token
filesRouter.get('/:permissions/:basepath/:path/getsharetoken', function (req: Request, res: Response) {
    const filePath = path.join(decodeURIComponent(req.params.basepath), decodeURIComponent(req.params.path));
    log(`Share token sent for file : ${filePath}`, req);
    const token = getShareToken(filePath);
    res.json({ message: 'ok', token: token });
});

// Delete
filesRouter.delete('/:permissions/:basepath/:path?', function (req: Request, res: Response) {
    const filePath = path.join(decodeURIComponent(req.params.basepath), decodeURIComponent(req.params.path));
    if (req.body.isDir) {
        fs.remove(filePath, function (err: NodeJS.ErrnoException) {
            if (err) {
                console.log(err);
            }
            log(`Directory deleted : ${filePath}`, req);
            res.end();
        });
    }
    else {
        fs.unlink(filePath, function (err: NodeJS.ErrnoException) {
            if (err) {
                console.log(err);
            }
            log(`File deleted : ${filePath}`, req);
            res.end();
        });
    }
});

function createRootDir(basedir: string, callback: () => void) {
    fs.exists(basedir, function (exists: boolean) {
        if (!exists) {
            fs.mkdir(basedir, function (err: NodeJS.ErrnoException) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (!!callback) {
                    callback();
                }
            });
        }
        else {
            if (!!callback) {
                callback();
            }
        }
    });
}

class Explorer extends EventEmitter {
    explore(mypath: string) {
        const self = this;
        fs.readdir(mypath, function (err: NodeJS.ErrnoException, files: string[]) {
            if (err) {
                self.emit('error', err);
            }

            let count = !!files ? files.length : 0;
            if (count == 0) {
                self.emit('end');
                return;
            }

            files.forEach(function (file) {
                const fpath = path.join(mypath, file);
                fs.stat(fpath, function (err: NodeJS.ErrnoException, stats: fs.Stats) {
                    if (err) {
                        self.emit('error', err);
                    }

                    if (stats.isFile()) {
                        self.emit('file', fpath, stats.size, stats.mtime);
                    }
                    else if (stats.isDirectory()) {
                        self.emit('dir', fpath, stats.size, stats.mtime);
                    }

                    count--;
                    if (count == 0) {
                        self.emit('end');
                    }
                });
            });
        });
    }
}
