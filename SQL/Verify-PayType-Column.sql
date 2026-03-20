-- Verify PayType column structure
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Player' AND COLUMN_NAME = 'PayType';

-- Check if there are any PayType values longer than 5 characters
SELECT
    PlayerId,
    PayType,
    LEN(PayType) as PayTypeLength
FROM Player
WHERE LEN(PayType) > 5;

-- Check all unique PayType values and their lengths
SELECT
    DISTINCT PayType,
    LEN(PayType) as Length,
    COUNT(*) as Count
FROM Player
WHERE PayType IS NOT NULL
GROUP BY PayType
ORDER BY LEN(PayType) DESC;
