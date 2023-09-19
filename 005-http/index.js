const http = require('http');
const url = require('url');

const apiKey = process.env.API_KEY;
const mainURL = process.env.MAIN_URL;

const layoutStart = (`
  <link
    rel="stylesheet" 
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" 
    integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" 
    crossorigin="anonymous"
  />
    <div class="container pt-5">
`);

const layoutEnd = `</div>`

const checkWeatherFormComponent = () => (`
  <div class="container text-center">
    <div class="row">
      <div class="col">
        <form 
          method="POST"
          action="/getweather?city=New York"
        >
          <button type="submit" class="btn btn-primary">Погода в Нью-Йорке</button>
        </form>
      </div>
      <div class="col">
        <form 
          method="POST"
          action="/getweather?city=Moscow"
        >
          <button type="submit" class="btn btn-primary">Погода в Москве</button>
        </form>
      </div>
    </div>
  </div>
`);

const weatherDataComponent = data => {
  if (Object.keys(data).length > 0) {
    return (`
    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">${data.location.name}</h5>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Страна: ${data.location.country}</li>
        <li class="list-group-item">Время: ${data.location.localtime}</li>
        <li class="list-group-item">
          Погода: 
          <img src="${data.current.weather_icons[0]}" class="card-img-top" alt="Иконка погоды">
          ${data.current.weather_descriptions[0]}
        </li>
        <li class="list-group-item">Температура: ${data.current.temperature}</li>
        <li class="list-group-item">Скорость ветра: ${data.current.wind_speed}</li>
        <li class="list-group-item">Давление: ${data.current.pressure}</li>
      </ul>
    </div>
    `);
  }

  return ('');
}

let weatherData = {};

const server = http.createServer((req, res) => {
  const urlParsed = url.parse(req.url, true);
  const { pathname, query } = urlParsed;

  res.setHeader('Content-Type', 'text/html; charset=utf-8;');

  if (pathname === '/' || pathname === '/index') {
    res.write(layoutStart);
    res.write(`<h2>Погода в режиме онлайн</h2>`);
    res.write(checkWeatherFormComponent());
    res.write(weatherDataComponent(weatherData));
    res.write(layoutEnd);
  } else if (pathname === '/getweather') {
    if (query.city) {
      http.get(`${mainURL}?access_key=${apiKey}&query=${query.city}`, response => {
        const { statusCode } = response;
        if (statusCode !== 200) {
          console.log(`statusCode: ${statusCode}`);
          return;
        }
    
        response.setEncoding('utf8');
        let rowData = '';
        response.on('data', (chunk) => rowData += chunk)
        response.on('end', () => {
          const parseData = JSON.parse(rowData);
          weatherData = parseData;
        });
      }).on('error', (err) => {
        console.error(err);
      });

      setTimeout(() => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
      }, 200);
    }
  } else {
    res.statusCode = 404;
    res.write(layoutStart);
    res.write(`<h2>404 | Страница не найдена</h2>`);
    res.write(layoutEnd);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);