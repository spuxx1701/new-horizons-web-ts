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
    @tracked data;
    @tracked header;
    @tracked selectedEntry = {};

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
            return result;
        }
    }

    // Returns a book and/or chapter and/or entry (chapterId and entryId are optional)
    async get(bookId, chapterId = undefined, entryId = undefined) {
        let that = this;
        bookId = this.manager.prepareId(bookId);
        // convert ids if needed
        if (chapterId) chapterId = this.manager.prepareId(chapterId);
        if (entryId) entryId = this.manager.prepareId(entryId);
        if (!this.stellarpedia) {
            await this.load();
        }
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

    // Set selected entry.
    setSelectedEntry(entry) {
        this.header = this.getEntryHeader(entry);
        this.selectedEntry = entry;
    }
}
