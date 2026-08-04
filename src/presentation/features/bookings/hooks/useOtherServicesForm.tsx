import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useFormikContext, type FormikContextType } from "formik";
import type {
  IField,
  IPropsSave,
  IShow,
} from "../../../../core/shared/types/forms";
import type { IOtherService, IOtherServicesPayload } from "../../../../core/shared/types/data";
import { useToast } from "../../../hooks/useToast";
import { useContainer } from "../../../hooks/useContainer";
import {
  useOtherServicesStore,
  type OtherServicesFormValues,
} from "../../../../infrastructure/stores/otherServices.store";
import { Button } from "primereact/button";
import { List } from "../../../components/ui/DataTable/List";
import type { IColumns } from "../../../../core/shared/types/datalist";
import { getApiErrorMessage } from "../../../../infrastructure/api/client/httpClient";

type OtherServiceRow = OtherServicesFormValues & { key: number };

// Se renderiza dentro del arbol de Formik (section del Form), por eso
// puede leer los valores actuales del formulario con useFormikContext.
const AddServiceButton = ({
  onAdd,
  editing,
}: {
  onAdd: (formik: FormikContextType<OtherServicesFormValues>) => void;
  editing: boolean;
}) => {
  const formik = useFormikContext<OtherServicesFormValues>();
  return (
    <Button
      type="button"
      icon={editing ? "pi pi-check" : "pi pi-plus"}
      label={editing ? "Actualizar" : "Agregar"}
      aria-label={editing ? "Actualizar servicio" : "Agregar servicio"}
      onClick={() => onAdd(formik)}
    />
  );
};

const ServiceActions = ({
  rowData,
  onEdit,
  onDelete,
}: {
  rowData: OtherServiceRow;
  onEdit: (
    rowData: OtherServiceRow,
    formik: FormikContextType<OtherServicesFormValues>,
  ) => void;
  onDelete: (rowData: OtherServiceRow) => void;
}) => {
  const formik = useFormikContext<OtherServicesFormValues>();

  return (
    <div className="flex gap-5 justify-content-center">
      <i
        className="pi pi-pencil cursor-pointer"
        onClick={() => onEdit(rowData, formik)}
      />
      <i
        className="pi pi-trash cursor-pointer"
        onClick={() => onDelete(rowData)}
      />
    </div>
  );
};

