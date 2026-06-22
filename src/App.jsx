import { useState, useEffect } from 'react'

function App() {
  const [entries, setEntries] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [view, setView] = useState('write') // 'write' or 'archive'
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('dusk-entries')
    if (saved) setEntries(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('dusk-entries', JSON.stringify(entries))
  }, [entries])

  const saveEntry = () => {
    if (!title.trim() ||!content.trim()) {
      alert('Add both title and content')
      return
    }

    if (editingId) {
      // Update existing entry
      setEntries(entries.map(e =>
        e.id === editingId
         ? {...e, title, content, date: new Date().toISOString()}
          : e
      ))
      setEditingId(null)
    } else {
      // New entry
      const newEntry = {
        id: Date.now(),
        title,
        content,
        date: new Date().toISOString()
      }
      setEntries([newEntry,...entries])
    }

    setTitle('')
    setContent('')
    setView('archive')
  }

  const editEntry = (entry) => {
    setTitle(entry.title)
    setContent(entry.content)
    setEditingId(entry.id)
    setView('write')
  }

  const deleteEntry = (id) => {
    if (confirm('Delete this entry?')) {
      setEntries(entries.filter(e => e.id!== id))
      if (editingId === id) {
        setTitle('')
        setContent('')
        setEditingId(null)
      }
    }
  }

  const exportJSON = () => {
    const dataStr = JSON.stringify(entries, null, 2)
    const blob = new Blob([dataStr], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `dusk-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const cancelEdit = () => {
    setTitle('')
    setContent('')
    setEditingId(null)
    setView('archive')
  }

  return (
    <div style={{maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui'}}>
      <h1 style={{textAlign: 'center'}}>Dusk Journal</h1>

      <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
        <button onClick={() => {setView('write'); setEditingId(null); setTitle(''); setContent('')}}
          style={{flex: 1, padding: '10px', background: view==='write'? '#333' : '#eee', color: view==='write'? 'white' : 'black', border: 'none', borderRadius: '5px'}}>
          {editingId? 'Edit Entry' : 'New Entry'}
        </button>
        <button onClick={() => setView('archive')}
          style={{flex: 1, padding: '10px', background: view==='archive'? '#333' : '#eee', color: view==='archive'? 'white' : 'black', border: 'none', borderRadius: '5px'}}>
          Archive ({entries.length})
        </button>
      </div>

      {view === 'write'? (
        <div>
          <input
            placeholder="Entry title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px'}}
          />
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{width: '100%', height: '200px', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px'}}
          />
          <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
            <button onClick={saveEntry} style={{flex: 1, padding: '12px', background: '#333', color: 'white', border: 'none', borderRadius: '5px'}}>
              {editingId? 'Update Entry' : 'Save Entry'}
            </button>
            {editingId && (
              <button onClick={cancelEdit} style={{padding: '12px', background: '#999', color: 'white', border: 'none', borderRadius: '5px'}}>
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
            <h2>Archive</h2>
            {entries.length > 0 && (
              <button onClick={exportJSON} style={{padding: '8px 12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px'}}>
                Export JSON
              </button>
            )}
          </div>

          {entries.length === 0? (
            <p style={{textAlign: 'center', color: '#999', marginTop: '40px'}}>No entries yet. Write your first one!</p>
          ) : (
            entries.map(entry => (
              <div key={entry.id} style={{border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px', cursor: 'pointer'}} onClick={() => editEntry(entry)}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div style={{flex: 1}}>
                    <h3 style={{margin: '0 0 5px 0'}}>{entry.title}</h3>
                    <p style={{color: '#666', fontSize: '12px', margin: '0 0 10px 0'}}>
                      {new Date(entry.date).toLocaleString()}
                    </p>
                    <p style={{margin: 0, whiteSpace: 'pre-wrap'}}>{entry.content.substring(0, 100)}{entry.content.length > 100? '...' : ''}</p>
                  </div>
                  <button onClick={(e) => {e.stopPropagation(); deleteEntry(entry.id)}}
                    style={{marginLeft: '10px', padding: '5px 10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '3px'}}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default App
