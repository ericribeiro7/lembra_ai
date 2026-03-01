function ShoppingLists({ lists, onSelectList, onCreateList, onDeleteList, onBack }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    })
  }

  return (
    <div className="shopping-lists-page">
      <header className="page-header">
        <button className="back-btn" onClick={onBack}>‹</button>
        <h1 className="page-title">Listas de Compras</h1>
        <button className="menu-btn">⋮</button>
      </header>

      <div className="lists-content">
        {lists.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p>Nenhuma lista ainda!</p>
            <p className="empty-subtitle">Crie sua primeira lista de compras</p>
          </div>
        ) : (
          <div className="lists-grid">
            {lists.map(list => (
              <div 
                key={list.id} 
                className="list-card"
                onClick={() => onSelectList(list)}
              >
                <div className="list-card-header">
                  <div className="list-icon">🛒</div>
                  <button 
                    className="list-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteList(list.id)
                    }}
                  >
                    ✕
                  </button>
                </div>
                <h3 className="list-name">{list.name}</h3>
                <div className="list-meta">
                  {list.month && <span className="list-month">{list.month}</span>}
                  {list.location && (
                    <span className={`list-location ${list.location}`}>
                      {list.location === 'casa' ? '🏠 Casa' : '🏡 Jacira'}
                    </span>
                  )}
                </div>
                <div className="list-stats">
                  <span className="list-pending">{list.pending_items} pendentes</span>
                  <span className="list-total">{list.total_items} itens</span>
                </div>
                <span className="list-date">Criada em {formatDate(list.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShoppingLists
