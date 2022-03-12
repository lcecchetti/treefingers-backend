import { ObjectType } from '@nestjs/graphql';
import { JoinPayload } from './join.payload';

@ObjectType()
export class LeavePayload extends JoinPayload {}
