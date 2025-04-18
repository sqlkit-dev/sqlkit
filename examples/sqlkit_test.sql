-- -------------------------------------------------------------
-- TablePlus 6.4.4(604)
--
-- https://tableplus.com/
--
-- Database: tinyorm_test
-- Generation Time: 2025-04-18 7:42:20.4290 AM
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."post_tag_pivot";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."post_tag_pivot" (
    "post_id" uuid NOT NULL,
    "tag_id" uuid NOT NULL
);

DROP TABLE IF EXISTS "public"."posts";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."posts" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "title" varchar(255) NOT NULL,
    "content" text,
    "author_id" uuid NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."tags";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."tags" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "title" varchar(255) NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."users";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."users" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL,
    "age" int4,
    "bio" text,
    "created_at" timestamp DEFAULT '2025-04-18 07:40:55.500438'::timestamp without time zone,
    PRIMARY KEY ("id")
);

INSERT INTO "public"."post_tag_pivot" ("post_id", "tag_id") VALUES
('54672717-9094-4b40-be88-0bc821d8928f', '1237b47e-292a-49ed-8447-798811b282ea'),
('ff8ac44a-ecd9-4bf3-8cc7-3fc5f8ad12a2', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('ff8ac44a-ecd9-4bf3-8cc7-3fc5f8ad12a2', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('ff8ac44a-ecd9-4bf3-8cc7-3fc5f8ad12a2', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('ff8ac44a-ecd9-4bf3-8cc7-3fc5f8ad12a2', '1237b47e-292a-49ed-8447-798811b282ea'),
('aadaff08-e820-4ff5-b986-caa2d2a0d404', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('aadaff08-e820-4ff5-b986-caa2d2a0d404', '1237b47e-292a-49ed-8447-798811b282ea'),
('aadaff08-e820-4ff5-b986-caa2d2a0d404', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('aadaff08-e820-4ff5-b986-caa2d2a0d404', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('04ba1124-be3c-425a-b6f4-af193daaa124', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('04ba1124-be3c-425a-b6f4-af193daaa124', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('04ba1124-be3c-425a-b6f4-af193daaa124', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('04ba1124-be3c-425a-b6f4-af193daaa124', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('c36efcf9-ce79-471b-9764-b645c5a7e279', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('b03530cf-712c-4e1f-8844-b0a0a64ca2b8', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('b03530cf-712c-4e1f-8844-b0a0a64ca2b8', '1237b47e-292a-49ed-8447-798811b282ea'),
('b03530cf-712c-4e1f-8844-b0a0a64ca2b8', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('55c75fd6-9ca5-482b-aa3d-92ff1cef3cf7', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('55c75fd6-9ca5-482b-aa3d-92ff1cef3cf7', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('55c75fd6-9ca5-482b-aa3d-92ff1cef3cf7', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('55c75fd6-9ca5-482b-aa3d-92ff1cef3cf7', '1237b47e-292a-49ed-8447-798811b282ea'),
('e8ea01aa-4093-48a8-9b8e-9317bea51b29', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('e8ea01aa-4093-48a8-9b8e-9317bea51b29', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('3727e0db-4d44-4bd6-bedc-b5622b293508', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('3727e0db-4d44-4bd6-bedc-b5622b293508', '1237b47e-292a-49ed-8447-798811b282ea'),
('3727e0db-4d44-4bd6-bedc-b5622b293508', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('192faef0-374a-4d91-958b-0dd57ec581c2', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('192faef0-374a-4d91-958b-0dd57ec581c2', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('e0ee2b11-8a3d-48e3-9836-fb68c0f78331', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('b0ae3ec9-4030-4ea9-9707-654d537c37b0', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('b0ae3ec9-4030-4ea9-9707-654d537c37b0', '1237b47e-292a-49ed-8447-798811b282ea'),
('1f83baf8-93ef-45f1-a329-232030585f18', '1237b47e-292a-49ed-8447-798811b282ea'),
('1f83baf8-93ef-45f1-a329-232030585f18', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('1f83baf8-93ef-45f1-a329-232030585f18', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('410daaa5-ffd1-46fe-81f1-87e4ef492be2', '1237b47e-292a-49ed-8447-798811b282ea'),
('410daaa5-ffd1-46fe-81f1-87e4ef492be2', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('410daaa5-ffd1-46fe-81f1-87e4ef492be2', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('410daaa5-ffd1-46fe-81f1-87e4ef492be2', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('979927f4-9699-482e-8c84-8997b4b3f0a9', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('979927f4-9699-482e-8c84-8997b4b3f0a9', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('979927f4-9699-482e-8c84-8997b4b3f0a9', '1237b47e-292a-49ed-8447-798811b282ea'),
('979927f4-9699-482e-8c84-8997b4b3f0a9', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('979927f4-9699-482e-8c84-8997b4b3f0a9', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('1eb1e168-8760-43fb-aa6d-4383eb1ac6fc', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('1eb1e168-8760-43fb-aa6d-4383eb1ac6fc', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('bd0a8bc4-1590-45eb-9642-8d7ff620f3d0', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('bd0a8bc4-1590-45eb-9642-8d7ff620f3d0', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('c36a7517-49b1-46f4-bac5-03f95224336b', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('bb127a52-7d11-4731-853d-df5342bf7890', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('bb127a52-7d11-4731-853d-df5342bf7890', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('bb127a52-7d11-4731-853d-df5342bf7890', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('2f8583ae-136a-4714-a5bb-bc2071835efe', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('2f8583ae-136a-4714-a5bb-bc2071835efe', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('6806ab4b-e2b7-48e0-89fd-b229bd216509', '1237b47e-292a-49ed-8447-798811b282ea'),
('6806ab4b-e2b7-48e0-89fd-b229bd216509', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('42812c97-7185-4f79-81d0-eea07213c255', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('42812c97-7185-4f79-81d0-eea07213c255', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('42812c97-7185-4f79-81d0-eea07213c255', '1237b47e-292a-49ed-8447-798811b282ea'),
('42812c97-7185-4f79-81d0-eea07213c255', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('a9bcf7cc-a215-443a-a930-19e7c7849365', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('a9bcf7cc-a215-443a-a930-19e7c7849365', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('a9bcf7cc-a215-443a-a930-19e7c7849365', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('a9bcf7cc-a215-443a-a930-19e7c7849365', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('132c4160-04b2-4564-a40f-eed035b43a18', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('7184ffb4-7bd5-4c36-96b2-269994578f61', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('d10b0d20-6665-4d79-8108-3f046f4bc830', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('d10b0d20-6665-4d79-8108-3f046f4bc830', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('5a1f3be7-77af-4c0a-94dd-12a02c76a316', '1237b47e-292a-49ed-8447-798811b282ea'),
('109cd593-7e2f-4728-89fe-4bb22eb93b8e', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('c11562a0-3fcb-4da4-a879-580391b5fbf3', '1237b47e-292a-49ed-8447-798811b282ea'),
('c11562a0-3fcb-4da4-a879-580391b5fbf3', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('0d943b48-d58e-48d4-b16a-a72e2c77af98', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('0d943b48-d58e-48d4-b16a-a72e2c77af98', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('0d943b48-d58e-48d4-b16a-a72e2c77af98', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('0d943b48-d58e-48d4-b16a-a72e2c77af98', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('7fb0972f-ab68-45f9-8ebb-0d818fb75dd9', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('ed60b1b2-aedb-4732-909d-c97d718f48f6', '1237b47e-292a-49ed-8447-798811b282ea'),
('ed60b1b2-aedb-4732-909d-c97d718f48f6', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('b6fe9d5c-f4b5-45cf-a520-6f944441cd85', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('b6fe9d5c-f4b5-45cf-a520-6f944441cd85', '1237b47e-292a-49ed-8447-798811b282ea'),
('b6fe9d5c-f4b5-45cf-a520-6f944441cd85', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('6b12c82c-422b-4590-967a-9a95b033a6e2', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('6b12c82c-422b-4590-967a-9a95b033a6e2', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('6b12c82c-422b-4590-967a-9a95b033a6e2', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('fa23f9c2-5e21-429f-aa4f-613c2283b425', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('c96e802b-1971-429e-b2fd-6744f98e7dcd', '1237b47e-292a-49ed-8447-798811b282ea'),
('c96e802b-1971-429e-b2fd-6744f98e7dcd', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('c96e802b-1971-429e-b2fd-6744f98e7dcd', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('5ab68b3d-a065-4cf1-9e74-d59e6f4933e3', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('006fe23c-b4e1-4dfb-a637-f9768dd7c6b1', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('54672717-9094-4b40-be88-0bc821d8928f', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('1eb1e168-8760-43fb-aa6d-4383eb1ac6fc', '1237b47e-292a-49ed-8447-798811b282ea'),
('bb127a52-7d11-4731-853d-df5342bf7890', '1237b47e-292a-49ed-8447-798811b282ea'),
('63215876-8ed4-472b-83ec-3f5dcca3313d', '1237b47e-292a-49ed-8447-798811b282ea'),
('7184ffb4-7bd5-4c36-96b2-269994578f61', '1237b47e-292a-49ed-8447-798811b282ea'),
('c11562a0-3fcb-4da4-a879-580391b5fbf3', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('7fb0972f-ab68-45f9-8ebb-0d818fb75dd9', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('6b12c82c-422b-4590-967a-9a95b033a6e2', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('5ab68b3d-a065-4cf1-9e74-d59e6f4933e3', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('54672717-9094-4b40-be88-0bc821d8928f', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('bd0a8bc4-1590-45eb-9642-8d7ff620f3d0', '1237b47e-292a-49ed-8447-798811b282ea'),
('2f8583ae-136a-4714-a5bb-bc2071835efe', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('a9bcf7cc-a215-443a-a930-19e7c7849365', '1237b47e-292a-49ed-8447-798811b282ea'),
('5a1f3be7-77af-4c0a-94dd-12a02c76a316', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('ed60b1b2-aedb-4732-909d-c97d718f48f6', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('6b12c82c-422b-4590-967a-9a95b033a6e2', '1237b47e-292a-49ed-8447-798811b282ea'),
('54672717-9094-4b40-be88-0bc821d8928f', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('bd0a8bc4-1590-45eb-9642-8d7ff620f3d0', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('2f8583ae-136a-4714-a5bb-bc2071835efe', '1237b47e-292a-49ed-8447-798811b282ea'),
('63215876-8ed4-472b-83ec-3f5dcca3313d', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('7184ffb4-7bd5-4c36-96b2-269994578f61', '08f05a50-ae19-4e10-a603-cd8bf3e09abe'),
('c11562a0-3fcb-4da4-a879-580391b5fbf3', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('7fb0972f-ab68-45f9-8ebb-0d818fb75dd9', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('b6fe9d5c-f4b5-45cf-a520-6f944441cd85', '91027d18-2e0e-46c5-ad47-a29771348fea'),
('c96e802b-1971-429e-b2fd-6744f98e7dcd', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('54672717-9094-4b40-be88-0bc821d8928f', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('1eb1e168-8760-43fb-aa6d-4383eb1ac6fc', '2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e'),
('bb127a52-7d11-4731-853d-df5342bf7890', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('42812c97-7185-4f79-81d0-eea07213c255', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('7184ffb4-7bd5-4c36-96b2-269994578f61', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('0d943b48-d58e-48d4-b16a-a72e2c77af98', '1237b47e-292a-49ed-8447-798811b282ea'),
('b6fe9d5c-f4b5-45cf-a520-6f944441cd85', '74b1d59e-05a4-4836-beb7-f33c1df53c5e'),
('c96e802b-1971-429e-b2fd-6744f98e7dcd', '08f05a50-ae19-4e10-a603-cd8bf3e09abe');

INSERT INTO "public"."posts" ("id", "title", "content", "author_id") VALUES
('006fe23c-b4e1-4dfb-a637-f9768dd7c6b1', 'sursum stips dignissimos', 'Vesica cumque tergo apparatus ut unus derideo volaticus candidus adeo. Abscido corroboro validus virtus auxilium qui pecto color dignissimos. Degenero apud virgo viscus cubicularis vinculum volutabrum teneo sulum custodia.', 'e549f6d1-02fd-4119-ac5f-747c6d35aa7a'),
('04ba1124-be3c-425a-b6f4-af193daaa124', 'vorago aequitas tollo', 'Vos conatus aer tutamen summa iusto caelum. Tergo defleo attero dolor clibanus uredo cibo. Valeo carbo curis tersus currus id vomica.', '97ddd8d3-ad40-4a76-80b9-07d3c0a016aa'),
('0d943b48-d58e-48d4-b16a-a72e2c77af98', 'vilitas nostrum una', 'Accusator admoneo depraedor suadeo villa supellex aequitas. Corrigo beneficium dapifer cibus odit statim dolore spero. Tenax varietas desino earum.', 'e549f6d1-02fd-4119-ac5f-747c6d35aa7a'),
('109cd593-7e2f-4728-89fe-4bb22eb93b8e', 'fugit tardus aegre', 'Cometes hic tollo tepesco asperiores admitto adstringo careo laborum depromo. Peccatus ciminatio bene arbitro conduco beatae absum crustulum video. Vetus utpote adflicto desparatus vilicus nihil vilis tibi theca.', 'e549f6d1-02fd-4119-ac5f-747c6d35aa7a'),
('132c4160-04b2-4564-a40f-eed035b43a18', 'tolero vallum balbus', 'Vester demens aiunt sustineo dolorem suspendo vobis adulatio. Beneficium patrocinor quis solutio bos praesentium apostolus timidus. Ater sperno colo deporto custodia vulgaris aegrus celebrer ubi comparo.', '2efe2289-d3aa-4db9-9fa4-b296c3f45d1d'),
('192faef0-374a-4d91-958b-0dd57ec581c2', 'infit degero audio', 'Utique pauper dolores atque. Texo alveus cribro teres. Ager verecundia tempus adsidue corrupti demum.', 'a564e036-31d3-44e4-a334-e25cc0b1d3bf'),
('1eb1e168-8760-43fb-aa6d-4383eb1ac6fc', 'casus voluntarius utor', 'Utroque complectus in victus. Cupiditate sui defungo bardus vehemens. Angulus abstergo accusamus cognatus.', '04965477-a03a-4fa6-9074-60bc3078a0a4'),
('1f83baf8-93ef-45f1-a329-232030585f18', 'vos bellicus aegrotatio', 'Caelum tollo delectatio admoneo viduo terminatio auctus. Rerum placeat textus vereor comburo adeo. Ratione rem culpa cras aer asperiores reprehenderit combibo stultus.', '04965477-a03a-4fa6-9074-60bc3078a0a4'),
('2f8583ae-136a-4714-a5bb-bc2071835efe', 'vilis speculum cum', 'Compello libero complectus spero magnam antepono talio cito tredecim valens. Tepidus vito dignissimos testimonium aedificium comminor. Coma cunctatio aggero claudeo vinum tripudio tendo amplitudo clamo illum.', '04965477-a03a-4fa6-9074-60bc3078a0a4'),
('3727e0db-4d44-4bd6-bedc-b5622b293508', 'appositus debeo virtus', 'Addo blandior contabesco abscido atqui cilicium. Subnecto sponte debitis tepesco. Tot defluo adinventitias aegrotatio deputo audax cornu colligo.', 'a564e036-31d3-44e4-a334-e25cc0b1d3bf'),
('410daaa5-ffd1-46fe-81f1-87e4ef492be2', 'soluta cilicium deprecator', 'Tutamen auxilium cursim. Suus temporibus venio sufficio aperio velociter. Annus aurum vespillo urbanus tremo uter crudelis rerum comminor.', '04965477-a03a-4fa6-9074-60bc3078a0a4'),
('42812c97-7185-4f79-81d0-eea07213c255', 'vetus ambitus accusamus', 'Degusto inventore accusator deinde ascisco defluo. Terror aeger vesper somnus hic cervus ipsam optio. Colo consequuntur deleo.', '2efe2289-d3aa-4db9-9fa4-b296c3f45d1d'),
('54672717-9094-4b40-be88-0bc821d8928f', 'optio cena amicitia', 'Ascisco tantum stips. Creber sono tersus ara delectus quia. Solvo fugit aut accedo blandior sublime.', '97ddd8d3-ad40-4a76-80b9-07d3c0a016aa'),
('55c75fd6-9ca5-482b-aa3d-92ff1cef3cf7', 'sapiente coma conitor', 'Aufero sophismata universe aveho advenio. Demo testimonium color libero illum terra cura antiquus. Vespillo accusamus crur praesentium.', 'a564e036-31d3-44e4-a334-e25cc0b1d3bf'),
('5a1f3be7-77af-4c0a-94dd-12a02c76a316', 'in umbra soluta', 'Certus doloribus corpus eius amplus fugiat colligo beatus. Ver paulatim alo quod verecundia assumenda comminor defungo. Abundans claudeo utrimque illo vester nam.', '2efe2289-d3aa-4db9-9fa4-b296c3f45d1d'),
('5ab68b3d-a065-4cf1-9e74-d59e6f4933e3', 'curis super thalassinus', 'Vorago id umbra coma. Venustas angelus abduco defendo beneficium communis bellicus turbo vilicus comminor. Vix nulla necessitatibus.', 'a564e036-31d3-44e4-a334-e25cc0b1d3bf'),
('63215876-8ed4-472b-83ec-3f5dcca3313d', 'officia tepesco calamitas', 'Statua despecto tracto sordeo vetus defessus. Arcus architecto amplexus stabilis stips labore thermae. Atavus enim addo vulpes caritas solio autem.', '2efe2289-d3aa-4db9-9fa4-b296c3f45d1d'),
('6806ab4b-e2b7-48e0-89fd-b229bd216509', 'conturbo vulpes bellicus', 'Comptus corrigo admiratio minus adeo aspicio. Sed nam magni ara clarus. Crepusculum ago angulus conculco condico victus decretum.', '2efe2289-d3aa-4db9-9fa4-b296c3f45d1d'),
('6b12c82c-422b-4590-967a-9a95b033a6e2', 'caries cuius sublime', 'Velum turpis decor temperantia vaco umquam crepusculum carcer modi. Somnus certe abduco cenaculum pariatur truculenter universe vilicus. Termes timor curatio clibanus a aufero claustrum.', 'a564e036-31d3-44e4-a334-e25cc0b1d3bf'),
('7184ffb4-7bd5-4c36-96b2-269994578f61', 'avarus tantum excepturi', 'Custodia contigo arbor tempore ventito aeternus rem tracto nihil. Caterva talio cetera alii tunc demergo solutio studio considero totam. Deporto canonicus aveho quis pectus turba ultra.', '2efe2289-d3aa-4db9-9fa4-b296c3f45d1d'),
('7fb0972f-ab68-45f9-8ebb-0d818fb75dd9', 'vae beneficium anser', 'Sequi voluptatibus accusator summisse accusantium tabernus velut officia. Qui ad amet modi atrocitas. Caput coniecto bene caterva calcar reprehenderit umquam audio utpote desolo.', 'e549f6d1-02fd-4119-ac5f-747c6d35aa7a'),
('979927f4-9699-482e-8c84-8997b4b3f0a9', 'aeternus adhaero ea', 'Quis ventosus volutabrum. Tergeo vomica officiis fugit decretum suscipio. Campana angulus aliqua utique ascit.', '04965477-a03a-4fa6-9074-60bc3078a0a4'),
('a9bcf7cc-a215-443a-a930-19e7c7849365', 'aspernatur colligo tribuo', 'Repellendus beatae adficio. Suus deputo tot ager abundans cupiditate conitor. Depopulo nobis una angulus.', 'a564e036-31d3-44e4-a334-e25cc0b1d3bf'),
('aadaff08-e820-4ff5-b986-caa2d2a0d404', 'sono acies patruus', 'Arbor fugiat delicate quia debitis aestus. Quo appello valens attonbitus tyrannus velociter autus. Atrocitas uredo comparo aduro temptatio argumentum claustrum ab cui.', '97ddd8d3-ad40-4a76-80b9-07d3c0a016aa'),
('b03530cf-712c-4e1f-8844-b0a0a64ca2b8', 'circumvenio clementia coniuratio', 'Rem cicuta audio traho atrox templum terebro. Optio amo adicio congregatio at congregatio ars desolo suadeo eveniet. Capitulus tergo turpis stillicidium dignissimos magnam.', 'a564e036-31d3-44e4-a334-e25cc0b1d3bf'),
('b0ae3ec9-4030-4ea9-9707-654d537c37b0', 'adaugeo vos carus', 'Ducimus demulceo tantum uredo ventosus cupiditate. Tibi aptus deporto corroboro deripio tandem compono cohibeo. Unus stips angustus universe debeo.', '04965477-a03a-4fa6-9074-60bc3078a0a4'),
('b6fe9d5c-f4b5-45cf-a520-6f944441cd85', 'pecus demens antiquus', 'Bos caelestis bibo vesco facilis. Expedita volutabrum tardus vesper. Sperno campana cibo curso bibo.', 'a564e036-31d3-44e4-a334-e25cc0b1d3bf'),
('bb127a52-7d11-4731-853d-df5342bf7890', 'solium concido crustulum', 'Audentia adduco crepusculum victoria acsi. Condico victus virga tepidus tempore adfectus crudelis. Audio accusantium harum suppono caput contabesco in.', '04965477-a03a-4fa6-9074-60bc3078a0a4'),
('bd0a8bc4-1590-45eb-9642-8d7ff620f3d0', 'arto cura deleo', 'Cogo terror adiuvo statim valde testimonium colligo tracto adficio vesica. Consequuntur adulescens vinum charisma reprehenderit. Provident valens templum cum defleo velociter vero.', '04965477-a03a-4fa6-9074-60bc3078a0a4'),
('c11562a0-3fcb-4da4-a879-580391b5fbf3', 'admoneo voluptatum cedo', 'Quo cohaero adopto. Amplexus dens cribro suppono solium. Absconditus est undique quidem validus ipsa.', 'e549f6d1-02fd-4119-ac5f-747c6d35aa7a'),
('c36a7517-49b1-46f4-bac5-03f95224336b', 'ara approbo abstergo', 'Usque capto ultio reprehenderit cupiditas tener conturbo casso. Creptio temptatio pecus tibi arx ascisco campana stips spes. Spectaculum cresco deleo bestia cetera vulnus absum abutor solio.', '04965477-a03a-4fa6-9074-60bc3078a0a4'),
('c36efcf9-ce79-471b-9764-b645c5a7e279', 'suasoria utor ventito', 'Stips torqueo subnecto. Triumphus candidus solitudo dicta amplitudo vado conicio teneo vobis sumptus. Laboriosam illo benevolentia error aptus solutio voluptatibus vito sortitus.', '97ddd8d3-ad40-4a76-80b9-07d3c0a016aa'),
('c96e802b-1971-429e-b2fd-6744f98e7dcd', 'provident utpote acquiro', 'Beneficium textilis aestas ustilo sodalitas calcar conor. Conventus tergeo vel tolero desolo odio uter adipiscor uredo sumo. Usus defluo bonus quo vergo desolo demulceo neque conforto blanditiis.', 'e549f6d1-02fd-4119-ac5f-747c6d35aa7a'),
('d10b0d20-6665-4d79-8108-3f046f4bc830', 'cogito ter cernuus', 'Adflicto crux truculenter sopor caterva. Suus dolore terror aestus attero dapifer absorbeo. Utpote advenio sto bene.', '2efe2289-d3aa-4db9-9fa4-b296c3f45d1d'),
('e0ee2b11-8a3d-48e3-9836-fb68c0f78331', 'nobis aperio voluptatem', 'Advenio carbo consuasor amissio aliquid vomica advoco contabesco. Temperantia verumtamen admoveo vinco comburo vacuus vox facere amplus. Territo confido auctor.', '04965477-a03a-4fa6-9074-60bc3078a0a4'),
('e8ea01aa-4093-48a8-9b8e-9317bea51b29', 'curia spero taedium', 'Caries subnecto summa. Beneficium coma bellicus aggredior substantia titulus adflicto textor vestrum depraedor. Sumo delicate confugo conservo velociter.', 'a564e036-31d3-44e4-a334-e25cc0b1d3bf'),
('ed60b1b2-aedb-4732-909d-c97d718f48f6', 'deduco vulgaris facilis', 'Caute tempora appono ulterius tunc carpo similique uredo. Admiratio varius pax combibo tabesco depromo coruscus vomer sustineo. Vulpes coaegresco vomica adinventitias tollo ducimus.', 'e549f6d1-02fd-4119-ac5f-747c6d35aa7a'),
('fa23f9c2-5e21-429f-aa4f-613c2283b425', 'confido alii sumptus', 'Quasi repellendus victoria conqueror facere autus ver tribuo soluta suggero. Auditor crepusculum tutis arguo decerno esse. Custodia communis crebro verto demum vero asper.', 'a564e036-31d3-44e4-a334-e25cc0b1d3bf'),
('ff8ac44a-ecd9-4bf3-8cc7-3fc5f8ad12a2', 'utilis atque deleniti', 'Tubineus sufficio auxilium canto claustrum atrocitas. Tempore at aspernatur claustrum. Ancilla absens caste deripio cetera textus peior desolo.', '97ddd8d3-ad40-4a76-80b9-07d3c0a016aa');

INSERT INTO "public"."tags" ("id", "title") VALUES
('08f05a50-ae19-4e10-a603-cd8bf3e09abe', 'confido'),
('1237b47e-292a-49ed-8447-798811b282ea', 'teres'),
('2fb3f0c4-ffd6-4a7b-afde-49b82a15b93e', 'xiphias'),
('74b1d59e-05a4-4836-beb7-f33c1df53c5e', 'coma'),
('91027d18-2e0e-46c5-ad47-a29771348fea', 'corrigo');

INSERT INTO "public"."users" ("id", "name", "email", "age", "bio", "created_at") VALUES
('04965477-a03a-4fa6-9074-60bc3078a0a4', 'Ebony O''Kon', 'Casimir_Rowe1@hotmail.com', 85, 'Dolores totam vito causa venustas vorax.', '2025-04-18 07:40:55.500438'),
('2efe2289-d3aa-4db9-9fa4-b296c3f45d1d', 'Suzanne White', 'Ayana15@yahoo.com', 26, 'Clementia vel trado caterva temperantia curtus vapulus curtus.', '2025-04-18 07:40:55.500438'),
('97ddd8d3-ad40-4a76-80b9-07d3c0a016aa', 'Nancy Herman', 'Jett81@hotmail.com', 35, 'Civis deficio vaco admitto voluntarius.', '2025-04-18 07:40:55.500438'),
('a564e036-31d3-44e4-a334-e25cc0b1d3bf', 'Mr. Marshall Frami', 'Dexter.Hessel@yahoo.com', 99, 'Pecus saepe amita cena cubicularis votum tum coruscus decumbo.', '2025-04-18 07:40:55.500438'),
('e549f6d1-02fd-4119-ac5f-747c6d35aa7a', 'Leigh Gutmann', 'Rozella.Wunsch@gmail.com', 51, 'Pecto sonitus maxime unus triduana adhaero pectus.', '2025-04-18 07:40:55.500438');

ALTER TABLE "public"."post_tag_pivot" ADD FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;
ALTER TABLE "public"."post_tag_pivot" ADD FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;
ALTER TABLE "public"."posts" ADD FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
