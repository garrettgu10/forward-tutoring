# Forward Tutoring
This is a website that informs people about Forward Tutoring and provides an avenue for all Forward Tutoring services. It also contains an "instant tutoring" portal and a "consistent tutoring" portal.  

## Setup
Make sure you have meteor installed, then
```
meteor npm install
meteor
```
There's one small problem with getting material-ui's Table component to work in this environment for some reason. Replace '../Checkbox' with '../CheckBox' in material-ui/Table/TableBody.js and material-ui/Table/TableHeader.js.

I excluded a file from the repo because it has the master keys (server/registration-keys.js). All it does it export two strings, TUTOR_KEY, and ADMIN_KEY, which are used to register tutor and admin accounts respectively.

## Accounts
There are three types of accounts: student ("tutee") accounts, tutor accounts, and admin/mod accounts.  
* Student accounts are associated with a specific school. Each school is assigned a specific school code which students can use to sign up.  
* Tutor accounts are given to each TAMS student who wishes to help with volunteering. When they sign up, they choose which subjects they wish to help with.  
* Admin/mod accounts are self-explanatory.  

## Home page
This is a simple static route that showcases what Forward Tutoring is about and how it works.  

## Instant tutoring
This is a forum where tutees post questions and a TAMS student volunteer can answer them. Follow-up questions can be asked and answered. Tutees can see which TAMS student account answered their question.

## Consistent tutoring
Tutees sign up near the beginning of the semester for a limited number of positions with 1-on-1 individual tutors over Skype or any other third party communication tool. This personal section of the website is shown to tutees once they create their account. The consistent tutors from TAMS are subject to change, as some TAMS students may not fully commit to the program due to coursework, etc.

## High Schools
The idea is to connect to 4 high schools, each in a separate state across the United States including Texas. Around 15-20 students for each school could work.
