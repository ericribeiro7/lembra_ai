import { useState } from 'react'

function AddListModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [month, setMonth] = useState('')

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onAdd({ name: name.trim(), month: month || null })
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Nova Lista</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </header>
        
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome da Lista</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Compras do Mês"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Mês (opcional)</label>
            <select 
              value={month} 
              onChange={(e) => setMonth(e.target.value)}
              className="month-select"
            >
              <option value="">Selecione um mês</option>
              {months.map((m, i) => (
                <option key={m} value={`${m} ${currentYear}`}>
                  {m} {currentYear}
                </option>
              ))}
            </select>
          </div>

          <div className="quick-options">
            <p className="quick-label">Atalhos rápidos:</p>
            <div className="quick-buttons">
              <button 
                type="button" 
                className="quick-btn"
                onClick={() => {
                  setName(`Compras ${months[currentMonth]}`)
                  setMonth(`${months[currentMonth]} ${currentYear}`)
                }}
              >
                📅 Mês Atual
              </button>
              <button 
                type="button" 
                className="quick-btn"
                onClick={() => {
                  const nextMonth = (currentMonth + 1) % 12
                  const year = nextMonth < currentMonth ? currentYear + 1 : currentYear
                  setName(`Compras ${months[nextMonth]}`)
                  setMonth(`${months[nextMonth]} ${year}`)
                }}
              >
                📆 Próximo Mês
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={!name.trim()}>
              Criar Lista
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddListModal
