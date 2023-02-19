import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Orders,
  Product,
} from '../models';
import {OrdersRepository} from '../repositories';

export class OrdersProductController {
  constructor(
    @repository(OrdersRepository)
    public ordersRepository: OrdersRepository,
  ) { }

  @get('/orders/{id}/product', {
    responses: {
      '200': {
        description: 'Product belonging to Orders',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async getProduct(
    @param.path.number('id') id: typeof Orders.prototype.order_id,
  ): Promise<Product> {
    return this.ordersRepository.product(id);
  }
}
