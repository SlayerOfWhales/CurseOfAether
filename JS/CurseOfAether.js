var curseOfAether;

// Load the website once the window is loaded
window.onload = function() {
    curseOfAether = new CurseOfAether(window, document, pdfjsLib);
}

/**
 * 
 */
class CurseOfAether {
    /**
     * @param {Window} window desired frames window object
     * @param {DOM} doc html DOM object of the page
     */
    constructor(window, doc, PDFJS) {
        // HTML Variables
        this.window = window;
        this.doc = doc;

        // Imports
        this.PDFJS = PDFJS;
        this.PDFJS.GlobalWorkerOptions.workerSrc = "node_modules/pdfjs-dist/build/pdf.worker.js";

        // Path Constants
        this.BASE_PATH = "Writing/";
        this.MAIN_STORY_PATH = this.BASE_PATH + "The Curse of Aether/";
        this.SHORT_STORY_PATH = this.BASE_PATH + "Short Stories/";

        // Path variables
        this.currentTopLevelPath = "";
        this.currentMasterEntryPath = "";
        this.currentSubEntryPath = "";

        // Content Variables
        this.contentCatagories = ["Home", "The Curse of Aether", "Short Stories"];
        this.currentlyLoadedContent = [];
        this.currentMasterEntry;
        this.currentSubEntry;
        this.currentlyDisplayingContent = false;

        // Load content
        this.createGUI();
        this.createEventListeners();
    }



    /* GUI Methods */

