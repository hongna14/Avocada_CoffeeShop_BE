import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Orders, Product, ProductRelations} from '../models';
import {OrdersRepository} from './orders.repository';
export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {
  public readonly orders: HasManyRepositoryFactory<
    Orders,
    typeof Product.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('OrdersRepository')
    ordersRepositoryGetter: Getter<OrdersRepository>,
  ) {
    super(Product, dataSource);
    this.orders = this.createHasManyRepositoryFactoryFor(
      'orders',
      ordersRepositoryGetter,
    );
    // add this line to register inclusion resolver.
    this.registerInclusionResolver('orders', this.orders.inclusionResolver);
  }
}
