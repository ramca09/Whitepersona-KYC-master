// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User } = initSchema(schema);

export {
  User
};