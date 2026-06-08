class ModuleUpdater {

    constructor(module) {
        this.module = module;
        this.active = true;
    }

    update() {
        if(this.active) this.onUpdate();
    }

    onUpdate() {}
}

export default ModuleUpdater;