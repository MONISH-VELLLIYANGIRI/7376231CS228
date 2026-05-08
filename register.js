const data = {
  email: 'monish.cs23@bitsathy.ac.in',
  name: 'MONISH V',
  mobileNo: '9500266480',
  githubUsername: 'MONISH-VELLLIYANGIRI',
  rollNo: '7376231CS228',
  accessCode: 'uKaJfm'
};

console.log('Sending registration request...');
console.log('Request body:', JSON.stringify(data, null, 2));

fetch('http://4.224.186.213/evaluation-service/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(res => {
  console.log('Response status:', res.status);
  return res.json();
})
.then(json => {
  console.log('\n✅ Registration Response:');
  console.log(JSON.stringify(json, null, 2));
  
  if (json.clientID && json.clientSecret) {
    console.log('\n🎯 SUCCESS! Here are your credentials:');
    console.log('clientID:', json.clientID);
    console.log('clientSecret:', json.clientSecret);
  }
})
.catch(err => console.error('❌ Error:', err.message));
