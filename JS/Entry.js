class Entry {
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

    // Returns a String representation of the object 
    toString() {
        return this.path + "\n" + this.name + "\n" + this.description;
    }
}

/**
 * Sub Entry class for the curse of aether website by Ryan Mussell
 * Is grouped with other subentries in a master entry object
 */
class SubEntry extends Entry {
    /**
     * @param {String} path file path to the sub entry
     * @param {String} name name of the sub entry
     * @param {String} description short description of the sub entry
     */
    constructor(path, name, description) {
        super(path, name, description);
    }
}

/**
 * Master Entry class for the curse of aether website by Ryan Mussell
 * contains a list of sub entries that below to the same grouping
 */
class MasterEntry extends Entry {
    /**
     * @param {String} path file path to the sub entry
     * @param {String} name name of the sub entry
     * @param {String} description short description of the sub entry
     */
    constructor(path, name, description) {
        super(path, name, description);

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

    // subEntries getter & setter
    getSubEntries() {
        return this.subEntries;
    }
    setSubEntries(newSubEntries) {
        this.subEntries = newSubEntries;
    }

    // Returns a String representation of the object 
    toString() {
        var masterString = this.path + "\n" + this.name + "\n" + this.description + "\n\nSub Entries: \n\n";

        var subEntryString = "";
        for (var i = 0; i < this.subEntries.length; i++) {
            subEntryString += this.subEntries[i].toString() + "\n\n";
        }

        return masterString + subEntryString;
    }
}