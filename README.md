# Supermarket Slot Finder
This app runs some cypress tests to check if there are any delivery slots available for supermarkets (currently only Asda and Tesco). If there is a slot found it will send a text using Twillio.

It was made so that my parents (who haven't been classified as vulnerable, despite old age and health conditions) can get a home delivery slot rather than risking going to the shops.

## Setting up the environment
Before using the application you will need to fill in a few details in the `cypress.json` file.

### For Tesco
For tesco you will need to fill in your username and password under the `tesco` object.

### For Asda
This is a little more involved.
1. Go to `https://groceries.asda.com/checkout/book-slot?tab=deliver&origin=/`
2. Log in
3. Open up the chrome devtools and look for a POST to `https://groceries.asda.com/api/v3/slot/view`
4. Look at the request, which will contain your `account_id` and `location`.
5. Copy those details into the `asda` object.

### For Twillio
The application uses twillio to send texts when a slot has been found.  
1. Follow this guide [here](https://www.twilio.com/docs/sms/quickstart/node#sign-up-for-twilio-and-get-a-twilio-phone-number) (only the `Sign up for Twilio and Get a Twilio Phone Number` section) to sign up to twillio and get a phone number. Copy the phone number.
2. go to the [twillio console](https://www.twilio.com/console) and copy your accountSid and authToken and put them into the `twillio` object.
3. Put the twillio phone number you got in step 1 into the `fromNumber` property in the `twillio` object, and put your phone number into the `toNumber` section. 

## Start the application
The app can be run once, or it can be run such that the trello tests run once per hour.

### Run once
`npm run cypress:run`

### Run once per hour
`npm run cron`
