import ModuleUpdater from "../../classes/ModuleUpdater";
import { log } from "../../utils";
import CommentData from "./CommentData";
import UIComment from "./UIComment";

class UpdaterComments extends ModuleUpdater {
    constructor(module) {
        super(module);
        this.comments = null;
    }

    onUpdate() {
        if(this.module.page.section != "ticket-view") return;
        
        const {cache} = this.module;
        const {ticket} = this.module.page.data;

        cache.cardTitles = document.querySelectorAll('.v-card--flat > .v-card-title:not(.loaded)');
        for(const cardTitle of cache.cardTitles) {

            if(cardTitle.innerHTML == "История") {

                // Определение блока массива комментов
                const card = cardTitle.parentElement;
                if(!cache.comments) cache.comments = card.querySelector('.v-card-text').children[0].querySelector('.v-row:not(.v-row--dense)');
                cache.comments.classList.add('n0-comments');
                
                // Массив комментов
                let rawComments = cache.comments.querySelectorAll(':scope > .v-col:not(.n0-comment)');

                for(let i=0; i<rawComments.length; i++) {
                    rawComments[i].classList.add('n0-comment');
                    let commentData = new CommentData(rawComments[i]);
                    let comment = new UIComment(this.module, commentData);

                    comment.enchance();
                    comment.enchanceFiles();
                }

            }

        }

    }
}

export default UpdaterComments;