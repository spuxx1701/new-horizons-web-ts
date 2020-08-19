// Leopold Hock | 30.04.2020
// Description: This service manages Stellarpedia.
import Ember from 'ember';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class StellarpediaService extends Service {
    @service manager;
    @service store;
    @service localizationService;

    namespace = "/assets/stellarpedia/stellarpedia_";
    defaultEntry = { bookId: "basic-rules", chapterId: "introduction", entryId: "welcome" };
    @tracked data;
    @tracked header;
    @tracked selectedEntry = {};
    @tracked currentPosition;
    @tracked history = [];
    @tracked historyIndex = 0;
    @tracked historyResetButtonDisabled = "disabled";
    @tracked historyForwardButtonDisabled = "disabled";
    @tracked historyBackButtonDisabled = "disabled";

    init() {
        super.init();
        this.load();
    }

    // load and return stellarpedia
    async load() {
        if (this.stellarpedia) {
            return this.stellarpedia;
        } else {
            let result = await this.store.findAll("stellarpedia");
            this.data = result;
            this.setSelectedEntry(this.defaultEntry.bookId, this.defaultEntry.chapterId, this.defaultEntry.entryId);
            return result;
        }
    }

    // Returns a book and/or chapter and/or entry (chapterId and entryId are optional)
    get(bookId, chapterId = undefined, entryId = undefined) {
        let that = this;
        bookId = this.manager.prepareId(bookId);
        // convert ids if needed
        if (chapterId) chapterId = this.manager.prepareId(chapterId);
        if (entryId) entryId = this.manager.prepareId(entryId);
        var book = this.store.peekRecord("stellarpedia", bookId);
        if (!book) {
            this.manager.log("Stellarpedia book " + bookId + " does not exist.", "error");
            return null;
        }
        // if chapterId is supplied, continue to look for chapter, else return book
        if (!chapterId) {
            return book;
        } else {
            let chapter;
            book.chapters.forEach(function (element, i) {
                if (that.manager.prepareId(element.id) === chapterId) {
                    chapter = element;
                }
            });
            if (!chapter) {
                this.manager.log("Stellarpedia chapter " + bookId + "/" + chapterId + " does not exist.", "error");
                return null;
            }
            // if entryId is supplied, continue to look for entry, else return chapter
            if (!entryId) {
                return chapter;
            } else {
                let entry;
                chapter.entries.forEach(function (element, i) {
                    if (that.manager.prepareId(element.id) === entryId) {
                        entry = element;
                    }
                })
                if (!entry) {
                    this.manager.log("Stellarpedia entry " + bookId + "/" + chapterId + "/" + entryId + " does not exist.", "error");
                    return null;
                }
                return entry;
            }
        }
    }

    // Returns an entry's header without tags
    getEntryHeader(entry, localize = true) {
        if (entry.elements.length) {
            for (let i = 0; entry.elements.length; i++) {
                if (entry.elements[i].startsWith("[hdr]")) {
                    let result = entry.elements[i].substring(5, entry.elements[i].length);
                    if (localize) {
                        let localizedResult = this.localizationService.getValue(result);
                        if (!localizedResult.startsWith("loc_miss::")) result = localizedResult;
                    }
                    return result;;
                }
            }
        }
        this.manager.log("Stellarpedia entry does not have a header element.");
        return null;
    }

    // Set selected entry
    setSelectedEntry(bookId, chapterId, entryId, addToHistory = true) {
        let entry = this.get(bookId, chapterId, entryId);
        this.header = this.getEntryHeader(entry);
        this.selectedEntry = entry;
        this.currentPosition = this.manager.localize(bookId) + " > " + this.get(bookId, chapterId).header + " > " + this.getEntryHeader(entry);
        this.addSelectedEntryToHistory(bookId, chapterId, entry.id);
        // update toolbar
        this.historyResetButtonDisabled = this.historyIndex === 0;
        this.historyBackButtonDisabled = this.historyIndex === 0 || this.history.length < 2;
        this.historyForwardButtonDisabled = this.historyIndex >= this.history.length - 1 || this.history.length < 2;
    }

    // Return an element's type
    //  Available types are: 'hdr' (Header element), 'txt' (Text element), 'spt' (Separator element),
    //  'spc' (Spacer element), 'img' (Image element) and 'row' (Table row element)
    getElementType(element, bookId = "", chapterId = "", entryId = "") {
        // Header element
        if (element.startsWith("[hdr")) {
            return "hdr";
        }
        // Separator element
        else if (element.startsWith("[spt")) {
            return "spt";
        }
        // Spacer element
        else if (element.startsWith("[spc")) {
            return "spc";
        }
        // Text element
        else if (element.startsWith("[txt")) {
            return "txt";
        }
        // Image element
        else if (element.startsWith("[img")) {
            return "img";
        }
        // Table row element
        else if (element.startsWith("[row")) {
            return "row";
        }
        // Element type not recognizable
        else {
            this.manager.log("Type of Stellarpedia element not recognizable: " + element + " (" + bookId + "/" + chapterId + "/" + entryId + ")");
            return null;
        }
    }

    // Returns the processes version of an element depending on its type.
    prepareElement(element) {
        let type = this.getElementType(element);
        let result;
        switch (type) {
            case "hdr":
                result = element.substring(5, element.length);
                break;
            case "txt":
                result = this.prepareText(element);
                break;
            case "img":
                result = element;
                break;
            case "row":
                result = element;
                break;
            default:
                result = element;
                break;
        }
        return result;
    }


    // Returns the processed version of a text element.
    prepareText(element) {
        // remove tag
        let result = element;
        let split = element.split("]");
        if (split.length === 2) {
            let constructor = split[0];
            result = split[1];
            let colorDefault = getComputedStyle(document.documentElement).getPropertyValue("--colorTextDefault").replace(" ", "");
            let colorHighlight = getComputedStyle(document.documentElement).getPropertyValue("--colorTextHighlight").replace(" ", "");
            // process constructor
            let params = constructor.split(";");
            for (let i = 0; i < params.length; i++) {
                if (params[i].startsWith("col=")) {
                    //let colorCode = params[i].Remove(0,4);
                    //colorDefault = colorCode;
                }
            }
            // replace <hl> tags
            result = result.replace("<hl>", "<b><span class='highlighted'>");
            result = result.replace("</hl>", "</span></b>");
            // replace \n tags
            result = result.replace("\\n", "<br>");
            // replace <link> tags
            // Example: <link=\"Arsenal;Introduction;WhatThisBookIsFor\">Arsenal des Sonnensystems</link>
            //result = result.replace("<link=\\\"", "<a href='");
            result = result.replace("<link=\\\"", "<span class='highlighted'");
            //result = result.replace("\\\">", "'>");
            result = result.replace("</link>", "</span>");
        } else {
            // syntax or formatting error, throw exception
            this.manager.log("Syntax error in Stellarpedia element: " + element, "error");
        }
        return result;
    }

    addSelectedEntryToHistory(bookId, chapterId, entryId) {
        let newHistoryEntry = {
            bookId: this.manager.prepareId(bookId),
            chapterId: this.manager.prepareId(chapterId),
            entryId: this.manager.prepareId(entryId)
        };
        // if history is empty, add new entry and be done with it
        if (this.history.length === 0) {
            this.history.push(newHistoryEntry);
            this.historyIndex = this.history.length - 1;
        }
        // if history is not empty
        else {
            let historyContainsEntry = false;
            let indexOfFoundEntry;
            for (let i = 0; i < this.history.length; i++) {
                if (this.history[i].bookId === newHistoryEntry.bookId
                    && this.history[i].chapterId === newHistoryEntry.chapterId
                    && this.history[i].entryId === newHistoryEntry.entryId) {
                    historyContainsEntry = true;
                    // if history already contains the new entry at some position, don't add it a second time
                    // and instead set index to that position
                    this.historyIndex = i;
                }
            }
            // if history does not contain the new entry yet, add it to the array
            if (!historyContainsEntry) {
                // if index is currently somewhere in the history, but not at the last position, remove all forward entries
                // before adding the new entry
                if (this.historyIndex < this.history.length - 1) {
                    this.history.splice(this.historyIndex + 1, this.history.length - 1);
                }
                this.history.push(newHistoryEntry);
                this.historyIndex = this.history.length - 1;
            }
        }
    }

    historyForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            let goToEntry = this.history[this.historyIndex];
            this.setSelectedEntry(goToEntry.bookId, goToEntry.chapterId, goToEntry.entryId, false);
        }
    }

    historyBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            let goToEntry = this.history[this.historyIndex];
            this.setSelectedEntry(goToEntry.bookId, goToEntry.chapterId, goToEntry.entryId, false);
        }
    }

    historyReset() {
        if (this.history.length > 0) {
            this.historyIndex = 0;
            this.setSelectedEntry(this.history[0].bookId, this.history[0].chapterId, this.history[0].entryId, false)
        }
    }
}


