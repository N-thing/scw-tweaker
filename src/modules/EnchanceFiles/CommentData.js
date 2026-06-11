import FileData from "../../classes/FileData";
import { log } from "../../utils";

class CommentData {
    
    constructor(CommentElement) {

        this.elements = {};

        let rows = CommentElement.querySelector('.v-container > .v-row').children;
        let header = rows[0].children[0].children;

        // HEADER

        rows[0].classList.add('comment-header');
        header[0].classList.add('comment-title');
        header[1].classList.add('comment-date');
        header[2].classList.add('comment-author');

        this.elements.header = rows[0];
        this.elements.title = header[0];
        this.elements.date = header[1];
        this.elements.author = header[2];

        this.title = header[0].textContent;
        this.time = header[1].textContent;
        this.author = header[2].textContent;

        // TEXT

        rows[1].classList.add('comment-text');
        this.elements.text = rows[1];
        this.text = rows[1].textContent;

        this.files = [];
        if(this.title == 'Добавлены вложения') {
            this.elements.files = rows[2];
            if(rows.length == 4) this.elements.files = rows[3];

            let files = this.elements.files.querySelectorAll('a');
            for(const file of files) {
                this.files.push(new FileData(file));
            }

        }

    }

}

export default CommentData;