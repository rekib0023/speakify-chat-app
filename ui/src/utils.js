const capitalize = (s) => {
  return s && s[0].toUpperCase() + s.slice(1);
};

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}


export { capitalize, isValidEmail };
