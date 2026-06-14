import Core from "../core";
import { getFileBlob } from "../scw";
import { getAnyCors, getVideoFirstFrame, loadImageAsync, loadVideoMetaAsync, log } from "../utils";

const MIME_TYPES = {
  'html':   'text/html',
  'css':    'text/css',
  'js':     'text/javascript',
  'mjs':    'text/javascript',
  'json':   'application/json',
  'png':    'image/png',
  'jpg':    'image/jpeg',
  'jpe':    'image/jpeg',
  'jpeg':   'image/jpeg',
  'jfif':   'image/jpeg',
  'jif':    'image/jpeg',
  'gif':    'image/gif',
  'webp':   'image/webp',
  'svg':    'image/svg+xml',
  'mp3':    'audio/mpeg',
  'mp4':    'video/mp4',
  'webm':   'video/mp4',
  'pdf':    'application/pdf',
  'zip':    'application/zip'
};

class FileData {

    constructor(a) {
        this.url = a.href;
        this.name = a.innerHTML;
        this.extension = this.name.split('.').pop().toLowerCase();
        this.mime = MIME_TYPES[this.extension] || 'application/octet-stream';
        this.type = this.mime.split('/')[0];
    }

    async getSize() {
        if(!this.size) {

            let element = {};
            let url = await this.getBlobUrl();

            if(this.type == 'image') element = await loadImageAsync(url, false);
            else if(this.type == 'video') element = await loadVideoMetaAsync(url, false);

            this.size = {
                width: element.videoWidth ?? element.width ?? 0,
                height: element.videoHeight ?? element.height ?? 0,
            };

        }
        return this.size;
    }
    
    async getBlob() {
        if(this.blob == undefined) this.blob = await getFileBlob(getAnyCors(this.url));
        return this.blob;
    }

    async getBlobUrl() {
        if(!this.urlBlob) {
            let blob = await this.getBlob();
            if(blob) {
                this.urlBlob = URL.createObjectURL(blob);
                Core.page.urlBlobs.push(this.urlBlob);
            }
            else this.urlBlob = this.url;
        }
        return this.urlBlob;
    }

    async getPreviewUrl() {
        if(!this.previewUrl) {
            if(this.type == 'image') {
                this.previewUrl = this.url;
            } else if(this.type == 'video') {
                let blobUrl = await this.getBlobUrl();
                let frame = await getVideoFirstFrame(blobUrl);
                this.previewUrl = frame;
            }
        }
        return this.previewUrl;
    }
}

export default FileData;