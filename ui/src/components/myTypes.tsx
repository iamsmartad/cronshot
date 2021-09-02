export type WebSocketObject = {
  metadata: Metadata;
  spec: any;
  status: any;
};

type Metadata = {
  name: string;
  namespace: string;
  uid: string;
  creationTimestamp: string;
  annotations: Record<string, string>;
  labels: Record<string, string>;
};

export type AddScheduleProps = {
  name: string;
  namespace: string;
  crontab: string;
  pvc: string;
  snapshotclass: string;
  content: string;
  fromContent: boolean;
  retention: number;
};

export type DeleteScheduleProps = {
  name: string;
  namespace: string;
};
