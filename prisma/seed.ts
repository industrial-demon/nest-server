import { PrismaClient, User, Connection } from '@prisma/client'
import { faker } from '@faker-js/faker'

export enum STATUS {
  ACTIVATED = 'ACTIVATED',
  PENDING = 'PENDING',
}

export enum ROLE {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  OPERATOR = 'OPERATOR',
}

function createUser(): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    createdAt: faker.defaultRefDate(),
    status: faker.helpers.arrayElement(Object.values(STATUS)) as string,
    role: faker.helpers.arrayElement(Object.values(ROLE)) as User['role'],
    refreshHash: null,
  }
}

async function createUsers() {
  return faker.helpers.multiple(createUser, {
    count: 5,
  })
}

function createConnection(): Connection {
  const type = faker.helpers.arrayElement([
    'CSVFile',
    'MySQL',
    'Amazon_S3_v2',
    'Oracle',
    'FTP',
    'Salesforce',
    'MS_ACCESS',
    'WebServicesConsumer',
    'MSD',
    'SqlServer',
    'Snowflake_Cloud_Data_Warehouse_V2',
    'TOOLKIT_CCI',
  ])

  return {
    username: faker.internet.userName(),
    id: faker.string.uuid(),
    orgId: faker.string.alphanumeric({
      length: 6,
      casing: 'upper',
      exclude: ['A'],
    }),
    agentId: faker.string.alphanumeric({
      length: 20,
      casing: 'upper',
      exclude: ['A', 'B', 'C', 'X', 'V', 'Z'],
    }),

    runtimeEnvironmentId: faker.string.alphanumeric({
      length: 20,
      casing: 'upper',
      exclude: ['G', 'B', 'F', 'D', 'V', 'Z'],
    }),

    password: '********',
    description: faker.lorem.sentence({ min: 3, max: 5 }),
    shortDescription: faker.lorem.sentence({ min: 2, max: 2 }),
    name: `${faker.person.fullName()}-connection-MOCK`,

    type: type,
    instanceDisplayName: type,

    adjustedJdbcHostName: 'localhost',

    codepage: faker.helpers.arrayElement(['MS1252', 'UTF-8']),
    host: 'localhost',
    database: 'sqlite',
    port: faker.number.int({ min: 1000, max: 9999 }).toString(),
    createdBy: faker.internet.displayName(),
    updatedBy: faker.internet.displayName(),
    createTime: faker.date.past(),
    updateTime: faker.date.past(),
  }
}

export const CONNECTIONS: Connection[] = faker.helpers.multiple(
  createConnection,
  {
    count: 50,
  },
)

const prisma = new PrismaClient()

async function main() {
  for (const connection of CONNECTIONS) {
    await prisma.connection.create({
      data: connection,
    })
  }

  // const users = await createUsers()
  // for (const user of users) {
  //   await prisma.user.create({
  //     data: user,
  //   })
  // }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
