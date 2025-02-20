<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class DniNieValido implements ValidationRule
{
    public function validate($attribute, $value)
    {
        // Expresiones regulares para DNI y NIE
        $patronDNI = '/^\d{8}[A-Z]$/';
        $patronNIE = '/^[XYZ]\d{7}[A-Z]$/';

        // Si no cumple ningún patrón, es inválido
        if (!preg_match($patronDNI, $value) && !preg_match($patronNIE, $value)) {
            return false;
        }

        // Convertir NIE a formato numérico
        $numero = str_replace(['X', 'Y', 'Z'], ['0', '1', '2'], substr($value, 0, -1));

        // Cálculo de la letra correcta
        $letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
        $letraEsperada = $letras[$numero % 23];

        // Comprobar si la letra final es correcta
        return strtoupper(substr($value, -1)) === $letraEsperada;
    }

    public function message()
    {
        return 'El DNI o NIE no es válido.';
    }
}
