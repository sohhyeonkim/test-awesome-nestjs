import { ExceptionBase } from '../../../exceptions';

export class UserAlreadyExistsError extends ExceptionBase {
  static readonly message: 'User already exists';

  public readonly code = 'USER.ALREADY_EXISTS';

  constructor(metadata?: unknown) {
    super(UserAlreadyExistsError.message, metadata);
  }
}
