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
     
        setData(response.data); // usa a ordem que veio da API
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
      case 'INFO': return 'badge bg-info-subtle';
      case 'WARNING': return 'badge bg-warning-subtle';
      case 'ERROR': return 'badge bg-danger-subtle';
      case 'SUCCESS': return 'badge bg-success-subtle';
      default: return 'badge bg-secondary';
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h3 className="mb-4">Logs da API</h3>

          {/* Opcional: remover seleção de itens por página ou manter */}
          <div className="mb-4 d-flex justify-content-end align-items-center">
            <label className="form-label me-2">Itens por página:</label>
            <select
              className="form-select form-select-sm d-inline-block w-auto"
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

          <table className="table table-hover">
            <thead>
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
                  <td>{log.timestamp}</td>
                  <td><span className={getBadgeClass(log.type)}>{log.type}</span></td>
                  <td>{log.origin}</td>
                  <td>{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              className="btn btn-outline-primary"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="text-muted">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
