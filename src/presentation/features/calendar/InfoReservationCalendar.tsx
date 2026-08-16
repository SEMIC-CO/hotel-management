import { Dialog } from "primereact/dialog";
import type { Dispatch, SetStateAction } from "react";
import type { Reservation } from "./RoomsCalendar";
import { Tag } from "primereact/tag";
import { STATUS_COLORS } from "../../../core/shared/utils/constants";

interface InfoReservationCalendarProps {
  selectedRes: Reservation | null;
  setSelectedRes: Dispatch<SetStateAction<Reservation | null>>;
}

export const InfoReservationCalendar = ({
  selectedRes,
  setSelectedRes,
}: InfoReservationCalendarProps) => {

  
  return (
    <>
      <Dialog
        header="Detalle de Reserva"
        visible={!!selectedRes}
        onHide={() => setSelectedRes(null)}
        style={{ width: "400px" }}
      >
        {selectedRes && (
          <div className="flex flex-col gap-2 text-sm">
            <p>
              <strong>Cliente:</strong> {selectedRes.customer}
            </p>
            <p>
              <strong>Entrada:</strong> {selectedRes.entry_date?.slice(0, 10)}
            </p>
            <p>
              <strong>Salida:</strong> {selectedRes.exit_date?.slice(0, 10)}
            </p>
            <p>
              <strong>Observaciones:</strong> {selectedRes.observations}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <Tag
                value={selectedRes.status}
                className={`mr-1 mb-1 ${STATUS_COLORS[selectedRes.status.replace(/\s+/g, '_').toUpperCase()] || 'bg-slate-400'}`}
              />
            </p>
          </div>
        )}
      </Dialog>
    </>
  );
};
