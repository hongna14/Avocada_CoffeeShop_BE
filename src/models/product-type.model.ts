import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}, name: 'product_type'})
export class ProductType extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  product_type_id?: number;

  @property({
    type: 'string',
  })
  product_type_name?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ProductType>) {
    super(data);
  }
}

export interface ProductTypeRelations {
  // describe navigational properties here
}

export type ProductTypeWithRelations = ProductType & ProductTypeRelations;
