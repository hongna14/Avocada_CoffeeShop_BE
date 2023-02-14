import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class Customer extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  customer_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  customer_name: string;

  @property({
    type: 'string',
  })
  customer_address?: string;

  @property({
    type: 'string',
  })
  customer_phone?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
