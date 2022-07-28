export enum UserRoles {
  admin = 'admin',
  moderator = 'moderator',
  guest = 'guest',
}

export interface IUpdateUserAddressProps {
  country?: string;
  postalCode?: string;
  street?: string;
}
