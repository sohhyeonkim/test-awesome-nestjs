import { Controller, Delete, Param } from '@nestjs/common';

import { routesV1 } from '../../../../infrastructure/configs/app.routes';
import { DeleteUserCommand } from './delete-user.command';
import { DeleteUserService } from './delete-user.service';

@Controller(routesV1.version)
export class DeleteUserHttpController {
  constructor(private readonly service: DeleteUserService) {}

  @Delete(routesV1.user.delete)
  async deleteUser(@Param('id') id: string): Promise<void> {
    const command = new DeleteUserCommand({ userId: id });
    await this.service.execute(command);
  }
}
