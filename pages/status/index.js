import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
      <DependenciesStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    dedupingInterval: 2000,
  });

  let updatedAt = "Carregando...";

  if (!isLoading && data) {
    updatedAt = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <p>Última atualização: {updatedAt}</p>;
}

function DatabaseStatus(properties) {
  console.log(properties);
  let databaseStatusInformation = "Carregando...v";

  databaseStatusInformation = (
    <>
      <ul>
        <li>Versão: {properties.informartion.version}</li>
        <li>Máximo de conexões: {properties.informartion.max_connections}</li>
        <li>Conexões abertas: {properties.informartion.openned_connections}</li>
      </ul>
    </>
  );

  return (
    <>
      <h3>Banco de dados:</h3>
      <div>{databaseStatusInformation}</div>
    </>
  );
}

function DependenciesStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    dedupingInterval: 2000,
  });

  if (isLoading) {
    return <p>Carregando dependências...</p>;
  } else if (data) {
    return (
      <>
        <h2>Dependências:</h2>
        <ul>
          <li>
            <DatabaseStatus informartion={data.dependencies.database} />
          </li>
        </ul>
      </>
    );
  }
}
