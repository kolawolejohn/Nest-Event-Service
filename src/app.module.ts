import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Events } from './events/entity/events.entity';
import { EventsController } from './events/events.controller';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'example',
    database: 'nest-events',
    entities: [Events],
    synchronize: true
  }),
   TypeOrmModule.forFeature([Events])
],
  controllers: [AppController, EventsController],
  providers: [AppService],
})
export class AppModule {}
