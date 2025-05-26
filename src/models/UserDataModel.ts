export default interface UserDataModel {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}
