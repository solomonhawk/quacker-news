-- CreateTable
CREATE TABLE "user_hidden_posts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "user_hidden_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_hidden_posts_user_id_post_id_key" ON "user_hidden_posts"("user_id", "post_id");

-- CreateIndex
CREATE INDEX "posts_type_idx" ON "posts"("type");

-- AddForeignKey
ALTER TABLE "user_hidden_posts" ADD CONSTRAINT "user_hidden_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hidden_posts" ADD CONSTRAINT "user_hidden_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
