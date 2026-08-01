import { Migration } from '@mikro-orm/migrations';

export class Migration20260801120000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" add column "token_version" int not null default 0;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "token_version";');
  }
}
