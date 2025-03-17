const AdminCard = ({ title, icon }: { title: string; icon: React.ReactNode }) => {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105">
        <div className="text-blue-500 text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
    );
  };
  
  export default AdminCard;
  