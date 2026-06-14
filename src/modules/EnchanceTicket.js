import Core from "../core.js";
import Module from "./Module.js";
import { createElement, log, saveWithName } from "../utils.js";
import ModalToParent from './EnchanceFiles/ModalToParent.js';
import Modal from "../classes/ui/Modal.js";
import { getFileBlob } from "../scw.js";
import FileElement from "../classes/FileElement.js";
import CommentElement from "../classes/CommentElement.js";
import ImageSlider from "./EnchanceFiles/MediaSlider.js";
import configs from "../configs.js";
import icons from "../icons.js";
import Button from "../classes/ui/Button.js";
import FileData from "../classes/FileData.js";
import UpdaterComments from "./EnchanceFiles/UpdaterComments.js";
import UpdaterFiles from "./EnchanceFiles/UpdaterFiles.js";
import UpdaterButtons from "./EnchanceFiles/UpdaterButtons.js";
import UpdaterTicketCreate from "./EnchanceFiles/UpdaterTicketCreate.js";

class EnchanceTicket extends Module {
    
    constructor(core) {
        super(core, "enchance_files", "Улучшение заявок");
        this.cache = {
            headerButtons: null,
            cardTitles: null,
            header: null,
        };

        this.configs.addConfig('file_prefixes', "Array", [
            "Ответ собственнику",
            "Ответ от собственника",
            "Письмо-приглашение",
        ]);

        this.addUpdater(new UpdaterComments(this));
        this.addUpdater(new UpdaterFiles(this));
        this.addUpdater(new UpdaterButtons(this));
        this.addUpdater(new UpdaterTicketCreate(this));
    }

    applyPage(page) {
        super.applyPage(page);
    }
    
}

export default EnchanceTicket;