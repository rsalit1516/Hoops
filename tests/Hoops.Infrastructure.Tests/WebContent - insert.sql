SELECT TOP (1000) [WebContentId]
      ,[CompanyId]
      ,[Page]
      ,[WebContentTypeId]
      ,[Type]
      ,[Title]
      ,[ContentSequence]
      ,[SubTitle]
      ,[Location]
      ,[DateAndTime]
      ,[Body]
      ,[ExpirationDate]
      ,[ModifiedDate]
      ,[ModifiedUser]
  FROM [dbo].[WebContent]
where ModifiedDate > '2025-05-01'
order by  ModifiedDate desc

-- insert into [dbo].[WebContent] 
-- ( [CompanyId], [Page], [WebContentTypeId], [Type], 
-- [Title], [ContentSequence], [SubTitle], [Location], 
-- [DateAndTime], [Body], 
-- [ExpirationDate], [ModifiedDate], [ModifiedUser])
-- values 
-- ( 1, '', 1, 'Season Info',
--  'Final Fall Season Registration', 1, '', 'Mullins Hall by the front courts - 10170 NW 29th St.', 
--  'Sunday August 3rd from 11:00 am to 1:00 pm', 'Girls and Boys ages 6 and up thru high school & women and men 18+ are all encouraged to register. Registration fee is $150.00 - cash or check only. Non CS residents must pay an additional $60 for each registration. A copy of a birth certificate and proof of address is required at sign ups. Season runs approximately from September - November. Please print out the form (go to Documents -> Registration Form), fill out the form and bring to sign up to save time. Coaches and sponsors are needed. Refunds are board discretionary only. ALL COACHES ARE SUBJECT TO BACKGROUND CHECK.', 
--  '2025-08-04', GetDate(), 121)

update [dbo].[WebContent]
set [DateAndTime] = 'Sunday August 3rd from 11:30 am to 1:30 pm',
[Body] = 'Girls and Boys ages 6 and up thru high school & women and men 18+ are all encouraged to register. Registration fee is $150.00 - cash or check only. Non CS residents must pay an additional $60 for each registration. After this date, a late feewill be applied. A copy of a birth certificate and proof of address is required at sign ups. Season runs approximately from September - November. Please print out the form (go to Documents -> Registration Form), fill out the form and bring to sign up to save time. Coaches and sponsors are needed. Refunds are board discretionary only. ALL COACHES ARE SUBJECT TO BACKGROUND CHECK.'
where [WebContentId] = 264