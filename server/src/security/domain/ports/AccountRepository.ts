import type { AccountCredentials, AccountIdentity, NewAccount, SessionAccount } from '../models/Account';

export interface AccountRepository {
  findIdentityById(id: string): Promise<AccountIdentity | null>;
  findCredentialsByEmail(email: string): Promise<AccountCredentials | null>;
  create(account: NewAccount): Promise<SessionAccount>;
}
