import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

// Componente para ser usado INLINE no dashboard
export default function PWAInstallLink() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // 1. Capturar o evento beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstalled(false);
    };

    // 2. Detectar se o app já foi instalado
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isAppInstalled = isStandalone || document.referrer.includes('android-app://');
      
      if (isAppInstalled) {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
      
      // Detectar iOS para mostrar instruções manuais
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
      const isIos = /iphone|ipad|ipod/.test(userAgent) && isSafari;
      setIsIOS(isIos);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', checkInstalled);
    checkInstalled();

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
      // Se o prompt não estiver disponível, mostra as instruções manuais (fallback universal)
      setShowInstructions(true);
    }
    // Se não for iOS e o prompt não estiver disponível, não faz nada (não renderiza)
  };

  // Não renderiza nada se já estiver instalado
  if (isInstalled) {
    return null;
  }



  // Renderiza o link discreto
  return (
    <div className="space-y-2">
      {/* Link/Botão de Instalação */}
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 text-xs text-purple-600 hover:text-purple-800 transition-colors duration-200 font-medium"
        title="Instalar Aplicativo na Tela Inicial"
      >
        <Download className="h-3 w-3" />
        Instalar App na Tela Inicial
      </button>

      {/* Instruções Manuais (Fallback) */}
      {showInstructions && (
        <Card className="shadow-md border-purple-300 bg-purple-50">
          <CardContent className="p-3 text-xs">
            <p className="font-bold mb-1 flex items-center gap-1 text-purple-700">
              <Info className="h-3 w-3" />
              Instalação Manual (iOS/Safari)
            </p>
            <p className="text-gray-600">1. Clique no ícone de **Compartilhar** (<Smartphone className="h-3 w-3 inline" />) na barra do navegador.</p>
            <p className="text-gray-600">2. Selecione **"Adicionar à Tela de Início"**.</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowInstructions(false)} 
              className="mt-2 w-full text-xs text-purple-600 hover:bg-purple-100 h-6"
            >
              Entendi
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
