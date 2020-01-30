import { Inject, Injectable, Optional } from 'injection-js';
import { Transform } from 'stream';

@Injectable()
export class ChunkAggregator extends Transform {
    private itemsChunk = [];

    constructor(@Optional() @Inject('chunkSize') public readonly chunkSize = 30000) {
        super({
            readableObjectMode: true,
            writableObjectMode: true,
        });

        this.chunkSize = chunkSize;
    }

    _flush(callback) {
        if (this.itemsChunk.length > 0) {
            this.push(this.itemsChunk);
            this.itemsChunk = [];
        }
        callback();
    }

    _transform(productVariant, encoding, callback) {
        this.itemsChunk.push(productVariant);
        if (this.itemsChunk.length >= this.chunkSize) {
            this.push(this.itemsChunk);
            this.itemsChunk = [];
        }
        callback();
    }
}
