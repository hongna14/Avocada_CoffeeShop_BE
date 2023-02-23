import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserTest, UserTestRelations} from '../models';

export class UserTestRepository extends DefaultCrudRepository<
  UserTest,
  typeof UserTest.prototype.user_id,
  UserTestRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(UserTest, dataSource);
  }
  // async findCredentials(userId: typeof UserTest.prototype.id) {
  //   console.log(UserTest);
  //   return UserTest[password];
  // }
}
