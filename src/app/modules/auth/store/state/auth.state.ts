import { Session } from "../models/session.model";


export type AuthState =
  | { status: 'anonymous' }
  | { status: 'authenticated'; session: Session };