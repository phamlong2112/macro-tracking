-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Indicator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scope" TEXT,
    "unit" TEXT,
    "freq" TEXT NOT NULL,
    "source" TEXT,
    "manualEntry" BOOLEAN NOT NULL DEFAULT false,
    "pnlChannel" TEXT,
    "thresholdText" TEXT,
    "definition" TEXT,
    "markValue" REAL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Indicator_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Observation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "indicatorId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "value" REAL,
    "displayValue" TEXT,
    "signal" TEXT NOT NULL,
    "note" TEXT,
    "cmpW" TEXT,
    "cmpM" TEXT,
    "cmpYtd" TEXT,
    "cmpYoy" TEXT,
    CONSTRAINT "Observation_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeeklyReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekOf" DATETIME NOT NULL,
    "publishDate" DATETIME NOT NULL,
    "horizon" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL,
    "thesis" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "TopicWeeklyStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weeklyReportId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "trend" TEXT NOT NULL,
    "driverNote" TEXT,
    CONSTRAINT "TopicWeeklyStatus_weeklyReportId_fkey" FOREIGN KEY ("weeklyReportId") REFERENCES "WeeklyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TopicWeeklyStatus_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mover" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weeklyReportId" TEXT NOT NULL,
    "indicatorId" TEXT,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "val" TEXT NOT NULL,
    "dir" TEXT NOT NULL,
    CONSTRAINT "Mover_weeklyReportId_fkey" FOREIGN KEY ("weeklyReportId") REFERENCES "WeeklyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Mover_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weeklyReportId" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    CONSTRAINT "Scenario_weeklyReportId_fkey" FOREIGN KEY ("weeklyReportId") REFERENCES "WeeklyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CalendarItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weeklyReportId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "highPriority" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CalendarItem_weeklyReportId_fkey" FOREIGN KEY ("weeklyReportId") REFERENCES "WeeklyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weeklyReportId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    CONSTRAINT "NewsItem_weeklyReportId_fkey" FOREIGN KEY ("weeklyReportId") REFERENCES "WeeklyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NewsItem_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Observation_indicatorId_date_idx" ON "Observation"("indicatorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Observation_indicatorId_date_key" ON "Observation"("indicatorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "TopicWeeklyStatus_weeklyReportId_topicId_key" ON "TopicWeeklyStatus"("weeklyReportId", "topicId");
