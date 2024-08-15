const validateMobileNumber = (value) => {
    let isError = "";
    let pattern = "[+][91]{2}[0-9]{10}";
    let regex = new RegExp(pattern);
    if (!regex.test(value)) {
      isError = "Please enter mobile number  in +91XXXXXXXXXX format";
    }
    return isError;
  };
  const validatePhoneNumber = (value) => {
    let isError = "";
    let pattern = "[+][91]{2}[0-9]{10}";
    let regex = new RegExp(pattern);
    if (!regex.test(value)) {
      isError = "Please enter phone number  in +91XXXXXXXXXX format";
    }
    return isError;
  };
  
  const validateLatitude = (latitude) => {
    let isError = "";
    let pattern = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
    let regex = new RegExp(pattern);
    if (!regex.test(latitude)) {
      isError = "The latitude must be between -90 to 90";
    }
    return isError;
  };
  
  const validateLongitude = (longitude) => {
    let isError = "";
    let pattern = /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    let regex = new RegExp(pattern);
    if (!regex.test(longitude)) {
      isError = "The latitude must be between -180 to 180";
    }
    return isError;
  };
  
  const validatePassword = (value) => {
    let isError = "";
    // let pattern = "([@|$|!|%|*|?][A-Z]*[a-z]*[0-9]*)";
    let pattern = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@!%*?])";
    let regex = new RegExp(pattern);
    if (value?.length < 8 || value?.length > 24 || !regex.test(value)) {
      isError =
        "Password rules: 8-24 characters. At least one lower case letter.At least one upper case letter. At least one digit. At least one special character (@$!%*?)";
    }
    return isError;
  };
  
  const validateConfirmPassword = (password, confirmPassword) => {
    let errMsg = "";
    if (password !== confirmPassword) {
      errMsg = "Confirm password not matching with password";
    }
    return errMsg;
  };
  
  const validateEmail = (value) => {
    let isError = "";
    let pattern = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+[.]+[a-zA-Z]{2,6}";
    let regex = new RegExp(pattern);
    if (!regex.test(value)) {
      isError = "Please enter valid email id in xxx@xxx.xx format";
    }
    return isError;
  };
  
  const validateMacAddress = (value) => {
    let isError = "";
    let pattern = "^([0-9A-Fa-f]{2}[:]){5}";
    let regex = new RegExp(pattern);
    if (!regex.test(value)) {
      isError = "Please enter MAC address in  XX:XX:XX:XX:XX:XX format";
    }
    return isError;
  };
  
  const validateNumber = (value) => {
    let isError = "";
    let pattern = "^[0-9]*$";
    let regex = new RegExp(pattern);
    if (!regex.test(value)) {
      isError = "Please enter valid numbers";
    }
    return isError;
  };
  
  
  
  module.exports = {
    validatePhoneNumber,
    validateMobileNumber,
    validatePassword,
    validateEmail,
    validateMacAddress,
    validateConfirmPassword,
    validateLatitude,
    validateLongitude,
    validateNumber,
  };
  