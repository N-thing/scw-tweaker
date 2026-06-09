import ModuleUpdater from "../../classes/ModuleUpdater";
import { log } from "../../utils";
import CommentData from "./CommentData";

class UpdaterComments extends ModuleUpdater {
    constructor(module) {
        super(module);
        this.comments = null;
    }

    onUpdate() {

        if(this.module.page.section != "ticket-view") {
            this.active = false;
            return;
        }
        
        const {cache} = this.module;
        const {ticket} = this.module.page.data;

        cache.cardTitles = document.querySelectorAll('.v-card--flat > .v-card-title:not(.loaded)');
        for(const cardTitle of cache.cardTitles) {

            if(cardTitle.innerHTML == "История") {

                const card = cardTitle.parentElement;

                let rawComments = card.querySelectorAll('.v-card--flat .v-row:not(.v-row--dense) .v-col .v-row:not(.v-row--dense):not(.n0-comment)');

                for(let i=0; i<rawComments.length; i++) {
                    rawComments[i].classList.add('n0-comment');
                    const rawComment = rawComments[i].parentElement.parentElement.parentElement;

                    if(this.comments != rawComment.parentElement) this.comments = rawComment.parentElement;

                    let commentData = new CommentData(rawComment);

                    // let comment = new CommentElement(block);
                    // if(comment.files.length == 0) continue;
                    // comment.base.classList.add('n0-et-files');
                    // this.setFiles(ticket, comment.files)
                }

            }

        }

    }
}

export default UpdaterComments;