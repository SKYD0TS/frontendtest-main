import Image from "next/image";
import "./style.css";
import Form from "@/components/form";
import Datatable from "@/components/datatable";

export default function Home() {
  const formcols = [
    { name: "username", type: "text", model: "text" },
    { name: "password", type: "text", model: "number" },
  ];

  const tablecols = [
    { name: "username", title: "Username" },
    { name: "password", title: "Password" },
  ];

  const data = [
    { username: "aw", password: "password" },
    { username: "an", password: "password" },
  ];

  return (
    <main>
      <div>
        <Form columns={formcols} />
      </div>
      <div>
        <Datatable columns={tablecols} data={data} />
      </div>
    </main>
  );
}
