import { describe, test, expect } from "vitest";
import { registrationSchema } from "../schema";

const validData = {
  firstName: "Jean",
  lastName: "Dupont",
  email: "jean.dupont@example.com",
  birthDate: "1995-05-05",
  city: "Paris",
  postalCode: "75000",
};

describe("registrationSchema - cas valides", () => {
  test("accepte un prénom avec tréma", () => {
    const result = registrationSchema.safeParse({
      ...validData,
      firstName: "Loïse",
    });
    expect(result.success).toBe(true);
  });

  test("accepte un prénom avec tiret", () => {
    const result = registrationSchema.safeParse({
      ...validData,
      firstName: "Marie-Hélène",
    });
    expect(result.success).toBe(true);
  });

  test("accepte un prénom avec apostrophe", () => {
    const result = registrationSchema.safeParse({
      ...validData,
      firstName: "D'Artagnan",
    });
    expect(result.success).toBe(true);
  });

  test("valide des données complètes et correctes", () => {
    const result = registrationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe("registrationSchema - cas invalides", () => {
  test("rejette un prénom vide", () => {
    const result = registrationSchema.safeParse({ ...validData, firstName: "" });
    expect(result.success).toBe(false);
    expect(result.error.format().firstName._errors[0]).toBe("Le prénom est requis");
  });

  test("rejette un prénom avec des chiffres", () => {
    const result = registrationSchema.safeParse({ ...validData, firstName: "Jean123" });
    expect(result.success).toBe(false);
    expect(result.error.format().firstName._errors[0]).toBe("Prénom invalide");
  });

  test("rejette un nom avec symbole interdit", () => {
    const result = registrationSchema.safeParse({ ...validData, lastName: "Dupont!" });
    expect(result.success).toBe(false);
    expect(result.error.format().lastName._errors[0]).toBe("Nom invalide");
  });

  test("rejette un email mal formaté", () => {
    const result = registrationSchema.safeParse({ ...validData, email: "pasunemail" });
    expect(result.success).toBe(false);
    expect(result.error.format().email._errors[0]).toBe("Email invalide");
  });

  test("rejette un code postal invalide", () => {
    const result = registrationSchema.safeParse({ ...validData, postalCode: "1234" });
    expect(result.success).toBe(false);
    expect(result.error.format().postalCode._errors[0]).toBe("Code postal invalide");
  });

  test("rejette un utilisateur de moins de 18 ans", () => {
    const result = registrationSchema.safeParse({ ...validData, birthDate: "2010-01-01" });
    expect(result.success).toBe(false);
    expect(result.error.format().birthDate._errors[0]).toBe("Vous devez avoir au moins 18 ans");
  });
});