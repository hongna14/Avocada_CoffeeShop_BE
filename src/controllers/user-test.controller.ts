// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {compare, genSalt, hash} from 'bcryptjs';
import {UserTestRepository} from '../repositories';
import {ChangePasswordInput} from '../schemas/changepassword.model';
import {basicAuthorization} from '../services/author.service';
import {myJWTService} from '../services/jwt.service';
import {MyUserService} from '../services/user.service';

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

export class UserTestController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: myJWTService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    //@repository(UserRepository) protected userRepository: UserRepository,
    @repository(UserTestRepository)
    protected userTestRepository: UserTestRepository,
  ) {}

  @post('/userstest/login', {
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
    credentials: SignInPayload,
  ) {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    //custome jwtservice
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['user'],
    scopes: ['update'],
    voters: [basicAuthorization],
  })
  @patch('/changePassword/{id}')
  @response(204, {
    description: 'User Test PATCH success',
  })
  async changePassword(
    @param.path.number('id') id: number,
    // @inject(SecurityBindings.USER)
    // currentUser: UserTest,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ChangePasswordInput, {partial: true}),
        },
      },
    })
    payload: ChangePasswordInput,
  ) {
    const user = await this.userTestRepository.findOne({
      where: {user_id: id},
    });
    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }
    const isValid = await compare(payload.currrentPassword, user.password);
    if (!isValid) {
      throw new HttpErrors.BadRequest('Wrong password');
    }
    const newHashedPassword = await hash(payload.newPassword, await genSalt());
    await this.userTestRepository.updateById(id, {
      password: newHashedPassword,
    });
  }
  @authenticate('jwt')
  @get('/whoAmITest', {
    responses: {
      '200': {
        description: 'Return current user',
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
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ) {
    console.log('CURRENT USER: ', currentUserProfile);
    return 'naaa';
  }
}
