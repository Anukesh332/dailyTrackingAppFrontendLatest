export default function validate(files, error) {

  let isValid = true;
  try {

    let format = process.env.REACT_APP_SPECIAL_CHARACTERS;
    let allowedExtensions = process.env.REACT_APP_FILE_EXTENSIONS;
    let max_file_size = process.env.REACT_APP_MAX_FILE_SIZE;
    let Filetype = files.name.slice((Math.max(0, files.name.lastIndexOf(".")) || Infinity) + 1)

    let fileValid = files;

    if (fileValid.length > 1) {
      isValid = false;
      error.push("Only 1 file is allowed, please remove some files. ");
      return { isValid: isValid, error: error };
    }

    if (Filetype=="" || (!allowedExtensions.includes(Filetype) && error?.length <= 0)) {
      isValid = false;
      error.push("Unsupported file format. ");
    }
    if (format.split("").some((char) => files.name.includes(char))) {
      isValid = false;
      error.push("File name contains special characters. ");
    }
    if (files.name.match(/\./g).length !== 1 && error?.length <= 0) {
      isValid = false;
      error.push("File name contains more than one dot. ");
    }


    if (files.size > max_file_size && error?.length <= 0) {
      isValid = false;
      error.push("File size is greater than 5 MB.");
    }
  } catch (err) {
    console.log("err", err);
  }
  return { isValid: isValid, error: error };
}


