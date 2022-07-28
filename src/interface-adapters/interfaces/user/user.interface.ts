import type { IModelBase } from '../../../libs/ddd/interface-adapters/interfaces/model.base.interface';

export interface IUser extends IModelBase {
  email: string;
  country: string;
  postalCode: string;
  street: string;
}
