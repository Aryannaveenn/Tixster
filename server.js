// required dependcies for the website
const express = require('express'); //requires express to be installed
const bodyParser = require('body-parser'); //requires body-parser to be installed
const session = require('express-session'); //requires express-session to be stalled
const bcrypt = require('bcrypt'); //requires bcrypt to be installed for hashing in db
const sequelize = require('./.database_models/index'); //requires sequelize for different db functions
const User = require('./.database_models/user.js'); //requires user.js database model to collect/store data
const Event = require('./.database_models/event.js'); //requires event.js database model to collect/store data
const Booking = require('./.database_models/booking.js'); //requires booking.js database model to collect/store data

const app = express(); //using express to run the app


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // show files from public
app.use(session({
  secret: 'secretkey', // Secret key so the session is unqiue
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs'); // using ejs templates with html

// checking if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// sync databases to pages
sequelize.sync().then(() => {
  console.log('Database synchronized');
});

//!! ROUTES & POST FOR PAGES !!

// index page route
app.get('/', async (req, res) => {
  const events = await Event.findAll();
  res.render('index', { events, user: req.session.user });
});

// signup page route
app.get('/signup', (req, res) => res.render('signup'));


// signup form submission POST
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ where: { email } }); // check if the email already exists in the db
  if (userExist) { // email is already signed up then send to new page
    return res.send('Email is already registered');

  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashedPassword });
  res.redirect('/login'); // proceed with signup
});


// login page route
app.get('/login', (req, res) => res.render('login'));

// login form submission POST
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } }); 
  if (user && await bcrypt.compare(password, user.password)) { // finding the login form comparison to the database
    req.session.user = user;
    res.redirect('/'); // if login successful then redirect to index
  } else {
    res.send('Invalid email or password'); // if login details don't corrolate with db
  }
});

// logout route
app.get('/logout', (req, res) => {
  req.session.destroy(); //end session so users need to log back in
  res.redirect('/login'); //route users to login page once bttn clicked
});


// booking tickets submission POST
app.post('/book/:id', isAuthenticated, async (req, res) => {
  const eventId = req.params.id; //get eventid
  const seats = parseInt(req.body.seats); //get num of seats
  const user = req.session.user; // get user id from session

  const event = await Event.findByPk(eventId);
  
  if (event && event.seats >= seats) { //checks if seats are enough
    event.seats -= seats;  // minus eventseats from seats booked
    await event.save();  

    await Booking.create({ // creates a new row in booking db
      userId: user.id,  // fills userId in booking db
      eventId: event.id, // fills eventId in booking db
      seats: seats // fills num of seats in booking db
    });

    res.redirect(`/thanku/${event.id}/${seats}`); //after seats are booked, redirect to thank u page
  } else {
    res.send('Not enough seats available.'); //error message if seats not available
  }
});

//thank u screen route
app.get('/thanku/:eventId/:seats', (req, res) => {
  const { eventId, seats } = req.params;  // get evenid and amount of seats to display

  Event.findByPk(eventId) //find eventid to display
    .then(event => {
      if (event) { //if event exists in db
        res.render('thanku', { event, seats }); //render and redirect to thank u page
      } else {
        res.send('Event not found.'); //error message
      }
    })
    .catch(err => {
      console.error(err);
      res.send('Error processing your request.');
    });
});

// start server
app.listen(443, () => console.log('server is running on http://localhost:443')); // server is run on port 3000


//!! Sample data to db  - only needed when new table created !!
// add sample events to db, can be removed from code after initalising database and adding entries
async function seedEvents() {
  const eventsCount = await Event.count();
  if (eventsCount === 0) { // if there are no events
    await Event.bulkCreate([
      { name: 'Event 1', seats: 100 }, //sample events 
      { name: 'Event 2', seats: 150 },
      { name: 'Event 3', seats: 80 },
      { name: 'Event 4', seats: 60 }, //events may be subject to change and modification in the table in event.js
    ]);
    console.log('Sample events added to the database.');
  }
}

// sync database with step above and add data from above function to seedEvents
sequelize.sync().then(async () => {
  console.log('Database synchronized');
  await seedEvents(); 
});
