import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import api from './api';

export default function Dashboard({ darkMode, setDarkMode, sidebarCollapsed, setSidebarCollapsed }) {
  const [stats, setStats] = useState({
    totalArticles: 0,
    stocksFaibles: 0,
    totalFournisseurs: 0,
    mouvementsRecents: 0
  });
  const [stocksParCategorie, setStocksParCategorie] = useState([]);
  const [mouvementsHebdo, setMouvementsHebdo] = useState([]);
  const [alertesStock, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Récupérer les articles pour les stats
      const articlesRes = await api.get('/articles?per_page=1');
      const articlesTotal = articlesRes.data.meta?.total || 0;

      // Récupérer les fournisseurs
      const fournisseursRes = await api.get('/fournisseurs?per_page=1');
      const fournisseursTotal = fournisseursRes.data.meta?.total || 0;

      // Récupérer tous les articles pour calculer les stocks faibles
      const allArticlesRes = await api.get('/articles?per_page=10000');
      const allArticles = allArticlesRes.data.data || [];
      const stocksFaibles = allArticles.filter(a => a.quantite <= (a.seuil_min || 0)).length;

      // Récupérer les mouvements récents
      const mouvementsRes = await api.get('/mouvements?per_page=100');
      const mouvementsTotal = mouvementsRes.data.meta?.total || 0;
      const mouvementsData = mouvementsRes.data.data || [];

      // Calculer les stocks par catégorie
      const categoriesMap = {};
      allArticles.forEach(article => {
        const cat = article.categorie?.nom || 'Sans catégorie';
        if (!categoriesMap[cat]) {
          categoriesMap[cat] = 0;
        }
        categoriesMap[cat] += parseInt(article.quantite || 0);
      });

      const categoriesArray = Object.entries(categoriesMap).map(([nom, total]) => ({
        nom,
        total
      }));
      const maxStock = Math.max(...categoriesArray.map(c => c.total), 1);

      // Calculer les mouvements par jour de la semaine (7 derniers jours)
      const mouvementsParJour = {};
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        mouvementsParJour[dateStr] = 0;
      }

      mouvementsData.forEach(mouvement => {
        const dateStr = mouvement.created_at?.split('T')[0];
        if (mouvementsParJour.hasOwnProperty(dateStr)) {
          mouvementsParJour[dateStr] += 1;
        }
      });

      const mouvementsArray = Object.values(mouvementsParJour);
      const maxMouvements = Math.max(...mouvementsArray, 1);

      // Récupérer les alertes de stock
      const alertes = allArticles
        .filter(a => a.quantite <= (a.seuil_min || 0))
        .sort((a, b) => a.quantite - b.quantite)
        .slice(0, 5)
        .map(article => ({
          ...article,
          statut: article.quantite === 0 ? 'Critique' : article.quantite <= Math.ceil((article.seuil_min || 0) * 0.5) ? 'Critique' : 'Alerte'
        }));

      setStats({
        totalArticles: articlesTotal,
        stocksFaibles: stocksFaibles,
        totalFournisseurs: fournisseursTotal,
        mouvementsRecents: mouvementsTotal
      });

      setStocksParCategorie(categoriesArray.map(c => Math.round((c.total / maxStock) * 85)));
      setMouvementsHebdo(mouvementsArray.map(m => Math.max(Math.round((m / maxMouvements) * 85), 5)));
      setAlertes(alertes);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement du dashboard:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors ${darkMode ? 'bg-black text-white' : 'bg-white text-blue-900'}`}>
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
        <main className={`transition-all duration-300 p-8 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="text-center py-12">
            <p className="text-lg">Chargement du tableau de bord...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-black text-white' : 'bg-white text-blue-900'}`}>
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />

      {/* Main Content with left margin for sidebar */}
      <main className={`transition-all duration-300 p-8 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

        {/* Stats Cards */}
        <div className={`grid grid-cols-4 gap-6 mb-8`}>
          <div className={`rounded-xl p-6 border transition-colors ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
            <div className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total articles</div>
            <div className="text-4xl font-semibold text-blue-600">{stats.totalArticles}</div>
          </div>
          <div className={`rounded-xl p-6 border transition-colors ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
            <div className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stocks faibles</div>
            <div className="text-4xl font-semibold text-blue-600">{stats.stocksFaibles}</div>
          </div>
          <div className={`rounded-xl p-6 border transition-colors ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
            <div className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fournisseurs</div>
            <div className="text-4xl font-semibold text-blue-600">{stats.totalFournisseurs}</div>
          </div>
          <div className={`rounded-xl p-6 border transition-colors ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
            <div className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mouvements recents</div>
            <div className="text-4xl font-semibold text-blue-600">{stats.mouvementsRecents}</div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-2 gap-6">
          <div className={`rounded-xl p-6 border transition-colors ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
            <h3 className="text-lg font-semibold mb-4">Stocks par catégorie</h3>
            <div className="h-64 flex items-end justify-around gap-4">
              {stocksParCategorie.map((val, i) => (
                <div key={i} className="flex-1">
                  <div className={`w-full rounded-t transition-all hover:opacity-80 ${darkMode ? 'bg-blue-900' : 'bg-blue-300'}`} style={{ height: `${val}%` }}></div>
                </div>
              ))}
            </div>
          </div>
          <div className={`rounded-xl p-6 border transition-colors ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
            <h3 className="text-lg font-semibold mb-4">Mouvements Hebdomadaires</h3>
            <div className="h-64 flex items-end justify-around gap-4">
              {mouvementsHebdo.map((val, i) => (
                <div key={i} className="flex-1">
                  <div className={`w-full rounded-t transition-all hover:opacity-80 ${darkMode ? 'bg-blue-900' : 'bg-blue-300'}`} style={{ height: `${val}%` }}></div>
                </div>
              ))}
            </div>
          </div>

          <div className={`col-span-2 rounded-xl p-6 border transition-colors ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
            <h3 className="text-lg font-semibold mb-4">Alertes de Stock</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Article</th>
                    <th className="text-left py-3 px-4 font-semibold">Stock Actuel</th>
                    <th className="text-left py-3 px-4 font-semibold">Seuil Minimum</th>
                    <th className="text-left py-3 px-4 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {alertesStock.length > 0 ? (
                    alertesStock.map((alerte, idx) => (
                      <tr key={idx} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-100'}`}>
                        <td className="py-3 px-4">{alerte.designation}</td>
                        <td className="py-3 px-4">{alerte.quantite}</td>
                        <td className="py-3 px-4">{alerte.seuil_min || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                            alerte.statut === 'Critique' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}>
                            {alerte.statut}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className={darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}>
                      <td colSpan="4" className="py-3 px-4 text-center text-gray-500">
                        Aucune alerte - Tous les stocks sont normaux
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
