import { z } from "zod";

export const registrationSchema = z.object({
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ \-']+$/, "Nom invalide"),
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ \-']+$/, "Prénom invalide"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide"),
  birthDate: z
    .string()
    .refine((val) => {
      const today = new Date();
      const birth = new Date(val);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age >= 18;
    }, {
      message: "Vous devez avoir au moins 18 ans",
    }),
  city: z.string().min(1, "La ville est requise"),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "Code postal invalide"),
});