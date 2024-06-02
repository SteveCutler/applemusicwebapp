require('dotenv').config();

// Now you can use process.env to access the variables
console.log('Your JWT:', process.env.DEVELOPER_TOKEN);


// MusicKit.configure({
//     developerToken: process.env.DEVELOPER_TOKEN,
//     app: {
//       name: 'Your App Name',
//       build: '1.0.0'
//     }
//   });