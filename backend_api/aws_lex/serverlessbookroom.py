
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


# def isvalid_room_type(room_type):
#     room_types = ['queen', 'king', 'deluxe']
#     return room_type.lower() in room_types


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



def book_hotel(intent_request):
    """
    Performs dialog management and fulfillment for booking a hotel.

    Beyond fulfillment, the implementation for this intent demonstrates the following:
    1) Use of elicitSlot in slot validation and re-prompting
    2) Use of sessionAttributes to pass information that can be used to guide conversation
    """
    roomnumber = safe_int(try_ex(lambda: intent_request['currentIntent']['slots']['Roomnumber']))
    useremail = try_ex(lambda: intent_request['currentIntent']['slots']['UserEmail'])
    fromdate = try_ex(lambda: intent_request['currentIntent']['slots']['FromDate'])
    todate = try_ex(lambda: intent_request['currentIntent']['slots']['ToDate'])
    adults = safe_int(try_ex(lambda: intent_request['currentIntent']['slots']['Adults']))
    childrens = safe_int(try_ex(lambda: intent_request['currentIntent']['slots']['Childrens']))
    newline="\n"
    print(roomnumber)
    print(useremail)
    print(fromdate)
    print(todate)
    print(adults)
    print(childrens)

    session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}

    # Load confirmation history and track the current reservation.
    reservation = json.dumps({
        'ReservationType': 'Hotel',
        'Roomnumber': roomnumber,
        'Useremail': useremail,
        'Fromdate': fromdate,
        'ToDate': todate,
        'Adults': adults,
        'Childrens': childrens
    })

    print(reservation)
    session_attributes['currentReservation'] = reservation

    if intent_request['invocationSource'] == 'DialogCodeHook':
        # Validate any slots which have been specified.  If any are invalid, re-elicit for their value
        # validation_result = validate_hotel(intent_request['currentIntent']['slots'])
        # if not validation_result['isValid']:
        #     slots = intent_request['currentIntent']['slots']
        #     slots[validation_result['violatedSlot']] = None

        #     return elicit_slot(
        #         session_attributes,
        #         intent_request['currentIntent']['name'],
        #         slots,
        #         validation_result['violatedSlot'],
        #         validation_result['message']
        #     )

        # Otherwise, let native DM rules determine how to elicit for slots and prompt for confirmation.  Pass price
        # back in sessionAttributes once it can be calculated; otherwise clear any setting from sessionAttributes.
        # if location and checkin_date and nights and room_type:
        #     # The price of the hotel has yet to be confirmed.
        #     price = generate_hotel_price(location, nights, room_type)
        #     session_attributes['currentReservationPrice'] = price
        # else:
        #     try_ex(lambda: session_attributes.pop('currentReservationPrice'))

        session_attributes['currentReservation'] = reservation
        return delegate(session_attributes, intent_request['currentIntent']['slots'])

    # Booking the hotel.  In a real application, this would likely involve a call to a backend service.
    logger.debug('bookHotel under={}'.format(reservation))


    http = urllib3.PoolManager()
    senddata = {
        'roomnumber': roomnumber,
        'userEmail': useremail,
        'fromDate': fromdate,
        'toDate': todate,
        'adults': adults,
        'children': childrens
    }


    r = http.request("POST", "https://us-central1-assignment4-355202.cloudfunctions.net/room-booking",body=json.dumps(senddata),headers={'Content-Type': 'application/json'})
    print(r)



    return close(
        session_attributes,
        'Fulfilled',
        {
            'contentType': 'PlainText',
            'content': 'Thanks your room has been booked. Please find the booking details ' + 'Room no: ' + str(roomnumber) + ' , Check in date: ' + str(fromdate) + ' , Checkout Date: ' + str(todate) + ', Adults: ' + str(adults) + ' , Childrens: ' + str(childrens)  + ' Type hi to go back to main menu'

        }
    )


# def book_car(intent_request):
#     """
#     Performs dialog management and fulfillment for booking a car.

#     Beyond fulfillment, the implementation for this intent demonstrates the following:
#     1) Use of elicitSlot in slot validation and re-prompting
#     2) Use of sessionAttributes to pass information that can be used to guide conversation
#     """
#     slots = intent_request['currentIntent']['slots']
#     pickup_city = slots['PickUpCity']
#     pickup_date = slots['PickUpDate']
#     return_date = slots['ReturnDate']
#     driver_age = slots['DriverAge']
#     car_type = slots['CarType']
#     confirmation_status = intent_request['currentIntent']['confirmationStatus']
#     session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}
#     last_confirmed_reservation = try_ex(lambda: session_attributes['lastConfirmedReservation'])
#     if last_confirmed_reservation:
#         last_confirmed_reservation = json.loads(last_confirmed_reservation)
#     confirmation_context = try_ex(lambda: session_attributes['confirmationContext'])

#     # Load confirmation history and track the current reservation.
#     reservation = json.dumps({
#         'ReservationType': 'Car',
#         'PickUpCity': pickup_city,
#         'PickUpDate': pickup_date,
#         'ReturnDate': return_date,
#         'CarType': car_type
#     })
#     session_attributes['currentReservation'] = reservation

#     if pickup_city and pickup_date and return_date and driver_age and car_type:
#         # Generate the price of the car in case it is necessary for future steps.
#         price = generate_car_price(pickup_city, get_day_difference(pickup_date, return_date), driver_age, car_type)
#         session_attributes['currentReservationPrice'] = price

