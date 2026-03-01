import { useState, useEffect } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HomePage from './components/HomePage'
import NotesList from './components/NotesList'
import ShoppingLists from './components/ShoppingLists'
import ShoppingList from './components/ShoppingList'
import AddNoteModal from './components/AddNoteModal'
import AddListModal from './components/AddListModal'
import api from './config/api'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('home')
  const [notes, setNotes] = useState([])
  const [shoppingLists, setShoppingLists] = useState([])
  const [selectedList, setSelectedList] = useState(null)
  const [shoppingItems, setShoppingItems] = useState([])
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [showAddListModal, setShowAddListModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  // Carregar dados do backend
  useEffect(() => {
    fetchNotes()
    fetchShoppingLists()
  }, [])

  // Carregar itens quando selecionar uma lista
  useEffect(() => {
    if (selectedList) {
      fetchListItems(selectedList.id)
    }
  }, [selectedList])

  // Detectar teclado virtual em dispositivos móveis
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const handleViewportResize = () => {
      const keyboardHeight = window.innerHeight - viewport.height
      setIsKeyboardOpen(keyboardHeight > 150)
    }

    viewport.addEventListener('resize', handleViewportResize)
    handleViewportResize()

    return () => {
      viewport.removeEventListener('resize', handleViewportResize)
    }
  }, [])

  // Fallback por foco em inputs/textareas
  useEffect(() => {
    const isTextField = (element) => {
      if (!element) return false
      return (
        element.tagName === 'INPUT' ||
        element.tagName === 'TEXTAREA' ||
        element.isContentEditable
      )
    }

    const handleFocusIn = (event) => {
      if (isTextField(event.target)) {
        setIsKeyboardOpen(true)
      }
    }

    const handleFocusOut = () => {
      setTimeout(() => {
        if (!isTextField(document.activeElement)) {
          setIsKeyboardOpen(false)
        }
      }, 100)
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)

    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
    }
  }, [])

  const fetchNotes = async () => {
    try {
      const data = await api.get('/api/notes')
      setNotes(data)
    } catch (err) {
      console.error('Erro ao carregar notas:', err)
    }
  }

  const fetchShoppingLists = async () => {
    try {
      const data = await api.get('/api/shopping-lists')
      setShoppingLists(data)
    } catch (err) {
      console.error('Erro ao carregar listas:', err)
    }
  }

  const fetchListItems = async (listId) => {
    try {
      const data = await api.get(`/api/shopping-lists/${listId}/items`)
      setShoppingItems(data)
    } catch (err) {
      console.error('Erro ao carregar itens:', err)
    }
  }

  // Notes actions
  const addNote = async (note) => {
    try {
      const newNote = await api.post('/api/notes', note)
      setNotes([newNote, ...notes])
      setShowAddNoteModal(false)
    } catch (err) {
      console.error('Erro ao adicionar nota:', err)
    }
  }

  const deleteNote = async (id) => {
    try {
      await api.delete(`/api/notes/${id}`)
      setNotes(notes.filter(note => note.id !== id))
    } catch (err) {
      console.error('Erro ao deletar nota:', err)
    }
  }

  // Shopping Lists actions
  const createShoppingList = async (listData) => {
    try {
      const newList = await api.post('/api/shopping-lists', listData)
      setShoppingLists([newList, ...shoppingLists])
      setShowAddListModal(false)
    } catch (err) {
      console.error('Erro ao criar lista:', err)
    }
  }

  const deleteShoppingList = async (id) => {
    try {
      await api.delete(`/api/shopping-lists/${id}`)
      setShoppingLists(shoppingLists.filter(list => list.id !== id))
    } catch (err) {
      console.error('Erro ao deletar lista:', err)
    }
  }

  // Shopping Items actions
  const addShoppingItem = async (itemName) => {
    if (!selectedList) return
    try {
      const newItem = await api.post(`/api/shopping-lists/${selectedList.id}/items`, { name: itemName, checked: false })
      setShoppingItems([...shoppingItems, newItem])
      // Atualizar contagem na lista
      setShoppingLists(shoppingLists.map(l => 
        l.id === selectedList.id 
          ? { ...l, total_items: l.total_items + 1, pending_items: l.pending_items + 1 }
          : l
      ))
    } catch (err) {
      console.error('Erro ao adicionar item:', err)
    }
  }

  const toggleShoppingItem = async (id) => {
    const item = shoppingItems.find(i => i.id === id)
    try {
      await api.put(`/api/shopping-items/${id}`, { checked: !item.checked })
      setShoppingItems(shoppingItems.map(i => 
        i.id === id ? { ...i, checked: !i.checked } : i
      ))
      // Atualizar contagem pendente na lista
      const delta = item.checked ? 1 : -1
      setShoppingLists(shoppingLists.map(l => 
        l.id === selectedList.id 
          ? { ...l, pending_items: l.pending_items + delta }
          : l
      ))
    } catch (err) {
      console.error('Erro ao atualizar item:', err)
    }
  }

  const deleteShoppingItem = async (id) => {
    const item = shoppingItems.find(i => i.id === id)
    try {
      await api.delete(`/api/shopping-items/${id}`)
      setShoppingItems(shoppingItems.filter(i => i.id !== id))
      // Atualizar contagem na lista
      setShoppingLists(shoppingLists.map(l => 
        l.id === selectedList.id 
          ? { 
              ...l, 
              total_items: l.total_items - 1, 
              pending_items: item.checked ? l.pending_items : l.pending_items - 1 
            }
          : l
      ))
    } catch (err) {
      console.error('Erro ao deletar item:', err)
    }
  }

  const clearCompleted = async () => {
    if (!selectedList) return
    try {
      await api.delete(`/api/shopping-lists/${selectedList.id}/completed`)
      const completedCount = shoppingItems.filter(i => i.checked).length
      setShoppingItems(shoppingItems.filter(item => !item.checked))
      setShoppingLists(shoppingLists.map(l => 
        l.id === selectedList.id 
          ? { ...l, total_items: l.total_items - completedCount }
          : l
      ))
    } catch (err) {
      console.error('Erro ao limpar concluídos:', err)
    }
  }

  const openList = (list) => {
    setSelectedList(list)
    setActiveView('shopping-detail')
  }

  const closeList = () => {
    setSelectedList(null)
    setShoppingItems([])
    setActiveView('shopping')
  }

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPendingItems = shoppingLists.reduce((sum, l) => sum + l.pending_items, 0)

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomePage 
            pendingItems={totalPendingItems}
            recentNotes={notes.length}
            onOpenShopping={() => setActiveView('shopping')}
            onOpenNotes={() => setActiveView('notes')}
          />
        )
      case 'shopping':
        return (
          <ShoppingLists 
            lists={shoppingLists}
            onSelectList={openList}
            onCreateList={() => setShowAddListModal(true)}
            onDeleteList={deleteShoppingList}
            onBack={() => setActiveView('home')}
          />
        )
      case 'shopping-detail':
        return (
          <ShoppingList 
            list={selectedList}
            items={shoppingItems}
            onAdd={addShoppingItem}
            onToggle={toggleShoppingItem}
            onDelete={deleteShoppingItem}
            onClearCompleted={clearCompleted}
            onBack={closeList}
          />
        )
      case 'notes':
        return (
          <NotesList 
            notes={filteredNotes} 
            onDelete={deleteNote}
            onBack={() => setActiveView('home')}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )
      case 'settings':
        return (
          <div className="settings-page">
            <h2>Ajustes</h2>
            <p>Em breve...</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={`app ${isKeyboardOpen ? 'keyboard-open' : ''}`}>
      {activeView === 'home' && <Header />}
      
      <main className="content">
        {renderContent()}
      </main>

      {activeView === 'notes' && !isKeyboardOpen && (
        <button className="fab" onClick={() => setShowAddNoteModal(true)}>
          +
        </button>
      )}

      {activeView === 'shopping' && !isKeyboardOpen && (
        <button className="fab" onClick={() => setShowAddListModal(true)}>
          +
        </button>
      )}

      <BottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        hidden={isKeyboardOpen}
      />

      {showAddNoteModal && (
        <AddNoteModal 
          onAdd={addNote} 
          onClose={() => setShowAddNoteModal(false)} 
        />
      )}

      {showAddListModal && (
        <AddListModal 
          onAdd={createShoppingList} 
          onClose={() => setShowAddListModal(false)} 
        />
      )}
    </div>
  )
}

export default App
