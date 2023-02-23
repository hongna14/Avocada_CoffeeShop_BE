import {model, property} from '@loopback/repository';

@model()
export class ChangePasswordInput {
  @property({
    type: 'string',
  })
  currrentPassword: string;

  @property({
    type: 'string',
  })
  newPassword: string;
}
