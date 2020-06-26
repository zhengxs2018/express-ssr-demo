### how to set 'https'
config/development.js
![](blob:https://medium.com/ea33bd64-6f29-49bf-9289-3d564bc7af60)


### start the app
```
yarn 
yarn start
```

## SCREEN REQUIREMENTS

### Login

Login should now support admin roles in addition to the existing Physician role, and they should land on their own pages after login. You need to remove the “Admin Page” link from the Physician homepage and instead show a different homepage based on the role.

 
Make sure that proper authorization is enforced for each role (i.e. physician should not be able to see admin pages).

 
## Admin Pages

### Home

The warning message saying “Your password is expiring in xx days, please update your password now or you won’t be able to login once it expires.” should only start showing at 14 days, 7 days, 3 days.

The sidebar on the right is static

Make sure the rest of the features on the UI are integrated with the api

Currently there’s a EXPORT AUDIT LOGS link on the Patients page for Physician role, remove that from Physician Patients page and make sure Physicians can no longer invoke that api. Then add that link to the homepage of admin and make sure only admins can invoke the feature.

Implement the other UI elements as per design, and make sure navigation to the other pages is correct

### Users - Patients List

This page shows the list of patient users, the recently view section shows users as tiles and the all patients section shows users in tabular view

When hovering on a tile the admin can choose to View Profile, Edit or Delete the user, clicking the name should do the same as View Profile

Edit should navigate to the same patient details page that’s currently available to Physician users (not shown in prototype)

On the right side the admin can add a new user, the Role dropdown will have 4 options: Physician, Technician, Secretary and Admin. Patient users can NOT be added by admins

Once a new user is added, admin should be redirected to the user role tab page (for example: if the adds a new Physician, the patients tab should be shown)

The admin can search, sort, edit or delete patients from the table view as well. The name column is clickable and will lead the admin to the patient details (same as View Profile)

The admin should be able to sort by the following (applies to all tabs):

Last name

First name

Date Added (ascending) 

Date Added (descending) 

Users - Patient Profile

The admin can view patient profile on this screen

By default the right sidebar shows notes and progress data (static for now), but when Patient Forms is clicked, it shows the files associated with the patient

‘All File Types’ should be changed to ‘Added by’ drop down to a multi select with user names

Should only show the users who have uploaded documents to that patient, including the patient themselves

‘Latest Date’ should be renamed to ‘Newest First’. Other options are:

## Oldest First

Alphabetical (ascending)

Alphabetic (descending) 

Make sure these options work

When clicking the 3-dot menu icon on a file, the admin can Download, Print, Send or Delete the file

The admin can also select one or multiple files and then Download, Send or Delete the files, but note the Print action is disabled if multiple files are selected, clicking the close icon will dismiss the blue panel and de-select the files

File deletion must show a confirmation dialog first.

When files are deleted, please show a toast (screen 10), but we don’t need the “Undo” button, please don’t include that in your implementation.

The plus button on the UI will simply allow the admin to upload a file to the patient

When other users request some of the files to be deleted from the patient’s profile, the delete icon will show under the file

## Delete Requests

The admin will get to this page from the home screen (by clicking the Delete Requests tile)

The pending requests tab will show a list of pending requests, each row will show a single file to be deleted. The patient name should be a clickable link which will load the admin to the profile page, the file name is also a link that will allow the admin to preview the file directly on the page:

Approve will ask the admin to confirm the deletion of the file

Reject will show a popup asking the admin to enter the reject reason and submit the rejection

Delete History will show past requests, the first 4 columns in table will be the same as pending requests, the 5th column will show PROCESSED DATE, and the 6th column will show the status which is either Approved or Rejected

## Users - Physicians

This page shows the physician users and it should have similar layout as the Patients view, the design is currently missing a table at the bottom, please make sure you add that

Blue profile card

Photo, name, title, and phone should become editable on click of edit button (screen 19)

‘Submit’ should save updates, ‘Cancel’ should discard updates and close edit mode

About (long text)

‘Edit’ should open edit view

No rich formatting needed, but hitting enter twice should indicate a new paragraph tag 

‘Submit’ should save updates, ‘Cancel’ should discard updates and close edit mode

## Upcoming appointments 

Should load first 4 appointments that are the soonest to occur

Should have the ability to ‘view more’ by scrolling

Please note that one thing different from the Patients view is that there’s an additional message showing when password is going to expire (design shows email expiring / expired and that’s a typo). The table view must also show this message.

Users - Technicians / Secretaries / Admins

These pages are not shown in the design, but they should have similar page layout and features like Physicians, just that the users will be differents

Users - Physician Profile

The page should show the details of the physician

Clicking the edit icon on the blue tile should make the avatar, name, title and phone number editable (email is not editable). Clicking the avatar icon should allow the admin to upload a new photo (.png / .jpg format)

Clicking the edit icon in about section should make the section editable, it should preserve multiple blank lines

The bottom should show the upcoming Appointments for this physician

View Calendar link will take the admin to the calendar page (not in scope of this challenge)

The physician’s availability can be managed on the right sidebar

Add Availability

Admin has the right to set physician availability in blocks (e.g. Tuesday mornings, Wednesday afternoons)

‘+’ icon should allow user to add new availability

Clicking the 3-dot menu icon should open the menus

‘Delete’ should remove that time slot from doctor’s availability, the admin can only delete after entering the right password

‘Edit’: should open edit screen with applicable information loaded and title should say Edit instead of Add

## Edit availability:

User should be able to multi-select days

‘More Range’ should be corrected to ‘Add Time Range’ 

‘Add Time Range’ should add up to 4 ranges

Validation error “You cannot add more than 4 time ranges per day”

‘Delete’ icon should have same behavior as ‘delete’ mentioned above

‘Submit’ should save the changes, Cancel will discard the changes

Make sure proper validation is in place, such as: invalid range, overlapping range, etc.

The admin should be able to directly change the physician’s password

The admin is able to reset the password for the physician which will trigger the system to send an email to the physician’s email address

 
## GENERAL REQUIREMENTS

Must use ReactJS and follow the provided design.

The main content should have fluid width to fill all the available space, the minimum supported resolution is 1280*720 (height is actually unlimited since the page can scroll).

Searching / filtering should work whenever applicable.

Pagination should work whenever applicable.

Filtering/pagination happens on the server side so you need to pass the query parameters and the server is expected to return the pagination info (pageSize, total etc).

Implement popup for confirmation and warning messages. Do NOT use browser alerts, but use custom styles popups as shown in the design

Show loading spinners when populating data from API / local JSON to UI

Implement validation errors (for example: login error as shown in design)

No linting errors

No errors with prod builds

You are expected to create a detailed README file including information on how to setup, run and verify your application.

 
## CODE REQUIREMENTS

ES6 syntax is preferred, as Babel has been set up to handle transpiling the syntax to the current JavaScript standard.

Use .jsx extension for React components; using PascalCase for filenames. E.g., ComponentName/index.jsx.

Do not create a single .css/.scss file for the whole app. Each component should have its own stylesheet file.

Ensure that there are no lint errors.

You’re free to choose between CSS & SCSS but you need to use flex instead of float.

Follow a clean folder structure.

Create reusable components.

 
## JAVASCRIPT REQUIREMENTS

All JavaScript must not have a copyright by a third party. You are encouraged to use your own scripts, or scripts that are free, publicly available and do not have copyright statements or author recognition requirements anywhere in the code.

Use ES6 linter for code quality

 
## LICENSES & ATTRIBUTION

Third-party assets used to build your item must be properly licensed and free for commercial use. MIT and Apache v2 licenses are ok, for any others please check with us to get approval first.

Sufficient information regarding third-party assets must be present in your documentation. This includes the author, license info and a direct link to the asset online.

 
## BROWSER REQUIREMENTS

Windows: IE 11+, Chrome latest, Firefox latest

Mac: Safari Latest, Chrome Latest, Firefox Latest

Final Submission Guidelines
Full code that covers all the requirements.

A detailed README file including information on how to set up and run your application.

## Todo List 

- [] The server side lacks session function, interception can only be done on the client side.
- [] The ui is heavily dependent on the LocalStorage api, which is not good for server-side rendering.
