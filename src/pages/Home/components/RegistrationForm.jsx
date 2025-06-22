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
 * envoi vers l'API FastAPI, et toasts de succès/erreur.
 *
 * @component
 * @name RegistrationForm
 * @param {Function} onUserRegistered - Callback appelé quand un utilisateur s'inscrit avec succès
 * @returns {JSX.Element} Le formulaire d'inscription complet
 */

const RegistrationForm = ({ onUserRegistered }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:8000";

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
   * Envoie les données à l'API FastAPI.
   * @function onSubmit
   * @name onSubmit
   * @param {Object} data - Les données saisies par l'utilisateur.
   */
  const onSubmit = async (data) => {
    setHasSubmitted(true);
    setIsSubmitting(true);

    try {
      // Convertir les noms de champs pour correspondre à l'API
      const apiData = {
        last_name: data.lastName,
        first_name: data.firstName,
        email: data.email,
        birth_date: data.birthDate,
        city: data.city,
        postal_code: data.postalCode
      };

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || "Inscription réussie !");
        reset();
        
        // Appeler le callback avec les données de l'utilisateur créé
        if (onUserRegistered) {
          onUserRegistered({
            id: result.user_id || Date.now(), // Fallback si l'API ne retourne pas d'ID
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            birth_date: data.birthDate,
            city: data.city,
            postal_code: data.postalCode,
            role: 'user' // Rôle par défaut pour les nouveaux utilisateurs
          });
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
      setHasSubmitted(false);
    }
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
    <form className="registration-form" noValidate onSubmit={handleSubmit(onSubmit, onError)}>
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

        <button 
          type="submit" 
          className="submit-button" 
          disabled={!allFieldsFilled || isSubmitting}
        >
          {isSubmitting ? "ENVOI..." : "JOIN !"}
        </button>
      </div>
    </form>
  );
}

export default RegistrationForm;