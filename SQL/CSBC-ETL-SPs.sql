CREATE PROCEDURE [dbo].[SetupNewSeason]
    @seasonId INT,
    @makeSeasonLive BIT = 0,  -- Safety: don't go live by default
    @validateOnly BIT = 0      -- Dry run mode
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @startingGameDate DATE;
    DECLARE @errorMessage NVARCHAR(500);
    DECLARE @rowsAffected INT;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Get configuration for this season
        SELECT @startingGameDate = StartingGameDate
        FROM SeasonSetupConfig
        WHERE SeasonId = @seasonId AND IsProcessed = 0;
        
        IF @startingGameDate IS NULL
        BEGIN
            SET @errorMessage = 'Season ' + CAST(@seasonId AS NVARCHAR) + ' not found in config or already processed';
            RAISERROR(@errorMessage, 16, 1);
            RETURN;
        END
        
        PRINT '=== Starting Season Setup for Season ' + CAST(@seasonId AS NVARCHAR) + ' ===';
        PRINT 'Starting Game Date: ' + CAST(@startingGameDate AS NVARCHAR);
        
        -- Step 1: Update ScheduleDivTeams
        PRINT 'Step 1: Updating ScheduleDivTeams...';
        
        IF @validateOnly = 0
        BEGIN
            UPDATE ScheduleDivTeams 
            SET seasonID = @seasonId
            WHERE SeasonId IS NULL;
            
            SET @rowsAffected = @@ROWCOUNT;
            PRINT '  - Updated ' + CAST(@rowsAffected AS NVARCHAR) + ' records in ScheduleDivTeams';
        END
        ELSE
        BEGIN
            SELECT @rowsAffected = COUNT(*) 
            FROM ScheduleDivTeams 
            WHERE SeasonId IS NULL;
            PRINT '  - Would update ' + CAST(@rowsAffected AS NVARCHAR) + ' records in ScheduleDivTeams';
        END
        
        -- Step 2: Update ScheduleGames with SeasonId
        PRINT 'Step 2: Updating ScheduleGames with SeasonId...';
        
        IF @validateOnly = 0
        BEGIN
            UPDATE ScheduleGames
            SET seasonId = @seasonId
            WHERE SeasonId IS NULL 
              AND gameDate >= @startingGameDate;
            
            SET @rowsAffected = @@ROWCOUNT;
            PRINT '  - Updated ' + CAST(@rowsAffected AS NVARCHAR) + ' records in ScheduleGames';
        END
        ELSE
        BEGIN
            SELECT @rowsAffected = COUNT(*) 
            FROM ScheduleGames 
            WHERE SeasonId IS NULL 
              AND gameDate >= @startingGameDate;
            PRINT '  - Would update ' + CAST(@rowsAffected AS NVARCHAR) + ' records in ScheduleGames';
        END
        
        -- Step 3: Apply Division Mappings
        PRINT 'Step 3: Applying Division Mappings...';
        
        IF @validateOnly = 0
        BEGIN
            UPDATE sg
            SET sg.DivisionId = m.DivisionId
            FROM ScheduleGames sg
            INNER JOIN DivisionScheduleMapping m
                ON sg.SeasonId = m.SeasonId 
                AND sg.ScheduleNumber = m.ScheduleNumber
            WHERE sg.SeasonId = @seasonId;
            
            SET @rowsAffected = @@ROWCOUNT;
            PRINT '  - Updated ' + CAST(@rowsAffected AS NVARCHAR) + ' games with division mappings';
        END
        ELSE
        BEGIN
            SELECT @rowsAffected = COUNT(*) 
            FROM ScheduleGames sg
            INNER JOIN DivisionScheduleMapping m
                ON sg.SeasonId = m.SeasonId 
                AND sg.ScheduleNumber = m.ScheduleNumber
            WHERE sg.SeasonId = @seasonId;
            PRINT '  - Would update ' + CAST(@rowsAffected AS NVARCHAR) + ' games with division mappings';
        END
        
        -- Step 4: Update Teams
        PRINT 'Step 4: Updating Teams...';
        
        IF @validateOnly = 0
        BEGIN
            UPDATE Teams 
            SET seasonid = @seasonId
            WHERE DivisionID IN (
                SELECT DivisionID 
                FROM Divisions 
                WHERE seasonid = @seasonId
            );
            
            SET @rowsAffected = @@ROWCOUNT;
            PRINT '  - Updated ' + CAST(@rowsAffected AS NVARCHAR) + ' teams with SeasonId';
            
            -- Reset team names
            UPDATE Teams
            SET TeamName = NULL
            WHERE SeasonID = @seasonId;
            
            PRINT '  - Reset team names for new season';
        END
        ELSE
        BEGIN
            SELECT @rowsAffected = COUNT(*) 
            FROM Teams
            WHERE DivisionID IN (
                SELECT DivisionID 
                FROM Divisions 
                WHERE seasonid = @seasonId
            );
            PRINT '  - Would update ' + CAST(@rowsAffected AS NVARCHAR) + ' teams';
        END
        
        -- Step 5: Apply any location adjustments
        PRINT 'Step 5: Applying Location Adjustments...';
        
        IF EXISTS (SELECT 1 FROM LocationAdjustments WHERE SeasonId = @seasonId)
        BEGIN
            IF @validateOnly = 0
            BEGIN
                UPDATE sg
                SET sg.LocationNumber = la.NewLocationNumber
                FROM ScheduleGames sg
                INNER JOIN LocationAdjustments la
                    ON sg.ScheduleGamesId = la.ScheduleGameId
                    AND sg.SeasonId = la.SeasonId
                WHERE sg.SeasonId = @seasonId;
                
                SET @rowsAffected = @@ROWCOUNT;
                PRINT '  - Applied ' + CAST(@rowsAffected AS NVARCHAR) + ' location adjustments';
            END
            ELSE
            BEGIN
                SELECT @rowsAffected = COUNT(*) 
                FROM LocationAdjustments 
                WHERE SeasonId = @seasonId;
                PRINT '  - Would apply ' + CAST(@rowsAffected AS NVARCHAR) + ' location adjustments';
            END
        END
        ELSE
        BEGIN
            PRINT '  - No location adjustments needed';
        END
        
        -- Step 6: Make season live (if requested)
        IF @makeSeasonLive = 1
        BEGIN
            PRINT 'Step 6: Making Season Live...';
            
            IF @validateOnly = 0
            BEGIN
                -- Turn off all other seasons
                UPDATE Seasons
                SET [CurrentSeason] = 0, 
                    CurrentSchedule = 0, 
                    CurrentSignUps = 0
                WHERE seasonId <> @seasonId;
                
                -- Turn on this season
                UPDATE Seasons
                SET [CurrentSeason] = 1, 
                    CurrentSchedule = 1, 
                    CurrentSignUps = 1
                WHERE seasonId = @seasonId;
                
                PRINT '  - Season is now LIVE';
            END
            ELSE
            BEGIN
                PRINT '  - Would make season LIVE (validate only mode)';
            END
        END
        ELSE
        BEGIN
            PRINT 'Step 6: Skipping "Make Live" step (not requested)';
        END
        
        -- Mark as processed
        IF @validateOnly = 0
        BEGIN
            UPDATE SeasonSetupConfig
            SET IsProcessed = 1,
                ProcessedDate = GETDATE()
            WHERE SeasonId = @seasonId;
            
            COMMIT TRANSACTION;
            PRINT '';
            PRINT '=== Season Setup Complete ===';
        END
        ELSE
        BEGIN
            ROLLBACK TRANSACTION;
            PRINT '';
            PRINT '=== Validation Complete (no changes made) ===';
        END
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        PRINT 'ERROR: ' + ERROR_MESSAGE();
        PRINT 'Line: ' + CAST(ERROR_LINE() AS NVARCHAR);
        
        THROW;
    END CATCH
END
GO