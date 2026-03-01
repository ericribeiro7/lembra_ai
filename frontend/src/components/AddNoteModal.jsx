import { useState } from 'react'

function AddNoteModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim() && content.trim()) {
      onAdd({ title: title.trim(), content: content.trim() })
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nova Nota</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              placeholder="Digite o título..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Conteúdo</label>
            <textarea
              id="content"
              placeholder="Digite sua nota..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              💾 Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddNoteModal
