// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import {get, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {Account} from '../models';

import {model, property, repository} from '@loopback/repository';
import {compare, genSalt, hash} from 'bcryptjs';
import {AccountRepository} from '../repositories';

@model()
class SignInPayload {
  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  password: string;
}

export class AccountController {
  constructor(
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
  ) {}
  // SIGN IN
  @post('/acount/signin', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async signin(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SignInPayload, {
            title: 'SignInPayload',
          }),
        },
      },
    })
    payload: SignInPayload,
  ) {
    const account = await this.accountRepository.findOne({
      where: {email: payload.email},
    });
    console.log(account);
    if (!account) return 'Account is not exist!';

    const isValid = await compare(payload.password, account.password);
    if (!isValid) return 'Wrong Password';

    // e cai nay bi ngu r :) bo di nha
  }

  //SIGN UP
  @post('/signup', {
    responses: {
      '200': {
        description: 'Account',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Account,
            },
            exclude: ['id'],
          },
        },
      },
    },
  })
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {
            title: 'NewAccount',
            exclude: ['id'],
          }),
        },
      },
    })
    account: Omit<Account, 'id'>,
  ): Promise<Omit<Account, 'password'>> {
    account.password = await hash(account.password, await genSalt());
    console.log(account);
    const result: Omit<Account, 'password'> =
      await this.accountRepository.create(account);
    delete result.password;
    return result;
  }

  //GET CURRENT USER
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current account',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI() {}
}
