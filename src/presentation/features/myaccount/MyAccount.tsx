import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { useUser } from "../../hooks/useUser";
import { FormDataUser } from "./FormDataUser";
import { FormUpdatePassword } from "./FormUpdatePassword";

export const MyAccount = () => {
  const user = useUser();
  console.log("user", user);
  return (
    <section className="flex flex-row gap-2 text-left">
      <Card>
        <div className="flex flex-row gap-2">
          <Avatar
            label={user.names[0] + user.surnames[0]}
            style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
            size="xlarge"
            shape="circle"
          />
          <div className="text-left">
            <h2 className="font-bold text-lg">
              {user.names + " " + user.surnames}
            </h2>
            <p>{user.username}</p>
          </div>
        </div>
      </Card>
      <FormDataUser />
      <FormUpdatePassword />
    </section>
  );
};
