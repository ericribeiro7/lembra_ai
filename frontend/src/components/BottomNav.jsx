function BottomNav({ activeView, setActiveView, hidden = false }) {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'INÍCIO' },
    { id: 'shopping', icon: '📋', label: 'LISTAS' },
    { id: 'notes', icon: '📄', label: 'NOTAS' },
    { id: 'settings', icon: '⚙️', label: 'AJUSTES' }
  ]

  return (
    <nav className={`bottom-nav ${hidden ? 'hidden' : ''}`}>
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-item ${activeView === item.id ? 'active' : ''}`}
          onClick={() => setActiveView(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
