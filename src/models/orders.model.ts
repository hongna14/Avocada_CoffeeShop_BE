import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Product} from './product.model';

@model({settings: {strict: true}})
export class Orders extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  order_id?: number;

  @property({
    type: 'date',
    required: true,
  })
  order_date: string;

  @property({
    type: 'number',
    required: true,
  })
  order_quantity: number;

  @property({
    type: 'number',
    required: true,
  })
  coffee_shop_id: number;

  @property({
    type: 'number',
    required: true,
  })
  customer_id: number;

  @property({
    type: 'number',
    required: true,
  })
  payment_type_id: number;

  @belongsTo(() => Product, {name: 'product'})
  product_id: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Orders>) {
    super(data);
  }
}

export interface OrdersRelations {
  // describe navigational properties here
}

export type OrdersWithRelations = Orders & OrdersRelations;
