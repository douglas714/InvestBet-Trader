// OneSignal SDK v16 - Carregado via script no index.html (OneSignalDeferred)
// O Service Worker usado é o /OneSignalSDKWorker.js (padrão do OneSignal)

/**
 * Aguarda o OneSignal estar completamente inicializado.
 */
const getOneSignal = () => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('OneSignal não inicializou em 10 segundos.'));
    }, 10000);

    if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push((OneSignal) => {
        clearTimeout(timeout);
        resolve(OneSignal);
      });
    } else {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.OneSignal) {
          clearInterval(interval);
          clearTimeout(timeout);
          resolve(window.OneSignal);
        } else if (attempts > 50) {
          clearInterval(interval);
          clearTimeout(timeout);
          reject(new Error('OneSignal não encontrado após 5 segundos.'));
        }
      }, 100);
    }
  });
};

/**
 * Solicita permissão de notificação e faz opt-in da subscription.
 */
export const requestNotificationPermission = async () => {
  try {
    const OneSignal = await getOneSignal();

    if (!OneSignal.User || !OneSignal.User.PushSubscription) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!OneSignal.User || !OneSignal.User.PushSubscription) {
        throw new Error('OneSignal PushSubscription não inicializado.');
      }
    }

    console.log('[OneSignal] Solicitando permissão de notificação...');
    const permission = await OneSignal.Notifications.requestPermission();
    console.log('[OneSignal] Resultado da permissão:', permission);

    if (permission === true) {
      console.log('[OneSignal] Permissão concedida! Realizando opt-in...');
      await OneSignal.User.PushSubscription.optIn();
      console.log('[OneSignal] ✅ Opt-in realizado com sucesso!');

      await new Promise(resolve => setTimeout(resolve, 1500));

      const sub = OneSignal.User.PushSubscription;
      console.log('[OneSignal] Subscription ID:', sub?.id);
      console.log('[OneSignal] OptedIn:', sub?.optedIn);

      await OneSignal.User.addTags({
        notification_enabled: 'true',
        notification_activated_at: new Date().toISOString()
      });

      console.log('[OneSignal] ✅ Usuário registrado com sucesso!');
      return true;
    } else {
      console.log('[OneSignal] Permissão negada ou cancelada pelo usuário.');
      return false;
    }
  } catch (error) {
    console.error('[OneSignal] Erro ao solicitar permissão:', error);
    return false;
  }
};

/**
 * Define o External ID do usuário no OneSignal (vincula ao ID do Supabase).
 */
export const setUserExternalId = async (userId) => {
  try {
    const OneSignal = await getOneSignal();
    console.log('[OneSignal] Definindo External ID:', userId);
    await OneSignal.login(userId);
    console.log('[OneSignal] ✅ External ID definido:', userId);
    await OneSignal.User.addTags({ user_type: 'investor' });
    console.log('[OneSignal] Tags do usuário adicionadas.');
  } catch (error) {
    console.error('[OneSignal] Erro ao definir External ID:', error);
  }
};

/**
 * Adiciona tags customizadas ao usuário no OneSignal.
 */
export const addUserTags = async (tags) => {
  try {
    const OneSignal = await getOneSignal();
    await OneSignal.User.addTags(tags);
    console.log('[OneSignal] Tags adicionadas:', tags);
  } catch (error) {
    console.error('[OneSignal] Erro ao adicionar tags:', error);
  }
};

/**
 * Verifica a permissão de notificação atual (síncrono).
 */
export const getNotificationPermission = () => {
  if (window.OneSignal && window.OneSignal.Notifications) {
    const permission = window.OneSignal.Notifications.permission;
    return permission === true ? 'granted' : 'default';
  }
  return Notification?.permission || 'default';
};

/**
 * Verifica se o navegador suporta push notifications (síncrono).
 */
export const isPushSupported = () => {
  if (window.OneSignal && window.OneSignal.Notifications) {
    try {
      return window.OneSignal.Notifications.isPushSupported();
    } catch (error) {
      console.error('[OneSignal] Erro ao verificar suporte a push:', error);
    }
  }
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
};

/**
 * Obtém o status completo da subscription do usuário.
 */
export const getSubscriptionStatus = async () => {
  try {
    const OneSignal = await getOneSignal();
    const subscription = OneSignal.User.PushSubscription;
    if (subscription) {
      const status = {
        id: subscription.id,
        optedIn: subscription.optedIn,
        token: subscription.token
      };
      console.log('[OneSignal] Status da subscription:', status);
      return status;
    }
    return null;
  } catch (error) {
    console.error('[OneSignal] Erro ao obter status da subscription:', error);
    return null;
  }
};

/**
 * Verifica se o usuário está atualmente inscrito para receber notificações.
 * Combina a permissão do navegador com o opt-in do OneSignal.
 */
export const isUserSubscribed = async () => {
  try {
    const OneSignal = await getOneSignal();
    const browserPermission = Notification?.permission;
    const optedIn = OneSignal.User?.PushSubscription?.optedIn;
    console.log('[OneSignal] browserPermission:', browserPermission, '| optedIn:', optedIn);
    return browserPermission === 'granted' && optedIn === true;
  } catch (error) {
    console.error('[OneSignal] Erro ao verificar subscription:', error);
    return false;
  }
};
