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
  return true;
}
