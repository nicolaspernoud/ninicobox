'use strict';

import { Response, Request } from 'express';
import { Router } from 'express';
import { log } from '../logger';
import * as fs from 'fs';
import * as path from 'path';
import * as Archiver from 'archiver';

export const shareRouter = Router();

// Stream content
shareRouter.get('/:basepath/:path', function (req: Request, res: Response) {
    const filePath = path.join(decodeURIComponent(req.params.basepath), decodeURIComponent(req.params.path));
    if (req.user.path === filePath) {
        log(`File opened (stream) : ${filePath}`, req);
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range as string;
        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize
            });
            const readStream = fs.createReadStream(filePath, { start, end });
            readStream.pipe(res);
        } else {
            if (stat.isDirectory()) {
                const archive = Archiver('zip');
                archive.on('error', (err: any) => {
                    res.status(500).send({ error: err.message });
                });
                // Set the archive name
                res.attachment(path.basename(filePath) + '.zip');
                archive.pipe(res);
                archive.directory(filePath, false);
                archive.finalize();
            }
            else {
                res.writeHead(200, {
                    'Content-Length': fileSize,
                    'Content-Disposition': !!req.query.inline ? 'inline' : `attachment; filename="${path.basename(filePath)}"`
                });
                const readStream = fs.createReadStream(filePath);
                readStream.pipe(res);
            }
        }
    } else {
        res.status(403).send();
    }
});