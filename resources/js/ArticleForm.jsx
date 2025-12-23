import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from './api';

export default function ArticleForm({ darkMode, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    designation: '',
    reference: '',
    quantite: '0',
    seuil_min: '10',
    categorie_id: '',
    fournisseur_id: '',
  });

  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchFournisseurs();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const response = await api.get('/fournisseurs');
      setFournisseurs(response.data.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des fournisseurs:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await api.post('/articles', {
        ...formData,
        quantite: formData.quantite ? parseInt(formData.quantite) : null,
        seuil_min: parseInt(formData.seuil_min),
        categorie_id: formData.categorie_id ? parseInt(formData.categorie_id) : null,
        fournisseur_id: formData.fournisseur_id ? parseInt(formData.fournisseur_id) : null,
      });

      // Show success message
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        onClose();
        onSuccess();
      }, 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.response?.data?.message || 'Erreur lors de la création' });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      designation: '',
      reference: '',
      quantite: '0',
      seuil_min: '10',
      categorie_id: '',
      fournisseur_id: '',
    });
    setErrors({});
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`rounded-lg shadow-xl w-full max-w-2xl mx-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          darkMode ? 'border-gray-800' : 'border-gray-300'
        }`}>
          <h2 className="text-2xl font-bold">Nouvel Article</h2>
          <button
            onClick={handleCloseModal}
            className={`p-2 rounded transition-colors ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="px-6 py-3 bg-green-500/10 border-b border-green-500/30">
            <p className="text-green-500 font-semibold">✓ Article créé avec succès !</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-500">
              {errors.general}
            </div>
          )}

          {/* Row 1: Designation & Reference */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Désignation *
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Ex: Écrou M10"
                className={`w-full px-4 py-2 rounded border transition-colors outline-none ${
                  errors.designation
                    ? darkMode
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-500 bg-red-50'
                    : darkMode
                    ? 'border-gray-700 bg-gray-800 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              />
              {errors.designation && (
                <p className="mt-1 text-sm text-red-500">{errors.designation[0]}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Référence
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Ex: ECR-M10-001"
                className={`w-full px-4 py-2 rounded border transition-colors outline-none ${
                  errors.reference
                    ? darkMode
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-500 bg-red-50'
                    : darkMode
                    ? 'border-gray-700 bg-gray-800 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              />
              {errors.reference && (
                <p className="mt-1 text-sm text-red-500">{errors.reference[0]}</p>
              )}
            </div>
          </div>

          {/* Row 2: Quantité & Seuil Min */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Quantité Initiale
              </label>
              <input
                type="number"
                name="quantite"
                value={formData.quantite}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className={`w-full px-4 py-2 rounded border transition-colors outline-none ${
                  errors.quantite
                    ? darkMode
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-500 bg-red-50'
                    : darkMode
                    ? 'border-gray-700 bg-gray-800 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              />
              {errors.quantite && (
                <p className="mt-1 text-sm text-red-500">{errors.quantite[0]}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Seuil Minimum *
              </label>
              <input
                type="number"
                name="seuil_min"
                value={formData.seuil_min}
                onChange={handleChange}
                min="0"
                placeholder="10"
                className={`w-full px-4 py-2 rounded border transition-colors outline-none ${
                  errors.seuil_min
                    ? darkMode
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-500 bg-red-50'
                    : darkMode
                    ? 'border-gray-700 bg-gray-800 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              />
              {errors.seuil_min && (
                <p className="mt-1 text-sm text-red-500">{errors.seuil_min[0]}</p>
              )}
            </div>
          </div>

          {/* Row 3: Catégorie & Fournisseur */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Catégorie
              </label>
              <select
                name="categorie_id"
                value={formData.categorie_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded border transition-colors outline-none ${
                  darkMode
                    ? 'border-gray-700 bg-gray-800 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Fournisseur
              </label>
              <select
                name="fournisseur_id"
                value={formData.fournisseur_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded border transition-colors outline-none ${
                  darkMode
                    ? 'border-gray-700 bg-gray-800 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="">Sélectionner un fournisseur</option>
                {fournisseurs.map(fourn => (
                  <option key={fourn.id} value={fourn.id}>
                    {fourn.raison_sociale}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t" style={{
            borderColor: darkMode ? '#1f2937' : '#d1d5db'
          }}>
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={loading}
              className={`px-6 py-2 rounded font-semibold transition-colors ${
                darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded font-semibold transition-colors ${
                darkMode
                  ? 'bg-blue-900 hover:bg-blue-800 text-white disabled:opacity-50'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
              }`}
            >
              {loading ? 'Création en cours...' : 'Créer l\'article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
