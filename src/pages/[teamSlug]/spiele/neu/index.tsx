import EditMatchForm from "@/components/edit-match-form";
import Layout from "@/components/layout";
import Title from "@/components/title";

const CreateMatchPage = () => {
  return (
    <Layout>
      <Title className="mb-6">Neues Spiel</Title>
      <EditMatchForm isCreate />
    </Layout>
  );
};

export default CreateMatchPage;
