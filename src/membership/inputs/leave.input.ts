import { InputType } from '@nestjs/graphql';
import { JoinInput } from './join.input';

@InputType()
export class LeaveInput extends JoinInput {}
