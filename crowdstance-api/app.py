import requests,json,random,threading
from flask import Flask,render_template,request
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)
@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  return response  

class Route(Resource):
  stop_ids={}

  def queryAPIs(self, id):
    id+='-20'
    trip_url = 'https://crowdpolicy.cartodb.com/api/v2/sql?q=SELECT%20trip_id%20FROM%20crowdpolicy.oasa_trips%20WHERE%20route_id=%27' + id + '%27%20LIMIT%2015'
    data = requests.get(trip_url).json()
    if len(data['rows']) < 1:
      return 'Wrong route ID'
    trip_id = data['rows'][14]['trip_id']
    stops_url = 'https://crowdpolicy.cartodb.com/api/v2/sql?q=SELECT%20stop_id%20FROM%20crowdpolicy.oasa_stop_times%20WHERE%20trip_id%20=%20%27' + trip_id + '%27'
    data = requests.get(stops_url).json()
    stops = data['rows']
    stop_url = 'https://atademo.cartodb.com/api/v2/sql?q=SELECT%20stop_lat,stop_lon,stop_name,stop_id%20FROM%20atademo.oasa_stops%20WHERE%20stop_id%20IN%20('
    for stop in stops:
      stop_url += str(stop['stop_id']) +','
    stop_url = stop_url[:-1] +')'
    data = requests.get(stop_url).json()
    stopsInfo = data['rows']
    return stopsInfo

  def addCrowdLoad(self,data):
    if data!='Wrong route ID':
      for i in range(len(data)):
              data[i]['crowdLoad']=Route.stop_ids.get(data[i]['stop_id'])
    return data

  def get(self, id):
    return self.addCrowdLoad(self.queryAPIs(id))

class Main:
  def __init__(self):
    self.getCrowdForecastInStances()
  def getCrowdForecastInStances(self):  
    threading.Timer(10.0, self.getCrowdForecastInStances).start()
    stops_url='https://atademo.cartodb.com/api/v2/sql?q=SELECT%20stop_id%20FROM%20atademo.oasa_stops'
    data = requests.get(stops_url).json()
    stopIDs=[]
    for i in data['rows']:
        stopIDs.append(i['stop_id'])
    ret=dict(zip(stopIDs, [random.random() for i in range(len(stopIDs))]))
    Route.stop_ids=ret

Main()
    
class RouteNames(Resource):
  def get(self):
    routes_url = 'https://atademo.cartodb.com/api/v2/sql?q=SELECT%20route_short_name,route_long_name%20FROM%20atademo.oasa_routes'
    data = requests.get(routes_url).json()
    routes = data['rows']
    return routes
 
api.add_resource(Route, '/api/v1.0/route/<id>')
api.add_resource(RouteNames,'/api/v1.0/route/names')

if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True)
