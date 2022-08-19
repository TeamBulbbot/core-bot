-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "flags" BIGINT NOT NULL,
    "githubId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issues" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,

    CONSTRAINT "Issues_pkey" PRIMARY KEY ("id")
);
