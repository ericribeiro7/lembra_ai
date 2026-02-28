function NotesList({ notes, onDelete, onBack, searchTerm, setSearchTerm }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const colors = ['#dcfce7', '#fef3c7', '#dbeafe', '#fce7f3', '#e0e7ff', '#fed7d7']

  return (
    <div className="notes-list-page">
      <header className="page-header">
        <button className="back-btn" onClick={onBack}>‹</button>
        <h1 className="page-title">Bloco de Notas</h1>
        <button className="menu-btn">⋮</button>
      </header>

      <div className="notes-content">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Buscar notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {notes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📝</span>
            <p>Nenhuma nota ainda!</p>
            <p className="empty-subtitle">Toque no + para criar sua primeira nota</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note, index) => (
              <div 
                key={note.id} 
                className="note-card"
                style={{ backgroundColor: colors[index % colors.length] }}
              >
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  <button 
                    className="delete-btn"
                    onClick={() => onDelete(note.id)}
                    aria-label="Deletar nota"
                  >
                    🗑️
                  </button>
                </div>
                <p className="note-content">{note.content}</p>
                <span className="note-date">{formatDate(note.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotesList
