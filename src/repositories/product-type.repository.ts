import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {ProductType, ProductTypeRelations} from '../models';

export class ProductTypeRepository extends DefaultCrudRepository<
ProductType,
  typeof ProductType.prototype.product_type_id,
  ProductTypeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ProductType, dataSource);
  }


}
