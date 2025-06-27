import React, { useState, useEffect } from 'react';
import { Volume2, X, Zap } from 'lucide-react';
import VoiceAssistantManager from './VoiceAssistantManager';
import VoiceTaskCreator from './VoiceTaskCreator';
import VoiceTaskAcceptor from './VoiceTaskAcceptor';
import { Location } from '../lib/locationService';
import { elevenLabsService } from '../lib/elevenLabsService';

interface VoiceAssistantProps {
  onClose: () => void;
  userLocation?: Location | null;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose, userLocation }) => {
  const [mode, setMode] = useState<'main' | 'create' | 'accept'>('main');
  const [taskId, setTaskId] = useState<string | null>(null);

  useEffect(() => {
    // Welcome message
    elevenLabsService.speakText(
      "Welcome to Hustl Voice Assistant. I can help you create tasks, find tasks to complete, and more. What would you like to do today?"
    );
  }, []);

  const handleCreateTask = () => {
    setMode('create');
  };

  const handleBrowseTasks = () => {
    setMode('accept');
  };

  const handleOpenWallet = () => {
    window.dispatchEvent(new CustomEvent('open-wallet'));
    onClose();
  };

  const handleOpenProfile = () => {
    // Navigate to profile
    window.dispatchEvent(new CustomEvent('open-profile'));
    onClose();
  };

  const handleOpenHelp = () => {
    window.dispatchEvent(new CustomEvent('open-faq'));
    onClose();
  };

  const handleOpenSafety = () => {
    window.dispatchEvent(new CustomEvent('open-safety'));
    onClose();
  };

  const handleTaskCreated = (taskId: string) => {
    setTaskId(taskId);
    setMode('main');
    
    // Dispatch event to view the created task
    window.dispatchEvent(new CustomEvent('view-task', { 
      detail: { taskId } 
    }));
    
    // Close the voice assistant after a delay
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleTaskAccepted = (taskId: string) => {
    setTaskId(taskId);
    setMode('main');
    
    // Dispatch event to view the accepted task
    window.dispatchEvent(new CustomEvent('view-task', { 
      detail: { taskId } 
    }));
    
    // Close the voice assistant after a delay
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <>
      {mode === 'main' && (
        <VoiceAssistantManager 
          onClose={onClose}
          userLocation={userLocation}
          onCreateTask={handleCreateTask}
          onBrowseTasks={handleBrowseTasks}
          onOpenWallet={handleOpenWallet}
          onOpenProfile={handleOpenProfile}
          onOpenHelp={handleOpenHelp}
          onOpenSafety={handleOpenSafety}
        />
      )}
      
      {mode === 'create' && (
        <VoiceTaskCreator 
          onClose={() => setMode('main')}
          onTaskCreated={handleTaskCreated}
          userLocation={userLocation}
        />
      )}
      
      {mode === 'accept' && (
        <VoiceTaskAcceptor 
          onClose={() => setMode('main')}
          onTaskAccepted={handleTaskAccepted}
          userLocation={userLocation}
        />
      )}
    </>
  );
};

export default VoiceAssistant;