import Core from "../core.js";

const MIME_TYPES = {
  'html': 'text/html',
  'css':  'text/css',
  'js':   'text/javascript',
  'mjs':  'text/javascript',
  'json': 'application/json',
  'png':  'image/png',
  'jpg':  'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif':  'image/gif',
  'webp': 'image/webp',
  'svg':  'image/svg+xml',
  'mp3':  'audio/mpeg',
  'mp4':  'video/mp4',
  'pdf':  'application/pdf',
  'zip':  'application/zip'
};

class FileElement {

    constructor(a) {
        this.a = a;
        this.element = a.parentElement.parentElement;
        this.url = a.href;
        this.name = a.innerHTML;
        this.extension = this.name.split('.').pop();
        this.mimeType = MIME_TYPES[this.extension] || 'application/octet-stream';
        this.type = this.mimeType.split('/')[0];
    }
    
}

export default FileElement;