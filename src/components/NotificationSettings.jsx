import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  requestNotificationPermission, 
  getNotificationPermission,
  isPushSupported 
} from '../services/oneSignalService';

export default function NotificationSettings() {
  const [permission, setPermission] = useState(getNotificationPermission());
  const [isSupported, setIsSupported] = useState(isPushSupported());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Re-check permission after component mounts and OneSignal might have loaded
    setTimeout(() => {
      setPermission(getNotificationPermission());
      setIsSupported(isPushSupported());
    }, 1000);
  }, []);

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const granted = await requestNotificationPermission();
      setPermission(granted);
      
      if (granted) {
        // Removendo o alert para uma experiência mais sofisticada
        // alert('Notificações ativadas com sucesso! Você receberá atualizações sobre seus investimentos.');
      } else {
        // alert('Permissão negada. Você pode ativar as notificações nas configurações do navegador.');
      }
    } catch (error) {
      console.error('Erro ao ativar notificações:', error);
      // alert('Erro ao ativar notificações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <X className="h-5 w-5" />
            Notificações não suportadas
          </CardTitle>
          <CardDescription className="text-red-600">
            Seu navegador não suporta notificações push. Tente usar Chrome, Firefox ou Edge.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // ----------------------------------------------------------------
  // ✅ CORREÇÃO: Não renderizar nada quando ATIVADO para não atrapalhar a leitura
  // ----------------------------------------------------------------
  if (permission === 'granted') {
    return null; // Retorna null para não renderizar nada
  }
  // ----------------------------------------------------------------
  
  // Estado NÃO ATIVADO (Requer Ação) - Mantém o Card grande para incentivar a ativação
  return (
    <Card className="transition-all bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellOff className="h-5 w-5 text-blue-600" />
          <span className="text-blue-700">Ative as Notificações</span>
        </CardTitle>
        <CardDescription className="text-blue-600">
          Receba alertas em tempo real sobre seus investimentos e lucros.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleEnableNotifications}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Ativando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Ativar Notificações
            </span>
          )}
        </Button>
        
        <div className="mt-4 p-3 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-700 font-medium mb-2">Você receberá notificações sobre:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Lucros em seus investimentos</li>
            <li>• Atualizações de saldo</li>
            <li>• Rendimentos mensais</li>
            <li>• Avisos importantes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
