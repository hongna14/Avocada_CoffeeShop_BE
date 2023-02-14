import {property} from '@loopback/repository';
import {Product} from '../models';

export class Statistic  {
  @property({
    type: 'number',

  })
  employeeAmount?: number;

  @property({
    type: 'number',
  })
  totalIncome?: number;

  @property({
    type: 'object',
  })
  bestProduct?: Product;

}


