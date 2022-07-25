import click
import requests
from flask import redirect

def hello_world(request):
    return redirect('https://google.com')
    