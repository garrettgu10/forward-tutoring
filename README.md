# Forward Tutoring
This is a website that informs people about Forward Tutoring and provides an avenue for all Forward Tutoring services. It also contains an "instant tutoring" portal and a "consistent tutoring" portal.  

## Setup
Make sure you have meteor installed, then
```
meteor npm install
meteor
```
I think that should work; I'm not sure if starting meteor makes it automatically install the necessary Atmosphere packages.

## Accounts
There are three types of accounts: student ("tutee") accounts, tutor accounts, and admin/mod accounts.  
Student accounts are associated with a specific school. Each school is assigned a specific school code which students can use to sign up.  
Tutor accounts are given to each TAMS student who wishes to help with volunteering. When they sign up, they choose which subjects they wish to help with.  
Admin/mod accounts are self-explanatory.  

## Home page
This is a simple static route that showcases what Forward Tutoring is about and how it works.  

## Instant tutoring
This is a forum where tutees post questions and a TAMS student volunteer can answer them. Follow-up questions can be asked and answered. Tutees can see which TAMS student account answered their question and can rate answers.

## Consistent tutoring
Tutees sign up near the beginning of the semester for a limited number of positions with 1-on-1 individual tutors over Skype or any other third party communication tool.  
