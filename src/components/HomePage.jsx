function HomePage({ pendingItems, recentNotes, onOpenShopping, onOpenNotes }) {
  return (
    <div className="home-page">
      <div className="greeting">
        <h1>Olá! 👋</h1>
        <h2>O que vamos organizar hoje?</h2>
        <p className="greeting-subtitle">Simplifique sua rotina com um clique.</p>
      </div>

      <div className="home-cards">
        {/* Card Lista de Compras */}
        <div className="home-card shopping-card">
          <div className="card-icon-wrapper">
            <div className="card-icon">🛒</div>
          </div>
          <div className="card-info">
            <h3>Lista de Compras</h3>
            <p>Gerencie seus itens essenciais sem esquecer de nada.</p>
          </div>
          <div className="card-footer">
            <span className="card-count">{pendingItems} ITENS PENDENTES</span>
            <button className="card-btn" onClick={onOpenShopping}>
              Abrir Lista
            </button>
          </div>
        </div>

        {/* Card Bloco de Notas */}
        <div className="home-card notes-card">
          <div className="card-icon-wrapper">
            <div className="card-icon">📝</div>
          </div>
          <div className="card-info">
            <h3>Bloco de Notas</h3>
            <p>Anote suas ideias, insights e lembretes rapidamente.</p>
          </div>
          <div className="card-footer">
            <span className="card-count">{recentNotes} NOTAS RECENTES</span>
            <button className="card-btn" onClick={onOpenNotes}>
              Ver Notas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
