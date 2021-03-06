import { Migration } from '@mikro-orm/migrations';

export class Migration20210209011616 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "tag" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "color" varchar(255) not null);');
    this.addSql('alter table "tag" add constraint "tag_uuid_unique" unique ("uuid");');
    this.addSql('alter table "tag" add constraint "tag_name_unique" unique ("name");');

    this.addSql('create table "preprint" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "handle" varchar(255) not null, "title" text not null, "authors" text null, "is_published" bool not null, "abstract_text" text null, "preprint_server" varchar(255) null, "date_posted" timestamptz(0) null, "license" varchar(255) null, "publication" varchar(255) null, "url" varchar(255) null, "content_encoding" varchar(255) null, "content_url" varchar(255) null);');
    this.addSql('alter table "preprint" add constraint "preprint_uuid_unique" unique ("uuid");');
    this.addSql('alter table "preprint" add constraint "preprint_handle_unique" unique ("handle");');

    this.addSql('create table "tag_preprints" ("tag_id" int4 not null, "preprint_id" int4 not null);');
    this.addSql('alter table "tag_preprints" add constraint "tag_preprints_pkey" primary key ("tag_id", "preprint_id");');

    this.addSql('create table "persona" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "identity_id" int4 null, "is_anonymous" bool not null, "is_locked" bool not null, "is_flagged" bool not null, "bio" text null, "avatar" bytea null, "avatar_encoding" varchar(255) null);');
    this.addSql('alter table "persona" add constraint "persona_uuid_unique" unique ("uuid");');
    this.addSql('alter table "persona" add constraint "persona_name_unique" unique ("name");');

    this.addSql('create table "rapid_review" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "author_id" int4 not null, "preprint_id" int4 not null, "is_published" bool not null, "is_flagged" bool not null, "yn_novel" text check ("yn_novel" in (\'yes\', \'no\', \'N/A\', \'unsure\')) not null, "yn_future" text check ("yn_future" in (\'yes\', \'no\', \'N/A\', \'unsure\')) not null, "yn_reproducibility" text check ("yn_reproducibility" in (\'yes\', \'no\', \'N/A\', \'unsure\')) not null, "yn_methods" text check ("yn_methods" in (\'yes\', \'no\', \'N/A\', \'unsure\')) not null, "yn_coherent" text check ("yn_coherent" in (\'yes\', \'no\', \'N/A\', \'unsure\')) not null, "yn_limitations" text check ("yn_limitations" in (\'yes\', \'no\', \'N/A\', \'unsure\')) not null, "yn_ethics" text check ("yn_ethics" in (\'yes\', \'no\', \'N/A\', \'unsure\')) not null, "yn_new_data" text check ("yn_new_data" in (\'yes\', \'no\', \'N/A\', \'unsure\')) not null, "yn_recommend" text check ("yn_recommend" in (\'yes\', \'no\', \'N/A\', \'unsure\')) not null, "yn_peer_review" text check ("yn_peer_review" in (\'yes\', \'no\', \'N/A\', \'unsure\')) not null, "yn_available_code" text check ("yn_available_code" in (\'yes\', \'no\', \'N/A\', \'unsure\')) not null, "yn_available_data" text check ("yn_available_data" in (\'yes\', \'no\', \'N/A\', \'unsure\')) not null, "link_to_data" text null, "coi" text null);');
    this.addSql('alter table "rapid_review" add constraint "rapid_review_uuid_unique" unique ("uuid");');

    this.addSql('create table "report" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "reason" text null, "title" text null, "author_id" int4 not null, "subject" varchar(255) not null, "subject_type" varchar(255) not null);');
    this.addSql('alter table "report" add constraint "report_uuid_unique" unique ("uuid");');

    this.addSql('create table "request" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "author_id" int4 not null, "preprint_id" int4 not null);');
    this.addSql('alter table "request" add constraint "request_uuid_unique" unique ("uuid");');

    this.addSql('create table "user" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "orcid" varchar(255) not null, "default_persona_id" int4 null, "is_private" bool not null);');
    this.addSql('alter table "user" add constraint "user_uuid_unique" unique ("uuid");');
    this.addSql('alter table "user" add constraint "user_orcid_unique" unique ("orcid");');
    this.addSql('alter table "user" add constraint "user_default_persona_id_unique" unique ("default_persona_id");');

    this.addSql('create table "work" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text null, "author_id" int4 not null, "url" text null, "type" varchar(255) null, "handle" varchar(255) null, "publication_date" timestamptz(0) null, "publisher" text null);');
    this.addSql('alter table "work" add constraint "work_uuid_unique" unique ("uuid");');

    this.addSql('create table "group" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');
    this.addSql('alter table "group" add constraint "group_uuid_unique" unique ("uuid");');
    this.addSql('alter table "group" add constraint "group_name_unique" unique ("name");');

    this.addSql('create table "group_members" ("group_id" int4 not null, "user_id" int4 not null);');
    this.addSql('alter table "group_members" add constraint "group_members_pkey" primary key ("group_id", "user_id");');

    this.addSql('create table "full_review" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "is_published" bool not null, "is_flagged" bool not null, "doi" varchar(255) null, "preprint_id" int4 not null);');
    this.addSql('alter table "full_review" add constraint "full_review_uuid_unique" unique ("uuid");');
    this.addSql('alter table "full_review" add constraint "full_review_doi_unique" unique ("doi");');

    this.addSql('create table "full_review_draft" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "parent_id" int4 not null, "contents" text not null);');
    this.addSql('alter table "full_review_draft" add constraint "full_review_draft_uuid_unique" unique ("uuid");');

    this.addSql('create table "statement" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "contents" text not null, "is_flagged" bool not null, "author_id" int4 not null, "parent_id" int4 not null);');
    this.addSql('alter table "statement" add constraint "statement_uuid_unique" unique ("uuid");');

    this.addSql('create table "full_review_mentor_invites" ("full_review_id" int4 not null, "persona_id" int4 not null);');
    this.addSql('alter table "full_review_mentor_invites" add constraint "full_review_mentor_invites_pkey" primary key ("full_review_id", "persona_id");');

    this.addSql('create table "full_review_mentors" ("full_review_id" int4 not null, "persona_id" int4 not null);');
    this.addSql('alter table "full_review_mentors" add constraint "full_review_mentors_pkey" primary key ("full_review_id", "persona_id");');

    this.addSql('create table "full_review_author_invites" ("full_review_id" int4 not null, "persona_id" int4 not null);');
    this.addSql('alter table "full_review_author_invites" add constraint "full_review_author_invites_pkey" primary key ("full_review_id", "persona_id");');

    this.addSql('create table "full_review_authors" ("full_review_id" int4 not null, "persona_id" int4 not null);');
    this.addSql('alter table "full_review_authors" add constraint "full_review_authors_pkey" primary key ("full_review_id", "persona_id");');

    this.addSql('create table "contact" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "schema" varchar(255) not null, "value" varchar(255) not null, "identity_id" int4 not null, "is_verified" bool not null, "is_notified" bool not null, "token" varchar(255) null);');
    this.addSql('alter table "contact" add constraint "contact_uuid_unique" unique ("uuid");');

    this.addSql('create table "community" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "slug" varchar(255) not null, "description" text null, "banner" bytea null, "logo" bytea null);');
    this.addSql('alter table "community" add constraint "community_uuid_unique" unique ("uuid");');
    this.addSql('alter table "community" add constraint "community_name_unique" unique ("name");');
    this.addSql('alter table "community" add constraint "community_slug_unique" unique ("slug");');

    this.addSql('create table "event" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "start" timestamptz(0) not null, "is_private" bool not null, "description" text null, "community_id" int4 null);');
    this.addSql('alter table "event" add constraint "event_uuid_unique" unique ("uuid");');

    this.addSql('create table "template" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "contents" text not null, "community_id" int4 null);');
    this.addSql('alter table "template" add constraint "template_uuid_unique" unique ("uuid");');
    this.addSql('alter table "template" add constraint "template_title_unique" unique ("title");');

    this.addSql('create table "community_members" ("community_id" int4 not null, "persona_id" int4 not null);');
    this.addSql('alter table "community_members" add constraint "community_members_pkey" primary key ("community_id", "persona_id");');

    this.addSql('create table "community_owners" ("community_id" int4 not null, "user_id" int4 not null);');
    this.addSql('alter table "community_owners" add constraint "community_owners_pkey" primary key ("community_id", "user_id");');

    this.addSql('create table "community_preprints" ("community_id" int4 not null, "preprint_id" int4 not null);');
    this.addSql('alter table "community_preprints" add constraint "community_preprints_pkey" primary key ("community_id", "preprint_id");');

    this.addSql('create table "community_tags" ("community_id" int4 not null, "tag_id" int4 not null);');
    this.addSql('alter table "community_tags" add constraint "community_tags_pkey" primary key ("community_id", "tag_id");');

    this.addSql('create table "comment" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "contents" text not null, "is_published" bool not null, "is_flagged" bool not null, "author_id" int4 not null, "parent_id" int4 not null);');
    this.addSql('alter table "comment" add constraint "comment_uuid_unique" unique ("uuid");');

    this.addSql('create table "badge" ("id" serial primary key, "uuid" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "color" varchar(255) not null);');
    this.addSql('alter table "badge" add constraint "badge_uuid_unique" unique ("uuid");');
    this.addSql('alter table "badge" add constraint "badge_name_unique" unique ("name");');

    this.addSql('create table "badge_personas" ("badge_id" int4 not null, "persona_id" int4 not null);');
    this.addSql('alter table "badge_personas" add constraint "badge_personas_pkey" primary key ("badge_id", "persona_id");');

    this.addSql('alter table "tag_preprints" add constraint "tag_preprints_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "tag_preprints" add constraint "tag_preprints_preprint_id_foreign" foreign key ("preprint_id") references "preprint" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "persona" add constraint "persona_identity_id_foreign" foreign key ("identity_id") references "user" ("id") on update cascade on delete set null;');

    this.addSql('alter table "rapid_review" add constraint "rapid_review_author_id_foreign" foreign key ("author_id") references "persona" ("id") on update cascade;');
    this.addSql('alter table "rapid_review" add constraint "rapid_review_preprint_id_foreign" foreign key ("preprint_id") references "preprint" ("id") on update cascade;');

    this.addSql('alter table "report" add constraint "report_author_id_foreign" foreign key ("author_id") references "persona" ("id") on update cascade;');

    this.addSql('alter table "request" add constraint "request_author_id_foreign" foreign key ("author_id") references "persona" ("id") on update cascade;');
    this.addSql('alter table "request" add constraint "request_preprint_id_foreign" foreign key ("preprint_id") references "preprint" ("id") on update cascade;');

    this.addSql('alter table "user" add constraint "user_default_persona_id_foreign" foreign key ("default_persona_id") references "persona" ("id") on update cascade on delete set null;');

    this.addSql('alter table "work" add constraint "work_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "group_members" add constraint "group_members_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "group_members" add constraint "group_members_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "full_review" add constraint "full_review_preprint_id_foreign" foreign key ("preprint_id") references "preprint" ("id") on update cascade;');

    this.addSql('alter table "full_review_draft" add constraint "full_review_draft_parent_id_foreign" foreign key ("parent_id") references "full_review" ("id") on update cascade;');

    this.addSql('alter table "statement" add constraint "statement_author_id_foreign" foreign key ("author_id") references "persona" ("id") on update cascade;');
    this.addSql('alter table "statement" add constraint "statement_parent_id_foreign" foreign key ("parent_id") references "full_review" ("id") on update cascade;');

    this.addSql('alter table "full_review_mentor_invites" add constraint "full_review_mentor_invites_full_review_id_foreign" foreign key ("full_review_id") references "full_review" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "full_review_mentor_invites" add constraint "full_review_mentor_invites_persona_id_foreign" foreign key ("persona_id") references "persona" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "full_review_mentors" add constraint "full_review_mentors_full_review_id_foreign" foreign key ("full_review_id") references "full_review" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "full_review_mentors" add constraint "full_review_mentors_persona_id_foreign" foreign key ("persona_id") references "persona" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "full_review_author_invites" add constraint "full_review_author_invites_full_review_id_foreign" foreign key ("full_review_id") references "full_review" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "full_review_author_invites" add constraint "full_review_author_invites_persona_id_foreign" foreign key ("persona_id") references "persona" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "full_review_authors" add constraint "full_review_authors_full_review_id_foreign" foreign key ("full_review_id") references "full_review" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "full_review_authors" add constraint "full_review_authors_persona_id_foreign" foreign key ("persona_id") references "persona" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "contact" add constraint "contact_identity_id_foreign" foreign key ("identity_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "event" add constraint "event_community_id_foreign" foreign key ("community_id") references "community" ("id") on update cascade on delete set null;');

    this.addSql('alter table "template" add constraint "template_community_id_foreign" foreign key ("community_id") references "community" ("id") on update cascade on delete set null;');

    this.addSql('alter table "community_members" add constraint "community_members_community_id_foreign" foreign key ("community_id") references "community" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "community_members" add constraint "community_members_persona_id_foreign" foreign key ("persona_id") references "persona" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "community_owners" add constraint "community_owners_community_id_foreign" foreign key ("community_id") references "community" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "community_owners" add constraint "community_owners_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "community_preprints" add constraint "community_preprints_community_id_foreign" foreign key ("community_id") references "community" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "community_preprints" add constraint "community_preprints_preprint_id_foreign" foreign key ("preprint_id") references "preprint" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "community_tags" add constraint "community_tags_community_id_foreign" foreign key ("community_id") references "community" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "community_tags" add constraint "community_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "persona" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_parent_id_foreign" foreign key ("parent_id") references "full_review" ("id") on update cascade;');

    this.addSql('alter table "badge_personas" add constraint "badge_personas_badge_id_foreign" foreign key ("badge_id") references "badge" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "badge_personas" add constraint "badge_personas_persona_id_foreign" foreign key ("persona_id") references "persona" ("id") on update cascade on delete cascade;');
  }

}
