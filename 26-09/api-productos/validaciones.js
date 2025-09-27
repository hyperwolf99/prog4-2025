import { param, validationResult } from "express-validator";

// Validaciones
const validarId = () =>
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero mayor a 0");

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

export { validarId, verificarValidaciones };