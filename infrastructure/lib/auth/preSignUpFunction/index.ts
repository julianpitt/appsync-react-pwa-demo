import { PreSignUpTriggerHandler } from 'aws-lambda';
import UserGroups from '../../../../shared/groups';

export const handler: PreSignUpTriggerHandler = async (event, context, callback) => {
  console.log(JSON.stringify(event));

  if (!event.request.userAttributes['custom:groupName']) {
    const error = new Error(': No Employee Group selected.');
    callback(error, event);
  } else if (!UserGroups.includes(event.request.userAttributes['custom:groupName'])) {
    const error = new Error(': Invalid Employee Group selected.');
    callback(error, event);
  } else {
    event.response.autoConfirmUser = true;
    // Set the email as verified if it is in the request
    if (event.request.userAttributes.hasOwnProperty('email')) {
      event.response.autoVerifyEmail = true;
    }

    // Set the phone number as verified if it is in the request
    if (event.request.userAttributes.hasOwnProperty('phone_number')) {
      event.response.autoVerifyPhone = true;
    }
    callback(null, event);
  }
};
