import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Validate env var early
  const amqpUrl = process.env.CLOUDAMQP_URL;
  if (!amqpUrl) {
    console.error('❌ CLOUDAMQP_URL is not set!');
    process.exit(1);
  }

  // 2. Attach TCP microservice listener
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [amqpUrl],
      queue: 'admin_auth_queue',
      queueOptions: {
        durable: true, // queue survives broker restart
      },
      noAck: false, // require acknowledgment
      prefetchCount: 1, // process 1 message at a time
      isGlobalPrefetchCount: false,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [amqpUrl],
      queue: 'client_auth_queue',
      queueOptions: {
        durable: true, // queue survives broker restart
      },
      noAck: false, // require acknowledgment
      prefetchCount: 1, // process 1 message at a time
      isGlobalPrefetchCount: false,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 3. Start both
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3002, '0.0.0.0');

  console.log(`🚀 HTTP on ${process.env.PORT || 3002}`);
  console.log(`🐰 RabbitMQ microservice ready on queue: auth_queue`);
}
bootstrap();
