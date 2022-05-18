import { InputType } from '@nestjs/graphql';
import { LikeInput } from './like.input';

@InputType()
export class DislikeInput extends LikeInput {}
