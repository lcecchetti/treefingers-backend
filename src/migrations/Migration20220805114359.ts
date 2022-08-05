import { Migration } from '@mikro-orm/migrations';

export class Migration20220805114359 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "is_banned" boolean not null default false, add column "last_login" timestamptz(0) null;');
    this.addSql('create index "user_is_banned_index" on "user" ("is_banned");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "user_is_banned_index";');
    this.addSql('alter table "user" drop column "is_banned";');
    this.addSql('alter table "user" drop column "last_login";');
  }

}
