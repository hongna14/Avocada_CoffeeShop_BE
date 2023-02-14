import {Entity, hasMany, model, property} from '@loopback/repository';
import {Orders} from './orders.model';
@model({settings: {strict: true}})
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  product_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  product_name: string;
  @property({
    type: 'number',
    required: true,
  })
  product_price: number;

  @property({
    type: 'number',
    required: true,
  })
  product_type_id: number;

  @hasMany(() => Orders, {keyTo: 'product_id'})
  orders?: Orders[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
