# Heading

code

SELECT 
    d.Div_Desc as Division,
    pl.DraftID,
      p.[LastName],
      p.[FirstName],
      convert(Date, p.BirthDate) as DOB,
      p.Grade,
      h.Address1,
      h.City,
      h.zip
  FROM [dbo].[People] P
  join players pl on p.PeopleID = pl.PeopleID
  join Households h on p.MainHouseID = h.HouseID
  join Divisions d on pl.DivisionID = d.DivisionID
  join Seasons s on s.SeasonID = d.SeasonID
  where s.SeasonID = 2222
  order by d.Div_desc, p.lastName, p.FirstName
