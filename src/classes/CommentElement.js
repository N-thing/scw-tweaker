import Core from "../core.js";
import FileElement from "./FileElement.js";

class CommentElement {

    constructor(base) {
        this.base = base;
        this.title = base.querySelector('.v-card-title').innerHTML;
        this.author = base.querySelector(`b`).innerHTML;
        this.text = CommentElement.getText(base);
        this.files = CommentElement.getFiles(base);
        
        base.classList.add('n0-comment');
    }

    static getText(base) {
        let div = base.querySelector(`.v-container > .v-row > .v-col-12:nth-child(2) .v-row:not(.align-center) .v-col div`);
        let span = div.querySelector(`span`);
        if(span) return span.innerHTML;
        else return div.innerHTML;
    }

    static getFiles(base) {
        let files = [];
        let links = base.querySelectorAll('a');

        for(const link of links) {
            let file = new FileElement(link);
            files.push(file);
        }

        return files;
    }
}

export default CommentElement;