import { ApplicationError } from '@/protocols';

export function noContentError(): ApplicationError {
  return {
    name: 'NoContentError',
    message: 'Nothing returned request',
  };
}
