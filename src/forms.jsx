import { useContext, useEffect, useState } from "react";
import {MainContext} from "./contexts";


export function validate(setState, fieldId, fieldValue, validators) {
    for (const validator of validators) {
        const [valid, errorMessage] = validator(fieldValue);

        if (!valid) {
            setState((prev) => {
                const invalidFields = new Map(prev.invalidFields);
                invalidFields.set(fieldId, errorMessage);
                return { ...prev, invalidFields };
            });
            return;
        }
    }
    setState((prev) => {
        const invalidFields = new Map(prev.invalidFields);
        invalidFields.delete(fieldId);
        return { ...prev, invalidFields };
    });
}

const Fields = {
    Email: "email",
    Password: "password",
    ConfirmPassword: "confirmPassword",
    Country: "country",
    PasswordLog: "passwordLog",
    EmailLog: 'emailLog',


};

export function required(value) {
    const valid = !!value;
    return [valid, valid ? "" : "Câmpul este obligatoriu!"];
}

const minThreeLetters = (value) => {
    const valid = value.length >= 3;
    return [valid, valid ? "" : "Câmpul trebuie să aibă minim 3 litere!"];
};

// const emailValidation = (value) => {
//   var mailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const valid = value.match(mailFormat);
//   return [
//     valid,
//     valid ? "" : "Câmpul trebuie să fie de tipul exemplu@exemplu.exemplu!",
//   ];
// };

const phoneValidation = (value) => {
    const phoneFormat =
        /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/;
    const valid = value.match(phoneFormat);
    return [valid, valid ? "" : "Formatul telefonului este gresit!"];
};

export function useRegisterForm() {
    const { state, setState } = useContext(MainContext);

    const sameAsPassword = (value) => {
        const valid = value === state.register.password;
        return [valid, valid ? "" : "Câmpul trebuie să fie la fel ca parola!"];
    };

    useEffect(() => {
        validate(setState, Fields.Email, state.register?.email, [required]);
        validate(setState, Fields.Password, state.register?.password, [required]);
        validate(setState, Fields.Password, state.register?.confirmPassword, [required]);
        validate(setState, Fields.Password, state.register?.country, [required]);
    }, []);

    return {
        [Fields.Email]: {
            value: state.register?.email,
            onChange: (email) => {
                validate(setState, Fields.Email, email, [required]);
                setState((prev) => {
                    return { ...prev, register: { ...prev.register, email } };
                });
                console.log(state.invalidFields);
            },
            error: state.invalidFields.get(Fields.Email),
        },
        [Fields.Password]: {
            value: state.register?.password,
            onChange: (password) => {
                validate(setState, Fields.Password, password, [required, minThreeLetters]);
                setState((prev) => {
                    return { ...prev, register: { ...prev.register, password } };
                });
            },
            error: state.invalidFields.get(Fields.Password),
        },

        [Fields.ConfirmPassword]: {
            value: state.register?.confirmPassword,
            onChange: (confirmPassword) => {
                validate(setState, Fields.ConfirmPassword, confirmPassword, [
                    required,
                    sameAsPassword,
                ]);
                setState((prev) => {
                    return { ...prev, register: { ...prev.register, confirmPassword } };
                });
            },
            error: state.invalidFields.get(Fields.ConfirmPassword),
        },
        [Fields.Country]: {
            value: state.register?.country,
            onChange: (country) => {
                validate(setState, Fields.Country, country, [required]);
                setState((prev) => {
                    return { ...prev, register: { ...prev.register, country } };
                });
            },
            error: state.invalidFields.get(Fields.Country),
        },
    };
}

export function useLogin() {
    const { state, setState } = useContext(MainContext);

    useEffect(() => {
        validate(setState, Fields.EmailLog, state.login?.email, [required]);
        validate(setState, Fields.PasswordLog, state.login?.password, [required]);
    }, []);
    return {
        [Fields.Email]: {
            value: state.login?.email,
            onChange: (email) => {
                validate(setState, Fields.EmailLog, email, [required]);
                setState((prev) => {
                    return { ...prev, login: { ...prev.login, email } };
                });
                console.log(state.invalidFields);
            },
            error: state.invalidFields.get(Fields.EmailLog),
        },
        [Fields.Password]: {
            value: state.login?.password,
            onChange: (password) => {
                validate(setState, Fields.PasswordLog, password, [required]);
                setState((prev) => {
                    return { ...prev, login: { ...prev.login, password } };
                });
            },
            error: state.invalidFields.get(Fields.PasswordLog),
        },

    };
}
