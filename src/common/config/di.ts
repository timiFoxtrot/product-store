import 'reflect-metadata';
import { Container } from 'inversify';
import MODULE_IDENTIFIERS from './identifiers';
import { ProductController } from '../../controllers/products.controller';
import { UserController } from '../../controllers/users.controller';
import { ProductRepository } from '../../repositories/products.repository';
import { UserRepository } from '../../repositories/users.repository';
import { ProductService } from '../../services/products.service';
import { UserService } from '../../services/users.service';

const container = new Container();

// Bind services and repositories
container.bind<UserService>(MODULE_IDENTIFIERS.UserService).to(UserService);
container.bind<ProductService>(MODULE_IDENTIFIERS.ProductService).to(ProductService);
container.bind<UserRepository>(MODULE_IDENTIFIERS.UserRepository).to(UserRepository);
container.bind<ProductRepository>(MODULE_IDENTIFIERS.ProductRepository).to(ProductRepository);

// Bind controllers
container.bind<UserController>(MODULE_IDENTIFIERS.UserController).to(UserController);
container.bind<ProductController>(MODULE_IDENTIFIERS.ProductController).to(ProductController);

export default container;

