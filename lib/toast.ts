import { useToastStore, type ToastType } from './toast-store';

function show(
  type: ToastType,
  title: string,
  message?: string,
  options?: { link?: string; duration?: number },
) {
  useToastStore.getState().addToast({ type, title, message, ...options });
}

export const toast = {
  success: (title: string, message?: string) => show('success', title, message),
  error: (title: string, message?: string) => show('error', title, message),
  info: (title: string, message?: string) => show('info', title, message),
  notification: (title: string, message: string, link?: string) =>
    show('notification', title, message, { link }),
};
