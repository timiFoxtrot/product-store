import 'reflect-metadata';
import { Container } from 'inversify';
import MODULE_IDENTIFIERS from './identifiers';
import { ProductController } from '../../controllers/products.controller';
import { UserController } from '../../controllers/users.controller';
import { ProductRepository } from '../../repositories/products.repository';
import { UserRepository } from '../../repositories/users.repository';
import { ProductService } from '../../services/products.service';
import { UserService } from '../../services/users.service';
import { HealthController } from '../../health/health.controller';

const container = new Container();

// Bind services and repositories
container.bind<UserService>(MODULE_IDENTIFIERS.UserService).to(UserService).inSingletonScope();
container.bind<ProductService>(MODULE_IDENTIFIERS.ProductService).to(ProductService).inSingletonScope();
container.bind<UserRepository>(MODULE_IDENTIFIERS.UserRepository).to(UserRepository).inSingletonScope();
container.bind<ProductRepository>(MODULE_IDENTIFIERS.ProductRepository).to(ProductRepository).inSingletonScope();

// Bind controllers
container.bind<HealthController>(MODULE_IDENTIFIERS.HealthController).to(HealthController).inSingletonScope();
container.bind<UserController>(MODULE_IDENTIFIERS.UserController).to(UserController).inSingletonScope();
container.bind<ProductController>(MODULE_IDENTIFIERS.ProductController).to(ProductController).inSingletonScope();

export default container;

