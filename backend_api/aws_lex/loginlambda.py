
import boto3
import urllib3
import json
import datetime
import time
import os
import dateutil.parser
import logging
import urllib.parse

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

# --- Helpers that build all of the responses ---


def elicit_slot(session_attributes, intent_name, slots, slot_to_elicit, message):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ElicitSlot',
            'intentName': intent_name,
            'slots': slots,
            'slotToElicit': slot_to_elicit,
            'message': message
        }
    }


def confirm_intent(session_attributes, intent_name, slots, message):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ConfirmIntent',
            'intentName': intent_name,
            'slots': slots,
            'message': message
        }
    }


def close(session_attributes, fulfillment_state, message):
    response = {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': fulfillment_state,
            'message': message
        }
    }

    return response

def searchclose(session_attributes, fulfillment_state, message):
    search = {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': fulfillment_state,
            'message': message
        }
    }

    return search


def bookclose(session_attributes, fulfillment_state, message):
    book = {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': fulfillment_state,
            'message': message
        }
    }

    return book


def orderclose(session_attributes, fulfillment_state, message):
    order = {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': fulfillment_state,
            'message': message
        }
    }

    return order


def delegate(session_attributes, slots):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Delegate',
            'slots': slots
        }
    }


# --- Helper Functions ---


def safe_int(n):
    """
    Safely convert n value to int.
    """
    if n is not None:
        return int(n)
    return n


def try_ex(func):
    """
    Call passed in function in try block. If KeyError is encountered return None.
    This function is intended to be used to safely access dictionary.

    Note that this function would have negative impact on performance.
    """

    try:
        return func()
    except KeyError:
        return None




def isvalid_city(city):
    valid_cities = ['new york', 'los angeles', 'chicago', 'houston', 'philadelphia', 'phoenix', 'san antonio',
                    'san diego', 'dallas', 'san jose', 'austin', 'jacksonville', 'san francisco', 'indianapolis',
                    'columbus', 'fort worth', 'charlotte', 'detroit', 'el paso', 'seattle', 'denver', 'washington dc',
                    'memphis', 'boston', 'nashville', 'baltimore', 'portland']
    return city.lower() in valid_cities




def isvalid_date(date):
    try:
        dateutil.parser.parse(date)
        return True
    except ValueError:
        return False



def build_validation_result(isvalid, violated_slot, message_content):
    return {
        'isValid': isvalid,
        'violatedSlot': violated_slot,
        'message': {'contentType': 'PlainText', 'content': message_content}
    }





def login_app(intent_request):

    intent_name = intent_request['currentIntent']['name']

    session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}

    if intent_request['invocationSource'] == 'DialogCodeHook':
        session_attributes['currentReservation'] = reservation
        return delegate(session_attributes, intent_request['currentIntent']['slots'])

    if intent_name == 'Login':
        # navigateconfirm = try_ex(lambda: intent_request['currentIntent']['slots']['Navigateconfirm'])
        optionentered = try_ex(lambda: intent_request['currentIntent']['slots']['Optionentered'])
        # print(navigateconfirm)
        print(optionentered)

        loweroptionentered=optionentered.lower()
        print(loweroptionentered)

        login="login"

        search="search"

        book="book"

        order="order"

        if login in loweroptionentered:
            return close(
                session_attributes,
                'Fulfilled',
                {
                    'contentType': 'PlainText',
                    'content': 'Please find the Login Link : https://frontend-tdfpz7mbuq-uc.a.run.app/login. Type navigate again in chat box to return back to navigation menu.To return back to the main menu type hi'

                }
                )
        elif search in loweroptionentered:
            return searchclose(
                session_attributes,
                'Fulfilled',
                {
                    'contentType': 'PlainText',
                    'content': 'List of Available rooms https://frontend-tdfpz7mbuq-uc.a.run.app/availablerooms .Type navigate again in chat box to return back to navigation menu.To return back to the main menu type hi'

                }
                )
        elif book in loweroptionentered:
            return bookclose(
                session_attributes,
                'Fulfilled',
                {
                    'contentType': 'PlainText',
                    'content': 'Booking rooms link  https://frontend-tdfpz7mbuq-uc.a.run.app/bookroom/78.Type navigate again in chat box to return back to navigation menu. To return back to the main menu type hi'

                }
                )
        elif order in loweroptionentered:
            return orderclose(
                session_attributes,
                'Fulfilled',
                {
                    'contentType': 'PlainText',
                    'content': 'Ordering fooding link https://frontend-tdfpz7mbuq-uc.a.run.app/orderfood.Type navigate again in chat box to return back to navigation menu.To return back to the main menu type hi'

                }
                )
        else:
            print("Invalid prompt")



def dispatch(intent_request):
    """
    Called when the user specifies an intent for this bot.
    """

    logger.debug('dispatch userId={}, intentName={}'.format(intent_request['userId'], intent_request['currentIntent']['name']))

    intent_name = intent_request['currentIntent']['name']

    # Dispatch to your bot's intent handlers
    if intent_name == 'Login':
        return login_app(intent_request)
    # elif intent_name == 'BookCar_enIN':
    #     return book_car(intent_request)

    raise Exception('Intent with name ' + intent_name + ' not supported')


# --- Main handler ---


def lambda_handler(event, context):
    """
    Route the incoming request based on intent.
    The JSON body of the request is provided in the event slot.
    """
    # By default, treat the user request as coming from the America/New_York time zone.
    os.environ['TZ'] = 'America/New_York'
    time.tzset()
    logger.debug('event.bot.name={}'.format(event['bot']['name']))

    return dispatch(event)
