const MODULE_IDENTIFIERS = {
  HealthController: Symbol.for('HealthController'),
  UserController: Symbol.for('UserController'),
  ProductController: Symbol.for('ProductController'),

  UserService: Symbol.for('UserService'),
  ProductService: Symbol.for('ProductService'),
  
  UserRepository: Symbol.for('UserRepository'),
  ProductRepository: Symbol.for('ProductRepository'),
};

export default MODULE_IDENTIFIERS;
