import React from 'react';

export default function TripSearch({ searchParams, setSearchParams, onSearch }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleClear = () => {
    setSearchParams({ depart: '', arrivee: '', date: '' });
    // On force la recherche avec des paramètres vides
    setTimeout(() => {
      onSearch(true);
    }, 50);
  };

  return (
    <div style={{
      backgroundColor: '#f1f3f5',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #dee2e6'
    }}>
      <h3>Rechercher un trajet</h3>
      
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        marginTop: '15px',
        alignItems: 'flex-end'
      }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Départ</label>
          <input
            type="text"
            name="depart"
            value={searchParams.depart}
            onChange={handleChange}
            placeholder="Ex: Ottawa"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
          />
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Arrivée</label>
          <input
            type="text"
            name="arrivee"
            value={searchParams.arrivee}
            onChange={handleChange}
            placeholder="Ex: Montréal"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
          />
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Date</label>
          <input
            type="date"
            name="date"
            value={searchParams.date}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flex: '1 1 150px' }}>
          <button type="submit" style={{ flex: 1, padding: '9px' }}>Filtrer</button>
          <button type="button" onClick={handleClear} className="btn-secondary" style={{ flex: 1, padding: '9px', marginTop: 0 }}>Vider</button>
        </div>
      </form>
    </div>
  );
}
