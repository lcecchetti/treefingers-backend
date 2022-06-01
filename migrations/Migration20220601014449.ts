import { Migration } from '@mikro-orm/migrations';

export class Migration20220601014449 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null, "username" varchar(255) not null, "bio" text null, "is_active" boolean not null default false, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('create index "user_bio_index" on "user" ("bio");');
    this.addSql('create index "user_is_active_index" on "user" ("is_active");');

    this.addSql('create table "forest" ("id" serial primary key, "name" varchar(255) not null, "about" text not null, "founder_id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "forest" add constraint "forest_name_unique" unique ("name");');
    this.addSql('create index "forest_about_index" on "forest" ("about");');
    this.addSql('create index "forest_founder_id_index" on "forest" ("founder_id");');

    this.addSql('create table "membership" ("id" serial primary key, "forest_id" int not null, "member_id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('create index "membership_forest_id_index" on "membership" ("forest_id");');
    this.addSql('create index "membership_member_id_index" on "membership" ("member_id");');
    this.addSql('alter table "membership" add constraint "membership_member_id_forest_id_unique" unique ("member_id", "forest_id");');

    this.addSql('create table "story" ("id" serial primary key, "title" varchar(255) not null, "content" text not null, "author_id" int not null, "parent_id" int null, "root_id" int null, "path" text[] not null default \'{}\', "tags" text[] not null default \'{}\', "forest_id" int null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('create index "story_title_index" on "story" ("title");');
    this.addSql('create index "story_content_index" on "story" ("content");');
    this.addSql('create index "story_author_id_index" on "story" ("author_id");');
    this.addSql('create index "story_parent_id_index" on "story" ("parent_id");');
    this.addSql('create index "story_root_id_index" on "story" ("root_id");');
    this.addSql('create index "story_path_index" on "story" ("path");');
    this.addSql('create index "story_tags_index" on "story" ("tags");');
    this.addSql('create index "story_forest_id_index" on "story" ("forest_id");');

    this.addSql('create table "followership" ("id" serial primary key, "followed_id" int not null, "follower_id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('create index "followership_followed_id_index" on "followership" ("followed_id");');
    this.addSql('create index "followership_follower_id_index" on "followership" ("follower_id");');
    this.addSql('alter table "followership" add constraint "followership_followed_id_follower_id_unique" unique ("followed_id", "follower_id");');

    this.addSql('create table "comment" ("id" serial primary key, "content" text not null, "user_id" int not null, "story_id" int null, "forest_id" int null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, constraint comment_check check (story_id IS NOT NULL OR forest_id IS NOT NULL));');
    this.addSql('create index "comment_content_index" on "comment" ("content");');
    this.addSql('create index "comment_user_id_index" on "comment" ("user_id");');
    this.addSql('create index "comment_story_id_index" on "comment" ("story_id");');
    this.addSql('create index "comment_forest_id_index" on "comment" ("forest_id");');

    this.addSql('create table "like" ("id" serial primary key, "story_id" int null, "comment_id" int null, "user_id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, constraint like_check check (story_id IS NOT NULL OR comment_id IS NOT NULL));');
    this.addSql('create index "like_story_id_index" on "like" ("story_id");');
    this.addSql('create index "like_comment_id_index" on "like" ("comment_id");');
    this.addSql('create index "like_user_id_index" on "like" ("user_id");');
    this.addSql('create index "like_user_id_story_id_index" on "like" ("user_id", "story_id");');
    this.addSql('create index "like_user_id_comment_id_index" on "like" ("user_id", "comment_id");');
    this.addSql('alter table "like" add constraint "like_user_id_story_id_comment_id_unique" unique ("user_id", "story_id", "comment_id");');

    this.addSql('alter table "forest" add constraint "forest_founder_id_foreign" foreign key ("founder_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "membership" add constraint "membership_forest_id_foreign" foreign key ("forest_id") references "forest" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "membership" add constraint "membership_member_id_foreign" foreign key ("member_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "story" add constraint "story_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "story" add constraint "story_parent_id_foreign" foreign key ("parent_id") references "story" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "story" add constraint "story_root_id_foreign" foreign key ("root_id") references "story" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "story" add constraint "story_forest_id_foreign" foreign key ("forest_id") references "forest" ("id") on update cascade on delete set null;');

    this.addSql('alter table "followership" add constraint "followership_followed_id_foreign" foreign key ("followed_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "followership" add constraint "followership_follower_id_foreign" foreign key ("follower_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "comment" add constraint "comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_story_id_foreign" foreign key ("story_id") references "story" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "comment" add constraint "comment_forest_id_foreign" foreign key ("forest_id") references "forest" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "like" add constraint "like_story_id_foreign" foreign key ("story_id") references "story" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "like" add constraint "like_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "like" add constraint "like_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

}
