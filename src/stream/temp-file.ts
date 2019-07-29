import * as fs from 'fs';
import { promisify } from 'util';

export interface TempFileOptions {
    extention?: string;
    prefix?: string;
}

export class TempFile {
    tempDir:string;
    file: string;

    constructor(public options?: TempFileOptions) {
        if(!options) options = {};
        let prefix = options.prefix || 'product-feed';
        this.tempDir = fs.mkdtempSync(prefix);
        this.file = `${this.tempDir}/tempfile`
    }

    createWriteStream() {
        return fs.createWriteStream(this.file);
    }
    createReadStream() {
        return fs.createReadStream(this.file);
    }

    async dispose() {
        await promisify(fs.unlink)(this.file);
        await promisify(fs.rmdir)(this.tempDir);
    }
}
