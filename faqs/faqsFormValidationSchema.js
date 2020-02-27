import * as Yup from "yup";

let faqsFormValidationSchema = () => {
  return Yup.object().shape({
    question: Yup.string()
      .min(1, "Must have a character")
      .max(255, "Must be shorter than 255")
      .required("Must Enter a Question"),
    answer: Yup.string()
      .min(1, "Must have a character")
      .max(2000, "Must be shorter than 2000")
      .required("Must enter an Answer"),
    faqCategory: Yup.number()
      .min(1, "Must have a character")
      .max(999, "Must be shorter than 999")
      .required("Selection Required "),
    sortOrder: Yup.number()
      .min(1, "Must have a character")
      .max(999, "Must be shorter than 999")
      .required("Needs a Sort Order Number")
  });
};

export { faqsFormValidationSchema };
