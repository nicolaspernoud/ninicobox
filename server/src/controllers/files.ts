"use strict";

import { EventEmitter } from "events";
import * as fs from "fs-extra";
import { Response, Request, NextFunction } from "express";
import { Router } from "express";
import * as path from "path";
import * as Busboy from "busboy";
import * as mime from "mime";
import { File } from "../../../common/interfaces";

export const filesRouter = Router();

function accessFilter(req: Request, res: Response, next: NextFunction) {
    if (req.params.path.includes("..") || ((req.params.permissions !== "rw") && (req.method !== "GET"))) {
        res.status(403).send();
    }
    else {
        const aclString: string = fs.readFileSync("./config/filesacl.json", "utf-8");
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

filesRouter.use("/:permissions/:basepath/:path?", accessFilter);

// Explore directory
filesRouter.get("/:permissions/:basepath/:path?/explore", function (req: Request, res: Response) {
    const explorer = new Explorer();
    const files: File[] = [];
    explorer.on("file", function (file: string) {
        files.push({
            name: path.basename(file),
            path: file.substring(req.params.basepath.length - 1),
            isDir: false
        });
    });

    explorer.on("dir", function (dir: string) {
        files.push({
            name: path.basename(dir),
            path: dir.substring(req.params.basepath.length - 1),
            isDir: true
        });
    });

    explorer.on("end", function () {
        // console.log("end", files);
        res.json(files);
    });

    explorer.on("error", function (err: NodeJS.ErrnoException) {
        console.log(err);
    });

    explorer.explore(path.join(req.params.basepath, !!req.params.path ? decodeURIComponent(req.params.path) : ""));
});

// Create directory
filesRouter.post("/:permissions/:basepath/:path?/createdir", function (req: Request, res: Response) {
    createRootDir(req.params.basepath, function () {
        fs.mkdir(path.join(req.params.basepath, req.params.path ? req.params.path : "", req.body.directoryname), function (err: NodeJS.ErrnoException) {
            if (err) {
                console.log(err);
            }
            res.end();
        });
    });
});

// Rename file or directory
filesRouter.put("/:permissions/:basepath/:path?/rename", function (req: Request, res: Response) {
    const oldPath = path.join(req.params.basepath, req.params.path);
    const newPath = path.join(req.params.basepath, req.body.newpath);
    fs.rename(oldPath, newPath, function (err: NodeJS.ErrnoException) {
        if (err) {
            console.log(err);
        }
        res.end();
    });
});

// Upload
filesRouter.post("/:permissions/:basepath/:path?/upload", function (req: Request, res: Response) {
    const busboy = new Busboy({ headers: req.headers });
    busboy.on("file", function (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) {
        // console.log("File [" + fieldname + "]: filename: " + filename + ", encoding: " + encoding + ", mimetype: " + mimetype);
        const stream = fs.createWriteStream(path.join(req.params.basepath, req.params.path ? req.params.path : "", filename));
        file.pipe(stream);
        file.on("data", function (data: Buffer) {
            // console.log("File [" + fieldname + "] got " + data.length + " bytes");
        });

        file.on("end", function () {
            // console.log("File [" + fieldname + "] Finished");
        });
    });

    busboy.on("finish", function () {
        // console.log("Done parsing form!");
        res.end();
    });

    req.pipe(busboy);
});

// Download
filesRouter.get("/:permissions/:basepath/:path?/download", function (req: Request, res: Response) {
    const filePath = path.join(req.params.basepath, decodeURIComponent(req.params.path));
    res.download(filePath);
});

// Delete
filesRouter.delete("/:permissions/:basepath/:path?", function (req: Request, res: Response) {
    const filePath = path.join(req.params.basepath, req.params.path);
    if (req.body.isDir) {
        fs.remove(filePath, function (err: NodeJS.ErrnoException) {
            if (err) {
                console.log(err);
            }
            res.end();
        });
    }
    else {
        fs.unlink(filePath, function (err: NodeJS.ErrnoException) {
            if (err) {
                console.log(err);
            }
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
    explore(path: string) {
        const self = this;
        fs.readdir(path, function (err: NodeJS.ErrnoException, files: string[]) {
            if (err) {
                self.emit("error", err);
            }

            let count = !!files ? files.length : 0;
            if (count == 0) {
                self.emit("end");
                return;
            }

            files.forEach(function (file) {
                const fpath = path + "/" + file;
                fs.stat(fpath, function (err: NodeJS.ErrnoException, stats: fs.Stats) {
                    if (err) {
                        self.emit("error", err);
                    }

                    if (stats.isFile()) {
                        self.emit("file", fpath);
                    }
                    else if (stats.isDirectory()) {
                        self.emit("dir", fpath);
                    }

                    count--;
                    if (count == 0) {
                        self.emit("end");
                    }
                });
            });
        });
    }
}