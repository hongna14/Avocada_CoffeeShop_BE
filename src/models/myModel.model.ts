import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}, name: 'coffee_shop'})
export class MyResponse extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  myField?: number;



  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<MyResponse>) {
    super(data);
  }
}

export interface CoffeeShopRelations {
  // describe navigational properties here
}

export type CoffeeShopWithRelations = MyResponse & CoffeeShopRelations;
