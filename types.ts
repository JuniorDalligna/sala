
export interface Meeting {
  id: string;
  subject: string;
  organizer: string;
  startTime: Date;
  endTime: Date;
  isPrivate: boolean;
}

export interface RoomInfo {
  id: string;
  name: string;
  email: string;
}

export interface AuthConfig {
  clientId: string;
  tenantId: string;
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED'
}

export const ROOMS: RoomInfo[] = [
  { id: 'AM', name: 'Sala Reunião Amazonas', email: 'SalaReuniaoAM@tremea.com.br' },
  { id: 'PA', name: 'Sala Reunião Pará', email: 'SalaReuniaoPA@tremea.com.br' },
  { id: 'RO', name: 'Sala Reunião Rondônia', email: 'SalaReuniaoRO@tremea.com.br' }
];
