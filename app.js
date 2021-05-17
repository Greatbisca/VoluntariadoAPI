const express = require('express');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const mongoose = require('mongoose');
const {MONGO_URI} = require('./mongodb');
const routes = require('./routes/routes');
const PORT = process.env.PORT || 3000;

//BodyParser Middleware
app.use(express.json());

//connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(()=> console.log('MongoDB connected'))
    .catch(err => console.log(err))

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Voluntariado API",
      version: '1.0.0',
    },
  },
  apis: ['./routes/routes.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//User routes
app.use('/', routes);

app.listen(PORT, () => console.log(`Server run at port ${PORT}`));
