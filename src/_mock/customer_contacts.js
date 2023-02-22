import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

// fake customer contacts list... these would be our customer's contacts

const customerContacts = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarId: index + 1,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  active: faker.datatype.boolean(),
  title: faker.name.jobTitle(),
  department: faker.name.jobArea(),
  contacts: []
}));

export default customerContacts;
