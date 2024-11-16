

export function validateEmail(email) {
    const emailPattern = /^\d{2}-\d{5}@g\.batstate-u\.edu\.ph$/;
    return emailPattern.test(email);
}

