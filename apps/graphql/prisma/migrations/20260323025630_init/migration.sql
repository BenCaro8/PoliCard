-- CreateEnum
CREATE TYPE "VotePosition" AS ENUM ('Yea', 'Nay', 'Absent');

-- CreateTable
CREATE TABLE "politicians" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "ideology_score" DOUBLE PRECISION,
    "ideology_source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "politicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "politician_votes" (
    "vote_id" TEXT NOT NULL,
    "politician_id" TEXT NOT NULL,
    "bill" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "position" "VotePosition" NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "politician_votes_pkey" PRIMARY KEY ("vote_id")
);

-- CreateTable
CREATE TABLE "politician_news" (
    "news_id" TEXT NOT NULL,
    "politician_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "published_at" TEXT NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "politician_news_pkey" PRIMARY KEY ("news_id")
);

-- AddForeignKey
ALTER TABLE "politician_votes" ADD CONSTRAINT "politician_votes_politician_id_fkey" FOREIGN KEY ("politician_id") REFERENCES "politicians"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "politician_news" ADD CONSTRAINT "politician_news_politician_id_fkey" FOREIGN KEY ("politician_id") REFERENCES "politicians"("id") ON DELETE CASCADE ON UPDATE CASCADE;
