import axios from 'axios';
import { useState, useEffect } from 'react';
import './Info.css';

const username = process.env.REACT_APP_USER;
const password = process.env.REACT_APP_PW;
const url = process.env.REACT_APP_API_URL_PHP;
const auth = 'Basic ' + btoa(`${username}:${password}`);

const Info = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const getBadgeClass = (type) => {
    switch (type) {
      case 'INFO': return 'badge text-bg-info';
      case 'WARNING': return 'badge text-bg-warning';
      case 'ERROR': return 'badge text-bg-danger';
      case 'SUCCESS': return 'badge text-bg-success';
      default: return 'badge text-bg-secondary';
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm rounded-4 border-0">
        <div className="card-body p-4">
          <h5 className="card-title fw-semibold text-dark mb-4">Registros recentes</h5>

          <div className="mb-3 d-flex justify-content-end align-items-center">
            <label className="form-label me-2 mb-0">Itens por página:</label>
            <select
              className="form-select form-select-sm w-auto"
              value={itemsPerPage}
              onChange={e => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 50].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Origem</th>
                  <th>Mensagem</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((log, i) => (
                  <tr key={i}>
                    <td className="text-muted">{log.timestamp}</td>
                    <td><span className={getBadgeClass(log.type)}>{log.type}</span></td>
                    <td>{log.origin}</td>
                    <td>{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left me-1"></i> Anterior
            </button>
            <span className="text-muted small">
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
            </span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Próxima <i className="bi bi-chevron-right ms-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
