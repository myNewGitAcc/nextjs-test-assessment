import { ConnectionStatus } from '@/lib/chat';

type StatusLabels = {
  [key in ConnectionStatus]: string;
};

const STATUS_LABELS: StatusLabels = {
  connected: 'online',
  connecting: 'connecting…',
  disconnected: 'no connection',
};

export function statusLabel(status: ConnectionStatus) {
  return STATUS_LABELS[status];
}
