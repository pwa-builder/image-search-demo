import { fileOpen, FileWithHandle } from "browser-fs-access";
import MiniSearch from 'minisearch'

let aiWorker: Worker | undefined = undefined;

let miniSearch: MiniSearch | undefined = undefined;

export async function getLocalFiles(): Promise<FileWithHandle[]> {
    // get from indexedDB first, if not found, get from local file system
    const { get } = await import("idb-keyval");
    const files = await get("photos");
    if (files) {
        if (!miniSearch) {
            miniSearch = new MiniSearch({
                fields: ['name', 'caption', 'text', 'classification'], // fields to index for full-text search
                storeFields: ['name', 'id'] // fields to return with search results
            })
        }
        else {
            miniSearch.removeAll();
        }

        miniSearch.addAll(files);
    }

    const options = {
        // List of allowed MIME types, defaults to `*/*`.
        mimeTypes: ['image/*'],
        // List of allowed file extensions (with leading '.'), defaults to `''`.
        extensions: ['.png', '.jpg', '.jpeg', '.webp'],
        // Set to `true` for allowing multiple files, defaults to `false`.
        multiple: true,
        // Textual description for file dialog , defaults to `''`.
        description: 'Image files',
        // Suggested directory in which the file picker opens. A well-known directory, or a file or directory handle.
        startIn: 'pictures',
        // By specifying an ID, the user agent can remember different directories for different IDs.
        id: 'projects',
        // Include an option to not apply any filter in the file picker, defaults to `false`.
        excludeAcceptAllOption: true,
    };

    // @ts-ignore
    const blobs = (await fileOpen(options) as FileWithHandle[]);

    if (!aiWorker) {
        aiWorker = new Worker(new URL('../services/image-ai.ts', import.meta.url), { type: 'module' });
    }

    let results: any[] = [];

    // go through each blob and get the caption one after the other
    for (const blob of blobs) {
        await new Promise((resolve) => {
            aiWorker!.onmessage = async (e: any) => {
                if (e.data.type === 'processed') {
                    console.log(e.data.data.caption[0]);
                    const captionText = e.data.data.caption[0].generated_text;
                    console.log("e.data.data", e.data.data);
                    const imageText = e.data.data.text[0].generated_text;
                    console.log("imageText", imageText);
                    const classification = e.data.data.classification[0].label;
                    const usefulObject = await saveToDB(blob, captionText, imageText, classification);
                    results.push(usefulObject);
                    resolve(usefulObject);
                }
            }

            aiWorker!.postMessage({ type: 'caption', blob });
        });
    }

    return results;
}

export async function saveToDB(blob: FileWithHandle, caption: string, textFromImage: string, classification: string) {
    // save to indexedDB with idb-keyval
    const { set, get } = await import('idb-keyval');
    const db = await get('photos');

    const newObject = {
        name: blob.name,
        type: blob.type,
        lastModified: blob.lastModified,
        size: blob.size,
        caption,
        classification,
        text: textFromImage,
        id: Math.random().toString(36).substring(7),
        blob: blob
    };

    if (!miniSearch) {
        miniSearch = new MiniSearch({
            fields: ['name', 'caption', 'text', 'classification'], // fields to index for full-text search
            storeFields: ['name', 'id'] // fields to return with search results
        })
    }

    miniSearch.add(newObject);

    if (db) {
        await set('photos', [...db, newObject]);
    }
    else {
        await set('photos', [newObject]);
    }

    return newObject;

}

export async function searchDB(query: string) {
    if (miniSearch) {
        return miniSearch.search(query);
    }
    else {
        return [];
    }
}

export async function getFromDB() {
    const { get } = await import('idb-keyval');
    const db = await get('photos');
    if (db) {
        if (!miniSearch) {
            miniSearch = new MiniSearch({
                fields: ['name', 'caption', 'text', 'classification'], // fields to index for full-text search
                storeFields: ['name', 'id'] // fields to return with search results
            })
        }
        else {
            miniSearch.removeAll();
        }

        miniSearch.addAll(db);
    }

    return db;
};

export async function deleteFromDB(id: string) {
    const { get, set } = await import('idb-keyval');
    const db = await get('photos');
    if (db) {
        const updatedDB = db.filter((file: any) => file.id !== id);
        await set('photos', updatedDB);
        if (miniSearch) {
            miniSearch.removeAll();
            miniSearch.addAll(updatedDB);
        }
    }
}

export async function getSingleFile(id: string) {
    const db = await getFromDB();
    return db.find((file: any) => file.id === id);
}