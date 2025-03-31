import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema} from "../../../utils/schema.js";
import CustomInput from "./CustomInput";
import { toast } from "react-toastify";
import "./RegistrationForm.css"
import killua from "../../../assets/img/killua.png"
import hxhlogo from "../../../assets/img/hxh-logo.png"
import { z } from "zod";
import {useState} from "react";

/**
 *
 * Formulaire d'inscription avec validation (React Hook Form + Zod),
 * affichage d'erreurs, gestion du localStorage, et toasts de succès/erreur.
 *
 * @component
 * @name RegistrationForm
 * @returns {JSX.Element} Le formulaire d'inscription complet
 */

const RegistrationForm = () => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const formData = watch();

  const allFieldsFilled =
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    formData.email?.trim() &&
    formData.birthDate?.trim() &&
    formData.city?.trim() &&
    formData.postalCode?.trim();

  /**
   * Callback appelé lors de la soumission du formulaire si les données sont valides.
   * @function onSubmit
   * @name onSubmit
   * @param {Object} data - Les données saisies par l'utilisateur.
   */
  const onSubmit = (data) => {
    setHasSubmitted(true);

    localStorage.setItem("userData", JSON.stringify(data));
    toast.success("Formulaire sauvegardé avec succès !");

    reset();

    setHasSubmitted(false);
  };

  /**
   * Callback appelé si des erreurs de validation sont détectées à la soumission.
   * @function onError
   * @name onError
   */
  const onError = () => {
    setHasSubmitted(true);
    toast.error("Veuillez corriger les erreurs.");
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="left-side">
        <div className="image-wrapper">
          <img className="logo" src={hxhlogo} alt="The logo of Hunter x Hunter."/>
          <img className="killua" src={killua} alt="Killua Zoldyck running with a skateboard under his arm."/>
        </div>
      </div>
      <div className="right-side">
        <h1>Register to the Hunter Exam !</h1>
        <div className="form-inputs">
          <CustomInput
            label="Nom"
            name="lastName"
            type="text"
            {...register("lastName")}
            error={(hasSubmitted && touchedFields.lastName) ? errors.lastName?.message : ""}
          />

          <CustomInput
            label="Prénom"
            name="firstName"
            type="text"
            {...register("firstName")}
            error={(hasSubmitted && touchedFields.firstName) ? errors.firstName?.message : ""}
          />

          <CustomInput
            label="Email"
            name="email"
            type="email"
            {...register("email")}
            error={(hasSubmitted && touchedFields.email) ? errors.email?.message : ""}
          />

          <CustomInput
            label="Date de naissance"
            name="birthDate"
            type="date"
            {...register("birthDate")}
            error={(hasSubmitted && touchedFields.birthDate) ? errors.birthDate?.message : ""}
          />

          <CustomInput
            label="Ville"
            name="city"
            type="text"
            {...register("city")}
            error={(hasSubmitted && touchedFields.city) ? errors.city?.message : ""}
          />

          <CustomInput
            label="Code postal"
            name="postalCode"
            type="text"
            {...register("postalCode")}
            error={(hasSubmitted && touchedFields.postalCode) ? errors.postalCode?.message : ""}
          />
        </div>

        <button type="submit" className="submit-button" disabled={!allFieldsFilled}>
          JOIN !
        </button>
      </div>
    </form>
  );
}

export default RegistrationForm;