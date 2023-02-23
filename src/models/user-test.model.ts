import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}, name: 'users'})
export class UserTest extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  user_id: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserTest>) {
    super(data);
  }
}

export interface UserTestRelations {
  // describe navigational properties here
}

export type UserTestWithRelations = UserTest & UserTestRelations;
