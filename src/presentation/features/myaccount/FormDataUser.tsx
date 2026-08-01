import { Card } from "primereact/card";
import { Form } from "../../components/ui/Forms/Form";
import type { IField, IPropsSave } from "../../../core/shared/types/forms";
import * as Yup from "yup";
import { useEffect } from "react";
import { useFormikContext } from "formik";
import {
  useUsersStore,
  type UsersFormValues,
} from "../../../infrastructure/stores/user.store";
import type { IUsers } from "../../../core/shared/types/data";
import { useUser } from "../../hooks/useUser";
import { useContainer } from "../../hooks/useContainer";
import { useToast } from "../../hooks/useToast";
import { Toast } from "primereact/toast";

interface UserFormInitializerProps {
  user: IUsers;
}

const UserFormInitializer = ({ user }: UserFormInitializerProps) => {
  const { setFieldValue } = useFormikContext<UsersFormValues>();

  useEffect(() => {
    setFieldValue("names", user.names);
    setFieldValue("surnames", user.surnames);
    setFieldValue("email", user.username);
    setFieldValue("cell_phone", String(user.cell_phone));
    setFieldValue("address", user.address);
  }, [setFieldValue, user]);

  return null;
};

export const FormDataUser = () => {
  const { toast, showToast } = useToast();
  const user = useUser();
  const { settingsRepository } = useContainer();

  const handleSave = (form: IPropsSave<UsersFormValues>) => {
    const { values, setLoading } = form;
    const userData: IUsers & { state: string } = {
      ...user,
      key: user.key ?? user.user_id,
      state: "Activo",
      names: values.names,
      surnames: values.surnames,
      email: values.email,
      username: values.email,
      cell_phone: Number(values.cell_phone),
      address: values.address,
    };

    setLoading(true);
    settingsRepository.saveUsers(userData).then((resp) => {
      setLoading(false);
      if (resp.ok) {
        showToast("El usuario se ha actualizado correctamente", "success");
      } else {
        showToast("Error al actualizar el usuario: " + resp.message, "error");
      }
      return;
    });
  };

  const fields: IField[] = [
    {
      label: "Nombres",
      name: "names",
      type: "text",
    },
    {
      label: "Apellidos",
      name: "surnames",
      type: "text",
    },
    {
      label: "No Celular",
      name: "cell_phone",
      type: "text",
      keyfilter: "int",
    },
    {
      label: "E-mail / Usuario",
      name: "email",
      type: "text",
    },
    {
      label: "Dirección",
      name: "address",
      type: "text",
    },
  ];

  const validationSchema = Yup.object({
    names: Yup.string().required("Requerido"),
    surnames: Yup.string().required("Requerido"),
    cell_phone: Yup.string().required("Requerido"),
    email: Yup.string().email("E-mail no valido").required("Requerido"),
  });
  return (
    <>
      <Card>
        <h2 className="font-bold text-lg">Datos de usuario</h2>
        <p>Información de la cuenta del usuario.</p>
        <Toast ref={toast} />
        <Form
          type="normal"
          handleSave={handleSave}
          fields={fields}
          validationSchema={validationSchema}
          useStoreForm={useUsersStore}
        >
          <UserFormInitializer user={user} />
        </Form>
      </Card>
    </>
  );
};
