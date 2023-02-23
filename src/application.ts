import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';

import {
  AuthorizationComponent,
  AuthorizationTags,
} from '@loopback/authorization';
import {DbDataSource} from './datasources';
import {myJWTService} from './services/jwt.service';
import {MyAuthorizationProvider} from './services/provider.service';
import {MyUserService} from './services/user.service';
export {ApplicationConfig};

export class CoffeeshopApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    // ------ ADD SNIPPET AT THE BOTTOM ---------
    // Mount authentication system
    this.component(AuthenticationComponent);

    this.component(AuthorizationComponent);
    //Bind customize provider
    this.bind('authorizationProviders.my-authorizer-provider')
      .toProvider(MyAuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);

    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService as any);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(myJWTService as any);

    // for jwt access token
    this.bind(TokenServiceBindings.TOKEN_SECRET).to('my-jwt-secret-key');
    // for jwt access token expiration
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to('86400');
    // ------------- END OF SNIPPET -------------

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
