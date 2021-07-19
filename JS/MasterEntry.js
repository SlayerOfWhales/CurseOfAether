class MasterEntry {
    /**
     * 
     * @param {String} path file path to the master entry 
     * @param {String} name name of the entry
     */
    constructor(path, name, description) {
        this.path = path;
        this.name = name;

        this.subEntries = []; // A list of sub entries that make up this master entry
    }

    /**
     * Adds a new sub entry to the classes entry array
     * @param {SubEntry} newSubEntry 
     */
    addSubEntry(newSubEntry) {
        this.subEntries.push(newSubEntry);
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

    // subEntries getter & setter
    getSubEntries() {
        return this.subEntries;
    }
    setSubEntries(newSubEntries) {
        this.subEntries = newSubEntries;
    }
}