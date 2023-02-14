import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}, name: 'coffee_shop'})
export class CoffeeShop extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  coffee_shop_id?: number;

  @property({
    type: 'string',
    default: 'The Coffee House',
  })
  coffee_shop_name?: string;

  @property({
    type: 'string',
  })
  coffee_shop_address?: string;

  @property({
    type: 'string',
  })
  coffee_shop_phone_number?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<CoffeeShop>) {
    super(data);
  }
}

export interface CoffeeShopRelations {
  // describe navigational properties here
}

export type CoffeeShopWithRelations = CoffeeShop & CoffeeShopRelations;
