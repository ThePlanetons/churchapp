// import { Card } from "@/components/ui/card";
import { Outlet } from "react-router-dom";

export default function Collection() {
  // const [view, setView] = useState("list");
  // const [selectedMember, setSelectedMember] = useState<any>(null);

  return (
    // <Card className="h-full">
      <Outlet />
    // </Card>

    //   {view === "list" && (
    //     <CollectionList
    //       // onAddMember={(memberData) => {
    //       //   setSelectedMember(memberData);
    //       //   setView("add");
    //       // }}
    //     />
    //   )}
    //   {view === "add" && (
    //     <CollectionAdd
    //       onClose={() => setView("list")}
    //       memberData={selectedMember}  // Pass selected member data
    //     />
    //   )}
    //   {/* {view === "configure" && (
    //     <ConfigureMember onClose={() => setView("list")} />
    //   )} */}
  );
}
