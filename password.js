const bcrypt = require('bcrypt');

(async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const password = "bhole123"; // Define your password here
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword);
    } catch (error) {
        console.error('Error hashing password:', error);
    }
})();