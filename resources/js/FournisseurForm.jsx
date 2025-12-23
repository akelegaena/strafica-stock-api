import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from './api';

export default function FournisseurForm({ darkMode, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    contact: '',
    adresse: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

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
      await api.post('/fournisseurs', formData);

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
      nom: '',
      email: '',
      contact: '',
      adresse: '',
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
          <h2 className="text-2xl font-bold">Nouveau Fournisseur</h2>
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
            <p className="text-green-500 font-semibold">✓ Fournisseur créé avec succès !</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-500">
              {errors.general}
            </div>
          )}

          {/* Nom */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Nom *
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: Acme Corporation"
              className={`w-full px-4 py-2 rounded border transition-colors outline-none ${
                errors.nom
                  ? darkMode
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-red-500 bg-red-50'
                  : darkMode
                  ? 'border-gray-700 bg-gray-800 text-white'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            {errors.nom && (
              <p className="mt-1 text-sm text-red-500">{errors.nom[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@example.com"
              className={`w-full px-4 py-2 rounded border transition-colors outline-none ${
                errors.email
                  ? darkMode
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-red-500 bg-red-50'
                  : darkMode
                  ? 'border-gray-700 bg-gray-800 text-white'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Contact (Téléphone)
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="+33 1 23 45 67 89"
              className={`w-full px-4 py-2 rounded border transition-colors outline-none ${
                errors.contact
                  ? darkMode
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-red-500 bg-red-50'
                  : darkMode
                  ? 'border-gray-700 bg-gray-800 text-white'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            {errors.contact && (
              <p className="mt-1 text-sm text-red-500">{errors.contact[0]}</p>
            )}
          </div>

          {/* Adresse */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Adresse
            </label>
            <textarea
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="123 Rue de la Paix, 75000 Paris"
              rows="3"
              className={`w-full px-4 py-2 rounded border transition-colors outline-none resize-none ${
                errors.adresse
                  ? darkMode
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-red-500 bg-red-50'
                  : darkMode
                  ? 'border-gray-700 bg-gray-800 text-white'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            {errors.adresse && (
              <p className="mt-1 text-sm text-red-500">{errors.adresse[0]}</p>
            )}
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
              {loading ? 'Création en cours...' : 'Créer le fournisseur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