    // Generates & loads all segments of the GUI
    createGUI() {
        this.BACKGROUND_COLOR = "rgb(50, 120, 255)";
        this.STANDARD_GUIDE_WIDTH = "20%";
        this.STANDARD_READING_WIDTH = "75%";



        // Background
        this.doc.body.style.background = "url(../Src/Background.png) center center no-repeat fixed";
        this.doc.body.style.backgroundSize = "cover";



        // Title Div
        this.titleDiv = this.doc.createElement("DIV");
        this.titleDiv.style.color = "white";
        this.titleDiv.style.textAlign = "center";
        this.titleDiv.style.textShadow = "2px 2px rgb(0, 0, 0)";

        this.titleText = this.doc.createElement("H1");
        this.titleText.appendChild(this.doc.createTextNode("The Curse of Aether: "));

        this.subtitleText = this.doc.createElement("H2");
        this.subtitleText.appendChild(this.doc.createTextNode("Memento Mori"));

        this.titleDiv.appendChild(this.titleText);
        this.titleDiv.appendChild(this.subtitleText);



        // Header DIV top of page header
        this.headerDiv = this.doc.createElement("DIV");
        this.headerDiv.id = "headerDiv";
        this.headerDiv.class = "headerDiv";

        this.headerDiv.style.border = "1px solid white";
        this.headerDiv.style.display = "flex";
        this.headerDiv.style.justifyContent = "center";
        this.headerDiv.style.background = this.BACKGROUND_COLOR;
        this.headerDiv.style.position = "relative";
        this.headerDiv.style.color = "white";
        this.headerDiv.style.margin = "1%";

        this.tableOfContents = this.doc.createElement("UL");
        this.tableOfContents.id = "tableOfContents";
        this.tableOfContents.class = "headerDiv";
        this.createTableOfContents();
        this.tableOfContents.style.display = "flex";
        this.tableOfContents.style.width = "100%";
        this.tableOfContents.style.padding = 0;
        this.tableOfContents.style.justifyContent = "space-between"; // Tells the list to equalize the space between the list items
        this.tableOfContents.style.alignItems = "stretch"; // Tells the list to stretch the list items to the length of the parent
        this.tableOfContents.style.textAlign = "center";
        this.tableOfContents.style.fontSize = "large";
        this.headerDiv.appendChild(this.tableOfContents);



        // Contents DIV contains the pages content (reading div and guide div)
        this.contentDiv = this.doc.createElement("DIV");
        this.contentDiv.id = "contentDiv";
        this.contentDiv.class = "contentDiv";

        this.contentDiv.style.margin = "1%";
        this.contentDiv.style.height = "100px";



        // Guide Div
        this.guideDiv = this.doc.createElement("DIV");
        this.guideDiv.id = "guideDiv";
        this.guideDiv.class = "guideDiv";

        this.guideDiv.style.border = "1px solid white";
        this.guideDiv.style.background = this.BACKGROUND_COLOR;
        this.guideDiv.style.width = this.STANDARD_GUIDE_WIDTH;
        this.guideDiv.style.height = "auto";
        this.guideDiv.style.float = "left";
        this.guideDiv.style.color = "white";

        this.contentDisplayList = this.doc.createElement("UL");
        this.contentDisplayList.style.listStyleType = "none";
        this.contentDisplayList.style.padding = 0;
        this.contentDisplayList.style.width = "100%"
        this.contentDisplayList.style.marginLeft = "auto";
        this.contentDisplayList.style.marginRight = "auto";
        this.guideDiv.appendChild(this.contentDisplayList);

        this.guideDiv.style.display = "none"; // The guideDiv is hidden until a content type is chosen 



        // Reading Div
        this.readingDivMaximized = false; // Records the current display state of the reading div, when true, the reading div takes up 100% of the parent div width and the guide div is hidden
        this.readingDiv = this.doc.createElement("DIV");
        this.readingDiv.id = "readingDiv";
        this.readingDiv.class = "readingDiv";

        this.readingDiv.style.background = "white"; // The readingDiv background is white to match the pdf background
        this.readingDiv.style.width = this.STANDARD_READING_WIDTH;
        this.readingDiv.style.position = "relative";
        this.readingDiv.style.margin = 0;
        this.readingDiv.style.height = "auto";
        this.readingDiv.style.float = "right";

        this.readingDiv.style.display = "none"; // The readingDiv is hidden until an entry chosen

        // Reading Div Top Menu
        this.topMenu = this.doc.createElement("DIV");
        this.topMenu.style.display = "block";
        this.topMenu.class = "ReadingDiv";

        this.maximizeTip = this.doc.createElement("P");
        this.maximizeTip.textContent = "[i] click page to maximize";
        this.maximizeTip.style.display = "inline";
        this.maximizeTip.style.padding = 100;
        this.topMenu.appendChild(this.maximizeTip);

        this.readingDivCloseButton = this.doc.createElement("BUTTON");
        this.readingDivCloseButton.id = "readingDivCloseButton";
        this.readingDivCloseButton.textContent = "X";
        this.readingDivCloseButton.style.background = "none";
        this.readingDivCloseButton.style.float = "right";
        this.readingDivCloseButton.style.display = "inline";
        this.topMenu.appendChild(this.readingDivCloseButton);

        this.readingDiv.appendChild(this.topMenu);

        // Reading Div Button Menu
        this.bottomMenu = this.doc.createElement("DIV");
        this.bottomMenu.class = "readingDiv";
        this.bottomMenu.style.display = "none";

        this.previousEntryButton = this.doc.createElement("BUTTON");
        this.previousEntryButton.textContent = "<<<";
        this.previousEntryButton.style.background = "none";
        this.previousEntryButton.style.float = "left";
        this.previousEntryButton.style.display = "inline";
        this.bottomMenu.appendChild(this.previousEntryButton);

        this.nextEntryButton = this.doc.createElement("BUTTON");
        this.nextEntryButton.textContent = ">>>";
        this.nextEntryButton.style.background = "none";
        this.nextEntryButton.style.float = "right";
        this.nextEntryButton.style.display = "inline";
        this.bottomMenu.appendChild(this.nextEntryButton);

        this.readingDiv.appendChild(this.bottomMenu);



        // Assembly
        this.contentDiv.appendChild(this.guideDiv);
        this.contentDiv.appendChild(this.readingDiv);

        this.doc.body.appendChild(this.titleDiv);
        this.doc.body.appendChild(this.headerDiv);
        this.doc.body.appendChild(this.contentDiv);
    }

