// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 1. Create HTTP app (for Render health checks)
  const app = await NestFactory.create(AppModule);

  // 2. Validate env var early
  const amqpUrl = process.env.CLOUDAMQP_URL;
  if (!amqpUrl) {
    console.error(' CLOUDAMQP_URL is not set!');
    process.exit(1);
  }

  // 3. Attach RabbitMQ microservice listener
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [amqpUrl],
      queue: 'dashboard_queue',
      queueOptions: {
        durable: true, // queue survives broker restart
      },
      noAck: false, // require acknowledgment
      prefetchCount: 1, // process 5 message at a time
      isGlobalPrefetchCount: false,
    },
  });

  // 4. Start both
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3004, '0.0.0.0');

  console.log(`🚀 HTTP on ${process.env.PORT || 3004}`);
  console.log(`🐰 RabbitMQ microservice ready on queue: dashboard queue`);
}

bootstrap();
