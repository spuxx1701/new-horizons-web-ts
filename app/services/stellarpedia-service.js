//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-22
// Description:
// This service manages Stellarpedia.
//----------------------------------------------------------------------------//
import Ember from 'ember';
import Service from '@ember/service';
import config from '../config/environment';
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
    @tracked selectedBookId;
    @tracked selectedChapterId;
    @tracked selectedEntry = {};
    @tracked currentPosition;

    init() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Initializer method.
        //----------------------------------------------------------------------------//
        super.init();
        this.load();
    }

    async load() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Load and returns the Stellarpedia.
        //----------------------------------------------------------------------------//
        if (this.data) {
            return this.data;
        } else {
            let result = await this.store.findAll("stellarpedia");
            this.data = result;
            this.manager.log("Stellarpedia initialized.");
            return result;
        }
    }

    get(bookId, chapterId = undefined, entryId = undefined) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Returns a book and/or chapter and/or entry (chapterId and entryId are optional).
        //----------------------------------------------------------------------------//
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
                if (element.id === chapterId) {
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
                    if (element.id === entryId) {
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

    getEntryHeader(entry, localize = true) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Returns an entry's header without tags
        //----------------------------------------------------------------------------//
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

    setSelectedEntry(bookId, chapterId, entryId) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Sets selectedEntry property.
        //----------------------------------------------------------------------------//
        let entry = this.get(bookId, chapterId, entryId);
        this.header = this.getEntryHeader(entry);
        this.selectedBookId = bookId;
        this.selectedChapterId = chapterId;
        this.selectedEntry = entry;
        this.currentPosition = this.manager.localize(bookId) + " > " + this.get(bookId, chapterId).header + " > " + this.getEntryHeader(entry);
    }

    getElementType(element, bookId = "", chapterId = "", entryId = "") {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Return an element's type
        // Available types are: 'hdr' (Header element), 'txt' (Text element), 'spt' (Separator element),
        // 'spc' (Spacer element), 'img' (Image element) and 'row' (Table row element).
        //----------------------------------------------------------------------------//
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
        // Missing element
        else if (element.startsWith("[mis]")) {
            return "mis";
        }
        // Element type not recognizable
        else {
            this.manager.log("Type of Stellarpedia element not recognizable: " + element + " (" + bookId + "/" + chapterId + "/" + entryId + ")");
            return null;
        }
    }

    prepareElement(element) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Returns the processes version of an element depending on its type.
        //----------------------------------------------------------------------------//
        let type = this.getElementType(element);
        let result;
        switch (type) {
            case "hdr":
                result = element.substring(5, element.length);
                let localized = this.manager.localize(result);
                if (!localized.startsWith("loc_miss:")) result = localized;
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
            case "mis":
                result = "";
                break;
            default:
                result = element;
                break;
        }
        return result;
    }


    prepareText(element) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Returns the processed version of a text element.
        //----------------------------------------------------------------------------//
        // remove tag
        let result = element;
        let split = element.split("]");
        if (split.length === 2) {
            let constructor = split[0];
            result = split[1];
            //let colorDefault = getComputedStyle(document.documentElement).getPropertyValue("--colorTextDefault").replace(" ", "");
            //let colorHighlight = getComputedStyle(document.documentElement).getPropertyValue("--colorTextHighlight").replace(" ", "");
            // process constructor
            let params = constructor.split(";");
            for (let i = 0; i < params.length; i++) {
                if (params[i].startsWith("col=")) {
                    //let colorCode = params[i].Remove(0,4);
                    //colorDefault = colorCode;
                }
            }
            // replace <hl> tags
            result = result.replaceAll(/<hl>/g, "<b><span class='highlighted'>");
            result = result.replaceAll(/<\/hl>/g, "</span></b>");
            // replace \n tags
            result = result.replaceAll(/\\n/g, "<br>");
            // process <lc> tags
            let locRegex = /<lc>(.*?)<\/lc>/g;
            let locMatches = [...result.matchAll(locRegex)];
            for (let locMatch of locMatches) {
                result = result.replace(locMatch[0], this.manager.localize(locMatch[1]))
            }
            // process <dt> tags
            let dataRegex = /<dt>(.*?)<\/dt>/g;
            let dataMatches = [...result.matchAll(dataRegex)];
            for (let dataMatch of dataMatches) {
                let dataPath = dataMatch[1];
                let dataResult = this.manager.database.getDataFromPath(dataPath);
                if (dataResult) {
                    result.replace(dataMatch[0], dataResult);
                } else {
                    result = result.replace(dataMatch[0], "data_miss::" + dataPath);
                }
            }
            // process <link> tags
            let linkRegex = /<link=(.*?)<\/link>/g;
            let linkMatches = [...result.matchAll(linkRegex)];
            for (let linkMatch of linkMatches) {
                let linkPath = linkMatch[1].split(">")[0].replaceAll(/\"/g);
                let linkText = linkMatch[1].split(">")[1];
                if (!linkText) linkText = "";
                // if link contains an actual URL, replace with <a href=url>
                if (linkPath.startsWith("http") || linkPath.startsWith("mailto")) {
                    result = result.replaceAll(linkMatch[0], "<a href='" + linkPath + "'>" + linkText + "</a>");
                }
                // if not, 
                else {
                    let entryUrl = config.APP.stellarpediaUrl + this.manager.prepareId(linkPath);
                    entryUrl = entryUrl.replaceAll(/;/g, "+");
                    console.log(entryUrl);
                }
            }
        } else {
            // syntax or formatting error, throw exception
            this.manager.log("Syntax error in Stellarpedia element: " + element, "error");
        }
        return result;
    }
}


/*
    public string PrepareText(string text, bool highlightHyperlinks = true)
    {
        Regex dataRegex = new Regex("<dt>(.*?)</dt>");
        MatchCollection dataMatches = dataRegex.Matches(text);
        foreach (Match match in dataMatches)
        {
            Regex dataMatchRegex = new Regex(match.ToString());
            string dataResult = match.ToString();
            if (DatabaseStorage.instance.TryReadDataFromString(match.ToString().Replace("<dt>", "").Replace("</dt>", ""), out dataResult))
                text = dataMatchRegex.Replace(text, dataResult);
        }
    }


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