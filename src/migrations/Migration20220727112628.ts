import { Migration } from '@mikro-orm/migrations';

export class Migration20220727112628 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop index "like_user_id_story_id_index";');
    this.addSql('drop index "like_user_id_comment_id_index";');
    this.addSql('alter table "like" drop constraint "like_user_id_story_id_comment_id_unique";');
    this.addSql('alter table "like" add constraint "like_user_id_story_id_unique" unique ("user_id", "story_id");');
    this.addSql('alter table "like" add constraint "like_user_id_comment_id_unique" unique ("user_id", "comment_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "like" drop constraint "like_user_id_story_id_unique";');
    this.addSql('alter table "like" drop constraint "like_user_id_comment_id_unique";');
    this.addSql('create index "like_user_id_story_id_index" on "like" ("user_id", "story_id");');
    this.addSql('create index "like_user_id_comment_id_index" on "like" ("user_id", "comment_id");');
    this.addSql('alter table "like" add constraint "like_user_id_story_id_comment_id_unique" unique ("user_id", "story_id", "comment_id");');
  }

}
