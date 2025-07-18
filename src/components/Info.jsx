import axios from 'axios';
import { useState, useEffect } from 'react';
import './Info.css';

const username = process.env.REACT_APP_USER;
const password = process.env.REACT_APP_PW;
const url = process.env.REACT_APP_API_URL;
const auth = 'Basic ' + btoa(`${username}:${password}`);

const Info = () => {

  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState('timestamp');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(url);
        const data = response.data
        const sorted = sortData(response.data);
        console.log(data)
        setData(sorted);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [sortBy]);

  // Atualizar sort quando itemsPerPage muda (se quiser ordenar após mudança também)
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, sortBy]);

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else {
        return a.type.localeCompare(b.type);
      }
    });
  };

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

          <div className="mb-4 d-flex justify-content-between align-items-center">
            <div>
              <label className="form-label me-2">Ordenar por:</label>
              <select
                className="form-select form-select-sm d-inline-block w-auto"
                value={sortBy}
                onChange={e => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="timestamp">Data</option>
                <option value="type">Tipo</option>
              </select>
            </div>

            <div>
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
