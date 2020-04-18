/// <reference types="cypress" />

context('Asda', () => {

  // https://on.cypress.io/interacting-with-elements

  it('get data from API and check if slot is available', async () => {
    // set up twillio
    const twillioEnvs = Cypress.env('twillio');
    const client = require('twilio')(twillioEnvs.accountSid, twillioEnvs.authToken);

    // Create request
    const todaysDate = new Date();
    const dateIn10Days = new Date();
    dateIn10Days.setDate(todaysDate.getDate() + 10);
    const asdaEnvs = Cypress.env('asda');
    const address = asdaEnvs.address;
    const account_id = asdaEnvs.account_id;
    const request = {
      "requestorigin": "gi",
      "data": {
        "service_info": { "fulfillment_type": "DELIVERY", "enable_express": false },
        "start_date": todaysDate.toISOString(),
        "end_date": dateIn10Days.toISOString(),
        "reserved_slot_id": "",
        "service_address": address,
        "customer_info": { "account_id": account_id },
        "order_info": {
          "order_id": "21277276197",
          "restricted_item_types": [],
          "volume": 0,
          "weight": 0,
          "sub_total_amount": 0,
          "line_item_count": 0,
          "total_quantity": 0
        }
      }
    }    

    // Send request and get response
    const response = await cy.request({
      method: 'POST', 
      url: 'https://groceries.asda.com/api/v3/slot/view', 
      body: request, 
      headers: {'Content-Type': 'application/json'}});

    // go through slots for each day and see if any have status which isn't 'UNAVAILABLE'
    response.body.data.slot_days.forEach(async day => {
      await day.slots.forEach(async slot => {
        if(slot.slot_info.status !== 'UNAVAILABLE') {
          // If we find a slot with a different status then send a text
          await client.messages
            .create({
              body: 'Asda slot found!',
              from: twillioEnvs.fromNumber,
              to: twillioEnvs.toNumber
            });
          throw new Error('slot found, exiting here');
        }
      })
    });
  });

});
