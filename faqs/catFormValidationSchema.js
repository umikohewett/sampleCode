import * as Yup from "yup";

let catFormValidationSchema = () => {
  return Yup.object().shape({
    name: Yup.string()
      .min(1, "Must have a character")
      .max(255, "Must be shorter than 255")
     
    
  });
};

export { catFormValidationSchema };
