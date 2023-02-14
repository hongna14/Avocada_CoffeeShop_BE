import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true},name:'payment_type' })
export class PaymentType extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  payment_type_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  payment_type_description: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PaymentType>) {
    super(data);
  }
}

export interface PaymentTypeRelations {
  // describe navigational properties here
}

export type PaymentTypeWithRelations = PaymentType & PaymentTypeRelations;
