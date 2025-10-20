import { param, validationResult, body } from "express-validator";

// Validaciones
const validarId = () =>
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero mayor a 0");

const validarUsuario = () =>
    body("username")
        .notEmpty()
        .isString()
        .isLength({ min: 3 })
        .withMessage("El username debe tener al menos 3 caracteres")
    body("nombre")
        .notEmpty()
        .isString()
        .isLength({ min: 3 })
        .withMessage("El nombre debe tener al menos 3 caracteres")
    body("apellido")
        .notEmpty()
        .isString()
        .isLength({ min: 3 })
        .withMessage("El apellido debe tener al menos 3 caracteres")
    body("password_hash")
        .isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 0})
        .withMessage("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo")
    body("activo")
        .isBoolean()
        .withMessage("El campo activo debe ser true o false");

const validarRol = () =>
    body("nombre")
        .notEmpty()
        .isString()
        .isLength({ min: 3 })
        .withMessage("El nombre del rol debe tener al menos 3 caracteres");
        
const validarRolId = () =>
    body("rol_id")
        .isInt({ min: 1 })
        .withMessage("El ID del rol debe ser un número entero mayor a 0");

const validarParamRolId = () =>
    param("rol_id")
        .isInt({ min: 1 })
        .withMessage("El ID del rol debe ser un número entero mayor a 0");

const verificarValidaciones = (req, res, next) => {
    // Validar ID
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Falla de validación",
            errors: validacion.array(),
        });
    }
    next();
};

export { validarId, verificarValidaciones, validarUsuario, validarRol, validarRolId, validarParamRolId };