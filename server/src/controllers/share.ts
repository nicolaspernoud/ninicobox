'use strict';

import { Response, Request } from 'express';
import { Router } from 'express';
import { log } from '../logger';
import * as fs from 'fs';
import * as path from 'path';

export const shareRouter = Router();

// Stream content
shareRouter.get('/:basepath/:path', function (req: Request, res: Response) {
    const filePath = path.join(decodeURIComponent(req.params.basepath), decodeURIComponent(req.params.path));
    if (req.user.path === filePath) {
        log(`File opened (stream) : ${filePath}`, req);
        const stat = fs.statSync(filePath);
        res.writeHead(200, {
            'Content-Length': stat.size,
            'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`
        });
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    }
    else {
        res.status(403).send();
    }
});
