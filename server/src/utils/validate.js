

export function validateEmail(email) {


    const currentYear = new Date().getFullYear();
    const yearPrefix = currentYear.toString().slice(2);  //last two digits of the year ("24" for 2024)
    const emailYearPrefix = email.slice(0, 2);

    if (parseInt(emailYearPrefix) > parseInt(yearPrefix)) {
        return false;  // Reject the email if the year is greater than the current year
    }

    // Dynamically create the regex pattern to match emails like "24-12345", "25-12345", etc.
    // const emailPattern = new RegExp(`^(${yearPrefix}[0-9]{1})-\\d{5}@g\\.batstate-u\\.edu\\.ph$`);
    
    const emailPattern = /^\d{2}-\d{5}@g\.batstate-u\.edu\.ph$/;
    return emailPattern.test(email);
}

