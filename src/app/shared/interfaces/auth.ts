export interface OAuthResponse {
  token: Token,
  user: UserData
}

export interface Token {
  idToken: string,
  expiresIn: number
}

export interface UserData {
  name: string,
  uid: string,
  docID?: string
}

export interface AuthResponse {
  uid: string,
  token: Token,
}
