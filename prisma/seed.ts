import { PrismaClient, User, $Enums, Connection, Job } from '@prisma/client'
import { faker } from '@faker-js/faker'

function createUser(): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    createdAt: faker.defaultRefDate(),
    status: $Enums.UserStatus.ENABLED,
    roles: [$Enums.UserRole.USER],
    refreshHash: null,
    jobDescription: null,
    profileImage: null,
  }
}

function createJob(): Job {
  return {
    mappingTaskName: 'Max _Test',
    jobTaskName: 'Max_Test 1',
    userId: '3497ab0e-f420-4c72-ab02-2f648e1f3a55',
    batchid: faker.string.uuid(),
    username: 'get User name from UI',
    etlexecStatus: 'QUEUED',
    status: 'ACTIVE',
    deleteFlag: false,
    startedAt: faker.date.past({ years: 2022 }),
    updatedAt: faker.date.past({ years: 2023 }),
    completedAt: null,
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
export const JOBS: Job[] = faker.helpers.multiple(createJob, {
  count: 50,
})

const prisma = new PrismaClient()

async function main() {
  // for (const job of JOBS) {
  //   await prisma.job.create({
  //     data: job,
  //   })
  // }

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
