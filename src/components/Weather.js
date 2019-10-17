import React from 'react'
import {
  Row,
  Col
} from 'react-bootstrap'
import '../css/Weather.css'

class Weather extends React.Component {
  constructor(props) {
    super()

    // Default lat and long
    this.lat = 36.078193399999996;
    this.lon = -94.1901826;
    this.apikey = '5e309b45fc1941bd17f5ec40b712220f'
    this.units = 'imperial'

    this.state = {
      loading: true,
      partOfDay: 'day',
      data: {}
    }
  }
    
  // TODO: Ask for current location and call api based on that
  // refer to this maybe: https://stackoverflow.com/questions/13194623/get-location-when-pages-loads

  componentDidMount() {
    this.getWeather(this.lat, this.lon, this.apikey, this.units)
    this.intervalID = setInterval(() => {
      this.getWeather(this.lat, this.lon, this.apikey, this.units)
      console.log(this.intervalID)
    }, 600000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  getWeather(lat, lon, apikey, units) {
    this.setState((prevState) => {
      return {
        ...prevState,
        loading: true
      }
    }, () => {
      fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&APPID=' + apikey + '&units=' + units)
      .then(response =>  response.json())
      .then(data => {
        this.setState((prevState) =>{
          return {
            ...prevState,
            data: data
          }
        })
        this.setState((prevState) => {
          return {
            ...prevState,
            partOfDay: this.dayOrNight(),
            loading: false
          }
        })
      })
    })
  }

  dayOrNight() {
    var currentTimeUTC =  Date.UTC(this.props.time.getUTCFullYear(), this.props.time.getUTCMonth(),
      this.props.time.getUTCDate(), this.props.time.getUTCHours(),
      this.props.time.getUTCMinutes(), this.props.time.getUTCSeconds());

    if (currentTimeUTC > this.state.data.sys.sunrise &&
        currentTimeUTC < this.state.data.sys.sunset)  {
      // console.log("day")
      return ('day')
    } else {
      // console.log("night")
      return ('night')
      }
  }

  render() {
    return(
      <div className="weather" >
        {this.state.loading ? <p>Loading...</p> : 
          <div>
            <Row>
              <Col className="weather-icon">
                {/* TODO: call dayOrNight() only when getting weather */}
                <i className={ `wi wi-owm-${ this.state.partOfDay  }-${ this.state.data.weather["0"].id }` } ></i>
              </Col>
              <Col className="current-temp">
                <p>{Math.trunc(this.state.data.main.temp)}°</p>
              </Col>
              <Col className='current-status'>
              <p>
                It's {Math.trunc(this.state.data.main.temp)}° and {this.state.data.weather["0"].description} in {this.state.data.name}
              </p>
              </Col>
            </Row>
            <Row>
              {this.state.data && 
                <Col>
                  <i className={ `wind-icon wi wi-wind towards-${ this.state.data.wind.deg }-deg` } ></i>
                  <p className='wind-text'>{ this.state.data.wind.speed } mi/h</p>
                </Col>
              }
              
              <Col className='high-and-low'>
                <Col>
                  <p>
                    High {Math.trunc(this.state.data.main.temp_max)}°
                  </p>
                </Col>
                <Col>
                  <p>
                    Low {Math.trunc(this.state.data.main.temp_min)}°
                  </p>
                </Col>
              </Col>
            </Row>
          </div>
        }         
      </div>
    )
  }
}

export default Weather