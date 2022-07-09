import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../pagination/dto/pagination.dto';
import { Notification } from '../notification.entity';

@ObjectType()
export class NotificationConnection extends Paginated(Notification) {}
