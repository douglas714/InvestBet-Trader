import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // 1. Capturar o evento beforeinstallprompt (para Chrome/Android)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstalled(false);
    };

    // 2. Detectar se o app já foi instalado
    const checkInstalled = () => {
      // Verifica se está sendo executado em modo standalone (PWA instalado)
      if (window.matchMedia('(display-mode: standalone)').matches || document.referrer.includes('android-app://')) {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    };

    // Adicionar listeners
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', checkInstalled);
    checkInstalled(); // Verifica no carregamento

    // Limpeza
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', checkInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Disparar o prompt de instalação (Chrome/Android)
      deferredPrompt.prompt();
      
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação do PWA');
          setIsInstalled(true);
        } else {
          console.log('Usuário recusou a instalação do PWA');
        }
        setDeferredPrompt(null);
      });
    } else {
      // Se o prompt não estiver disponível, mostra as instruções manuais (principalmente para iOS)
      setShowInstructions(true);
    }
  };

  // Não renderiza nada se já estiver instalado
  if (isInstalled) {
    return null;
  }

  // Renderiza o botão de instalação
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showInstructions && (
        <Card className="mb-2 w-72 shadow-xl border-purple-300">
          <CardContent className="p-3 text-sm">
            <p className="font-bold mb-1 flex items-center gap-1 text-purple-700">
              <Info className="h-4 w-4" />
              Instalação Manual (iOS/Safari)
            </p>
            <p>1. Clique no ícone de **Compartilhar** (<Smartphone className="h-3 w-3 inline" />) na barra do navegador.</p>
            <p>2. Selecione **"Adicionar à Tela de Início"**.</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowInstructions(false)} 
              className="mt-2 w-full text-xs text-purple-600 hover:bg-purple-50"
            >
              Entendi
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={handleInstallClick}
        className="flex items-center gap-2 p-2 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all"
        title="Instalar Aplicativo"
      >
        <Download className="h-5 w-5" />
        <span className="hidden sm:inline">Instalar App</span>
      </Button>
    </div>
  );
}
