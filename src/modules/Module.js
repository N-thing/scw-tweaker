import { log } from "../utils";
import configs from '../configs';

class Module {
    constructor(core, id, name) {
        this.core = core;
        this.id = id;
        this.name = name;
        this.configs = new ModuleConfigs(id);
        this.configs.add('enabled', "Boolean", true);

        this.cache = {};

        log(`Загружен модуль: ${name}`);
    }
    async init() {
        await this.configs.load();
        await this.configs.save();
    }
    applyPage(page) {}
    interval() {}
    update() {}
}

export class ModuleConfigs {
    constructor(moduleId) {
        this.configsId = `${moduleId}_configs`
        this.list = {};
    }
    add(name, type, value) {
        this.list[name] = new ModuleConfig(name, type, value)
    }
    set(name, value) {
        this.list[name].value = value;
    }
    get(name) {
        return this.list[name].value;
    }
    async clear() {
        await chrome.storage.local.set({ [this.configsId]: {} });
    }
    async load() {
        let storage = await chrome.storage.local.get(this.configsId);
        log(storage);
        Object.assign(this.list, storage[this.configsId]);
    }
    async save() {
        await chrome.storage.local.set({ [this.configsId]: this.list });
    }
}

class ModuleConfig {
    constructor(name, type, value) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
    set(value) {
        this.value = value;
    }
}

export default Module;