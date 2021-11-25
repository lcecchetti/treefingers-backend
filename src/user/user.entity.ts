import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RegisterInput } from 'src/auth/dto/register.input';

const validateEmail = (email: string): boolean => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
@Schema()
@ObjectType()
export class User extends RegisterInput {
  @Field(() => ID)
  id: string;

  @Prop({
    required: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    index: true,
  })
  @Field()
  email: string;

  @Prop({
    required: true,
    minlength: 10,
  })
  password: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
