import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

// eslint-disable-next-line
const customerTickets = [...Array(24)].map((_, index) => ({
    id: faker.datatype.uuid(),
    creationDate: faker.date.past(3),
    createdBy: 'Employee',
    ticketNotes: faker.company.catchPhrase,
}));
  

export default customerTickets;