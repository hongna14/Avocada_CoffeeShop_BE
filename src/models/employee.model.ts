import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class Employee extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  employee_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  employee_position: string;

  @property({
    type: 'string',
    required: true,
  })
  employee_name: string;

  @property({
    type: 'string',
  })
  employee_phone_number?: string;

  @property({
    type: 'number',
  })
  coffee_shop_id?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Employee>) {
    super(data);
  }
}

export interface EmployeeRelations {
  // describe navigational properties here
}

export type EmployeeWithRelations = Employee & EmployeeRelations;
