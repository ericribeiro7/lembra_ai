import { useState } from 'react'

function ShoppingList({ list, items, onAdd, onToggle, onDelete, onClearCompleted, onBack }) {
  const [newItem, setNewItem] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newItem.trim()) {
      onAdd(newItem.trim())
      setNewItem('')
    }
  }

  const checkedItems = items.filter(item => item.checked)
  const uncheckedItems = items.filter(item => !item.checked)

  // Categorias simuladas baseadas no nome do item
  const getCategory = (name) => {
    const lower = name.toLowerCase()
    if (lower.includes('leite') || lower.includes('queijo') || lower.includes('iogurte')) return 'Laticínios'
    if (lower.includes('pão') || lower.includes('bolo')) return 'Padaria'
    if (lower.includes('café') || lower.includes('açúcar') || lower.includes('arroz') || lower.includes('feijão')) return 'Mercearia'
    if (lower.includes('carne') || lower.includes('frango') || lower.includes('peixe')) return 'Açougue'
    if (lower.includes('sabão') || lower.includes('detergente') || lower.includes('papel')) return 'Limpeza'
    return 'Geral'
  }

  return (
    <div className="shopping-list">
      <header className="page-header">
        <button className="back-btn" onClick={onBack}>‹</button>
        <h1 className="page-title">{list?.name || 'Lista de Compras'}</h1>
        <button className="menu-btn">⋮</button>
      </header>

      {list?.month && (
        <div className="list-month-badge">
          📅 {list.month}
        </div>
      )}

      <div className="shopping-content">
        <form onSubmit={handleSubmit} className="add-item-form">
          <input
            type="text"
            placeholder="Adicionar novo item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="add-item-input"
          />
          <button type="submit" className="add-item-btn">
            +
          </button>
        </form>

        {items.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🛒</span>
            <p>Lista vazia!</p>
            <p className="empty-subtitle">Adicione itens para sua lista de compras</p>
          </div>
        ) : (
          <>
            {uncheckedItems.length > 0 && (
              <div className="items-section">
                <div className="section-header">
                  <h3 className="section-title">PENDENTES ({uncheckedItems.length})</h3>
                </div>
                <ul className="items-list">
                  {uncheckedItems.map(item => (
                    <li key={item.id} className="shopping-item" onClick={() => onToggle(item.id)}>
                      <div className="item-checkbox-wrapper">
                        <span className="check-icon">✓</span>
                      </div>
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-category">{getCategory(item.name)}</span>
                      </div>
                      <button 
                        className="item-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(item.id)
                        }}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {checkedItems.length > 0 && (
              <div className="items-section">
                <div className="section-header">
                  <h3 className="section-title">CONCLUÍDOS ({checkedItems.length})</h3>
                  <button className="clear-btn" onClick={onClearCompleted}>Limpar</button>
                </div>
                <ul className="items-list">
                  {checkedItems.map(item => (
                    <li key={item.id} className="shopping-item checked" onClick={() => onToggle(item.id)}>
                      <div className="item-checkbox-wrapper">
                        <span className="check-icon">✓</span>
                      </div>
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-category">{getCategory(item.name)}</span>
                      </div>
                      <button 
                        className="item-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(item.id)
                        }}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ShoppingList
