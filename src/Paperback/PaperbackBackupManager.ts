import { LightRepresentation } from "../LightRepresentation/LightRepresentation"
import { PaperbackBackup } from "./PaperbackBackup"

/**
 * TODO: info about the version
 */
export class PaperbackBackupManager {
    
    private backup: PaperbackBackup.Backup

    constructor() {
        this.backup = this.returnEmptyBackup()
    }

    returnEmptyBackup(): PaperbackBackup.Backup {
        return {
            library:             [],
            sourceMangas:        [],
            chapterMarkers:      [],
            backupSchemaVersion: 3,
            date:                650282810.89528203,
            tabs:                [],
            version:             "v0.6.0-b1.0.5",
            sourceRepositories:  [],
            activeSources:       []
        }
    }

    /* Loading a backup */

    load(backup: PaperbackBackup.Backup) {
        this.backup = backup
    }

    /* Exporting a backup */

    exportBackup(): PaperbackBackup.Backup {
        return this.backup
    }

    /**
     * @returns A {@link LightRepresentation} of the backup, easily exploitable to display the main content of the backup.
     */
    exportLightRepresentation(): LightRepresentation.Backup {
        const library: LightRepresentation.Title[] = []

        const tabs: {[id: string]: string} = {}
        const sources: {[id: string]: string} = {}

        // Manga parsing
        for (const libraryManga of this.backup.library) {

            const tabsIds = []
            for (const libraryTab of libraryManga.libraryTabs) {
                tabsIds.push(libraryTab.id)
            }

            // There can be multiple merged sources for this title
            // We will find these sources in `this.backup.sourceMangas`
            const sourcesIds = []
            for (const sourceManga of this.backup.sourceMangas) {
                if (sourceManga.id === libraryManga.manga.id) {
                    sourcesIds.push(sourceManga.sourceId)
                }
            }

            library.push({
                titles:         libraryManga.manga.titles,
                author:         libraryManga.manga.author,
                artist:         libraryManga.manga.artist,
                description:    libraryManga.manga.desc,
                cover:          libraryManga.manga.image,
                hentai:         libraryManga.manga.hentai,
                tabsIds:        tabsIds,
                sourcesIds:     sourcesIds
            })
        }

        // Tabs parsing
        for (const tab of this.backup.tabs) {
            tabs[tab.id] = tab.name
        }

        // Sources parsing
        for (const source of this.backup.activeSources) {
            tabs[source.id] = source.name
        }

        return {
            library:             library,
            tabs:                tabs,
            sources:             sources
        }
    }

    /* Helper functions */

    appendLibraryManga(libraryManga: PaperbackBackup.LibraryManga): void {
        this.backup.library.push(libraryManga)
    }

    appendSourceManga(sourceManga: PaperbackBackup.SourceManga): void {
        this.backup.sourceMangas.push(sourceManga)
    }

    appendChapterMarker(chapterMarker: PaperbackBackup.ChapterMarker): void {
        this.backup.chapterMarkers.push(chapterMarker)
    }

    appendChapterMarkers(chapterMarkers: PaperbackBackup.ChapterMarker[]): void {
        for (const chapterMarker of chapterMarkers) {
            this.appendChapterMarker(chapterMarker)
        }
    }

    appendLibraryTab(tab: PaperbackBackup.LibraryTab): void {
        this.backup.tabs.push(tab)
    }

    appendSourceRepository(repository: PaperbackBackup.SourceRepository): void {
        this.backup.sourceRepositories.push(repository)
    }

    appendActiveSource(source: PaperbackBackup.ActiveSource): void {
        // If this source is already registered, do not apply a duplicate
        if (this.backup.activeSources.some(x => source.id === x.id)) {
            return
        }

        this.backup.activeSources.push(source)
    }

}