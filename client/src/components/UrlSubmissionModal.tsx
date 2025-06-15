import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

interface UrlSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UrlSubmissionModal: React.FC<UrlSubmissionModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      setIsSubmitting(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to submit URL');
      }

      setUrl('');
      onClose();
    } catch {
      setError('Failed to submit URL. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Reference">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Enter the URL of the reference you'd like to add
          </label>
          <div className="mt-1">
            <input
              type="url"
              id="url"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-1">
              {error}
            </p>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button 
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Reference'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UrlSubmissionModal;