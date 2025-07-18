import React from 'react';

function Header() {
  return (
    <>
      <nav className="navbar navbar-dark bg-dark fixed-top shadow px-4 py-2">
        <div className="container-fluid d-flex flex-column flex-md-row align-items-start align-items-md-center">
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <i className="bi bi-journal-bookmark-fill me-2 fs-4 text-white"></i>
            <span className="navbar-brand mb-0 h4">My Bookshelf</span>
          </div>
          <span className="text-white-50 ms-md-4">Logs de informação do sistema</span>
        </div>
      </nav>
      {/* Espaço para compensar o menu fixo */}
      <div style={{ height: '70px' }}></div>
    </>
  );
}

export default Header;
