import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import Sidebar from './Sidebar';
import FournisseurForm from './FournisseurForm';
import api from './api';

export default function Fournisseurs({ darkMode, setDarkMode, sidebarCollapsed, setSidebarCollapsed }) {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchFournisseurs(currentPage);
  }, [currentPage, searchTerm, perPage]);

  const fetchFournisseurs = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('per_page', perPage);
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      // Fournisseurs API doesn't have search/per_page by default, so we fetch all
      const response = await api.get(`/fournisseurs?page=${page}&per_page=${perPage}`);
      const data = Array.isArray(response.data.data) ? response.data.data : response.data;
      
      // Filter locally if needed
      let filtered = data;
      if (searchTerm) {
        filtered = data.filter(fourn =>
          fourn.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (fourn.email && fourn.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (fourn.contact && fourn.contact.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      setFournisseurs(filtered);
      setCurrentPage(response.data.current_page || 1);
      setTotalPages(response.data.last_page || 1);

      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des fournisseurs:', err);
      setError('Impossible de charger les fournisseurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/fournisseurs/${id}`);
      fetchFournisseurs(currentPage);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Impossible de supprimer le fournisseur');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-black text-white' : 'bg-white text-blue-900'}`}>
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />

      {/* Main Content with left margin for sidebar */}
      <main className={`transition-all duration-300 p-8 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Gestion des Fournisseurs</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              darkMode ? 'bg-blue-900 hover:bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau Fournisseur</span>
          </button>
        </div>

        {/* Table Container */}
        <div className={`rounded-xl border overflow-hidden transition-colors ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'
        }`}>
          {/* Search and Per Page Controls - Inside Table */}
          <div className={`flex items-center justify-between gap-4 px-6 py-4 border-b ${
            darkMode ? 'border-gray-800' : 'border-gray-300'
          }`}>
            {/* Per Page Selector */}
            <div className="flex items-center gap-2">
              <label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Afficher
              </label>
              <select
                value={perPage}
                onChange={handlePerPageChange}
                className={`px-3 py-1 rounded border text-sm font-semibold transition-colors outline-none ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600'
                    : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                }`}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                éléments
              </span>
            </div>

            {/* Search Bar */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border flex-1 max-w-md ${
              darkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-300'
            }`}>
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={handleSearch}
                className={`flex-1 bg-transparent outline-none text-sm ${
                  darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-600'
                }`}
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-8 text-center text-gray-500">Chargement des fournisseurs...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : fournisseurs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Aucun fournisseur trouvé</div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`border-b ${darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-300 bg-white'}`}>
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold">Nom</th>
                      <th className="text-left py-4 px-6 font-semibold">Email</th>
                      <th className="text-left py-4 px-6 font-semibold">Contact</th>
                      <th className="text-left py-4 px-6 font-semibold">Adresse</th>
                      <th className="text-center py-4 px-6 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fournisseurs.map((fournisseur) => (
                      <tr
                        key={fournisseur.id}
                        className={`border-b transition-colors ${
                          darkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <td className="py-4 px-6 font-medium">{fournisseur.nom}</td>
                        <td className="py-4 px-6">
                          {fournisseur.email ? (
                            <a
                              href={`mailto:${fournisseur.email}`}
                              className={`flex items-center gap-1 hover:underline ${
                                darkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}
                            >
                              <Mail className="w-4 h-4" />
                              {fournisseur.email}
                            </a>
                          ) : (
                            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>-</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {fournisseur.contact ? (
                            <a
                              href={`tel:${fournisseur.contact}`}
                              className={`flex items-center gap-1 hover:underline ${
                                darkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}
                            >
                              <Phone className="w-4 h-4" />
                              {fournisseur.contact}
                            </a>
                          ) : (
                            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>-</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {fournisseur.adresse ? (
                            <div className={`flex items-start gap-1 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{fournisseur.adresse}</span>
                            </div>
                          ) : (
                            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>-</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button className={`p-2 rounded transition-colors ${
                              darkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-blue-100 text-blue-600'
                            }`}>
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(fournisseur.id)}
                              className={`p-2 rounded transition-colors ${
                                darkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-100 text-red-600'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className={`px-6 py-4 border-t flex items-center justify-between ${
                darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-300 bg-white'
              }`}>
                <div className="text-sm">
                  Affichage <span className="font-semibold">{(currentPage - 1) * perPage + 1}</span> à{' '}
                  <span className="font-semibold">{Math.min(currentPage * perPage, fournisseurs.length + (currentPage - 1) * perPage)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded transition-colors ${
                      currentPage === 1
                        ? darkMode ? 'text-gray-600' : 'text-gray-400'
                        : darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                          currentPage === page
                            ? darkMode ? 'bg-blue-900 text-white' : 'bg-blue-600 text-white'
                            : darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-900'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded transition-colors ${
                      currentPage === totalPages
                        ? darkMode ? 'text-gray-600' : 'text-gray-400'
                        : darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-sm">
                  Page <span className="font-semibold">{currentPage}</span> sur <span className="font-semibold">{totalPages}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-96 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-4">Confirmer la suppression</h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action ne peut pas être annulée.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className={`px-4 py-2 rounded transition-colors ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fournisseur Form Modal */}
      <FournisseurForm
        darkMode={darkMode}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => fetchFournisseurs(1)}
      />
    </div>
  );
}
