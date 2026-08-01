import { Card } from "primereact/card";
import { Form } from "../../components/ui/Forms/Form";
import type { IField, IPropsSave } from "../../../core/shared/types/forms";
import * as Yup from "yup";
import { useUsersStore } from "../../../infrastructure/stores/user.store";
import { Toast } from "primereact/toast";
import { useToast } from "../../hooks/useToast";
import { useUser } from "../../hooks/useUser";
import { useContainer } from "../../hooks/useContainer";
import { useState } from "react";
import type { FormikHelpers } from "formik";

export const FormUpdatePassword = () => {
  const { toast, showToast } = useToast();
  const user = useUser();
  const { settingsRepository } = useContainer();
  const [isPassVerified, setIsPassVerified] = useState(false);

  const handleSave = (_form: IPropsSave, formik?: FormikHelpers<any>) => {
    if (!isPassVerified) {
      formik?.setFieldError("password_current", "Contraseña incorrecta");
      return;
    }
    const { values, setLoading } = _form;
    setLoading(true);
    settingsRepository
      .updatePassword(user.user_id, { password: values.password })
      .then((resp) => {
        if (resp.ok) {
          showToast("La contraseña se ha actualizado correctamente", "success");
        } else {
          showToast(
            "Error al actualizar la contraseña: " + resp.message,
            "error",
          );
        }
      })
      .finally(() => setLoading(false));
  };

  const validatePassword = (value: string, formik: FormikHelpers<any>) => {
    const data = {
      id: user.user_id,
      password: value,
    };
    if (value !== "") {
      settingsRepository.verifyPassword(data).then((resp) => {
        if (!resp.ok) {
          setIsPassVerified(false);
          formik.setFieldError("password_current", "Contraseña incorrecta");
        } else {
          setIsPassVerified(true);
        }
      });
    }
  };

  const fields: IField[] = [
    {
      label: "Contraseña actual",
      name: "password_current",
      type: "password",
      onBlur: (e, formik) => validatePassword(e.target.value, formik),
    },
    {
      label: "Contraseña nueva",
      name: "password",
      type: "password",
    },
    {
      label: "Confirmar contraseña",
      name: "password_confirm",
      type: "password",
    },
  ];

  const validationSchema = Yup.object({
    password_current: Yup.string().required("Requerido"),
    password: Yup.string().required("Requerido"),
    password_confirm: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Las contraseñas deben coincidir")
      .required("Requerido"),
  });
  return (
    <>
      <Card>
        <h2 className="font-bold text-lg">Cambiar contraseña</h2>
        <Toast ref={toast} />
        <Form
          type="normal"
          handleSave={handleSave}
          fields={fields}
          validationSchema={validationSchema}
          useStoreForm={useUsersStore}
        />
      </Card>
    </>
  );
};
