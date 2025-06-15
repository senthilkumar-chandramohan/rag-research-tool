import { useState } from 'react'
import Button from './components/Button'
import UrlSubmissionModal from './components/UrlSubmissionModal'
import ChatInterface from './components/ChatInterface'
import './App.css'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-end">
          <Button onClick={() => setIsModalOpen(true)}>
            Add Reference
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <ChatInterface />
      </div>

      <UrlSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default App
