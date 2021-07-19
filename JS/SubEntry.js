class SubEntry {
    /**
     * @param {String} path file path to the sub entry
     * @param {String} name name of the sub entry
     * @param {String} description short description of the sub entry
     */
    constructor(path, name, description) {
        this.path = path;
        this.name = name;
        this.description = description;
    }



    /* Getters & Setters */

    // Path getter & setter
    getPath() {
        return this.path;
    }
    setPath(newPath) {
        this.path = newPath;
    }

    // name getter & setter
    getName() {
        return this.name;
    }
    setName(newName) {
        this.name = newName;
    }

    // description getter & setter
    getDescription() {
        return this.description;
    }
    setDescription(newDescription) {
        this.description = newDescription;
    }
}