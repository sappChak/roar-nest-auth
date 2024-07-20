import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  public constructor(private readonly configService: ConfigService) { }

  public getOptions(queueName: string, noAck: boolean = false): RmqOptions {
    console.log(this.configService.get<string>(`RABBIT_MQ_${queueName}_QUEUE`));
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_URI')],
        queue: this.configService.get<string>(`RABBIT_MQ_${queueName}_QUEUE`),
        queueOptions: {
          durable: true,
        },
        noAck,
        persistent: true,
      },
    };
  }

  public acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
