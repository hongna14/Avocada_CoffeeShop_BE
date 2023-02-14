import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {PaymentType, PaymentTypeRelations} from '../models';

export class PaymentTypeRepository extends DefaultCrudRepository<
  PaymentType,
  typeof PaymentType.prototype.payment_type_id,
  PaymentTypeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(PaymentType, dataSource);
  }
}

