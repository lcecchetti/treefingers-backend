import { InputType } from '@nestjs/graphql';
import { FollowInput } from './follow.input';

@InputType()
export class UnfollowInput extends FollowInput {}
