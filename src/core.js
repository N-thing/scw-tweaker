import { getTicketById } from './scw.js'
import CommentElement from './classes/CommentElement.js';
import FileElement from './classes/FileElement.js';
import { createElement, getUuidFromUrl, log } from './utils.js';
import configs from './configs.js';
import Notifier from './classes/ui/notifier.js';
import Button from './classes/ui/Button.js';
import { openDB } from 'idb';

class Core {

    static db;
    static page = {};
    static pagePrev = {};

    constructor() {
        this.modules = [];
        this.notifier = new Notifier();

        window.n0intervals = {};
    }

    async init() {

        Core.db = await openDB(configs.dbName, configs.dbVersion, {
            upgrade(db) { 
                if (!db.objectStoreNames.contains('tickets-id-cache')) {
                    db.createObjectStore('tickets-id-cache', { keyPath: 'number' });
                }
            },
        });

        let n0 = {
            getStorage: async () => {
                let keys = await chrome.storage.local.getKeys();
                let result = {};
                for(const key of keys) {
                    result[key] = (await chrome.storage.local.get(key))[key];
                }
                log(result, 'debug');
            },
            clearStorage: async () => {
                await chrome.storage.local.clear();
                n0.getStorage();
            }
        };

        if(!document.querySelector('.n0-debug') && configs.debug) {
            let debugPanel = createElement('div', 'n0-debug', document.body);
            debugPanel.style.position = 'fixed';
            debugPanel.style.zIndex = '99999999';
            debugPanel.style.top = '0px';
            debugPanel.style.left = '0px';

            let btnClearStorage = new Button('clear', {state: 'READY', size: 'NORMAL'}, n0.clearStorage);
            let btnGetStorage = new Button('get', {state: 'READY', size: 'NORMAL'}, n0.getStorage);

            debugPanel.appendChild(btnClearStorage.getElement());
            debugPanel.appendChild(btnGetStorage.getElement());
        }

        // инциализация модулей
        for(const module of this.modules) module.init(this);

        // Определение события смены странички
        let lastHash = window.location.hash;
        setInterval(() => {
            if (window.location.hash !== lastHash) {

                window.dispatchEvent(new CustomEvent('urlchange', {
                    bubbles: false,
                    detail: {
                        oldHash: lastHash
                    }
                }));
                lastHash = window.location.hash;

            }
        }, 250);

        // Определение страницы
        this.updateUrl();
        window.addEventListener('urlchange', () => this.updateUrl());

        // update
        clearInterval(window.coreInterval);
        window.coreInterval = setInterval(() => {
            if(Core.page == {}) return;
            for(const module of this.modules) {
                if(!module.configs.getValue('enabled')) continue;
                module.onUpdate();
            }
        }, configs.intervalFreq);
        
    }

    addModule(module) {
        this.modules.push(module);
    }

    async updateUrl() {
        if(Core.page != {} && Core.page.urlBlobs) {
            for(const urlBlob of Core.page.urlBlobs) {
                URL.revokeObjectURL(urlBlob);
            }
        }

        Core.pagePrev = Core.page;
        Core.page = await this.getPageData();

        // смена странички для всего остального
        for(const module of this.modules) {
            if(!module.configs.getValue('enabled')) continue;
            module.applyPage(Core.page);
        }
    }

    async getPageData() {

        let path = location.hash.slice(2).split('/');
        let section = null;
        let data = {};

        switch(`${path[0]}/${path[1]}/${path[2]}`) {
            case 'home/tickets/view':
                section = 'ticket-view';
                data.ticket = await getTicketById(getUuidFromUrl());
                break;
            case 'home/tickets/create':
                section = 'ticket-create';
                data.ticket = await getTicketById(getUuidFromUrl(2));
                break;
        }

        let page = {
            path: path,
            section: section,
            data: data,
            urlBlobs: [],
        };

        return page;
    }

}

export default Core;