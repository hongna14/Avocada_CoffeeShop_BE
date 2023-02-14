import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {ProductType} from '../models';
import {ProductTypeRepository} from '../repositories';

export class ProductTypeController {
  constructor(
    @repository(ProductTypeRepository)
    public productTypeRepository : ProductTypeRepository,
  ) {}

  @post('/productType')
  @response(200, {
    description: 'ProductType model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductType, {
            title: 'NewProductType',
            exclude: ['id'],
          }),
        },
      },
    })
    productType: Omit<ProductType, 'id'>,
  ): Promise<ProductType> {
    return this.productTypeRepository.create(productType);
  }

  @get('/productType/count')
  @response(200, {
    description: 'ProductType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProductType) where?: Where<ProductType>,
  ): Promise<Count> {
    return this.productTypeRepository.count(where);
  }

  @get('/productType')
  @response(200, {
    description: 'Array of ProductType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProductType) filter?: Filter<ProductType>,
  ): Promise<ProductType[]> {
    return this.productTypeRepository.find(filter);
  }

  @patch('/productType')
  @response(200, {
    description: 'ProductType PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductType, {partial: true}),
        },
      },
    })
    productType: ProductType,
    @param.where(ProductType) where?: Where<ProductType>,
  ): Promise<Count> {
    return this.productTypeRepository.updateAll(productType, where);
  }

  @get('/productType/{id}')
  @response(200, {
    description: 'ProductType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProductType, {exclude: 'where'}) filter?: FilterExcludingWhere<ProductType>
  ): Promise<ProductType> {
    return this.productTypeRepository.findById(id, filter);
  }

  @patch('/productType/{id}')
  @response(204, {
    description: 'ProductType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductType, {partial: true}),
        },
      },
    })
    productType: ProductType,
  ): Promise<void> {
    await this.productTypeRepository.updateById(id, productType);
  }

  @put('/productType/{id}')
  @response(204, {
    description: 'ProductType PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() productType: ProductType,
  ): Promise<void> {
    await this.productTypeRepository.replaceById(id, productType);
  }

  @del('/productType/{id}')
  @response(204, {
    description: 'ProductType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productTypeRepository.deleteById(id);
  }
}
