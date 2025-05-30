export interface Team {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
}

export interface TeamWithUsers extends Team {
  users: { id: number; email: string }[]; // Assuming User has at least id and email
}

export interface TeamCreate {
  name: string;
  description?: string;
}

export interface TeamUpdate {
  name?: string;
  description?: string;
}
