import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------
// eslint-disable-next-line
const ticketInteractions = [...Array(13)].map((_) => ({
    id: faker.datatype.uuid(),
    user: 'Guest User',
    details: faker.company.catchPhrase(),
    dateTime: faker.date.recent(20)
}))

// eslint-disable-next-line
const customerTickets = [...Array(24)].map((_) => ({
    id: faker.datatype.uuid(),
    creationDate: faker.date.past(3),
    createdBy: 'Guest User',
    ticketNotes: faker.company.catchPhrase(),
    isOpen: faker.datatype.boolean(),
    categoryId: sample(['1','2', '3']),
    priorityId: sample(['1','2', '3', '4']),
    interactions: ticketInteractions
}));




export default customerTickets;