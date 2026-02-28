const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ charset: 'utf-8' }));

// Set UTF-8 for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Database setup
const dbPath = path.join(__dirname, 'lembra_ai.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shopping_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    month TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shopping_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER,
    name TEXT NOT NULL,
    checked INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE
  );
`);

// ============ NOTES API ============

// Get all notes
app.get('/api/notes', (req, res) => {
  try {
    const notes = db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create note
app.post('/api/notes', (req, res) => {
  try {
    const { title, content } = req.body;
    const result = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').run(title, content);
    const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete note
app.delete('/api/notes/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    res.json({ message: 'Nota deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ SHOPPING LISTS API ============

// Get all shopping lists
app.get('/api/shopping-lists', (req, res) => {
  try {
    const lists = db.prepare(`
      SELECT sl.*, 
        (SELECT COUNT(*) FROM shopping_items WHERE list_id = sl.id) as total_items,
        (SELECT COUNT(*) FROM shopping_items WHERE list_id = sl.id AND checked = 0) as pending_items
      FROM shopping_lists sl 
      ORDER BY created_at DESC
    `).all();
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create shopping list
app.post('/api/shopping-lists', (req, res) => {
  try {
    const { name, month } = req.body;
    const result = db.prepare('INSERT INTO shopping_lists (name, month) VALUES (?, ?)').run(name, month || null);
    const newList = db.prepare('SELECT * FROM shopping_lists WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...newList, total_items: 0, pending_items: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete shopping list
app.delete('/api/shopping-lists/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM shopping_items WHERE list_id = ?').run(id);
    db.prepare('DELETE FROM shopping_lists WHERE id = ?').run(id);
    res.json({ message: 'Lista deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ SHOPPING ITEMS API ============

// Get items from a specific list
app.get('/api/shopping-lists/:listId/items', (req, res) => {
  try {
    const { listId } = req.params;
    const items = db.prepare('SELECT * FROM shopping_items WHERE list_id = ? ORDER BY checked ASC, created_at DESC').all(listId);
    const formattedItems = items.map(item => ({
      ...item,
      checked: item.checked === 1
    }));
    res.json(formattedItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create item in a list
app.post('/api/shopping-lists/:listId/items', (req, res) => {
  try {
    const { listId } = req.params;
    const { name, checked } = req.body;
    const result = db.prepare('INSERT INTO shopping_items (list_id, name, checked) VALUES (?, ?, ?)').run(listId, name, checked ? 1 : 0);
    const newItem = db.prepare('SELECT * FROM shopping_items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({
      ...newItem,
      checked: newItem.checked === 1
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update shopping item
app.put('/api/shopping-items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { checked } = req.body;
    db.prepare('UPDATE shopping_items SET checked = ? WHERE id = ?').run(checked ? 1 : 0, id);
    const updatedItem = db.prepare('SELECT * FROM shopping_items WHERE id = ?').get(id);
    res.json({
      ...updatedItem,
      checked: updatedItem.checked === 1
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete shopping item
app.delete('/api/shopping-items/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM shopping_items WHERE id = ?').run(id);
    res.json({ message: 'Item deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete completed items from a list
app.delete('/api/shopping-lists/:listId/completed', (req, res) => {
  try {
    const { listId } = req.params;
    db.prepare('DELETE FROM shopping_items WHERE list_id = ? AND checked = 1').run(listId);
    res.json({ message: 'Itens concluídos removidos' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
  🚀 Servidor Lembra Aí rodando!
  📍 http://localhost:${PORT}
  
  Endpoints disponíveis:
  - GET    /api/notes      - Listar notas
  - POST   /api/notes      - Criar nota
  - DELETE /api/notes/:id  - Deletar nota
  - GET    /api/shopping   - Listar itens
  - POST   /api/shopping   - Criar item
  - PUT    /api/shopping/:id - Atualizar item
  - DELETE /api/shopping/:id - Deletar item
  `);
});
