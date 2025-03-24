import AdminPanel from "../Components/AdminPanel";

const AdminPage = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-blue-900 to-emerald-900 py-20 px-4 sm:px-6 lg:px-8">
      <br></br><br></br>
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <AdminPanel />
    </div>
  );
};

export default AdminPage;