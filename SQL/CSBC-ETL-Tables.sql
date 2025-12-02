-- Configuration table for each season setup
CREATE TABLE SeasonSetupConfig (
    SeasonId INT PRIMARY KEY,
    StartingGameDate DATE NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    CreatedBy NVARCHAR(100),
    IsProcessed BIT DEFAULT 0,
    ProcessedDate DATETIME NULL,
    Notes NVARCHAR(500)
);

-- Mapping table for ScheduleNumber to DivisionId
CREATE TABLE DivisionScheduleMapping (
    SeasonId INT,
    ScheduleNumber INT,
    DivisionId INT,
    DivisionName NVARCHAR(100), -- Makes it human-readable
    Notes NVARCHAR(200),
    PRIMARY KEY (SeasonId, ScheduleNumber),
    FOREIGN KEY (SeasonId) REFERENCES SeasonSetupConfig(SeasonId)
);

-- Optional: Track location adjustments if they're recurring
CREATE TABLE LocationAdjustments (
    SeasonId INT,
    ScheduleGameId INT,
    OldLocationNumber INT,
    NewLocationNumber INT,
    Reason NVARCHAR(200),
    PRIMARY KEY (SeasonId, ScheduleGameId)
);