    // Creates the event listeners for the various buttons and such of the website
    createEventListeners() {
        var that = this;

        // Handles all clicks
        this.doc.body.addEventListener("click", function(e) {
            switch (e.target.class) {
                case "readingDiv": // Maximize the reading div on click
                    that.readingDivMaximized = !that.readingDivMaximized;
                    if (that.readingDivMaximized) {
                        that.guideDiv.style.display = "";
                        that.readingDiv.style.width = that.STANDARD_READING_WIDTH;
                        that.guideDiv.style.width = that.STANDARD_GUIDE_WIDTH;
                        if (that.currentlyDisplayingContent) that.loadPDF(that.currentTopLevelPath + that.currentMasterEntryPath + that.currentSubEntryPath, that.readingDiv);
                    } else {
                        that.maximizeTip.style.display = "none"; // Hide the tip
                        that.readingDiv.style.width = "100%";
                        that.guideDiv.style.display = "none";
                        if (that.currentlyDisplayingContent) that.loadPDF(that.currentTopLevelPath + that.currentMasterEntryPath + that.currentSubEntryPath, that.readingDiv);
                    }
                    break;

                case "tableOfContents": // Load correct content based on table of contents select
                    that.guideDiv.style.display = ""; // Make the guideDiv load if it hasn't already been loaded 

                    // Search the table of contents
                    switch (e.target.id) {
                        case "The Curse of Aether":
                            that.currentTopLevelPath = that.MAIN_STORY_PATH;
                            that.loadContentArray(that.currentTopLevelPath + "ContentMap.txt");
                            break;
                        case "Short Stories":
                            that.currentTopLevelPath = that.SHORT_STORY_PATH;
                            that.loadContentArray(that.currentTopLevelPath + "ContentMap.txt");
                            break;
                    }
                    break;

                case "contentGuideMasterEntry": // Load sub entries from master entry click
                    // Wipe old sub entries
                    for (var i = that.contentDisplayList.childNodes.length - 1; i >= 0; i--) {
                        if (that.contentDisplayList.childNodes[i].id == "SubEntryList") that.contentDisplayList.removeChild(that.contentDisplayList.childNodes[i]);
                    }

                    // Get master entry data
                    var selectedMasterIndex = Array.from(that.contentDisplayList.children).indexOf(e.target);
                    that.currentMasterEntry = that.currentlyLoadedContent[selectedMasterIndex];
                    that.currentMasterEntryPath = that.currentMasterEntry.getPath();

                    // If there is only 1 sub entry, there is no point in making the user click twice, so we load the content now
                    if (that.currentMasterEntry.getSubEntries().length > 1) {
                        that.loadSubEntries(selectedMasterIndex);
                    } else {
                        that.readingDiv.style.display = ""; // Make the guideDiv load if it hasn't already been loaded 

                        // Set subEntry and the desired path
                        that.currentSubEntry = that.currentMasterEntry.getSubEntries()[0];
                        that.currentSubEntryPath = that.currentSubEntry.getPath();
                        var path = that.currentTopLevelPath + that.currentMasterEntryPath + that.currentSubEntryPath; // set the path of the subEntry within the folder

                        that.loadPDF(path, that.readingDiv);
                    }
                    break;

                case "contentGuideSubEntry": // Load content from sub entry click
                    that.readingDiv.style.display = ""; // Make the guideDiv load if it hasn't already been loaded 

                    var selectedSubIndex = Array.from(e.target.parentNode.children).indexOf(e.target); // The sub index can be found by finding the index of the clicked item within its parent list
                    that.currentSubEntry = that.currentMasterEntry.getSubEntries()[selectedSubIndex]; // Set subEntry 
                    that.currentSubEntryPath = that.currentSubEntry.getPath();
                    var path = that.currentTopLevelPath + that.currentMasterEntryPath + that.currentSubEntryPath; // set the path of the subEntry within the folder

                    that.loadPDF(path, that.readingDiv);
                    break;
            }

            switch (e.target.id) {
                case "readingDivCloseButton": // Close the reading div when clicked
                    that.readingDiv.style.display = "none";
                    break;
            }
        });

        // highlights list elements on hover
        this.doc.body.addEventListener("mouseover", function(e) {
            if (e.target.tagName == "LI") {
                e.target.style.color = "lightblue";
            }
        });
        this.doc.body.addEventListener("mouseout", function(e) {
            if (e.target.tagName == "LI") {
                e.target.style.color = "white";
            }
        });
    }

