// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  Request,
  requestBody,
  RestBindings,
} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import {Account} from '../models';

import {TokenService, UserService} from '@loopback/authentication';
import {
  Credentials,
  TokenServiceBindings,
  User,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject, intercept, Interceptor} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {securityId} from '@loopback/security';
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

const myInterceptor: Interceptor = async (invocationCtx, next) => {
  // console.log(JSON.stringify(invocationCtx));
  const request: any = await invocationCtx.get(RestBindings.Http.REQUEST);
  //const context: any = invocationCtx.getScopedContext(BindingScope.REQUEST);
  //console.log(context.request.rawHeaders);
  //const headers = context.headers;
  const headers = request.headers;

  console.log('teest', headers);
  const token = (headers['authorization'] as string).slice('Bearer '.length);
  try {
    const decode = jwt.verify(token, 'this-is-my-secret-key');

    console.log(decode);
    const context = await invocationCtx.bind('something').to(decode);
  } catch (e) {
    console.log(e);
  }
  // if success
  next();
  // if error
  throw new HttpErrors.NotFound();
};

export class AccountController {
  constructor(
    @repository(AccountRepository)
    public accountRepository: AccountRepository,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,

    @inject(RestBindings.Http.REQUEST) private request: Request,
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
    if (!account) return 'Account is not exist!';

    const isValid = await compare(payload.password, account.password);
    if (!isValid) return 'Wrong Password';

    // // convert a User object into a UserProfile object (reduced set of properties)
    // const userProfile = this.userService.convertToUserProfile(account);

    // create a JSON Web Token based on the user profile
    const jwtPayload = {
      ...account,
      [securityId]: account.user_id.toString(),
    };

    const token = await this.jwtService.generateToken(jwtPayload);
    return {token};
  }

  // ######## SIGN IN VERSION 2 ########

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
  async signinv2(
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
    if (!account) return 'Account is not exist!';

    const isValid = await compare(payload.password, account.password);
    if (!isValid) return 'Wrong Password';

    //GENERATE TOKEN
    const privateKey = 'this-is-my-secret-key';
    const token = jwt.sign(
      {
        id: account.user_id,
        email: account.email,
        role: account.role,
      },
      privateKey,
      {
        expiresIn: '1d',
      },
    );
    return {token};
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
  @intercept(myInterceptor)
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
  async whoAmI() {
    const something = this.request.get('something');
    console.log(something);
  }
}
