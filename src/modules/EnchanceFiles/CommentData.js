import { log } from "../../utils";

class CommentData {
    constructor(CommentElement) {

        let rows = CommentElement.querySelectorAll('.n0-comment > .v-col');

        this.title = rows[0].querySelector('.v-card-title').textContent;
        this.time = rows[0].querySelector('small').textContent;
        this.author = rows[0].querySelector('b').textContent;

        this.text = rows[1].querySelector('div:not([class])').textContent;

        this.files = [];
        // let files = 


        log(this);

    }
}

export default CommentData;