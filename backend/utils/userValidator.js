const {check, validationResult} = require("express-validator")

exports.validateUser = [
    check('fname').escape()
    .not()
    .isEmpty()
    .withMessage('First name cannot be empty!')
    .bail()
    .isLength({min: 3})
    .withMessage('Minimum 3 characters required!')
    .bail(),
    check('lname').escape()
    .not()
    .isEmpty()
    .withMessage('Last name can not be empty!')
    .bail()
    .isLength({min: 3})
    .withMessage('Minimum 3 characters required!')
    .bail(),
    check('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email name can not be empty!")
    .bail()
    .isEmail()
    .withMessage("Invalid email address!")
    .bail(),
    (req,res,next) => {
        const err = validationResult(req)
        if (!err.isEmpty())
            return res.status(422).json({errors: err.array()});
        next();
    }
]