/*
            else if (element.StartsWith("[txt"))
            {
                string[] split = cleanString.Split(new string[] { ")]" }, StringSplitOptions.RemoveEmptyEntries);
                if (split.Length == 1)
                    window.SpawnTextObject(PrepareText(cleanString), defaultColor);
                else if (split.Length == 2)
                {
                    Color color = defaultColor;
                    string[] splitConstructor = split[0].Split(';');
                    foreach (string param in splitConstructor)
                    {
                        if (param.StartsWith("col="))
                        {
                            string colorCode = param.Remove(0, 4);
                            if (!ColorUtility.TryParseHtmlString(colorCode, out color))
                                Console.instance.LogMessage("warning", this.gameObject, colorCode + " is not a valid color code.");
                        }
                    }
                    window.SpawnTextObject(PrepareText(split[1]), color);
                }
                else
                    Console.instance.LogMessage("critical", this.gameObject, "Formatting error in Stellarpedia entry: " + entryData.id);
            }
            else if (element.StartsWith("[img"))
            {
                string[] split = cleanString.Split(new string[] { ")]" }, StringSplitOptions.RemoveEmptyEntries);
                if (split.Length == 1)
                    window.SpawnImageObject(cleanString);
                else if (split.Length == 2)
                {
                    window.SpawnImageObject(split[1]);
                    string[] splitConstructor = split[0].Split(';');
                    foreach (string param in splitConstructor)
                    {
                        if (param.StartsWith("ttl="))
                        {
                            window.SpawnTextObject(PrepareText(param.Remove(0, 4)), subTitleColor, TextAlignmentOptions.Center);
                        }
                    }
                }
                else
                    Console.instance.LogMessage("critical", this.gameObject, "Formatting error in Stellarpedia entry: " + entryData.id);
            }
            else if (element.StartsWith("[row"))
            {
                hasTable = true;
                string[] split = cleanString.Split(new string[] { ")]" }, StringSplitOptions.RemoveEmptyEntries);
                if (split.Length == 2)
                {
                    RowData rowData = new RowData() { isHeader = false, includeSeparator = true };
                    string[] splitConstructor = split[0].Split(';');
                    for (int i = 0; i < splitConstructor.Length; i++) // trim any spaces from parameters
                        splitConstructor[i].Trim(' ');
                    foreach (string param in splitConstructor)
                    {
                        if (param.Contains("="))
                        {
                            string argument = param.Split('=')[1];
                            if (param.StartsWith("header="))
                            {
                                if (argument == "true")
                                {
                                    rowData.isHeader = true;
                                    continue;
                                }
                                else if (argument == "false")
                                {
                                    rowData.isHeader = false;
                                    continue;
                                }
                            }
                            else if (param.StartsWith("layout="))
                            {
                                string[] args = argument.Split(',');
                                foreach (string s in args)
                                {
                                    if (int.TryParse(s, out int result))
                                    {
                                        rowData.layout.Add(result);
                                        rowData.alignment.Add("c");
                                    }
                                }
                                if (rowData.layout.Count > 0)
                                    continue;
                            }
                            else if (param.StartsWith("alignment="))
                            {
                                string[] args = argument.Split(',');
                                for (int i = 0; i < args.Length; i++)
                                {
                                    if (args[i] == "c" || args[i] == "l" || args[i] == "r")
                                    {
                                        rowData.alignment[i] = args[i];
                                    }
                                }
                                continue;
                            }
                            else if (param.StartsWith("last="))
                            {
                                if (argument == "true")
                                {
                                    rowData.includeSeparator = false;
                                    continue;
                                }
                                else
                                {
                                    rowData.includeSeparator = true;
                                    continue;
                                }
                            }
                        }
                        Console.instance.LogMessage("critical", this.gameObject, "Unknown parameter " + param + " in Stellarpedia entry: " + entryData.id);
                    }
                    string[] cells = split[1].Split(new string[] { "||" }, StringSplitOptions.RemoveEmptyEntries);
                    if (cells.Length > 0)
                    {
                        for (int i = 0; i < cells.Length; i++)
                        {
                            CellData cellData = new CellData() { text = cells[i] };
                            if (rowData.isHeader)
                                cellData.style = CellData.TableCellStyle.header;
                            else
                                cellData.style = CellData.TableCellStyle.text;
                            if (rowData.alignment[i] == "l")
                                cellData.textAlignment = TextAlignmentOptions.MidlineLeft;
                            else if (rowData.alignment[i] == "r")
                                cellData.textAlignment = TextAlignmentOptions.MidlineRight;
                            else
                                cellData.textAlignment = TextAlignmentOptions.Midline;
                            rowData.cells.Add(cellData);
                        }
                        window.SpawnTableRowObject(rowData);
                    }
                    else
                        Console.instance.LogMessage("critical", this.gameObject, "Formatting error in Stellarpedia entry: " + entryData.id);
                }
                else
                    Console.instance.LogMessage("critical", this.gameObject, "Formatting error in Stellarpedia entry: " + entryData.id);
            }
            else
            {
                Console.instance.LogMessage("warning", this.gameObject, "Element does not have valid constructor: " + entryData.id);
                window.SpawnTextObject(PrepareText(element), defaultColor);
            }
        }
        if (hasTable)
        {
            StartCoroutine(window.AdjustTableLayout());
        }
    }
*/