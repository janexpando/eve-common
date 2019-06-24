import * as fs from 'fs';
import { promisify } from 'util';

export class TempFile {
    tempDir = fs.mkdtempSync('product-feed');
    file = `${this.tempDir}/tempfile.${this.extention}`;

    constructor(public extention: string = 'temp') {}

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
