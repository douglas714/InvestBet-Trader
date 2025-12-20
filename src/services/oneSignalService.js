// O SDK do OneSignal é carregado via script no index.html (OneSignalDeferred)

// Função para esperar o OneSignal estar pronto
const getOneSignal = () => {
  return new Promise((resolve) => {
    // ⚠️ CORREÇÃO DE TIMING: Apenas confia no OneSignalDeferred.push
    // para garantir que o objeto retornado esteja totalmente inicializado.
    // Removemos a verificação imediata de window.OneSignal para evitar 
    // retornar um objeto parcialmente inicializado.
    if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push((OneSignal) => {
        resolve(OneSignal);
      });
    } else {
      // Fallback, embora o OneSignalDeferred deva estar sempre presente
      // após o script ser carregado.
      setTimeout(() => {
        if (window.OneSignal) {
          resolve(window.OneSignal);
        } else {
          getOneSignal().then(resolve);
        }
      }, 100);
    }
  });
};

export const requestNotificationPermission = async () => {
  try {
    const OneSignal = await getOneSignal();
    
    // ⚠️ CORREÇÃO DE TIMING 2: Adicionar uma verificação de segurança
    // para garantir que o módulo PushSubscription esteja disponível.
    if (!OneSignal.User || !OneSignal.User.PushSubscription) {
        console.error("Erro de inicialização: OneSignal.User.PushSubscription não está disponível.");
        // Tentar esperar um pouco mais antes de falhar
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!OneSignal.User || !OneSignal.User.PushSubscription) {
            throw new Error("OneSignal PushSubscription não inicializado após espera.");
        }
    }
    
    console.log('Iniciando solicitação de permissão de notificação...');
    
    // Solicitar permissão de notificação
    const permission = await OneSignal.Notifications.requestPermission();
    
    console.log('Resultado da permissão:', permission);
    
    // Se a permissão foi concedida
    if (permission === true) {
      console.log('Permissão concedida! Registrando subscription...');
      
      // CORREÇÃO CRÍTICA: Fazer opt-in explícito da subscription
      try {
        // Fazer opt-in da push subscription
        await OneSignal.User.PushSubscription.optIn();
        console.log('✅ Opt-in da subscription realizado com sucesso!');
        
        // Aguardar um pouco para garantir que o OneSignal processou o opt-in
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar se há uma subscription ativa
        const subscription = OneSignal.User.pushSubscription;
        console.log('Subscription atual:', subscription);
        
        // Obter o ID da subscription
        if (subscription && subscription.id) {
          console.log('Subscription ID:', subscription.id);
          console.log('Subscription optedIn:', subscription.optedIn);
        }
        
        // Adicionar tag para marcar como notificações ativadas
        await OneSignal.User.addTags({
          notification_enabled: 'true',
          notification_activated_at: new Date().toISOString()
        });
        
        console.log('✅ Usuário registrado com sucesso como subscription ativa');
        return true;
      } catch (error) {
        console.error('Erro ao fazer opt-in da subscription:', error);
        return false;
      }
    } else {
      console.log('Permissão negada ou cancelada pelo usuário');
      return false;
    }
  } catch (error) {
    console.error('Erro ao solicitar permissão:', error);
    return false;
  }
};

export const setUserExternalId = async (userId) => {
  try {
    const OneSignal = await getOneSignal();
    
    console.log('Definindo External ID:', userId);
    
    // Fazer login com o ID do usuário
    await OneSignal.login(userId);
    console.log('External ID definido com sucesso:', userId);
    
    // Adicionar tag de tipo de usuário
    await OneSignal.User.addTags({
      user_type: 'investor'
    });
    
    console.log('Tags do usuário adicionadas');
  } catch (error) {
    console.error('Erro ao definir External ID:', error);
  }
};

export const addUserTags = async (tags) => {
  try {
    const OneSignal = await getOneSignal();
    await OneSignal.User.addTags(tags);
    console.log('Tags adicionadas:', tags);
  } catch (error) {
    console.error('Erro ao adicionar tags:', error);
  }
};

export const sendNotification = (title, message, data = {}) => {
  // Esta função seria chamada do backend, mas aqui está como exemplo
  console.log('Notificação a ser enviada:', { title, message, data });
};

export const getNotificationPermission = () => {
  // Esta função é síncrona e pode retornar 'default' se o SDK ainda não carregou
  if (window.OneSignal && window.OneSignal.Notifications) {
    const permission = window.OneSignal.Notifications.permission;
    return permission === true || permission === 'granted' ? 'granted' : 'default';
  }
  return 'default';
};

export const isPushSupported = () => {
  // Esta função é síncrona e pode retornar false se o SDK ainda não carregou
  if (window.OneSignal && window.OneSignal.Notifications) {
    try {
      return window.OneSignal.Notifications.isPushSupported();
    } catch (error) {
      console.error('Erro ao verificar suporte a push:', error);
      return false;
    }
  }
  return false;
};

// Função auxiliar para verificar status da subscription
export const getSubscriptionStatus = async () => {
  try {
    const OneSignal = await getOneSignal();
    const subscription = OneSignal.User.pushSubscription;
    
    if (subscription) {
      console.log('Status da subscription:', {
        id: subscription.id,
        optedIn: subscription.optedIn,
        token: subscription.token
      });
      return subscription;
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter status da subscription:', error);
    return null;
  }
};

// Nova função para verificar se o usuário já está subscrito
export const isUserSubscribed = async () => {
  try {
    const OneSignal = await getOneSignal();
    const optedIn = OneSignal.User.PushSubscription.optedIn;
    console.log('Usuário está subscrito?', optedIn);
    return optedIn;
  } catch (error) {
    console.error('Erro ao verificar se usuário está subscrito:', error);
    return false;
  }
};