    // Creates the table of content element
    createTableOfContents() {
        for (var i = 0; i < this.contentCatagories.length; i++) {
            var newCategory = this.doc.createElement("LI");
            newCategory.textContent = this.contentCatagories[i];
            newCategory.id = this.contentCatagories[i];
            newCategory.class = "tableOfContents";

            newCategory.style.listStyleType = "none"; // Removes index marks
            newCategory.style.marginLeft = "auto";
            newCategory.style.marginRight = "auto";
            newCategory.style.cursor = "pointer";

            this.tableOfContents.appendChild(newCategory);
        }
    }



    /* PDF Loading Methods */

    /**
     * loads a pdf to the a div
     * @param {String} path file path to the pdf 
     * @param {HTMLElement} container element to load the pdf in
     */
    async loadPDF(path, container) {
        const PAGE_ID = "page"; // The html ID of a rendered pdf page
        this.currentlyDisplayingContent = true;

        // Remove any previously loaded pdf pages
        for (var i = container.childNodes.length; i-- > 0;) {
            if (container.childNodes[i].id == PAGE_ID) container.removeChild(container.childNodes[i]);
        }

        var loadingTask = this.PDFJS.getDocument(path); // Start loading the document
        var pdf = await loadingTask.promise; // wait for the page to be loaded
        this.loadPages(pdf, container); // Load the pages
    }

    /**
     * Loads all pages of a pdf
     * @param {PDFDocumentProxy} pdf pdf object to load
     * @param {HTMLElement} container element to load the pdf in
     */
    async loadPages(pdf, container) {

        // Iterates through all pages of the pdf in order
        for (var i = 1; i < pdf.numPages + 1; i++) {
            await this.loadPage(pdf, i, container);
        }
    }

    /**
     * Calculates a scale ratio that will scale a rendered pdf page to fit a desired width
     * @param {PDFDocumentProxy} pdf pdf object to load a page used in calculations
     * @param {Number} width the width to scale to
     * @returns a scale ratio that will scale a rendered pdf page to fit a desired width
     */
    async getPageScaleMultiplier(pdf, width) {
        var page = await pdf.getPage(1); // Default to looking at the first page
        var viewport = page.getViewport({
            scale: 1,
        }); // Create a viewport of the page with a default scale of 1
        var defaultWidth = viewport.width; // Get the width of the viewport with default size

        var scaleMultiplier = width / defaultWidth; // Ratio between the default width and the with of the container
        return scaleMultiplier;
    }

    /**
     * Loads an individual page of a pdf
     * @param {PDFDocumentProxy} pdf pdf object to load pages from
     * @param {Number} pageNum the number of the page to load
     * @param {HTMLElement} container the container element that will have the page canvas appended to it
     */
    async loadPage(pdf, pageNum, container) {
        // Create page objects
        var page = await pdf.getPage(pageNum);
        var scale = await this.getPageScaleMultiplier(pdf, container.offsetWidth); // The scale must scale the pdf to fit the parent container 
        var viewport = page.getViewport({
            scale: scale,
        });

        // Create page canvas
        var pageCanvas = this.doc.createElement("CANVAS");
        var context = pageCanvas.getContext("2d");
        pageCanvas.style.display = "block";
        pageCanvas.id = "page";
        pageCanvas.class = "readingDiv";
        container.appendChild(pageCanvas);

        // Scale canvas
        pageCanvas.height = viewport.height;
        pageCanvas.width = container.offsetWidth; // Because changing the height in the above line changes the width (for obvious reasons...) We will just force the width to match the container so it doesn't overflow

        // Render the page on its canvas
        var renderContext = {
            canvasContext: context,
            viewport: viewport,
        };
        page.render(renderContext)
    }



