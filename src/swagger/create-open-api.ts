import { INestApplication } from '@nestjs/common'
import {
  SwaggerModule,
  DocumentBuilder,
  OpenAPIObject,
  SwaggerDocumentOptions,
} from '@nestjs/swagger'

import { AuthModule } from '@app/modules/auth/auth.module'
import { UsersModule } from '@app/modules/users/users.module'
import { ConnectionsModule } from '@app/modules/connections/connections.module'
import { MonitorModule } from '@app/modules/monitor/monitor.module'

export function createOpenApi(app: INestApplication) {
  const authConfig = new DocumentBuilder()
    .setTitle('Auth')
    .setDescription('Authenficate user')
    .setVersion('1.0')
    .addTag('auth')
    .build()

  const usersConfig = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('users')
    .build()

  const connectorsConfig = new DocumentBuilder()
    .setTitle('Connections')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('connections', 'connectors')
    .addBearerAuth()
    .build()

  const monitorConfig = new DocumentBuilder()
    .setTitle('Monitor')
    .setDescription('Monitor api')
    .setVersion('1.0')
    .addTag('monitor, jobs, tasks')
    .build()

  new DocumentFactory(app).createDocs([
    {
      path: 'api/auth-docs',
      config: authConfig,
      module: [AuthModule],
    },
    {
      path: 'api/connections-docs',
      config: connectorsConfig,
      module: [ConnectionsModule],
    },
    {
      path: 'api/users-docs',
      config: usersConfig,
      module: [UsersModule],
    },
    {
      path: 'api/monitor-docs',
      config: monitorConfig,
      module: [MonitorModule],
    },
  ])
}

class DocumentFactory {
  constructor(private readonly app: INestApplication) {}

  async createDocs(
    docs: Array<{
      config: Omit<OpenAPIObject, 'paths'>
      module: SwaggerDocumentOptions['include']
      path: string
    }>,
  ) {
    docs.forEach(doc => {
      const document = SwaggerModule.createDocument(this.app, doc.config, {
        include: doc.module,
      })
      SwaggerModule.setup(doc.path, this.app, document)
    })
  }
}
