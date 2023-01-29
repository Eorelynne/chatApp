export function checkPassword(password) {
  //minst 8 tecken, minst en stor bokstav och en som inte är bokstav.
  console.log(password);
  let regexp = "^(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?0-9])";
  let isPasswordApproved = false;
  if (password.length < 8 || !password?.match(regexp)) {
    return isPasswordApproved;
  }

  isPasswordApproved = true;
  return isPasswordApproved;
}

export function checkEmail(email) {
  console.log(email);
  let mailformat =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email.match(mailformat)) {
    return true;
  }
}
