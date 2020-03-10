const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const routes = require('./routes');

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(config.mongoURL, (error) => {
  if (error) {
      console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
      throw error;
    }
    console.log('Connected to MongoDB'); // eslint-disable-line

    if (typeof cb === 'function') {
      cb();
    }
});

app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use('/api', routes);

app.listen(port, () => console.log(`Server is listening on port ${port}!`))