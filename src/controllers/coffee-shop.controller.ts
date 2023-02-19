import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {CoffeeShop, Product} from '../models';
import {
  CoffeeShopRepository,
  EmployeeRepository,
  OrdersRepository,
  ProductRepository,
} from '../repositories';
import {Statistic} from '../schemas/statistic.model';

export class CoffeeShopController {
  constructor(
    @repository(CoffeeShopRepository)
    public coffeeShopRepository: CoffeeShopRepository,

    @repository(ProductRepository)
    public productRepository: ProductRepository,

    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,

    @repository(OrdersRepository)
    public ordersRepository: OrdersRepository,
  ) {}

  @post('/coffeeShop')
  @response(200, {
    description: 'CoffeeShop model instance',
    content: {'application/json': {schema: getModelSchemaRef(CoffeeShop)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CoffeeShop, {
            title: 'NewCoffeeShop',
            exclude: ['id'],
          }),
        },
      },
    })
    coffeeShop: Omit<CoffeeShop, 'id'>,
  ): Promise<CoffeeShop> {
    return this.coffeeShopRepository.create(coffeeShop);
  }

  @get('/coffeeShop/count')
  @response(200, {
    description: 'CoffeeShop model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CoffeeShop) where?: Where<CoffeeShop>,
  ): Promise<Count> {
    return this.coffeeShopRepository.count(where);
  }

  @get('/coffeeShop')
  @response(200, {
    description: 'Array of CoffeeShop model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CoffeeShop, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CoffeeShop) filter?: Filter<CoffeeShop>,
  ): Promise<CoffeeShop[]> {
    return this.coffeeShopRepository.find(filter);
  }
  // API INFORMATION FOR BEST PRODUCT
  @get('/coffeeShop/{id}/statistic')
  @response(200, {
    description: 'CoffeeShop model instance',
    content: {'application/json': {schema: getModelSchemaRef(Statistic)}},
  })
  async statistic(@param.path.number('id') id: number) {
    const employees = await this.employeeRepository.find({
      where: {coffee_shop_id: id},
    });

    const orders = await this.ordersRepository.find({
      where: {coffee_shop_id: id},
      include: [{relation: 'product'}],
    });

    let totalIncome = 0;
    for (const order of orders) {
      totalIncome += order.order_quantity * order.product.product_price;
    }
    const result: Statistic = {
      employeeAmount: employees.length,
      totalIncome,
      bestProduct: new Product({}),
    };

    return result;
  }
  // END

  @patch('/coffeeShop')
  @response(200, {
    description: '',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CoffeeShop, {partial: true}),
        },
      },
    })
    coffeeShop: CoffeeShop,
    @param.where(CoffeeShop) where?: Where<CoffeeShop>,
  ): Promise<Count> {
    return this.coffeeShopRepository.updateAll(coffeeShop, where);
  }

  @get('/coffeeShop/{id}')
  @response(200, {
    description: 'CoffeeShop model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CoffeeShop, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CoffeeShop, {exclude: 'where'})
    filter?: FilterExcludingWhere<CoffeeShop>,
  ): Promise<CoffeeShop> {
    return this.coffeeShopRepository.findById(id, filter);
  }

  @patch('/coffeeShop/{id}')
  @response(204, {
    description: 'CoffeeShop PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CoffeeShop, {partial: true}),
        },
      },
    })
    coffeeShop: CoffeeShop,
  ): Promise<void> {
    await this.coffeeShopRepository.updateById(id, coffeeShop);
  }

  @put('/coffeeShop/{id}')
  @response(204, {
    description: 'CoffeeShop PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() coffeeShop: CoffeeShop,
  ): Promise<void> {
    await this.coffeeShopRepository.replaceById(id, coffeeShop);
  }

  @del('/coffeeShop/{id}')
  @response(204, {
    description: 'CoffeeShop DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.coffeeShopRepository.deleteById(id);
  }
}