    /* Content Loading Methods */

    /**
     * Loads the desired content array into the display list
     * @param {Array} contentArray array of entry objects to load into the guideDiv
     */
    async loadContentArray(pathToContentMap) {
        var desiredContentArray = await this.createContentArray(pathToContentMap); // Get selected content array
        this.currentlyLoadedContent = desiredContentArray;

        // Wipe previous display name
        while (this.contentDisplayList.hasChildNodes()) {
            this.contentDisplayList.removeChild(this.contentDisplayList.childNodes[0]);
        }

        // Load the master entry names into the display list
        for (var i = 0; i < desiredContentArray.length; i++) {
            var newEntry = this.doc.createElement("LI");
            newEntry.textContent = desiredContentArray[i].getName();
            newEntry.id = desiredContentArray[i].getName();
            newEntry.class = "contentGuideMasterEntry";

            newEntry.style.listStyleType = "none"; // Removes index marks
            newEntry.style.cursor = "pointer";

            this.contentDisplayList.appendChild(newEntry);
        }
    }

    /**
     * Loads all the subentries of a master entry into the display list
     * @param {Number} masterEntryIndex the index of the master entry who's sub entries are going to be loaded
     */
    loadSubEntries(masterEntryIndex) {
        var subEntriesDisplayList = this.doc.createElement("UL");
        subEntriesDisplayList.id = "SubEntryList";
        var deselectClick = false; // If the same master entry is clicked twice, we instead will close the opened list

        // Only load new options if they have not deselected an entry
        if (!deselectClick) {
            // Load master entry's sub entries
            for (var i = 0; i < this.currentlyLoadedContent[masterEntryIndex].getSubEntries().length; i++) {
                var newSubEntry = this.doc.createElement("LI");
                newSubEntry.textContent = this.currentlyLoadedContent[masterEntryIndex].getSubEntries()[i].getName();
                newSubEntry.class = "contentGuideSubEntry";

                newSubEntry.style.listStyleType = "none";
                newSubEntry.style.cursor = "pointer";

                subEntriesDisplayList.appendChild(newSubEntry);
            }

            // If the master entry is in the middle of the list, we need to insert it before the next element, if it is at the last we need to append 
            if (this.contentDisplayList.childNodes.length == masterEntryIndex + 1) {
                this.contentDisplayList.appendChild(subEntriesDisplayList);
            } else {
                this.contentDisplayList.insertBefore(subEntriesDisplayList, this.contentDisplayList.childNodes[masterEntryIndex + 1]);
            }
        }
    }

    // Parses the desired content map into usable entry object structures
    async createContentArray(pathToContentMap) {
        const MASTER_ENTRY_TAG = "<New Master Entry>"; // Exact syntax of the new master entry tag
        const SUB_ENTRY_TAG = "<New Sub Entry>"; // Exact syntax of the new sub entry tag
        var lines = await this.splitTextFile(pathToContentMap);
        var content = [];

        for (var i = 0; i < lines.length; i++) {
            // First, we check if the current line is the start of a new entry
            if (lines[i].includes(MASTER_ENTRY_TAG) || lines[i].includes(SUB_ENTRY_TAG)) {
                var path = lines[i + 1]; // The path is the next line after the new entry tag
                var name = lines[i + 2]; // The name is two lines after the new entry tag
                var description = lines[i + 3]; // The description is three lines after the new entry tag

                // If the entry tag marks a new master entry, we can create a new master entry and add it to content
                if (lines[i].includes(MASTER_ENTRY_TAG)) {
                    content.push(new MasterEntry(path, name, description));
                }
                // If it is a new sub entry, we must add it to the last added Master Entry
                else if (lines[i].includes(SUB_ENTRY_TAG)) {
                    content[content.length - 1].addSubEntry(new SubEntry(path, name, description));
                }
            }
        }

        return content;
    }

    // Splits a text file into an array of its lines
    async splitTextFile(path) {
        var response = await fetch(path); // Get file
        var text = await response.text(); // Get files text
        return text.split("\r\n"); // split it at the end of every line
    }
}