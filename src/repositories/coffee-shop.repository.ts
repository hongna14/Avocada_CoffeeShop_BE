import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {CoffeeShop, CoffeeShopRelations} from '../models';

export class CoffeeShopRepository extends DefaultCrudRepository<
  CoffeeShop,
  typeof CoffeeShop.prototype.coffee_shop_id,
  CoffeeShopRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(CoffeeShop, dataSource);
  }

  // async getCoffeeShop(filter: any) {
  //   return "a"
  // }
  //
}