export const useOtherServicesForm = ({
  onActionForm,
  setShowForm,
}: Omit<IShow, "showForm">) => {
  const { bookingRepository } = useContainer();

  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<OtherServiceRow[] | IOtherService[] >([]);
  const [editingServiceKey, setEditingServiceKey] = useState<number | null>(
    null,
  );

  const { resetState } = useOtherServicesStore();
  const booking_id = useOtherServicesStore((state) => state.values.booking_id);
  
  useEffect(() => {
    if (!booking_id) return;
    bookingRepository
      .getOtherServices(`?booking_id=${booking_id}`)
      .then((resp) => {
        if (!resp) {
          showToast("No se pudieron cargar los servicios.", "error");
          return;
        }
        setServices(resp ?? []);
      })
      .catch((error) => {
        showToast(
          getApiErrorMessage(error, "No se pudieron cargar los servicios."),
          "error",
        );
      });
  }, [booking_id]);

  // El Guardar del Form llega aqui sin validacion de campos: los valores
  // del formulario llegan vacios, la data a guardar es la lista `services`
  const handleSave = useCallback(
    ({
      values,
      setLoading: setFormLoading,
    }: IPropsSave<OtherServicesFormValues>) => {
      if (services.length === 0) {
        showToast("Debe agregar al menos un servicio", "error");
        return;
      }
      const { center_id, company_id, created_by } = values;
      const data: IOtherServicesPayload = {
        center_id,
        company_id,
        created_by,
        booking_id,
        other_services: services,
      };
      console.log("handleSave data", data);

      setFormLoading(true);
      setLoading(true);

      bookingRepository
        .saveOtherServices(data)
        .then((resp) => {
          if (resp.ok) {
            resetState();
            setServices([]);
            setShowForm(false);
            onActionForm?.(resp.data);
            showToast(
              resp.message ?? "Se registraron los servicios correctamente!",
              "success",
            );
            return;
          }

          showToast(
            `Error al registrar los servicios, ${resp.message ?? "intente nuevamente"}`,
            "error",
          );
        })
        .catch((error) => {
          showToast(
            getApiErrorMessage(
              error,
              "No se pudieron registrar los servicios.",
            ),
            "error",
          );
        })
        .finally(() => {
          setFormLoading(false);
          setLoading(false);
        });
    },
    [
      services,
      bookingRepository,
      booking_id,
      onActionForm,
      setShowForm,
      resetState,
      showToast,
    ],
  );

  const editRow = (
    rowData: OtherServiceRow,
    formik: FormikContextType<OtherServicesFormValues>,
  ) => {
    const { key: _key, ...serviceValues } = rowData;

    // Este hook se ejecuta fuera de <Formik>; por eso el contexto se recibe
    // desde ServiceActions, que si se renderiza dentro del formulario.
    formik.setValues(serviceValues, false);
    formik.setTouched({}, false);
    formik.setErrors({});
    setEditingServiceKey(rowData.key);
  };

  const deleteRow = (rowData: OtherServiceRow) => {
    setServices((prev) =>
      prev.filter((service) => service.key !== rowData.key),
    );
    if (editingServiceKey === rowData.key) {
      setEditingServiceKey(null);
    }
  };

  const bodyTemplateActions = (rowData: OtherServiceRow) => {
    return (
      <ServiceActions rowData={rowData} onEdit={editRow} onDelete={deleteRow} />
    );
  };

  const buttonsAddSection = () => {
    return (
      <div className="flex gap-1">
        <AddServiceButton
          onAdd={addService}
          editing={editingServiceKey !== null}
        />
      </div>
    );
  };

  const calculateTotalValue = (
    _event: unknown,
    formik?: Pick<
      FormikContextType<OtherServicesFormValues>,
      "values" | "setFieldValue"
    >,
  ) => {
    if (!formik) return;
    
    const { quantity, unit_value: unitValue } = formik.values;
    
    console.log("calculateTotalValue", formik.values);
    
    if (Number.isFinite(Number(quantity)) && Number.isFinite(unitValue)) {
      formik.setFieldValue("total_value", Number(quantity) * unitValue);
    }
  };

  const baseFields: IField[] = [
    {
      label: "Fecha del servicio",
      name: "service_date",
      type: "date",
    },
    {
      label: "Nombre del servicio",
      name: "service_name",
      type: "text",
    },
    {
      label: "Cantidad",
      name: "quantity",
      type: "text",
      keyfilter: "int",
      onBlur: calculateTotalValue,
    },
    {
      label: "Valor unitario",
      name: "unit_value",
      type: "number",
      onBlur: calculateTotalValue,
    },
    {
      label: "Valor total",
      name: "total_value",
      type: "number",
      disabled: true,
    },
    {
      label: "Observaciones",
      name: "observations",
      type: "textArea",
    },
  ];

  // Recibe el formik desde AddServiceButton: valida con el validationSchema
  // (Yup), agrega los valores al listado y limpia para el siguiente servicio.
  // El schema NO esta registrado en Formik (para que el boton Guardar no
  // valide los campos vacios), por eso se valida manualmente aqui.
  const addService = async (
    formik: FormikContextType<OtherServicesFormValues>,
  ) => {
    try {
      await validationSchema.validate(formik.values, { abortEarly: false });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) errors[err.path] = err.message;
        });

        // No se debe validar al marcar los campos como tocados: este schema
        // no se registra en el Formik principal para no bloquear "Guardar".
        // Si se valida en ese momento, Formik reemplaza los errores manuales
        // por un objeto vacio antes de que los campos puedan mostrarlos.
        formik.setTouched(
          baseFields.reduce<Record<string, boolean>>((touched, field) => {
            touched[field.name] = true;
            return touched;
          }, {}),
          false,
        );
        formik.setErrors(errors);
      }
      return;
    }

    if (editingServiceKey !== null) {
      setServices((prev) =>
        prev.map((service) =>
          service.key === editingServiceKey
            ? { ...formik.values, key: service.key }
            : service,
        ),
      );
      setEditingServiceKey(null);
    } else {
      setServices((prev) => [
        ...prev,
        { ...formik.values, key: new Date().getTime() },
      ]);
    }
    // Vuelve a los valores iniciales del store (resetea valores, touched y errores)
    formik.resetForm();
    // La fecha del store se calcula al cargar la app: se actualiza a "ahora"
    formik.setFieldValue("service_date", dayjs().format("YYYY-MM-DD HH:mm:ss"));
  };

  const columns: IColumns[] = [
    {
      label: "Acciones",
      name: "actions",
      body: bodyTemplateActions,
    },
    ...baseFields,
  ];

  const fields: IField[] = [
    ...baseFields,
    {
      type: "section",
      label: "",
      name: "list_other_services",
      addButtons: buttonsAddSection,
      component: <List data={services} columns={columns} size="small" />,
    },
  ];

  const validationSchema = Yup.object({
    service_date: Yup.string().required("Requerido"),
    service_name: Yup.string().required("Requerido"),
    quantity: Yup.number()
      .moreThan(0, "Debe ser mayor a 0")
      .required("Requerido"),
    unit_value: Yup.number()
      .moreThan(0, "Debe ser mayor a 0")
      .required("Requerido"),
    total_value: Yup.number()
      .moreThan(0, "Debe ser mayor a 0")
      .required("Requerido"),
    observations: Yup.string(),
  });

  return {
    toast,
    loading,
    handleSave,
    validationSchema,
    fields,
  };
};
