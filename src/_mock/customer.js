import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

// eslint-disable-next-line
const customers = [...Array(24)].map((_, index) => {

const customerName = faker.company.name();
const stateAbbr = faker.address.stateAbbr();


return (
  {
  id: faker.datatype.uuid(),
  avatarUrl: faker.image.business(128, 128, true),
  name: customerName,
  alias: `${customerName[0]} ${faker.company.companySuffix()}`,
  address1: faker.address.streetAddress(false),
  address2: faker.address.secondaryAddress(),
  city: faker.address.cityName(),
  state: stateAbbr,
  zip: faker.address.zipCodeByState(stateAbbr),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'inactive']),
  companyType: sample([
    'Manufacturer',
    'Co-Packer',
    'White-Label',
    'Retail',
    'Engineering'
  ]),
})});

export default customers;
