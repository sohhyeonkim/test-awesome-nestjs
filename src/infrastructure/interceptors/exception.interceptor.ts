import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import {
  // To avoid confusion between internal app exceptions and NestJS exceptions
  ConflictException as NestConflictException,
  NotFoundException as NestNotFoundException,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import type { ExceptionBase } from '../../exceptions';
import { ConflictException, NotFoundException } from '../../exceptions';

export class ExceptionInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ExceptionBase> {
    return next.handle().pipe(
      catchError((err) => {
        /**
         * Custom exceptions are converted to nest.js exceptions.
         * This way we are not tied to a framework or HTTP protocol.
         */
        if (err instanceof NotFoundException) {
          throw new NestNotFoundException(err.message);
        }

        if (err instanceof ConflictException) {
          throw new NestConflictException(err.message);
        }

        return throwError(err);
      }),
    );
  }
}
