import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema} from "../../../utils/schema.js";
import CustomInput from "./CustomInput";
import { toast } from "react-toastify";
import { z } from "zod";
import {useState} from "react";

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

  const onSubmit = (data) => {
    setHasSubmitted(true);

    localStorage.setItem("userData", JSON.stringify(data));
    toast.success("Formulaire sauvegardé avec succès !");

    reset();

    setHasSubmitted(false);
  };

  const onError = () => {
    setHasSubmitted(true);
    toast.error("Veuillez corriger les erreurs.");
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit, onError)}>
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

      <button type="submit" disabled={!allFieldsFilled}>
        Sauvegarder
      </button>
    </form>
  );
}

export default RegistrationForm;