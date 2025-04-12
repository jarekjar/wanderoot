const DB_NAME = 'wanderoot_db';
const DB_VERSION = 1;
const STORE_NAME = 'saves';

interface DBSaveGame {
  id: number;
  saveData: any;
  lastModified: number;
}

export const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("Error opening IndexedDB");
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log("IndexedDB initialized successfully");
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create the saves object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('lastModified', 'lastModified', { unique: false });
      }
    };
  });
};

export const saveToIndexedDB = async (saveData: any, slotId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const save: DBSaveGame = {
        id: slotId,
        saveData,
        lastModified: Date.now()
      };

      const saveRequest = store.put(save);

      saveRequest.onsuccess = () => {
        console.log(`Save successful to slot ${slotId}`);
        resolve();
      };

      saveRequest.onerror = () => {
        console.error(`Error saving to slot ${slotId}:`, saveRequest.error);
        reject(saveRequest.error);
      };

      transaction.oncomplete = () => db.close();
    };
  });
};

export const loadFromIndexedDB = async (slotId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(slotId);

      getRequest.onsuccess = () => {
        const result = getRequest.result;
        resolve(result ? result.saveData : null);
      };

      getRequest.onerror = () => {
        console.error(`Error loading slot ${slotId}:`, getRequest.error);
        reject(getRequest.error);
      };

      transaction.oncomplete = () => db.close();
    };
  });
};

export const getAllSavesFromIndexedDB = async (): Promise<{ [key: number]: any }> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        const saves = getAllRequest.result.reduce((acc: { [key: number]: any }, save: DBSaveGame) => {
          acc[save.id] = save.saveData;
          return acc;
        }, {});
        resolve(saves);
      };

      getAllRequest.onerror = () => {
        console.error('Error loading all saves:', getAllRequest.error);
        reject(getAllRequest.error);
      };

      transaction.oncomplete = () => db.close();
    };
  });
};

export const deleteSaveFromIndexedDB = async (slotId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(slotId);

      deleteRequest.onsuccess = () => {
        console.log(`Save slot ${slotId} deleted successfully`);
        resolve();
      };

      deleteRequest.onerror = () => {
        console.error(`Error deleting slot ${slotId}:`, deleteRequest.error);
        reject(deleteRequest.error);
      };

      transaction.oncomplete = () => db.close();
    };
  });
}; 