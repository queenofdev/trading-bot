export interface ChatInterface {
  id: string;
  user: string;
  text: string;
  createdAt: Date;
}

export interface IJsonRpcError {
  readonly message: string;
  readonly code: number;
}
