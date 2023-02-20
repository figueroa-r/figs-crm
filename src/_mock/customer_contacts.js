import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

// fake customer contacts list... these would be our customer's contacts

const customerContacts = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  activeFlag: faker.datatype.boolean(),
  title: faker.name.jobTitle(),
  department: faker.name.jobArea()
}));

export default customerContacts;
