import { faker } from '@faker-js/faker';

export const generateCredentials = () => ({
  email: faker.internet.email(),
  password: faker.internet.password({ length: 10, memorable: false, pattern: /[A-Za-z0-9@#$%]/ }),
});
