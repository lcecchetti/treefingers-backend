import { Migration } from '@mikro-orm/migrations';

export class Migration20220716172439 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "notification" ("id" serial primary key, "read" boolean not null default false, "link" varchar(255) null, "content" varchar(255) not null, "type" text check ("type" in (\'activate_account\', \'like_comment_forest\', \'like_comment_story\', \'like_story\', \'comment_forest\', \'comment_story\', \'join\', \'follow\', \'forest_continue\', \'story_continue\', \'chapter_continue\')) not null, "actor_id" int null, "source_id" int null, "target_id" int null, "user_id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('create index "notification_read_index" on "notification" ("read");');
    this.addSql('create index "notification_user_id_index" on "notification" ("user_id");');
    this.addSql('create index "notification_actor_id_type_target_id_read_index" on "notification" ("actor_id", "type", "target_id", "read");');

    this.addSql('alter table "notification" add constraint "notification_actor_id_foreign" foreign key ("actor_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "notification" add constraint "notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "notification" cascade;');
  }

}
