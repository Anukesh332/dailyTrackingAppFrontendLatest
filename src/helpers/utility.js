export const calculateDate = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const convertDate = (dateTime) => {
  if (dateTime && dateTime != "" && dateTime != "null") {
    let date = new Date(dateTime);
    return date.toLocaleDateString();
  } else {
    return "";
  }
};

export function formatDate(inputDate) {
  const date = new Date(inputDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${day}/${month}/${year}`;

  return `${formattedDate}`;
}

export function formatDateSales(inputdate) {
  if (inputdate && inputdate != "") {
    let dateObj = new Date(inputdate);
    let month = getMonth(dateObj);
    let date = getDate(dateObj);
    let currentDate = `${date}/${month}/${dateObj.getFullYear()}`;
    return currentDate;
  } else {
    return inputdate;
  }
};

export function formatDateSearchUsed(inputDate) {
  const parts = inputDate.split('/');
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return formattedDate;
}

export function formatDateFromISO(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateFromISOReverse(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

const getMonth = (dateObj) => {
  let currentMonth =
    dateObj.getMonth() + 1 <= 9
      ? "0" + (dateObj.getMonth() + 1)
      : dateObj.getMonth() + 1;

  return currentMonth;
};

const getDate = (dateObj) => {
  let currDate =
    dateObj.getDate() <= 9 ? "0" + dateObj.getDate() : dateObj.getDate();
  return currDate;
};

export function convertDateForPicker(dateTime) {
  if (dateTime && dateTime != "" && dateTime != "null") {
    let date_obj = new Date(dateTime);
    let month = getMonth(date_obj);
    let date = getDate(date_obj);
    let currentDate = `${month}/${date}/${date_obj.getFullYear()}`;
    return currentDate;
  } else {
    return "";
  }
};

export function convertDateTimetoDateFormat(dateTime) {
  if (dateTime && dateTime != "" && dateTime != "null") {
    let date_obj = new Date(dateTime);
    let month = getMonth(date_obj);
    let date = getDate(date_obj);
    let currentDate = `${date_obj.getFullYear()}-${month}-${date}`;
    return currentDate;
  } else {
    return "";
  }
};

export function getMonthsBetweenDates(obj) {
  const start = new Date(obj.StartDate);
  const end = new Date(obj.EndDate);

  const months = [];
  let currentDate = start;

  while (currentDate <= end) {
    const year = currentDate.getFullYear();
    const month = currentDate.toLocaleString('default', { month: 'short' });

    months.push([`${month}`, `${year}`]);

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return months;
};

export function getDateYear(inputDate) {
  const dateParts = inputDate.split('/');

  if (dateParts.length === 3) {
    const year = dateParts[2];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const monthIndex = parseInt(dateParts[1], 10) - 1;
    let month = months[monthIndex]
    return [`${month}`, `${year}`];
  } else {
    return "";
  }
};

export function isoDateFormat(inputDate) {
  let [day, month, year] = inputDate.split('/');
  let isoDeliveryDate = new Date(`${year}-${month}-${day}`);
  let isoStringDeliveryDate = isoDeliveryDate.toISOString();
  return isoStringDeliveryDate;
};

export function isoToDateFormat(inputDate) {
  let date = new Date(inputDate);
  let day = date.getDate().toString().padStart(2, '0'); 
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let year = date.getFullYear();
  let formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}