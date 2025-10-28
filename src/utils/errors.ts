import { GraphQLError } from 'graphql';

export class ValidationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'VALIDATION_ERROR',
      },
    });
  }
}

export class AuthenticationError extends GraphQLError {
  constructor(message: string = 'Not authenticated') {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
}

export class AuthorizationError extends GraphQLError {
  constructor(message: string = 'Not authorized') {
    super(message, {
      extensions: {
        code: 'UNAUTHORIZED',
      },
    });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(resource: string) {
    super(`${resource} not found`, {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
}