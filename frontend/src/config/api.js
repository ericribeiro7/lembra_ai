// Armazenamento local - sem necessidade de servidor
// Todos os dados ficam salvos no dispositivo

const STORAGE_KEYS = {
  NOTES: 'lembra_ai_notes',
  LISTS: 'lembra_ai_lists',
  ITEMS: 'lembra_ai_items',
};

// Helpers para localStorage
const storage = {
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },
  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }
};

export const api = {
  // ============ NOTES ============
  async get(endpoint) {
    // GET /api/notes
    if (endpoint === '/api/notes') {
      const notes = storage.get(STORAGE_KEYS.NOTES);
      return notes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    // GET /api/shopping-lists
    if (endpoint === '/api/shopping-lists') {
      const lists = storage.get(STORAGE_KEYS.LISTS);
      const items = storage.get(STORAGE_KEYS.ITEMS);
      
      return lists.map(list => ({
        ...list,
        total_items: items.filter(i => i.list_id === list.id).length,
        pending_items: items.filter(i => i.list_id === list.id && !i.checked).length,
      })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    // GET /api/shopping-lists/:id/items
    const itemsMatch = endpoint.match(/\/api\/shopping-lists\/(.+)\/items/);
    if (itemsMatch) {
      const listId = itemsMatch[1];
      const items = storage.get(STORAGE_KEYS.ITEMS);
      return items.filter(i => i.list_id === listId);
    }
    
    return [];
  },

  async post(endpoint, data) {
    // POST /api/notes
    if (endpoint === '/api/notes') {
      const notes = storage.get(STORAGE_KEYS.NOTES);
      const newNote = {
        id: storage.generateId(),
        ...data,
        created_at: new Date().toISOString(),
      };
      notes.push(newNote);
      storage.set(STORAGE_KEYS.NOTES, notes);
      return newNote;
    }
    
    // POST /api/shopping-lists
    if (endpoint === '/api/shopping-lists') {
      const lists = storage.get(STORAGE_KEYS.LISTS);
      const newList = {
        id: storage.generateId(),
        ...data,
        created_at: new Date().toISOString(),
      };
      lists.push(newList);
      storage.set(STORAGE_KEYS.LISTS, lists);
      return { ...newList, total_items: 0, pending_items: 0 };
    }
    
    // POST /api/shopping-lists/:id/items
    const itemsMatch = endpoint.match(/\/api\/shopping-lists\/(.+)\/items/);
    if (itemsMatch) {
      const listId = itemsMatch[1];
      const items = storage.get(STORAGE_KEYS.ITEMS);
      const newItem = {
        id: storage.generateId(),
        list_id: listId,
        ...data,
        checked: data.checked ? 1 : 0,
        created_at: new Date().toISOString(),
      };
      items.push(newItem);
      storage.set(STORAGE_KEYS.ITEMS, items);
      return { ...newItem, checked: newItem.checked === 1 };
    }
    
    return data;
  },

  async put(endpoint, data) {
    // PUT /api/shopping-items/:id
    const itemMatch = endpoint.match(/\/api\/shopping-items\/(.+)/);
    if (itemMatch) {
      const itemId = itemMatch[1];
      const items = storage.get(STORAGE_KEYS.ITEMS);
      const index = items.findIndex(i => i.id === itemId);
      if (index !== -1) {
        items[index] = { ...items[index], ...data, checked: data.checked ? 1 : 0 };
        storage.set(STORAGE_KEYS.ITEMS, items);
        return items[index];
      }
    }
    return data;
  },

  async delete(endpoint) {
    // DELETE /api/notes/:id
    const noteMatch = endpoint.match(/\/api\/notes\/(.+)/);
    if (noteMatch) {
      const noteId = noteMatch[1];
      const notes = storage.get(STORAGE_KEYS.NOTES);
      storage.set(STORAGE_KEYS.NOTES, notes.filter(n => n.id !== noteId));
      return { message: 'Deletado' };
    }
    
    // DELETE /api/shopping-lists/:id/completed
    const completedMatch = endpoint.match(/\/api\/shopping-lists\/(.+)\/completed/);
    if (completedMatch) {
      const listId = completedMatch[1];
      const items = storage.get(STORAGE_KEYS.ITEMS);
      storage.set(STORAGE_KEYS.ITEMS, items.filter(i => i.list_id !== listId || !i.checked));
      return { message: 'Itens concluídos removidos' };
    }
    
    // DELETE /api/shopping-lists/:id
    const listMatch = endpoint.match(/\/api\/shopping-lists\/(.+)/);
    if (listMatch) {
      const listId = listMatch[1];
      const lists = storage.get(STORAGE_KEYS.LISTS);
      const items = storage.get(STORAGE_KEYS.ITEMS);
      storage.set(STORAGE_KEYS.LISTS, lists.filter(l => l.id !== listId));
      storage.set(STORAGE_KEYS.ITEMS, items.filter(i => i.list_id !== listId));
      return { message: 'Lista deletada' };
    }
    
    // DELETE /api/shopping-items/:id
    const itemMatch = endpoint.match(/\/api\/shopping-items\/(.+)/);
    if (itemMatch) {
      const itemId = itemMatch[1];
      const items = storage.get(STORAGE_KEYS.ITEMS);
      storage.set(STORAGE_KEYS.ITEMS, items.filter(i => i.id !== itemId));
      return { message: 'Item deletado' };
    }
    
    return { message: 'OK' };
  },
};

export default api;
