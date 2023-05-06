export interface User {
  id: string;
  name: string;
  picture?: string;
  preferences?: {
    color: string;
  };
}
