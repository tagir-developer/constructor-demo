import { notification } from 'antd';

import { NOTIFICATION_DEFAULT_DURATION_IN_SECONDS } from './constants';
import { ElemTypes, NotificationTypes } from './interfaces';

const close = (): void => {
  // eslint-disable-next-line no-console
  console.log(
    'Notification was closed. Either the close button was clicked or duration time elapsed.',
  );
};

export const openNotification = (
  type: NotificationTypes,
  message: string,
  durationInSeconds?: number,
): void => {
  const key = `open${Date.now()}`;

  notification[type]({
    message: message,
    key,
    onClose: close,
    duration: durationInSeconds ?? NOTIFICATION_DEFAULT_DURATION_IN_SECONDS,
  });
};

export const parseInt = (value: unknown): number => {
  if (typeof value === 'number') return value;

  return Number.parseFloat(String(value));
};

// TODO: засунуть в один из сервисов как настроим изменение имени
export const getLayerNameByElemType = (elemType: ElemTypes): string => {
  switch (elemType) {
    case ElemTypes.GROUP:
      return 'Group';
    case ElemTypes.BLOCK:
      return 'Shape';
    case ElemTypes.TEXT:
      return 'Text';
    default:
      return 'Unknown elem';
  }
};
