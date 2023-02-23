import {UserService} from '@loopback/authentication';
import {model, property, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {compare} from 'bcryptjs';
import {UserTest, UserTestRelations} from '../models';
import {UserTestRepository} from '../repositories';

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
export class MyUserService implements UserService<UserTest, SignInPayload> {
  constructor(
    @repository(UserTestRepository)
    public userTestRepository: UserTestRepository,
  ) {}
  async verifyCredentials(credentials: SignInPayload): Promise<UserTest> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userTestRepository.findOne({
      where: {email: credentials.email},
    });
    console.log('test rolee', foundUser?.role);
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    // const credentialsFound: any = await this.userTestRepository.findCredentials(
    //   foundUser.id,
    // );

    // if (!credentialsFound) {
    //   throw new HttpErrors.Unauthorized(invalidCredentialsError);
    // }

    const passwordMatched = await compare(
      credentials.password,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    return foundUser;
  }

  // const jwtPayload = {
  //   ...account,
  //   [securityId]: account.user_id.toString(),
  // };
  convertToUserProfile(user: UserTest) {
    return {
      ...user,
      [securityId]: user.user_id.toString(),
    };
  }

  //function to find user by id
  async findUserById(id: string): Promise<UserTest & UserTestRelations> {
    const userNotfound = 'invalid User';
    const foundUser = await this.userTestRepository.findOne({
      where: {id: id},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(userNotfound);
    }
    return foundUser;
  }
}