#     if intent_request['invocationSource'] == 'DialogCodeHook':
        # Validate any slots which have been specified.  If any are invalid, re-elicit for their value
        # validation_result = validate_book_car(intent_request['currentIntent']['slots'])
        # if not validation_result['isValid']:
        #     slots[validation_result['violatedSlot']] = None
        #     return elicit_slot(
        #         session_attributes,
        #         intent_request['currentIntent']['name'],
        #         slots,
        #         validation_result['violatedSlot'],
        #         validation_result['message']
        #     )

        # # Determine if the intent (and current slot settings) has been denied.  The messaging will be different
        # # if the user is denying a reservation he initiated or an auto-populated suggestion.
        # if confirmation_status == 'Denied':
        #     # Clear out auto-population flag for subsequent turns.
        #     try_ex(lambda: session_attributes.pop('confirmationContext'))
        #     try_ex(lambda: session_attributes.pop('currentReservation'))
        #     if confirmation_context == 'AutoPopulate':
        #         return elicit_slot(
        #             session_attributes,
        #             intent_request['currentIntent']['name'],
        #             {
        #                 'PickUpCity': None,
        #                 'PickUpDate': None,
        #                 'ReturnDate': None,
        #                 'DriverAge': None,
        #                 'CarType': None
        #             },
        #             'PickUpCity',
        #             {
        #                 'contentType': 'PlainText',
        #                 'content': 'Where would you like to make your car reservation?'
        #             }
        #         )

        #     return delegate(session_attributes, intent_request['currentIntent']['slots'])

        # if confirmation_status == 'None':
        #     # If we are currently auto-populating but have not gotten confirmation, keep requesting for confirmation.
        #     if (not pickup_city and not pickup_date and not return_date and not driver_age and not car_type)\
        #             or confirmation_context == 'AutoPopulate':
        #         if last_confirmed_reservation and try_ex(lambda: last_confirmed_reservation['ReservationType']) == 'Hotel':
        #             # If the user's previous reservation was a hotel - prompt for a rental with
        #             # auto-populated values to match this reservation.
        #             session_attributes['confirmationContext'] = 'AutoPopulate'
        #             return confirm_intent(
        #                 session_attributes,
        #                 intent_request['currentIntent']['name'],
        #                 {
        #                     'PickUpCity': last_confirmed_reservation['Location'],
        #                     'PickUpDate': last_confirmed_reservation['CheckInDate'],
        #                     'ReturnDate': add_days(
        #                         last_confirmed_reservation['CheckInDate'], last_confirmed_reservation['Nights']
        #                     ),
        #                     'CarType': None,
        #                     'DriverAge': None
        #                 },
        #                 {
        #                     'contentType': 'PlainText',
        #                     'content': 'Is this car rental for your {} night stay in {} on {}?'.format(
        #                         last_confirmed_reservation['Nights'],
        #                         last_confirmed_reservation['Location'],
        #                         last_confirmed_reservation['CheckInDate']
        #                     )
        #                 }
        #             )

        #     # Otherwise, let native DM rules determine how to elicit for slots and/or drive confirmation.
        #     return delegate(session_attributes, intent_request['currentIntent']['slots'])

        # # If confirmation has occurred, continue filling any unfilled slot values or pass to fulfillment.
        # if confirmation_status == 'Confirmed':
        #     # Remove confirmationContext from sessionAttributes so it does not confuse future requests
        #     try_ex(lambda: session_attributes.pop('confirmationContext'))
        #     if confirmation_context == 'AutoPopulate':
        #         if not driver_age:
        #             return elicit_slot(
        #                 session_attributes,
        #                 intent_request['currentIntent']['name'],
        #                 intent_request['currentIntent']['slots'],
        #                 'DriverAge',
        #                 {
        #                     'contentType': 'PlainText',
        #                     'content': 'How old is the driver of this car rental?'
        #                 }
        #             )
        #         elif not car_type:
        #             return elicit_slot(
        #                 session_attributes,
        #                 intent_request['currentIntent']['name'],
        #                 intent_request['currentIntent']['slots'],
        #                 'CarType',
        #                 {
        #                     'contentType': 'PlainText',
        #                     'content': 'What type of car would you like? Popular models are '
        #                               'economy, midsize, and luxury.'
        #                 }
        #             )

        #     return delegate(session_attributes, intent_request['currentIntent']['slots'])

    # Booking the car.  In a real application, this would likely involve a call to a backend service.
    # logger.debug('bookCar at={}'.format(reservation))
    # del session_attributes['currentReservationPrice']
    # del session_attributes['currentReservation']
    # session_attributes['lastConfirmedReservation'] = reservation
    # return close(
    #     session_attributes,
    #     'Fulfilled',
    #     {
    #         'contentType': 'PlainText',
    #         'content': 'Thanks, I have placed your reservation.'
    #     }
    # )


# --- Intents ---


def dispatch(intent_request):
    """
    Called when the user specifies an intent for this bot.
    """

    logger.debug('dispatch userId={}, intentName={}'.format(intent_request['userId'], intent_request['currentIntent']['name']))

    intent_name = intent_request['currentIntent']['name']

    # Dispatch to your bot's intent handlers
    if intent_name == 'BookHotel_enIN':
        return book_hotel(intent_request)
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
